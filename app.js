(() => {
'use strict';
const siteConfig = window.ruiruiSiteConfig;
const roomArt = window.ruiruiRoomArt;
const gardenArt = window.ruiruiGardenArt;

const $ = (selector) => document.querySelector(selector);
const finePointer = window.matchMedia('(pointer: fine)');
const motionPreferenceKey = 'ruirui-motion';
const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const icon = (name, extra = '') => `<svg class="icon ${extra}" aria-hidden="true"><use href="#i-${escape(name)}"/></svg>`;
const projectArt = () => `<div class="project-art" aria-hidden="true">${icon('cat')}</div>`;
const dialog = $('#content-dialog');
const dialogContent = $('#dialog-content');
const settingsToggle = $('#settings-toggle');
const settingsPanel = $('#site-settings');
const motionToggle = $('#motion-toggle');
const motionLabel = $('#motion-label');
const lockButton = $('#lock-button');
const unlockForm = $('#unlock-form');
const passwordInput = $('#cat-password');
const passwordLetters = $('#password-letters');
const passwordDisplay = $('.password-display');
const loginButton = $('.login-button');
const scrollEnter = $('#scroll-enter');
const catTouchTarget = $('#cat-touch-target');
const catSpeech = $('#cat-speech');
const catSpeechText = $('#cat-speech-text');
const catAnnouncement = $('#cat-announcement');
const sleepCatTouchTarget = $('#sleep-cat-touch-target');
const sleepCatSpeech = $('#sleep-cat-speech');
const sleepCatAnnouncement = $('#sleep-cat-announcement');
let sleepCatTimer = 0;
const catLines = [...new Set((siteConfig.catLines ?? []).filter((line) => typeof line === 'string' && line.trim()))];
let catSpeechTimer = 0;
let catAnimations = [];
let lastCatLine = -1;
const passwordCharacters = Array.from('喵喵喵喵喵');
const typingDelays = [180, 220, 190, 215, 195];
let typingTimer = 0;
let phase = 'loading';
let panelTrigger = null;
let previousOverflow = '';
let closeTimer;
let touchStartY = null;
let wheelDistance = 0;
let lastWheelAt = null;
let wheelGestureCanUnlock = false;
let touchGestureCanUnlock = false;
let transitionTimer = 0;
let motionPreference = null;
let pointerFrame = 0;
let pointerPosition = null;
let panelAnimation = null;
const scene = $('.scene');
const panelHashes = { about: '#about', projects: '#projects', detail: '#project/cat-file-assistant' };
const navigationPage = window.location.href.split('#')[0];
let currentPanel = null;
let historyNavigationPending = false;
const closingForeignDialogs = new Set();
let deferredRouteOptions = null;

// The site starts with motion on; a visitor's explicit choice takes precedence.
// Local-file privacy settings may disallow persistence without affecting use.
try {
  const savedPreference = window.localStorage.getItem(motionPreferenceKey);
  if (savedPreference === 'on' || savedPreference === 'off') motionPreference = savedPreference;
} catch { /* The toggle still works for this visit. */ }

function motionEnabled() {
  return motionPreference !== 'off';
}

function sceneState() {
  return { phase, motion: motionEnabled(), paused: phase !== 'world' || document.hidden || hasOpenDialog() };
}

function hasOpenDialog() {
  return Boolean(document.querySelector('dialog[open]'));
}

function announceSceneState() {
  document.dispatchEvent(new CustomEvent('ruirui:scene-state', { detail: sceneState() }));
}

function setPhase(nextPhase) {
  phase = nextPhase;
  document.body.dataset.phase = phase;
  announceSceneState();
}

window.ruiruiApp = {
  isWorld: () => phase === 'world',
  closeSettings: () => closeSettings(false),
  hideCatSpeech,
  getSceneState: sceneState,
};

function stopCatAnimations() {
  catAnimations.forEach((animation) => animation.cancel());
  catAnimations = [];
}

function hideCatSpeech() {
  hideSleepCatSpeech();
  window.clearTimeout(catSpeechTimer);
  catSpeechTimer = 0;
  catSpeech.classList.remove('is-visible');
  catTouchTarget.setAttribute('aria-expanded', 'false');
  catAnnouncement.textContent = '';
  stopCatAnimations();
}

function speakToCat() {
  if (phase !== 'world' || hasOpenDialog() || !catLines.length) return;
  hideSleepCatSpeech();
  closeSettings(false);
  window.clearTimeout(catSpeechTimer);
  const wasVisible = catSpeech.classList.contains('is-visible');
  const previousHeight = catSpeech.offsetHeight;
  stopCatAnimations();
  const choices = catLines.map((_, index) => index).filter((index) => catLines.length === 1 || index !== lastCatLine);
  lastCatLine = choices[Math.floor(Math.random() * choices.length)];
  const line = catLines[lastCatLine];
  catSpeechText.textContent = line;
  catAnnouncement.textContent = `黑猫说：${line}`;
  const nextHeight = catSpeech.offsetHeight;
  catSpeech.classList.add('is-visible');
  catTouchTarget.setAttribute('aria-expanded', 'true');
  if (motionEnabled() && !document.hidden) {
    catAnimations.push(catSpeechText.animate([{ opacity: 0, transform: 'translateY(3px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 180, easing: 'ease-out' }));
    if (wasVisible && previousHeight !== nextHeight) {
      catAnimations.push(catSpeech.animate([{ height: `${previousHeight}px` }, { height: `${nextHeight}px` }], { duration: 220, easing: 'ease-out' }));
    }
    const head = $('#room-art .cat-head');
    if (head) catAnimations.push(head.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-2deg)', offset: .4 }, { transform: 'rotate(.5deg)', offset: .75 }, { transform: 'rotate(0deg)' }], { duration: 480, easing: 'ease-in-out' }));
  }
  catSpeechTimer = window.setTimeout(hideCatSpeech, Math.max(4000, Math.min(8000, 2200 + line.length * 180)));
}

catTouchTarget.disabled = !catLines.length;
catTouchTarget.addEventListener('click', (event) => { if (event.button === 0) speakToCat(); });

function hideSleepCatSpeech() {
  window.clearTimeout(sleepCatTimer);
  sleepCatTimer = 0;
  sleepCatSpeech.classList.remove('is-visible');
  sleepCatTouchTarget.setAttribute('aria-expanded', 'false');
  sleepCatAnnouncement.textContent = '';
}

sleepCatTouchTarget.addEventListener('click', (event) => {
  if (event.button !== 0 || phase !== 'world' || document.hidden || hasOpenDialog()) return;
  closeSettings(false);
  hideCatSpeech();
  sleepCatSpeech.classList.add('is-visible');
  sleepCatTouchTarget.setAttribute('aria-expanded', 'true');
  sleepCatAnnouncement.textContent = '白猫正在睡觉：zzzzz';
  sleepCatTimer = window.setTimeout(hideSleepCatSpeech, 4200);
});
document.addEventListener('ruirui:scene-state', (event) => {
  if (event.detail.paused) hideSleepCatSpeech();
});

function resetParallax() {
  if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
  pointerFrame = 0;
  pointerPosition = null;
  if (scene) {
    scene.style.setProperty('--look-x', '0px');
    scene.style.setProperty('--look-y', '0px');
  }
}

function syncMotion() {
  const enabled = motionEnabled();
  const paused = document.hidden || hasOpenDialog();
  document.body.dataset.motion = enabled ? 'on' : 'off';
  document.body.classList.toggle('motion-paused', paused);
  if (motionToggle) {
    motionToggle.setAttribute('aria-pressed', String(enabled));
    motionToggle.setAttribute('aria-label', enabled ? '关闭动态效果，切换为静态模式' : '开启动效，感受小院的呼吸');
    motionToggle.title = enabled ? '关闭动态效果' : '开启动效';
  }
  if (motionLabel) motionLabel.textContent = enabled ? '动态开启' : '静态模式';
  if (!enabled || paused || !finePointer.matches) resetParallax();
  if ((!enabled || paused) && panelAnimation) {
    panelAnimation.cancel();
    panelAnimation = null;
  }
  if (!enabled || paused) stopCatAnimations();
  if (document.hidden) hideCatSpeech();
  announceSceneState();
}

motionToggle?.addEventListener('click', () => {
  motionPreference = motionEnabled() ? 'off' : 'on';
  try { window.localStorage.setItem(motionPreferenceKey, motionPreference); } catch { /* Session-only preference. */ }
  syncMotion();
});
finePointer.addEventListener('change', syncMotion);
document.addEventListener('visibilitychange', syncMotion);
// Observe only the dialog's open attribute: syncMotion changes body classes,
// which must not trigger another observer pass.
new MutationObserver(syncMotion).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
syncMotion();

function closeSettings(restoreFocus = true) {
  if (!settingsPanel || settingsPanel.hidden) return;
  settingsPanel.hidden = true;
  settingsToggle?.setAttribute('aria-expanded', 'false');
  settingsToggle?.setAttribute('aria-label', '打开小院设置');
  if (restoreFocus) settingsToggle?.focus({ preventScroll: true });
}

settingsToggle?.addEventListener('click', () => {
  if (!settingsPanel || hasOpenDialog() || (phase !== 'lock' && phase !== 'world')) return;
  if (!settingsPanel.hidden) { closeSettings(); return; }
  settingsPanel.hidden = false;
  settingsToggle.setAttribute('aria-expanded', 'true');
  settingsToggle.setAttribute('aria-label', '关闭小院设置');
  motionToggle?.focus({ preventScroll: true });
});
$('#settings-close')?.addEventListener('click', () => closeSettings());
document.addEventListener('pointerdown', (event) => {
  if (settingsPanel && !settingsPanel.hidden && !settingsPanel.contains(event.target) && !settingsToggle?.contains(event.target)) {
    closeSettings(false);
  }
  if (event.button === 0 && !catTouchTarget.contains(event.target)) hideCatSpeech();
});

function canMoveAtmosphere() {
  return motionEnabled() && finePointer.matches && phase === 'world' && !document.hidden && !hasOpenDialog();
}

scene?.addEventListener('pointermove', (event) => {
  if (!canMoveAtmosphere() || event.pointerType === 'touch') return;
  pointerPosition = { x: event.clientX, y: event.clientY };
  if (pointerFrame) return;
  pointerFrame = window.requestAnimationFrame(() => {
    pointerFrame = 0;
    if (!canMoveAtmosphere() || !pointerPosition) { resetParallax(); return; }
    const bounds = scene.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = Math.max(-1, Math.min(1, ((pointerPosition.x - bounds.left) / bounds.width - .5) * 2));
    const y = Math.max(-1, Math.min(1, ((pointerPosition.y - bounds.top) / bounds.height - .5) * 2));
    scene.style.setProperty('--look-x', `${(x * 5).toFixed(2)}px`);
    scene.style.setProperty('--look-y', `${(y * 3).toFixed(2)}px`);
  });
}, { passive: true });
scene?.addEventListener('pointerleave', resetParallax);

document.title = siteConfig.name;
document.querySelectorAll('[data-site-name]').forEach((node) => { node.textContent = siteConfig.name; });
document.querySelectorAll('.wordmark').forEach((node) => { node.setAttribute('aria-label', `${siteConfig.name} 首页`); });
$('#room-art').innerHTML = roomArt;
$('#garden-art').innerHTML = gardenArt;
$('#year').textContent = new Date().getFullYear();

function updateClock() {
  const now = new Date();
  $('#clock').textContent = new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
  $('#clock').dateTime = now.toISOString();
  $('#calendar').textContent = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(now);
}
updateClock();
setInterval(updateClock, 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) updateClock(); });

async function revealDoorway() {
  if (document.readyState !== 'complete') await new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));
  await document.fonts.ready;
  await new Promise(requestAnimationFrame);
  if (panelFromHash()) {
    showWorldImmediately();
  } else {
    setPhase('lock');
    $('#lock-screen').inert = false;
    $('#lock-screen').classList.add('is-ready');
  }
  $('#loader').classList.add('is-gone');
  $('#loader').setAttribute('aria-hidden', 'true');
  syncRoute();
}

function resetPassword() {
  window.clearTimeout(typingTimer);
  typingTimer = 0;
  passwordInput.value = '';
  passwordLetters.replaceChildren();
  passwordDisplay.style.setProperty('--typed-length', '0');
  passwordDisplay.style.setProperty('--password-length', String(passwordCharacters.length));
  unlockForm.classList.remove('is-typing', 'is-filled');
  unlockForm.removeAttribute('aria-busy');
  loginButton.disabled = false;
  scrollEnter.disabled = false;
}

function appendPasswordCharacter(character) {
  const letter = document.createElement('span');
  letter.className = 'password-letter';
  letter.textContent = character;
  passwordLetters.append(letter);
  passwordInput.value += character;
  passwordDisplay.style.setProperty('--typed-length', String(passwordLetters.childElementCount));
}

function startUnlock() {
  if (phase !== 'lock') return;
  closeSettings(false);
  setPhase('typing');
  unlockForm.classList.add('is-typing');
  unlockForm.setAttribute('aria-busy', 'true');
  loginButton.disabled = true;
  scrollEnter.disabled = true;
  wheelDistance = 0;
  touchStartY = null;

  if (!motionEnabled()) {
    passwordCharacters.forEach(appendPasswordCharacter);
    enterWorld();
    return;
  }

  let characterIndex = 0;
  const typeNextCharacter = () => {
    if (phase !== 'typing') return;
    appendPasswordCharacter(passwordCharacters[characterIndex++]);
    if (characterIndex < passwordCharacters.length) {
      typingTimer = window.setTimeout(typeNextCharacter, typingDelays[characterIndex]);
    } else {
      unlockForm.classList.add('is-filled');
      typingTimer = window.setTimeout(enterWorld, 180);
    }
  };
  typingTimer = window.setTimeout(typeNextCharacter, typingDelays[0]);
}

function enterWorld() {
  if (phase !== 'typing') return;
  window.clearTimeout(typingTimer);
  typingTimer = 0;
  unlockForm.removeAttribute('aria-busy');
  setPhase('entering');
  $('#lock-screen').inert = true;
  $('#lock-screen').classList.add('is-leaving');
  $('#world').classList.add('is-visible');
  transitionTimer = window.setTimeout(() => {
    transitionTimer = 0;
    setPhase('world');
    $('#world').inert = false;
    lockButton.disabled = false;
    lockButton.title = '返回锁屏页面';
    $('#lock-screen').hidden = true;
    $('#world-title').focus({ preventScroll: true });
    window.scrollTo(0, 0);
    syncRoute();
  }, motionEnabled() ? 720 : 0);
}

function returnToLock() {
  if (phase !== 'world' || hasOpenDialog()) return;
  hideCatSpeech();
  setPhase('locking');
  lockButton.disabled = true;
  lockButton.title = '当前已在锁屏页面';
  closeSettings(false);
  resetParallax();
  wheelDistance = 0;
  lastWheelAt = null;
  wheelGestureCanUnlock = false;
  touchGestureCanUnlock = false;
  touchStartY = null;
  const lockScreen = $('#lock-screen');
  const world = $('#world');
  world.inert = true;
  lockScreen.inert = true;
  resetPassword();
  lockScreen.hidden = false;
  lockScreen.scrollTop = 0;
  updateClock();
  // Establish the transparent start frame after removing display:none.
  void lockScreen.offsetWidth;
  lockScreen.classList.remove('is-leaving');
  world.classList.add('is-locking');
  const finishLock = () => {
    world.classList.remove('is-visible', 'is-locking');
    transitionTimer = 0;
    setPhase('lock');
    lockScreen.inert = false;
    window.scrollTo(0, 0);
    // Restore focus after the clicked button's hidden panel has finished closing.
    window.setTimeout(() => {
      if (phase === 'lock') $('.login-button').focus({ preventScroll: true });
    }, 0);
  };
  if (motionEnabled()) transitionTimer = window.setTimeout(finishLock, 720);
  else finishLock();
}

lockButton.addEventListener('click', returnToLock);
unlockForm.addEventListener('submit', (event) => { event.preventDefault(); startUnlock(); });
scrollEnter.addEventListener('click', startUnlock);
function lockScrollAllowsUnlock() {
  const screen = $('#lock-screen');
  return screen.scrollHeight - screen.clientHeight <= 2 || screen.scrollTop + screen.clientHeight >= screen.scrollHeight - 2;
}

window.addEventListener('wheel', (event) => {
  if (phase !== 'lock' || event.ctrlKey || event.target.closest?.('#site-settings, #settings-toggle')) return;
  const now = performance.now();
  // A burst that starts above the bottom is scrolling, including its momentum.
  // Only a new burst after a pause may become an unlock gesture.
  if (lastWheelAt === null || now - lastWheelAt > 350) {
    wheelDistance = 0;
    wheelGestureCanUnlock = lockScrollAllowsUnlock();
  }
  lastWheelAt = now;
  if (event.deltaY <= 0) { wheelDistance = 0; wheelGestureCanUnlock = false; return; }
  if (!lockScrollAllowsUnlock()) wheelGestureCanUnlock = false;
  if (!wheelGestureCanUnlock) return;
  event.preventDefault();
  wheelDistance += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
  if (wheelDistance >= 28) startUnlock();
}, { passive: false });
window.addEventListener('touchstart', (event) => {
  touchStartY = phase === 'lock' && event.touches.length === 1 && !event.target.closest?.('#site-settings, #settings-toggle') ? event.touches[0].clientY : null;
  touchGestureCanUnlock = touchStartY !== null && lockScrollAllowsUnlock();
}, { passive: true });
window.addEventListener('touchmove', (event) => {
  if (event.touches.length !== 1) { touchGestureCanUnlock = false; return; }
  if (!lockScrollAllowsUnlock() || (touchStartY !== null && event.touches[0].clientY >= touchStartY)) touchGestureCanUnlock = false;
  if (phase === 'lock' && touchStartY !== null && touchGestureCanUnlock && lockScrollAllowsUnlock() && touchStartY - event.touches[0].clientY > 48) {
    event.preventDefault();
    touchStartY = null;
    startUnlock();
  }
}, { passive: false });
function endTouchGesture() { touchStartY = null; touchGestureCanUnlock = false; }
window.addEventListener('touchend', endTouchGesture, { passive: true });
window.addEventListener('touchcancel', endTouchGesture, { passive: true });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && settingsPanel && !settingsPanel.hidden) {
    event.preventDefault();
    closeSettings();
    return;
  }
  if (event.key === 'Escape' && (catSpeech.classList.contains('is-visible') || sleepCatSpeech.classList.contains('is-visible'))) {
    event.preventDefault();
    hideCatSpeech();
    return;
  }
  if (event.target.closest?.('#site-settings, #settings-toggle')) return;
  if (phase === 'lock' && event.key === 'Enter' && !event.isComposing && !event.altKey && !event.ctrlKey && !event.metaKey) {
    event.preventDefault(); startUnlock();
  }
});

