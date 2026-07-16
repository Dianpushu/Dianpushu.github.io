'use strict';
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =========================================================
   BOOT SEQUENCE
========================================================= */
const bootEl = document.getElementById('boot');
const bootLinesEl = document.getElementById('boot-lines');
const bootScript = [
  '> BOOTING DIANPUSHU PUBLIC PORTAL v2.0 …',
  '> 載入拖延症核心模組 ………………… <span class="ok">OK</span>',
  '> 載入無限點子產生器 ………………… <span class="ok">OK</span>',
  '> 掃描已發布產品 ……………………… <span class="warn">NOT FOUND (as expected)</span>',
  '> 初始化氣勢 …………………………… <span class="max">MAX</span>',
  '> WELCOME, GUEST.'
];
function finishBoot() {
  bootEl.classList.add('done');
  setTimeout(() => bootEl.remove(), 700);
}
if (REDUCED || sessionStorage.getItem('dp-booted')) {
  finishBoot();
} else {
  bootScript.forEach((line, i) => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = 'boot-line';
      div.innerHTML = line;
      bootLinesEl.appendChild(div);
    }, 150 + i * 230);
  });
  setTimeout(finishBoot, 150 + bootScript.length * 230 + 500);
  bootEl.addEventListener('click', finishBoot);
  sessionStorage.setItem('dp-booted', '1');
}

/* =========================================================
   STARFIELD (mouse-reactive)
========================================================= */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;
let stars = [];
const mouse = { x: -9999, y: -9999 };

addEventListener('resize', () => {
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
  initStars();
});
addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

class Star {
  constructor() { this.reset(true); }
  reset(spawn) {
    this.x = Math.random() * W;
    this.y = spawn ? Math.random() * H : -5;
    this.size = Math.random() * 1.8 + 0.4;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = Math.random() * 0.25 + 0.05;
    this.alpha = Math.random() * 0.6 + 0.2;
    this.tw = Math.random() * Math.PI * 2;
    this.hue = Math.random() < 0.75 ? '138, 197, 255' : '196, 160, 255';
  }
  step() {
    this.x += this.vx; this.y += this.vy;
    this.tw += 0.035;
    // gentle repulsion from cursor
    const dx = this.x - mouse.x, dy = this.y - mouse.y;
    const d2 = dx * dx + dy * dy;
    if (d2 < 16000) {
      const d = Math.sqrt(d2) || 1;
      this.x += (dx / d) * 1.1;
      this.y += (dy / d) * 1.1;
    }
    if (this.y > H + 5 || this.x < -5 || this.x > W + 5) this.reset(false);
  }
  draw() {
    const a = this.alpha * (0.65 + 0.35 * Math.sin(this.tw));
    ctx.fillStyle = 'rgba(' + this.hue + ',' + a + ')';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// occasional shooting star
let shooting = null;
function maybeShoot() {
  if (!shooting && Math.random() < 0.005) {
    shooting = {
      x: Math.random() * W * 0.7 + W * 0.15, y: Math.random() * H * 0.3,
      vx: 7 + Math.random() * 5, vy: 3 + Math.random() * 2, life: 1
    };
  }
  if (shooting) {
    shooting.life -= 0.02;
    shooting.x += shooting.vx; shooting.y += shooting.vy;
    const grad = ctx.createLinearGradient(shooting.x, shooting.y, shooting.x - shooting.vx * 10, shooting.y - shooting.vy * 10);
    grad.addColorStop(0, 'rgba(190, 220, 255, ' + (0.9 * shooting.life) + ')');
    grad.addColorStop(1, 'rgba(190, 220, 255, 0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(shooting.x, shooting.y);
    ctx.lineTo(shooting.x - shooting.vx * 10, shooting.y - shooting.vy * 10);
    ctx.stroke();
    if (shooting.life <= 0 || shooting.x > W + 60) shooting = null;
  }
}

function initStars() {
  stars = [];
  const n = Math.min(Math.floor((W * H) / 11000), 110);
  for (let i = 0; i < n; i++) stars.push(new Star());
}
function loopStars() {
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i < stars.length; i++) { stars[i].step(); stars[i].draw(); }
  // constellation lines
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x, dy = stars[i].y - stars[j].y;
      const dist = dx * dx + dy * dy;
      if (dist < 12100) {
        ctx.strokeStyle = 'rgba(138, 180, 255, ' + (0.08 * (1 - dist / 12100)) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.stroke();
      }
    }
  }
  maybeShoot();
  requestAnimationFrame(loopStars);
}
initStars();
if (REDUCED) {
  for (const s of stars) s.draw();
} else {
  loopStars();
}

