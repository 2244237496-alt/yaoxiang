/**
 * 称骨算命系统 — 袁天罡称骨法
 * 根据农历出生年（干支）、月、日、时辰计算骨重并给出批语
 */

import { YEAR_WEIGHT, MONTH_WEIGHT, DAY_WEIGHT, HOUR_WEIGHT, BONE_FORTUNE, toQian, toLiangQian, HOUR_TO_ZHI } from '../data/chenggu.js';

/**
 * 计算称骨重量
 * @param {string} yearGanZhi - 出生年干支，如 '甲子'
 * @param {number} lunarMonth - 农历月份 1-12
 * @param {number} lunarDay - 农历日 1-30
 * @param {string|number} hourZhi - 时辰地支（如 '子'）或小时（0-23）
 * @returns {object} { totalWeight, fortune, detail }
 */
export function calculateBoneWeight(yearGanZhi, lunarMonth, lunarDay, hour) {
  // 解析时辰
  let hourZhi;
  if (typeof hour === 'number') {
    hourZhi = HOUR_TO_ZHI[hour];
    if (!hourZhi) {
      throw new Error(`无效的小时: ${hour}，有效范围为 0-23`);
    }
  } else if (typeof hour === 'string') {
    hourZhi = hour;
  } else {
    throw new Error('时辰参数须为数字(0-23)或地支字符串');
  }

  // 取各组件重量
  const yearW = YEAR_WEIGHT[yearGanZhi];
  const monthW = MONTH_WEIGHT[lunarMonth];
  const dayW = DAY_WEIGHT[lunarDay];
  const hourW = HOUR_WEIGHT[hourZhi];

  if (yearW === undefined) throw new Error(`无效的年份干支: ${yearGanZhi}`);
  if (monthW === undefined) throw new Error(`无效的月份: ${lunarMonth}，有效范围为 1-12`);
  if (dayW === undefined) throw new Error(`无效的日: ${lunarDay}，有效范围为 1-30`);
  if (hourW === undefined) throw new Error(`无效的时辰: ${hourZhi}`);

  // 总钱数
  const totalQian = toQian(yearW) + toQian(monthW) + toQian(dayW) + toQian(hourW);
  const totalWeight = toLiangQian(totalQian);

  // 查找最匹配的批语
  const fortune = getBoneFortune(totalWeight);

  return {
    totalWeight,           // 总重量（两.钱）
    totalQian,             // 总钱数（整数）
    detail: {
      yearWeight: yearW,
      monthWeight: monthW,
      dayWeight: dayW,
      hourWeight: hourW
    },
    weightBreakdown: `年柱(${yearGanZhi})${yearW}两 + 月(${lunarMonth})${monthW}两 + 日(${lunarDay})${dayW}两 + 时(${hourZhi})${hourW}两 = ${totalWeight.toFixed(1)}两`,
    fortune,
    yearGanZhi,
    lunarMonth,
    lunarDay,
    hourZhi
  };
}

/**
 * 根据总重量查找对应批语
 * 优先精确匹配，找不到则取不大于该重量且最接近的条目
 * @param {number} totalWeight - 总重量（两.钱）
 * @returns {object} 批语对象 { text, summary, level }
 */
export function getBoneFortune(totalWeight) {
  // 精确匹配
  const key = totalWeight.toFixed(1);
  if (BONE_FORTUNE[key]) {
    return BONE_FORTUNE[key];
  }

  // 模糊匹配：找到不大于该重量且最接近的批语
  const available = Object.keys(BONE_FORTUNE)
    .map(k => parseFloat(k))
    .sort((a, b) => a - b);

  let match = available[0]; // 默认最小值
  for (const w of available) {
    if (w <= totalWeight) {
      match = w;
    } else {
      break;
    }
  }

  return BONE_FORTUNE[match.toFixed(1)] || {
    text: '【待核实】此骨重暂无对应批语',
    summary: '骨重级别待定',
    level: '未知'
  };
}

/**
 * 根据公历出生日期和时间计算称骨
 * 注意：此函数需要外部提供公历→农历的转换
 * 如不具备农历转换能力，请使用 calculateBoneWeight 直接传入农历数据
 *
 * @param {object} lunarDate - 已转换好的农历日期对象
 * @param {string} lunarDate.yearGanZhi - 年干支
 * @param {number} lunarDate.month - 农历月
 * @param {number} lunarDate.day - 农历日
 * @param {number} lunarDate.hour - 小时 0-23
 * @returns {object} 称骨结果
 */
export function calculateByLunarDate(lunarDate) {
  return calculateBoneWeight(
    lunarDate.yearGanZhi,
    lunarDate.month,
    lunarDate.day,
    lunarDate.hour
  );
}

/**
 * 获取完整的批语等级说明
 */
export function getLevelDescription(level) {
  const map = {
    '下下': '命途多舛，多劳少获，一生困苦艰辛',
    '下': '命运不济，需比常人多付出一倍的努力',
    '中下': '命运偏弱，早中年多波折，晚景稍有改善',
    '中': '命运一般，有发展的可能，但需自身努力',
    '中上': '命运较好，具有一定的优势和福分',
    '上': '命运良好，福禄较厚，一生顺遂',
    '上上': '命运极好，大富大贵之命，福寿双全',
    '极': '万中无一的绝佳命格'
  };
  return map[level] || '未知等级';
}