function renderAbout() {
  const contacts = siteConfig.contacts;
  return `<section aria-labelledby="dialog-title">
    <div class="about-intro"><div class="about-avatar" aria-hidden="true">${icon('cat')}</div><div><p class="panel-eyebrow">NICE TO MEET YOU</p><h2 class="panel-title" id="dialog-title">${escape(siteConfig.aboutName)}</h2><p class="panel-subtitle">造一点梦，留一点白。<br>也期待与你交换一点灵感。</p></div></div>
    <div class="contact-list">
      <a class="contact-row" href="${escape(contacts.bilibili)}" target="_blank" rel="noopener noreferrer"><span class="contact-icon">${icon('bili')}</span><span class="contact-text"><small>BiliBili</small><strong>${escape(contacts.bilibili)}</strong></span><span class="contact-action" aria-hidden="true">${icon('external')}</span></a>
      <div class="contact-row"><span class="contact-icon">${icon('chat')}</span><span class="contact-text"><small>QQ群</small><strong>${escape(contacts.qq)}</strong></span><button type="button" class="contact-copy" data-copy-contact="qq" aria-label="复制QQ群号" title="复制QQ群号">${icon('copy')}</button></div>
      <div class="contact-row"><span class="contact-icon">${icon('mail')}</span><span class="contact-text"><small>邮箱</small><strong><a class="contact-email" href="mailto:${escape(contacts.email)}" aria-label="给${escape(contacts.email)}发送邮件">${escape(contacts.email)}</a></strong></span><button type="button" class="contact-copy" data-copy-contact="email" aria-label="复制邮箱地址" title="复制邮箱地址">${icon('copy')}</button></div>
    </div><p id="contact-copy-status" class="contact-copy-status" role="status" aria-live="polite" aria-atomic="true"></p></section>`;
}

