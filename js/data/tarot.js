/**
 * 塔罗牌数据 — 共78张
 * 22张大阿尔卡纳（Major Arcana）+ 56张小阿尔卡纳（Minor Arcana）
 */

// ==================== 大阿尔卡纳（22张） ====================
window.MAJOR_ARCANA = [
  {
    id: 0,
    name: '愚者',
    nameEn: 'The Fool',
    upright: '新的开始，冒险精神，天真无邪，无限可能，自由自在',
    reversed: '鲁莽行事，愚蠢冲动，迟疑不决，疏忽大意，不负责任',
    keywords: ['开始', '自由', '冒险', '天真', '无限可能'],
    element: '风',
    planet: '天王星',
    number: 0
  },
  {
    id: 1,
    name: '魔术师',
    nameEn: 'The Magician',
    upright: '创造力，技能，意志力，自信，新的机会，万事俱备',
    reversed: '滥用才能，欺骗，计划受阻，能力不足，缺乏自信',
    keywords: ['创造', '技能', '意志', '自信', '沟通'],
    element: '风',
    planet: '水星',
    number: 1
  },
  {
    id: 2,
    name: '女祭司',
    nameEn: 'The High Priestess',
    upright: '直觉，神秘，智慧，冷静，潜意识，内在知识',
    reversed: '忽视直觉，秘密泄露，情感封闭，知识匮乏，肤浅',
    keywords: ['直觉', '智慧', '神秘', '潜意识', '冷静'],
    element: '水',
    planet: '月亮',
    number: 2
  },
  {
    id: 3,
    name: '皇后',
    nameEn: 'The Empress',
    upright: '丰收，母性，丰饶，美丽，自然，艺术，舒适',
    reversed: '浪费，依赖，创造力受阻，情感贫乏，不孕',
    keywords: ['丰收', '母性', '美丽', '丰饶', '艺术'],
    element: '土',
    planet: '金星',
    number: 3
  },
  {
    id: 4,
    name: '皇帝',
    nameEn: 'The Emperor',
    upright: '权威，领导力，稳定，秩序，父性，掌控，成就',
    reversed: '暴政，滥用权力，不成熟，失控，缺乏纪律',
    keywords: ['权威', '领导', '稳定', '秩序', '掌控'],
    element: '火',
    planet: '白羊座/火星',
    number: 4
  },
  {
    id: 5,
    name: '教皇',
    nameEn: 'The Hierophant',
    upright: '传统，信仰，教育，精神指引，结婚，仪式感',
    reversed: '反传统，教条主义，盲目崇拜，不守规矩，误导',
    keywords: ['传统', '信仰', '教育', '指引', '仪式'],
    element: '土',
    planet: '金牛座',
    number: 5
  },
  {
    id: 6,
    name: '恋人',
    nameEn: 'The Lovers',
    upright: '爱情，结合，选择，和谐，信任，价值观一致',
    reversed: '分离，不忠，错误选择，价值观冲突，诱惑',
    keywords: ['爱情', '选择', '结合', '和谐', '信任'],
    element: '风',
    planet: '双子座/水星',
    number: 6
  },
  {
    id: 7,
    name: '战车',
    nameEn: 'The Chariot',
    upright: '胜利，意志力，决心，掌控局面，突破困难，前进',
    reversed: '失败，失控，冲突，暴力，好胜心过强，挫折',
    keywords: ['胜利', '意志', '决心', '前进', '突破'],
    element: '水',
    planet: '巨蟹座',
    number: 7
  },
  {
    id: 8,
    name: '力量',
    nameEn: 'Strength',
    upright: '勇气，力量，耐心，自信，内在力量，以柔克刚',
    reversed: '软弱，失控，缺乏信心，滥用力量，自我怀疑',
    keywords: ['勇气', '力量', '耐心', '克制', '自信'],
    element: '火',
    planet: '狮子座',
    number: 8
  },
  {
    id: 9,
    name: '隐士',
    nameEn: 'The Hermit',
    upright: '内省，独处，寻求真理，智慧，指引，深思熟虑',
    reversed: '孤立，逃避，恐惧，拒绝建议，过分谨慎',
    keywords: ['内省', '智慧', '独处', '探索', '指引'],
    element: '土',
    planet: '处女座/水星',
    number: 9
  },
  {
    id: 10,
    name: '命运之轮',
    nameEn: 'Wheel of Fortune',
    upright: '命运转变，运气，转折点，机遇，循环，因果',
    reversed: '厄运，逆境，停滞，时机未到，偏离轨道',
    keywords: ['命运', '转变', '机遇', '循环', '运气'],
    element: '火',
    planet: '木星',
    number: 10
  },
  {
    id: 11,
    name: '正义',
    nameEn: 'Justice',
    upright: '公正，平衡，法律，真相，因果报应，理性决断',
    reversed: '不公，偏见，逃避责任，法律纠纷，失衡',
    keywords: ['公正', '平衡', '法律', '真相', '因果'],
    element: '风',
    planet: '天秤座/金星',
    number: 11
  },
  {
    id: 12,
    name: '倒吊人',
    nameEn: 'The Hanged Man',
    upright: '牺牲，换位思考，等待，顺其自然，顿悟，解脱',
    reversed: '无谓牺牲，固执己见，逃避现实，停滞不前',
    keywords: ['牺牲', '等待', '换位', '顿悟', '顺其自然'],
    element: '水',
    planet: '海王星',
    number: 12
  },
  {
    id: 13,
    name: '死神',
    nameEn: 'Death',
    upright: '结束，转变，重生，放下过去，新的开始，蜕变',
    reversed: '抗拒改变，停滞，恐惧，衰退，挥之不去',
    keywords: ['结束', '转变', '重生', '放下', '蜕变'],
    element: '水',
    planet: '天蝎座/冥王星',
    number: 13
  },
  {
    id: 14,
    name: '节制',
    nameEn: 'Temperance',
    upright: '调和，平衡，适度，耐心，融合，治愈，中庸之道',
    reversed: '失衡，过度，冲突，不协调，缺乏节制',
    keywords: ['调和', '平衡', '适度', '融合', '治愈'],
    element: '火',
    planet: '射手座/木星',
    number: 14
  },
  {
    id: 15,
    name: '恶魔',
    nameEn: 'The Devil',
    upright: '束缚，欲望，物质主义，成瘾，诱惑，无力感',
    reversed: '摆脱束缚，觉醒，重获自由，克服心魔',
    keywords: ['束缚', '欲望', '诱惑', '成瘾', '觉醒'],
    element: '土',
    planet: '摩羯座/土星',
    number: 15
  },
  {
    id: 16,
    name: '高塔',
    nameEn: 'The Tower',
    upright: '突变，破坏，崩溃，释放，突如其来的变化，真相暴露',
    reversed: '侥幸逃避，坐以待毙，恐惧改变，压制爆发',
    keywords: ['突变', '破坏', '崩塌', '释放', '真相'],
    element: '火',
    planet: '火星',
    number: 16
  },
  {
    id: 17,
    name: '星星',
    nameEn: 'The Star',
    upright: '希望，灵感，宁静，治愈，信心，美好的未来',
    reversed: '绝望，沮丧，灵感枯竭，缺乏信心，迷茫',
    keywords: ['希望', '灵感', '治愈', '宁静', '信心'],
    element: '风',
    planet: '水瓶座/天王星',
    number: 17
  },
  {
    id: 18,
    name: '月亮',
    nameEn: 'The Moon',
    upright: '幻觉，恐惧，潜意识，直觉，梦境，不安，迷惑',
    reversed: '恐惧消散，真相揭晓，克服幻觉，理性回归',
    keywords: ['幻觉', '恐惧', '潜意识', '梦境', '迷惑'],
    element: '水',
    planet: '双鱼座/海王星',
    number: 18
  },
  {
    id: 19,
    name: '太阳',
    nameEn: 'The Sun',
    upright: '快乐，成功，活力，光明，成就，生命力，温暖',
    reversed: '乌云遮日，挫折，不快乐，延迟成功，缺乏活力',
    keywords: ['快乐', '成功', '活力', '光明', '温暖'],
    element: '火',
    planet: '太阳',
    number: 19
  },
  {
    id: 20,
    name: '审判',
    nameEn: 'Judgement',
    upright: '觉醒，重生，召唤，宽恕，清算，新的开始',
    reversed: '逃避清算，后悔，自我批判，拒绝召唤，无法释怀',
    keywords: ['觉醒', '重生', '召唤', '宽恕', '清算'],
    element: '火',
    planet: '冥王星',
    number: 20
  },
  {
    id: 21,
    name: '世界',
    nameEn: 'The World',
    upright: '完成，圆满，成功，融合，旅行，终身成就，完美结局',
    reversed: '未完成，停滞，功亏一篑，固步自封，不完美',
    keywords: ['完成', '圆满', '成功', '融合', '旅行'],
    element: '土',
    planet: '土星',
    number: 21
  }
];

