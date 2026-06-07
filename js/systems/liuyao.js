/**
 * 六爻占卜系统
 *
 * 六爻纳甲筮法，起源于西汉京房。
 * 核心流程：起卦 → 装卦（纳甲/纳支/六亲/世应）→ 断卦
 *
 * 本文件内置基础六十四卦数据；完整卦爻辞请参考 ../data/hexagrams.js
 */

// ==================== 基础数据 ====================

// 八卦
const BA_GUA = {
  '乾': { nature: '天', wuxing: '金', yao: ['阳', '阳', '阳'], num: 1, direction: '西北' },
  '兑': { nature: '泽', wuxing: '金', yao: ['阴', '阳', '阳'], num: 2, direction: '西' },
  '离': { nature: '火', wuxing: '火', yao: ['阳', '阴', '阳'], num: 3, direction: '南' },
  '震': { nature: '雷', wuxing: '木', yao: ['阴', '阴', '阳'], num: 4, direction: '东' },
  '巽': { nature: '风', wuxing: '木', yao: ['阳', '阳', '阴'], num: 5, direction: '东南' },
  '坎': { nature: '水', wuxing: '水', yao: ['阴', '阳', '阴'], num: 6, direction: '北' },
  '艮': { nature: '山', wuxing: '土', yao: ['阴', '阴', '阴'], num: 7, direction: '东北' },
  '坤': { nature: '地', wuxing: '土', yao: ['阳', '阴', '阴'], num: 8, direction: '西南' }
};

// 八卦纳支（初爻→上爻）：乾/震 同，其余各不相同
const GUA_NAZHI = {
  '乾': ['子', '寅', '辰', '午', '申', '戌'],
  '震': ['子', '寅', '辰', '午', '申', '戌'],
  '坎': ['寅', '辰', '午', '申', '戌', '子'],
  '艮': ['辰', '午', '申', '戌', '子', '寅'],
  '巽': ['丑', '亥', '酉', '未', '巳', '卯'],
  '离': ['卯', '丑', '亥', '酉', '未', '巳'],
  '坤': ['未', '巳', '卯', '丑', '亥', '酉'],
  '兑': ['巳', '卯', '丑', '亥', '酉', '未']
};

// 地支五行
const ZHI_WUXING = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 六亲关系（以卦宫五行为"我"）
const WUXING_RELATIONS = ['兄弟', '子孙', '妻财', '官鬼', '父母'];

/**
 * 六亲生克表
 * 我生者为子孙  |  生我者为父母
 * 我克者为妻财  |  克我者为官鬼
 * 同我者为兄弟
 */
function getLiuQin(woWuxing, yaoWuxing) {
  const fiveOrder = { '金': 0, '水': 1, '木': 2, '火': 3, '土': 4 };
  const wo = fiveOrder[woWuxing];
  const yao = fiveOrder[yaoWuxing];
  if (wo === yao) return '兄弟';
  const diff = (yao - wo + 5) % 5;
  // 0:同(兄弟) 1:生入→父母 2:克入→官鬼 3:生出→子孙 4:克出→妻财
  // 实际上:
  // yaowuxing 生 wouwuxing → 父母（生我）
  // wouwuxing 克 yaowuxing → 妻财（我克）
  // yaowuxing 克 wouwuxing → 官鬼（克我）
  // wouwuxing 生 yaowuxing → 子孙（我生）
  const relMap = { 0: '兄弟', 1: '父母', 2: '官鬼', 3: '子孙', 4: '妻财' };
  return relMap[diff];
}

// 八宫卦序（每宫8卦，数组为八卦组合 [下卦, 上卦]，顺序对应世爻位置 1,2,3,4,5,4,3,2）
const BA_GONG_ORDER = {
  '乾': [['乾','乾'],['乾','巽'],['乾','艮'],['乾','坤'],['巽','艮'],['艮','巽'],['艮','坤'],['坤','乾']],
  '坎': [['坎','坎'],['坎','兑'],['坎','震'],['坎','坤'],['兑','震'],['震','兑'],['震','坤'],['坤','坎']],
  '艮': [['艮','艮'],['艮','离'],['艮','巽'],['艮','坤'],['离','巽'],['巽','离'],['巽','坤'],['坤','艮']],
  '震': [['震','震'],['震','兑'],['震','坎'],['震','坤'],['兑','坎'],['坎','兑'],['坎','坤'],['坤','震']],
  '巽': [['巽','巽'],['巽','乾'],['巽','离'],['巽','坤'],['乾','离'],['离','乾'],['离','坤'],['坤','巽']],
  '离': [['离','离'],['离','艮'],['离','乾'],['离','坤'],['艮','乾'],['乾','艮'],['乾','坤'],['坤','离']],
  '坤': [['坤','坤'],['坤','震'],['坤','坎'],['坤','乾'],['震','坎'],['坎','震'],['坎','乾'],['乾','坤']],
  '兑': [['兑','兑'],['兑','坎'],['兑','坤'],['兑','乾'],['坎','坤'],['坤','坎'],['坤','乾'],['乾','兑']]
};

