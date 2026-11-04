(() => {
  'use strict';

  // Deterministic, self-contained illustration: no network or rendering library is required.
  const leaf = (x, y, rotate, scale = 1, color = '#8d9e70') => `<path d="M0 0C-9-3-16-15-11-27C3-26 10-12 0 0Z" transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})" fill="${color}" stroke="#788364" stroke-width="1.1"/><path d="M0-2Q-4-12-10-24" transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})" fill="none" stroke="#c2c69c" stroke-width=".7" opacity=".6"/>`;
  const hangingLeaves = [[0,14,-51,.8],[-8,34,48,.9],[9,44,-68,.9],[-11,60,44,.8],[5,80,-70,.8],[-10,100,36,.75],[0,122,-56,.66],[1,141,30,.62],[26,17,-42,.9],[36,40,-60,.8],[26,63,46,.85],[40,80,-50,.75],[31,101,42,.6]]
    .map(([x,y,r,s],i) => leaf(576+x,102+y,r,s,['#93a276','#7c9166','#a5b07a'][i%3])).join('');
  const plankGrain = Array.from({length:9},(_,i) => {
    const y=432+i*18;
    return `<path d="M${66-i*2} ${y}Q218 ${y-2} 344 ${y+1}T${678+i*2} ${y-1}" stroke="#9f7e58" stroke-width=".9" opacity=".3"/><path d="M${96+(i%3)*57} ${y+7}q35-3 74 0m${85+(i%2)*31} 1q40 2 88-1" stroke="#f9e4bb" stroke-width="1" opacity=".5"/>`;
  }).join('');

  window.ruiruiRoomArt = `
<svg xmlns="http://www.w3.org/2000/svg" class="room-art" viewBox="0 0 720 650" fill="none" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="room-wall" x1="162" y1="135" x2="621" y2="430" gradientUnits="userSpaceOnUse"><stop stop-color="#faf5e5"/><stop offset="1" stop-color="#e8dfc7"/></linearGradient>
    <linearGradient id="room-wood" x1="167" y1="91" x2="172" y2="149" gradientUnits="userSpaceOnUse"><stop stop-color="#d7b586"/><stop offset=".48" stop-color="#c39a67"/><stop offset="1" stop-color="#b38b5e"/></linearGradient>
    <linearGradient id="room-deck" x1="340" y1="415" x2="352" y2="608" gradientUnits="userSpaceOnUse"><stop stop-color="#dfbf91"/><stop offset="1" stop-color="#c9a274"/></linearGradient>
    <linearGradient id="room-window-sky" x1="180" y1="172" x2="195" y2="340" gradientUnits="userSpaceOnUse"><stop stop-color="#dae9df"/><stop offset="1" stop-color="#f4edd2"/></linearGradient>
    <linearGradient id="room-linen" x1="108" y1="190" x2="149" y2="205" gradientUnits="userSpaceOnUse"><stop stop-color="#fffbee"/><stop offset=".45" stop-color="#eee6d1"/><stop offset="1" stop-color="#fcf8e9"/></linearGradient>
    <linearGradient id="room-leaf-sage" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#afbd8e"/><stop offset="1" stop-color="#849c73"/></linearGradient>
    <linearGradient id="room-leaf-light" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c0ca9c"/><stop offset="1" stop-color="#98ac7d"/></linearGradient>
    <linearGradient id="room-desktop" x1="494" y1="383" x2="502" y2="413" gradientUnits="userSpaceOnUse"><stop stop-color="#e1be8c"/><stop offset="1" stop-color="#bf9364"/></linearGradient>
    <linearGradient id="room-monitor" x1="448" y1="289" x2="573" y2="373" gradientUnits="userSpaceOnUse"><stop stop-color="#6f7766"/><stop offset="1" stop-color="#505b50"/></linearGradient>
    <linearGradient id="room-screen" x1="466" y1="302" x2="555" y2="357" gradientUnits="userSpaceOnUse"><stop stop-color="#f5f7e8"/><stop offset="1" stop-color="#d8e6cf"/></linearGradient>
    <linearGradient id="room-cat-coat" x1="479" y1="403" x2="549" y2="477" gradientUnits="userSpaceOnUse"><stop stop-color="#474a41"/><stop offset="1" stop-color="#303730"/></linearGradient>
    <linearGradient id="room-cat-head" x1="486" y1="361" x2="539" y2="408" gradientUnits="userSpaceOnUse"><stop stop-color="#484b43"/><stop offset="1" stop-color="#343b34"/></linearGradient>
    <radialGradient id="room-lamp-light"><stop stop-color="#ffe9ad" stop-opacity=".65"/><stop offset="1" stop-color="#ffe9ad" stop-opacity="0"/></radialGradient>
    <filter id="room-paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".055"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter>
    <pattern id="room-rug-weave" width="9" height="7" patternUnits="userSpaceOnUse"><path d="M0 1h9M2 0v7" stroke="#b8bd94" stroke-width=".6" opacity=".35"/></pattern>
    <clipPath id="room-wall-clip"><path d="M56 91H693V429H57Z"/></clipPath>
    <clipPath id="room-weather-window-clip"><path d="M112 174h157v163H112Z"/></clipPath>
    <linearGradient id="room-night-window" x1="190" y1="174" x2="190" y2="337" gradientUnits="userSpaceOnUse"><stop stop-color="#56677b"/><stop offset="1" stop-color="#879990"/></linearGradient>
    <radialGradient id="room-night-lamp"><stop stop-color="#ffdc8a" stop-opacity=".8"/><stop offset=".52" stop-color="#ffe9ac" stop-opacity=".35"/><stop offset="1" stop-color="#ffe9ac" stop-opacity="0"/></radialGradient>
  </defs>

  <g stroke="#786b53" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">
    <!-- A shallow timber eave leaves the room open to the courtyard and the sky. -->
    <path d="M42 91Q349 87 695 92L694 429H55Z" fill="url(#room-wall)" stroke="none"/>
    <g clip-path="url(#room-wall-clip)" stroke="none">
      <path class="weather-sunlight" d="m113 171 133 4 272 254H289Z" fill="#fff9de" opacity=".52"/>
      <path class="weather-sunlight" d="m193 177 36-1 263 253h-69Z" fill="#fffdf0" opacity=".43"/>
      <path d="M72 114q129 8 224-1t211 4 188-5v15q-149 3-294-2t-329 3Z" fill="#a8916d" opacity=".09"/>
      <path d="m341 255 29-6 13 6-4 8-31 1Zm243-95 49-4 12 10-8 5-52-3ZM84 359l19-4 8 8-4 4-23-2Z" fill="#d2c8aa" opacity=".18"/>
    </g>
    <path d="M54 413q299 2 639 0v17H54Z" fill="#c6ab80"/>
    <path d="M62 416q300 1 622 0" stroke="#f3ddb5" opacity=".75"/>
    <path d="M48 82Q342 75 704 82l-8 29Q359 107 50 115Z" fill="url(#room-wood)"/>
    <path d="M49 87q300-6 651 0M53 104q235-5 630 0" stroke="#e7c99a" stroke-width="1.1" opacity=".7"/>
    <path d="M93 95q99-4 174-1m45 0q39 3 80 0m67 2q73-4 155 0" stroke="#96764f" stroke-width=".8" opacity=".55"/>
    <path d="M29 76Q361 67 714 75l-11 12Q361 81 36 91Z" fill="#a8b38c"/>
    <path d="M39 78q330-7 660-1" stroke="#cbd0a8" opacity=".8"/>
    <path d="M54 112h22v321H54Z" fill="#c6a272"/>
    <path d="M60 118q-2 103 1 183t-1 116m10-286q-4 53 0 86" stroke="#ecd0a3" opacity=".65"/>
    <path d="M77 113h62q-46 10-62 66Z" fill="#bfa076"/>
    <path d="M82 119h32q-21 11-32 37" stroke="#e3c79b"/>
    <circle cx="64" cy="125" r="2" fill="#9b805d" stroke="none"/>

    <!-- Linen, pale hills, and the softened light of an open window. -->
    <path d="M104 166q76-3 174 0l-1 180-172 1Z" fill="#b89e77"/>
    <path d="M112 174h157v163H112Z" fill="url(#room-window-sky)" stroke="#a8916e"/>
    <path d="M113 281q28-41 56-24 27-35 60-12 16-12 39 3v89H113Z" fill="#b8c5a2" stroke="none"/>
    <path d="M113 301q41-29 75-10 34-25 81-13v59H113Z" fill="#ced5b1" stroke="none"/>
    <path d="M121 211q17-15 33-6 8-20 30-11 15-3 23 12-43 5-86 5Z" fill="#fffdf0" stroke="none" opacity=".85"/>
    <g clip-path="url(#room-weather-window-clip)" stroke="none" aria-hidden="true">
      <g class="weather-night-only">
        <path d="M112 174h157v163H112Z" fill="url(#room-night-window)"/>
        <path d="M112 290q29-28 57-13 32-29 63-6 19-13 37-1v67H112Z" fill="#6a837b"/>
        <path d="M112 311q43-29 77-10 38-19 80-11v47H112Z" fill="#859b88"/>
        <path d="M227 193a14 14 0 1 0 13 22 17 17 0 0 1-13-22Z" fill="#f7e8b0"/>
        <g fill="#fbf0cb"><circle cx="155" cy="196" r="1.5"/><circle cx="204" cy="225" r="1.2"/><circle cx="247" cy="242" r="1.2"/><path d="m174 219 1.2 3.3 3.3 1.2-3.3 1.2-1.2 3.3-1.2-3.3-3.3-1.2 3.3-1.2Z"/></g>
      </g>
      <g class="weather-rain-only">
        <path d="M112 174h157v163H112Z" fill="#8caaa9" opacity=".36"/>
        <path d="M111 201q20-23 44-8 17-29 43-12 24-13 42 7 28-10 43 18Z" fill="#d4dfdb"/>
        <g class="window-rain-streaks" stroke="#eef6ef" stroke-width="1.8" stroke-linecap="round" opacity=".76"><path d="m145 188-6 18m29 10-7 22m41-49-6 17m35 35-8 24m-48-10-7 21m-32-35-7 20m86 23-6 18m-52-5-7 22m72-104-5 15m-12 99-4 13"/></g>
        <path d="m148 276 2 6q0 5-4 4t2-10m76-48 2 6q0 5-4 4t2-10" fill="#edf3ec" opacity=".8"/>
      </g>
    </g>
    <path d="M187 174v162m-74-84h154" stroke="#cfb78e" stroke-width="5"/>
    <path d="M185 175v159m-70-84h149" stroke="#f0dcb5" stroke-width="1.2"/>
    <path d="m123 187 30 23m-31-10 17 13m72 64 35 27" stroke="#fffef2" opacity=".55" stroke-width="2"/>
    <path d="M98 343q87-2 188-1l-1 9-187 2Z" fill="#d1b486"/>
    <path d="M101 345q91-1 180-1" stroke="#f8e4bd"/>
    <path d="M98 159h185" stroke="#8d856b" stroke-width="3"/>
    <circle cx="96" cy="159" r="3.2" fill="#b1a17d"/><circle cx="285" cy="159" r="3.2" fill="#b1a17d"/>
    <g class="curtain-sway">
      <path d="M108 163q-8 67-3 139 15 10 36 3-11-67-1-142Z" fill="url(#room-linen)" stroke="#c5baa0" stroke-width="1"/>
      <path d="M115 170q-5 59-2 126m10-126q-4 66 4 129m8-127q-5 48 0 92" stroke="#d7cbb0" stroke-width=".8"/>
      <path d="M107 293q13 5 30 0" stroke="#b9bd98" stroke-width="3"/>
    </g>
    <g class="curtain-sway curtain-sway-late">
      <path d="M250 163q9 67-1 139 16 8 28 0 4-76-3-139Z" fill="url(#room-linen)" stroke="#c5baa0" stroke-width="1"/>
      <path d="M258 171q5 59-2 123m9-122q4 65 3 124" stroke="#d7cbb0" stroke-width=".8"/>
      <path d="M252 292q10 4 23 0" stroke="#b9bd98" stroke-width="3"/>
    </g>

    <!-- Everyday objects: books, a tiny portrait, and a trailing pothos. -->
    <path d="M318 174h291v10H318Z" fill="#d2b084"/>
    <path d="M316 172q143-2 296 0v6H317Z" fill="#dfc196"/>
    <path d="M333 183v17q13-4 20-17m224 0v17q13-4 20-17" fill="#bd9b70"/>
    <path d="M341 135h13v36h-13Z" fill="#a8b395"/><path d="M355 127h12v44h-12Z" fill="#e1c29e"/>
    <path d="m371 136 12-2 6 36-13 2Z" fill="#b9ba92"/>
    <path d="M346 140v20m13-27h4m-4 31h4m14-23 4 22" stroke="#f9efd6" stroke-width="1"/>
    <path d="M408 171v-50l39-2 2 52Z" fill="#ba9e76"/>
    <path d="m414 126 27-1 1 39-28 1Z" fill="#edf0d9" stroke="#d8c5a0"/>
    <path d="M421 147q-4-5-2-10l6 5q4-1 7 0l5-5q2 5-1 11 3 10-7 10t-8-11Z" fill="#5f6a52" stroke="none"/>
    <circle cx="425" cy="148" r="1" fill="#d4c798" stroke="none"/><circle cx="432" cy="148" r="1" fill="#d4c798" stroke="none"/>
    <path d="M466 159q0-8 12-8t12 8v9q-12 5-24 0Z" fill="#ece6cb"/>
    <path d="M477 151q-8-17-3-30m5 28q11-12 11-25" stroke="#7b8e68"/>
    ${leaf(476,140,-44,.6,'#9caa7e')}${leaf(480,139,52,.6,'#aab38a')}
    <path d="M554 125q6-27 25-27t25 27" stroke="#aea388" stroke-width="1"/>
    <path d="M550 124q28 7 58 0l-6 29q-23 8-46 0Z" fill="#d3bd93"/>
    <path d="M555 133q25 6 48 0m-46 8q22 5 44 0m-41-14 3 23m11-22v25m10-24-1 24m11-26-3 24" stroke="#b3a17c" stroke-width=".8" opacity=".7"/>
    <g class="plant-sway plant-sway-late">
      <path d="M575 107q-14 36-3 68t-1 75m34-132q-7 24 0 49t0 39" stroke="#7d8c67"/>
      ${hangingLeaves}
    </g>

    <!-- A linen noticeboard, with paper edges catching the sun. -->
    <path d="m313 215 87-2 3 85-88 3Z" fill="#d3c2a0" stroke="#b5a17c"/>
    <path d="m321 222 70-1 3 72-72 2Z" fill="#e5d9bb" stroke-width=".7"/>
    <path d="m327 229 29-1 2 39-29 1Z" fill="#f9f4df" stroke="#d2c6aa" stroke-width=".7"/>
    <path d="m364 235 22 2-3 24-22-3Z" fill="#f2e9cd" stroke="#d2c6aa" stroke-width=".7"/>
    <path d="m333 239 16-1m-15 6h13m-13 6h9m-10 21 45 1m-45 6 27 1" stroke="#b0b298" stroke-width="1"/>
    <circle cx="341" cy="232" r="2" fill="#b99e7e" stroke="none"/><circle cx="374" cy="239" r="2" fill="#93a180" stroke="none"/>
    <path d="M365 253q4-10 12-6-3 9-12 6Z" fill="#b2bc92" stroke="none"/>

    <!-- Light, width, and fine irregular grain give the floor its material. -->
    <path d="M53 426H694l26 169Q388 626 21 596Z" fill="url(#room-deck)"/>
    <path d="M21 596q358 28 699-1v14q-360 30-697 0Z" fill="#b48b61"/>
    <path d="M25 598q342 28 691 0" stroke="#f4d7ac" opacity=".7"/>
    ${plankGrain}
    <path d="m231 431-8 18m179 0 3 18m-82 0-4 18m217 0 7 18m-334 0-6 18m223 0 5 18m-105 0-5 18m208 0 8 18" stroke="#9f7e58" stroke-width=".85" opacity=".36"/>
    <path d="m148 429 100-1 145 150-115 2Z" fill="#fff2c4" opacity=".24" stroke="none"/>
    <path d="M95 486q22-6 43-3m2 1 20 1m417 77q16-4 30-1m-28 3q11-3 24 0" stroke="#9f7e58" stroke-width=".85" opacity=".35"/>

    <!-- A low sage cabinet, a ceramic pot, and a woven basket. -->
    <ellipse cx="160" cy="505" rx="91" ry="11" fill="#927c59" opacity=".12" stroke="none"/>
    <path d="m93 393 140-3-1 106-139 2Z" fill="#a6b190"/>
    <path d="M91 389q68-2 144 0v10H91Z" fill="#c8ba94"/>
    <path d="m99 402 61-1v84l-61 1Zm69-1 57-1v84l-57 1Z" fill="#b4bea0" stroke="#879778" stroke-width="1"/>
    <path d="M105 408v71m69-72v71" stroke="#d2d6b6" stroke-width="1"/>
    <path d="M99 498v9m124-9v9" stroke="#a58e69" stroke-width="5"/>
    <path d="M148 439v11m32-11v11" stroke="#807b60" stroke-width="2"/>
    <path d="M116 371q22 5 44 0l-5 19q-17 5-33 0Z" fill="#ede8cf"/>
    <ellipse cx="138" cy="371" rx="22" ry="5" fill="#d6d2b5"/>
    <g class="plant-sway">
      <path d="M137 369q-4-16-1-33m1 33q12-16 13-25m-13 25q-18-8-22-20" stroke="#84936d"/>
      ${leaf(137,352,20,.85,'#a1ad80')}${leaf(134,360,-52,.8,'#82976d')}${leaf(146,354,55,.78,'#aab58a')}
    </g>
    <path d="M181 379h35v10h-35Z" fill="#d2ad87"/><path d="M178 371h35v8h-35Z" fill="#eae2c6"/>
    <path d="M182 374h28m-26 8h29" stroke="#b9ae8f" stroke-width=".65"/>
    <path d="M264 449q30-6 55 0l-4 42q-23 10-46 1Z" fill="#d1ba8e"/>
    <path d="M267 449q0-22 24-22t25 21" stroke="#b09b75" stroke-width="3"/>
    <path d="M268 457q22 6 49 0m-48 8q21 6 47 0m-45 8q19 6 45 0m-44 8q18 6 43 0m-40-29 3 39m8-38 1 39m9-38v39m9-39-2 38" stroke="#b9a27b" stroke-width=".8"/>
    <path d="M273 444q5-10 10-7 8-10 14-2 12-2 15 10" fill="#eee4c5" stroke="#c7ba9a" stroke-width="1"/>

    <!-- A handmade rug sits underneath the chair, away from the walking route. -->
    <path d="M366 521q38-26 133-27 104-2 148 30 17 17-21 35-42 18-128 17-88 1-129-19-28-14-3-36Z" fill="#f2ecd7" stroke="#c9bb95" stroke-width="1.5"/>
    <path d="M379 524q41-23 123-23 95 0 130 26 12 13-19 26-42 16-112 15-86 0-122-16-24-12 0-28Z" fill="url(#room-rug-weave)" stroke="#aeb68d" stroke-width="5" opacity=".7"/>
    <path d="M359 532l-8 1m9 7-8 2m13 5-8 3m16 4-7 4m278-13 8 2m-13 5 8 3m-18 3 7 4" stroke="#e9dfc4" stroke-width="2"/>

    <!-- The desk retains its quiet everyday scale. -->
    <ellipse cx="511" cy="498" rx="150" ry="16" fill="#8c795a" opacity=".09" stroke="none"/>
    <path d="m362 412-9 92 13 2 11-95m239-1 8 95 13-1-6-95" fill="#ba976b"/>
    <path d="M377 415h246v20H377Z" fill="#c3a075"/>
    <path d="M569 425h53v61l-53 1Z" fill="#d1b68d"/>
    <path d="M575 431h41v19h-41Zm0 25h41v24h-41Z" fill="#e5ceb0" stroke-width="1"/>
    <path d="M591 440h10m-10 26h10" stroke="#a89977" stroke-width="2"/>
    <path d="M350 390q147-3 291 0l14 17q-147 6-308 1Z" fill="url(#room-desktop)"/>
    <path d="M347 408q153 5 308-1v8q-154 6-308 0Z" fill="#c39b6d"/>
    <path d="M351 409q148 4 298-1" stroke="#f3d5a9"/>
    <path d="M365 397q53-2 96 0m118-1 50 1m-262 7 58 1m174-3 33 1" stroke="#a78056" stroke-width=".65" opacity=".5"/>
    <path d="M360 423q-1 40-5 66m276-63 3 62" stroke="#e2c198" stroke-width=".8"/>

    <!-- The lamp's light is reflected in the wood rather than drawn as hard rays. -->
    <g class="weather-night-only" stroke="none"><ellipse cx="423" cy="367" rx="107" ry="77" fill="url(#room-night-lamp)"/><path d="m395 315 42 5 40 81q-54 14-109-1Z" fill="#ffe3a0" opacity=".11"/></g>
    <ellipse cx="412" cy="377" rx="65" ry="38" fill="url(#room-lamp-light)" stroke="none"/>
    <path d="M370 395q-5-9 8-12 18-3 24 5l-1 7Z" fill="#8e9e7c"/>
    <path d="m386 384-8-56 35-28" stroke="#75866a" stroke-width="6"/>
    <path d="m386 383-8-55 35-28" stroke="#bac2a0" stroke-width="1.5"/>
    <circle cx="378" cy="328" r="4" fill="#a5b293" stroke="#7d896e"/>
    <path d="M400 293q13-9 26 4l13 24q-23 4-46-8Z" fill="#98a783"/>
    <path d="M395 313q17-3 42 8-21 6-42-8Z" fill="#f8e5ae" stroke="#a0a280" stroke-width="1"/>
    <path d="M403 294q8-3 14 3" stroke="#c3c9a7" stroke-width="1.4"/>

    <!-- The small screen has a real composition: sidebar, landscape, and file cards. -->
    <path d="M491 363v21l-15 6q29 4 57 0l-15-6v-21Z" fill="#a0a78d"/>
    <path d="M447 291q0-6 7-6l116 1q7 0 7 7l-2 70q0 7-7 7l-113-1q-8 0-8-7Z" fill="url(#room-monitor)"/>
    <path d="M454 293h115l-1 66-113 1Z" fill="url(#room-screen)" stroke="#a9b697" stroke-width=".8"/>
    <g class="screen-glow" stroke="none">
      <path d="M458 297h107v59H458Z" fill="#eef3df"/>
      <path d="M458 297h107v7H458Z" fill="#e2e8d2"/>
      <circle cx="462" cy="300.5" r="1.1" fill="#d2b28a"/><circle cx="466" cy="300.5" r="1.1" fill="#c5c49c"/><circle cx="470" cy="300.5" r="1.1" fill="#9cab88"/>
      <path d="M459 307h18v47h-18Z" fill="#dde7cc"/>
      <path d="M462 311h11v6h-11Zm0 11h8v2h-8Zm0 7h10v2h-10Zm0 7h8v2h-8Z" fill="#a4b591"/>
      <path d="M481 307h49v30h-49Z" fill="#d6e2cc"/>
      <path d="m481 329 12-13 12 11 7-8 18 15v3h-49Z" fill="#a9bd96"/>
      <path d="m481 334 15-7 15 8 10-5 9 5v2h-49Z" fill="#c2cfaa"/>
      <path d="M481 342h22v10h-22Zm27 0h22v10h-22Z" fill="#e2d8b9"/>
      <path d="M536 309h23v3h-23Zm0 8h20v2h-20Zm0 6h23v2h-23Zm0 6h15v2h-15Zm0 14h22v8h-22Z" fill="#b8c5a2"/>
    </g>
    <circle cx="510" cy="365" r="1.5" fill="#b9c4a4" stroke="none"/>
    <path d="m468 383 76 1 12 12-96-1Z" fill="#f2e6cc" stroke="#b8ad8e" stroke-width="1"/>
    <path d="m472 386 69 1m-72 3 76 1m-68-6 2 6m9-6 2 6m9-6 2 6m9-6 2 6m9-6 2 6m9-6 2 6m-39 1h25" stroke="#c6bca0" stroke-width=".8"/>
    <path d="M560 388q-2-8 5-8t7 8q-6 3-12 0Z" fill="#e6dfc8" stroke="#bab79d" stroke-width=".8"/>

    <!-- Ceramic tea and a restrained, independently drifting wisp. -->
    <ellipse cx="604" cy="394" rx="19" ry="4" fill="#a58d66" opacity=".15" stroke="none"/>
    <path d="M591 370q10 3 21 0l-2 21q-8 5-16 0Z" fill="#f5ecd4"/>
    <path d="M612 374q13-1 9 9-2 5-10 3" stroke="#cbbd9b" stroke-width="3"/>
    <ellipse cx="601" cy="370" rx="10" ry="3" fill="#b69c79" stroke="#d8c5a1" stroke-width="1.7"/>
    <path d="M598 379q4-4 7 0-3 6-7 0Z" fill="#a3b08a" stroke="none"/>
    <g class="steam-wisp" stroke="#fff9e8" stroke-width="2.3" opacity=".65"><path d="M598 363c-8-7 5-10 0-18m9 16c6-7-5-10 0-16"/></g>

    <!-- Chair legs and seat come first, so the cat's weight rests on the cushion. -->
    <ellipse cx="517" cy="529" rx="63" ry="11" fill="#7e795e" opacity=".12" stroke="none"/>
    <path d="m479 468-14 66 9 2 18-67m57-1 15 67 9-2-11-68" fill="#b99a70"/>
    <path d="m483 491 69-1" stroke="#baa17a" stroke-width="5"/>
    <path d="m481 493 71-1" stroke="#e4cba4" stroke-width="1"/>
    <path d="M470 466q43-9 92 0v11q-43 12-92 0Z" fill="#c2a277"/>
    <path d="M470 462q44-9 91 0v8q-43 10-91 0Z" fill="#c3cba7"/>
    <path d="M476 466q39 7 78 0" stroke="#e9e8ca" stroke-width="1.2"/>
    <path d="M480 459q35-5 71 0" stroke="#a9b18d" stroke-width=".7"/>

    <!-- In this rear view, the head and shoulders naturally hide the forelegs. -->
    <g class="cat-paw cat-paw-far">
      <path d="M520 417c6-4 10-12 10-20l-2-3q-5-2-9 0l-2 7-2 12Z" fill="#3e453a" stroke="#3b4237" stroke-width="1.1"/>
    </g>
    <g class="cat-tail">
      <path d="M543 461c20 4 26 18 28 33 2 11 8 16 17 13 7-2 9-8 6-12" stroke="#353c33" stroke-width="9"/>
      <path d="M545 461c19 5 25 19 27 33 2 9 7 13 13 12" stroke="#646a56" stroke-width="1.1" opacity=".55"/>
    </g>
    <g class="cat-body">
      <path d="M495 406c-12 9-14 22-14 37-8 14-9 25 3 31 13 7 42 8 57 2 13-5 14-15 8-28-4-13-7-31-20-40-9-4-23-4-34-2Z" fill="url(#room-cat-coat)" stroke="#3e4338" stroke-width="1.3"/>
      <path d="M531 419c7 13 7 24 12 36 3 6 3 12-2 16" stroke="#69705b" stroke-width="1.5" opacity=".45"/>
      <path d="M484 456q1-9 7-15" stroke="#737760" stroke-width="1.2" opacity=".35"/>
      <path d="M499 416q-6 9-6 17" stroke="#81836a" stroke-width="1" opacity=".28"/>
      <g class="cat-paw cat-paw-near">
        <path d="M497 420c-5-3-8-9-8-15l-1-8q4-5 10-2l2 10 2 10Z" fill="#41473c" stroke="none"/>
      </g>
      <g class="cat-head">
        <g class="cat-ear cat-ear-near"><path d="M483 375c-4-7-5-20-1-23 5-1 12 9 16 15Z" fill="#45493f" stroke="#3e4439" stroke-width="1.3"/><path d="m484 358 6 11" stroke="#797b62" stroke-width="1" opacity=".6"/></g>
        <g class="cat-ear cat-ear-far"><path d="M524 365c5-7 11-12 15-10 3 5 3 16-1 23Z" fill="#3c4339" stroke="#3b4237" stroke-width="1.3"/><path d="m535 360-4 9" stroke="#797b62" stroke-width="1" opacity=".4"/></g>
        <path d="M484 371c12-9 31-11 45-4 11 6 17 16 13 28-3 12-14 19-30 19-18 0-31-7-33-20-1-9 1-17 5-23Z" fill="url(#room-cat-head)" stroke="#3e4439" stroke-width="1.25"/>
        <path d="M490 374q13-7 26-4" stroke="#787c64" stroke-width="1.2" opacity=".35"/>
        <path d="M537 386q3 6-1 11" stroke="#6b725c" stroke-width="1.1" opacity=".5"/>
        <path d="m481 391-3 1m61 10 4 1" stroke="#59614f" stroke-width=".8"/>
      </g>
    </g>
    <!-- The back rail overlaps the lower back, attaching the silhouette to its chair. -->
    <path d="M473 439q41-8 86 0l-2 24q-42 8-81 0Z" fill="#d0ac78" stroke-width="1.4"/>
    <path d="M478 443q37-6 76-1" stroke="#edd1a2" stroke-width="1.2"/>
    <path d="M482 454q14-2 28-1m18 0 20-1" stroke="#a1845c" stroke-width=".8" opacity=".5"/>
    <path d="m481 461-2 37m72-37 4 37" stroke="#ad8e63" stroke-width="7"/>
    <path d="m481 461-2 37m72-37 4 37" stroke="#e0c18f" stroke-width="2"/>
    <path d="M507 452q-2-4 0-7l4 3q4-1 8 0l4-3q2 4 0 7 1 7-8 7t-8-7Z" fill="#aa926a" stroke="none" opacity=".4"/>

    <!-- A leafy threshold, with a hanging bell catching an occasional breeze. -->
    <path d="M632 379q20 4 39 0l-5 41q-14 6-28 0Z" fill="#d5bb91"/>
    <path d="M643 390v23m11-22v24m9-26-2 23" stroke="#b6a17b" stroke-width=".75"/>
    <ellipse cx="651" cy="378" rx="18" ry="3.2" fill="#a6a17b" stroke="#b8ad86" stroke-width=".75"/>
    <g class="plant-sway desk-plant">
      <g stroke="#7f926b" stroke-width="1.3">
        <path d="M650 379C648 367 649 358 648 350C647 341 646 335 644 329C641 321 640 313 641 306C642 299 642 292 641 286"/>
        <path d="M648 350C656 344 660 339 663 335C667 326 670 317 670 309M644 329C633 322 622 318 615 310M648 350C640 344 632 336 626 330M641 306Q646 303 650 299"/>
      </g>
      <g class="desk-plant-leaves" stroke="#7f906b" stroke-width=".9">
        <path d="M641 286C632 282 631 269 637 258C648 264 652 277 641 286Z" fill="url(#room-leaf-sage)"/>
        <path d="M615 310C605 314 592 306 588 295C601 290 614 297 615 310Z" fill="url(#room-leaf-sage)"/>
        <path d="M626 330C615 335 603 329 598 319C611 314 623 319 626 330Z" fill="url(#room-leaf-light)"/>
        <path d="M650 299C648 290 656 281 668 278C672 288 663 299 650 299Z" fill="url(#room-leaf-light)"/>
        <path d="M670 309C666 298 678 282 690 279C693 292 685 307 670 309Z" fill="url(#room-leaf-light)"/>
        <path d="M663 335C663 324 676 315 686 314C688 325 676 336 663 335Z" fill="url(#room-leaf-sage)"/>
      </g>
      <g stroke="#d5dfb4" stroke-width=".7" opacity=".68">
        <path d="M641 286Q638 275 638 263M615 310Q604 302 592 297M626 330Q615 323 602 320M650 299Q660 291 665 282M670 309Q683 295 688 283M663 335Q675 324 683 317"/>
      </g>
    </g>
    <!-- The front rim overlaps the stems, keeping their roots inside the pot. -->
    <path d="M631 376q21 5 41 0v8q-20 5-40 0Z" fill="#e1cba4"/>
    <g class="wind-chime">
      <path d="M662 110v29" stroke="#a69d7b" stroke-width=".8"/>
      <path d="M650 150q-1-17 12-18 13 0 14 18Z" fill="#b4bd92"/>
      <path d="M649 150q14-4 28 0" stroke="#7d8b6c" stroke-width="1"/>
      <path d="M663 152v22" stroke="#ae9d78" stroke-width=".75"/>
      <path d="m657 171 13 2-3 29-13-3Z" fill="#f4e8c9" stroke="#c2b594" stroke-width=".8"/>
      <path d="m660 178 3 1-1 14" stroke="#97a47e" stroke-width="1.1"/>
      <path d="M657 138q-3 3-3 7" stroke="#dbe0b8"/>
    </g>

    <!-- Foreground leaves close the frame without hiding the room. -->
    <ellipse cx="27" cy="625" rx="15" ry="3.5" fill="#7f9267" opacity=".12" stroke="none"/>
    <g class="plant-sway foreground-plant" opacity=".92">
      <g stroke="#80946b" stroke-width="1.4">
        <path d="M26 624C28 614 34 601 38 590C39 586 40 582 41 578C43 568 45 560 48 553C53 541 61 528 70 520"/>
        <path d="M48 553C43 548 39 544 34 540M48 553C54 554 60 553 64 550M41 578C39 575 37 571 34 569"/>
      </g>
      <g class="foreground-plant-leaves" stroke="#82946e" stroke-width=".95">
        <path d="M70 520C65 511 73 500 82 495C87 506 81 519 70 520Z" fill="url(#room-leaf-light)"/>
        <path d="M34 540C22 543 10 533 7 521C20 520 33 528 34 540Z" fill="url(#room-leaf-sage)"/>
        <path d="M64 550C65 538 78 530 90 529C89 542 77 551 64 550Z" fill="url(#room-leaf-light)"/>
        <path d="M34 569C24 572 15 563 13 553C24 551 34 558 34 569Z" fill="url(#room-leaf-sage)"/>
      </g>
      <path d="M70 520Q77 508 81 499M34 540Q21 532 11 524M64 550Q78 540 87 532M34 569Q24 563 17 555" stroke="#d5dfb5" stroke-width=".7" opacity=".68"/>
    </g>
    <path d="M18 625q-2-9-7-14 9 4 12 12-1-12 4-20 2 10 0 19 5-9 14-11-6 6-9 14Z" fill="#a1b383" stroke="#8fa477" stroke-width=".7" opacity=".8"/>
    <path d="M53 92H694V429l26 166q-332 31-699 1l32-170Z" fill="#e9ddbc" opacity=".2" stroke="none" filter="url(#room-paper)" style="mix-blend-mode:multiply;pointer-events:none"/>
  </g>
</svg>`;
})();
