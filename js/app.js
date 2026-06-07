// === 爻象 AI命理大师 - 主应用 ===

// ========== 应用状态 ==========
const state = {
  currentPage: 'home',
  theme: localStorage.getItem('yx-theme') || 'light',
  baziData: null,
  hexagramData: null,
  tarotSelection: [],
  tabHistory: [],
};

// ========== 页面导航 ==========
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  const page = document.getElementById(`page-${pageId}`);
  const tab = document.querySelector(`[data-page="${pageId}"]`);
  if (page) page.classList.add('active');
  if (tab) tab.classList.add('active');

  state.currentPage = pageId;
  document.getElementById('app-main').scrollTop = 0;

  // 懒加载页面内容
  loadPageContent(pageId);
}

function goBack() {
  if (state.tabHistory.length > 0) {
    navigateTo(state.tabHistory.pop());
  } else {
    navigateTo('home');
  }
}

// ========== 页面内容加载 ==========
function loadPageContent(pageId) {
  try {
    switch (pageId) {
      case 'home': renderHome(); break;
      case 'liuyao': renderLiuYao(); break;
      case 'bazi': renderBazi(); break;
      case 'hexagrams': renderHexagramsList(); break;
      case 'chenggu': renderChengGu(); break;
      case 'meihua': renderMeiHua(); break;
      case 'shengxiao': renderShengXiao(); break;
      case 'naming': renderNaming(); break;
      case 'tarot': renderTarot(); break;
      case 'ziwei': renderZiWei(); break;
      case 'huangli': renderHuangLi(); break;
    }
  } catch (err) {
    const page = document.getElementById(`page-${pageId}`);
    if (page) page.innerHTML += `<div class="text-center mt-16" style="color:var(--text-muted);padding:20px">页面加载失败，请返回首页重试。<br><small>${err.message}</small></div>`;
    console.error(`loadPageContent ${pageId}:`, err);
  }
}

// ========== 首页渲染 ==========
function renderHome() {
  // 八卦SVG装饰
  const hero = document.getElementById('hero-bagua');
  if (hero) {
    hero.innerHTML = `<svg viewBox="0 0 100 100" width="100%" height="100%">
      <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
      <path d="M50 2 A48 48 0 0 1 50 98 A24 24 0 0 0 50 50 A24 24 0 0 1 50 2Z" fill="rgba(255,255,255,0.85)"/>
      <circle cx="50" cy="26" r="7" fill="rgba(0,0,0,0.5)"/>
      <circle cx="50" cy="74" r="7" fill="rgba(255,255,255,0.85)"/>
    </svg>`;
  }

  // 快速操作
  const quickActions = document.getElementById('quick-actions');
  const actions = [
    { icon:'🪙', label:'六爻起卦', page:'liuyao' },
    { icon:'☯', label:'八字排盘', page:'bazi' },
    { icon:'🎴', label:'塔罗占卜', page:'tarot' },
    { icon:'🌸', label:'梅花易数', page:'meihua' },
  ];
  quickActions.innerHTML = actions.map(a =>
    `<div class="quick-action-card" onclick="window._nav('${a.page}')">
      <div class="qac-icon">${a.icon}</div>
      <div class="qac-label">${a.label}</div>
    </div>`
  ).join('');

  // 每日运势卡片
  const today = new Date();
  const lunarInfo = getLunarInfo(today);
  renderDailyCard(today, lunarInfo);

  // 功能网格
  const featureGrid = document.getElementById('feature-grid');
  const features = [
    { icon:'📖', name:'六十四卦', desc:'完整卦辞爻辞象传彖传', page:'hexagrams' },
    { icon:'⚖️', name:'称骨算命', desc:'袁天罡称骨歌完整版', page:'chenggu' },
    { icon:'🐉', name:'生肖运势', desc:'十二生肖年度/月度运势', page:'shengxiao' },
    { icon:'📝', name:'姓名分析', desc:'五格剖象三才配置', page:'naming' },
    { icon:'⭐', name:'紫微斗数', desc:'十二宫星曜命盘推演', page:'ziwei' },
    { icon:'📅', name:'今日黄历', desc:'宜忌吉神凶煞查询', page:'huangli' },
  ];
  featureGrid.innerHTML = features.map(f =>
    `<div class="feature-card" onclick="window._nav('${f.page}')">
      <div class="fc-icon">${f.icon}</div>
      <div class="fc-name">${f.name}</div>
      <div class="fc-desc">${f.desc}</div>
    </div>`
  ).join('');
}

function renderDailyCard(today, lunar) {
  const card = document.getElementById('daily-card');
  const dateStr = `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日`;
  const dayGanZhi = getDayGanZhi(today);
  const shengxiao = getDayShengXiao(today);

  card.innerHTML = `
    <div class="daily-card-header">
      <h4>📊 今日运势概览</h4>
      <span class="daily-date">${dateStr} · ${lunar.month}月${lunar.day}日</span>
    </div>
    <div class="daily-content">
      <div class="daily-item"><div class="di-label">日干支</div><div class="di-value">${dayGanZhi}</div></div>
      <div class="daily-item"><div class="di-label">生肖</div><div class="di-value">${shengxiao}</div></div>
      <div class="daily-item"><div class="di-label">宜</div><div class="di-value">${getDailyYi(today).slice(0,2).join('、')}</div></div>
      <div class="daily-item"><div class="di-label">忌</div><div class="di-value">${getDailyJi(today).slice(0,2).join('、')}</div></div>
    </div>
  `;
}

// ========== 六爻占卜 ==========
function renderLiuYao() {
  const container = document.getElementById('liuyao-content');
  container.innerHTML = `
    <div class="text-center mb-16" style="color:var(--text-secondary);font-size:13px;">
      心诚则灵 · 一事一卜 · 疑则卜不疑不卜
    </div>
    <div class="form-group">
      <label class="form-label">占测问题</label>
      <input type="text" class="form-input" id="liuyao-question" placeholder="例如：我这次面试能通过吗？">
    </div>
    <div class="form-group">
      <label class="form-label">起卦方式</label>
      <div style="display:flex;gap:8px;">
        <button class="btn-outline active" id="ly-method-coin" onclick="window._lySetMethod('coin')">铜钱起卦</button>
        <button class="btn-outline" id="ly-method-time" onclick="window._lySetMethod('time')">时间起卦</button>
        <button class="btn-outline" id="ly-method-manual" onclick="window._lySetMethod('manual')">手动起卦</button>
      </div>
    </div>
    <div id="liuyao-cast-area"></div>
    <div id="liuyao-result"></div>
  `;

  state.liuyaoMethod = 'coin';
  state.liuyaoLines = [];
  state.liuyaoCurrentYao = 0;

  renderCoinCast();
}

function renderCoinCast() {
  const area = document.getElementById('liuyao-cast-area');
  area.innerHTML = `
    <div class="coin-container">
      <div style="font-size:13px;color:var(--text-secondary);">
        第 <b>${state.liuyaoCurrentYao + 1}</b> / 6 爻 · ${['初','二','三','四','五','上'][state.liuyaoCurrentYao]}爻
      </div>
      <div class="coin-row">
        ${[0,1,2].map(i => `<div class="coin" id="coin-${i}">🪙</div>`).join('')}
      </div>
      <div style="font-size:12px;color:var(--text-muted);">点击铜钱摇卦</div>
      <button class="btn-primary" onclick="window._lyTossCoins()" style="width:auto;padding:10px 40px;">
        ${state.liuyaoCurrentYao < 6 ? '摇卦' : '重新开始'}
      </button>
      <div id="liuyao-yao-display" style="display:flex;flex-direction:column-reverse;gap:2px;">
        ${renderCurrentYaoDisplay()}
      </div>
    </div>
  `;
}

function renderCurrentYaoDisplay() {
  const names = ['初','二','三','四','五','上'];
  const symbols = { 6:'⚋ 老阴(变)', 7:'⚊ 少阳', 8:'⚋ 少阴', 9:'⚊ 老阳(变)' };
  let html = '';
  for (let i = 0; i < 6; i++) {
    if (i < state.liuyaoLines.length) {
      html += `<div style="font-size:12px;padding:2px;color:var(--text-secondary);">
        ${names[i]}爻：${symbols[state.liuyaoLines[i]]}
      </div>`;
    } else if (i === state.liuyaoLines.length) {
      html += `<div style="font-size:12px;padding:2px;color:var(--accent);">${names[i]}爻：← 即将摇出</div>`;
    } else {
      html += `<div style="font-size:12px;padding:2px;color:var(--text-muted);">${names[i]}爻：---</div>`;
    }
  }
  return html;
}

// ========== 八字命理 ==========
function renderBazi() {
  const container = document.getElementById('bazi-content');
  container.innerHTML = `
    <form id="bazi-form" onsubmit="window._calcBazi(event)">
      <div class="form-group">
        <label class="form-label">性别</label>
        <div style="display:flex;gap:8px;">
          <button type="button" class="btn-outline active" id="bz-gender-m" onclick="window._bzSetGender('男')">男</button>
          <button type="button" class="btn-outline" id="bz-gender-f" onclick="window._bzSetGender('女')">女</button>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">出生日期（阳历）</label>
        <input type="date" class="form-input" id="bazi-date" required value="1990-01-01">
      </div>
      <div class="form-group">
        <label class="form-label">出生时辰</label>
        <select class="form-select" id="bazi-hour">
          <option value="0">子时 (23:00-01:00)</option>
          <option value="1">丑时 (01:00-03:00)</option>
          <option value="2">寅时 (03:00-05:00)</option>
          <option value="3">卯时 (05:00-07:00)</option>
          <option value="4">辰时 (07:00-09:00)</option>
          <option value="5">巳时 (09:00-11:00)</option>
          <option value="6">午时 (11:00-13:00)</option>
          <option value="7">未时 (13:00-15:00)</option>
          <option value="8">申时 (15:00-17:00)</option>
          <option value="9">酉时 (17:00-19:00)</option>
          <option value="10">戌时 (19:00-21:00)</option>
          <option value="11">亥时 (21:00-23:00)</option>
        </select>
      </div>
      <button type="submit" class="btn-primary">排盘分析</button>
    </form>
    <div id="bazi-result"></div>
  `;
  state.baziGender = '男';
}

// ========== 六十四卦列表 ==========
function renderHexagramsList() {
  const container = document.getElementById('hexagrams-content');
  container.innerHTML = `
    <div style="margin-bottom:12px;">
      <input type="text" class="form-input" id="hexagram-search" placeholder="搜索卦名..." oninput="window._searchHexagram(this.value)">
    </div>
    <div id="hexagram-list" class="hexagram-list"></div>
    <div id="hexagram-detail" class="hidden"></div>
  `;

  // 延迟加载卦数据
  if (typeof HEXAGRAMS !== 'undefined') {
    renderHexagramItems(HEXAGRAMS);
  } else {
    setTimeout(() => {
      if (typeof HEXAGRAMS !== 'undefined') renderHexagramItems(HEXAGRAMS);
    }, 500);
  }
}

function renderHexagramItems(list) {
  const el = document.getElementById('hexagram-list');
  el.innerHTML = list.map(h => `
    <div class="hexagram-item" onclick="window._showHexagram(${h.id})">
      <div class="hi-id">${h.id}</div>
      <div class="hi-info">
        <div class="hi-name">${h.name}卦 <span style="font-size:12px;color:var(--text-muted);">${h.description}</span></div>
        <div class="hi-sub">${h.judgment.slice(0, 30)}${h.judgment.length > 30 ? '...' : ''}</div>
      </div>
      <div style="font-size:20px;">→</div>
    </div>
  `).join('');
}