// 世应位置（八宫卦序中第i个卦的世爻位置）
const SHI_POSITIONS = [1, 2, 3, 4, 5, 4, 3, 2];
// 应爻 = 世爻 + 3，超过6则减6

// 六十四卦名称
const HEXAGRAM_NAMES = {
  '乾乾': { name: '乾为天', shortName: '乾', id: 1 },
  '坤乾': { name: '天地否', shortName: '否', id: 12 },
  '震乾': { name: '天雷无妄', shortName: '无妄', id: 25 },
  '巽乾': { name: '天风姤', shortName: '姤', id: 44 },
  '坎乾': { name: '天水讼', shortName: '讼', id: 6 },
  '离乾': { name: '天火同人', shortName: '同人', id: 13 },
  '艮乾': { name: '天山遁', shortName: '遁', id: 33 },
  '兑乾': { name: '天泽履', shortName: '履', id: 10 },
  '乾坤': { name: '地天泰', shortName: '泰', id: 11 },
  '坤坤': { name: '坤为地', shortName: '坤', id: 2 },
  '震坤': { name: '地雷复', shortName: '复', id: 24 },
  '巽坤': { name: '地风升', shortName: '升', id: 46 },
  '坎坤': { name: '地水师', shortName: '师', id: 7 },
  '离坤': { name: '地火明夷', shortName: '明夷', id: 36 },
  '艮坤': { name: '地山谦', shortName: '谦', id: 15 },
  '兑坤': { name: '地泽临', shortName: '临', id: 19 },
  '乾震': { name: '天雷无妄', shortName: '无妄', id: 25 },
  '坤震': { name: '地雷复', shortName: '复', id: 24 },
  '震震': { name: '震为雷', shortName: '震', id: 51 },
  '巽震': { name: '风雷益', shortName: '益', id: 42 },
  '坎震': { name: '水雷屯', shortName: '屯', id: 3 },
  '离震': { name: '火雷噬嗑', shortName: '噬嗑', id: 21 },
  '艮震': { name: '山雷颐', shortName: '颐', id: 27 },
  '兑震': { name: '泽雷随', shortName: '随', id: 17 },
  '乾巽': { name: '天风姤', shortName: '姤', id: 44 },
  '坤巽': { name: '地风升', shortName: '升', id: 46 },
  '震巽': { name: '雷风恒', shortName: '恒', id: 32 },
  '巽巽': { name: '巽为风', shortName: '巽', id: 57 },
  '坎巽': { name: '水风井', shortName: '井', id: 48 },
  '离巽': { name: '火风鼎', shortName: '鼎', id: 50 },
  '艮巽': { name: '山风蛊', shortName: '蛊', id: 18 },
  '兑巽': { name: '泽风大过', shortName: '大过', id: 28 },
  '乾坎': { name: '天水讼', shortName: '讼', id: 6 },
  '坤坎': { name: '地水师', shortName: '师', id: 7 },
  '震坎': { name: '雷水解', shortName: '解', id: 40 },
  '巽坎': { name: '风水涣', shortName: '涣', id: 59 },
  '坎坎': { name: '坎为水', shortName: '坎', id: 29 },
  '离坎': { name: '火水未济', shortName: '未济', id: 64 },
  '艮坎': { name: '山水蒙', shortName: '蒙', id: 4 },
  '兑坎': { name: '泽水困', shortName: '困', id: 47 },
  '乾离': { name: '天火同人', shortName: '同人', id: 13 },
  '坤离': { name: '地火明夷', shortName: '明夷', id: 36 },
  '震离': { name: '雷火丰', shortName: '丰', id: 55 },
  '巽离': { name: '风火家人', shortName: '家人', id: 37 },
  '坎离': { name: '水火既济', shortName: '既济', id: 63 },
  '离离': { name: '离为火', shortName: '离', id: 30 },
  '艮离': { name: '山火贲', shortName: '贲', id: 22 },
  '兑离': { name: '泽火革', shortName: '革', id: 49 },
  '乾艮': { name: '天山遁', shortName: '遁', id: 33 },
  '坤艮': { name: '地山谦', shortName: '谦', id: 15 },
  '震艮': { name: '雷山小过', shortName: '小过', id: 62 },
  '巽艮': { name: '风山渐', shortName: '渐', id: 53 },
  '坎艮': { name: '水山蹇', shortName: '蹇', id: 39 },
  '离艮': { name: '火山旅', shortName: '旅', id: 56 },
  '艮艮': { name: '艮为山', shortName: '艮', id: 52 },
  '兑艮': { name: '泽山咸', shortName: '咸', id: 31 },
  '乾兑': { name: '天泽履', shortName: '履', id: 10 },
  '坤兑': { name: '地泽临', shortName: '临', id: 19 },
  '震兑': { name: '雷泽归妹', shortName: '归妹', id: 54 },
  '巽兑': { name: '风泽中孚', shortName: '中孚', id: 61 },
  '坎兑': { name: '水泽节', shortName: '节', id: 60 },
  '离兑': { name: '火泽睽', shortName: '睽', id: 38 },
  '艮兑': { name: '山泽损', shortName: '损', id: 41 },
  '兑兑': { name: '兑为泽', shortName: '兑', id: 58 }
};