// ==================== 小阿尔卡纳（56张） ====================

// 权杖（Wands）— 火元素，代表行动、创意、事业
const SUIT_WANDS = [
  {
    rank: 'ace', name: '权杖王牌', nameEn: 'Ace of Wands',
    upright: '新机会，创造力，灵感，成长，激情，新的开始',
    reversed: '错失机会，创意枯竭，拖延，缺乏方向，开始不顺',
    keywords: ['新机会', '灵感', '创造力', '开始'], suit: 'wands', element: '火'
  },
  {
    rank: 'two', name: '权杖二', nameEn: 'Two of Wands',
    upright: '计划，远见，决策，探索，个人力量',
    reversed: '恐惧未知，缺乏计划，犹豫不决，受限',
    keywords: ['计划', '远见', '决策', '探索'], suit: 'wands', element: '火'
  },
  {
    rank: 'three', name: '权杖三', nameEn: 'Three of Wands',
    upright: '扩展，远见，先行，贸易，海外机会',
    reversed: '阻碍，视野狭窄，计划受阻，保守',
    keywords: ['扩展', '远见', '探索', '贸易'], suit: 'wands', element: '火'
  },
  {
    rank: 'four', name: '权杖四', nameEn: 'Four of Wands',
    upright: '庆祝，和谐，稳定，回家，成果，节日',
    reversed: '不和谐，不稳定，居无定所，聚会取消',
    keywords: ['庆祝', '和谐', '稳定', '家庭'], suit: 'wands', element: '火'
  },
  {
    rank: 'five', name: '权杖五', nameEn: 'Five of Wands',
    upright: '竞争，冲突，挑战，百家争鸣，辩论',
    reversed: '避免冲突，和解，妥协，内斗化解',
    keywords: ['竞争', '冲突', '挑战', '辩论'], suit: 'wands', element: '火'
  },
  {
    rank: 'six', name: '权杖六', nameEn: 'Six of Wands',
    upright: '胜利，认可，赞誉，进步，自信，成功',
    reversed: '失败，傲慢，嫉妒，不认可，过度自负',
    keywords: ['胜利', '认可', '赞誉', '进步'], suit: 'wands', element: '火'
  },
  {
    rank: 'seven', name: '权杖七', nameEn: 'Seven of Wands',
    upright: '坚守，抗争，捍卫立场，勇气，决心',
    reversed: '投降，放弃，力不从心，被压倒，屈服',
    keywords: ['坚守', '抗争', '勇气', '立场'], suit: 'wands', element: '火'
  },
  {
    rank: 'eight', name: '权杖八', nameEn: 'Eight of Wands',
    upright: '迅速，行动，进展，消息，旅行，畅通无阻',
    reversed: '延迟，混乱，停滞，信息错误，冲动',
    keywords: ['迅速', '行动', '进展', '消息'], suit: 'wands', element: '火'
  },
  {
    rank: 'nine', name: '权杖九', nameEn: 'Nine of Wands',
    upright: '坚持，韧性，最后一程，警戒，伤痛中成长',
    reversed: '放弃，疲惫，偏执，过度防御，崩溃',
    keywords: ['坚持', '韧性', '警戒', '防御'], suit: 'wands', element: '火'
  },
  {
    rank: 'ten', name: '权杖十', nameEn: 'Ten of Wands',
    upright: '负担，责任，压力，过度劳累，坚持到底',
    reversed: '卸下重担，逃避责任，不堪重负，释放',
    keywords: ['负担', '责任', '压力', '坚持'], suit: 'wands', element: '火'
  },
  {
    rank: 'page', name: '权杖侍从', nameEn: 'Page of Wands',
    upright: '好奇心，新消息，热情学习，探索精神，好的开端',
    reversed: '坏消息，懒惰，缺乏方向，三分钟热度',
    keywords: ['好奇', '探索', '热情', '学习'], suit: 'wands', element: '火'
  },
  {
    rank: 'knight', name: '权杖骑士', nameEn: 'Knight of Wands',
    upright: '行动力，冒险，热情，冲动，追求梦想',
    reversed: '鲁莽，急躁，半途而废，争吵，失控',
    keywords: ['行动', '冒险', '热情', '追求'], suit: 'wands', element: '火'
  },
  {
    rank: 'queen', name: '权杖王后', nameEn: 'Queen of Wands',
    upright: '自信，独立，魅力，热情好客，事业成功',
    reversed: '嫉妒，专横，缺乏自信，善变，冷漠',
    keywords: ['自信', '魅力', '独立', '事业'], suit: 'wands', element: '火'
  },
  {
    rank: 'king', name: '权杖国王', nameEn: 'King of Wands',
    upright: '领导力，远见，企业家精神，荣誉，魄力',
    reversed: '专制，冲动，滥用权力，不可靠，狂热',
    keywords: ['领导', '远见', '创业', '魄力'], suit: 'wands', element: '火'
  }
];

