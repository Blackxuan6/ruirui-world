(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const model = window.RuiruiGardenModel;
  const escape = (text) => String(text ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const flowerKey = 'ruirui-garden-v1';
  const cardsKey = 'ruirui-postcards-v1';
  const flowers = {
    peach: { name:'猫耳花', mood:'一点甜', color:'#dca896', light:'#f1d0b9' },
    cloud: { name:'云朵花', mood:'慢悠悠', color:'#b8b0cf', light:'#e0d9ea' },
    star: { name:'星星花', mood:'亮晶晶', color:'#d8ba74', light:'#f2df9d' },
  };
  const names = ['左边', '中间', '右边'];
  let selected = 0;
  let seed = 'peach';
  let pots = model.empty();
  let storageOK = true;
  try { pots = model.normalize(JSON.parse(localStorage.getItem(flowerKey))); } catch { storageOK = false; }
  const flowerHost = $('#flower-workshop');
  flowerHost.innerHTML = `<span class="workshop-number" aria-hidden="true">01</span><p class="play-kicker">A FLOWER FOR YOUR MOOD</p><h3 id="flower-title" tabindex="-1">浇一朵，今天的心情</h3><p class="workshop-caption">选一颗种子，浇三次水。小花会一直等你，不会枯萎。</p><div class="garden-stage"><svg id="garden-preview" viewBox="0 0 420 200" aria-label="三个花盆的成长状态" role="img"></svg><span class="water-spark" aria-hidden="true"></span></div><div class="pot-choices" aria-label="选择花盆">${names.map((name,i)=>`<button type="button" class="pot-choice" data-pot="${i}" aria-pressed="${i===0}"><span>${name}这盆</span><small></small></button>`).join('')}</div><fieldset class="seed-choices"><legend>今天想种下什么？</legend><div class="seed-options">${Object.entries(flowers).map(([id,f])=>`<button class="seed-button" type="button" data-seed="${id}" aria-pressed="${id===seed}"><span class="seed-dot" style="--seed-color:${f.color}" aria-hidden="true"></span>${f.name} · ${f.mood}</button>`).join('')}</div></fieldset><div class="garden-actions"><button type="button" id="water-flower" class="paper-button primary-paper"><svg viewBox="0 0 28 28" aria-hidden="true"><path d="M10 11h12l-1 11H11Z M11 10c0-8 10-8 10 0M11 14 5 10 3 13l8 6M3 18l-1 2m3 0-1 2"/></svg><span>浇一点水</span></button><button type="button" id="replace-flower" class="quiet-button">换颗种子</button></div><p class="workshop-status" id="flower-status" role="status" aria-live="polite">让一颗种子在这里住下来。</p><p class="local-note" id="flower-storage-note">小花只保存在此浏览器，也可以拍成明信片带走。</p>`;

  function flowerSVG(pot, x, y, scale = 1, animate = false) {
    const f = flowers[pot.kind];
    const stemHeight = [0,22,44,69][pot.stage];
    // Each leaf joins a point on the stem's quadratic curve. Young leaves grow
    // with the stem instead of using the full-grown flower's coordinates.
    const leaf = (side, progress) => {
      const anchorX = -10 * progress * (1 - progress);
      const anchorY = -stemHeight * progress;
      const width = [0,12,21,28][pot.stage];
      const rise = [0,7,11,15][pot.stage];
      return `<path d="M${anchorX} ${anchorY} Q${anchorX+side*width*.55} ${anchorY-rise*1.7} ${anchorX+side*width} ${anchorY-rise*.55} Q${anchorX+side*width*.9} ${anchorY+rise*.6} ${anchorX} ${anchorY}Z" fill="#a5ba88" stroke="#81976e" stroke-width="1"/>`;
    };
    let bloom = '';
    if (pot.stage === 2) bloom = `<ellipse cx="0" cy="-${stemHeight}" rx="7" ry="10" fill="${f.light}" stroke="#a1a783"/>`;
    if (pot.stage === 3) {
      if (pot.kind === 'peach') bloom = `<path d="M-21-7-23-29-7-19Q0-23 8-19L23-29 21-6Q24 15 0 18-24 15-21-7Z" fill="${f.light}" stroke="${f.color}" stroke-width="2"/><path d="M-10-3v3m20-3v3M-3 5q3 5 6 0" fill="none" stroke="#8d7765" stroke-width="1.7" stroke-linecap="round"/><ellipse cx="-13" cy="5" rx="4" ry="2" fill="${f.color}"/><ellipse cx="13" cy="5" rx="4" ry="2" fill="${f.color}"/>`;
      else if (pot.kind === 'cloud') bloom = `<path d="M-21 11C-39 7-30-11-18-9-19-29 6-32 11-15 31-20 36 8 21 12Z" fill="${f.light}" stroke="${f.color}" stroke-width="2"/><path d="M-8 0q3 3 6 0m8 0q3 3 6 0M0 7q3 2 6-1" stroke="#8c829e" fill="none" stroke-linecap="round"/>`;
      else bloom = `<path d="m0-29 9 17 20 3-15 14 3 21L0 16-18 26l4-21-15-14 20-3Z" fill="${f.light}" stroke="${f.color}" stroke-width="2" stroke-linejoin="round"/><path d="M-7-1v3m14-3v3M-3 8q3 3 6 0" stroke="#99834c" fill="none" stroke-linecap="round"/>`;
      bloom = `<g transform="translate(0,-${stemHeight})">${bloom}</g>`;
    }
    return `<g class="visitor-flower" transform="translate(${x},${y}) scale(${scale})"><ellipse cy="14" rx="32" ry="6" fill="#879c6e" opacity=".13"/><g class="visitor-flower-growth${animate ? ' is-growing' : ''}">${pot.stage ? `<path d="M0 0 Q-5 ${-stemHeight/2} 0 ${-stemHeight}" stroke="#7d9569" stroke-width="3" stroke-linecap="round" fill="none"/>${leaf(-1,.35)}${leaf(1,.58)}${bloom}` : '<path d="M-6-3q6-7 12 0" fill="#b1a17a"/>'}</g><path d="M-26-4 26-4 21 29Q0 36-21 29Z" fill="#d9bc95" stroke="#a8956f" stroke-width="1.3"/><path d="M-28-7Q0-1 28-7v10Q0 10-28 3Z" fill="#ecdbb9" stroke="#b29d78"/><path d="M-11 13v11m22-11v11" stroke="#eee2c2" stroke-width="2"/><path d="m-5 17 3-4 3 4 3-3 1 5q-5 6-10-2Z" fill="#ae9870" opacity=".65"/></g>`;
  }

  function renderGarden(animatedIndex = -1) {
    $('#garden-preview').innerHTML = `<path d="M12 171Q210 152 408 171" fill="none" stroke="#b6c69b" stroke-width="1.5"/><g>${pots.map((p,i)=>flowerSVG(p,74+i*136,147,1,i===animatedIndex)).join('')}</g>`;
    $('#garden-preview').setAttribute('aria-label', pots.map((p,i)=>`${names[i]}花盆：${p.stage===0?'空花盆':flowers[p.kind].name+'，'+['','发芽','花苞','已开花'][p.stage]}`).join('；'));
    flowerHost.querySelectorAll('[data-pot]').forEach((button,i)=>{
      button.setAttribute('aria-pressed',String(i===selected));
      button.querySelector('small').textContent = ['等待种子','小芽冒头','含苞待放','花开啦'][pots[i].stage];
    });
    flowerHost.querySelectorAll('[data-seed]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.seed===seed)));
    $('#water-flower').disabled = pots[selected].stage === 3;
    $('#water-flower span').textContent = pots[selected].stage === 3 ? '这朵花，已经开好啦' : '浇一点水';
    $('#replace-flower').disabled = pots[selected].stage === 0;
    const svg = $('#garden-art > svg');
    if (svg) {
      let layer = svg.querySelector('#visitor-flowers-layer');
      if (!layer) { layer = document.createElementNS('http://www.w3.org/2000/svg','g'); layer.id='visitor-flowers-layer'; svg.append(layer); }
      layer.innerHTML = pots.map((p,i)=>flowerSVG(p,284+i*68,585+(i===1?-15:0),.65)).join('');
    }
  }
  function saveGarden() {
    try { localStorage.setItem(flowerKey,JSON.stringify(pots)); storageOK=true; }
    catch { storageOK=false; }
    $('#flower-storage-note').textContent = storageOK ? '小花只保存在此浏览器，也可以拍成明信片带走。' : '浏览器暂时不能保存小花，本次仍可游玩。离开前可以拍张明信片。';
    document.dispatchEvent(new CustomEvent('ruirui:gardenchange',{detail:{pots:pots.map(p=>({...p}))}}));
  }
  flowerHost.addEventListener('click',event=>{
    const pot = event.target.closest('[data-pot]');
    const seedButton = event.target.closest('[data-seed]');
    if (pot) { selected=Number(pot.dataset.pot); $('#flower-status').textContent=`选中了${names[selected]}这盆。${pots[selected].stage ? '可以继续照顾它，也可以换颗种子。' : '选颗种子，浇一点水吧。'}`; renderGarden(); }
    if (seedButton) { seed=seedButton.dataset.seed; $('#flower-status').textContent=pots[selected].stage ? '这盆已经有小花啦。选一盆空花盆，或点“换颗种子”。' : `选好了${flowers[seed].name}，等你浇第一点水。`; renderGarden(); }
  });
  $('#water-flower').addEventListener('click',()=>{
    pots=model.water(pots,selected,seed); renderGarden(selected); saveGarden();
    $('#flower-status').textContent=['','小芽探出头来：原来，你也在这里。','再来一点点，花苞正悄悄攒着快乐。',`${flowers[pots[selected].kind].name}开了！这份小小的快乐，送给今天的你。`][pots[selected].stage];
    flowerHost.classList.remove('is-watered'); void flowerHost.offsetWidth; flowerHost.classList.add('is-watered');
  });
  flowerHost.addEventListener('animationend',event=>{
    if(event.animationName==='flower-greet')event.target.classList.remove('is-growing');
    if(event.animationName==='water-spark')flowerHost.classList.remove('is-watered');
  });
  let previousPot = null;
  $('#replace-flower').addEventListener('click',()=>{
    previousPot={ index:selected, pot:{...pots[selected]} };
    pots[selected]={kind:seed,stage:0}; renderGarden(); saveGarden();
    $('#flower-status').textContent='腾好了花盆，新的种子也值得期待。';
    const undo=document.createElement('button'); undo.type='button'; undo.className='quiet-button'; undo.textContent='撤销换种';
    undo.addEventListener('click',()=>{if(!previousPot)return;pots[previousPot.index]=previousPot.pot;previousPot=null;renderGarden();saveGarden();$('#flower-status').textContent='原来的小花回来了。';});
    $('#flower-status').append(undo);
  });
  renderGarden();
  if (pots.some(pot=>pot.stage>0)) $('#flower-status').textContent='欢迎回来，你的小花还在这里。';
  if (!storageOK) $('#flower-storage-note').textContent='浏览器暂时不能读取收藏，本次仍可游玩。';
  window.ruiruiGarden={getState:()=>pots.map(p=>({...p}))};

  function addSceneEntry(parent,css,label,target) {
    const button=document.createElement('button'); button.type='button'; button.className=`scene-play-target ${css}`; button.dataset.label=label; button.setAttribute('aria-label',label); parent.append(button);
    button.addEventListener('click',()=>{if(target==='postcard')openPostcard(button);else {const element=$(target);element.scrollIntoView({behavior:document.body.dataset.motion==='off'?'instant':'smooth',block:'center'});const heading=element.querySelector('h3,button');heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});}});
  }
  addSceneEntry($('.garden-half'),'water-target','浇朵花','#flower-workshop');
  addSceneEntry($('.room-half'),'chime-target','敲敲风铃','#chime-workshop');
  addSceneEntry($('.room-half'),'keepsake-target','小院拍立得','postcard');

  const postcardDialog=$('#postcard-dialog');
  let cards=[];
  let shelfURLs=[];
  let previewURL='';
  let exportURL='';
  let exportVersion=0;
  let currentSVG='';
  let snapshot=null;
  let postcardTrigger=null;
  let previousOverflow='';
  let editingSaved=false;
  let updateTimer=0;
  const svgProperties=['fill','fill-opacity','stroke','stroke-width','stroke-opacity','stroke-linecap','stroke-linejoin','opacity','filter','transform','transform-origin','transform-box','display','visibility','mix-blend-mode','stop-color','stop-opacity'];
  function freezeSVG(source) {
    const copy=source.cloneNode(true);
    const originals=[source,...source.querySelectorAll('*')];
    const copies=[copy,...copy.querySelectorAll('*')];
    originals.forEach((element,i)=>{
      const computed=getComputedStyle(element);
      svgProperties.forEach(property=>{
        let value=computed.getPropertyValue(property);
        value=value.replace(/url\(["']?[^)#]*#([^)'"\s]+)["']?\)/g,'url(#$1)');
        if(value)copies[i].style.setProperty(property,value);
      });
      copies[i].style.animation='none'; copies[i].style.transition='none';
    });
    copy.setAttribute('width','720');copy.setAttribute('height','650');copy.setAttribute('xmlns','http://www.w3.org/2000/svg');
    copy.style.width='720px';copy.style.height='650px';
    return new XMLSerializer().serializeToString(copy);
  }
  function takeSnapshot() {
    const weather=window.ruiruiWeather?.getState() ?? {id:'sunny',label:'晴天'};
    const art=window.ruiruiWeather?.getExportLayers?.() ?? {background:'#ecedd7',room:freezeSVG($('#room-art > svg')),garden:freezeSVG($('#garden-art > svg'))};
    return {art,weather,notes:window.ruiruiChimes?.getState().notes ?? [],date:new Intl.DateTimeFormat('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()),flowerCount:pots.filter(p=>p.stage===3).length};
  }
  function buildPostcard(message) {
    const s=snapshot;
    const score=s.notes.slice(0,16).map((note,i)=>`<g transform="translate(${60+i*18},961)"><path d="M0 0v-13l9-3v11" fill="none" stroke="#8a9675" stroke-width="1.5"/><ellipse cx="-3" cy="0" rx="4" ry="3" fill="${['#b3bd8c','#d5af90','#b5bfd1','#bcb0c8','#d5c080'][note]}"/></g>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1010" viewBox="0 0 1536 1010"><rect width="1536" height="1010" fill="#fffdf3"/><rect x="18" y="18" width="1500" height="974" rx="12" fill="none" stroke="#d8dcc4" stroke-width="2"/><text x="54" y="75" fill="#59694a" font-size="31" font-family="Georgia,serif">${escape(window.ruiruiSiteConfig.name)}</text><text x="54" y="116" fill="#879272" font-size="15" letter-spacing="5" font-family="Georgia,serif">A LITTLE POSTCARD FROM MY WORLD</text><text x="1457" y="70" text-anchor="end" fill="#738260" font-family="sans-serif" font-size="20">${escape(s.date)}</text><text x="1457" y="108" text-anchor="end" fill="#738260" font-family="sans-serif" font-size="21">${escape(s.weather.label)} · ${s.flowerCount} 朵花开</text><svg x="48" y="157" width="1440" height="650" viewBox="0 0 1440 650"><rect width="1440" height="650" fill="${escape(s.art.background)}"/><g>${s.art.room}</g><g transform="translate(720,0)">${s.art.garden}</g></svg><path d="M54 833h1428" stroke="#d6dcc4" stroke-dasharray="4 7"/><text x="768" y="902" text-anchor="middle" fill="#566447" font-family="Microsoft YaHei,PingFang SC,sans-serif" font-size="27">${escape(message)}</text>${score}<text x="1476" y="967" text-anchor="end" fill="#8d987a" font-size="16" font-family="sans-serif">${s.notes.length?'一段风铃，一点好心情':'愿你今天也有小小的快乐'} · 小院留念</text></svg>`;
  }
  function displaySVG(svg) {
    if(previewURL)URL.revokeObjectURL(previewURL);
    currentSVG=svg;previewURL=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));
    $('#postcard-preview').src=previewURL;
    preparePNG(previewURL);
  }
  async function preparePNG(source) {
    const version=++exportVersion;
    const link=$('#postcard-download');link.removeAttribute('href');link.setAttribute('aria-disabled','true');link.textContent='正在准备 PNG…';
    try {
      const image=new Image();
      await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('image'));image.src=source;});
      const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=1010;
      const context=canvas.getContext('2d');if(!context)throw new Error('canvas');context.drawImage(image,0,0);
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('export');
      if(version!==exportVersion)return;
      if(exportURL)URL.revokeObjectURL(exportURL);
      exportURL=URL.createObjectURL(blob);link.href=exportURL;
      link.download=`小院明信片-${new Intl.DateTimeFormat('sv-SE').format(new Date())}.png`;
      link.removeAttribute('aria-disabled');link.textContent='下载 PNG';
      // The preview and downloadable image are the same pixels, verified before saving.
      $('#postcard-preview').src=exportURL;
      $('#postcard-preview').dataset.format='png';
    } catch {
      if(version!==exportVersion)return;
      link.textContent='PNG 暂时不可用';$('#postcard-status').textContent='图片暂时没能导出。可以重新打开明信片再试，或先收藏当前画面。';
    }
  }
  function openPostcard(trigger, saved=null) {
    if(document.body.dataset.phase!=='world'||postcardDialog.open||$('#content-dialog').open)return;
    window.ruiruiApp?.closeSettings?.();window.ruiruiApp?.hideCatSpeech?.();
    postcardTrigger=trigger;editingSaved=Boolean(saved); snapshot=saved ? null : takeSnapshot();
    $('#postcard-message').value=saved?.message ?? '今天，也有小小的快乐。';
    $('#postcard-message').disabled=editingSaved;
    $('#postcard-save').disabled=editingSaved;
    $('#postcard-status').textContent=editingSaved?'这是当时收藏的画面，可以下载 PNG 留存。':'明信片会记录当前天气、花朵与风铃音符。';
    displaySVG(saved?.svg ?? buildPostcard($('#postcard-message').value));
    previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
    postcardDialog.showModal();$('#postcard-close').focus({preventScroll:true});
  }
  document.querySelectorAll('[data-postcard-open]').forEach(button=>button.addEventListener('click',()=>openPostcard(button)));
  $('#postcard-close').addEventListener('click',()=>postcardDialog.close());
  postcardDialog.addEventListener('close',()=>{clearTimeout(updateTimer);document.body.style.overflow=previousOverflow;postcardTrigger?.focus({preventScroll:true});});
  let backdropDown=false;
  function outside(event){const rect=postcardDialog.getBoundingClientRect();return event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom;}
  postcardDialog.addEventListener('pointerdown',event=>{backdropDown=event.target===postcardDialog&&outside(event);});
  postcardDialog.addEventListener('click',event=>{if(backdropDown&&event.target===postcardDialog&&outside(event))postcardDialog.close();backdropDown=false;});
  $('#postcard-message').addEventListener('input',()=>{clearTimeout(updateTimer);++exportVersion;$('#postcard-download').removeAttribute('href');$('#postcard-download').setAttribute('aria-disabled','true');updateTimer=setTimeout(()=>{if(snapshot)displaySVG(buildPostcard($('#postcard-message').value));},140);$('#postcard-save').disabled=false;});
  function safeSavedSVG(text) {
    if(typeof text!=='string'||text.length>1500000)return false;
    const doc=new DOMParser().parseFromString(text,'image/svg+xml');
    if(doc.querySelector('parsererror')||doc.documentElement.localName!=='svg')return false;
    const allowed=new Set(['svg','g','defs','linearGradient','radialGradient','stop','path','rect','circle','ellipse','polygon','polyline','line','text','tspan','pattern','filter','feTurbulence','feComposite','feColorMatrix','feGaussianBlur','feBlend','feFlood','feMerge','feMergeNode','feComponentTransfer','feFuncA','use','clipPath','mask','title','desc']);
    return [...doc.querySelectorAll('*')].every(e=>allowed.has(e.localName)&&[...e.attributes].every(a=>!/^on/i.test(a.name)&&(!/(?:href|src)$/i.test(a.name)||/^#[A-Za-z][\w.-]*$/.test(a.value))&&(!/url\(/i.test(a.value)||! /url\(\s*["']?[^#\s"']/i.test(a.value))));
  }
  try { const stored=JSON.parse(localStorage.getItem(cardsKey));if(Array.isArray(stored))cards=stored.filter(c=>c&&typeof c.message==='string'&&c.message.length<=40&&typeof c.date==='string'&&safeSavedSVG(c.svg)).slice(0,6); } catch { /* An unavailable collection never blocks the courtyard. */ }
  function renderShelf() {
    shelfURLs.forEach(url=>URL.revokeObjectURL(url));shelfURLs=[];
    const shelf=$('#postcard-shelf');shelf.replaceChildren();
    if(!cards.length) { shelf.innerHTML='<div class="empty-postcard"><svg viewBox="0 0 90 80" aria-hidden="true"><path d="m8 12 70 5-4 53-70-5Z"/><path d="m15 21 54 4-3 29-54-4Z M18 57l28 2"/><path d="m26 43 10-10 9 9 8-5 10 9"/><circle cx="57" cy="31" r="4"/></svg><span>这里还没有明信片。<br>选个喜欢的天气，拍下第一张吧。</span></div>';return; }
    cards.forEach(card=>{
      const url=URL.createObjectURL(new Blob([card.svg],{type:'image/svg+xml;charset=utf-8'}));shelfURLs.push(url);
      const button=document.createElement('button');button.type='button';button.className='saved-postcard';button.setAttribute('aria-label',`查看明信片：${card.message}`);
      const img=document.createElement('img');img.src=url;img.alt=card.message;img.loading='lazy';
      const caption=document.createElement('span');caption.textContent=card.date;
      button.append(img,caption);button.addEventListener('click',()=>openPostcard(button,card));shelf.append(button);
    });
  }
  $('#postcard-save').addEventListener('click',()=>{
    if(editingSaved||!snapshot)return;
    clearTimeout(updateTimer);const message=$('#postcard-message').value.slice(0,40);displaySVG(buildPostcard(message));
    const next=[{message,date:snapshot.date,svg:currentSVG},...cards].slice(0,6);
    try {localStorage.setItem(cardsKey,JSON.stringify(next));$('#postcard-status').textContent='已收藏到“小院来信”。也可以下载 PNG，留一份在自己手里。';}
    catch {$('#postcard-status').textContent='浏览器暂时无法保存，明信片仅在本次访问保留。请下载 PNG 留存。';$('#memory-storage-note').textContent='当前收藏只在本次访问保留，离开前请下载喜欢的明信片。';}
    cards=next;renderShelf();$('#postcard-save').disabled=true;
  });
  $('#postcard-download').addEventListener('click',event=>{
    if(!event.currentTarget.hasAttribute('href'))event.preventDefault();
    else $('#postcard-status').textContent='PNG 已准备好，请在浏览器下载中查看。';
  });
  renderShelf();
})();