// 六兽（按日干轮）
const SIX_BEASTS = ['青龙', '朱雀', '勾陈', '螣蛇', '白虎', '玄武'];
const DAY_GAN_BEAST_START = {
  '甲': 0, '乙': 0, // 甲乙起青龙
  '丙': 2, '丁': 2, // 丙丁起朱雀
  '戊': 4,          // 戊起勾陈
  '己': 5,          // 己起螣蛇
  '庚': 0, '辛': 0, // 庚辛起青龙【待核实：部分版本庚辛起白虎】
  '壬': 2, '癸': 2  // 壬癸起朱雀【待核实：部分版本壬癸起玄武】
};

// ==================== 核心函数 ====================

/**
 * 判断八卦
 * @param {string[]} yaoArr - 3个爻 ['阳','阴','阳']，从下到上
 * @returns {string} 卦名
 */
function identifyGua(yaoArr) {
  for (const [name, info] of Object.entries(BA_GUA)) {
    if (info.yao[0] === yaoArr[0] && info.yao[1] === yaoArr[1] && info.yao[2] === yaoArr[2]) {
      return name;
    }
  }
  return null;
}

/**
 * 通过上下卦组合查找卦宫和卦序
 * @param {string} xiaGua - 下卦名
 * @param {string} shangGua - 上卦名
 * @returns {object} { gong, index, shiYao, yingYao }
 */
function locateHexagram(xiaGua, shangGua) {
  const gongNames = Object.keys(BA_GONG_ORDER);
  for (const gong of gongNames) {
    const seq = BA_GONG_ORDER[gong];
    for (let i = 0; i < seq.length; i++) {
      if (seq[i][0] === xiaGua && seq[i][1] === shangGua) {
        const shiYao = SHI_POSITIONS[i];
        const yingYao = (shiYao + 3) > 6 ? (shiYao + 3 - 6) : (shiYao + 3);
        return { gong, index: i, shiYao, yingYao };
      }
    }
  }
  return null;
}

/**
 * 装卦：为六爻配置纳支、六亲、世应
 * @param {string[]} lines - 6个爻 ['阳','阴','阳','阴','阳','阴'] 从初爻到上爻
 * @returns {object}
 */