// 圣杯（Cups）— 水元素，代表情感、关系、直觉
const SUIT_CUPS = [
  {
    rank: 'ace', name: '圣杯王牌', nameEn: 'Ace of Cups',
    upright: '新感情，喜悦，丰沛的爱，直觉，创造力',
    reversed: '情感空虚，错过机会，情绪不稳，压抑',
    keywords: ['新感情', '喜悦', '爱', '直觉'], suit: 'cups', element: '水'
  },
  {
    rank: 'two', name: '圣杯二', nameEn: 'Two of Cups',
    upright: '两情相悦，合作，和谐，平等，婚恋',
    reversed: '分手，不平等，关系破裂，不信任',
    keywords: ['爱情', '合作', '和谐', '结合'], suit: 'cups', element: '水'
  },
  {
    rank: 'three', name: '圣杯三', nameEn: 'Three of Cups',
    upright: '庆祝，友谊，社交，聚会，欢乐，感恩',
    reversed: '过度放纵，流言蜚语，孤立，三人行',
    keywords: ['庆祝', '友谊', '社交', '欢乐'], suit: 'cups', element: '水'
  },
  {
    rank: 'four', name: '圣杯四', nameEn: 'Four of Cups',
    upright: '沉思，厌倦，不满，漠然，错失机会',
    reversed: '觉醒，新动力，走出低谷，抓住机遇',
    keywords: ['沉思', '厌倦', '不满', '觉醒'], suit: 'cups', element: '水'
  },
  {
    rank: 'five', name: '圣杯五', nameEn: 'Five of Cups',
    upright: '失落，悲伤，后悔，专注于失去，绝望',
    reversed: '接受，放下，看到希望，重新开始',
    keywords: ['失落', '悲伤', '后悔', '放下'], suit: 'cups', element: '水'
  },
  {
    rank: 'six', name: '圣杯六', nameEn: 'Six of Cups',
    upright: '回忆，童年，怀旧，纯真，感恩，重逢',
    reversed: '活在过去，无法成长，遗忘，离开舒适区',
    keywords: ['回忆', '怀旧', '童真', '感恩'], suit: 'cups', element: '水'
  },
  {
    rank: 'seven', name: '圣杯七', nameEn: 'Seven of Cups',
    upright: '幻想，选择，白日梦，欲望，多重可能',
    reversed: '清醒，做出选择，现实，脚踏实地',
    keywords: ['幻想', '选择', '欲望', '清醒'], suit: 'cups', element: '水'
  },
  {
    rank: 'eight', name: '圣杯八', nameEn: 'Eight of Cups',
    upright: '离开，寻找更高意义，舍弃，转变，探索',
    reversed: '徘徊不定，害怕离开，不敢舍弃，原地踏步',
    keywords: ['离开', '寻找', '舍弃', '转变'], suit: 'cups', element: '水'
  },
  {
    rank: 'nine', name: '圣杯九', nameEn: 'Nine of Cups',
    upright: '心想事成，满足，知足，享乐，愿望成真',
    reversed: '不满足，贪婪，物质主义，愿望落空',
    keywords: ['满足', '知足', '愿望', '享乐'], suit: 'cups', element: '水'
  },
  {
    rank: 'ten', name: '圣杯十', nameEn: 'Ten of Cups',
    upright: '家庭幸福，和谐圆满，真爱，情感丰收，完美',
    reversed: '家庭不和，破裂，理想破灭，矛盾',
    keywords: ['幸福', '家庭', '圆满', '真爱'], suit: 'cups', element: '水'
  },
  {
    rank: 'page', name: '圣杯侍从', nameEn: 'Page of Cups',
    upright: '浪漫信息，直觉，创意萌发，心灵成长',
    reversed: '情感不成熟，欺骗，创意受阻，情绪化',
    keywords: ['浪漫', '直觉', '创意', '心灵'], suit: 'cups', element: '水'
  },
  {
    rank: 'knight', name: '圣杯骑士', nameEn: 'Knight of Cups',
    upright: '浪漫追求，理想主义，邀约，艺术气质，魅力',
    reversed: '欺骗，不成熟，情绪失控，不切实际',
    keywords: ['浪漫', '理想', '艺术', '追求'], suit: 'cups', element: '水'
  },
  {
    rank: 'queen', name: '圣杯王后', nameEn: 'Queen of Cups',
    upright: '情感成熟，同理心，关怀，直觉力，慈爱',
    reversed: '情绪失控，依赖，不安全感，过度敏感',
    keywords: ['同理心', '关怀', '直觉', '慈爱'], suit: 'cups', element: '水'
  },
  {
    rank: 'king', name: '圣杯国王', nameEn: 'King of Cups',
    upright: '情感稳定，宽容，稳重，艺术才华，领导',
    reversed: '情感操纵，冷漠，压抑，滥用情感',
    keywords: ['宽容', '稳重', '艺术', '情感'], suit: 'cups', element: '水'
  }
];

