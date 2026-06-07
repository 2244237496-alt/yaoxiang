/**
 * 梅花易数系统
 *
 * 北宋邵雍所创，以《周易》为理论基础。
 * 核心：通过数字/时间取卦 → 定体用 → 生克分析 → 断吉凶
 */

// ==================== 八卦基础数据 ====================

const BA_GUA = {
  1: { name: '乾', nature: '天', wuxing: '金', yao: ['阳', '阳', '阳'], direction: '西北', body: '头', image: '健' },
  2: { name: '兑', nature: '泽', wuxing: '金', yao: ['阴', '阳', '阳'], direction: '西', body: '口', image: '悦' },
  3: { name: '离', nature: '火', wuxing: '火', yao: ['阳', '阴', '阳'], direction: '南', body: '目', image: '丽' },
  4: { name: '震', nature: '雷', wuxing: '木', yao: ['阴', '阴', '阳'], direction: '东', body: '足', image: '动' },
  5: { name: '巽', nature: '风', wuxing: '木', yao: ['阳', '阳', '阴'], direction: '东南', body: '股', image: '入' },
  6: { name: '坎', nature: '水', wuxing: '水', yao: ['阴', '阳', '阴'], direction: '北', body: '耳', image: '陷' },
  7: { name: '艮', nature: '山', wuxing: '土', yao: ['阴', '阴', '阴'], direction: '东北', body: '手', image: '止' },
  8: { name: '坤', nature: '地', wuxing: '土', yao: ['阳', '阴', '阴'], direction: '西南', body: '腹', image: '顺' }
};

// 梅花易数卦序（先天八卦数）：乾1 兑2 离3 震4 巽5 坎6 艮7 坤8
const XIAN_TIAN_NUM = { 1: '乾', 2: '兑', 3: '离', 4: '震', 5: '巽', 6: '坎', 7: '艮', 8: '坤' };

// 六十四卦组合表（用上卦+下卦索引）
const HEXAGRAM_LOOKUP = {};
function buildLookup() {
  for (const [un, ug] of Object.entries(XIAN_TIAN_NUM)) {
    for (const [dn, dg] of Object.entries(XIAN_TIAN_NUM)) {
      HEXAGRAM_LOOKUP[`${ug}${dg}`] = { shangGua: ug, xiaGua: dg, shangNum: parseInt(un), xiaNum: parseInt(dn) };
    }
  }
}
buildLookup();

// 六十四卦名
const HEXAGRAM_NAMES = {
  '乾乾': '乾为天', '兑乾': '泽天夬', '离乾': '火天大有', '震乾': '雷天大壮',
  '巽乾': '风天小畜', '坎乾': '水天需', '艮乾': '山天大畜', '坤乾': '地天泰',
  '乾兑': '天泽履', '兑兑': '兑为泽', '离兑': '火泽睽', '震兑': '雷泽归妹',
  '巽兑': '风泽中孚', '坎兑': '水泽节', '艮兑': '山泽损', '坤兑': '地泽临',
  '乾离': '天火同人', '兑离': '泽火革', '离离': '离为火', '震离': '雷火丰',
  '巽离': '风火家人', '坎离': '水火既济', '艮离': '山火贲', '坤离': '地火明夷',
  '乾震': '天雷无妄', '兑震': '泽雷随', '离震': '火雷噬嗑', '震震': '震为雷',
  '巽震': '风雷益', '坎震': '水雷屯', '艮震': '山雷颐', '坤震': '地雷复',
  '乾巽': '天风姤', '兑巽': '泽风大过', '离巽': '火风鼎', '震巽': '雷风恒',
  '巽巽': '巽为风', '坎巽': '水风井', '艮巽': '山风蛊', '坤巽': '地风升',
  '乾坎': '天水讼', '兑坎': '泽水困', '离坎': '火水未济', '震坎': '雷水解',
  '巽坎': '风水涣', '坎坎': '坎为水', '艮坎': '山水蒙', '坤坎': '地水师',
  '乾艮': '天山遁', '兑艮': '泽山咸', '离艮': '火山旅', '震艮': '雷山小过',
  '巽艮': '风山渐', '坎艮': '水山蹇', '艮艮': '艮为山', '坤艮': '地山谦',
  '乾坤': '天地否', '兑坤': '泽地萃', '离坤': '火地晋', '震坤': '雷地豫',
  '巽坤': '风地观', '坎坤': '水地比', '艮坤': '山地剥', '坤坤': '坤为地'
};

// ==================== 五行生克 ====================

const WUXING_ORDER = { '金': 0, '水': 1, '木': 2, '火': 3, '土': 4 };

/**
 * 计算两个五行的生克关系
 * @returns {string} '生'|'克'|'被生'|'被克'|'比和'
 */
function wuxingRelation(wx1, wx2) {
  if (wx1 === wx2) return '比和';
  const a = WUXING_ORDER[wx1];
  const b = WUXING_ORDER[wx2];
  // 生：金→水→木→火→土→金
  // (a+1)%5 === b 表示a生b
  if ((a + 1) % 5 === b) return '生';
  // (b+1)%5 === a 表示b生a → a被b生
  if ((b + 1) % 5 === a) return '被生';
  // 克：金→木→土→水→火→金
  // (a+2)%5 === b 表示a克b
  if ((a + 2) % 5 === b) return '克';
  // (b+2)%5 === a 表示b克a → a被b克
  return '被克';
}

