(() => {
  'use strict';

  const workshop = document.querySelector('#chime-workshop');
  if (!workshop) return;

  const storageKey = 'ruirui-chimes-v1';
  const maxNotes = 16;
  const beatLength = 440;
  const tones = [
    { name: '哆', solfege: 'do', frequency: 523.25, color: '#b4c598', light: '#edf1df' },
    { name: '来', solfege: 're', frequency: 587.33, color: '#dfbd91', light: '#f7ead6' },
    { name: '咪', solfege: 'mi', frequency: 659.25, color: '#a9c6bd', light: '#e4efea' },
    { name: '嗦', solfege: 'sol', frequency: 783.99, color: '#d9b2ab', light: '#f4e3df' },
    { name: '啦', solfege: 'la', frequency: 880, color: '#c4b9d3', light: '#ede7f3' },
  ];
  let notes = [];
  let storageAvailable = true;
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || 'null');
    if (saved?.version === 1 && Array.isArray(saved.notes) && saved.notes.length <= maxNotes && saved.notes.every((note) => Number.isInteger(note) && note >= 0 && note < tones.length)) {
      notes = saved.notes.slice();
    }
  } catch { storageAvailable = false; }

  let soundEnabled = false;
  let volume = 0.3;
  let audioContext = null;
  let masterGain = null;
  let audioAttempt = 0;
  let sequenceToken = 0;
  let sequenceTimer = 0;
  let playing = false;
  let looping = false;
  const voices = new Set();
  const animationTimers = new Map();

  function bellMarkup(tone, index) {
    const length = [78, 90, 82, 99, 88][index];
    return `<button class="chime-bell" type="button" data-chime-note="${index}" style="--chime-color:${tone.color};--chime-light:${tone.light}" aria-label="敲响${tone.name}，记录第 ${index + 1} 个音阶" aria-keyshortcuts="${index + 1}">
      <svg class="chime-bell-art" viewBox="0 0 84 190" aria-hidden="true" focusable="false">
        <path class="chime-string" d="M42 3 C40 13 44 25 42 34"/>
        <g class="chime-hanging">
          <path class="chime-shell" d="M21 57 C22 28 62 28 63 57 L68 ${length} Q42 ${length + 12} 16 ${length} Z"/>
          <path class="chime-trim" d="M18 ${length - 4} Q42 ${length + 4} 66 ${length - 4} M30 46 Q35 39 41 40"/>
          <circle class="chime-clapper" cx="42" cy="${length + 6}" r="5"/>
          <path class="chime-string" d="M42 ${length + 11} Q40 ${length + 24} 43 ${length + 32}"/>
          <path class="chime-paper" d="M31 ${length + 30} L54 ${length + 32} L51 ${length + 70} Q42 ${length + 65} 30 ${length + 69} Z"/>
          <path class="chime-leaf-drawing" d="M40 ${length + 58} Q51 ${length + 47} 40 ${length + 40} Q32 ${length + 50} 40 ${length + 58} M40 ${length + 46} L40 ${length + 61}"/>
        </g>
      </svg>
      <span class="chime-tone-name">${tone.name}<small>${tone.solfege}</small></span>
      <kbd>${index + 1}</kbd>
    </button>`;
  }

  workshop.classList.add('chime-workshop');
  workshop.setAttribute('aria-labelledby', 'chime-title');
  workshop.innerHTML = `<header class="chime-heading"><div><p class="chime-eyebrow">A MELODY FOR THE BREEZE</p><h3 id="chime-title" tabindex="-1">把风，谱成一首小曲</h3><p>轻轻敲一敲，让每个音符长成一片叶子。</p></div><span class="chime-heading-doodle" aria-hidden="true">♪</span></header>
    <div class="chime-instrument" aria-label="五音风铃"><div class="chime-branch" aria-hidden="true"><span></span></div><div class="chime-rack">${tones.map(bellMarkup).join('')}</div></div>
    <div class="chime-sound-bar"><button class="chime-sound-toggle chime-button" type="button" aria-pressed="false"><span aria-hidden="true">♫</span><span class="chime-sound-label">开启声音</span></button><label class="chime-volume">音量<input type="range" min="0" max="100" step="1" value="30" aria-label="风铃音量" disabled><output>30%</output></label></div>
    <p class="chime-hint">现在是静音作曲。想听听风铃，先点「开启声音」。</p>
    <div class="chime-score"><div class="chime-score-heading"><h3>我的叶子小曲</h3><span class="chime-count">0 / 16</span></div><ol class="chime-notes" aria-label="已记录的旋律"></ol><p class="chime-empty">第一片叶子，等你轻轻敲下。</p></div>
    <div class="chime-actions"><button class="chime-button chime-play" type="button">回放一次</button><button class="chime-button chime-loop" type="button" aria-pressed="false">循环小曲</button><button class="chime-button chime-stop" type="button">停止</button><button class="chime-button chime-undo" type="button">撤回一音</button><button class="chime-button chime-clear" type="button">清空</button></div>
    <p class="chime-status" role="status" aria-live="polite"></p><p class="chime-footnote">最多收集 16 个音符 · 选中风铃后，也可以按数字 1–5<br><span class="chime-storage-note">小曲只保存在当前浏览器，清理浏览器数据后会消失。</span></p>`;

  const find = (selector) => workshop.querySelector(selector);
  const bells = Array.from(workshop.querySelectorAll('.chime-bell'));
  const notesList = find('.chime-notes');
  const status = find('.chime-status');
  const soundButton = find('.chime-sound-toggle');
  const volumeInput = find('.chime-volume input');
  const playButton = find('.chime-play');
  const loopButton = find('.chime-loop');
  const stopButton = find('.chime-stop');
  const undoButton = find('.chime-undo');
  const clearButton = find('.chime-clear');

  function isAvailable() {
    return !document.hidden && document.body.dataset.phase === 'world' && !document.querySelector('dialog[open]');
  }

  function announce(message) {
    status.textContent = message;
  }

  function saveNotes() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ version: 1, notes }));
      storageAvailable = true;
    } catch { storageAvailable = false; }
    updateStorageNote();
    document.dispatchEvent(new CustomEvent('ruirui:melodychange', { detail: { notes: notes.slice() } }));
  }

  function updateStorageNote() {
    find('.chime-storage-note').textContent = storageAvailable ? '小曲只保存在当前浏览器，清理浏览器数据后会消失。' : '浏览器暂时无法保存，小曲会在本次访问中保留。';
  }

  function updateControls() {
    playButton.disabled = !notes.length;
    loopButton.disabled = !notes.length;
    stopButton.disabled = !playing && !voices.size;
    undoButton.disabled = !notes.length;
    clearButton.disabled = !notes.length;
    loopButton.setAttribute('aria-pressed', String(looping));
    loopButton.textContent = looping ? '正在循环' : '循环小曲';
    playButton.textContent = playing && !looping ? '正在回放' : '回放一次';
    soundButton.setAttribute('aria-pressed', String(soundEnabled));
    find('.chime-sound-label').textContent = soundEnabled ? '关闭声音' : '开启声音';
    volumeInput.disabled = !soundEnabled;
    find('.chime-hint').textContent = soundEnabled ? '声音已开启。按喜欢的顺序轻敲，试着把今天哼出来。' : '现在是静音作曲。想听听风铃，先点「开启声音」。';
  }

  function renderNotes() {
    notesList.replaceChildren(...notes.map((note, index) => {
      const leaf = document.createElement('li');
      leaf.className = 'chime-note-leaf';
      leaf.style.setProperty('--chime-color', tones[note].color);
      leaf.style.setProperty('--chime-light', tones[note].light);
      leaf.setAttribute('aria-label', `第 ${index + 1} 音：${tones[note].name}`);
      const label = document.createElement('span');
      label.textContent = tones[note].name;
      leaf.append(label);
      return leaf;
    }));
    find('.chime-count').textContent = `${notes.length} / ${maxNotes}`;
    find('.chime-empty').hidden = notes.length > 0;
    updateControls();
  }

  function highlightNote(index) {
    Array.from(notesList.children).forEach((leaf, leafIndex) => {
      leaf.classList.toggle('is-current', leafIndex === index);
      if (leafIndex === index) leaf.setAttribute('aria-current', 'true');
      else leaf.removeAttribute('aria-current');
    });
  }

  function flashBell(index) {
    const bell = bells[index];
    window.clearTimeout(animationTimers.get(bell));
    bell.classList.remove('is-ringing');
    void bell.offsetWidth;
    bell.classList.add('is-ringing');
    animationTimers.set(bell, window.setTimeout(() => {
      bell.classList.remove('is-ringing');
      animationTimers.delete(bell);
    }, 650));
  }

  function endVoice(voice) {
    if (!voices.has(voice)) return;
    voices.delete(voice);
    voice.oscillators.forEach((oscillator) => {
      oscillator.onended = null;
      try { oscillator.stop(); } catch { /* Already stopped. */ }
      oscillator.disconnect();
    });
    voice.gain.disconnect();
    updateControls();
  }

  function silence() {
    voices.forEach(endVoice);
  }

  function stopPlayback(message = '') {
    sequenceToken += 1;
    window.clearTimeout(sequenceTimer);
    sequenceTimer = 0;
    playing = false;
    looping = false;
    highlightNote(-1);
    silence();
    updateControls();
    if (message) announce(message);
  }

  async function prepareAudio() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error('audio-unavailable');
    if (!audioContext || audioContext.state === 'closed') {
      audioContext = new AudioContextClass();
      masterGain = audioContext.createGain();
      masterGain.gain.value = volume * 0.3;
      masterGain.connect(audioContext.destination);
    }
    if (audioContext.state !== 'running') await audioContext.resume();
    if (audioContext.state !== 'running') throw new Error('audio-blocked');
  }

  function playTone(index) {
    if (!soundEnabled || !isAvailable() || !audioContext || audioContext.state !== 'running') return;
    if (voices.size >= 8) endVoice(voices.values().next().value);
    const now = audioContext.currentTime;
    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);
    gain.connect(masterGain);
    const oscillators = [1, 2.006].map((ratio) => {
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = tones[index].frequency * ratio;
      oscillator.connect(gain);
      oscillator.start(now);
      oscillator.stop(now + 1.35);
      return oscillator;
    });
    const voice = { oscillators, gain };
    voices.add(voice);
    oscillators[1].onended = () => endVoice(voice);
    updateControls();
  }

  function audioFailure() {
    soundEnabled = false;
    silence();
    updateControls();
    announce('这次没能唤醒声音，可以再试一次；也能继续静音作曲。');
  }

  async function strike(index) {
    if (!isAvailable()) return;
    if (playing) stopPlayback();
    flashBell(index);
    if (notes.length < maxNotes) {
      notes.push(index);
      renderNotes();
      saveNotes();
      announce(notes.length === maxNotes ? '16 片叶子收齐了，来回放这首小曲吧。' : `记下了${tones[index].name}，现在有 ${notes.length} 片叶子。`);
    } else {
      announce('这首小曲已经装满 16 片叶子。可以先回放，或撤回一音再写。');
    }
    if (soundEnabled) {
      const attempt = audioAttempt;
      try {
        await prepareAudio();
        if (attempt === audioAttempt && soundEnabled && isAvailable()) playTone(index);
      } catch { if (attempt === audioAttempt) audioFailure(); }
    }
  }

  async function playSequence(repeat) {
    if (!isAvailable() || !notes.length) return;
    stopPlayback();
    const token = sequenceToken;
    if (soundEnabled) {
      try { await prepareAudio(); } catch { if (token === sequenceToken) audioFailure(); }
    }
    if (token !== sequenceToken || !isAvailable()) return;
    const melody = notes.slice();
    playing = true;
    looping = repeat;
    updateControls();
    announce(repeat ? '小曲开始循环，点「停止」让风歇一会儿。' : soundEnabled ? '正在听这首叶子小曲。' : '正在静音回放，看看叶子怎样跳舞。');
    let cursor = 0;
    function tick() {
      if (token !== sequenceToken || !isAvailable()) return;
      if (cursor === melody.length) {
        if (!looping) {
          playing = false;
          highlightNote(-1);
          updateControls();
          announce('小曲播放完了，最后一个音还在风里。');
          return;
        }
        cursor = 0;
      }
      highlightNote(cursor);
      flashBell(melody[cursor]);
      playTone(melody[cursor]);
      cursor += 1;
      sequenceTimer = window.setTimeout(tick, beatLength);
    }
    tick();
  }

  bells.forEach((bell, index) => bell.addEventListener('click', () => { void strike(index); }));
  workshop.addEventListener('keydown', (event) => {
    if (event.repeat || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.target.matches('input, textarea, select, [contenteditable]')) return;
    if (/^[1-5]$/.test(event.key)) {
      event.preventDefault();
      void strike(Number(event.key) - 1);
    }
  });
  soundButton.addEventListener('click', async () => {
    if (!isAvailable()) return;
    const attempt = ++audioAttempt;
    if (soundEnabled) {
      soundEnabled = false;
      stopPlayback('声音已关闭。可以继续安静地收集音符。');
      return;
    }
    soundButton.disabled = true;
    try {
      await prepareAudio();
      if (attempt !== audioAttempt || !isAvailable()) return;
      soundEnabled = true;
      updateControls();
      announce('声音醒来了，轻轻敲一下风铃吧。');
    } catch { if (attempt === audioAttempt) audioFailure(); }
    finally { soundButton.disabled = false; }
  });
  volumeInput.addEventListener('input', () => {
    volume = Number(volumeInput.value) / 100;
    find('.chime-volume output').textContent = `${volumeInput.value}%`;
    if (masterGain && audioContext) masterGain.gain.setTargetAtTime(volume * 0.3, audioContext.currentTime, 0.03);
  });
  playButton.addEventListener('click', () => { void playSequence(false); });
  loopButton.addEventListener('click', () => { if (looping) stopPlayback('循环停下了，叶子留在这里。'); else void playSequence(true); });
  stopButton.addEventListener('click', () => { audioAttempt += 1; stopPlayback('风铃停下了，叶子小曲已留下。'); });
  undoButton.addEventListener('click', () => {
    audioAttempt += 1;
    stopPlayback();
    notes.pop();
    renderNotes();
    saveNotes();
    announce('收起了最后一片叶子，可以换一个音试试。');
  });
  clearButton.addEventListener('click', () => {
    audioAttempt += 1;
    stopPlayback();
    notes = [];
    renderNotes();
    saveNotes();
    announce('叶子小曲已清空，等下一阵灵感的风。');
  });

  function pauseWhenAway() {
    if (isAvailable()) return;
    audioAttempt += 1;
    const wasPlaying = playing || voices.size > 0;
    if (wasPlaying) stopPlayback('风铃已暂停。回来后，轻点回放再听。');
    // Invalidate a playback request that is still waiting for audio permission.
    else sequenceToken += 1;
    if (audioContext?.state === 'running') audioContext.suspend().catch(() => {});
  }
  document.addEventListener('visibilitychange', pauseWhenAway);
  document.addEventListener('ruirui:scene-state', pauseWhenAway);
  window.addEventListener('pagehide', () => {
    audioAttempt += 1;
    stopPlayback();
    if (audioContext?.state === 'running') audioContext.suspend().catch(() => {});
  });
  new MutationObserver(pauseWhenAway).observe(document.body, { attributes: true, attributeFilter: ['open', 'data-phase'], subtree: true });

  window.ruiruiChimes = { getState: () => ({ notes: notes.slice() }) };
  renderNotes();
  updateStorageNote();
  announce(notes.length ? `欢迎回来，${notes.length} 片音符叶子还在这里。` : '不用懂乐谱，喜欢哪个音就轻轻敲一下。');
})();