function installGua(lines) {
  // 识别上下卦
  const xiaYao = lines.slice(0, 3);  // 初二三爻 = 下卦
  const shangYao = lines.slice(3, 6); // 四五上爻 = 上卦
  const xiaGua = identifyGua(xiaYao);
  const shangGua = identifyGua(shangYao);

  if (!xiaGua || !shangGua) {
    throw new Error('无法识别卦象');
  }

  const location = locateHexagram(xiaGua, shangGua);
  if (!location) {
    throw new Error(`未找到卦象: ${shangGua}+${xiaGua}`);
  }

  const { gong, shiYao, yingYao } = location;
  const gongWuxing = BA_GUA[gong].wuxing;
  const nazhi = GUA_NAZHI[gong]; // 按卦宫纳支

  // 装各爻
  const yaoDetails = [];
  for (let i = 0; i < 6; i++) {
    const zhi = nazhi[i];
    const zhiWx = ZHI_WUXING[zhi];
    const liuQin = getLiuQin(gongWuxing, zhiWx);
    yaoDetails.push({
      position: i + 1,         // 爻位 1-6（1=初爻，6=上爻）
      yao: lines[i],           // 阴阳
      dizhi: zhi,              // 地支
      wuxing: zhiWx,           // 五行
      liuQin,                  // 六亲
      isShi: (i + 1) === shiYao,
      isYing: (i + 1) === yingYao
    });
  }

  return {
    lines: yaoDetails,
    hexagramName: HEXAGRAM_NAMES[`${xiaGua}${shangGua}`]?.name || `${shangGua}${xiaGua}`,
    shortName: HEXAGRAM_NAMES[`${xiaGua}${shangGua}`]?.shortName || '【待核实】',
    id: HEXAGRAM_NAMES[`${xiaGua}${shangGua}`]?.id || 0,
    gong,
    gongWuxing,
    shiYao,
    yingYao,
    xiaGua,
    shangGua
  };
}

/**
 * 爻变：老阳(9)变阴，老阴(6)变阳，少阳(7)少阴(8)不变
 * @param {string} yaoType - '老阳'|'少阳'|'老阴'|'少阴'
 * @returns {{ changed: boolean, newYao: string }}
 */
function transformYao(yaoType) {
  switch (yaoType) {
    case '老阳': // 9
      return { changed: true, newYao: '阴' };
    case '老阴': // 6
      return { changed: true, newYao: '阳' };
    case '少阳': // 7
      return { changed: false, newYao: '阳' };
    case '少阴': // 8
      return { changed: false, newYao: '阴' };
    default:
      return { changed: false, newYao: yaoType };
  }
}

// ==================== 起卦方法 ====================

/**
 * 铜钱起卦（随机模拟三枚铜钱摇6次）
 * 三枚铜钱：
 *   一背二字 → 少阳(─)  → 7
 *   二背一字 → 少阴(--)  → 8
 *   三背全背 → 老阳(○)  → 9（变爻）
 *   三字全字 → 老阴(×)  → 6（变爻）
 * @returns {object} 含本卦、变卦、动爻信息
 */
export function castByCoins() {
  const lines = [];      // 爻类型
  const rawYao = [];    // 阴阳标记
  const dongYao = [];   // 动爻位置（1-6）

  for (let i = 0; i < 6; i++) {
    const coins = [
      Math.random() < 0.5 ? '背' : '字',
      Math.random() < 0.5 ? '背' : '字',
      Math.random() < 0.5 ? '背' : '字'
    ];
    const beiCount = coins.filter(c => c === '背').length;

    let type, yao;
    if (beiCount === 3) {
      type = '老阳'; yao = '阳';
    } else if (beiCount === 2) {
      type = '少阴'; yao = '阴';
    } else if (beiCount === 1) {
      type = '少阳'; yao = '阳';
    } else {
      type = '老阴'; yao = '阴';
    }

    lines.push(type);
    rawYao.push(yao);

    if (type === '老阳' || type === '老阴') {
      dongYao.push(i + 1);
    }
  }

  const benGua = installGua(rawYao);

  // 变卦
  const bianYao = rawYao.map((y, i) => {
    const t = transformYao(lines[i]);
    return t.newYao;
  });
  const bianGua = (dongYao.length > 0) ? installGua(bianYao) : null;

  return {
    method: '铜钱起卦',
    lines,           // 摇得的6个爻类型
    dongYao,         // 动爻位置列表
    benGua: benGua ? {
      name: benGua.hexagramName,
      shortName: benGua.shortName,
      gong: benGua.gong,
      gongWuxing: benGua.gongWuxing,
      shiYao: benGua.shiYao,
      yingYao: benGua.yingYao,
      lines: benGua.lines
    } : null,
    bianGua: bianGua ? {
      name: bianGua.hexagramName,
      shortName: bianGua.shortName,
      gong: bianGua.gong,
      gongWuxing: bianGua.gongWuxing,
      shiYao: bianGua.shiYao,
      yingYao: bianGua.yingYao,
      lines: bianGua.lines
    } : null,
    rawYaoBen: rawYao,
    rawYaoBian: bianYao
  };
}

