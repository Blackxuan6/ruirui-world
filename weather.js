(() => {
  'use strict';

  const scene = document.querySelector('.scene');
  const controls = document.getElementById('weather-controls');
  const garden = document.querySelector('.garden-half');
  if (!scene || !controls || !garden) return;

  const weather = Object.freeze({
    sunny: { label: '晴日', note: '让阳光晒晒小院，也晒晒心情。', background: '#edf0da', icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>' },
    rainy: { label: '细雨', note: '窗上落了雨，小猫躲进了小伞下。', background: '#dce5d8', icon: '<path d="M5 15a4 4 0 0 1-1-8 6 6 0 0 1 11-2 5 5 0 0 1 4 10Z"/><path d="m7 18-1 3m6-3-1 3m6-3-1 3"/>' },
    night: { label: '萤火夜', note: '找找三只萤火虫，轻点它们，拼一枚猫爪星座。', background: '#71868b', icon: '<path d="M20 14A9 9 0 0 1 10 3a9 9 0 1 0 10 11Z"/><path d="m18 3 .6 2.4L21 6l-2.4.6L18 9l-.6-2.4L15 6l2.4-.6Z"/>' }
  });
  const key = 'ruirui-weather-v1';
  let selected = 'sunny';
  let found = new Set();
  let constellationTimer = 0;
  let constellationDeadline = 0;
  let constellationRemaining = 0;
  const points = [{ x: 225, y: 175 }, { x: 120, y: 465 }, { x: 585, y: 340 }];
  try { const stored = localStorage.getItem(key); if (Object.hasOwn(weather, stored)) selected = stored; } catch { /* The scene works without browser storage. */ }

  const svg = (content) => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${content}</svg>`;
  controls.innerHTML = `<div class="weather-toolbar"><div class="weather-heading">${svg(weather.sunny.icon)}<strong>小院天气导演</strong><span>今天的天空，由你决定</span></div><div class="weather-options" role="group" aria-label="选择小院天气">${Object.entries(weather).map(([id, value]) => `<button type="button" class="weather-option" data-weather-choice="${id}" aria-pressed="false">${svg(value.icon)}<span>${value.label}</span></button>`).join('')}</div></div><p class="weather-description"><span id="weather-status" role="status" aria-live="polite" aria-atomic="true"></span><button type="button" class="weather-replay" hidden>再找一次萤火虫</button></p>`;
  const status = controls.querySelector('#weather-status');
  const replay = controls.querySelector('.weather-replay');
  const fireflies = points.map((point, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'weather-firefly';
    button.setAttribute('aria-label', `点亮第 ${index + 1} 只萤火虫`);
    button.style.left = `${point.x / 720 * 100}%`;
    button.style.top = `${point.y / 650 * 100}%`;
    button.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><ellipse cx="12" cy="12" rx="5" ry="7" transform="rotate(-35 12 12)" fill="#e4eed0" fill-opacity=".8"/><ellipse cx="20" cy="12" rx="5" ry="7" transform="rotate(35 20 12)" fill="#e4eed0" fill-opacity=".8"/><circle cx="16" cy="20" r="10" fill="#ffed9c" fill-opacity=".14"/><ellipse cx="16" cy="18" rx="4" ry="6" fill="#fbe9a0" stroke="#f8f1be" stroke-width=".8"/><circle cx="16" cy="11" r="2.5" fill="#7b8865"/></svg>';
    button.addEventListener('click', () => collectFirefly(index));
    garden.append(button);
    return button;
  });

  function active() { return document.body.dataset.phase === 'world' && !document.hidden && !document.body.classList.contains('motion-paused'); }
  function updateFireflies() {
    fireflies.forEach((button, index) => {
      button.hidden = selected !== 'night' || found.has(index) || scene.classList.contains('has-paw-constellation');
      button.disabled = !active();
    });
  }
  function clearConstellationTimer() {
    window.clearTimeout(constellationTimer);
    constellationTimer = 0;
    constellationDeadline = 0;
  }
  function hideConstellation() {
    clearConstellationTimer();
    constellationRemaining = 0;
    scene.classList.remove('has-paw-constellation');
    status.textContent = '猫爪星星留在心里了。还想玩的话，可以再找一次。';
    updateFireflies();
  }
  function syncConstellationTimer() {
    if (!scene.classList.contains('has-paw-constellation')) return;
    if (!active()) {
      if (constellationTimer) constellationRemaining = Math.max(0, constellationDeadline - performance.now());
      clearConstellationTimer();
    } else if (!constellationTimer) {
      constellationDeadline = performance.now() + constellationRemaining;
      constellationTimer = window.setTimeout(hideConstellation, constellationRemaining);
    }
  }
  function resetFireflies() {
    clearConstellationTimer();
    constellationRemaining = 0;
    found = new Set();
    scene.classList.remove('has-paw-constellation');
    replay.hidden = true;
    status.textContent = weather[selected].note;
    updateFireflies();
  }
  function collectFirefly(index) {
    if (selected !== 'night' || found.has(index) || !active()) return;
    found.add(index);
    if (found.size === points.length) {
      scene.classList.add('has-paw-constellation');
      replay.hidden = false;
      status.textContent = '三点萤光，变成一枚猫爪星座。小猫把今晚的星星送给你。';
      constellationRemaining = 10000;
      syncConstellationTimer();
      replay.focus({ preventScroll: true });
    } else {
      status.textContent = `已找到 ${found.size} / 3 只萤火虫。再找找小院的角落。`;
      fireflies.find((_, i) => !found.has(i))?.focus({ preventScroll: true });
    }
    updateFireflies();
  }
  function setWeather(id, persist = true) {
    if (!Object.hasOwn(weather, id)) return false;
    const changed = selected !== id;
    selected = id;
    scene.dataset.weather = id;
    document.body.dataset.weather = id;
    controls.querySelectorAll('[data-weather-choice]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.weatherChoice === id)));
    const note = document.querySelector('.weather-note');
    if (note) note.innerHTML = `${svg(weather[id].icon)}<span>${weather[id].label} · 小院好时光</span>`;
    if (changed || !status.textContent) resetFireflies();
    else updateFireflies();
    if (persist) { try { localStorage.setItem(key, id); } catch { /* Keep the current choice for this visit. */ } }
    document.dispatchEvent(new CustomEvent('ruirui:weatherchange', { detail: { id, label: weather[id].label } }));
    return true;
  }

  // Preserve the live illustration, including visitor flowers, when placed in a postcard.
  // Inline SVG paint and the current animation frame, so the downloaded file is self-contained.
  function freezeSVG(selector, withFireflies) {
    const source = document.querySelector(selector);
    if (!source) return '';
    const clone = source.cloneNode(true);
    const originals = [source, ...source.querySelectorAll('*')];
    const copies = [clone, ...clone.querySelectorAll('*')];
    const inherited = ['fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset', 'visibility', 'color'];
    const defaults = { opacity: '1', display: 'inline', filter: 'none', 'clip-path': 'none', mask: 'none', 'stop-color': 'rgb(0, 0, 0)', 'stop-opacity': '1', 'mix-blend-mode': 'normal' };
    const localURL = (value) => value.replace(/url\(["']?[^)#]*#([^)'"\s]+)["']?\)/g, 'url(#$1)');
    originals.forEach((node, index) => {
      const computed = getComputedStyle(node);
      const parent = node.parentElement ? getComputedStyle(node.parentElement) : null;
      const copy = copies[index];
      // Keep SVG presentation attributes; only freeze the computed overrides and
      // inherited values that would otherwise be lost outside the document.
      inherited.forEach((property) => {
        const value = computed.getPropertyValue(property);
        if (index === 0 || node.hasAttribute(property) || node.style.getPropertyValue(property) || value !== parent?.getPropertyValue(property)) {
          copy.style.setProperty(property, localURL(value));
        }
      });
      Object.entries(defaults).forEach(([property, fallback]) => {
        const value = computed.getPropertyValue(property);
        if (value !== fallback || node.hasAttribute(property) || node.style.getPropertyValue(property)) copy.style.setProperty(property, localURL(value));
      });
      if (computed.transform !== 'none') {
        copy.style.transform = computed.transform;
        copy.style.transformOrigin = computed.transformOrigin;
        copy.style.transformBox = computed.transformBox;
      }
      copy.style.removeProperty('animation');
      copy.style.removeProperty('animation-delay');
      copy.style.removeProperty('transition');
      copy.removeAttribute('class');
    });
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', '720');
    clone.setAttribute('height', '650');
    clone.style.width = '720px';
    clone.style.height = '650px';
    clone.style.transform = 'none';
    clone.style.overflow = 'hidden';
    clone.removeAttribute('aria-hidden');
    if (withFireflies && selected === 'night') {
      points.forEach((point, index) => {
        if (found.has(index)) return;
        const glow = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        glow.innerHTML = `<circle cx="${point.x}" cy="${point.y}" r="13" fill="#fff0a0" opacity=".14"/><circle cx="${point.x}" cy="${point.y}" r="6" fill="#fff0a0" opacity=".32"/><circle cx="${point.x}" cy="${point.y}" r="2.8" fill="#fff1b5"/>`;
        clone.append(glow);
      });
    }
    return new XMLSerializer().serializeToString(clone);
  }

  controls.addEventListener('click', (event) => {
    const button = event.target.closest('[data-weather-choice]');
    if (button) setWeather(button.dataset.weatherChoice);
  });
  replay.addEventListener('click', () => {
    resetFireflies();
    fireflies[0].focus({ preventScroll: true });
  });
  const stateObserver = new MutationObserver(() => { updateFireflies(); syncConstellationTimer(); });
  stateObserver.observe(document.body, { attributes: true, attributeFilter: ['data-phase', 'class', 'data-motion'] });
  document.addEventListener('visibilitychange', () => { updateFireflies(); syncConstellationTimer(); });
  window.ruiruiWeather = {
    getState: () => ({ id: selected, label: weather[selected].label }),
    setWeather,
    getExportLayers: () => ({ background: weather[selected].background, room: freezeSVG('#room-art > svg', false), garden: freezeSVG('#garden-art > svg', true) })
  };
  setWeather(selected, false);
})();