function copyContactFallback(value, button) {
  // The temporary field must remain inside the modal so focus/select work
  // when opening index.html directly or when Clipboard API is unavailable.
  const field = document.createElement('textarea');
  field.value = value;
  field.readOnly = true;
  field.tabIndex = -1;
  field.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;font-size:16px';
  dialogContent.append(field);
  try {
    field.focus({ preventScroll: true });
    field.select();
    field.setSelectionRange(0, value.length);
    return document.execCommand('copy');
  } catch { return false; }
  finally {
    field.remove();
    if (button.isConnected && dialog.open) button.focus({ preventScroll: true });
  }
}

async function copyContact(button) {
  const key = button.dataset.copyContact;
  const label = { qq: 'QQ群号', email: '邮箱地址' }[key];
  if (!label || button.dataset.copying || currentPanel !== 'about' || !dialog.open) return;
  const value = String(siteConfig.contacts[key]);
  const status = $('#contact-copy-status');
  button.dataset.copying = 'true';
  button.setAttribute('aria-busy', 'true');
  button.classList.remove('is-copied');
  button.innerHTML = icon('copy');
  status.textContent = '';
  let copied = false;
  try {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        copied = true;
      }
    } catch { /* Try the local-file compatible path below. */ }
    if (!button.isConnected || currentPanel !== 'about' || !dialog.open) return;
    if (!copied) copied = copyContactFallback(value, button);
    button.innerHTML = icon(copied ? 'check' : 'copy');
    button.classList.toggle('is-copied', copied);
    button.title = copied ? `${label}已复制，点击再次复制` : `重试复制${label}`;
    status.textContent = copied ? `${label}已复制，可以粘贴到需要的地方。` : '暂时无法自动复制，请选中号码或邮箱手动复制。';
  } finally {
    delete button.dataset.copying;
    button.removeAttribute('aria-busy');
  }
}

