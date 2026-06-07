/**
 * 八字排盘系统
 * 基于天干地支基础库,实现完整的八字排盘算法
 */
import {
  TIAN_GAN, DI_ZHI, TIAN_GAN_WUXING, DI_ZHI_WUXING,
  TIAN_GAN_YINYANG, DI_ZHI_YINYANG,
  DI_ZHI_CANG_GAN, SHENG_XIAO, SHI_CHEN, JIA_ZI, JIA_ZI_INDEX,
  NA_YIN, WU_XING_SHENG, WU_XING_KE,
  SHI_ER_CHANG_SHENG, getChangSheng, getShiShen, getPillarShiShen,
  getYearGanZhi, getMonthGan, getHourGan, getHourZhi,
  daysFrom1900, getDayGanZhiByDays,
  TIAN_YI_GUI_REN, WEN_CHANG_GUI_REN, LU_SHEN, YANG_REN,
  getTaoHua, getYiMa, getKongWang,
  DI_ZHI_LIU_HE, DI_ZHI_LIU_CHONG, DI_ZHI_LIU_HAI, DI_ZHI_SAN_HE, DI_ZHI_SAN_HUI,
  TIAN_GAN_WU_HE, WUXING_KEY
} from '../data/ganzhi.js';

// ==================== 节气近似计算 ====================

/**
 * 24节气名称
 */
const SOLAR_TERM_NAMES = [
  '立春','雨水','惊蛰','春分','清明','谷雨',
  '立夏','小满','芒种','夏至','小暑','大暑',
  '立秋','处暑','白露','秋分','寒露','霜降',
  '立冬','小雪','大雪','冬至','小寒','大寒'
];

/**
 * 12节（月令分界）在24节气中的索引
 * 立春(0), 惊蛰(2), 清明(4), 立夏(6), 芒种(8), 小暑(10),
 * 立秋(12), 白露(14), 寒露(16), 立冬(18), 大雪(20), 小寒(22)
 */
const JIE_INDEXES = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];

/**
 * 12节对应的月支（从寅月开始）
 */
const JIE_ZHI_MAP = ['寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑'];

/**
 * 获取某年某节气的近似日期
 * 使用2000年基准日期 + 年份偏移近似, 精度±1天, 适合1900-2100年
 * @param {number} year - 公历年份
 * @param {number} termIndex - 节气完整索引(0=立春, ...23=大寒)
 * @returns {Date} 近似日期
 */
function getApproxSolarTerm(year, termIndex) {
  // 24节气的月份和近似日(以2000年为基准)
  const baseMonth = [2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,1,1];
  const baseDay   = [4,19,6,21,5,20,5,21,5,21,7,23,7,23,7,23,8,23,7,22,7,22,6,21];

  const baseYear = 2000;
  const yearDiff = year - baseYear;

  let month = baseMonth[termIndex];
  let day = baseDay[termIndex];

  // 简化的年份偏移: 每年约0.2422天偏移
  // 加上世纪修正: 每100年-1天(19世纪,21世纪后续修正)
  let dayOffset = Math.round(yearDiff * 0.2422);
  // 闰世纪修正: 2000是闰年, 但2100不是
  if (year >= 2100) dayOffset -= 1;
  day += dayOffset;

  // 处理跨年节气(小寒/大寒在公历次年1月)
  let actualYear = year;
  if (termIndex >= 22) {
    actualYear = year + 1;
  }

  // 规范日期到当月有效范围
  const maxDay = new Date(actualYear, month, 0).getDate();
  day = Math.max(1, Math.min(day, maxDay));

  return new Date(actualYear, month - 1, day);
}

/**
 * 根据公历日期确定月令（月支）
 * 以12个节为分界, 从后往前比较
 * @param {Date} date - 公历日期
 * @returns {{zhi: string, jieIndex: number}} 月支及对应的节索引
 */
function getMonthZhiByDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  for (let i = JIE_INDEXES.length - 1; i >= 0; i--) {
    const termIndex = JIE_INDEXES[i];
    let termYear = year;
    // 小寒(22)和大寒(23)在上一年12月
    if (termIndex >= 22 && month === 1) {
      termYear = year - 1;
    }
    const termDate = getApproxSolarTerm(termYear, termIndex);

    if (date >= termDate) {
      return { zhi: JIE_ZHI_MAP[i], jieIndex: i };
    }
  }

  // 兜底: 小寒前日期仍在丑月
  return { zhi: '丑', jieIndex: 11 };
}

/**
 * 判断日期是否在立春之前
 * @param {Date} date
 * @returns {boolean}
 */
function isBeforeLiChun(date) {
  const year = date.getFullYear();
  const liChun = getApproxSolarTerm(year, 0);
  return date < liChun;
}

// ==================== 八字排盘核心 ====================