/**
 * 时间起卦（按农历年月日时数字起卦）
 * 上卦 = 年数 mod 8
 * 下卦 = 月数 mod 8
 * 动爻 = 日数 mod 6
 * （另有以年月日时四项起卦的方式，此为简化版）
 *
 * @param {object} lunarDate - { year: number, month: number, day: number }
 * @returns {object}
 */
export function castByTime(lunarDate) {
  const { year, month, day } = lunarDate;

  const shangNum = ((year % 8) || 8);
  const xiaNum = ((month % 8) || 8);
  const dongNum = ((day % 6) || 6);

  return castByNumbers(shangNum, xiaNum, dongNum);
}

/**
 * 数字起卦
 * 上卦 = num1 mod 8（0=坤8，1=乾1）
 * 下卦 = num2 mod 8
 * 动爻 = num3 mod 6（0=6爻）
 *
 * @param {number} num1 - 第一个数（上卦）
 * @param {number} num2 - 第二个数（下卦）
 * @param {number} num3 - 第三个数（动爻）
 * @returns {object}
 */
export function castByNumbers(num1, num2, num3) {
  const numToGua = { 1: '乾', 2: '兑', 3: '离', 4: '震', 5: '巽', 6: '坎', 7: '艮', 8: '坤' };

  const shangGuaNum = ((num1 % 8) || 8);
  const xiaGuaNum = ((num2 % 8) || 8);
  const dongYaoPos = ((num3 % 6) || 6);

  const shangGua = numToGua[shangGuaNum];
  const xiaGua = numToGua[xiaGuaNum];

  // 构建爻
  const shangYao = BA_GUA[shangGua].yao;
  const xiaYao = BA_GUA[xiaGua].yao;
  const rawYao = [...xiaYao, ...shangYao];

  const benGua = installGua(rawYao);

  // 变卦：只有动爻位置发生变化，老阳变阴，老阴变阳
  // 数字起卦中，动爻位置的阴阳翻转
  const bianYaoArr = [...rawYao];
  bianYaoArr[dongYaoPos - 1] = bianYaoArr[dongYaoPos - 1] === '阳' ? '阴' : '阳';
  const bianGua = installGua(bianYaoArr);

  return {
    method: '数字起卦',
    input: { num1, num2, num3 },
    shangGua,
    xiaGua,
    dongYao: [dongYaoPos],
    benGua: benGua ? {
      name: benGua.hexagramName,
      shortName: benGua.shortName,
      gong: benGua.gong,
      gongWuxing: benGua.gongWuxing,
      shiYao: benGua.shiYao,
      yingYao: benGua.yingYao,
      lines: benGua.lines
    } : null,
    bianGua: bianGua ? {
      name: bianGua.hexagramName,
      shortName: bianGua.shortName,
      gong: bianGua.gong,
      gongWuxing: bianGua.gongWuxing,
      shiYao: bianGua.shiYao,
      yingYao: bianGua.yingYao,
      lines: bianGua.lines
    } : null,
    dongYaoPos
  };
}

/**
 * 手动起卦（用户指定6爻的阴阳老阳老阴）
 * @param {string[]} lineTypes - 6个爻类型，如 ['少阳','少阴','老阳','少阴','老阴','少阳']（从初爻到上爻）
 * @returns {object}
 */
export function castManual(lineTypes) {
  if (lineTypes.length !== 6) {
    throw new Error('须提供6个爻的类型');
  }

  const validTypes = ['少阳', '少阴', '老阳', '老阴'];
  const rawYao = [];
  const dongYao = [];

  for (let i = 0; i < 6; i++) {
    const t = lineTypes[i];
    if (!validTypes.includes(t)) {
      throw new Error(`第${i + 1}爻类型无效: ${t}。有效值：${validTypes.join('/')}`);
    }
    if (t === '少阳' || t === '老阳') {
      rawYao.push('阳');
    } else {
      rawYao.push('阴');
    }
    if (t === '老阳' || t === '老阴') {
      dongYao.push(i + 1);
    }
  }

  const benGua = installGua(rawYao);

  // 变为少阴少阳，不变
  const bianYaoArr = rawYao.map((y, i) => {
    const t = lineTypes[i];
    // 老阳变阴，老阴变阳
    if (t === '老阳') return '阴';
    if (t === '老阴') return '阳';
    return y;
  });
  const bianGua = (dongYao.length > 0) ? installGua(bianYaoArr) : null;

  return {
    method: '手动起卦',
    lines: lineTypes,
    dongYao,
    benGua: benGua ? {
      name: benGua.hexagramName,
      shortName: benGua.shortName,
      gong: benGua.gong,
      gongWuxing: benGua.gongWuxing,
      shiYao: benGua.shiYao,
      yingYao: benGua.yingYao,
      lines: benGua.lines
    } : null,
    bianGua: bianGua ? {
      name: bianGua.hexagramName,
      shortName: bianGua.shortName,
      gong: bianGua.gong,
      gongWuxing: bianGua.gongWuxing,
      shiYao: bianGua.shiYao,
      yingYao: bianGua.yingYao,
      lines: bianGua.lines
    } : null
  };
}