function renderProjects() {
  return `<section aria-labelledby="dialog-title"><div class="inventory-heading"><div><p class="panel-eyebrow">A POCKET OF LITTLE THINGS</p><h2 class="panel-title" id="dialog-title">我的项目</h2><p class="panel-subtitle">一些小小的创造，慢慢装进口袋。</p></div><span class="inventory-count">01 件小作品</span></div>
    <div class="inventory"><button class="project-card" id="open-project" type="button">${projectArt()}${icon('arrow')}<strong>${escape(siteConfig.project.name)}</strong><small>点击打开，看看里面</small></button><div class="inventory-space" aria-hidden="true">${icon('paw')}</div></div><p class="inventory-note">留一点空位，给下一次灵感。</p></section>`;
}

function validDownloadURL(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null; } catch { return null; }
}

function renderDownload(key, label) {
  const url = validDownloadURL(siteConfig.project.downloads[key]);
  const content = `<span>${icon('download')}${label}</span><small>${url ? '前往下载 ↗' : '链接待补充'}</small>`;
  return url ? `<a class="download-option" href="${escape(url)}" target="_blank" rel="noopener noreferrer" aria-label="通过${label}下载，打开新页面">${content}</a>` : `<button class="download-option" type="button" disabled aria-label="${label}，链接待补充">${content}</button>`;
}