/**
 * 计算八字四柱
 * @param {Date} birthDate - 公历出生日期
 * @param {number} birthHour - 出生小时 (0-23)
 * @param {boolean} isLunar - 是否为农历日期 (暂不支持, 保留参数)
 * @returns {object} 八字结果
 */
export function calculateBazi(birthDate, birthHour, isLunar = false) {
  // TODO: 农历转公历需要完整农历数据表
  if (isLunar) {
    console.warn('农历输入暂不支持, 将按公历处理');
  }

  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();

  // --- 1. 年柱 ---
  const effectiveYear = isBeforeLiChun(birthDate) ? year - 1 : year;
  const yearPillar = getYearGanZhi(effectiveYear);

  // --- 2. 月柱 ---
  const monthZhiResult = getMonthZhiByDate(birthDate);
  const monthZhi = monthZhiResult.zhi;
  const monthGan = getMonthGan(yearPillar.gan, monthZhi);
  const monthPillar = { gan: monthGan, zhi: monthZhi };

  // --- 3. 日柱 ---
  const days = daysFrom1900(birthDate);
  const dayResult = getDayGanZhiByDays(days);
  const dayPillar = { gan: dayResult.gan, zhi: dayResult.zhi };
  const riGanZhi = dayResult.ganzhi;

  // --- 4. 时柱 ---
  const hourZhiResult = getHourZhi(birthHour);
  const hourZhi = hourZhiResult.zhi;
  const hourGan = getHourGan(dayPillar.gan, hourZhi);
  const hourPillar = { gan: hourGan, zhi: hourZhi };

  // --- 5. 五行统计 ---
  const wuxing = countWuxing(yearPillar, monthPillar, dayPillar, hourPillar);

  // --- 6. 十神 ---
  const shiShen = calculateAllShiShen(dayPillar.gan, yearPillar, monthPillar, dayPillar, hourPillar);

  // --- 7. 纳音 ---
  const nayin = {
    year: NA_YIN[yearPillar.gan + yearPillar.zhi] || '',
    month: NA_YIN[monthPillar.gan + monthPillar.zhi] || '',
    day: NA_YIN[dayPillar.gan + dayPillar.zhi] || '',
    hour: NA_YIN[hourPillar.gan + hourPillar.zhi] || ''
  };

  // --- 8. 十二长生 ---
  const changSheng = {
    year: getChangSheng(dayPillar.gan, yearPillar.zhi),
    month: getChangSheng(dayPillar.gan, monthPillar.zhi),
    day: getChangSheng(dayPillar.gan, dayPillar.zhi),
    hour: getChangSheng(dayPillar.gan, hourPillar.zhi)
  };

  // --- 9. 空亡 ---
  const kongWang = getKongWang(riGanZhi);

  // --- 10. 神煞 ---
  const shenSha = calculateShenSha(yearPillar, monthPillar, dayPillar, hourPillar);

  return {
    birth: {
      date: `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`,
      hour: birthHour,
      hourZhi: hourZhiResult.zhi,
      shiChen: SHI_CHEN.find(s => s.zhi === hourZhiResult.zhi) || null,
      shengXiao: SHENG_XIAO[yearPillar.zhi] || ''
    },
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    riZhu: riGanZhi,
    wuxing,
    shiShen,
    nayin,
    changSheng,
    kongWang,
    shenSha
  };
}

// ==================== 五行统计 ====================

/**
 * 统计八字中五行分布（含地支藏干加权）
 * 天干各计1, 地支藏干本气0.7、中气0.2、余气0.1
 * @returns {{wood:number, fire:number, earth:number, metal:number, water:number, count:object, wangshuai:string}}
 */
function countWuxing(year, month, day, hour) {
  const pillars = [year, month, day, hour];
  const counts = { '木':0, '火':0, '土':0, '金':0, '水':0 };

  // 天干计数 (各1)
  for (const p of pillars) {
    const wx = TIAN_GAN_WUXING[p.gan];
    if (wx) counts[wx] += 1;
  }

  // 地支藏干加权计数
  for (const p of pillars) {
    const cangGan = DI_ZHI_CANG_GAN[p.zhi] || [];
    if (cangGan.length >= 1) {
      const wx0 = TIAN_GAN_WUXING[cangGan[0]];
      if (wx0) counts[wx0] += 0.7;
    }
    if (cangGan.length >= 2) {
      const wx1 = TIAN_GAN_WUXING[cangGan[1]];
      if (wx1) counts[wx1] += 0.2;
    }
    if (cangGan.length >= 3) {
      const wx2 = TIAN_GAN_WUXING[cangGan[2]];
      if (wx2) counts[wx2] += 0.1;
    }
  }

  // 简单计数(不含藏干, 仅天干+地支五行)
  const simpleCounts = { '木':0, '火':0, '土':0, '金':0, '水':0 };
  for (const p of pillars) {
    const wxG = TIAN_GAN_WUXING[p.gan];
    if (wxG) simpleCounts[wxG] += 1;
    const wxZ = DI_ZHI_WUXING[p.zhi];
    if (wxZ) simpleCounts[wxZ] += 1;
  }

  // 旺衰判断
  let maxWx = '', minWx = '';
  let maxVal = -1, minVal = Infinity;
  for (const [wx, val] of Object.entries(counts)) {
    if (val > maxVal) { maxVal = val; maxWx = wx; }
    if (val < minVal) { minVal = val; minWx = wx; }
  }

  const wangshuai = `${maxWx}旺${minWx && minWx !== maxWx ? minWx + '弱' : ''}`;

  return {
    wood: Math.round(counts['木'] * 10) / 10,
    fire: Math.round(counts['火'] * 10) / 10,
    earth: Math.round(counts['土'] * 10) / 10,
    metal: Math.round(counts['金'] * 10) / 10,
    water: Math.round(counts['水'] * 10) / 10,
    count: simpleCounts,
    weighted: counts,
    wangshuai
  };
}