// 宝剑（Swords）— 风元素，代表思想、沟通、冲突
const SUIT_SWORDS = [
  {
    rank: 'ace', name: '宝剑王牌', nameEn: 'Ace of Swords',
    upright: '清晰，真相，新想法，公正，果断，突破',
    reversed: '混乱，欺骗，错误判断，暴力，误解',
    keywords: ['清晰', '真相', '果断', '突破'], suit: 'swords', element: '风'
  },
  {
    rank: 'two', name: '宝剑二', nameEn: 'Two of Swords',
    upright: '抉择，僵持，平衡，闭眼不见，两难',
    reversed: '做出决定，走出僵局，释放压力，信息过载',
    keywords: ['抉择', '僵持', '平衡', '两难'], suit: 'swords', element: '风'
  },
  {
    rank: 'three', name: '宝剑三', nameEn: 'Three of Swords',
    upright: '心碎，悲伤，分离，背叛，痛苦，失恋',
    reversed: '愈合，释怀，走出悲伤，原谅，恢复',
    keywords: ['心碎', '悲伤', '分离', '愈合'], suit: 'swords', element: '风'
  },
  {
    rank: 'four', name: '宝剑四', nameEn: 'Four of Swords',
    upright: '休息，休整，沉思，恢复，避世，积蓄力量',
    reversed: '无法休息，失眠，焦虑，重返战场',
    keywords: ['休息', '沉思', '恢复', '积蓄'], suit: 'swords', element: '风'
  },
  {
    rank: 'five', name: '宝剑五', nameEn: 'Five of Swords',
    upright: '失败，羞辱，争斗，自私，赢了一时输了一世',
    reversed: '和解，后悔，妥协退让，吸取教训',
    keywords: ['失败', '冲突', '自私', '和解'], suit: 'swords', element: '风'
  },
  {
    rank: 'six', name: '宝剑六', nameEn: 'Six of Swords',
    upright: '过渡，疗伤，前行，离开困境，渐入佳境',
    reversed: '无法前进，停滞，拒绝改变，逃避',
    keywords: ['过渡', '疗伤', '前行', '离开'], suit: 'swords', element: '风'
  },
  {
    rank: 'seven', name: '宝剑七', nameEn: 'Seven of Swords',
    upright: '策略，狡黠，隐瞒，暗中行动，不诚实',
    reversed: '暴露，真相大白，悔改，自首',
    keywords: ['策略', '隐瞒', '狡黠', '暗中'], suit: 'swords', element: '风'
  },
  {
    rank: 'eight', name: '宝剑八', nameEn: 'Eight of Swords',
    upright: '束缚，限制，无力感，自我怀疑，困境',
    reversed: '解脱，自由，找到出路，突破限制',
    keywords: ['束缚', '限制', '困境', '解脱'], suit: 'swords', element: '风'
  },
  {
    rank: 'nine', name: '宝剑九', nameEn: 'Nine of Swords',
    upright: '焦虑，噩梦，担忧，失眠，负罪感，恐惧',
    reversed: '释怀，克服恐惧，找到帮助，光明在即',
    keywords: ['焦虑', '恐惧', '担忧', '释怀'], suit: 'swords', element: '风'
  },
  {
    rank: 'ten', name: '宝剑十', nameEn: 'Ten of Swords',
    upright: '终结，背叛，痛苦至极，无可挽回，绝境',
    reversed: '触底反弹，转机，幸存，重生，走出最低谷',
    keywords: ['终结', '绝境', '转机', '重生'], suit: 'swords', element: '风'
  },
  {
    rank: 'page', name: '宝剑侍从', nameEn: 'Page of Swords',
    upright: '好奇心，新想法，机敏，警戒，侦探精神',
    reversed: '口无遮拦，消息不灵，闲言碎语，缺乏准备',
    keywords: ['好奇', '机敏', '警戒', '新想法'], suit: 'swords', element: '风'
  },
  {
    rank: 'knight', name: '宝剑骑士', nameEn: 'Knight of Swords',
    upright: '决心，迅速行动，斗志昂扬，冲锋，激辩',
    reversed: '鲁莽，好斗，缺乏方向，冲动伤人',
    keywords: ['决断', '迅速', '斗志', '行动'], suit: 'swords', element: '风'
  },
  {
    rank: 'queen', name: '宝剑王后', nameEn: 'Queen of Swords',
    upright: '智慧，理性，客观，独立，洞察力，公正判断',
    reversed: '刻薄，冷酷，偏见，刻板，过度理性',
    keywords: ['智慧', '理性', '独立', '洞察'], suit: 'swords', element: '风'
  },
  {
    rank: 'king', name: '宝剑国王', nameEn: 'King of Swords',
    upright: '权威，理性，法律，智慧，果断，公正诚实',
    reversed: '专制，冷酷，滥用权力，不公正，无原则',
    keywords: ['权威', '公正', '理性', '法律'], suit: 'swords', element: '风'
  }
];

