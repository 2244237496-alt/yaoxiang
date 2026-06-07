/**
 * 生肖数据
 */

window.SHENGXIAO_INFO = {
  '鼠': {
    order: 1,
    years: [2020, 2008, 1996, 1984, 1972, 1960, 1948, 1936, 1924],
    wuxing: '水',
    direction: '北',
    season: '冬',
    yinYang: '阳',
    character: '机智灵活，精明能干，善于交际，但有时过于计较，缺乏胆识',
    compatible: ['牛', '龙', '猴'],
    incompatible: ['马', '羊'],
    neutral: ['虎', '兔', '蛇', '鸡', '狗', '猪'],
    numbers: [2, 3],
    colors: ['蓝色', '金色'],
    flowers: ['百合', '非洲菊']
  },
  '牛': {
    order: 2,
    years: [2021, 2009, 1997, 1985, 1973, 1961, 1949, 1937, 1925],
    wuxing: '土',
    direction: '东北',
    season: '冬',
    yinYang: '阴',
    character: '勤奋踏实，诚实可靠，责任心强，但有时过于固执，缺乏变通',
    compatible: ['鼠', '蛇', '鸡'],
    incompatible: ['羊', '马'],
    neutral: ['虎', '兔', '龙', '猴', '狗', '猪'],
    numbers: [1, 4],
    colors: ['黄色', '棕色'],
    flowers: ['郁金香', '康乃馨']
  },
  '虎': {
    order: 3,
    years: [2022, 2010, 1998, 1986, 1974, 1962, 1950, 1938, 1926],
    wuxing: '木',
    direction: '东北',
    season: '春',
    yinYang: '阳',
    character: '勇敢自信，富有领导力，热情大方，但有时冲动急躁，缺乏耐心',
    compatible: ['马', '狗', '猪'],
    incompatible: ['猴', '蛇'],
    neutral: ['鼠', '牛', '兔', '龙', '鸡', '羊'],
    numbers: [1, 3, 7],
    colors: ['绿色', '青色'],
    flowers: ['梅花', '牡丹']
  },
  '兔': {
    order: 4,
    years: [2023, 2011, 1999, 1987, 1975, 1963, 1951, 1939, 1927],
    wuxing: '木',
    direction: '东',
    season: '春',
    yinYang: '阴',
    character: '温和善良，心思细腻，举止优雅，但有时过于保守，缺乏决断力',
    compatible: ['羊', '狗', '猪'],
    incompatible: ['鸡', '鼠'],
    neutral: ['牛', '虎', '龙', '蛇', '马', '猴'],
    numbers: [3, 4, 9],
    colors: ['绿色', '浅蓝色'],
    flowers: ['百合', '紫罗兰']
  },
  '龙': {
    order: 5,
    years: [2024, 2012, 2000, 1988, 1976, 1964, 1952, 1940, 1928],
    wuxing: '土',
    direction: '东南',
    season: '春',
    yinYang: '阳',
    character: '自信进取，精力充沛，才华横溢，但有时骄傲自大，好高骛远',
    compatible: ['鼠', '猴', '鸡'],
    incompatible: ['狗', '牛'],
    neutral: ['虎', '兔', '蛇', '马', '羊', '猪'],
    numbers: [1, 6, 7],
    colors: ['金色', '银色'],
    flowers: ['龙吐珠', '天堂鸟']
  },
  '蛇': {
    order: 6,
    years: [2025, 2013, 2001, 1989, 1977, 1965, 1953, 1941, 1929],
    wuxing: '火',
    direction: '东南',
    season: '夏',
    yinYang: '阴',
    character: '智慧深沉，直觉敏锐，处事冷静，但有时多疑嫉妒，城府较深',
    compatible: ['鸡', '牛', '猴'],
    incompatible: ['猪', '虎'],
    neutral: ['鼠', '兔', '龙', '马', '羊', '狗'],
    numbers: [2, 8, 9],
    colors: ['红色', '紫色'],
    flowers: ['兰花', '仙人掌']
  },
  '马': {
    order: 7,
    years: [2026, 2014, 2002, 1990, 1978, 1966, 1954, 1942, 1930],
    wuxing: '火',
    direction: '南',
    season: '夏',
    yinYang: '阳',
    character: '热情奔放，行动力强，开朗乐观，但有时急躁冲动，不喜拘束',
    compatible: ['羊', '虎', '狗'],
    incompatible: ['鼠', '牛'],
    neutral: ['兔', '龙', '蛇', '猴', '鸡', '猪'],
    numbers: [2, 3, 7],
    colors: ['红色', '橙色'],
    flowers: ['向日葵', '茉莉']
  },
  '羊': {
    order: 8,
    years: [2027, 2015, 2003, 1991, 1979, 1967, 1955, 1943, 1931],
    wuxing: '土',
    direction: '西南',
    season: '夏',
    yinYang: '阴',
    character: '温柔善良，心思细腻，有同情心，但有时优柔寡断，容易受挫',
    compatible: ['马', '兔', '猪'],
    incompatible: ['牛', '鼠'],
    neutral: ['虎', '龙', '蛇', '猴', '鸡', '狗'],
    numbers: [2, 7],
    colors: ['粉色', '灰色'],
    flowers: ['玫瑰', '康乃馨']
  },
  '猴': {
    order: 9,
    years: [2028, 2016, 2004, 1992, 1980, 1968, 1956, 1944, 1932],
    wuxing: '金',
    direction: '西南',
    season: '秋',
    yinYang: '阳',
    character: '聪明机智，灵巧多变，善于创新，但有时狡猾多变，缺乏恒心',
    compatible: ['鼠', '龙', '蛇'],
    incompatible: ['虎', '猪'],
    neutral: ['牛', '兔', '马', '羊', '鸡', '狗'],
    numbers: [4, 9],
    colors: ['白色', '天蓝色'],
    flowers: ['菊花', '紫薇']
  },
  '鸡': {
    order: 10,
    years: [2029, 2017, 2005, 1993, 1981, 1969, 1957, 1945, 1933],
    wuxing: '金',
    direction: '西',
    season: '秋',
    yinYang: '阴',
    character: '勤奋务实，追求完美，组织能力强，但有时过于挑剔，爱慕虚荣',
    compatible: ['牛', '龙', '蛇'],
    incompatible: ['兔', '狗'],
    neutral: ['鼠', '虎', '马', '羊', '猴', '猪'],
    numbers: [5, 7, 8],
    colors: ['金色', '棕色'],
    flowers: ['鸡冠花', '凤仙花']
  },
  '狗': {
    order: 11,
    years: [2030, 2018, 2006, 1994, 1982, 1970, 1958, 1946, 1934],
    wuxing: '土',
    direction: '西北',
    season: '秋',
    yinYang: '阳',
    character: '忠诚正直，责任感强，乐于助人，但有时过于保守，缺乏情趣',
    compatible: ['虎', '兔', '马'],
    incompatible: ['龙', '鸡'],
    neutral: ['鼠', '牛', '蛇', '羊', '猴', '猪'],
    numbers: [3, 4, 9],
    colors: ['黄色', '绿色'],
    flowers: ['玫瑰', '百合']
  },
  '猪': {
    order: 12,
    years: [2031, 2019, 2007, 1995, 1983, 1971, 1959, 1947, 1935],
    wuxing: '水',
    direction: '西北',
    season: '冬',
    yinYang: '阴',
    character: '真诚善良，心胸宽广，随和知足，但有时过于天真，容易受骗',
    compatible: ['虎', '兔', '羊'],
    incompatible: ['蛇', '猴'],
    neutral: ['鼠', '牛', '龙', '马', '鸡', '狗'],
    numbers: [2, 5, 8],
    colors: ['黑色', '蓝色'],
    flowers: ['绣球花', '猪笼草']
  }
};