// ==================== 十神计算 ====================

/**
 * 计算全局十神配置
 */
function calculateAllShiShen(riGan, year, month, day, hour) {
  const result = {
    year: getPillarShiShen(riGan, year.gan, year.zhi),
    month: getPillarShiShen(riGan, month.gan, month.zhi),
    day: getPillarShiShen(riGan, day.gan, day.zhi),
    hour: getPillarShiShen(riGan, hour.gan, hour.zhi)
  };

  // 统计十神分布
  const distribution = {};
  const allPillars = [result.year, result.month, result.day, result.hour];
  for (const p of allPillars) {
    distribution[p.tianGan] = (distribution[p.tianGan] || 0) + 1;
    for (const cg of p.diZhi) {
      distribution[cg] = (distribution[cg] || 0) + 1;
    }
  }

  result.distribution = distribution;
  return result;
}

// ==================== 神煞 ====================

/**
 * 计算全局神煞
 */
function calculateShenSha(year, month, day, hour) {
  const riGan = day.gan;
  const riZhi = day.zhi;
  const nianGan = year.gan;

  const allZhis = [year.zhi, month.zhi, day.zhi, hour.zhi];

  const shenSha = {
    tianYi: {
      byRiGan: TIAN_YI_GUI_REN[riGan] || [],
      byNianGan: TIAN_YI_GUI_REN[nianGan] || []
    },
    wenChang: WEN_CHANG_GUI_REN[riGan] || '',
    luShen: LU_SHEN[riGan] || '',
    yangRen: YANG_REN[riGan] || '',
    taoHua: [],
    yiMa: [],
    tianYiZai: [],
    wenChangZai: [],
    luShenZai: [],
    yangRenZai: [],
    taoHuaZai: [],
    yiMaZai: []
  };

  const pillarNames = ['年柱', '月柱', '日柱', '时柱'];
  const pillars = [year, month, day, hour];

  for (let i = 0; i < pillars.length; i++) {
    const p = pillars[i];
    const name = pillarNames[i];

    // 天乙贵人
    const tianYiByRi = TIAN_YI_GUI_REN[riGan] || [];
    const tianYiByNian = TIAN_YI_GUI_REN[nianGan] || [];
    if (tianYiByRi.includes(p.zhi) || tianYiByNian.includes(p.zhi)) {
      shenSha.tianYiZai.push(name);
    }

    // 文昌
    if (WEN_CHANG_GUI_REN[riGan] === p.zhi) {
      shenSha.wenChangZai.push(name);
    }

    // 禄神
    if (LU_SHEN[riGan] === p.zhi) {
      shenSha.luShenZai.push(name);
    }

    // 羊刃
    if (YANG_REN[riGan] === p.zhi) {
      shenSha.yangRenZai.push(name);
    }

    // 桃花: 以日支/年支查, 桃花地支出现在四柱中
    const thZhi = getTaoHua(p.zhi);
    if (thZhi && allZhis.includes(thZhi) && !shenSha.taoHuaZai.includes(name)) {
      shenSha.taoHua.push({ from: name, zhi: thZhi });
      for (let j = 0; j < pillars.length; j++) {
        if (pillars[j].zhi === thZhi && !shenSha.taoHuaZai.includes(pillarNames[j])) {
          shenSha.taoHuaZai.push(pillarNames[j]);
        }
      }
    }

    // 驿马
    const ymZhi = getYiMa(p.zhi);
    if (ymZhi && allZhis.includes(ymZhi) && !shenSha.yiMaZai.includes(name)) {
      shenSha.yiMa.push({ from: name, zhi: ymZhi });
      for (let j = 0; j < pillars.length; j++) {
        if (pillars[j].zhi === ymZhi && !shenSha.yiMaZai.includes(pillarNames[j])) {
          shenSha.yiMaZai.push(pillarNames[j]);
        }
      }
    }
  }

  return shenSha;
}