function renderDetail() {
  const project = siteConfig.project;
  const allowedIcons = new Set(['tools', 'shield', 'cat', 'window']);
  return `<section aria-labelledby="dialog-title"><button class="back-button" id="back-projects" type="button">${icon('arrow')}返回我的项目</button><div class="detail-intro">${projectArt()}<div><p class="panel-eyebrow">A LITTLE TOOL, A LITTLE COMPANY</p><h2 class="panel-title" id="dialog-title">${escape(project.name)}</h2></div></div><p class="project-description">${escape(project.intro)}</p>
    <div class="features">${project.features.map((feature) => `<div class="feature"><h3 class="feature-title">${icon(allowedIcons.has(feature.icon) ? feature.icon : 'tools', feature.icon === 'cat' ? 'cat-icon' : '')}${escape(feature.title)}</h3><p>${escape(feature.text)}</p></div>`).join('')}</div>
    <div class="downloads"><h3 class="download-heading">把小猫带回家</h3><div class="download-options">${renderDownload('github', 'GitHub')}${renderDownload('baidu', '百度网盘')}${renderDownload('quark', '夸克网盘')}</div></div></section>`;
}

function panelFromHash(hash = window.location.hash) {
  return Object.keys(panelHashes).find((panel) => panelHashes[panel] === hash) ?? null;
}