// 十二生肖顺序
const SHENGXIAO_ORDER = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

/**
 * 根据年份查找生肖
 * 注意：依农历年份（春节为界），公历1-2月春节前仍属前一生肖
 * @param {number} year - 公历年份
 * @returns {string} 生肖名称
 */
function getShengxiaoByYear(year) {
  const names = SHENGXIAO_ORDER;
  // 以2020鼠年为基准：2020年是鼠年
  // (year - 2020) mod 12，0为鼠
  const baseYear = 2020;
  const diff = year - baseYear;
  const index = ((diff % 12) + 12) % 12;
  return names[index];
}

/**
 * 获取两个生肖的相合关系
 * @param {string} sx1 - 生肖1
 * @param {string} sx2 - 生肖2
 * @returns {object} { relation: '三合'|'六合'|'相冲'|'相害'|'相刑'|'一般', description }
 */
function getRelation(sx1, sx2) {
  if (sx1 === sx2) return { relation: '相同', description: '同一生肖，性格相近' };

  const info = window.SHENGXIAO_INFO[sx1];
  if (!info) return { relation: '未知', description: '' };

  if (info.compatible.includes(sx2)) {
    // 三合：每组三个生肖，如 鼠龙猴（间隔4）、牛蛇鸡、虎马狗、兔羊猪
    const order1 = info.order;
    const order2 = window.SHENGXIAO_INFO[sx2]?.order;
    if (order2 && Math.abs(order1 - order2) % 12 === 4) {
      return { relation: '三合', description: '互相促进，合作共赢之相' };
    }
    return { relation: '六合', description: '互为贵人，最理想的搭配' };
  }

  if (info.incompatible.includes(sx2)) {
    // 判断具体冲害
    const order1 = info.order;
    const order2 = window.SHENGXIAO_INFO[sx2]?.order;
    if (order2 && Math.abs(order1 - order2) % 12 === 6) {
      return { relation: '相冲', description: '对立冲突，需多加忍让' };
    }
    return { relation: '相害', description: '暗中不和，易生矛盾' };
  }

  return { relation: '一般', description: '无特殊的合或冲关系' };
}