// ==================== 大运计算 ====================

/**
 * 计算大运
 * 规则:
 *   阳年男、阴年女 → 顺排(从月柱往后)
 *   阴年男、阳年女 → 逆排(从月柱往前)
 * 起运年龄: 顺排=出生日到下一节天数/3, 逆排=上一节到出生日天数/3
 * @param {object} bazi - calculateBazi的返回值
 * @param {string} gender - '男' 或 '女'
 * @returns {object} 大运信息
 */
export function calculateDaYun(bazi, gender) {
  const yearGan = bazi.yearPillar.gan;
  const monthPillar = bazi.monthPillar;
  const birthDate = new Date(bazi.birth.date);

  const isYangYear = TIAN_GAN_YINYANG[yearGan] === '阳';
  const isMale = gender === '男';

  // 阳年男/阴年女 → 顺排; 阴年男/阳年女 → 逆排
  const shunPai = (isYangYear && isMale) || (!isYangYear && !isMale);

  // --- 起运年龄 ---
  const birthMonth = birthDate.getMonth() + 1;
  const birthYear = birthDate.getFullYear();
  const jieIndex = JIE_ZHI_MAP.indexOf(monthPillar.zhi);

  let startAge = 0;

  if (shunPai) {
    // 顺排: 出生日 → 下一个节
    const nextJieIndex = (jieIndex + 1) % 12;
    const nextTermIndex = JIE_INDEXES[nextJieIndex];
    let nextTermYear = birthYear;
    if (nextTermIndex >= 22 && birthMonth >= 2) {
      nextTermYear = birthYear + 1;
    }
    const nextJieDate = getApproxSolarTerm(nextTermYear, nextTermIndex);
    const diffMs = nextJieDate.getTime() - birthDate.getTime();
    const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    startAge = Math.round((diffDays / 3) * 10) / 10;
  } else {
    // 逆排: 上一个节 → 出生日
    const prevJieIndex = (jieIndex - 1 + 12) % 12;
    const prevTermIndex = JIE_INDEXES[prevJieIndex];
    let prevTermYear = birthYear;
    if (prevTermIndex >= 22 && birthMonth === 1) {
      prevTermYear = birthYear - 1;
    }
    const prevJieDate = getApproxSolarTerm(prevTermYear, prevTermIndex);
    const diffMs = birthDate.getTime() - prevJieDate.getTime();
    const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    startAge = Math.round((diffDays / 3) * 10) / 10;
  }

  // --- 排列大运 ---
  const monthGanZhi = monthPillar.gan + monthPillar.zhi;
  const monthJZIndex = JIA_ZI_INDEX[monthGanZhi];
  const numDaYun = 8;

  const daYun = [];
  for (let i = 0; i < numDaYun; i++) {
    let jzIndex;
    if (shunPai) {
      jzIndex = (monthJZIndex + i + 1) % 60;
    } else {
      jzIndex = (monthJZIndex - i - 1 + 60) % 60;
    }
    const gz = JIA_ZI[jzIndex];
    const startYr = Math.round((startAge + i * 10) * 10) / 10;
    const endYr = Math.round((startAge + (i + 1) * 10 - 1) * 10) / 10;
    daYun.push({
      ganZhi: gz,
      gan: gz[0],
      zhi: gz[1],
      nayin: NA_YIN[gz] || '',
      startAge: startYr,
      endAge: endYr,
      ageRange: `${Math.round(startAge + i * 10)}-${Math.round(startAge + (i + 1) * 10 - 1)}岁`
    });
  }

  return {
    shunPai,
    startAge,
    daYun,
    direction: shunPai ? '顺排' : '逆排',
    reason: `${isYangYear ? '阳年' : '阴年'}${isMale ? '男' : '女'}, ${shunPai ? '顺排' : '逆排'}大运`
  };
}

// ==================== 流年分析 ====================

/**
 * 流年分析: 分析某一年对八字的影响
 * @param {object} bazi - calculateBazi的返回值
 * @param {number} liuNianYear - 流年(公历年份)
 * @returns {object} 流年分析结果
 */