/* =========================================================
   TYPING EFFECT
========================================================= */
const typingTexts = [
  'Nothing to see here… yet (or is there?)',
  'Powered by friendship, caffeine & 100% procrastination.',
  'Shipping great products since… TBD.',
  '404: Introduction not found — but vibes are 200 OK!',
  'sudo make world_domination  # permission denied'
];
let tIdx = 0, cIdx = 0, deleting = false;
const typingEl = document.getElementById('typing-text');
function typeLoop() {
  const full = typingTexts[tIdx % typingTexts.length];
  typingEl.textContent = full.substring(0, deleting ? --cIdx : ++cIdx);
  let delay = deleting ? 28 : 62;
  if (!deleting && cIdx === full.length) { delay = 2400; deleting = true; }
  else if (deleting && cIdx === 0) { deleting = false; tIdx++; delay = 420; }
  setTimeout(typeLoop, delay);
}
if (REDUCED) { typingEl.textContent = typingTexts[0]; } else { typeLoop(); }

/* =========================================================
   SCROLL: progress bar + reveal + counters + progress fills
========================================================= */
const progressBar = document.getElementById('scroll-progress');
addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  if (!target) { el.textContent = el.dataset.count; return; }
  const dur = 1400, t0 = performance.now();
  function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const io = new IntersectionObserver(entries => {
  for (const en of entries) {
    if (!en.isIntersecting) continue;
    en.target.classList.add('in');
    en.target.querySelectorAll('[data-count]').forEach(animateCount);
    en.target.querySelectorAll('.progress-fill').forEach(f => {
      f.style.width = f.dataset.width;
    });
    io.unobserve(en.target);
  }
}, { threshold: 0.18 });
document.querySelectorAll('.reveal, .stats-grid').forEach(el => io.observe(el));

/* =========================================================
   CARD SPOTLIGHT
========================================================= */
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

/* =========================================================
   TOAST
========================================================= */
const toastEl = document.getElementById('toast');
let toastTimer;
function toast(msg, ms = 3200) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
}