function showWorldImmediately() {
  window.clearTimeout(transitionTimer);
  transitionTimer = 0;
  resetPassword();
  const lockScreen = $('#lock-screen');
  lockScreen.inert = true;
  lockScreen.hidden = true;
  lockScreen.classList.add('is-ready', 'is-leaving');
  const world = $('#world');
  world.classList.add('is-visible');
  world.classList.remove('is-locking');
  world.inert = false;
  lockButton.disabled = false;
  lockButton.title = '返回锁屏页面';
  closeSettings(false);
  setPhase('world');
}

function navigateToPanel(panel, trigger, focusTarget) {
  if (panel !== null && !Object.hasOwn(panelHashes, panel)) return;
  const hash = panel === null ? '' : panelHashes[panel];
  if (window.location.hash !== hash) {
    // Hash routes also work when index.html is opened directly with file://.
    const state = { ...window.history.state, ruiruiNavigation: { page: navigationPage, from: window.location.hash } };
    window.history.pushState(state, '', `${navigationPage}${hash}`);
  }
  syncRoute({ trigger, focusTarget });
}

function syncRoute({ trigger, focusTarget } = {}) {
  historyNavigationPending = false;
  if (phase === 'loading') return;
  const panel = panelFromHash();
  if (panel) {
    const otherDialogs = [...document.querySelectorAll('dialog[open]')].filter((other) => other !== dialog);
    if (otherDialogs.length || closingForeignDialogs.size) {
      deferredRouteOptions = { trigger, focusTarget };
      otherDialogs.forEach((other) => {
        if (closingForeignDialogs.has(other)) return;
        closingForeignDialogs.add(other);
        other.addEventListener('close', () => {
          // A dialog owner restores scroll/focus in its close handler. Wait for
          // every handler before opening the current route, which may change
          // again while the native close event is queued.
          queueMicrotask(() => {
            closingForeignDialogs.delete(other);
            if (closingForeignDialogs.size) return;
            const options = deferredRouteOptions ?? {};
            deferredRouteOptions = null;
            syncRoute(options);
          });
        }, { once: true });
        other.close();
      });
      return;
    }
    if (phase !== 'world') showWorldImmediately();
    showPanel(panel, trigger, focusTarget);
  } else {
    hidePanel();
  }
}