export function analyzeLiuNian(bazi, liuNianYear) {
  const riGan = bazi.dayPillar.gan;
  const riZhi = bazi.dayPillar.zhi;

  // 流年干支
  const liuNianGZ = getYearGanZhi(liuNianYear);
  const liuNianGanZhi = liuNianGZ.gan + liuNianGZ.zhi;

  // 流年天干对日干十神
  const liuNianShiShen = getShiShen(riGan, liuNianGZ.gan);

  // 流年与日柱的关系
  const relations = [];

  // 伏吟
  if (riGan === liuNianGZ.gan) {
    relations.push('流年与日干相同(伏吟)');
  }
  if (riZhi === liuNianGZ.zhi) {
    relations.push('流年与日支相同(伏吟)');
  }

  // 天干五合
  for (const [key, hua] of Object.entries(TIAN_GAN_WU_HE)) {
    if ((key[0] === riGan && key[1] === liuNianGZ.gan) ||
        (key[1] === riGan && key[0] === liuNianGZ.gan)) {
      relations.push(`日干与流年干合化${hua}`);
    }
  }

  // 地支六冲
  for (const [a, b] of DI_ZHI_LIU_CHONG) {
    if ((riZhi === a && liuNianGZ.zhi === b) || (riZhi === b && liuNianGZ.zhi === a)) {
      relations.push(`日支${riZhi}与流年${liuNianGZ.zhi}相冲`);
    }
  }

  // 地支六合
  const heKeys = [riZhi + liuNianGZ.zhi, liuNianGZ.zhi + riZhi];
  for (const hk of heKeys) {
    if (DI_ZHI_LIU_HE[hk]) {
      relations.push(`日支与流年六合化${DI_ZHI_LIU_HE[hk]}`);
    }
  }

  // 地支六害
  for (const [a, b] of DI_ZHI_LIU_HAI) {
    if ((riZhi === a && liuNianGZ.zhi === b) || (riZhi === b && liuNianGZ.zhi === a)) {
      relations.push(`日支与流年相害`);
    }
  }

  // 三合/三会 (流年+命局)
  const allZhis = [bazi.yearPillar.zhi, bazi.monthPillar.zhi, bazi.dayPillar.zhi, bazi.hourPillar.zhi];
  const extendedZhis = [...allZhis, liuNianGZ.zhi];
  const zhiCount = {};
  extendedZhis.forEach(z => { zhiCount[z] = (zhiCount[z] || 0) + 1; });

  for (const [key, val] of Object.entries(DI_ZHI_SAN_HE)) {
    const parts = [...key];
    if (parts.every(p => zhiCount[p] >= 1)) {
      relations.push(`流年与命局形成${key}三合${val}局`);
      break;
    }
  }

  for (const [key, val] of Object.entries(DI_ZHI_SAN_HUI)) {
    const parts = [...key];
    if (parts.every(p => zhiCount[p] >= 1)) {
      relations.push(`流年与命局形成${key}三会${val}局`);
      break;
    }
  }

  // 流年十二长生
  const liuNianChangSheng = getChangSheng(riGan, liuNianGZ.zhi);

  // TODO: 大运+流年综合分析

  return {
    year: liuNianYear,
    ganZhi: liuNianGanZhi,
    gan: liuNianGZ.gan,
    zhi: liuNianGZ.zhi,
    nayin: NA_YIN[liuNianGanZhi] || '',
    shiShen: liuNianShiShen,
    shengXiao: SHENG_XIAO[liuNianGZ.zhi] || '',
    changSheng: liuNianChangSheng,
    relations,
    jiXiong: relations.some(r => r.includes('冲') || r.includes('害')) ? '注意冲害' :
             relations.some(r => r.includes('合')) ? '有合局' : '平顺'
  };
}

// ==================== 八字综合解读 ====================

/**
 * 八字综合解读
 * @param {object} bazi - calculateBazi的返回值
 * @returns {object} 综合解读
 */
export function analyzeBaziFortune(bazi) {
  const riGan = bazi.dayPillar.gan;
  const riWuxing = TIAN_GAN_WUXING[riGan];
  const riYinYang = TIAN_GAN_YINYANG[riGan];
  const wx = bazi.wuxing;

  const riZhuInfo = getRiZhuCharacter(riGan, riWuxing, riYinYang);
  const wuxingAnalysis = analyzeWuxingBalance(wx, riWuxing);
  const personality = getPersonality(riWuxing, riYinYang);
  const career = getCareerAnalysis(riWuxing, bazi.shiShen);
  const wealth = getWealthAnalysis(bazi.shiShen);
  const love = getLoveAnalysis(bazi);
  const health = getHealthAnalysis(wx, riWuxing);

  return {
    riZhuInfo,
    wuxingAnalysis,
    personality,
    career,
    wealth,
    love,
    health,
    summary: [personality, career, wealth, love, health].join(' ')
  };
}

/**
 * 日主五行特性
 */