/**
 * 获取某生肖在某一年的大体运势分析
 * @param {string} shengxiao - 生肖
 * @param {number} year - 年份
 * @returns {object} 运势分析
 */
function getYearFortune(shengxiao, year) {
  const info = window.SHENGXIAO_INFO[shengxiao];
  if (!info) return null;

  const currentSX = getShengxiaoByYear(year);
  const currentInfo = window.SHENGXIAO_INFO[currentSX];
  const relation = getRelation(shengxiao, currentSX);

  // 基础运势由太岁关系决定
  let baseScore = 60;
  let summary = '';
  const warnings = [];
  const tips = [];

  switch (relation.relation) {
    case '相同':
      baseScore = 50;
      summary = '值太岁：本命年，运势起伏较大，凡事需谨慎。宜多做好事、穿红色辟邪。';
      warnings.push('本命年犯太岁，注意健康和安全');
      warnings.push('宜低调行事，避免重大决策');
      tips.push('佩戴红色饰品化解太岁');
      tips.push('年初拜太岁祈福');
      break;
    case '三合':
      baseScore = 85;
      summary = '三合之年：贵人运强，事业感情均有好发展，诸事顺遂。';
      tips.push('宜积极进取，把握良机');
      tips.push('可尝试新的发展方向');
      break;
    case '六合':
      baseScore = 90;
      summary = '六合之年：最吉利的年份，贵人相助，财运亨通，喜事连连。';
      tips.push('大事可图，宜大胆行动');
      tips.push('适婚年龄者可考虑婚嫁');
      break;
    case '相冲':
      baseScore = 30;
      summary = '冲太岁：变动较多，容易有搬迁、转职等变动，注意人际关系。';
      warnings.push('冲太岁之年，注意交通安全');
      warnings.push('避免高风险投资');
      warnings.push('注意口舌是非');
      tips.push('宜动不宜静，可主动求变化解');
      tips.push('远行、搬家等变动较为吉利');
      break;
    case '相害':
      baseScore = 35;
      summary = '害太岁：易犯小人，人际关系须谨慎，注意口舌是非。';
      warnings.push('注意小人暗算');
      warnings.push('合同文件须仔细审核');
      tips.push('宜多与贵人交往');
      tips.push('保持低调，减少争议');
      break;
    default:
      baseScore = 70;
      summary = '平年：运势平稳，无大起大落，宜稳扎稳打。';
      tips.push('稳中求进，打好基础');
      break;
  }

  // 五行关系微调
  const fiveElements = { '金': 1, '水': 2, '木': 3, '火': 4, '土': 5 };
  const wx1 = fiveElements[info.wuxing];
  const wx2 = fiveElements[currentInfo.wuxing];
  const wuxingRelation = ((wx2 - wx1 + 5) % 5); // 0=同 1=生入 2=生出 3=克入 4=克出

  return {
    shengxiao,
    year,
    taiSui: currentSX,
    relation: relation.relation,
    relationDescription: relation.description,
    wuxingRelation,
    score: Math.min(100, Math.max(0, baseScore)),
    summary,
    warnings,
    tips,
    overall: baseScore >= 80 ? '大吉' : baseScore >= 60 ? '平顺' : baseScore >= 40 ? '小凶' : '大凶'
  };
}

/**
 * 获取生肖的基本信息
 * @param {string} shengxiao - 生肖名称
 * @returns {object|null}
 */
function getShengxiaoInfo(shengxiao) {
  return window.SHENGXIAO_INFO[shengxiao] || null;
}