function returnToProjects() {
  if (historyNavigationPending) return;
  const entry = window.history.state?.ruiruiNavigation;
  if (entry?.page === navigationPage && entry.from === panelHashes.projects) {
    historyNavigationPending = true;
    window.history.back();
  } else {
    navigateToPanel('projects', null, '#open-project');
  }
}

window.addEventListener('popstate', () => syncRoute());
window.addEventListener('hashchange', () => syncRoute());

function setPanel(panel, focusTarget) {
  currentPanel = panel;
  $('#dialog-caption').textContent = panel === 'about' ? '小院会客厅 · 关于我' : panel === 'projects' ? '小院背包 · 我的项目' : '小院背包 · 项目详情';
  dialogContent.innerHTML = panel === 'about' ? renderAbout() : panel === 'projects' ? renderProjects() : renderDetail();
  dialog.scrollTop = 0;
  panelAnimation?.cancel();
  panelAnimation = null;
  if (dialog.open && motionEnabled() && !document.hidden) {
    panelAnimation = dialogContent.animate([{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 220, easing: 'ease-out' });
  }
  if (focusTarget) $(focusTarget)?.focus({ preventScroll: true });
}

function openPanel(panel, trigger) {
  if (phase !== 'world' || hasOpenDialog()) return;
  navigateToPanel(panel, trigger);
}

function showPanel(panel, trigger, focusTarget) {
  const isOpening = !dialog.open;
  const changedPanel = currentPanel !== panel;
  hideCatSpeech();
  closeSettings(false);
  if (trigger) panelTrigger = trigger;
  else if (isOpening) panelTrigger = $(`[data-open="${panel === 'detail' ? 'projects' : panel}"]`);
  window.clearTimeout(closeTimer);
  dialog.classList.remove('is-closing');
  if (isOpening || changedPanel) setPanel(panel);
  if (isOpening) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    syncMotion();
  }
  if (isOpening || changedPanel || focusTarget) {
    const target = focusTarget ?? (changedPanel && !isOpening ? (panel === 'detail' ? '#back-projects' : panel === 'projects' ? '#open-project' : '#close-dialog') : '#close-dialog');
    $(target)?.focus({ preventScroll: true });
  }
}