function getRiZhuCharacter(riGan, wx, yinYang) {
  const characters = {
    '甲': '甲木为参天之木, 性格刚毅正直, 有领导才能, 积极向上, 但有时过于倔强。',
    '乙': '乙木为花草之木, 柔韧灵活, 善于适应环境, 心思细腻, 但有时优柔寡断。',
    '丙': '丙火为太阳之火, 热情开朗, 光明磊落, 有感染力, 但有时急躁冲动。',
    '丁': '丁火为灯烛之火, 温和内敛, 思维缜密, 善于观察, 但有时多疑善妒。',
    '戊': '戊土为城墙之土, 厚重诚信, 稳重可靠, 包容力强, 但有时固执保守。',
    '己': '己土为田园之土, 温厚善良, 踏实勤奋, 有孕育万物的胸怀, 但有时缺乏主见。',
    '庚': '庚金为斧钺之金, 刚健果断, 讲义气重原则, 执行力强, 但有时刚愎自用。',
    '辛': '辛金为珠玉之金, 精致细腻, 追求完美, 有艺术气质, 但有时过于挑剔。',
    '壬': '壬水为江河之水, 智慧豁达, 善于变通, 有远见卓识, 但有时随波逐流。',
    '癸': '癸水为雨露之水, 聪明灵秀, 心思细腻, 有洞察力, 但有时多愁善感。'
  };

  return {
    riGan,
    wuxing: wx,
    yinYang,
    description: characters[riGan] || ''
  };
}

/**
 * 五行平衡分析
 */
function analyzeWuxingBalance(wx, riWuxing) {
  const total = wx.wood + wx.fire + wx.earth + wx.metal + wx.water;
  if (total === 0) {
    return { percentages: {wood:0,fire:0,earth:0,metal:0,water:0}, lacking: '', riStrength: '', description: '' };
  }

  const percentages = {
    wood: Math.round(wx.wood / total * 100),
    fire: Math.round(wx.fire / total * 100),
    earth: Math.round(wx.earth / total * 100),
    metal: Math.round(wx.metal / total * 100),
    water: Math.round(wx.water / total * 100)
  };

  // 缺失的五行: 使用加权值检查
  const lacking = [];
  for (const [cnName, enKey] of Object.entries(WUXING_KEY)) {
    if (wx[enKey] === 0) {
      lacking.push(cnName);
    }
  }

  // 日主五行强弱: 使用WUXING_KEY将中文五行转换为英文key访问wx对象
  const riKey = WUXING_KEY[riWuxing] || '';
  const riValue = riKey ? (wx[riKey] || 0) : 0;
  const riStrength = riValue / total;
  let strengthLevel;
  if (riStrength >= 0.35) strengthLevel = '偏强';
  else if (riStrength >= 0.2) strengthLevel = '中和';
  else strengthLevel = '偏弱';

  return {
    percentages,
    lacking: lacking.length > 0 ? `八字缺${lacking.join('、')}` : '五行俱全',
    riStrength: strengthLevel,
    description: `日主${riWuxing}${strengthLevel}, ${lacking.length > 0 ? '缺' + lacking.join('、') : '五行俱全,格局较好'}`
  };
}

/**
 * 性格分析
 */
function getPersonality(riWuxing, riYinYang) {
  const baseDescriptions = {
    '木': '仁慈善良, 有进取心, 喜欢成长和发展。性格正直, 有恻隐之心, 重视道德和原则',
    '火': '热情奔放, 充满活力, 有领导和表达能力。性格急躁, 注重礼仪, 好面子',
    '土': '诚信敦厚, 包容稳重, 脚踏实地。性格温和, 重信用, 但有时过于保守',
    '金': '刚毅果断, 讲义气, 追求公平正义。性格坚强, 有决断力, 但有时过于刚硬',
    '水': '聪慧灵活, 善于交际, 适应力强。性格圆融, 思维敏捷, 但有时缺乏定力'
  };

  const baseInfo = baseDescriptions[riWuxing] || '';
  const yangDesc = riYinYang === '阳' ? '性格外向, 主动积极, 表现欲强。' : '性格内向, 心思细腻, 处事低调。';

  return `${baseInfo}。${yangDesc}`;
}

/**
 * 事业分析
 */
function getCareerAnalysis(riWuxing, shiShen) {
  const distributions = shiShen.distribution || {};
  const hasGuan = (distributions['正官'] || 0) + (distributions['七杀'] || 0) > 0;
  const hasYin = (distributions['正印'] || 0) + (distributions['偏印'] || 0) > 0;
  const hasShiShang = (distributions['食神'] || 0) + (distributions['伤官'] || 0) > 0;
  const hasCai = (distributions['正财'] || 0) + (distributions['偏财'] || 0) > 0;

  let analysis = '';

  if (hasGuan && hasYin) {
    analysis += '官印相生格, 适合从政、管理、学术研究等稳定职业。';
  } else if (hasCai && hasGuan) {
    analysis += '财官双美, 适合金融、企业管理和商贸领域。';
  } else if (hasShiShang && hasCai) {
    analysis += '食伤生财格, 适合技术、创意、艺术、商业经营。';
  } else if (hasShiShang) {
    analysis += '食伤旺相, 适合技术开发、创意设计、教育培训。';
  } else {
    analysis += '事业宜稳扎稳打, 选择适合自己专长的行业深耕。';
  }

  const careerWuxing = {
    '木': '教育、文化、医疗、环保、林业',
    '火': '传媒、能源、餐饮、互联网、演艺',
    '土': '房地产、建筑、农业、咨询、金融',
    '金': '机械、法律、军警、金融、科技',
    '水': '物流、贸易、旅游、传媒、水产'
  };
  analysis += `适合领域: ${careerWuxing[riWuxing] || '综合发展'}。`;

  return analysis;
}