/* =========================================================
   MATRIX RAIN (easter egg)
========================================================= */
const mCanvas = document.getElementById('matrix');
const mCtx = mCanvas.getContext('2d');
let matrixTimer = null, matrixRAF = null;
function startMatrix(duration = 6000) {
  mCanvas.width = innerWidth; mCanvas.height = innerHeight;
  const fontSize = 16;
  const cols = Math.floor(mCanvas.width / fontSize);
  const drops = Array(cols).fill(1);
  const glyphs = '點鋪書DIANPUSHU01アカサタナ<>/{};=+*';
  mCanvas.classList.add('on');
  function rain() {
    mCtx.fillStyle = 'rgba(4, 6, 12, 0.1)';
    mCtx.fillRect(0, 0, mCanvas.width, mCanvas.height);
    mCtx.fillStyle = '#34d399';
    mCtx.font = fontSize + 'px "Fira Code", monospace';
    for (let i = 0; i < drops.length; i++) {
      const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
      mCtx.fillText(ch, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > mCanvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    matrixRAF = requestAnimationFrame(rain);
  }
  cancelAnimationFrame(matrixRAF);
  rain();
  clearTimeout(matrixTimer);
  matrixTimer = setTimeout(() => {
    mCanvas.classList.remove('on');
    setTimeout(() => { cancelAnimationFrame(matrixRAF); mCtx.clearRect(0, 0, mCanvas.width, mCanvas.height); }, 600);
  }, duration);
}

/* =========================================================
   TERMINAL v2.0 — history, tab-complete, easter eggs
========================================================= */
const terminalInput = document.getElementById('terminal-input');
const terminalHistory = document.getElementById('terminal-history');
const terminalBody = document.getElementById('terminal-body');
const cmdHistory = [];
let histIdx = -1;

const COMMANDS = ['help', 'whoami', 'ls', 'ls ./products', 'git log', 'status', 'roadmap',
  'neofetch', 'sudo', 'matrix', 'hack', 'coffee', 'fortune', 'date', 'echo', 'ping', 'clear', 'exit'];

function appendOut(html, isCmd = false) {
  const div = document.createElement('div');
  if (isCmd) {
    div.className = 'cmd-line';
    div.textContent = 'guest@dianpushu:~$ ' + html;
  } else {
    div.className = 'terminal-output';
    div.innerHTML = html;
  }
  terminalHistory.appendChild(div);
  terminalBody.scrollTop = terminalBody.scrollHeight;
  return div;
}

const NEOFETCH =
'<span class="t-cyan">  ██████╗ ██████╗ </span>   <span class="t-green">guest</span>@<span class="t-cyan">dianpushu</span>\n' +
'<span class="t-cyan">  ██╔══██╗██╔══██╗</span>   ─────────────────────────────\n' +
'<span class="t-cyan">  ██║  ██║██████╔╝</span>   <span class="t-violet">OS</span>        Procrastination OS 26.07 LTS\n' +
'<span class="t-cyan">  ██║  ██║██╔═══╝ </span>   <span class="t-violet">Host</span>      GitHub Pages（免費仔方案）\n' +
'<span class="t-cyan">  ██████╔╝██║     </span>   <span class="t-violet">Kernel</span>    vibes-6.6.6-lts\n' +
'<span class="t-cyan">  ╚═════╝ ╚═╝     </span>   <span class="t-violet">Uptime</span>    自 2026 年起持續醞釀\n' +
'                      <span class="t-violet">Shell</span>     dianpushu-cli v2.0\n' +
'                      <span class="t-violet">Products</span>  0（但夢想很多）\n' +
'                      <span class="t-violet">Memory</span>    99% 已用於儲存點子\n' +
'                      <span class="t-violet">Battery</span>   咖啡因 ▓▓▓▓▓▓▓▓░░ 82%';

const FORTUNES = [
  '「今天的你，比昨天更接近開始寫程式的那一天。」',
  '「點子不會過期，只會增值。」 — Dianpushu 財務長（缺）',
  '「先開 repo，剩下的交給未來的自己。」',
  '「Deadline 是最好的靈感來源，可惜我們沒有 deadline。」',
  '「你今天 git init 了嗎？」'
];

let hacking = false;
function runHack() {
  if (hacking) return;
  hacking = true;
  const steps = [
    ['[  0%] 正在入侵主機防火牆…', 300],
    ['[23%] 繞過管理員權限…', 700],
    ['[47%] 下載機密產品藍圖…', 700],
    ['[71%] 解密 /vault/master-plan.zip…', 800],
    ['[95%] 解壓縮中…', 900],
    ['<span class="t-red">[ERROR] 解壓縮完成：資料夾是空的。</span>', 600],
    ['<span class="t-amber">主謀留言：「藍圖還在我們腦中，實體化功能將於 Soon™ 推出。」</span>', 500],
    ['<span class="t-green">hack 結束。你已被反向追蹤（開玩笑的，我們不會寫追蹤程式）。</span>', 400]
  ];
  let delay = 0;
  steps.forEach(([msg, wait]) => {
    delay += wait;
    setTimeout(() => {
      appendOut(msg);
      if (msg.includes('hack 結束')) hacking = false;
    }, delay);
  });
}

function runCommand(cmdStr) {
  const raw = String(cmdStr).trim();
  const cmd = raw.toLowerCase();
  if (raw) { cmdHistory.push(raw); histIdx = cmdHistory.length; }
  appendOut(raw, true);

  if (cmd === 'help') {
    appendOut('可用指令清單 <span class="t-dim">(dianpushu-cli v2.0)</span>:\n' +
'  <span class="t-cyan">whoami</span>      我們是誰\n' +
'  <span class="t-cyan">neofetch</span>    組織系統規格總覽\n' +
'  <span class="t-cyan">status</span>      各項任務真實進度\n' +
'  <span class="t-cyan">roadmap</span>     組織 Roadmap 循環\n' +
'  <span class="t-cyan">ls ./products</span>  檢查公開產品\n' +
'  <span class="t-cyan">git log</span>     最近的開發紀錄\n' +
'  <span class="t-cyan">fortune</span>     今日組織運勢\n' +
'  <span class="t-cyan">coffee</span>      續命\n' +
'  <span class="t-cyan">clear</span>       清空畫面\n' +
'  <span class="t-dim">…以及數個未列出的隱藏指令。</span>');
  } else if (cmd === 'whoami') {
    appendOut('一群朋友。具體要幹嘛還在想。\n表面上看是在認真醞釀大招，實際上也是在認真醞釀大招。');
  } else if (cmd === 'neofetch') {
    appendOut(NEOFETCH);
  } else if (cmd === 'ls' || cmd === 'ls ./products' || cmd === 'ls -l ./products' || cmd === 'ls products') {
    appendOut('ls: cannot access \'./products\': No such file or directory\n<span class="t-violet">提示：產品仍在醞釀階段，敬請期待未來發布！</span>');
  } else if (cmd === 'ls ./secrets' || cmd === 'cd private' || cmd === 'ls -a' || cmd === 'ls -la') {
    appendOut('<span class="t-pink">[Access Denied] 內部機密與 Private Repo 僅限組織正式成員存取！</span>\n<span class="t-dim">（好啦其實裡面也是空的）</span>');
  } else if (cmd.startsWith('git log') || cmd === 'git log') {
    appendOut('<span class="t-cyan">f3a92c1</span> (HEAD -> main) feat: 首頁大改造，質感全面升級\n<span class="t-cyan">ea85b1b</span> feat: 打造組織公開互動首頁\n<span class="t-cyan">a1b2c3d</span> init: 先開個組織，氣勢絕不能輸');
  } else if (cmd === 'status') {
    appendOut('Dianpushu 開發進度報告：\n──────────────────────────────────────────\n取組織名字   <span class="t-cyan">▓▓▓▓▓▓▓▓▓▓</span> 100%  ← 吵了三天的傑作\n設計 Logo    <span class="t-violet">▓▓▓░░░░░░░</span>  30%  ← 有人畫了一個圓\n寫程式碼     <span class="t-pink">░░░░░░░░░░</span>   0%  ← 快了快了馬上開始\n統治世界     <span class="t-dim">░░░░░░░░░░</span>   0%  ← 已排入 backlog');
  } else if (cmd === 'roadmap') {
    appendOut('Roadmap 循環：\n 1. 💡 有個超讚的點子\n 2. 📦 開一個新 Repo (git init)\n 3. 🎨 幫 Repo 取名字（討論三天三夜）\n 4. 😴 擱置三個月 → <span class="t-amber">GOTO 1（無限迴圈）</span>');
  } else if (cmd.startsWith('sudo')) {
    appendOut('<span class="t-red">guest 不在 sudoers 檔案中。此事件將被記錄並回報。</span>\n<span class="t-dim">（嚇你的。我們連 log 系統都還沒寫。）</span>');
  } else if (cmd === 'matrix') {
    appendOut('<span class="t-green">Wake up, Neo… 正在載入母體…</span>');
    startMatrix(6000);
  } else if (cmd === 'hack' || cmd === 'hack --force') {
    appendOut('<span class="t-green">啟動入侵程序 (純屬娛樂模式)…</span>');
    runHack();
  } else if (cmd === 'coffee' || cmd === 'make coffee') {
    appendOut('    ( (\n     ) )\n  <span class="t-amber">........</span>\n  <span class="t-amber">|      |]</span>\n  <span class="t-amber">\\      /</span>\n   <span class="t-amber">`----\'</span>\n☕ 咖啡已上桌。生產力 +0%，心情 +100%。');
  } else if (cmd === 'fortune') {
    appendOut('<span class="t-amber">' + FORTUNES[Math.floor(Math.random() * FORTUNES.length)] + '</span>');
  } else if (cmd === 'date') {
    appendOut(new Date().toLocaleString('zh-TW', { hour12: false }) + '\n<span class="t-dim">（依然不是發布產品的日子）</span>');
  } else if (cmd.startsWith('echo ')) {
    const div = appendOut('');
    div.textContent = raw.slice(5);
  } else if (cmd === 'ping') {
    appendOut('PING dianpushu.motivation (127.0.0.1): 56 data bytes\n<span class="t-red">Request timeout</span> — 動力伺服器暫時無回應，請稍後再試。');
  } else if (cmd.startsWith('rm ')) {
    appendOut('<span class="t-red">rm: 操作已拒絕。</span> 這裡本來就什麼都沒有，沒東西給你刪。');
  } else if (cmd === 'exit' || cmd === 'logout') {
    appendOut('離開？不存在的。你已經是組織的<span class="t-pink">榮譽路人</span>了。');
  } else if (cmd === 'clear' || cmd === 'cls') {
    terminalHistory.innerHTML = '';
  } else if (cmd === '') {
    // no-op
  } else {
    appendOut('找不到指令: \'' + raw.replace(/</g, '&lt;') + '\'。輸入 <span class="t-cyan">help</span> 查看可用指令。');
  }
  terminalInput.value = '';
}
window.runCommand = runCommand;

terminalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    runCommand(terminalInput.value);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (histIdx > 0) terminalInput.value = cmdHistory[--histIdx] || '';
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (histIdx < cmdHistory.length - 1) {
      terminalInput.value = cmdHistory[++histIdx];
    } else { histIdx = cmdHistory.length; terminalInput.value = ''; }
  } else if (e.key === 'Tab') {
    e.preventDefault();
    const cur = terminalInput.value.trim().toLowerCase();
    if (!cur) return;
    const match = COMMANDS.find(c => c.startsWith(cur));
    if (match) terminalInput.value = match;
  }
});
terminalBody.addEventListener('click', (e) => {
  if (window.getSelection().toString()) return;
  terminalInput.focus({ preventScroll: true });
});