// 星币（Pentacles）— 土元素，代表物质、财富、务实
const SUIT_PENTACLES = [
  {
    rank: 'ace', name: '星币王牌', nameEn: 'Ace of Pentacles',
    upright: '新财运，机会，务实，财富，稳定，种子',
    reversed: '损失，错失良机，挥霍，财务不稳',
    keywords: ['财运', '机会', '务实', '财富'], suit: 'pentacles', element: '土'
  },
  {
    rank: 'two', name: '星币二', nameEn: 'Two of Pentacles',
    upright: '平衡，变通，兼顾，金融波动，灵活应变',
    reversed: '失衡，财务混乱，超负荷，无法兼顾',
    keywords: ['平衡', '变通', '兼顾', '灵活'], suit: 'pentacles', element: '土'
  },
  {
    rank: 'three', name: '星币三', nameEn: 'Three of Pentacles',
    upright: '团队合作，技艺精湛，学习，规划，建筑',
    reversed: '缺乏合作，质量低下，不专注，自私',
    keywords: ['合作', '技艺', '学习', '规划'], suit: 'pentacles', element: '土'
  },
  {
    rank: 'four', name: '星币四', nameEn: 'Four of Pentacles',
    upright: '守财，稳定，控制，保守，安全感，吝啬',
    reversed: '挥霍，放手，慷慨，财务损失，开放',
    keywords: ['守财', '稳定', '控制', '保守'], suit: 'pentacles', element: '土'
  },
  {
    rank: 'five', name: '星币五', nameEn: 'Five of Pentacles',
    upright: '贫困，无助，困苦，被排斥，疾病，孤单',
    reversed: '好转，恢复，慈善，被接纳，找到帮助',
    keywords: ['贫困', '困苦', '恢复', '帮助'], suit: 'pentacles', element: '土'
  },
  {
    rank: 'six', name: '星币六', nameEn: 'Six of Pentacles',
    upright: '慷慨，给予，慈善，公平分配，借贷',
    reversed: '吝啬，不平等，贪得无厌，债务',
    keywords: ['慷慨', '给予', '慈善', '分配'], suit: 'pentacles', element: '土'
  },
  {
    rank: 'seven', name: '星币七', nameEn: 'Seven of Pentacles',
    upright: '耐心等待，评估，投资回报，耕耘，反思',
    reversed: '浪费努力，无回报，不满，急躁',
    keywords: ['等待', '评估', '投资', '耕耘'], suit: 'pentacles', element: '土'
  },
  {
    rank: 'eight', name: '星币八', nameEn: 'Eight of Pentacles',
    upright: '勤奋，专注，技艺，学习，精益求精，学徒',
    reversed: '懒惰，品质低，匆忙，厌倦，不求上进',
    keywords: ['勤奋', '专注', '技艺', '学习'], suit: 'pentacles', element: '土'
  },
  {
    rank: 'nine', name: '星币九', nameEn: 'Nine of Pentacles',
    upright: '富足，独立，自我成就，优雅生活，满足',
    reversed: '财务问题，依赖，奢侈过度，不安',
    keywords: ['富足', '独立', '成就', '优雅'], suit: 'pentacles', element: '土'
  },
  {
    rank: 'ten', name: '星币十', nameEn: 'Ten of Pentacles',
    upright: '财富传承，家族，长久，继承，繁荣稳定',
    reversed: '家族纠纷，破产，败家，家庭矛盾',
    keywords: ['传承', '家族', '持久', '繁荣'], suit: 'pentacles', element: '土'
  },
  {
    rank: 'page', name: '星币侍从', nameEn: 'Page of Pentacles',
    upright: '学习，务实进取，新技能，勤奋，踏实',
    reversed: '学习障碍，不切实际，叛逆，缺乏动力',
    keywords: ['学习', '务实', '勤奋', '技能'], suit: 'pentacles', element: '土'
  },
  {
    rank: 'knight', name: '星币骑士', nameEn: 'Knight of Pentacles',
    upright: '踏实可靠，稳重，坚持，勤奋，例行公事',
    reversed: '无聊，懒惰，顽固，不进取，停滞',
    keywords: ['可靠', '稳重', '坚持', '勤奋'], suit: 'pentacles', element: '土'
  },
  {
    rank: 'queen', name: '星币王后', nameEn: 'Queen of Pentacles',
    upright: '务实，持家有道，富足，慷慨，养护，信任',
    reversed: '物质主义，占有欲，不够慷慨，忽视',
    keywords: ['务实', '持家', '富足', '养护'], suit: 'pentacles', element: '土'
  },
  {
    rank: 'king', name: '星币国王', nameEn: 'King of Pentacles',
    upright: '财富，成功，稳重，务实，商业成就，安全感',
    reversed: '贪婪，腐败，物质至上，挥霍财富',
    keywords: ['财富', '成功', '务实', '商业'], suit: 'pentacles', element: '土'
  }
];