/**
 * 财运分析
 */
function getWealthAnalysis(shiShen) {
  const distributions = shiShen.distribution || {};
  const zhengCai = distributions['正财'] || 0;
  const pianCai = distributions['偏财'] || 0;
  const totalCai = zhengCai + pianCai;
  const shiShenCount = (distributions['食神'] || 0) + (distributions['伤官'] || 0);

  let analysis = '';

  if (totalCai === 0) {
    analysis += '命局财星不显, 正财运稳定但需勤劳致富, 不宜投机。';
  } else if (totalCai >= 3) {
    analysis += '财星较旺, 财运良好, 但需注意理财, 避免破耗。';
  } else {
    analysis += '财运平稳, 正财为主, 宜守不宜攻。';
  }

  if (zhengCai > 0) analysis += '有正财运, 宜稳定工作和长期投资。';
  if (pianCai > 0) analysis += '有偏财运, 可适当尝试副业或投资。';
  if (shiShenCount > 0) analysis += '食伤为生财之源, 凭技术或创意可获财。';

  return analysis;
}

/**
 * 感情分析
 */
function getLoveAnalysis(bazi) {
  const riZhi = bazi.dayPillar.zhi;
  const riZhiCang = DI_ZHI_CANG_GAN[riZhi] || [];
  const riZhiWx = DI_ZHI_WUXING[riZhi] || '';
  const distributions = bazi.shiShen.distribution || {};
  const guanSha = (distributions['正官'] || 0) + (distributions['七杀'] || 0);
  const caiXing = (distributions['正财'] || 0) + (distributions['偏财'] || 0);

  const allZhis = [bazi.yearPillar.zhi, bazi.monthPillar.zhi, bazi.dayPillar.zhi, bazi.hourPillar.zhi];
  const zhiRelations = [];

  // 日支冲合
  for (const [a, b] of DI_ZHI_LIU_CHONG) {
    if (riZhi === a && allZhis.includes(b)) {
      zhiRelations.push(`日支${riZhi}被${b}冲, 感情易波动`);
    }
    if (riZhi === b && allZhis.includes(a)) {
      zhiRelations.push(`日支${riZhi}被${a}冲, 感情易波动`);
    }
  }

  for (const [key] of Object.entries(DI_ZHI_LIU_HE)) {
    const p0 = key[0], p1 = key[1];
    if (riZhi === p0 && allZhis.includes(p1)) {
      zhiRelations.push(`日支与${p1}六合, 配偶缘佳`);
    }
    if (riZhi === p1 && allZhis.includes(p0)) {
      zhiRelations.push(`日支与${p0}六合, 配偶缘佳`);
    }
  }

  let analysis = zhiRelations.length > 0 ? zhiRelations.join('。') + '。' : '';
  analysis += `配偶宫为${riZhi}(藏${riZhiCang.join('')}), 五行属${riZhiWx}。`;
  analysis += `命局官杀${guanSha}个, 财星${caiXing}个。`;

  return analysis;
}

/**
 * 健康分析
 */
function getHealthAnalysis(wx, riWuxing) {
  const healthWuxing = {
    '木': '注意肝胆、筋骨、神经系统',
    '火': '注意心脏、血液循环、眼睛',
    '土': '注意脾胃、消化系统、肌肉',
    '金': '注意肺部、呼吸系统、骨骼牙齿',
    '水': '注意肾脏、泌尿系统、耳朵'
  };

  const total = wx.wood + wx.fire + wx.earth + wx.metal + wx.water;
  if (total === 0) return '';

  const issues = [];

  for (const [wxName, bodyPart] of Object.entries(healthWuxing)) {
    const enKey = WUXING_KEY[wxName];
    const value = enKey ? (wx[enKey] || 0) : 0;
    if (value === 0) {
      issues.push(`${bodyPart} (${wxName}缺)`);
    } else if (value / total > 0.4) {
      issues.push(`${bodyPart} (${wxName}过旺)`);
    }
  }

  let analysis = `日主属${riWuxing}, ${healthWuxing[riWuxing] || ''}。`;

  if (issues.length > 0) {
    analysis += `需注意: ${issues.join('; ')}。`;
  } else {
    analysis += '五行较为平衡, 健康状况良好。';
  }

  return analysis;
}

// ==================== 格式化输出 ====================