// ==================== 起卦方法 ====================

/**
 * 数字起卦（最常用）
 *
 * 上卦 = num1 mod 8（0=坤/8）
 * 下卦 = num2 mod 8（0=坤/8）
 * 动爻 = num3 mod 6（0=第6爻）
 *
 * @param {number} num1 - 第一个数
 * @param {number} num2 - 第二个数
 * @param {number} num3 - 第三个数
 * @returns {object}
 */
export function castByNumbers(num1, num2, num3) {
  const shangNum = num1 % 8 || 8;
  const xiaNum = num2 % 8 || 8;
  const dongNum = num3 % 6 || 6;

  const shangGua = XIAN_TIAN_NUM[shangNum];
  const xiaGua = XIAN_TIAN_NUM[xiaNum];
  const hexagramName = HEXAGRAM_NAMES[`${shangGua}${xiaGua}`] || `${shangGua}${xiaGua}`;

  // 动爻在上卦（1-3爻为下卦，4-6爻为上卦）
  const dongZaiShang = dongNum > 3;

  // 确定体卦和用卦
  // 动爻所在卦为用卦，不动者为体卦
  let bodyGua, useGua, tiGuaName, yongGuaName;
  if (dongZaiShang) {
    yongGuaName = shangGua;
    tiGuaName = xiaGua;
    bodyGua = BA_GUA[xiaNum];
    useGua = BA_GUA[shangNum];
  } else {
    yongGuaName = xiaGua;
    tiGuaName = shangGua;
    bodyGua = BA_GUA[shangNum];
    useGua = BA_GUA[xiaNum];
  }

  // 互卦：本卦二三四爻为下互卦，三四五爻为上互卦
  // 梅花易数中互卦的取法：去掉初爻和上爻，二三四为下互，三四五为上互
  const benYao = [...BA_GUA[xiaGua].yao, ...BA_GUA[shangGua].yao]; // [初,二,三,四,五,上]
  const huXiaYao = benYao.slice(1, 4);  // 二、三、四爻 → 下互卦
  const huShangYao = benYao.slice(2, 5); // 三、四、五爻 → 上互卦
  const huXiaGua = identifyGua(huXiaYao);
  const huShangGua = identifyGua(huShangYao);
  const huGuaName = HEXAGRAM_NAMES[`${huShangGua}${huXiaGua}`] || `${huShangGua}${huXiaGua}`;

  // 变卦：动爻阴阳反转
  const bianYao = [...benYao];
  bianYao[dongNum - 1] = bianYao[dongNum - 1] === '阳' ? '阴' : '阳';
  const bianXiaGua = identifyGua(bianYao.slice(0, 3));
  const bianShangGua = identifyGua(bianYao.slice(3, 6));
  const bianGuaName = HEXAGRAM_NAMES[`${bianShangGua}${bianXiaGua}`] || `${bianShangGua}${bianXiaGua}`;

  // 体用生克分析
  const analysis = analyzeBodyUse(bodyGua, useGua, dongNum);

  return {
    method: '数字起卦',
    input: { num1, num2, num3 },
    benGua: {
      name: hexagramName,
      shangGua: BA_GUA[shangNum],
      xiaGua: BA_GUA[xiaNum],
      shangGuaName: shangGua,
      xiaGuaName: xiaGua,
      yao: benYao
    },
    huGua: {
      name: huGuaName,
      shangGua: BA_GUA[XIAN_TIAN_NUM[huShangGua] ? Object.keys(XIAN_TIAN_NUM).find(k => XIAN_TIAN_NUM[k] === huShangGua) : null],
      xiaGua: BA_GUA[XIAN_TIAN_NUM[huXiaGua] ? Object.keys(XIAN_TIAN_NUM).find(k => XIAN_TIAN_NUM[k] === huXiaGua) : null],
      shangGuaName: huShangGua,
      xiaGuaName: huXiaGua
    },
    bianGua: {
      name: bianGuaName,
      shangGuaName: bianShangGua,
      xiaGuaName: bianXiaGua
    },
    dongYao: dongNum,
    tiGua: { name: tiGuaName, ...bodyGua },
    yongGua: { name: yongGuaName, ...useGua },
    analysis
  };
}

/**
 * 年月日时起卦
 * 上卦 = (年 + 月 + 日) mod 8
 * 下卦 = (年 + 月 + 日 + 时) mod 8
 * 动爻 = (年 + 月 + 日 + 时) mod 6
 *
 * @param {Date|object} date - Date对象或 { year, month, day, hour } 农历
 * @returns {object}
 */