function closePanel() {
  if (!dialog.open || dialog.classList.contains('is-closing')) return;
  // Closing a direct link stays on this site. Back can reopen the last panel.
  navigateToPanel(null);
}

function hidePanel() {
  if (!dialog.open || dialog.classList.contains('is-closing')) return;
  dialog.classList.add('is-closing');
  closeTimer = window.setTimeout(() => dialog.close(), motionEnabled() ? 190 : 0);
}

document.querySelectorAll('[data-open]').forEach((button) => button.addEventListener('click', () => openPanel(button.dataset.open, button)));
$('#close-dialog').addEventListener('click', closePanel);
dialog.addEventListener('cancel', (event) => { event.preventDefault(); closePanel(); });
let backdropDown = false;
dialog.addEventListener('pointerdown', (event) => { backdropDown = event.target === dialog && isOutsideDialog(event); });
dialog.addEventListener('click', (event) => {
  if (backdropDown && event.target === dialog && isOutsideDialog(event)) closePanel();
  backdropDown = false;
});
function isOutsideDialog(event) {
  const rect = dialog.getBoundingClientRect();
  return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
}
dialog.addEventListener('close', () => {
  if (dialog.open) return;
  currentPanel = null;
  dialog.classList.remove('is-closing');
  document.body.style.overflow = previousOverflow;
  syncMotion();
  if (panelTrigger?.isConnected) panelTrigger.focus({ preventScroll: true });
});
dialogContent.addEventListener('click', (event) => {
  const copyButton = event.target.closest('[data-copy-contact]');
  if (copyButton) { void copyContact(copyButton); return; }
  if (event.target.closest('#open-project')) navigateToPanel('detail', null, '#back-projects');
  if (event.target.closest('#back-projects')) returnToProjects();
});
// Native <dialog> handles focus containment; preserve a predictable loop at both ends.
dialog.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const focusable = [...dialog.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]')].filter((node) => node.getClientRects().length);
  const first = focusable[0]; const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
});

resetPassword();
revealDoorway();
})();