// ==================== 断卦辅助 ====================

/**
 * 判断五行生克关系
 * @param {string} wx1 - 五行1
 * @param {string} wx2 - 五行2
 * @returns {string} '生'|'克'|'被生'|'被克'|'同'
 */
function getWuxingRelation(wx1, wx2) {
  const sheng = { '金': '水', '水': '木', '木': '火', '火': '土', '土': '金' };
  const ke = { '金': '木', '木': '土', '土': '水', '水': '火', '火': '金' };
  if (wx1 === wx2) return '同';
  if (sheng[wx1] === wx2) return '生';
  if (ke[wx1] === wx2) return '克';
  if (sheng[wx2] === wx1) return '被生';
  if (ke[wx2] === wx1) return '被克';
  return '未知';
}

/**
 * 解读卦象
 * @param {object} benGua - 本卦信息（castByCoins/castByNumbers/castManual 返回结果中的 benGua）
 * @param {object} bianGua - 变卦信息
 * @param {number[]} dongYao - 动爻位置
 * @returns {object} 解读结果
 */
export function interpretHexagram(benGua, bianGua, dongYao) {
  const result = {
    benGuaName: benGua?.name || '未知',
    bianGuaName: bianGua?.name || '无变卦（静卦）',
    dongYao,
    isJingGua: !dongYao || dongYao.length === 0,
    analysis: []
  };

  if (result.isJingGua) {
    result.analysis.push('此卦为静卦，无动爻，主事情稳定少变。');
    result.analysis.push('静卦看卦象本身吉凶，世应关系和六亲分布为主要参考。');
    result.analysis.push(`世爻位于第${benGua?.shiYao}爻，代表问卦者自身状态。`);
    result.analysis.push(`应爻位于第${benGua?.yingYao}爻，代表所问之事或对方。`);

    // 世应关系
    if (benGua) {
      const shiLine = benGua.lines.find(l => l.isShi);
      const yingLine = benGua.lines.find(l => l.isYing);
      if (shiLine && yingLine) {
        const rel = getWuxingRelation(shiLine.wuxing, yingLine.wuxing);
        const relText = {
          '生': '世生应：自身付出，主动追求或投入',
          '被生': '应生世：对方/事物有利于自身',
          '克': '世克应：自身能掌控局面',
          '被克': '应克世：事情对自身有压力',
          '同': '世应比和：双方势均力敌，和谐'
        };
        result.analysis.push(`世应关系：${relText[rel] || rel}`);
      }
    }
  } else {
    result.analysis.push(`此卦有${dongYao.length}个动爻，位置：第${dongYao.join('、')}爻。`);
    result.analysis.push('动爻所在的六亲表示事情变化的起因或关键人物。');
    result.analysis.push(`本卦(${result.benGuaName})为当前状态，变卦(${result.bianGuaName})为发展结果。`);

    // 分析动爻的六亲
    for (const pos of dongYao) {
      if (benGua) {
        const benLine = benGua.lines.find(l => l.position === pos);
        if (benLine) {
          result.analysis.push(`第${pos}爻动：六亲为"${benLine.liuQin}"，地支${benLine.dizhi}(${benLine.wuxing})发动。`);
        }
      }
    }
  }

  return result;
}

/**
 * 获取六兽排布（按日干）
 * @param {string} dayGan - 日干，如 '甲'
 * @returns {string[]} 6个六兽，对应初爻到上爻
 */
export function getSixBeasts(dayGan) {
  const startIdx = DAY_GAN_BEAST_START[dayGan];
  if (startIdx === undefined) return SIX_BEASTS; // 默认青龙起

  const beasts = [];
  for (let i = 0; i < 6; i++) {
    beasts.push(SIX_BEASTS[(startIdx + i) % 6]);
  }
  return beasts;
}

// 导出内部函数供高级使用
export { installGua, BA_GUA, HEXAGRAM_NAMES };