// ========== 称骨算命 ==========
function renderChengGu() {
  const yearGanZhi = getAllYearGanZhi();
  const container = document.getElementById('chenggu-content');
  container.innerHTML = `
    <form id="chenggu-form" onsubmit="window._calcChengGu(event)">
      <div class="form-group">
        <label class="form-label">出生年份</label>
        <select class="form-select" id="cg-year">
          ${yearGanZhi.map((gz, i) => `<option value="${2026 - i}">${2026 - i}年（${gz}年）</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">农历月份</label>
        <select class="form-select" id="cg-month">
          ${Array.from({length:12}, (_,i) => `<option value="${i+1}">${['正','二','三','四','五','六','七','八','九','十','冬','腊'][i]}月</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">农历日期</label>
        <select class="form-select" id="cg-day">
          ${Array.from({length:30}, (_,i) => `<option value="${i+1}">${['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'][i]}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">出生时辰</label>
        <select class="form-select" id="cg-hour">
          ${['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'].map((z,i) => `<option value="${z}">${z}时 (${['23-1','1-3','3-5','5-7','7-9','9-11','11-13','13-15','15-17','17-19','19-21','21-23'][i]}点)</option>`).join('')}
        </select>
      </div>
      <button type="submit" class="btn-primary">称骨算命</button>
    </form>
    <div id="chenggu-result"></div>
  `;
}

// ========== 梅花易数 ==========
function renderMeiHua() {
  const container = document.getElementById('meihua-content');
  container.innerHTML = `
    <div style="text-align:center;color:var(--text-secondary);margin-bottom:16px;">
      <p style="font-size:14px;">物数占 · 数字起卦法</p>
      <p style="font-size:12px;">心中默念问题，随意输入三个数字</p>
    </div>
    <form id="meihua-form" onsubmit="window._calcMeiHua(event)">
      <div class="form-group">
        <label class="form-label">第一个数字（上卦）</label>
        <input type="number" class="form-input" id="mh-num1" required min="1" placeholder="任意数字">
      </div>
      <div class="form-group">
        <label class="form-label">第二个数字（下卦）</label>
        <input type="number" class="form-input" id="mh-num2" required min="1" placeholder="任意数字">
      </div>
      <div class="form-group">
        <label class="form-label">第三个数字（动爻）</label>
        <input type="number" class="form-input" id="mh-num3" required min="1" placeholder="任意数字">
      </div>
      <div class="form-group">
        <label class="form-label">占测问题（可选）</label>
        <input type="text" class="form-input" id="mh-question" placeholder="简述你想问的事">
      </div>
      <button type="submit" class="btn-primary">梅花易数起卦</button>
    </form>
    <div id="meihua-result"></div>
  `;
}

// ========== 生肖运势 ==========
function renderShengXiao() {
  const shengxiaoArr = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
  const curYear = new Date().getFullYear();
  const container = document.getElementById('shengxiao-content');
  container.innerHTML = `
    <div class="form-group">
      <label class="form-label">选择生肖</label>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
        ${shengxiaoArr.map(sx => `
          <button class="btn-outline" onclick="window._showShengXiao('${sx}')">${sx}</button>
        `).join('')}
      </div>
    </div>
    <div id="shengxiao-result"></div>
  `;
}

// ========== 姓名分析 ==========
function renderNaming() {
  const container = document.getElementById('naming-content');
  container.innerHTML = `
    <form id="naming-form" onsubmit="window._analyzeName(event)">
      <div class="form-group">
        <label class="form-label">请输入姓名</label>
        <input type="text" class="form-input" id="name-input" required placeholder="请输入中文姓名（2-4字）" maxlength="4">
      </div>
      <button type="submit" class="btn-primary">姓名分析</button>
    </form>
    <div id="naming-result"></div>
  `;
}

// ========== 塔罗占卜 ==========
function renderTarot() {
  const container = document.getElementById('tarot-content');
  container.innerHTML = `
    <div style="text-align:center;color:var(--text-secondary);margin-bottom:16px;">
      <p style="font-size:14px;">选择牌阵 · 诚心提问</p>
    </div>
    <div class="form-group">
      <label class="form-label">牌阵选择</label>
      <div style="display:flex;gap:8px;">
        <button class="btn-outline active" id="tarot-1card" onclick="window._tarotSetSpread(1)">单牌占卜</button>
        <button class="btn-outline" id="tarot-3card" onclick="window._tarotSetSpread(3)">三牌阵</button>
        <button class="btn-outline" id="tarot-6card" onclick="window._tarotSetSpread(6)">六牌阵</button>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">你的问题</label>
      <input type="text" class="form-input" id="tarot-question" placeholder="心里默念问题后输入...">
    </div>
    <div id="tarot-cards-area">
      <button class="btn-primary" onclick="window._tarotDraw()">抽牌</button>
    </div>
    <div id="tarot-result"></div>
  `;
  state.tarotSpread = 1;
}

// ========== 紫微斗数 ==========
function renderZiWei() {
  const container = document.getElementById('ziwei-content');
  container.innerHTML = `
    <div style="text-align:center;padding:40px 20px;">
      <div style="font-size:48px;margin-bottom:16px;">⭐</div>
      <h3>紫微斗数</h3>
      <p style="color:var(--text-secondary);font-size:14px;">
        紫微斗数排盘算法正在完善中<br>
        当前版本支持八字命理、六爻占卜等功能
      </p>
      <p style="color:var(--text-muted);font-size:12px;margin-top:12px;">
        紫微斗数需要精确的农历日期转换、<br>
        命宫起法、十四主星星曜安放、<br>
        四化星推算等复杂算法
      </p>
    </div>
  `;
}

// ========== 黄历 ==========
function renderHuangLi() {
  const today = new Date();
  const lunar = getLunarInfo(today);
  const dayGanZhi = getDayGanZhi(today);
  const yi = getDailyYi(today);
  const ji = getDailyJi(today);
  const shenWei = getDailyShenWei(today);

  const container = document.getElementById('huangli-content');
  container.innerHTML = `
    <div class="result-card" style="margin-top:0;">
      <div class="result-title">📅 ${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日</div>
      <div class="text-center" style="font-size:18px;color:var(--accent-dark);margin-bottom:16px;">
        农历${lunar.month}月${lunar.day}日 · ${dayGanZhi}日
      </div>
      <div class="result-section">
        <h5>宜</h5>
        <div>${yi.map(y => `<span class="tag tag-success">${y}</span>`).join(' ')}</div>
      </div>
      <div class="result-section">
        <h5>忌</h5>
        <div>${ji.map(j => `<span class="tag tag-danger">${j}</span>`).join(' ')}</div>
      </div>
      <div class="result-section">
        <h5>吉神方位</h5>
        <div style="display:flex;gap:16px;flex-wrap:wrap;">
          ${Object.entries(shenWei).map(([k,v]) =>
            `<span>${k}：<b style="color:var(--accent-dark);">${v}</b></span>`
          ).join('')}
        </div>
      </div>
      <div class="result-section">
        <h5>冲煞</h5>
        <p>冲${getDayShengXiao(today)} · 煞${getDaySha(today)}</p>
      </div>
    </div>
  `;
}

// ========== 核心算法 ==========

// 天干地支基础数据
const TIAN_GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const DI_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const SHENG_XIAO_MAP = { '子':'鼠','丑':'牛','寅':'虎','卯':'兔','辰':'龙','巳':'蛇','午':'马','未':'羊','申':'猴','酉':'鸡','戌':'狗','亥':'猪' };

// 五行速查表
const TIAN_GAN_WUXING = { '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水' };
const TIAN_GAN_YINYANG = { '甲':'阳','乙':'阴','丙':'阳','丁':'阴','戊':'阳','己':'阴','庚':'阳','辛':'阴','壬':'阳','癸':'阴' };
const DI_ZHI_WUXING = { '子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火','午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水' };
const WU_XING_SHENG = { '木':'火','火':'土','土':'金','金':'水','水':'木' };
const WU_XING_KE = { '木':'土','土':'水','水':'火','火':'金','金':'木' };

// 获取日干支（简化但较准确的算法，适用于1900-2100年）
function getDayGanZhi(date) {
  const known = new Date(1900, 0, 1); // 1900-01-01 = 甲戌日（实际是甲戌，但这里用近似）
  // 实际上 1900-01-01 的日干支是 甲戌（index 10）
  // 更准确的方法：使用1900-01-01 = 甲戌 (ganIdx=0, zhiIdx=10)
  const baseGanIdx = 0;  // 甲
  const baseZhiIdx = 10; // 戌
  const baseDate = new Date(1900, 0, 1);

  const diffDays = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));
  const ganIdx = ((baseGanIdx + diffDays) % 10 + 10) % 10;
  const zhiIdx = ((baseZhiIdx + diffDays) % 12 + 12) % 12;

  return TIAN_GAN[ganIdx] + DI_ZHI[zhiIdx];
}

// 日生肖
function getDayShengXiao(date) {
  const zhi = getDayGanZhi(date)[1];
  return SHENG_XIAO_MAP[zhi] || '鼠';
}

// 完整春节日期表 1940-2100（天文历算数据，非随机）
const SPRING_FESTIVALS = {
  1940:[2,8],1941:[1,27],1942:[2,15],1943:[2,5],1944:[1,25],1945:[2,13],1946:[2,2],1947:[1,22],1948:[2,10],1949:[1,29],
  1950:[2,17],1951:[2,6],1952:[1,27],1953:[2,14],1954:[2,3],1955:[1,24],1956:[2,12],1957:[1,31],1958:[2,18],1959:[2,8],
  1960:[1,28],1961:[2,15],1962:[2,5],1963:[1,25],1964:[2,13],1965:[2,2],1966:[1,21],1967:[2,9],1968:[1,30],1969:[2,17],
  1970:[2,6],1971:[1,27],1972:[2,15],1973:[2,3],1974:[1,23],1975:[2,11],1976:[1,31],1977:[2,18],1978:[2,7],1979:[1,28],
  1980:[2,16],1981:[2,5],1982:[1,25],1983:[2,13],1984:[2,2],1985:[2,20],1986:[2,9],1987:[1,29],1988:[2,17],1989:[2,6],
  1990:[1,27],1991:[2,15],1992:[2,4],1993:[1,23],1994:[2,10],1995:[1,31],1996:[2,19],1997:[2,7],1998:[1,28],1999:[2,16],
  2000:[2,5],2001:[1,24],2002:[2,12],2003:[2,1],2004:[1,22],2005:[2,9],2006:[1,29],2007:[2,18],2008:[2,7],2009:[1,26],
  2010:[2,14],2011:[2,3],2012:[1,23],2013:[2,10],2014:[1,31],2015:[2,19],2016:[2,8],2017:[1,28],2018:[2,16],2019:[2,5],
  2020:[1,25],2021:[2,12],2022:[2,1],2023:[1,22],2024:[2,10],2025:[1,29],2026:[2,17],2027:[2,6],2028:[1,26],2029:[2,13],
  2030:[2,3],2031:[1,23],2032:[2,11],2033:[1,31],2034:[2,19],2035:[2,8],2036:[1,28],2037:[2,15],2038:[2,4],2039:[1,24],
  2040:[2,12],2041:[2,1],2042:[1,22],2043:[2,10],2044:[1,30],2045:[2,17],2046:[2,6],2047:[1,26],2048:[2,14],2049:[2,2],
  2050:[1,23],2051:[2,11],2052:[2,1],2053:[2,19],2054:[2,8],2055:[1,28],2056:[2,15],2057:[2,4],2058:[1,24],2059:[2,12],
  2060:[2,2],2061:[1,21],2062:[2,9],2063:[1,29],2064:[2,17],2065:[2,5],2066:[1,26],2067:[2,14],2068:[2,3],2069:[1,23],
  2070:[2,11],2071:[1,31],2072:[2,19],2073:[2,7],2074:[1,27],2075:[2,15],2076:[2,5],2077:[1,24],2078:[2,12],2079:[2,2],
  2080:[1,22],2081:[2,9],2082:[1,29],2083:[2,17],2084:[2,6],2085:[1,26],2086:[2,14],2087:[2,3],2088:[1,24],2089:[2,10],
  2090:[1,30],2091:[2,18],2092:[2,7],2093:[1,27],2094:[2,15],2095:[2,5],2096:[1,25],2097:[2,12],2098:[2,1],2099:[1,21],
  2100:[2,9]
};

function getLunarInfo(date) {
  const year = date.getFullYear();
  const sf = SPRING_FESTIVALS[year];
  if (!sf) {
    // 超出范围时用中位值估计（农历正月初一80%落在1月21日-2月20日）
    const est = [1, 28 + (year % 19) % 22]; // 基于19年7闰周期
    return calcLunarFromSf(date, year, est);
  }
  const sfDate = new Date(year, sf[0] - 1, sf[1]);
  if (date < sfDate) {
    // 跨年：用上一年的春节来算
    const prevSf = SPRING_FESTIVALS[year - 1];
    if (prevSf) {
      return calcLunarFromSf(date, year - 1, prevSf);
    }
    // 上一年也没有，用估计值
    return calcLunarFromSf(date, year - 1, [1, 28 + ((year - 1) % 19) % 22]);
  }
  return calcLunarFromSf(date, year, sf);
}

function calcLunarFromSf(date, lunarYear, sf) {
  const sfDate = new Date(lunarYear, sf[0] - 1, sf[1]);
  const daysSinceSf = Math.floor((date - sfDate) / (1000 * 60 * 60 * 24));
  const lunarMonthDays = [30, 29, 30, 29, 30, 29, 30, 30, 29, 30, 29, 30];
  let remaining = Math.max(0, daysSinceSf) + 1;
  let month = 1;
  for (let i = 0; i < 12 && remaining > lunarMonthDays[i]; i++) {
    remaining -= lunarMonthDays[i];
    month++;
  }
  const day = Math.max(1, Math.min(30, remaining));
  return { year: lunarYear, month: month, day: day };
}

// 每日宜忌（基于地支的简化规则）
function getDailyYi(today) {
  const zhi = getDayGanZhi(today)[1];
  const yiBase = {
    '子': ['祭祀','祈福','求嗣','开光','出行','订婚','嫁娶'],
    '丑': ['祭祀','祈福','入学','会友','订婚','纳采','裁衣'],
    '寅': ['祭祀','会友','出行','订婚','嫁娶','交易','开市'],
    '卯': ['祭祀','祈福','求嗣','订婚','嫁娶','出行','裁衣'],
    '辰': ['祭祀','祈福','会友','订婚','纳采','出行','入学'],
    '巳': ['祭祀','开光','出行','订婚','嫁娶','交易','立券'],
    '午': ['祭祀','祈福','求嗣','开光','会友','订婚','交易'],
    '未': ['祭祀','祈福','会友','订婚','纳采','裁衣','入学'],
    '申': ['祭祀','出行','订婚','嫁娶','交易','开市','入宅'],
    '酉': ['祭祀','祈福','求嗣','开光','订婚','嫁娶','出行'],
    '戌': ['祭祀','会友','订婚','纳采','裁衣','入学','出行'],
    '亥': ['祭祀','祈福','求嗣','开光','订婚','嫁娶','入宅'],
  };
  return yiBase[zhi] || ['祭祀','祈福'];
}

function getDailyJi(today) {
  const zhi = getDayGanZhi(today)[1];
  const jiBase = {
    '子': ['安葬','修坟','开仓','出货'],
    '丑': ['安葬','破土','伐木','畋猎'],
    '寅': ['安葬','破土','伐木','开渠'],
    '卯': ['安葬','行丧','伐木','畋猎'],
    '辰': ['安葬','破土','开渠','穿井'],
    '巳': ['安葬','行丧','开仓','出货'],
    '午': ['安葬','破土','修坟','开渠'],
    '未': ['安葬','破土','伐木','畋猎'],
    '申': ['安葬','行丧','开仓','穿井'],
    '酉': ['安葬','破土','伐木','畋猎'],
    '戌': ['安葬','破土','开仓','出货'],
    '亥': ['安葬','行丧','修坟','开渠'],
  };
  return jiBase[zhi] || ['安葬','破土'];
}

function getDailyShenWei(today) {
  const zhi = getDayGanZhi(today)[1];
  const wei = {
    '子': {'喜神':'东南','福神':'正北','财神':'正北'},
    '丑': {'喜神':'东北','福神':'正南','财神':'正南'},
    '寅': {'喜神':'西北','福神':'东南','财神':'正北'},
    '卯': {'喜神':'西南','福神':'正东','财神':'正东'},
    '辰': {'喜神':'正南','福神':'正北','财神':'正北'},
    '巳': {'喜神':'东南','福神':'正南','财神':'正南'},
    '午': {'喜神':'正南','福神':'西北','财神':'正南'},
    '未': {'喜神':'东南','福神':'正西','财神':'正西'},
    '申': {'喜神':'东北','福神':'西南','财神':'正南'},
    '酉': {'喜神':'西北','福神':'东南','财神':'正东'},
    '戌': {'喜神':'西南','福神':'正北','财神':'正北'},
    '亥': {'喜神':'西北','福神':'西南','财神':'正南'},
  };
  return wei[zhi] || {'喜神':'东南','福神':'正北','财神':'正北'};
}

function getDaySha(today) {
  const zhi = getDayGanZhi(today)[1];
  const sha = { '子':'南','丑':'东','寅':'北','卯':'西','辰':'南','巳':'东','午':'北','未':'西','申':'南','酉':'东','戌':'北','亥':'西' };
  return sha[zhi] || '南';
}

// 年份干支列表
function getAllYearGanZhi() {
  const result = [];
  for (let year = 2026; year >= 1940; year--) {
    const ganIdx = (year - 4) % 10;
    const zhiIdx = (year - 4) % 12;
    result.push(TIAN_GAN[ganIdx] + DI_ZHI[zhiIdx]);
  }
  return result;
}

// ========== 铜钱起卦算法 ==========
window._lyTossCoins = function() {
  if (state.liuyaoCurrentYao >= 6) {
    state.liuyaoLines = [];
    state.liuyaoCurrentYao = 0;
    renderCoinCast();
    return;
  }

  // 模拟三枚铜钱
  const coins = [Math.random() > 0.5 ? 3 : 2, Math.random() > 0.5 ? 3 : 2, Math.random() > 0.5 ? 3 : 2];
  const sum = coins[0] + coins[1] + coins[2];
  // 6=老阴(变), 7=少阳, 8=少阴, 9=老阳(变)
  state.liuyaoLines.push(sum);

  // 动画
  document.querySelectorAll('.coin').forEach(c => c.classList.add('tossing'));
  setTimeout(() => {
    document.querySelectorAll('.coin').forEach((c, i) => {
      c.classList.remove('tossing');
      c.textContent = coins[i] === 3 ? '🟡' : '⚪';
    });
  }, 600);

  state.liuyaoCurrentYao++;

  if (state.liuyaoCurrentYao >= 6) {
    setTimeout(() => showLiuYaoResult(), 1000);
  } else {
    setTimeout(() => renderCoinCast(), 800);
  }
};

function showLiuYaoResult() {
  // 从六爻数字生成本卦和变卦
  const trigramMap = {
    '111': '乾','011': '兑','101': '离','001': '震','110': '巽','010': '坎','100': '艮','000': '坤'
  };

  // 本卦：取阴阳（不考虑变爻）
  const benYao = state.liuyaoLines.map(v => v % 2 === 0 ? 0 : 1); // 0=阴 1=阳
  const shangGuaKey = benYao.slice(3, 6).join('');
  const xiaGuaKey = benYao.slice(0, 3).join('');
  const shangGua = trigramMap[shangGuaKey] || '坤';
  const xiaGua = trigramMap[xiaGuaKey] || '坤';

  // 查找卦
  const benGua = (typeof HEXAGRAMS !== 'undefined')
    ? HEXAGRAMS.find(h => h.upperTrigram === shangGua && h.lowerTrigram === xiaGua)
    : null;

  // 动爻编号 (0-based)
  const dongYao = state.liuyaoLines.map((v, i) => (v === 6 || v === 9) ? i : -1).filter(i => i >= 0);
  const dongYaoNames = dongYao.map(i => ['初','二','三','四','五','上'][i]);

  const result = document.getElementById('liuyao-result');
  const yaoNames = ['初九','九二','九三','九四','九五','上九'];
  const yinNames = ['初六','六二','六三','六四','六五','上六'];

  result.innerHTML = `
    <div class="result-card">
      <div class="result-title">${benGua ? benGua.name + '卦 · ' + benGua.description : '占卜结果'}</div>
      <div style="text-align:center;font-size:13px;color:var(--text-muted);margin-bottom:12px;">
        本卦：${shangGua}上${xiaGua}下
        ${dongYao.length > 0 ? ' · 动爻：' + dongYaoNames.join('、') : ''}
      </div>
      ${renderTrigram(benYao, state.liuyaoLines)}
      ${benGua ? `
        <div class="result-section">
          <h5>卦辞</h5>
          <p>${benGua.judgment}</p>
        </div>
        <div class="result-section">
          <h5>解读</h5>
          <p>${benGua.judgmentInterpretation}</p>
        </div>
        <div class="result-section">
          <h5>大象</h5>
          <p>${benGua.xiang}</p>
        </div>
        ${benGua.overallFortune ? `
          <div class="result-section">
            <h5>运势详解</h5>
            <p><b>事业：</b>${benGua.overallFortune.career || '待完善'}</p>
            <p><b>感情：</b>${benGua.overallFortune.love || '待完善'}</p>
            <p><b>财运：</b>${benGua.overallFortune.wealth || '待完善'}</p>
            <p><b>健康：</b>${benGua.overallFortune.health || '待完善'}</p>
          </div>
        ` : ''}
        ${dongYao.length > 0 && benGua.lines ? dongYao.map(i => `
          <div class="result-section">
            <h5>${yaoNames[i]}爻 · 动爻</h5>
            <p><b>爻辞：</b>${benGua.lines[i]?.text || '待完善'}</p>
            <p><b>解读：</b>${benGua.lines[i]?.interpretation || '待完善'}</p>
          </div>
        `).join('') : ''}
      ` : '<p style="text-align:center;color:var(--text-muted);">卦象数据加载中，请稍后重试</p>'}
    </div>
  `;
}

function renderTrigram(yaos, rawLines) {
  const yaoElements = yaos.map((y, i) => {
    const isChanging = rawLines[i] === 6 || rawLines[i] === 9;
    const isYin = y === 0;
    let cls = isYin ? 'yao yin' : 'yao yang';
    if (isChanging) cls += ' changing';
    return `<div class="${cls}"></div>`;
  });

  return `
    <div class="trigram-display">
      ${yaoElements.reverse().join('')}
    </div>
  `;
}

// ========== 六爻起卦方式切换 ==========
window._lySetMethod = function(method) {
  state.liuyaoMethod = method;
  state.liuyaoLines = [];
  state.liuyaoCurrentYao = 0;
  document.querySelectorAll('#liuyao-content .btn-outline').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`ly-method-${method}`);
  if (btn) btn.classList.add('active');

  if (method === 'coin') {
    renderCoinCast();
  } else if (method === 'time') {
    // 时间起卦
    const now = new Date();
    const lunar = getLunarInfo(now);
    const n1 = lunar.month, n2 = lunar.day, n3 = now.getHours();
    state.liuyaoLines = generateLinesFromNumbers(n1, n2, n3);
    state.liuyaoCurrentYao = 6;
    showLiuYaoResult();
  } else {
    // 手动起卦 - 简化
    const area = document.getElementById('liuyao-cast-area');
    area.innerHTML = `
      <div style="padding:12px 0;">
        <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;">请选择每爻的状态：</p>
        ${['初爻','二爻','三爻','四爻','五爻','上爻'].map((name, i) => `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <span style="width:40px;font-size:13px;">${name}</span>
            <select class="form-select" id="manual-yao-${i}" style="width:auto;flex:1;">
              <option value="7">⚊ 少阳</option>
              <option value="8">⚋ 少阴</option>
              <option value="9">⚊ 老阳（变）</option>
              <option value="6">⚋ 老阴（变）</option>
            </select>
          </div>
        `).join('')}
        <button class="btn-primary mt-16" onclick="window._lyManualSubmit()">排盘解读</button>
      </div>
    `;
  }
};

window._lyManualSubmit = function() {
  state.liuyaoLines = [];
  for (let i = 0; i < 6; i++) {
    const val = parseInt(document.getElementById(`manual-yao-${i}`).value);
    state.liuyaoLines.push(val);
  }
  state.liuyaoCurrentYao = 6;
  showLiuYaoResult();
};

function generateLinesFromNumbers(n1, n2, n3) {
  const num1 = n1 % 8;
  const num2 = n2 % 8;
  const dongYao = (n3 % 6) || 6;

  const lines = [];
  for (let i = 0; i < 6; i++) {
    const shangVal = i < 3 ? (num1 >> (2 - i)) & 1 : 0;
    const xiaVal = i < 3 ? 0 : (num2 >> (5 - i)) & 1;
    const val = shangVal || xiaVal;
    if (i === dongYao - 1) {
      lines.push(val ? 9 : 6); // 动爻
    } else {
      lines.push(val ? 7 : 8);
    }
  }
  return lines;
}

// ========== 梅花易数 ==========
window._calcMeiHua = function(e) {
  e.preventDefault();
  const n1 = parseInt(document.getElementById('mh-num1').value);
  const n2 = parseInt(document.getElementById('mh-num2').value);
  const n3 = parseInt(document.getElementById('mh-num3').value);
  const question = document.getElementById('mh-question').value || '未指定';

  const trigramNames = ['坤','乾','兑','离','震','巽','坎','艮','坤'];
  const shangGuaNum = n1 % 8 === 0 ? 8 : n1 % 8;
  const xiaGuaNum = n2 % 8 === 0 ? 8 : n2 % 8;
  const dongYao = n3 % 6 === 0 ? 6 : n3 % 6;

  const shangGua = trigramNames[shangGuaNum];
  const xiaGua = trigramNames[xiaGuaNum];

  const bodyGua = dongYao <= 3 ? xiaGua : shangGua;
  const useGua = dongYao <= 3 ? shangGua : xiaGua;

  const wuxing = { '乾':'金','兑':'金','离':'火','震':'木','巽':'木','坎':'水','艮':'土','坤':'土' };
  const bodyWx = wuxing[bodyGua];
  const useWx = wuxing[useGua];

  const shengRelation = getShengKeRelation(bodyWx, useWx);

  const result = document.getElementById('meihua-result');
  result.innerHTML = `
    <div class="result-card">
      <div class="result-title">🌸 梅花易数 · ${shangGua}上${xiaGua}下</div>
      <div class="text-center" style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">
        问题：${question} · 动爻：${['初','二','三','四','五','上'][dongYao-1]}爻
      </div>
      <div class="result-section">
        <h5>体用分析</h5>
        <p><b>体卦：</b>${bodyGua}（${bodyWx}） — 代表问卦者自身</p>
        <p><b>用卦：</b>${useGua}（${useWx}） — 代表所问之事</p>
        <p><b>体用关系：</b>${shengRelation.text}</p>
      </div>
      <div class="result-section">
        <h5>卦象解读</h5>
        <p>${getMeiHuaInterpretation(shangGua, xiaGua, shengRelation.type)}</p>
      </div>
    </div>
  `;
};

function getShengKeRelation(bodyWx, useWx) {
  const sheng = { '木':'火','火':'土','土':'金','金':'水','水':'木' };
  const ke = { '木':'土','土':'水','水':'火','火':'金','金':'木' };

  if (bodyWx === useWx) return { type: '比和', text: '体用比和，谋事可成，诸事顺利。' };
  if (sheng[bodyWx] === useWx) return { type: '体生用', text: '体生用，有耗损之象，凡事需付出更多努力方可成功。' };
  if (sheng[useWx] === bodyWx) return { type: '用生体', text: '用生体，大吉之象，凡事顺遂，有人相助。' };
  if (ke[bodyWx] === useWx) return { type: '体克用', text: '体克用，诸事可成但较为费力，需要主动出击。' };
  if (ke[useWx] === bodyWx) return { type: '用克体', text: '用克体，大凶之象，凡事不宜妄动，需静待时机。' };
  return { type: '未知', text: '' };
}

const guaInterpretations = {
  '乾': { nature:'天', quality:'健', direction:'西北' },
  '兑': { nature:'泽', quality:'悦', direction:'西' },
  '离': { nature:'火', quality:'丽', direction:'南' },
  '震': { nature:'雷', quality:'动', direction:'东' },
  '巽': { nature:'风', quality:'入', direction:'东南' },
  '坎': { nature:'水', quality:'陷', direction:'北' },
  '艮': { nature:'山', quality:'止', direction:'东北' },
  '坤': { nature:'地', quality:'顺', direction:'西南' },
};

function getMeiHuaInterpretation(shang, xia, relationType) {
  const s = guaInterpretations[shang];
  const x = guaInterpretations[xia];
  if (!s || !x) return '卦象解读数据加载中...';

  const interpretations = {
    '体生用': `上卦${shang}为${s.nature}（${s.quality}），下卦${xia}为${x.nature}（${x.quality}）。\n你主动付出，事情可以推进，但要注意不要过度消耗自己。`,
    '用生体': `上卦${shang}为${s.nature}（${s.quality}），下卦${xia}为${x.nature}（${x.quality}）。\n形势对你有利，外界因素会主动配合你，事半功倍的时机。`,
    '体克用': `上卦${shang}为${s.nature}（${s.quality}），下卦${xia}为${x.nature}（${x.quality}）。\n你有能力掌控局面，但需要较多的精力和耐心。坚持不懈可以成功。`,
    '用克体': `上卦${shang}为${s.nature}（${s.quality}），下卦${xia}为${x.nature}（${x.quality}）。\n目前环境对你不利，建议暂时保守观望，不宜轻举妄动。`,
    '比和': `上卦${shang}为${s.nature}（${s.quality}），下卦${xia}为${x.nature}（${x.quality}）。\n上下和谐，内外一致，是顺势而为的好时机。`
  };

  return interpretations[relationType] || '卦象关系较为复杂，需要结合具体问题综合判断。';
}

// ========== 称骨算命 ==========
window._calcChengGu = function(e) {
  e.preventDefault();
  const year = parseInt(document.getElementById('cg-year').value);
  const month = parseInt(document.getElementById('cg-month').value);
  const day = parseInt(document.getElementById('cg-day').value);
  const hour = document.getElementById('cg-hour').value;

  const ganIdx = (year - 4) % 10;
  const zhiIdx = (year - 4) % 12;
  const yearGz = TIAN_GAN[ganIdx] + DI_ZHI[zhiIdx];

  // 称骨重量表（钱为单位）
  const YEAR_WEIGHT = {
    '甲子':12,'乙丑':9,'丙寅':6,'丁卯':7,'戊辰':12,'己巳':5,'庚午':9,'辛未':8,'壬申':7,'癸酉':8,
    '甲戌':15,'乙亥':9,'丙子':16,'丁丑':8,'戊寅':8,'己卯':19,'庚辰':12,'辛巳':6,'壬午':8,'癸未':7,
    '甲申':5,'乙酉':15,'丙戌':6,'丁亥':16,'戊子':15,'己丑':7,'庚寅':9,'辛卯':12,'壬辰':10,'癸巳':7,
    '甲午':15,'乙未':6,'丙申':5,'丁酉':14,'戊戌':14,'己亥':9,'庚子':7,'辛丑':7,'壬寅':9,'癸卯':12,
    '甲辰':8,'乙巳':7,'丙午':13,'丁未':5,'戊申':14,'己酉':5,'庚戌':9,'辛亥':17,'壬子':5,'癸丑':7,
    '甲寅':12,'乙卯':8,'丙辰':8,'丁巳':6,'戊午':19,'己未':6,'庚申':8,'辛酉':16,'壬戌':10,'癸亥':6,
  };

  const MONTH_WEIGHT = { 1:6, 2:7, 3:18, 4:9, 5:5, 6:16, 7:9, 8:15, 9:18, 10:8, 11:9, 12:5 };
  const DAY_WEIGHT = {
    1:5,2:10,3:8,4:15,5:16,6:15,7:8,8:16,9:8,10:16,
    11:9,12:17,13:8,14:17,15:10,16:8,17:9,18:18,19:5,20:15,
    21:10,22:9,23:8,24:9,25:15,26:18,27:7,28:8,29:16,30:6
  };
  const HOUR_WEIGHT = { '子':16,'丑':6,'寅':7,'卯':10,'辰':9,'巳':16,'午':10,'未':8,'申':8,'酉':9,'戌':6,'亥':6 };

  const yw = YEAR_WEIGHT[yearGz] || 10;
  const mw = MONTH_WEIGHT[month] || 10;
  const dw = DAY_WEIGHT[day] || 10;
  const hw = HOUR_WEIGHT[hour] || 10;

  const totalQian = yw + mw + dw + hw;
  const liang = Math.floor(totalQian / 10);
  const qian = totalQian % 10;
  const totalStr = liang + '.' + qian;

  // 批语数据
  const fortunes = {
    '2.1': { text: '短命非业谓大凶，平生灾难事重重，凶祸频临陷逆境，终世困苦事不成。', summary: '一生困苦' },
    '2.2': { text: '身寒骨冷苦伶仃，此命推来行乞人，劳劳碌碌无度日，终年打拱过平生。', summary: '劳碌贫困' },
    '2.3': { text: '此命推来骨格轻，求谋作事事难成，妻儿兄弟应难许，别处他乡作散人。', summary: '事难成' },
    '2.4': { text: '此命推来福禄无，门庭困苦总难荣，六亲骨肉皆无靠，流浪他乡作老翁。', summary: '福薄' },
    '2.5': { text: '此命推来祖业微，门庭营度似稀奇，六亲骨肉如冰炭，一世勤劳自把持。', summary: '勤劳自立' },
    '2.6': { text: '平生衣禄苦中求，独自营谋事不休，离祖出门宜早计，晚来衣禄自无休。', summary: '晚景较好' },
    '2.7': { text: '一生作事少商量，难靠祖宗作主张，独马单枪空做去，早年晚岁总无长。', summary: '少成多败' },
    '2.8': { text: '一生行事似飘蓬，祖宗产业在梦中，若不过房改名姓，也当移徒二三通。', summary: '飘泊' },
    '2.9': { text: '初年运限未曾亨，纵有功名在后成，须过四旬才可立，移居改姓始为良。', summary: '大器晚成' },
    '3.0': { text: '劳劳碌碌苦中求，东奔西走何日休，若使终身勤与俭，老来稍可免忧愁。', summary: '勤俭免忧' },
    '3.1': { text: '忙忙碌碌苦中求，何日云开见日头，难得祖基家可立，中年衣食渐无忧。', summary: '中年渐好' },
    '3.2': { text: '初年运蹇事难谋，渐有财源如水流，到得中年衣食旺，那时名利一齐收。', summary: '中年发达' },
    '3.3': { text: '早年做事事难成，百年勤劳枉费心，半世自如流水去，后来运到始得金。', summary: '晚年得运' },
    '3.4': { text: '此命福气果如何，僧道门中衣禄多，离祖出家方为妙，终朝拜佛念弥陀。', summary: '宜僧道' },
    '3.5': { text: '生平福量不周全，祖业根基觉少传，营事生涯宜守旧，时来衣食胜从前。', summary: '宜守旧' },
    '3.6': { text: '不须劳碌过平生，独自成家福不轻，早有福星常照命，任君行去百般成。', summary: '福星照命' },
    '3.7': { text: '此命般般事不成，弟兄少力自孤行，虽然祖业须微有，来得明时去不明。', summary: '事多不成' },
    '3.8': { text: '一身骨肉最清高，早入簧门姓氏标，待到年将三十六，蓝衫脱去换红袍。', summary: '中年登科' },
    '3.9': { text: '此命终身运不通，劳劳作事尽皆空，苦心竭力成家计，到得那时在梦中。', summary: '运不通' },
    '4.0': { text: '平生衣禄是绵长，件件心中自主张，前面风霜多受过，后来必定享安康。', summary: '后福绵长' },
    '4.1': { text: '此命推来事不同，为人能干异凡庸，中年还有逍遥福，不比前时运未通。', summary: '中年逍遥' },
    '4.2': { text: '得宽怀处且宽怀，何用双眉皱不开，若使中年命运济，那时名利一齐来。', summary: '中年名利' },
    '4.3': { text: '为人心性最聪明，作事轩昂近贵人，衣禄一生天注定，不须劳碌是丰亨。', summary: '聪明贵人' },
    '4.4': { text: '万事由天莫苦求，须知福禄命里收，少壮名利难如意，晚景欣然便不忧。', summary: '晚景欣然' },
    '4.5': { text: '名利推求竟若何，前番辛苦后奔波，命中难养男和女，骨肉扶持也不多。', summary: '子息艰难' },
    '4.6': { text: '东西南北尽皆通，出姓移居更觉隆，衣禄无穷天数定，中年晚景一般同。', summary: '四方皆通' },
    '4.7': { text: '此命推求旺末年，妻荣子贵自怡然，平生原有滔滔福，可卜财源若水泉。', summary: '晚年昌盛' },
    '4.8': { text: '初年运道未曾通，几许蹉跎命亦穷，兄弟六亲无依靠，一生事业晚来隆。', summary: '晚年隆盛' },
    '4.9': { text: '此命推来福不轻，自成自立显门庭，从来富贵人钦敬，使婢差奴过一生。', summary: '富贵门庭' },
    '5.0': { text: '为利为名终日劳，中年福禄也多遭，老来自有财星照，不比前番目下高。', summary: '名利终有' },
    '5.1': { text: '一世荣华事事通，不须劳碌自亨通，弟兄叔侄皆如意，家业成时福禄宏。', summary: '一世荣华' },
    '5.2': { text: '一世亨通事事能，不须劳苦自然宁，宗族有光欣喜甚，家产丰盈自称心。', summary: '万事亨通' },
    '5.3': { text: '此格推来福泽宏，兴家立业在其中，一生衣食安排定，却是人间一富翁。', summary: '人间富翁' },
    '5.4': { text: '此格详采福泽宏，诗书满腹看功成，丰衣足食多安稳，正是人间有福人。', summary: '诗书功成' },
    '5.5': { text: '走马扬鞭争利名，少年作事费筹论，一朝福禄源源至，富贵荣华显六亲。', summary: '富贵荣华' },
    '5.6': { text: '此格推来礼义通，一身福禄用无穷，甜酸苦辣皆尝过，滚滚财源盈而丰。', summary: '福禄无穷' },
    '5.7': { text: '福禄丰盈万事全，一身荣耀乐天年，名扬威震人争羡，此世逍遥宛似仙。', summary: '逍遥似仙' },
    '5.8': { text: '平生衣食自然来，名利双全富贵偕，金榜题名登甲第，紫袍玉带走金阶。', summary: '金榜题名' },
    '5.9': { text: '细推此格秀而清，必定才高学业成，甲第之中应有分，扬鞭走马显威荣。', summary: '才高学业' },
    '6.0': { text: '一朝金榜快题名，显祖荣宗大器成，衣禄定然原裕足，田园财帛更丰盈。', summary: '金榜显祖' },
    '6.1': { text: '不作朝中金榜客，定为世上大财翁，聪明天赋经书熟，名显高科自是荣。', summary: '大富大贵' },
    '6.2': { text: '此命生来福不穷，读书必定显亲宗，紫衣金带为卿相，富贵荣华孰与同。', summary: '卿相之命' },
    '6.3': { text: '命主为官福禄长，得来富贵实非常，名题雁塔传金榜，大显门庭天下扬。', summary: '官禄非常' },
    '6.4': { text: '此格威权不可当，紫袍金带尘高堂，荣华富贵谁能及，万古留名姓氏扬。', summary: '威权显赫' },
    '6.5': { text: '细推此命福非轻，富贵荣华孰与争，定国安邦人极品，威声显赫震寰瀛。', summary: '极品之命' },
    '6.6': { text: '此格人间一福人，堆金积玉满堂春，从来富贵有天定，金榜题名更显亲。', summary: '堆金积玉' },
    '6.7': { text: '此命生来福自宏，田园家业最高隆，平生衣禄盈丰足，一路荣华万事通。', summary: '福自宏' },
    '6.8': { text: '富贵由天莫苦求，万金家计不须谋，十年不比前番事，祖业根基千古留。', summary: '富贵天定' },
    '6.9': { text: '君是人间福禄星，一生富贵众人钦，总然衣禄由天定，安享荣华过一生。', summary: '福禄星' },
    '7.0': { text: '此命推来福不轻，何须愁虑苦劳心，荣华富贵已天定，正笏垂绅拜紫宸。', summary: '拜相之命' },
    '7.1': { text: '此命生成大不同，公侯卿相在其中，一生自有逍遥福，富贵荣华极品隆。', summary: '公侯卿相' },
    '7.2': { text: '此格世界罕有生，十代积善产此人，天上紫微来照命，统治万民乐太平。', summary: '帝王之命' },
  };

  const fortune = fortunes[totalStr] || { text: '此命格暂无详细批语，请参考相近骨重。', summary: '待查' };

  const result = document.getElementById('chenggu-result');
  result.innerHTML = `
    <div class="result-card">
      <div class="result-title">⚖️ 称骨算命结果</div>
      <div style="text-align:center;font-size:28px;font-weight:700;color:var(--accent-dark);margin:12px 0;">
        ${liang}两${qian}钱
      </div>
      <div style="text-align:center;color:var(--text-muted);font-size:12px;margin-bottom:12px;">
        年${yearGz}（${(yw/10).toFixed(1)}两）+ 月${(mw/10).toFixed(1)}两 + 日${(dw/10).toFixed(1)}两 + 时${(hw/10).toFixed(1)}两
      </div>
      <div class="result-section">
        <h5>命格</h5>
        <p style="font-size:16px;font-weight:600;color:var(--accent-dark);">${fortune.summary}</p>
      </div>
      <div class="result-section">
        <h5>批语</h5>
        <p style="font-style:italic;line-height:2;">${fortune.text}</p>
      </div>
    </div>
  `;
};

// ========== 姓名分析 ==========
window._analyzeName = function(e) {
  e.preventDefault();
  const name = document.getElementById('name-input').value.trim();
  if (name.length < 2) return;

  // 计算笔画（简化，常用字笔画表）
  const strokes = getStrokes(name);
  const total = strokes.reduce((a, b) => a + b, 0);

  // 五格计算
  const tianGe = name.length <= 1 ? strokes[0] + 1 : strokes[0];
  const renGe = name.length === 2 ? strokes[0] + strokes[1] : strokes[0] + strokes[1];
  const diGe = name.length <= 2 ? strokes.slice(-1)[0] + 1 : strokes.slice(1).reduce((a,b)=>a+b,0);
  const waiGe = total - renGe + 1;
  const zongGe = total;

  // 三才五行
  const wxNum = [0,'木','木','火','火','土','土','金','金','水','水'];
  const sanCai = `${wxNum[tianGe%10+1] || '木'}${wxNum[renGe%10+1] || '木'}${wxNum[diGe%10+1] || '木'}`;

  // 81数理吉凶
  const jiXiong = getJiXiong(renGe);

  const result = document.getElementById('naming-result');
  result.innerHTML = `
    <div class="result-card">
      <div class="result-title">📝 姓名分析：「${name}」</div>
      <div class="result-section">
        <h5>五格数理</h5>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;">
          <div><div style="font-size:11px;color:var(--text-muted);">天格</div><div style="font-size:20px;font-weight:700;">${tianGe}</div></div>
          <div><div style="font-size:11px;color:var(--text-muted);">人格</div><div style="font-size:20px;font-weight:700;color:var(--accent-dark);">${renGe}</div></div>
          <div><div style="font-size:11px;color:var(--text-muted);">地格</div><div style="font-size:20px;font-weight:700;">${diGe}</div></div>
          <div><div style="font-size:11px;color:var(--text-muted);">外格</div><div style="font-size:20px;font-weight:700;">${waiGe}</div></div>
          <div><div style="font-size:11px;color:var(--text-muted);">总格</div><div style="font-size:20px;font-weight:700;">${zongGe}</div></div>
          <div></div>
        </div>
      </div>
      <div class="result-section">
        <h5>三才配置</h5>
        <p><b>${sanCai}</b> — ${getSanCaiInterpretation(sanCai)}</p>
      </div>
      <div class="result-section">
        <h5>人格数理</h5>
        <p>${renGe}数 · <span class="tag ${jiXiong.type === '吉' ? 'tag-success' : jiXiong.type === '凶' ? 'tag-danger' : 'tag-info'}">${jiXiong.type}</span></p>
        <p>${jiXiong.desc}</p>
      </div>
    </div>
  `;
};

// 简化笔画表
function getStrokes(name) {
  const basicStrokes = {
    '一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10,
    '人':2,'入':2,'八':2,'力':2,'又':2,'丁':2,'了':2,'刀':2,'刁':2,
    '大':3,'口':3,'土':3,'士':3,'夕':3,'女':3,'子':3,'寸':3,'小':3,'山':3,'工':3,'己':3,'已':3,'巳':3,'干':3,'弓':3,
    '王':4,'天':4,'木':4,'支':4,'不':4,'太':4,'犬':4,'友':4,'尤':4,'戈':4,'屯':4,'互':4,'牙':4,'元':4,'云':4,
    '玉':5,'石':5,'古':5,'可':5,'本':5,'甘':5,'申':5,'电':5,'田':5,'由':5,'甲':5,'史':5,'央':5,'兄':5,'冉':5,
    '明':8,'东':8,'林':8,'杰':8,'松':8,'欣':8,'沛':8,'青':8,'承':8,'昊':8,'皓':8,'昂':8,'易':8,'昌':8,'昀':8,
    '文':4,'中':4,'心':4,'戈':4,'户':4,'手':4,'水':4,'火':4,'月':4,
    '白':5,'目':5,'立':5,'禾':5,'穴':5,'正':5,
    '米':6,'竹':6,'自':6,'舟':6,'行':6,'衣':6,'西':6,'羊':6,'羽':6,'而':6,'耳':6,
    '李':7,'吴':7,'沈':7,'汪':7,'宋':7,'何':7,'余':7,'吕':7,'良':7,'志':7,'宏':7,'军':7,'秀':7,'辰':7,'佑':7,
    '金':8,'长':8,'周':8,'孟':8,'季':8,'宗':8,'宜':8,'冠':8,'佳':8,'依':8,'妮':8,'姗':8,
    '俞':9,'侯':9,'姚':9,'段':9,'姜':9,'施':9,'洪':9,'思':9,'冠':9,'威':9,'俊':9,'信':9,'建':9,'星':9,'亮':9,'宣':9,
    '陈':16,'张':11,'刘':15,'王':4,'黄':12,'杨':13,'赵':14,'朱':6,'马':10,'胡':11,'郭':15,'徐':10,'孙':10,'高':10,
    '伟':11,'国':11,'健':11,'强':12,'博':12,'婷':12,'峰':10,'涛':18,'海':11,'洋':10,'浩':11,'涵':12,'雅':12,'洁':16,
    '子':3,'女':3,'山':3,'川':3,'工':3,'己':3,'弓':3,'才':3,'寸':3,'门':8,
    '波':9,'芳':10,'芬':10,'花':10,'美':9,'彦':9,'英':11,'若':11,'茂':11,'荣':14,'莲':17,'华':14,
    '飞':9,'风':9,'龙':16,'宝':20,'玉':5,'珠':11,'瑞':14,'福':14,'祥':11,'麒':19,'麟':23,
    '仁':4,'义':13,'德':15,'信':9,'智':12,'勇':9,'忠':8,'孝':7,'礼':18,'和':8,'平':5,'安':6,'宁':14,'静':16,
    '春':9,'夏':10,'秋':9,'冬':5,'晨':11,'晓':16,'旭':6,'阳':17,'光':6,'辉':15,'晖':13,
    '钰':13,'铭':14,'锋':15,'锐':15,'钧':12,'锦':16,'锡':16,'鑫':24,'铎':21,
    '为':12,'以':5,'可':5,'如':6,'而':6,'若':11,'其':8,'之':4,'也':3,'者':9,'所':8,'于':3,
  };
  return [...name].map(c => basicStrokes[c] || getStrokesFallback(c));
}

function getStrokesFallback(char) {
  // 估算笔画
  const code = char.charCodeAt(0);
  if (code >= 0x4E00 && code <= 0x9FFF) {
    // 简单启发式：取Unicode范围的区间映射
    return Math.max(1, Math.min(30, Math.floor((code - 0x4E00) / 500) + 5));
  }
  return 1;
}

// 81数理吉凶表（简化版）
function getJiXiong(num) {
  const table = {
    1: { type:'吉', desc:'太极之数，万物开泰，生发无穷，利禄亨通。' },
    2: { type:'凶', desc:'两仪之数，混沌未开，进退保守，志望难达。' },
    3: { type:'吉', desc:'三才之数，天地人和，大事大业，繁荣昌隆。' },
    4: { type:'凶', desc:'四象之数，待于生发，万事慎重，不具营谋。' },
    5: { type:'吉', desc:'五行之数，五行俱全，循环相生，圆通畅达。' },
    6: { type:'吉', desc:'六爻之数，发展变化，天赋美德，吉祥安泰。' },
    7: { type:'吉', desc:'七政之数，精悍严谨，天赋之力，吉星照耀。' },
    8: { type:'吉', desc:'八卦之数，乾坎艮震，巽离坤兑，无穷无尽。' },
    9: { type:'凶', desc:'大成之数，蕴涵凶险，或成或败，难以把握。' },
    10: { type:'凶', desc:'终结之数，雪暗飘零，偶或有成，回顾茫然。' },
    11: { type:'吉', desc:'旱苗逢雨，万物更新，调顺发达，恢弘泽世。' },
    12: { type:'凶', desc:'掘井无泉，无理之数，发展薄弱，虽生不足。' },
    13: { type:'吉', desc:'春日牡丹，才艺多能，智谋奇略，忍柔当事。' },
    14: { type:'凶', desc:'破兆之数，沦落天涯，失意烦闷，家庭缘薄。' },
    15: { type:'吉', desc:'福寿之数，福寿圆满，富贵荣誉，涵养雅量。' },
    16: { type:'吉', desc:'厚重之数，厚重载德，安富尊荣，财官双美。' },
    17: { type:'吉', desc:'刚强之数，权威刚强，突破万难，如能容忍，必获成功。' },
    18: { type:'吉', desc:'铁镜重磨，权威显达，博得名利，且养柔德。' },
    19: { type:'凶', desc:'多难之数，风云蔽日，辛苦重来，虽有智谋，万事挫折。' },
    20: { type:'凶', desc:'屋下藏金，非业破运，灾难重重，进退维谷。' },
    21: { type:'吉', desc:'明月中天，光风霁月，万物确立，官运亨通。' },
    22: { type:'凶', desc:'秋草逢霜，困难疾弱，虽出豪杰，人生波折。' },
    23: { type:'吉', desc:'壮丽之数，旭日东升，壮丽壮观，权威旺盛。' },
    24: { type:'吉', desc:'掘藏得金，家门余庆，金钱丰盈，白手成家。' },
    25: { type:'吉', desc:'资性英敏，资性英敏，刚毅果断，才能奇特。' },
    26: { type:'凶', desc:'变怪之数，变怪异奇，波澜重叠，常陷穷困。' },
    27: { type:'凶', desc:'增长之数，欲望无止，自我强烈，多受毁谤。' },
    28: { type:'凶', desc:'阔水浮萍，遭难之数，豪杰气概，四海漂泊。' },
    29: { type:'凶', desc:'智谋之数，智谋优秀，财力归集，名闻海内。' },
    30: { type:'凶', desc:'非运之数，绝境逢生，沉浮不定，凶吉难变。' },
    31: { type:'吉', desc:'春日花开，智勇得志，博得名利，统领众人。' },
    32: { type:'吉', desc:'宝马金鞍，侥幸多望，贵人得助，财帛丰裕。' },
    33: { type:'吉', desc:'旭日升天，鸾凤相会，名闻天下，隆昌至极。' },
    34: { type:'凶', desc:'破家之数，破家之身，见识短小，辛苦遭逢。' },
    35: { type:'吉', desc:'高楼望月，温和平静，智达通畅，文昌技艺。' },
    36: { type:'凶', desc:'波澜重叠，波澜重叠，沉浮万状，侠肝义胆。' },
    37: { type:'吉', desc:'猛虎出林，权威显达，热诚忠信，宜着雅量。' },
    38: { type:'凶', desc:'磨铁成针，意志薄弱，刻意经营，才识不凡。' },
    39: { type:'吉', desc:'富贵荣华，富贵荣华，财帛丰盈，暗藏险象。' },
    40: { type:'凶', desc:'退安之数，智谋胆力，冒险投机，沉浮不定。' },
    41: { type:'吉', desc:'有德之数，纯阳独秀，德高望重，和顺畅达。' },
    42: { type:'凶', desc:'寒蝉在柳，博识多能，精通世情，如能专心。' },
    43: { type:'凶', desc:'散财之数，散财破产，诸事不遂，虽有智谋。' },
    44: { type:'凶', desc:'烦闷之数，破家亡身，暗藏惨淡，事不如意。' },
    45: { type:'吉', desc:'顺风之数，新生泰和，顺风扬帆，智谋经纬。' },
    46: { type:'凶', desc:'浪里淘金，载宝沉舟，浪里淘金，大难尝尽。' },
    47: { type:'吉', desc:'点石成金，开花结果，权威进取，荣华富贵。' },
    48: { type:'吉', desc:'古松立鹤，德智兼备，鹤立鸡群，名利双收。' },
    49: { type:'凶', desc:'转变之数，吉凶难分，得宽则宽，知难而退。' },
    50: { type:'凶', desc:'小舟入海，吉凶互见，一成一败，凶中带吉。' },
    51: { type:'凶', desc:'沉浮之数，盛衰交加，一盛一衰，竭力经营。' },
    52: { type:'吉', desc:'达眼之数，卓识达眼，先见之明，理想实现。' },
    53: { type:'凶', desc:'曲卷难星，外祥内苦，外祥内患，先福后祸。' },
    54: { type:'凶', desc:'石上栽花，石上栽花，难得有活，忧闷烦来。' },
    55: { type:'凶', desc:'善恶之数，善善得恶，恶恶得善，吉到极限。' },
    56: { type:'凶', desc:'浪里行舟，历尽艰辛，四周障碍，万事龃龉。' },
    57: { type:'凶', desc:'日照春松，寒雪青松，夜莺吟春，必遭一过。' },
    58: { type:'凶', desc:'晚行遇月，沉浮多端，先苦后甜，宽宏扬名。' },
    59: { type:'凶', desc:'寒蝉悲风，时运不济，缺乏忍耐，意志衰退。' },
    60: { type:'凶', desc:'无谋之数，黑暗无光，心迷意乱，出尔反尔。' },
    61: { type:'吉', desc:'牡丹芙蓉，名利双收，繁荣富贵，修养积德。' },
    62: { type:'凶', desc:'衰败之数，基础虚弱，艰难困苦，内外不和。' },
    63: { type:'吉', desc:'舟归平海，万物化育，繁荣之象，专心一意。' },
    64: { type:'凶', desc:'非命之数，骨肉分离，孤独悲愁，徒劳无功。' },
    65: { type:'吉', desc:'巨流归海，富贵长寿，天长地久，事事成就。' },
    66: { type:'凶', desc:'岩头步马，进退维谷，艰难不堪，内外失和。' },
    67: { type:'吉', desc:'顺风通达，天赋幸运，事事如意，家道昌隆。' },
    68: { type:'吉', desc:'顺风吹帆，兴家立业，宽容好运，兴家立命。' },
    69: { type:'凶', desc:'坐立不安，时运不济，动摇不定，常陷困境。' },
    70: { type:'凶', desc:'残菊逢霜，惨淡经营，穷迫不伸，寂寞悲苦。' },
    71: { type:'凶', desc:'石上金花，备尝艰苦，养神耐劳，晚景较好。' },
    72: { type:'凶', desc:'月照寒潭，劳苦相伴，外观幸福，内实辛酸。' },
    73: { type:'吉', desc:'志高力微，盛衰交加，徒有高志，奈无实力。' },
    74: { type:'凶', desc:'残花经霜，智能出众，沉沦逆境，难免非难。' },
    75: { type:'凶', desc:'退守之数，退守保吉，发迹甚迟，虽有吉相。' },
    76: { type:'凶', desc:'离散之数，倾覆离散，骨肉分离，内外不合。' },
    77: { type:'凶', desc:'半凶之数，家庭有悦，半吉半凶，晚婚迟得。' },
    78: { type:'凶', desc:'晚境凄凉，晚境凄冷，智能晚成，独立无助。' },
    79: { type:'凶', desc:'云头望月，挽回乏力，精神不安，前途无望。' },
    80: { type:'凶', desc:'遁世之数，隐遁得福，一生困难，辛苦不绝。' },
    81: { type:'吉', desc:'万物回春，还本归元，吉祥重叠，富贵尊荣。' },
  };
  return table[num] || { type:'平', desc:'此数理暂无详细描述。' };
}

function getSanCaiInterpretation(sanCai) {
  const interpretations = {
    '木木木': '三才配置极佳，基础稳固，境遇安泰，可成大业。',
    '木木火': '成功运佳，向上发展，可得意外之成功发展。',
    '木木土': '成功顺调，基础稳固，但需防身心过劳。',
    '木火木': '得上下惠助，顺调发展，基础稳固。',
    '木火火': '顺利成功，基础稳固，可得长寿幸福。',
    '木火土': '虽有成功运，但基础不稳，易生意外。',
    '木土木': '成功运被压抑，不能有所伸张。',
    '木土火': '基础不稳，易生变动，需谨慎行事。',
    '木土土': '成功运被压抑，且易生身心过劳。',
    '火木木': '基础稳固，能得上级提拔，成功发展。',
    '火木火': '顺利成功发展，但缺乏耐久力。',
    '火木土': '基础运佳，成功发展，但需防意外之灾。',
    '火火木': '可得成功发展，但易生纷争，需注意。',
    '火火火': '一时盛运，但易生意外，须防急变。',
    '火火土': '基础稳固，成功发展，名利双收。',
    '火土木': '成功运被压抑，不能伸张，需忍耐。',
    '火土火': '成功运佳，但基础运劣，易生困难。',
    '火土土': '基础运佳，成功发展，但需防急变。',
    '土木木': '表面安稳，内实困苦，家庭生活多纷扰。',
    '土木火': '基础稳固，可获得一时成功，难持久。',
    '土木土': '成功运被压制，难得伸展，需谨慎。',
    '土火木': '基础稳固，可获得意外之成功发展。',
    '土火火': '成功运佳，向上发展，名利双收。',
    '土火土': '基础稳固，但成功运被压制，难伸展。',
    '土土木': '成功运被压制，家庭生活不安。',
    '土土火': '基础稳固，成功发展，家庭生活幸福。',
    '土土土': '基础稳固，一帆风顺，幸福长寿。',
    '金木木': '成功运被压抑，不能有所伸张，徒劳无功。',
    '金木火': '成功运被压抑，基础不稳，易生变动。',
    '金木土': '成功运被压抑，难得成功，需谨慎。',
    '金火木': '表面安稳，内心劳苦，需防意外之灾。',
    '金火火': '一时成功，但易生意外，须防身心过劳。',
    '金火土': '成功运被压抑，难得伸展，但晚年可望。',
    '金土木': '成功运被压抑，家庭生活多苦，难得幸福。',
    '金土火': '成功运佳，但基础不稳，需防意外之灾。',
    '金土土': '基础稳固，成功发展，可得幸福长寿。',
    '水木木': '成功运佳，向上发展，基础稳固。',
    '水木火': '成功发展，基础稳固，但需防意外。',
    '水木土': '成功运佳，但易生变动，需谨慎行事。',
    '水火木': '一时成功，但基础不稳，易生急变。',
    '水火火': '一时盛运，但易生纷争，须防急变。',
    '水火土': '成功运被压抑，难得伸展，需忍耐。',
    '水土木': '成功运被压制，不能伸展，需谨慎。',
    '水土火': '基础稳固，可获得一时成功。',
    '水土土': '成功运被压制，但晚年可得安定。',
  };
  return interpretations[sanCai] || '三才配置较为均衡，一生运势平稳，需根据具体情况调整方向。';
}

// ========== 六十四卦搜索 ==========
window._searchHexagram = function(query) {
  if (typeof HEXAGRAMS === 'undefined') return;
  const filtered = query
    ? HEXAGRAMS.filter(h => h.name.includes(query) || h.description.includes(query) || h.judgment.includes(query))
    : HEXAGRAMS;
  renderHexagramItems(filtered);
};

// ========== 卦详情 ==========
window._showHexagram = function(id) {
  if (typeof HEXAGRAMS === 'undefined') return;
  const hex = HEXAGRAMS.find(h => h.id === id);
  if (!hex) return;

  const list = document.getElementById('hexagram-list');
  const detail = document.getElementById('hexagram-detail');

  list.classList.add('hidden');
  detail.classList.remove('hidden');
  detail.innerHTML = `
    <div class="result-card" style="margin-top:0;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <button class="btn-outline" onclick="window._backToHexList()">← 返回列表</button>
        <span class="tag tag-accent">第${hex.id}卦</span>
      </div>
      <div class="result-title">${hex.name}卦 · ${hex.description}</div>
      <div class="text-center" style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">
        ${hex.upperTrigram}上${hex.lowerTrigram}下
      </div>
      <div class="result-section">
        <h5>卦辞</h5>
        <p style="font-size:15px;">${hex.judgment}</p>
      </div>
      <div class="result-section">
        <h5>解读</h5>
        <p>${hex.judgmentInterpretation}</p>
      </div>
      <div class="result-section">
        <h5>彖传</h5>
        <p style="font-size:13px;">${hex.tuan || '待完善'}</p>
      </div>
      <div class="result-section">
        <h5>大象</h5>
        <p>${hex.xiang || '待完善'}</p>
      </div>
      ${hex.lines ? hex.lines.map((l, i) => `
        <div class="result-section">
          <h5>${['初','二','三','四','五','上'][i]}爻 ${l.position} — 爻辞</h5>
          <p>${l.text || '待完善'}</p>
          <p style="font-size:13px;color:var(--text-secondary);">解读：${l.interpretation || '待完善'}</p>
        </div>
      `).join('') : '<p style="text-align:center;color:var(--text-muted);">爻辞数据加载中...</p>'}
    </div>
  `;
  document.getElementById('app-main').scrollTop = 0;
};

window._backToHexList = function() {
  document.getElementById('hexagram-list').classList.remove('hidden');
  document.getElementById('hexagram-detail').classList.add('hidden');
};

// ========== 塔罗 ==========
let tarotDeck = [];
window._tarotSetSpread = function(num) {
  state.tarotSpread = num;
  document.querySelectorAll('#tarot-content .btn-outline').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`tarot-${num}card`);
  if (btn) btn.classList.add('active');
};

window._tarotDraw = function() {
  if (typeof TAROT_DECK === 'undefined') {
    // 使用简化的塔罗牌
    tarotDeck = getSimpleTarotDeck();
  } else {
    tarotDeck = [...TAROT_DECK];
  }
  // 洗牌
  for (let i = tarotDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tarotDeck[i], tarotDeck[j]] = [tarotDeck[j], tarotDeck[i]];
  }

  const cards = tarotDeck.slice(0, state.tarotSpread);
  const area = document.getElementById('tarot-cards-area');
  area.innerHTML = `
    <div class="tarot-grid">
      ${cards.map((c, i) => `
        <div class="tarot-card" id="tarot-card-${i}" onclick="window._revealTarot(${i})" title="点击翻牌">
          ✦
        </div>
      `).join('')}
    </div>
    <div style="text-align:center;color:var(--text-muted);font-size:12px;">点击牌面翻牌</div>
  `;
  window._tarotCards = cards;
};

window._revealTarot = function(index) {
  const card = window._tarotCards[index];
  const el = document.getElementById(`tarot-card-${index}`);
  if (!el || !card) return;

  const isReversed = Math.random() > 0.5;
  card.reversed = isReversed;

  el.classList.add('revealed');
  el.innerHTML = `
    <div style="text-align:center;padding:8px;">
      <div style="font-size:32px;">${card.emoji || '🃏'}</div>
      <div class="card-name" style="font-size:10px;margin-top:4px;">${card.name}</div>
      ${isReversed ? '<div style="font-size:9px;color:#c62828;">逆位</div>' : ''}
    </div>
  `;

  // 显示解读
  const result = document.getElementById('tarot-result');
  result.innerHTML = `
    <div class="result-card">
      <div class="result-title">🎴 ${card.name}${isReversed ? '（逆位）' : '（正位）'}</div>
      <div class="result-section">
        <h5>含义</h5>
        <p>${isReversed ? (card.reversed_meaning || card.meaning) : (card.upright_meaning || card.meaning)}</p>
      </div>
    </div>
  `;
};

function getSimpleTarotDeck() {
  return [
    { name:'愚者', emoji:'🌟', meaning:'新的开始，冒险，天真，自由。正位代表勇敢迈出第一步，逆位代表鲁莽和缺乏计划。', reversed_meaning:'鲁莽行事，缺乏考虑，不必要的冒险。' },
    { name:'魔术师', emoji:'🎩', meaning:'创造力，技能，意志力。正位代表你有能力实现目标，逆位代表能力被浪费或滥用。', reversed_meaning:'才能被浪费，欺骗，缺乏方向。' },
    { name:'女祭司', emoji:'🌙', meaning:'直觉，潜意识，神秘。正位代表相信你的直觉，逆位代表忽视内在声音。', reversed_meaning:'忽视直觉，隐藏的秘密，表面知识。' },
    { name:'皇后', emoji:'👑', meaning:'丰饶，母性，自然。正位代表丰收和滋养，逆位代表依赖和创造力受阻。', reversed_meaning:'依赖他人，创造力受阻，情感空虚。' },
    { name:'皇帝', emoji:'🏰', meaning:'权威，结构，控制。正位代表领导力和稳定，逆位代表专制和缺乏纪律。', reversed_meaning:'专制，缺乏纪律，权力滥用。' },
    { name:'教皇', emoji:'⛪', meaning:'传统，信仰，教导。正位代表遵循传统智慧，逆位代表打破常规。', reversed_meaning:'打破传统，非正统方法，盲目追随。' },
    { name:'恋人', emoji:'💕', meaning:'爱情，和谐，选择。正位代表真诚的关系，逆位代表价值观冲突。', reversed_meaning:'价值观冲突，不忠，错误选择。' },
    { name:'战车', emoji:'🏇', meaning:'意志力，胜利，决心。正位代表克服困难，逆位代表失控和失败。', reversed_meaning:'失控，侵略性，失败。' },
    { name:'力量', emoji:'🦁', meaning:'勇气，耐心，内在力量。正位代表以柔克刚，逆位代表软弱和失控。', reversed_meaning:'软弱，自我怀疑，失控。' },
    { name:'隐士', emoji:'🏮', meaning:'内省，孤独，指引。正位代表自我反思，逆位代表孤立和逃避。', reversed_meaning:'孤立，逃避现实，拒绝建议。' },
    { name:'命运之轮', emoji:'🎡', meaning:'命运，转折，循环。正位代表好运来临，逆位代表厄运和抗拒变化。', reversed_meaning:'厄运，抗拒变化，失控。' },
    { name:'正义', emoji:'⚖️', meaning:'公正，真理，因果。正位代表公平结果，逆位代表不公和逃避责任。', reversed_meaning:'不公正，逃避责任，法律问题。' },
    { name:'倒吊人', emoji:'🙃', meaning:'牺牲，新视角，暂停。正位代表换个角度看问题，逆位代表停滞和抗拒。', reversed_meaning:'停滞，抗拒必要的牺牲，自我中心。' },
    { name:'死神', emoji:'💀', meaning:'结束，转变，重生。正位代表必要的结束和新开始，逆位代表抗拒改变。', reversed_meaning:'抗拒改变，停滞不前，恐惧转变。' },
    { name:'节制', emoji:'🏺', meaning:'平衡，适度，和谐。正位代表中庸之道，逆位代表极端和失衡。', reversed_meaning:'失衡，过度，缺乏节制。' },
    { name:'恶魔', emoji:'😈', meaning:'束缚，物质主义，欲望。正位代表正视阴影，逆位代表挣脱束缚。', reversed_meaning:'挣脱束缚，重获自由，觉醒。' },
    { name:'高塔', emoji:'🗼', meaning:'突变，崩溃，启示。正位代表突然的改变，逆位代表避免灾难。', reversed_meaning:'避免灾难，抗拒改变，内心恐惧。' },
    { name:'星星', emoji:'⭐', meaning:'希望，灵感，宁静。正位代表希望和治愈，逆位代表绝望和失去信心。', reversed_meaning:'绝望，失去信心，缺乏灵感。' },
    { name:'月亮', emoji:'🌜', meaning:'幻觉，恐惧，潜意识。正位代表面对恐惧，逆位代表恐惧被释放。', reversed_meaning:'恐惧被释放，真相显现，混乱消退。' },
    { name:'太阳', emoji:'☀️', meaning:'快乐，成功，活力。正位代表幸福和成就，逆位代表暂时的阴霾。', reversed_meaning:'暂时的阴霾，成功延迟，失去热情。' },
    { name:'审判', emoji:'📯', meaning:'重生，召唤，觉醒。正位代表内心的觉醒，逆位代表拒绝召唤。', reversed_meaning:'拒绝召唤，自我怀疑，错过机会。' },
    { name:'世界', emoji:'🌍', meaning:'完成，圆满，成就。正位代表大功告成，逆位代表未完成和延迟。', reversed_meaning:'未完成，延迟，缺乏圆满。' },
    // 额外小牌
    { name:'权杖王牌', emoji:'🪵', meaning:'新的开始，灵感，成长潜力。大胆行动的好时机。', reversed_meaning:'延迟，缺乏方向，错过机会。' },
    { name:'圣杯王牌', emoji:'🏆', meaning:'新的感情，直觉，喜悦。情感充沛的开始。', reversed_meaning:'情感空虚，错失良缘，内心枯竭。' },
    { name:'宝剑王牌', emoji:'⚔️', meaning:'清晰的思维，真理，正义。头脑清晰，做出正确决策。', reversed_meaning:'思维混乱，不公正，错误判断。' },
    { name:'星币王牌', emoji:'🪙', meaning:'财富，稳定，实质回报。新的财务机会。', reversed_meaning:'错失财务机会，不稳定的基础，贪婪。' },
  ];
}

// ========== 生肖运势 ==========
window._showShengXiao = function(sx) {
  const shengxiaoInfo = {
    '鼠': { wuxing:'水', str:'机智灵活，精明能干，适应力强，但有时过于计较。', lucky:['牛','龙','猴'], unlucky:['马','羊'] },
    '牛': { wuxing:'土', str:'勤奋踏实，诚实可靠，有坚强的意志，但有时固执己见。', lucky:['鼠','蛇','鸡'], unlucky:['羊','马'] },
    '虎': { wuxing:'木', str:'勇敢果断，富有冒险精神，领导能力强，但有时过于冲动。', lucky:['马','狗','猪'], unlucky:['猴','蛇'] },
    '兔': { wuxing:'木', str:'温和善良，心思细腻，有艺术气质，但有时优柔寡断。', lucky:['羊','狗','猪'], unlucky:['鸡','龙'] },
    '龙': { wuxing:'土', str:'自信满满，有远大理想，天生的领导者，但有时过于自负。', lucky:['鼠','猴','鸡'], unlucky:['狗','兔'] },
    '蛇': { wuxing:'火', str:'智慧深沉，直觉敏锐，有神秘感，但有时过于多疑。', lucky:['牛','鸡','猴'], unlucky:['猪','虎'] },
    '马': { wuxing:'火', str:'热情奔放，自由不羁，行动力强，但有时缺乏耐心。', lucky:['虎','羊','狗'], unlucky:['鼠','牛'] },
    '羊': { wuxing:'土', str:'温柔体贴，有艺术天赋，善解人意，但有时过于依赖。', lucky:['兔','马','猪'], unlucky:['牛','狗'] },
    '猴': { wuxing:'金', str:'聪明机智，灵活多变，善于交际，但有时不够专注。', lucky:['鼠','龙','蛇'], unlucky:['虎','猪'] },
    '鸡': { wuxing:'金', str:'勤奋精细，有责任感，追求完美，但有时过于挑剔。', lucky:['牛','龙','蛇'], unlucky:['兔','狗'] },
    '狗': { wuxing:'土', str:'忠诚正直，重情重义，有正义感，但有时过于保守。', lucky:['虎','兔','马'], unlucky:['龙','鸡'] },
    '猪': { wuxing:'水', str:'诚实宽厚，乐观豁达，人缘好，但有时过于天真。', lucky:['虎','兔','羊'], unlucky:['蛇','猴'] },
  };

  const info = shengxiaoInfo[sx];
  if (!info) return;

  const curYear = new Date().getFullYear();
  const ganIdx = (curYear - 4) % 10;
  const zhiIdx = (curYear - 4) % 12;
  const yearZhi = DI_ZHI[zhiIdx];
  const yearSx = SHENG_XIAO_MAP[yearZhi];

  const fortuneLevel = getShengXiaoYearFortune(sx, yearZhi);

  const result = document.getElementById('shengxiao-result');
  result.innerHTML = `
    <div class="result-card">
      <div class="result-title">🐉 生肖「${sx}」运势</div>
      <div class="result-section">
        <h5>基本性格</h5>
        <p>${info.str}</p>
        <p><b>五行：</b>${info.wuxing} · <b>三合生肖：</b>${info.lucky.join('、')} · <b>相冲：</b>${info.unlucky.join('、')}</p>
      </div>
      <div class="result-section">
        <h5>${curYear}年（${SHENG_XIAO_MAP[yearZhi]}年）运势</h5>
        <p style="font-size:16px;font-weight:600;color:var(--accent-dark);">${fortuneLevel.level}</p>
        <p><b>总体：</b>${fortuneLevel.overall}</p>
        <p><b>事业：</b>${fortuneLevel.career}</p>
        <p><b>财运：</b>${fortuneLevel.wealth}</p>
        <p><b>感情：</b>${fortuneLevel.love}</p>
        <p><b>健康：</b>${fortuneLevel.health}</p>
      </div>
    </div>
  `;
};

function getShengXiaoYearFortune(sx, yearZhi) {
  const sxZhi = Object.keys(SHENG_XIAO_MAP).find(k => SHENG_XIAO_MAP[k] === sx);
  // 相合相冲判断
  const he = { '子':'丑','丑':'子','寅':'亥','亥':'寅','卯':'戌','戌':'卯','辰':'酉','酉':'辰','巳':'申','申':'巳','午':'未','未':'午' };
  const chong = { '子':'午','午':'子','丑':'未','未':'丑','寅':'申','申':'寅','卯':'酉','酉':'卯','辰':'戌','戌':'辰','巳':'亥','亥':'巳' };

  if (he[sxZhi] === yearZhi) {
    return { level:'⭐⭐⭐⭐⭐ 大吉', overall:'六合之年，万事顺遂，贵人相助。', career:'事业有贵人提携，可大胆拓展。', wealth:'财运亨通，投资理财皆有收获。', love:'桃花旺盛，单身者有望遇到良缘。', health:'身体状况良好，精力充沛。' };
  }
  if (chong[sxZhi] === yearZhi) {
    return { level:'⭐⭐ 谨慎', overall:'相冲之年，变动较多，宜静不宜动。', career:'工作中容易遇到阻碍，需耐心应对。', wealth:'财务上宜保守，避免大额投资。', love:'感情易生波折，多沟通少争执。', health:'注意身体健康，避免过度劳累。' };
  }
  return { level:'⭐⭐⭐ 平稳', overall:'运势平稳，稳中有进，适合积累和沉淀。', career:'按部就班，做好分内事，等待机会。', wealth:'收支平衡，适合长期理财规划。', love:'感情平稳发展，细水长流。', health:'维持现状，规律作息即可。' };
}

// ========== 主题切换 ==========
function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('yx-theme', state.theme);
}

// ========== 初始化 ==========
function init() {
  // 主题
  document.documentElement.setAttribute('data-theme', state.theme);

  // 事件绑定
  document.getElementById('btn-theme').addEventListener('click', toggleTheme);

  // 底部导航
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      if (page === state.currentPage) return; // 已在当前页
      if (page === 'home') { state.tabHistory = []; } // 回首页清历史
      else if (state.currentPage !== 'home') { state.tabHistory.push(state.currentPage); }
      navigateTo(page);
    });
  });

  // 返回按钮
  document.addEventListener('click', e => {
    if (e.target.classList.contains('back-btn')) {
      e.target.disabled = true;
      goBack();
      setTimeout(() => { e.target.disabled = false; }, 300);
    }
  });

  // 快捷操作
  window._nav = (page) => {
    if (page === state.currentPage) return;
    state.tabHistory.push(state.currentPage);
    navigateTo(page);
  };

  // 首页渲染
  renderHome();
}

// ========== 八字排盘算法 ==========
window._bzSetGender = function(gender) {
  state.baziGender = gender;
  document.querySelectorAll('#bz-gender-m, #bz-gender-f').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(gender === '男' ? 'bz-gender-m' : 'bz-gender-f');
  if (btn) btn.classList.add('active');
};

window._trySafe = function(fn, id, label) {
  try { fn(); }
  catch (err) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `<div class="text-center mt-16" style="color:var(--text-muted)">${label || '计算'}失败：${err.message}</div>`;
    console.error(err);
  }
};

window._calcBazi = function(e) {
  e.preventDefault();
  const dateStr = document.getElementById('bazi-date').value;
  const hourIdx = parseInt(document.getElementById('bazi-hour').value);
  if (!dateStr) return;

  const birthDate = new Date(dateStr + 'T12:00:00');
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();

  // 年柱干支
  const yearGanIdx = (year - 4) % 10;
  const yearZhiIdx = (year - 4) % 12;
  const yearGz = TIAN_GAN[yearGanIdx] + DI_ZHI[yearZhiIdx];

  // 月柱：年上起月法（五虎遁）
  // 甲己之年丙作首，乙庚之岁戊为头，丙辛必定寻庚起，丁壬壬位顺行流，若问戊癸何方发，甲寅之上好追求
  const yueGanStart = { '甲':'丙','乙':'戊','丙':'庚','丁':'壬','戊':'甲','己':'丙','庚':'戊','辛':'庚','壬':'壬','癸':'甲' };
  const yueGanBase = TIAN_GAN.indexOf(yueGanStart[TIAN_GAN[yearGanIdx]]);
  const yueGan = TIAN_GAN[(yueGanBase + month - 1) % 10];
  const yueZhi = DI_ZHI[(month + 1) % 12]; // 寅月为正月
  const yueZhiActual = DI_ZHI[(month + 1) % 12];

  // 日柱干支（简化公式）
  const baseDate = new Date(1900, 0, 1);
  const diffDays = Math.floor((birthDate - baseDate) / (1000 * 60 * 60 * 24));
  const dayGanIdx = ((diffDays % 10) + 10) % 10;
  const dayZhiIdx = ((diffDays % 12) + 12) % 12;
  const riGan = TIAN_GAN[dayGanIdx];
  const riZhi = DI_ZHI[dayZhiIdx];

  // 时柱：日上起时法（五鼠遁）
  // 甲己还加甲，乙庚丙作初，丙辛从戊起，丁壬庚子居，戊癸何方发，壬子是真途
  const shiGanStart = { '甲':'甲','乙':'丙','丙':'戊','丁':'庚','戊':'壬','己':'甲','庚':'丙','辛':'戊','壬':'庚','癸':'壬' };
  const shiGanBase = TIAN_GAN.indexOf(shiGanStart[riGan]);
  const shiGan = TIAN_GAN[(shiGanBase + hourIdx) % 10];
  const shiZhi = DI_ZHI[hourIdx];

  // 五行统计
  const wxCount = { '木':0,'火':0,'土':0,'金':0,'水':0 };
  [yearGz[0], riGan, shiGan, yueGan].forEach(g => { wxCount[TIAN_GAN_WUXING[g]]++; });
  [yearGz[1], riZhi, shiZhi, yueZhiActual].forEach(z => { wxCount[DI_ZHI_WUXING[z]]++; });

  // 十神
  const shiShen = {};
  ['年','月','日','时'].forEach((pillar, i) => {
    const gans = [yearGz[0], yueGan, riGan, shiGan];
    if (i !== 2) shiShen[pillar] = getLocalShiShen(riGan, gans[i]);
  });

  // 纳音
  const naYinMap = {
    '甲子':'海中金','乙丑':'海中金','丙寅':'炉中火','丁卯':'炉中火','戊辰':'大林木','己巳':'大林木',
    '庚午':'路旁土','辛未':'路旁土','壬申':'剑锋金','癸酉':'剑锋金','甲戌':'山头火','乙亥':'山头火',
    '丙子':'涧下水','丁丑':'涧下水','戊寅':'城头土','己卯':'城头土','庚辰':'白蜡金','辛巳':'白蜡金',
    '壬午':'杨柳木','癸未':'杨柳木','甲申':'泉中水','乙酉':'泉中水','丙戌':'屋上土','丁亥':'屋上土',
    '戊子':'霹雳火','己丑':'霹雳火','庚寅':'松柏木','辛卯':'松柏木','壬辰':'长流水','癸巳':'长流水',
    '甲午':'沙中金','乙未':'沙中金','丙申':'山下火','丁酉':'山下火','戊戌':'平地木','己亥':'平地木',
    '庚子':'壁上土','辛丑':'壁上土','壬寅':'金箔金','癸卯':'金箔金','甲辰':'覆灯火','乙巳':'覆灯火',
    '丙午':'天河水','丁未':'天河水','戊申':'大驿土','己酉':'大驿土','庚戌':'钗钏金','辛亥':'钗钏金',
    '壬子':'桑柘木','癸丑':'桑柘木','甲寅':'大溪水','乙卯':'大溪水','丙辰':'沙中土','丁巳':'沙中土',
    '戊午':'天上火','己未':'天上火','庚申':'石榴木','辛酉':'石榴木','壬戌':'大海水','癸亥':'大海水'
  };

  const result = document.getElementById('bazi-result');
  result.innerHTML = `
    <div class="result-card">
      <div class="result-title">☯ 八字命盘</div>
      <div style="text-align:center;font-size:13px;color:var(--text-muted);margin-bottom:12px;">
        ${state.baziGender} · ${year}年${month}月${day}日 ${DI_ZHI[hourIdx]}时
      </div>
      <div class="bazi-pan">
        <div class="bazi-pillar">
          <div class="bp-label">年柱</div>
          <div class="bp-gan">${yearGz[0]}</div>
          <div class="bp-zhi">${yearGz[1]}</div>
          <div style="font-size:10px;color:var(--text-muted);">${naYinMap[yearGz]||''}</div>
        </div>
        <div class="bazi-pillar">
          <div class="bp-label">月柱</div>
          <div class="bp-gan">${yueGan}</div>
          <div class="bp-zhi">${yueZhiActual}</div>
          <div style="font-size:10px;color:var(--text-muted);">${naYinMap[yueGan+yueZhiActual]||''}</div>
        </div>
        <div class="bazi-pillar" style="border:2px solid var(--accent);">
          <div class="bp-label">日柱（主）</div>
          <div class="bp-gan" style="font-size:24px;">${riGan}</div>
          <div class="bp-zhi">${riZhi}</div>
          <div style="font-size:10px;color:var(--text-muted);">${naYinMap[riGan+riZhi]||''}</div>
        </div>
        <div class="bazi-pillar">
          <div class="bp-label">时柱</div>
          <div class="bp-gan">${shiGan}</div>
          <div class="bp-zhi">${shiZhi}</div>
          <div style="font-size:10px;color:var(--text-muted);">${naYinMap[shiGan+shiZhi]||''}</div>
        </div>
      </div>
      <div class="result-section">
        <h5>五行分布</h5>
        <div class="wuxing-bars">
          ${['木','火','土','金','水'].map(wx => `
            <div class="wuxing-bar">
              <div class="wb-label">${wx}</div>
              <div class="wb-track"><div class="wb-fill wb-${({木:'mu',火:'huo',土:'tu',金:'jin',水:'shui'}[wx])}" style="width:${(wxCount[wx]/8*100)}%"></div></div>
              <span style="font-size:11px;width:16px;">${wxCount[wx]}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="result-section">
        <h5>十神配置</h5>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${Object.entries(shiShen).map(([p, s]) => `<span class="tag tag-accent">${p}：${s}</span>`).join('')}
        </div>
      </div>
      <div class="result-section">
        <h5>命理简析</h5>
        <p>${getBaziSimpleAnalysis(riGan, wxCount, shiShen)}</p>
      </div>
    </div>
  `;
};

function getLocalShiShen(riGan, otherGan) {
  const riWx = TIAN_GAN_WUXING[riGan];
  const oWx = TIAN_GAN_WUXING[otherGan];
  const riYY = TIAN_GAN_YINYANG[riGan];
  const oYY = TIAN_GAN_YINYANG[otherGan];
  if(riWx === oWx) return riYY === oYY ? '比肩' : '劫财';
  if(WU_XING_SHENG && WU_XING_SHENG[oWx] === riWx) return oYY === riYY ? '偏印' : '正印';
  if(WU_XING_SHENG && WU_XING_SHENG[riWx] === oWx) return riYY === oYY ? '食神' : '伤官';
  if(WU_XING_KE && WU_XING_KE[oWx] === riWx) return oYY === riYY ? '七杀' : '正官';
  if(WU_XING_KE && WU_XING_KE[riWx] === oWx) return riYY === oYY ? '偏财' : '正财';
  return '未知';
}

function getBaziSimpleAnalysis(riGan, wxCount, shiShen) {
  const riWx = TIAN_GAN_WUXING[riGan];
  const dominating = Object.entries(wxCount).sort((a,b) => b[1]-a[1])[0];

  let analysis = `日主${riGan}（${riWx}），`;
  if (dominating[1] >= 4) {
    analysis += `八字中${dominating[0]}过旺，日主${riWx === dominating[0] ? '身强，个性刚毅果断，但也容易固执' : `受${dominating[0]}克制较强，需注意相关方面的平衡`}。`;
  } else {
    analysis += `五行较为均衡，为人处事圆融，适应力强。`;
  }

  const shiShenVals = Object.values(shiShen);
  if (shiShenVals.includes('正官') || shiShenVals.includes('七杀')) {
    analysis += '命带官杀，事业心强，有管理才能，适合在组织中发展。';
  }
  if (shiShenVals.includes('正财') || shiShenVals.includes('偏财')) {
    analysis += '财星显现，对物质和财富有较好的掌控力。';
  }
  if (shiShenVals.includes('正印') || shiShenVals.includes('偏印')) {
    analysis += '印星护身，学业运佳，有贵人相助，适合知识型职业。';
  }

  return analysis;
}

// 全局函数暴露
window._lySetMethod = window._lySetMethod;
window._lyTossCoins = window._lyTossCoins;
window._lyManualSubmit = window._lyManualSubmit;
window._calcBazi = window._calcBazi;
window._bzSetGender = window._bzSetGender;
window._searchHexagram = window._searchHexagram;
window._showHexagram = window._showHexagram;
window._backToHexList = window._backToHexList;
window._calcChengGu = window._calcChengGu;
window._calcMeiHua = window._calcMeiHua;
window._showShengXiao = window._showShengXiao;
window._analyzeName = window._analyzeName;
window._tarotSetSpread = window._tarotSetSpread;
window._tarotDraw = window._tarotDraw;
window._revealTarot = window._revealTarot;

// 启动（模块脚本是deferred，DOMContentLoaded可能已触发）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