// 全部小阿尔卡纳（扁平化）
const ALL_MINOR_ARCANA = [
  ...SUIT_WANDS,
  ...SUIT_CUPS,
  ...SUIT_SWORDS,
  ...SUIT_PENTACLES
];

window.MINOR_ARCANA = ALL_MINOR_ARCANA;

window.TAROT_DECK = [...window.MAJOR_ARCANA, ...ALL_MINOR_ARCANA];

// 全部78张牌的集合（含type标记，供内部使用）
const ALL_CARDS = [
  ...window.MAJOR_ARCANA.map(c => ({ ...c, type: 'major' })),
  ...ALL_MINOR_ARCANA.map(c => ({ ...c, type: 'minor' }))
];

// ==================== 工具函数 ====================

/**
 * 按ID获取大阿尔卡纳牌
 */
function getMajorCard(id) {
  return window.MAJOR_ARCANA.find(c => c.id === id) || null;
}

/**
 * 按花色和点数获取小阿尔卡纳牌
 */
function getMinorCard(suit, rank) {
  const suitMap = { wands: SUIT_WANDS, cups: SUIT_CUPS, swords: SUIT_SWORDS, pentacles: SUIT_PENTACLES };
  const cards = suitMap[suit];
  if (!cards) return null;
  return cards.find(c => c.rank === rank) || null;
}

/**
 * 随机抽取n张牌（含正逆位）
 * @param {number} n - 抽取数量
 * @returns {Array} 包含牌信息和正逆位标记的数组
 */
function drawCards(n = 1) {
  const pool = [...ALL_CARDS];
  const result = [];
  for (let i = 0; i < n && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const card = pool.splice(idx, 1)[0];
    const reversed = Math.random() < 0.5;
    result.push({
      ...card,
      reversed,
      meaning: reversed ? card.reversed : card.upright
    });
  }
  return result;
}

/**
 * 根据牌面获取解读
 */
function interpretCard(card, reversed = false) {
  return {
    name: card.name,
    nameEn: card.nameEn,
    reversed,
    meaning: reversed ? card.reversed : card.upright,
    keywords: card.keywords,
    element: card.element
  };
}