export function castByDateTime(date) {
  let year, month, day, hour;
  if (date instanceof Date) {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    hour = date.getHours();
  } else {
    year = date.year;
    month = date.month;
    day = date.day;
    hour = date.hour ?? 0;
  }

  // 地支序数化时辰（子=1, 丑=2, ..., 亥=12）
  const shiChenNum = Math.floor((hour + 1) / 2) % 12 + 1; // 0-23 → 1-12

  const num1 = year + month + day;
  const num2 = year + month + day + shiChenNum;
  const num3 = year + month + day + shiChenNum;

  return castByNumbers(num1, num2, num3);
}

/**
 * 根据字数起卦
 * 一字：左半部画数为上卦，右半部为下卦，总画数为动爻【待核实：更准确算法】
 * 二字：第一字画数上卦，第二字画数下卦
 * 三字及以上：第一字画数上卦，后两字画数和取下卦
 *
 * 画数 = 汉字笔画数，英文按字母数
 * 此处仅做框架实现，需要配合汉字笔画数据库使用
 *
 * @param {string} text
 * @returns {object}
 */
export function castByText(text) {
  const chars = [...text.trim()];
  const count = chars.length;

  if (count === 0) throw new Error('文字不能为空');

  let num1, num2, num3;
  // 简化：使用 Unicode 码点之和代替笔画数（实际应用中应查笔画数据库）
  if (count === 1) {
    const code = text.codePointAt(0);
    num1 = code;
    num2 = code;
    num3 = code;
  } else if (count === 2) {
    num1 = chars[0].codePointAt(0);
    num2 = chars[1].codePointAt(0);
    num3 = num1 + num2;
  } else {
    num1 = chars[0].codePointAt(0);
    num2 = (chars[1].codePointAt(0) + chars[2].codePointAt(0));
    num3 = num1 + num2;
  }

  return castByNumbers(num1, num2, num3);
}

// ==================== 体用生克分析 ====================

/**
 * 体用生克分析
 *
 * 体卦代表问卦者自身
 * 用卦代表所问之事
 * 生克关系决定吉凶：
 *   体生用 → 泄气，小凶（自身消耗）
 *   用生体 → 大吉（外来助力）
 *   体克用 → 小吉（自身能掌控，但耗力）
 *   用克体 → 大凶（受外部克制）
 *   体用比和 → 大吉（双方和谐）
 *
 * @param {object} bodyGua - 体卦信息
 * @param {object} useGua - 用卦信息
 * @param {number} dongYao - 动爻位置
 * @returns {object}
 */
export function analyzeBodyUse(bodyGua, useGua, dongYao) {
  const relation = wuxingRelation(bodyGua.wuxing, useGua.wuxing);

  let luck, description, score;
  switch (relation) {
    case '生':
      luck = '小凶';
      score = 40;
      description = `体生用（${bodyGua.name}(${bodyGua.wuxing})生${useGua.name}(${useGua.wuxing})）：自身消耗向外，事倍功半，需付出较大代价。问求财不利，问感情投入较多。`;
      break;
    case '被生':
      luck = '大吉';
      score = 90;
      description = `用生体（${useGua.name}(${useGua.wuxing})生${bodyGua.name}(${bodyGua.wuxing})）：外部助力，贵人相助，事半功倍。诸事顺利，财运亨通。`;
      break;
    case '克':
      luck = '小吉';
      score = 65;
      description = `体克用（${bodyGua.name}(${bodyGua.wuxing})克${useGua.name}(${useGua.wuxing})）：自身能主导局面，但需付出努力。虽能成事，但过程辛苦。`;
      break;
    case '被克':
      luck = '大凶';
      score = 20;
      description = `用克体（${useGua.name}(${useGua.wuxing})克${bodyGua.name}(${bodyGua.wuxing})）：外部压制，阻碍重重。宜静不宜动，不可强求，等待时机。`;
      break;
    case '比和':
    default:
      luck = '大吉';
      score = 85;
      description = `体用比和（${bodyGua.name}与${useGua.name}同属${bodyGua.wuxing}）：双方和谐，配合默契，诸事顺遂。合作有利，人际关系融洽。`;
      break;
  }

  return {
    bodyGua: bodyGua.name,
    bodyWuxing: bodyGua.wuxing,
    useGua: useGua.name,
    useWuxing: useGua.wuxing,
    relation,
    luck,
    score,
    description,
    dongYao,
    summary: `体卦${bodyGua.name}(${bodyGua.wuxing}) vs 用卦${useGua.name}(${useGua.wuxing}) → ${relation} → ${luck}`
  };
}

// ==================== 辅助函数 ====================

/**
 * 根据三个爻识别八卦
 * @param {string[]} yaoArr - 3个爻
 * @returns {string|null} 卦名
 */
function identifyGua(yaoArr) {
  if (yaoArr.length !== 3) return null;
  for (const [num, info] of Object.entries(BA_GUA)) {
    if (info.yao[0] === yaoArr[0] && info.yao[1] === yaoArr[1] && info.yao[2] === yaoArr[2]) {
      return info.name;
    }
  }
  // 非标准卦，尝试反序查找【待核实】
  return null;
}

// 导出内部对象供扩展使用
export { BA_GUA, XIAN_TIAN_NUM, wuxingRelation, identifyGua };