/* =========================================================
   VISITOR COUNTER (persists locally)
========================================================= */
const countEl = document.getElementById('visitor-count');
const badgeEl = document.getElementById('visitor-badge');
let countVal = parseInt(localStorage.getItem('dp-visits') || '1337', 10) + 1;
localStorage.setItem('dp-visits', countVal);
countEl.textContent = countVal.toLocaleString();
badgeEl.addEventListener('click', () => {
  countVal++;
  localStorage.setItem('dp-visits', countVal);
  countEl.textContent = countVal.toLocaleString();
  badgeEl.style.transform = 'scale(1.15)';
  setTimeout(() => { badgeEl.style.transform = ''; }, 180);
});

/* =========================================================
   ROTATING QUOTES (with fade)
========================================================= */
const quotes = [
  '"First, solve the problem. Then, write the code." — John Johnson',
  '"Simplicity is the soul of efficiency." — Austin Freeman',
  '"Make it work, make it right, make it fast." — Kent Beck',
  '"Code is like humor. When you have to explain it, it’s bad." — Cory House',
  '"Talk is cheap. Show me the code." — Linus Torvalds（我們選擇性忽略這句）'
];
const quoteEl = document.getElementById('dev-quote');
setInterval(() => {
  quoteEl.classList.add('fading');
  setTimeout(() => {
    quoteEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    quoteEl.classList.remove('fading');
  }, 500);
}, 9000);

/* =========================================================
   KONAMI CODE EASTER EGG
========================================================= */
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let kIdx = 0;
addEventListener('keydown', (e) => {
  if (e.target === terminalInput) return;
  kIdx = (e.key === KONAMI[kIdx]) ? kIdx + 1 : (e.key === KONAMI[0] ? 1 : 0);
  if (kIdx === KONAMI.length) {
    kIdx = 0;
    startMatrix(8000);
    toast('🎉 成就解鎖：連 Konami Code 都試了，看來你跟我們一樣閒。歡迎加入組織（精神上）。', 5000);
  }
});