/**
 * 格式化八字为易读字符串
 * @param {object} bazi - calculateBazi返回值
 * @returns {string}
 */
export function formatBazi(bazi) {
  const lines = [];
  lines.push('═══════ 八字命盘 ═══════');
  lines.push('');
  lines.push(`出生: ${bazi.birth.date} ${bazi.birth.shiChen?.name || ''} (${bazi.birth.shiChen?.range || ''})`);
  lines.push(`生肖: ${bazi.birth.shengXiao}`);
  lines.push('');
  lines.push('四柱:');
  lines.push(`  年柱: ${bazi.yearPillar.gan}${bazi.yearPillar.zhi} (${bazi.nayin.year})`);
  lines.push(`  月柱: ${bazi.monthPillar.gan}${bazi.monthPillar.zhi} (${bazi.nayin.month})`);
  lines.push(`  日柱: ${bazi.dayPillar.gan}${bazi.dayPillar.zhi} (${bazi.nayin.day})`);
  lines.push(`  时柱: ${bazi.hourPillar.gan}${bazi.hourPillar.zhi} (${bazi.nayin.hour})`);
  lines.push('');
  lines.push(`五行(加权): 木${bazi.wuxing.wood} 火${bazi.wuxing.fire} 土${bazi.wuxing.earth} 金${bazi.wuxing.metal} 水${bazi.wuxing.water}`);
  lines.push(`旺衰: ${bazi.wuxing.wangshuai}`);
  lines.push(`空亡: ${bazi.kongWang.join('、')}`);
  lines.push('');
  lines.push('十神:');
  lines.push(`  年柱: 天干${bazi.shiShen.year.tianGan}, 地支${bazi.shiShen.year.diZhi.join('/')}`);
  lines.push(`  月柱: 天干${bazi.shiShen.month.tianGan}, 地支${bazi.shiShen.month.diZhi.join('/')}`);
  lines.push(`  日柱: 天干${bazi.shiShen.day.tianGan}, 地支${bazi.shiShen.day.diZhi.join('/')}`);
  lines.push(`  时柱: 天干${bazi.shiShen.hour.tianGan}, 地支${bazi.shiShen.hour.diZhi.join('/')}`);
  lines.push('');
  lines.push('十二长生(日干查各支):');
  lines.push(`  年支: ${bazi.changSheng.year}, 月支: ${bazi.changSheng.month}, 日支: ${bazi.changSheng.day}, 时支: ${bazi.changSheng.hour}`);

  if (bazi.shenSha) {
    lines.push('');
    lines.push('神煞:');
    if (bazi.shenSha.tianYiZai.length > 0) lines.push(`  天乙贵人: ${bazi.shenSha.tianYiZai.join('、')}`);
    if (bazi.shenSha.wenChangZai.length > 0) lines.push(`  文昌贵人: ${bazi.shenSha.wenChangZai.join('、')}`);
    if (bazi.shenSha.luShenZai.length > 0) lines.push(`  禄神: ${bazi.shenSha.luShenZai.join('、')}`);
    if (bazi.shenSha.yangRenZai.length > 0) lines.push(`  羊刃: ${bazi.shenSha.yangRenZai.join('、')}`);
    if (bazi.shenSha.taoHuaZai.length > 0) lines.push(`  桃花: ${bazi.shenSha.taoHuaZai.join('、')}`);
    if (bazi.shenSha.yiMaZai.length > 0) lines.push(`  驿马: ${bazi.shenSha.yiMaZai.join('、')}`);
  }

  lines.push('');
  lines.push('═══════════════════════');

  return lines.join('\n');
}

// ==================== 日柱测试 ====================

/**
 * 测试日柱计算正确性
 * 参考数据:
 *   1900-01-01 = 甲戌, 2000-01-01 = 戊午
 *   2024-01-01 = 甲子, 2024-06-07 = 壬寅
 *   2026-06-07 = 壬子
 */
export function testDayPillar() {
  const testCases = [
    { date: '1900-01-01', expected: '甲戌' },
    { date: '2000-01-01', expected: '戊午' },
    { date: '2024-01-01', expected: '甲子' },
    { date: '2024-06-07', expected: '壬寅' },
    { date: '2026-06-07', expected: '壬子' },
    { date: '2000-02-05', expected: '癸巳' },
    { date: '2020-01-25', expected: '丁卯' }
  ];

  const results = [];
  for (const tc of testCases) {
    const d = new Date(tc.date + 'T00:00:00');
    const days = daysFrom1900(d);
    const result = getDayGanZhiByDays(days);
    const pass = result.ganzhi === tc.expected;
    results.push({ date: tc.date, expected: tc.expected, actual: result.ganzhi, pass, days });
  }

  const passCount = results.filter(r => r.pass).length;
  console.log(`日柱测试: ${passCount}/${results.length} 通过`);

  return results;
}
