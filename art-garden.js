/* Original layered garden illustration. Variation is deterministic, including offline. */
(() => {
  const palette = ['#82966c', '#91a879', '#a3b883', '#b6c78e', '#74906b', '#c2ce97'];
  const variation = (n) => { const v = Math.sin(n * 127.1 + 17.3) * 43758.5453; return v - Math.floor(v); };
  const leaf = (x, y, scale, angle, color, vein = false) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(1)}) scale(${scale.toFixed(2)})"><path d="M0 0C-8-3-12-12-9-19C-1-19 7-10 0 0Z" fill="${color}" stroke="#607352" stroke-opacity=".26" stroke-width=".8"/>${vein ? '<path d="M-1-2-6-14" stroke="#d4dbac" stroke-opacity=".45" stroke-width=".75"/>' : ''}</g>`;
  const canopy = (cx, cy, rx, ry, count, seed) => Array.from({ length: count }, (_, i) => {
    const a = i * 2.3999632, r = Math.sqrt((i + .4) / count), x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r;
    return leaf(x, y, .65 + variation(i + seed) * .65, -100 + variation(i + seed + 30) * 220, palette[Math.floor(variation(i + seed + 9) * palette.length)], i % 3 === 0);
  }).join('');
  const sprig = (x, y, scale, angle, shade = '#879d70') => `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})"><path d="M0 0C4-20-6-43 0-65" fill="none" stroke="#738563" stroke-width="1.2"/><path d="M1-9C-15-9-19-19-18-24C-8-24-1-17 1-9ZM0-20C12-23 17-32 15-37C6-36 1-29 0-20ZM-2-32C-14-33-18-42-16-46C-8-45-3-39-2-32ZM-1-45C8-48 12-56 10-60C3-59-1-52-1-45Z" fill="${shade}" stroke="#70825e" stroke-width=".7"/></g>`;
  const grass = Array.from({ length: 78 }, (_, i) => {
    const x = 15 + variation(i + 150) * 690, y = 412 + variation(i + 350) * 225;
    return `<path d="M${x.toFixed(1)} ${y.toFixed(1)}q-1-6-4-9m4 9q1-9 4-12m-4 12q4-5 7-5" opacity="${(.18 + variation(i + 49) * .2).toFixed(2)}"/>`;
  }).join('');
  const meadowDots = Array.from({ length: 95 }, (_, i) => `<ellipse cx="${(10 + variation(i + 800) * 710).toFixed(1)}" cy="${(403 + variation(i + 930) * 240).toFixed(1)}" rx="${(.5 + variation(i + 700) * 1.7).toFixed(1)}" ry=".65" fill="${i % 3 ? '#8eaa79' : '#f4efc9'}" opacity=".48"/>`).join('');
  const fence = Array.from({ length: 15 }, (_, i) => {
    const x = 35 + i * 43, y = 366 + Math.sin(i * .25) * 8;
    return `<g transform="translate(${x} ${y.toFixed(1)})"><path d="M0 44 1-1Q1-5 7-8L14-3 15 45Z" fill="url(#garden-fence)" stroke="#a69c79" stroke-width="1.15"/><path d="M5 1 5 37M10 17l-.3 18" stroke="#c4b48e" stroke-width=".7" opacity=".65"/><circle cx="7" cy="14" r="1" fill="#a39776"/></g>`;
  }).join('');
  const flowers = [[40,490,.65,-8],[63,478,.75,6],[95,485,.55,-12],[483,459,.8,5],[505,466,.6,-8],[551,533,.9,10],[579,548,1.1,-9],[610,516,.8,5],[642,560,1.2,12],[680,533,.8,-5],[695,585,1.1,-9],[561,593,.75,-15],[478,572,.65,5],[456,586,.8,-12],[369,606,.6,8],[418,629,.85,-9]].map(([x,y,s,r], i) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><g class="flower-sway" style="animation-delay:-${(i * 1.3).toFixed(1)}s"><use href="#garden-daisy"/></g></g>`).join('');

  window.ruiruiGardenArt = `
<svg class="garden-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 650" fill="none" aria-hidden="true">
  <defs>
    <linearGradient id="garden-lawn" x1="340" y1="380" x2="290" y2="650" gradientUnits="userSpaceOnUse"><stop stop-color="#c8d4a7"/><stop offset=".52" stop-color="#c1d09d"/><stop offset="1" stop-color="#aebf8c"/></linearGradient>
    <linearGradient id="garden-distant" x1="350" y1="265" x2="350" y2="390" gradientUnits="userSpaceOnUse"><stop stop-color="#a9c1ae"/><stop offset="1" stop-color="#c7d7bd"/></linearGradient>
    <linearGradient id="garden-edge-blend" x1="-64" y1="0" x2="-36" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="white" stop-opacity="0"/><stop offset="1" stop-color="white"/></linearGradient>
    <mask id="garden-terrain-blend" x="-64" y="0" width="800" height="660" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse"><rect x="-64" y="0" width="800" height="660" fill="url(#garden-edge-blend)"/></mask>
    <linearGradient id="garden-wood" x1="390" y1="280" x2="460" y2="480" gradientUnits="userSpaceOnUse"><stop stop-color="#dfc09a"/><stop offset=".5" stop-color="#d4ae80"/><stop offset="1" stop-color="#c49c71"/></linearGradient>
    <linearGradient id="garden-fence" x1="0" y1="0" x2="15" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="#e7d7b3"/><stop offset=".55" stop-color="#efe2c4"/><stop offset="1" stop-color="#d7c7a4"/></linearGradient>
    <linearGradient id="garden-bark" x1="580" y1="220" x2="625" y2="225" gradientUnits="userSpaceOnUse"><stop stop-color="#ba9e75"/><stop offset=".5" stop-color="#cfb38a"/><stop offset="1" stop-color="#a68e69"/></linearGradient>
    <linearGradient id="garden-stone" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f4edda"/><stop offset="1" stop-color="#ded8bf"/></linearGradient>
    <linearGradient id="garden-cat" x1="402" y1="242" x2="426" y2="281" gradientUnits="userSpaceOnUse"><stop stop-color="#fffefb"/><stop offset=".55" stop-color="#f7f6ef"/><stop offset="1" stop-color="#e4e7dc"/></linearGradient>
    <linearGradient id="garden-cat-face" x1="388" y1="248" x2="405" y2="283" gradientUnits="userSpaceOnUse"><stop stop-color="#fffefa"/><stop offset="1" stop-color="#f0f1e8"/></linearGradient>
    <radialGradient id="garden-sunpatch"><stop stop-color="#fff7c5" stop-opacity=".55"/><stop offset="1" stop-color="#fff7c5" stop-opacity="0"/></radialGradient>
    <radialGradient id="garden-moon-glow"><stop stop-color="#f9ecbf" stop-opacity=".34"/><stop offset="1" stop-color="#f9ecbf" stop-opacity="0"/></radialGradient>
    <clipPath id="garden-weather-clip"><rect x="0" y="0" width="720" height="650"/></clipPath>
    <pattern id="garden-rope" width="24" height="5.5" patternUnits="userSpaceOnUse"><rect width="24" height="5.5" fill="#d6bd92"/><path d="m-4 5 30-4" stroke="#a68c66" stroke-width=".7"/><path d="m-3 2 29-4" stroke="#eee0bf" stroke-width="1.1"/></pattern>
    <g id="garden-daisy" stroke-linecap="round" stroke-linejoin="round">
      <path d="M0 0C-3-14 3-24 0-38" stroke="#788c62" stroke-width="1.25"/>
      <path d="M-1-12C-12-12-16-20-13-23C-6-22-2-18-1-12ZM0-21C8-23 11-29 9-31C4-29 1-26 0-21Z" fill="#91a477" stroke="#7c8e64" stroke-width=".6"/>
      <g transform="translate(0 -39)"><path d="M0-2C-8-14-13-5-4 0C-16 0-11 9-2 4C-9 16 3 17 2 5C9 16 16 8 5 2C18 2 15-9 4-3C9-15-3-16 0-2Z" fill="#fff7e6" stroke="#c8bc91" stroke-width=".65"/><ellipse cy="1" rx="3.5" ry="3" fill="#d7ad58"/><path d="m-1 0 2 1" stroke="#edcc7c" stroke-width="1.3"/></g>
    </g>
  </defs>

  <g class="weather-night-only" aria-hidden="true">
    <circle cx="294" cy="105" r="87" fill="url(#garden-moon-glow)"/>
    <path d="M300 75a29 29 0 1 0 26 43c-22 4-38-22-26-43Z" fill="#f7e7b1" stroke="#e2d5a8" stroke-width="1.1"/>
    <g fill="#fff0c6" class="weather-stars"><path d="m116 85 2 5 5 2-5 2-2 5-2-5-5-2 5-2Zm92 52 1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Zm190-68 1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z"/><circle cx="70" cy="231" r="1.8"/><circle cx="245" cy="55" r="1.4"/><circle cx="368" cy="168" r="1.6"/><circle cx="169" cy="206" r="1.5"/><circle cx="424" cy="124" r="1.4"/></g>
  </g>

  <!-- A quiet view beyond the fence; pale hills leave air around the sign. -->
  <g class="cloud-drift" fill="#fffdf3" opacity=".68">
    <path d="M88 181c-16-1-19-18-6-24 1-21 29-29 42-11 16-9 35 2 34 17 21 2 23 20 5 22Z"/>
    <path d="M309 123c-11-1-13-13-4-17 2-17 25-21 33-7 13-5 26 3 25 15 12 0 16 12 5 15Z" opacity=".8"/>
  </g>
  <!-- Extend the original terrain behind the room, without double-painting translucent hills.
       The outer fade sits left of the wall (garden x=-26); stacked layouts clip it offscreen. -->
  <g mask="url(#garden-terrain-blend)">
    <path d="M-64 348Q-36 345-15 339c52-11 55-39 90-39 33 0 48 26 76 22 42-7 56-52 101-47 31 3 40 27 68 27 35-1 66-25 101-21 49 5 53 35 98 39 58 5 93-12 122 0 31 12 58 17 93 11v81H-64Z" fill="url(#garden-distant)" opacity=".66"/>
    <path d="M-64 395Q-30 386-8 369c60-46 94-6 142-18 46-12 60-44 106-35 40 8 57 34 105 27 60-8 73-36 123-27 45 8 66 36 100 27 55-15 91-12 166 19v60H-64Z" fill="#a9bd90" opacity=".65"/>
    <path d="M-64 381Q-28 382-6 380c86-8 124 12 213 2 104-11 189 10 281-3 81-11 163 4 244 10v267H-64Z" fill="url(#garden-lawn)"/>
    <ellipse cx="218" cy="497" rx="260" ry="155" fill="url(#garden-sunpatch)"/>
    <path d="M-64 403Q-32 399-8 394c114-23 218 7 333-8 145-20 267-4 403 8" stroke="#e0e7bf" stroke-width="8" opacity=".35"/>
  </g>
  <g stroke-linejoin="round" stroke-linecap="round">
    <path d="m31 381 629 6v9l-629-5Z" fill="#d3c5a1" stroke="#aba384" stroke-width="1"/>
    <path d="m31 408 629 6v8l-629-5Z" fill="#d8cba9" stroke="#b4aa89" stroke-width="1"/>
    ${fence}
  </g>
  <g opacity=".7" fill="#8fa67a">
    <path d="M-8 423c-1-17 13-27 25-19-3-20 22-28 29-10 8-19 33-11 32 6 16-15 38-3 33 15 13-4 24 6 22 14Z"/>
    <path d="M447 424c-7-21 15-34 29-18-2-28 34-33 42-9 15-22 40-12 40 8 22-16 44 0 39 18Z"/>
    <path d="M624 428c-5-20 20-34 34-18-2-31 39-39 49-13 10-12 24-11 31-2v36Z"/>
  </g>

  <!-- Branches and individual painted leaves have separate animation layers. -->
  <ellipse cx="608" cy="447" rx="106" ry="23" fill="#6f885e" opacity=".11"/>
  <g stroke="#8e805e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M593 438c13-48 5-91 3-137-2-41 8-85 4-127l18-5c-1 42-5 79-4 118 1 60 5 110 19 150-11 8-28 9-40 1Z" fill="url(#garden-bark)"/>
    <path d="M604 310c-30-37-60-55-83-88l8-7c28 28 51 44 79 65M610 278c20-37 47-46 66-77l8 3c-17 39-48 55-72 91M602 240c-18-23-19-52-38-71l7-6c23 19 26 44 36 60" fill="url(#garden-bark)"/>
    <path d="M604 435c3-35-3-67 1-99m8 91c-4-23-5-52-3-73m-7-75c-10-17-31-33-45-42m58 27c9-16 27-28 41-42m-51 21c-2-24 2-44 0-64" stroke="#9a8662" stroke-width="1" opacity=".65"/>
    <path d="M611 391c-6-8-8-15-3-22 5 3 8 12 3 22Z" stroke-width=".9" fill="#b99b73"/>
  </g>
  <g class="tree-canopy">
    <g fill="#82996e" opacity=".84"><path d="M463 200c-26-14-20-43 0-50-17-33 10-58 38-51 3-32 40-42 62-23 22-37 65-26 76-3 33-17 60 3 61 24 31-3 48 27 33 52 24 23 15 53-14 64-7 38-43 43-67 24-29 25-60 17-74-3-21 23-54 14-63-3-25 13-52-4-52-31Z"/></g>
    ${canopy(562, 183, 111, 70, 120, 14)}
    ${canopy(646, 158, 109, 76, 125, 150)}
    ${canopy(552, 121, 84, 43, 65, 300)}
    ${canopy(675, 104, 63, 36, 46, 450)}
    <g fill="#d3d9a1" opacity=".42"><path d="M503 110c8-8 19-11 27-7-4 8-16 13-27 7Zm107-26c11-7 21-7 29-2-5 9-17 11-29 2Zm51 91c10-8 19-9 27-4-5 7-18 10-27 4Z"/></g>
  </g>

  <g class="garden-yarn" stroke="#9c8b63" stroke-linecap="round" stroke-linejoin="round">
    <path d="M546 235v28" stroke-width="1"/>
    <path d="M536 276c0-14 3-20 10-20s10 6 10 20q-10 5-20 0Z" fill="#d2d8ac" stroke-width="1.15"/>
    <path d="M539 274q7 3 14 0m-8-13c-3 1-4 5-4 8" stroke="#edf0ce" stroke-width="1.2"/>
    <path d="M546 279v19" stroke-width=".8"/><path d="m540 294 12 1-2 24-10-2Z" fill="#f4ead1" stroke-width=".8"/>
    <path d="m544 301 4 1m-5 4 5 1" stroke="#b5b98d" stroke-width=".8"/>
  </g>

  <!-- Turned timber, woven rope and a quiet sleeping cat. -->
  <g class="weather-rain-only" stroke="#8b957d" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M407 202v85" stroke-width="2"/><path d="M350 239q9-35 57-37 47 2 58 37-18-10-29 0-15-10-29 0-16-10-29 0-13-10-28 0Z" fill="#bccda8"/><path d="M407 202q-24 14-29 37m29-37q23 14 29 37m-29-37v37" fill="none" stroke="#93aa85"/><path d="M407 202v-6"/><path d="M358 231q14-21 38-24" fill="none" stroke="#e3e8c5"/><path d="m407 282 0 8q0 6 5 6t5-6" fill="none" stroke-width="2"/></g>
  <ellipse cx="401" cy="489" rx="90" ry="19" fill="#758c5d" opacity=".13"/>
  <g stroke="#aa8c65" stroke-linecap="round" stroke-linejoin="round">
    <path d="m330 475 132-1 19 15c-38 12-102 13-155 2Z" fill="#c5a27a" stroke-width="1.25"/>
    <path d="m331 470 128-1 19 13c-48 10-101 11-151 3Z" fill="#e4c69c" stroke-width="1.35"/>
    <path d="M341 476c38 4 80 3 114-1m-112 7 34 2" stroke="#f3dbb3" stroke-width="1" opacity=".8"/>
    <path d="M366 290h23v184q-11 5-23 0Z" fill="url(#garden-rope)" stroke-width="1.15"/>
    <path d="M369 293v178" stroke="#f0dfbe" stroke-width="2" opacity=".5"/>
    <path d="M432 357h21v116q-10 4-21 0Z" fill="url(#garden-rope)" stroke-width="1.1"/>
    <path d="m337 356 117-4 11 8-119 6Z" fill="#c09c70" stroke-width="1.2"/>
    <path d="m337 350 116-3 11 7-119 6Z" fill="#e3c399" stroke-width="1.3"/>
    <path d="m350 352 78-2m-72 5 16-.5" stroke="#f3dab6" stroke-width=".9"/>
    <path d="M379 400c0-4 4-7 8-7l65-2q8 0 8 8v64q-40 8-81 1Z" fill="url(#garden-wood)" stroke-width="1.4"/>
    <path d="m381 399 7-8 65-2 9 9Z" fill="#efd7b2" stroke-width="1.1"/>
    <path d="M400 462v-30c0-24 30-24 30 0v31Z" fill="#876f52" stroke="#a28561" stroke-width="1.4"/>
    <path d="M406 462v-29c0-15 12-20 20-13" stroke="#6e604b" stroke-width="2" opacity=".5"/>
    <path d="M404 458q11-6 24 0l1 5-25 1Z" fill="#bdc198" stroke-width=".75"/>
    <path d="M387 411v42m64-47v25m-12-21v16m-50 8v6" stroke="#b39066" stroke-width=".75" opacity=".6"/>
    <path d="M347 284q58-9 109-2l3 9q-55 11-112 4Z" fill="#c8a57b" stroke-width="1.3"/>
    <path d="M346 277q54-10 110-1l3 9q-55 10-112 2Z" fill="#e7cba5" stroke-width="1.4"/>
    <path d="M354 281q46-7 92-1" stroke="#f6e2c0" stroke-width="1.1"/>
    <path d="M365 276q41-9 76-1l2 7q-37 6-77 1Z" fill="#b9c6a0" stroke="#929e7d" stroke-width="1"/>
    <path d="m370 279 4 .5m5-1 4 .3m5-1 4 .3m5-1 4 .3m5-1 4 .2m5 .2 4 .3m5 .4 4 .3m5 .5 3 .5" stroke="#e4e9cf" stroke-width="1"/>
  </g>
  <g class="garden-sleep-cat" stroke="#a4aa98" stroke-linejoin="round" stroke-linecap="round">
    <ellipse cx="412" cy="280" rx="31" ry="3" fill="#7f946f" opacity=".12" stroke="none"/>
    <g class="sleep-breathe garden-sleep-body">
      <path d="M389 269c0-16 13-28 29-28 19 0 28 14 25 27-2 10-11 12-27 12l-27-3Z" fill="url(#garden-cat)" stroke-width="1.2"/>
      <path d="M421 247c9 2 14 10 12 17" stroke="#d3d9ca" stroke-width="1.1" opacity=".7"/>
      <path d="M402 250q8-6 17-5" stroke="#ffffff" stroke-width="1.4" opacity=".7"/>
    </g>
    <path d="M433 269c-7 6-20 8-29 4-6-3-9 3-5 6 9 6 30 4 37-2" fill="#f4f4eb" stroke-width="1.05"/>
    <!-- Ear roots sit behind the face; each ear turns around its own base. -->
    <g class="garden-sleep-ear garden-sleep-ear-near">
      <path d="M382 257c-3-5-5-15-1-17 5 1 11 7 13 13Z" fill="url(#garden-cat-face)" stroke-width="1.2"/>
      <path d="M383 245q1 4 4 6" stroke="#d7bcb7" stroke-width="1.7"/>
    </g>
    <g class="garden-sleep-ear garden-sleep-ear-far">
      <path d="M409 257c4-4 10-8 13-6 2 5-1 11-4 14Z" fill="url(#garden-cat-face)" stroke-width="1.2"/>
      <path d="M418 255q-2 3-4 4" stroke="#dbc2ba" stroke-width="1.5"/>
    </g>
    <g class="garden-sleep-face">
      <path d="M383 254c7-5 20-5 29 1 5 3 8 6 6 11 2 9-6 16-17 16-14 1-24-6-23-15 0-5 2-9 5-13Z" fill="url(#garden-cat-face)" stroke-width="1.25"/>
      <path d="M385 267q4 4 8 0m10 1q4 4 8 0" stroke="#7e8777" stroke-width="1.25"/>
      <path d="m397 271 2 1 2-1m-2 1v2m0 0-3 1m3-1 3 1" stroke="#b69e97" stroke-width="1"/>
      <path d="m385 273-7-1m7 4-6 1m30-3 7-1m-7 4 6 1" stroke="#abb29f" stroke-width=".65"/>
    </g>
  </g>
  <g class="garden-yarn" stroke="#a58e67" stroke-linecap="round">
    <path d="M350 295c2 12-1 23 1 36" stroke-width="1"/>
    <path d="M351 328c-7-1-10 5-7 10 2 5 10 7 14 2 4-5 0-12-7-12Z" fill="#d4ac80" stroke-width="1.1"/>
    <path d="m347 330 8 10m-11-5 10-4m-5 12 8-7" stroke="#ecd0a7" stroke-width=".8"/>
  </g>

  <!-- Warm stones curve into the garden, with grass returning between them. -->
  <g stroke="#aeb18c" stroke-linejoin="round" stroke-linecap="round">
    <path d="M-4 578c22-10 53-18 75-16l17 22-20 24c-31 8-50 7-73 1Z" fill="#9ca87f" opacity=".18" stroke="none"/>
    <path d="M-8 570c30-13 57-17 79-13l13 22-18 23c-30 8-51 7-74 0Z" fill="url(#garden-stone)" stroke-width="1.2"/>
    <path d="m6 574 30-8 24-1" stroke="#fff8e6" stroke-width="1.2"/>
    <path d="M103 539c23-10 48-15 70-10l13 15-18 21c-27 7-48 10-67 1Z" fill="#99a47a" opacity=".14" stroke="none"/>
    <path d="M101 534c24-11 48-15 70-10l13 16-18 20c-25 7-48 10-67 2Z" fill="url(#garden-stone)" stroke-width="1.15"/>
    <path d="m110 538 28-7 22 1" stroke="#faf4df" stroke-width="1"/>
    <path d="m203 503 46-10 21 11-9 20-47 9-19-13Z" fill="url(#garden-stone)" stroke-width="1.1"/>
    <path d="m210 507 27-6" stroke="#f7f1da" stroke-width="1.1"/>
    <path d="m283 476 35-6 18 10-11 15-38 2-11-11Z" fill="url(#garden-stone)" stroke-width="1"/>
    <path d="m307 440 28-2 13 10-12 12-31-2-8-10Z" fill="#e3ddc3" stroke-width="1"/>
  </g>
  <g stroke="#718b5e" stroke-width="1" stroke-linecap="round">${grass}</g>
  ${meadowDots}
  <g fill="#f4edbc" opacity=".46"><ellipse cx="201" cy="432" rx="30" ry="6"/><ellipse cx="135" cy="480" rx="22" ry="4"/><ellipse cx="383" cy="570" rx="34" ry="7"/><ellipse cx="290" cy="610" rx="21" ry="4"/></g>

  <!-- A well-used watering can on a small wood stool. -->
  <ellipse cx="528" cy="504" rx="36" ry="8" fill="#7c9163" opacity=".12"/>
  <g stroke="#8f815f" stroke-linecap="round" stroke-linejoin="round">
    <path d="m512 469-4 30m31-30 5 29" stroke-width="5"/><path d="m512 469-4 30m31-30 5 29" stroke="#c2a078" stroke-width="3"/>
    <path d="m506 465 34-2 5 7q-18 7-41 2Z" fill="#d9b88d" stroke-width="1.25"/>
    <path d="m510 468 26-1" stroke="#f1d6ab" stroke-width="1"/>
    <path d="M516 438q-1-12 10-13 12-2 13 12" stroke="#7d9477" stroke-width="3.5"/>
    <path d="M516 438q-1-12 10-13 12-2 13 12" stroke="#b7c9a3" stroke-width="1.1"/>
    <path d="M515 437q12-5 26-1l-2 24q-13 5-25 0Z" fill="#a4b79a" stroke="#819476" stroke-width="1.25"/>
    <path d="m515 445-16-10-4 3 19 18Z" fill="#a4b79a" stroke="#819476" stroke-width="1.1"/>
    <path d="m494 434 4-3 4 5-5 4Z" fill="#c1ceb0" stroke="#819476" stroke-width=".9"/>
    <path d="M519 441v14" stroke="#d7dfc2" stroke-width="1.5" opacity=".65"/>
    <path d="M515 438q13 3 25-1" stroke="#d7dfc2" stroke-width="1"/>
  </g>

  <!-- Stems animate as whole plants so roots stay attached. -->
  <g class="plant-sway">${sprig(63, 455, .88, -25)}${sprig(81, 456, 1.05, 7, '#a5b78a')}${sprig(96, 458, .7, 28)}</g>
  <g class="plant-sway" style="animation-delay:-4.2s">${sprig(586, 500, 1.15, -22, '#80986e')}${sprig(602, 504, 1.35, 8)}${sprig(626, 509, 1, 35, '#a1b284')}</g>
  <g class="plant-sway" style="animation-delay:-7.1s">${sprig(690, 537, 1.5, -33, '#6f8a65')}${sprig(713, 541, 1.8, -4, '#8aa475')}${sprig(730, 542, 1.2, 23, '#a9b98a')}</g>
  <g>${flowers}</g>
  <g class="plant-sway" style="animation-delay:-2.6s">
    ${sprig(671, 657, 1.52, -38, '#6e8861')}${sprig(687, 661, 1.75, -5, '#80996b')}${sprig(712, 666, 1.8, 26, '#97aa7a')}
    ${sprig(486, 657, 1.06, -31, '#8ea375')}${sprig(506, 659, 1.2, 11, '#a4b588')}
  </g>
  <g fill="#f1e4b7" opacity=".8"><path d="M242 571c4-3 8-3 11-1-4 3-7 4-11 1Zm176-41c3-4 7-5 10-3-3 4-6 5-10 3Zm-232 68c4-1 7 0 9 3-4 1-7 0-9-3Z"/></g>
  <g class="butterfly" stroke-linecap="round" stroke-linejoin="round">
    <g class="butterfly-wing"><path d="M245 333c-5-12-16-11-16-4 0 5 5 8 12 9-10-2-14 6-7 9 5 1 8-3 11-9Z" fill="#f3e7bb" stroke="#c9ba8e" stroke-width=".85"/><path d="M245 333c4-12 14-13 16-6 2 5-4 9-12 11 11-3 15 5 9 8-6 3-10-2-13-8Z" fill="#fff2d1" stroke="#c9ba8e" stroke-width=".85"/></g>
    <path d="m245 332 1 9m-1-9-3-4m3 4 2-5" stroke="#a8956e" stroke-width="1"/>
  </g>
  <g class="weather-rain-only weather-garden-rain" clip-path="url(#garden-weather-clip)" aria-hidden="true">
    <g stroke="#eff7ed" stroke-width="1.4" stroke-linecap="round" opacity=".64">${Array.from({ length: 52 }, (_, i) => { const x = 18 + variation(i + 1240) * 690, y = 18 + variation(i + 1350) * 590; return `<path class="weather-raindrop" style="animation-delay:-${(variation(i + 1450) * 1.7).toFixed(2)}s" d="m${x.toFixed(1)} ${y.toFixed(1)}-5 15"/>`; }).join('')}</g>
    <g fill="none" stroke="#eef4dc" stroke-width="1.3">${[[146,486],[254,584],[550,555],[620,456],[81,612],[464,524]].map(([x,y],i) => `<g transform="translate(${x} ${y})"><ellipse class="weather-ripple" rx="14" ry="3.8" style="animation-delay:-${(i * .43).toFixed(2)}s"/><ellipse rx="21" ry="5.5" opacity=".25"/></g>`).join('')}</g>
  </g>
  <g id="weather-paw-constellation" class="weather-paw-constellation" aria-hidden="true" stroke="#fceab6" stroke-linecap="round" stroke-linejoin="round">
    <path d="m240 207 9-28 20-15 29 1 23 18 9 27-19 21-50 1Z" fill="#f7e4a5" fill-opacity=".12" stroke-width="1.2" stroke-dasharray="3 5"/>
    <path d="M268 212c-14 13-4 22 13 16 18 7 29-4 14-17-9-10-18-11-27 1Z" fill="#ffe8aa" fill-opacity=".7" stroke-width=".8"/>
    <g fill="#f9edc4" stroke-width=".7"><ellipse cx="257" cy="195" rx="6" ry="9" transform="rotate(-24 257 195)"/><ellipse cx="274" cy="180" rx="6" ry="9" transform="rotate(-7 274 180)"/><ellipse cx="294" cy="182" rx="6" ry="9" transform="rotate(15 294 182)"/><ellipse cx="309" cy="197" rx="6" ry="9" transform="rotate(30 309 197)"/></g>
    <g fill="#fff7da" stroke="none"><circle cx="240" cy="207" r="2.6"/><circle cx="249" cy="179" r="2.6"/><circle cx="269" cy="164" r="2.6"/><circle cx="298" cy="165" r="2.6"/><circle cx="321" cy="183" r="2.6"/><circle cx="330" cy="210" r="2.6"/><circle cx="311" cy="231" r="2.6"/><circle cx="261" cy="232" r="2.6"/></g>
  </g>
</svg>`;
})();
