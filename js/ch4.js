'use strict';
/* =========================================================
   CAPÍTULO 4 — DEPRESSÃO: o labirinto de pensamentos intrusivos
   ========================================================= */
const NIGHT_W = 2000, NIGHT_FLOOR = 156;
const LAMPS = [100, 520, 940, 1360, 1780];
let _night = null;
function buildNight() {
  if (_night) return _night;
  const rng = srand(404);
  const sky = makeCanvas(W, H, (c) => {
    vgrad(c, 0, 0, W, H, ['#05060c', '#0b0e1c', '#161a2c', '#22243a'], 30);
    for (let i = 0; i < 40; i++) R(c, Math.floor(rng() * W), Math.floor(rng() * 70), 1, 1, rng() < .3 ? '#8a90b0' : '#4a5070');
    R(c, 260, 20, 10, 10, '#c8ccd8'); R(c, 262, 18, 6, 14, '#c8ccd8'); R(c, 258, 22, 14, 6, '#c8ccd8'); R(c, 263, 22, 3, 3, '#a8acb8');
  });
  const farW = W + Math.ceil((NIGHT_W - W) * .25) + 10;
  const far = makeCanvas(farW, H, (c) => {
    // morros da periferia com casinhas
    for (let x = 0; x < farW; x += 2) { const h = 50 + Math.sin(x / 70) * 14 + Math.sin(x / 23) * 4; R(c, x, H - h - 40, 2, h + 40, '#121626'); }
    for (let i = 0; i < 160; i++) {
      const x = Math.floor(rng() * farW), base = 140 - (50 + Math.sin(x / 70) * 14) + Math.floor(rng() * 50);
      const w = 6 + Math.floor(rng() * 8), h = 5 + Math.floor(rng() * 6);
      R(c, x, base - h, w, h, rng() < .5 ? '#1a1e30' : '#181b2a'); if (rng() < .25) R(c, x + 2, base - h + 2, 2, 2, rng() < .5 ? '#d8b86a' : '#6a7aa8');
    }
  });
  const main = makeCanvas(NIGHT_W, H, (c) => {
    // muros e casas
    let x = 0;
    while (x < NIGHT_W) {
      const w = 60 + Math.floor(rng() * 70), h = 40 + Math.floor(rng() * 30);
      const col = pick(['#262a38', '#2a2834', '#22283a', '#2c2c36']);
      R(c, x, NIGHT_FLOOR - h, w, h, col); R(c, x, NIGHT_FLOOR - h, w, 2, '#383c4c');
      dither(c, x, NIGHT_FLOOR - h + 2, w, h - 2, '#2e3242', 5);
      if (rng() < .7) { const wx = x + 10 + Math.floor(rng() * (w - 30)); R(c, wx, NIGHT_FLOOR - h + 10, 14, 12, '#141824'); R(c, wx + 6, NIGHT_FLOOR - h + 10, 1, 12, '#2a2e3a'); if (rng() < .3) R(c, wx + 1, NIGHT_FLOOR - h + 11, 5, 10, '#6a6440'); }
      if (rng() < .4) { const gx = x + 4; for (let k = 0; k < 6; k++) R(c, gx + k * 3, NIGHT_FLOOR - 22, 1, 22, '#4a4a52'); R(c, gx, NIGHT_FLOOR - 22, 18, 1, '#4a4a52'); }
      if (rng() < .45) { const t = pick(['SOCORRO', 'VENDE-SE', 'NAO HA VAGAS', 'ALUGA', 'DEUS E FIEL', 'FORA']); pixText(c, t, x + w / 2, NIGHT_FLOOR - h / 2, pick(['#5a3a4a', '#3a4a5a', '#4a3a5a']), 1, 'center'); }
      if (rng() < .3) { for (let k = 0; k < 4; k++) R(c, x + Math.floor(rng() * w), NIGHT_FLOOR - Math.floor(rng() * h), 1, 4 + Math.floor(rng() * 6), '#1a1c26'); }
      x += w;
    }
    // postes com fiação
    for (let px = 60; px < NIGHT_W; px += 140) { R(c, px, 40, 3, 116, '#1a1c26'); R(c, px - 8, 46, 19, 2, '#1a1c26'); }
    c.strokeStyle = '#141620'; c.lineWidth = 1;
    for (let px = 60; px < NIGHT_W - 140; px += 140) for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(px - 6 + k * 7, 47); c.quadraticCurveTo(px + 70, 60 + k * 2, px + 134 + k * 7, 47); c.stroke(); }
    // calçada rachada
    R(c, 0, NIGHT_FLOOR, NIGHT_W, 24, '#1e2028'); R(c, 0, NIGHT_FLOOR, NIGHT_W, 2, '#30323c');
    for (let px = 0; px < NIGHT_W; px += 22) R(c, px, NIGHT_FLOOR + 2, 1, 22, '#181a20');
    for (let i = 0; i < 80; i++) { const cx = Math.floor(rng() * NIGHT_W); R(c, cx, NIGHT_FLOOR + 3 + Math.floor(rng() * 15), 4 + Math.floor(rng() * 6), 1, '#16181e'); }
    for (let i = 0; i < 10; i++) { const px = Math.floor(rng() * NIGHT_W); R(c, px, NIGHT_FLOOR + 10, 24, 3, '#2a3048'); R(c, px + 4, NIGHT_FLOOR + 11, 10, 1, '#4a5478'); }
    // postes de luz (checkpoints)
    for (const lx of LAMPS) { R(c, lx, 70, 3, 86, '#2a2c36'); R(c, lx, 70, 16, 3, '#2a2c36'); R(c, lx + 12, 72, 8, 3, '#3a3c46'); }
    // portão de casa
    R(c, 1930, 96, 70, 60, '#2a2834'); R(c, 1946, 112, 30, 44, '#3a2a22');
    for (let k = 0; k < 8; k++) R(c, 1948 + k * 4, 112, 1, 44, '#5a3a2a');
    R(c, 1946, 112, 30, 2, '#6a4a32'); R(c, 1946, 132, 30, 1, '#6a4a32'); R(c, 1970, 132, 2, 3, '#8a6a4a');
    pixText(c, 'N 13', 1988, 104, '#5a5a6a', 1, 'center');
  });
  return (_night = { sky, far, main });
}
SCENES.c4_street = () => {
  const B = buildNight();
  const hero = new Hero(56, NIGHT_FLOOR - 24, LOOKS.mirangoNight); hero.speed = 56; hero.slump = 1; hero.frozen = true;
  const mA = heroActor(hero);
  const parts = new Parts();
  const solids = [{ x: -20, y: NIGHT_FLOOR, w: NIGHT_W + 40, h: 30 }];
  const HZ0 = [
    { t: 'trash', x: 230 }, { t: 'flyer', x: 340 }, { t: 'shadow', x: 460 }, { t: 'trash', x: 560 }, { t: 'email', trig: 600, high: false },
    { t: 'flyer', x: 700 }, { t: 'shadow', x: 820 }, { t: 'alarm', trig: 880, high: true }, { t: 'trash', x: 990 }, { t: 'trash', x: 1006 },
    { t: 'shadow', x: 1120 }, { t: 'email', trig: 1150, high: true }, { t: 'flyer', x: 1260 }, { t: 'flyer', x: 1296 }, { t: 'alarm', trig: 1340, high: false },
    { t: 'shadow', x: 1460 }, { t: 'trash', x: 1550 }, { t: 'email', trig: 1600, high: false }, { t: 'email', trig: 1640, high: true }, { t: 'shadow', x: 1720 },
    { t: 'alarm', trig: 1790, high: true }, { t: 'flyer', x: 1860 }
  ];
  let HZ = [];
  const resetHZ = (fromX) => { HZ = HZ0.map(h => Object.assign({}, h, { st: 0, t0: 0, fx: 0, used: (h.trig || h.x) < fromX - 10 })); };
  resetHZ(0);
  const proj = [];
  const sc = {
    cam: { x: 0, y: 0 }, music: 'night', amb: 'night', capY: 30, hero, botTarget: () => 1960, t: 0, san: 100, heavy: 0, cp: 56, lit: {}, busX: -20, collapsing: false, vig: .55, desat: .35, holdBlack: true, flashD: 0,
    enter() { this.script = new Script(this.intro()); },
    *intro() {
      G.fadeA = 1;
      yield titleCard('CAPÍTULO 4', 'DEPRESSÃO', 'O labirinto de pensamentos intrusivos');
      G.fadeA = 0; this.busX = -150; this.busV = 120;
      sfx('brake');
      yield Tk.until(() => sc.busX >= 0);
      this.busV = 0; sfx('door');
      yield .5;
      this.showHero = true;
      yield caption('O ônibus freia num ponto mal iluminado da periferia cinzenta.', { auto: 3 });
      this.busV = 40;
      yield caption('A ilusão da praia evaporou. Restou a vida real: sufocante.', { auto: 3 });
      yield think(mA, 'Só... chegar em casa.');
      Balloons.add(null, 'Pular: ' + Input.label('jump') + '  •  Agachar: ' + Input.label('down') + '  •  Esquivar: ' + Input.label('dash'), { type: 'caption', auto: 6, bottom: true });
      hero.frozen = false;
    },
    hit(src) {
      if (hero.inv > 0 || this.collapsing) return;
      hero.inv = 1.3; hero.stun = .35; hero.vx = -110; hero.vy = -70; hero.onGround = false;
      this.san = Math.max(0, this.san - 16); this.heavy = Math.min(.45, this.heavy + .07);
      sfx('hurt'); sfx('heart'); G.shake(4); this.flashD = .5;
      sayAuto(mA, pick(['...', 'Para.', 'Não pensa nisso.', 'De novo não...', 'Respira...']), 1.2, { type: 'thought' });
      if (this.san <= 0) this.script = new Script(this.collapse());
    },
    *collapse() {
      this.collapsing = true; hero.frozen = true; hero.vx = 0; hero.pose = { crouch: true, arms: 'face' };
      Music.muffle(400); sfx('heart');
      yield 1;
      yield caption('Mirango desaba de joelhos no meio da calçada.', { auto: 2.4 });
      yield think(mA, '...Levanta. Só mais um pouco.');
      yield fadeTo(1, .6);
      hero.x = this.cp - 4; hero.y = NIGHT_FLOOR - 24; hero.pose = {}; this.san = 60; this.heavy = .1; proj.length = 0; resetHZ(this.cp);
      this.cam.x = clamp(hero.cx - 120, 0, NIGHT_W - W);
      Music.muffle(18000);
      yield fadeTo(0, .6);
      hero.frozen = false; this.collapsing = false;
    },
    update(dt) {
      this.t += dt;
      if (this.script) { this.script.update(dt); if (this.script.done) this.script = null; }
      if (this.busV) this.busX += this.busV * dt;
      if (this.busV && this.busX > 0 && this.busV < 100 && this.busX < NIGHT_W) { if (Math.random() < .4) parts.add({ x: this.busX, y: 150, vx: -10, vy: -6, life: 1.5, col: '#222', type: 'smoke', s: 3 }); }
      if (!this.showHero) return;
      hero.update(dt, solids, { minX: 4, maxX: NIGHT_W - 4, parts, canDuck: true, canDash: true, upJump: true, speedMul: 1 - this.heavy, stride: 12, dust: '#3a3c46' });
      hero.slump = 1;
      // checkpoints nos postes
      for (const lx of LAMPS) if (hero.cx > lx && !this.lit[lx]) { this.lit[lx] = true; this.cp = lx + 8; if (lx > 100) { this.san = Math.min(100, this.san + 10); sayAuto(mA, 'Um pouco de luz.', 1.4, { type: 'thought' }); sfx('sparkle'); } }
      // perigos
      for (const h of HZ) {
        if (h.used) continue;
        if (h.t === 'trash') {
          if (overlap(hero, { x: h.x, y: NIGHT_FLOOR - 12, w: 14, h: 12 })) this.hit(h.x);
        } else if (h.t === 'flyer') {
          if (!h.st && hero.cx > h.x - 210) h.st = 1;
          if (h.st) { h.fx -= 16 * dt; h.t0 += dt; }
          const fx = h.x + h.fx, fy = 124 + Math.sin(h.t0 * 3) * 4;
          h.cx = fx; h.cy = fy;
          if (overlap(hero, { x: fx, y: fy, w: 11, h: 10 })) { this.hit(fx); h.used = true; parts.burst(fx + 5, fy + 5, 8, { col: ['#e8e8e0', '#d8d040'], min: 10, max: 40, g: 40 }); }
        } else if (h.t === 'shadow') {
          if (h.st === 0 && hero.cx > h.x - 92) { h.st = 1; h.t0 = 0; sfx('glitch'); }
          if (h.st > 0) h.t0 += dt;
          if (h.st === 1 && h.t0 > .55) { h.st = 2; h.t0 = 0; sfx('swoosh'); sayAuto({ x: h.x, y: NIGHT_FLOOR - 30, h: 30 }, pick(['VOCÊ É UM FRACASSO.', 'DESISTIU, É?', 'E AS CONTAS?', 'MEDÍOCRE.', 'QUEM VAI TE CONTRATAR?']), 1.4, { type: 'shout', fill: '#b0b8d0' }); }
          if (h.st === 2) {
            const ext = Math.min(1, h.t0 / .3) * (h.t0 > .9 ? Math.max(0, 1 - (h.t0 - .9) / .3) : 1);
            h.ext = ext;
            const fx = h.x - 12 - 70 * ext;
            if (ext > .2 && overlap(hero, { x: fx, y: 126, w: 70 * ext, h: 8 })) this.hit(h.x);
            if (h.t0 > 1.3) { h.st = 3; h.t0 = 0; }
          }
          if (h.st === 3 && h.t0 > .6) h.used = true;
        } else {
          if (!h.st && hero.cx > h.trig) { h.st = 1; h.t0 = 0; sfx(h.t === 'alarm' ? 'alarm' : 'email'); }
          if (h.st === 1) { h.t0 += dt; if (h.t0 > .8) { h.st = 2; proj.push({ k: h.t, x: this.cam.x + W + 10, y: h.high ? 122 : 142, vx: -150 }); h.used = true; } }
        }
      }
      for (const p of proj) {
        p.x += p.vx * dt;
        if (overlap(hero, { x: p.x, y: p.y, w: 18, h: 12 })) { p.dead = true; this.hit(p.x); }
        if (p.x < this.cam.x - 40) p.dead = true;
        if (Math.random() < .4) parts.add({ x: p.x + 18, y: p.y + rnd(2, 10), vx: 20, vy: 0, life: .3, col: p.k === 'alarm' ? '#d8a040' : '#8a9ac8' });
      }
      for (let i = proj.length - 1; i >= 0; i--) if (proj[i].dead) proj.splice(i, 1);
      this.flashD = Math.max(0, this.flashD - dt);
      this.vig = .5 + (1 - this.san / 100) * .35;
      Music.tempo = 1 + (1 - this.san / 100) * .5;
      parts.update(dt);
      // portão
      this.cur = !hero.frozen && Math.abs(hero.cx - 1960) < 18;
      if (this.cur && Input.pressed('a')) { hero.frozen = true; sfx('creak'); G.go('c4_house', { dur: .8 }); }
      const tx = clamp(hero.cx - W / 2 + 40, 0, NIGHT_W - W);
      this.cam.x = lerp(this.cam.x, tx, Math.min(1, dt * 4));
    },
    draw(c) {
      const cx = Math.round(this.cam.x);
      c.drawImage(B.sky, 0, 0);
      c.drawImage(B.far, -Math.round(cx * .25), 0);
      c.drawImage(B.main, -cx, 0);
      c.save(); c.translate(-cx, 0);
      // luz dos postes (fria, algumas piscando)
      c.globalCompositeOperation = 'lighter';
      LAMPS.forEach((lx, i) => {
        let a = .13; if (i % 2 === 1 && Math.sin(G.t * 17 + i) * Math.sin(G.t * 3.1) > .5) a = .02;
        lightCone(c, lx + 16, 75, 70, 81, '#a8c0ff', a);
        c.globalAlpha = a * 2; R(c, lx - 10, NIGHT_FLOOR, 56, 3, '#a8c0ff'); c.globalAlpha = 1;
      });
      c.globalCompositeOperation = 'source-over';
      for (const lx of LAMPS) R(c, lx + 12, 74, 8, 2, this.lit[lx] ? '#e8f0ff' : '#a8b8d8');
      if (this.busX > -140 && this.busX < NIGHT_W) drawBusSide(c, this.busX, NIGHT_FLOOR - 2, '#2a3a5a', true);
      // perigos
      for (const h of HZ) {
        if (h.used && h.t !== 'shadow') continue;
        if (h.t === 'trash') {
          R(c, h.x, NIGHT_FLOOR - 12, 14, 12, OUT); R(c, h.x + 1, NIGHT_FLOOR - 11, 12, 11, '#3a5a3a'); R(c, h.x - 2, NIGHT_FLOOR - 13, 18, 2, '#2a4a2a');
          R(c, h.x + 14, NIGHT_FLOOR - 3, 6, 3, '#6a6a5a'); R(c, h.x - 5, NIGHT_FLOOR - 2, 4, 2, '#8a7a5a');
          if (Math.floor(G.t * 8) % 2) { R(c, h.x + 4 + Math.sin(G.t * 9) * 4, NIGHT_FLOOR - 18, 1, 1, '#888'); R(c, h.x + 9 + Math.cos(G.t * 7) * 3, NIGHT_FLOOR - 20, 1, 1, '#888'); }
        } else if (h.t === 'flyer') {
          const x = Math.round(h.x + h.fx), y = Math.round(124 + Math.sin(h.t0 * 3) * 4);
          R(c, x - 1, y - 1, 13, 12, OUT); R(c, x, y, 11, 10, '#e8e4d0'); R(c, x, y, 11, 3, '#c43b3b'); pixText(c, 'VAGA', x + 6, y + 4, '#2a2a2a', 1, 'center');
        } else if (h.t === 'shadow') {
          if (h.used) continue;
          const x = h.x;
          if (h.st === 0) { c.globalAlpha = .75; drawPerson(c, x, NIGHT_FLOOR, LOOKS.chefe, { face: -1, mono: '#0a0b12', outline: '#0a0b12' }); c.globalAlpha = 1; }
          else {
            const grow = h.st === 1 ? Math.min(1, h.t0 / .55) : 1, fade = h.st === 3 ? Math.max(0, 1 - h.t0 / .6) : 1;
            c.globalAlpha = fade;
            const fw = Math.round(16 + 20 * grow), fh = Math.round(18 + 24 * grow), fx = x - fw / 2, fy = NIGHT_FLOOR - 30 - fh;
            R(c, fx - 1, fy - 1, fw + 2, fh + 2, '#05060a'); R(c, fx, fy, fw, fh, '#5a6070');
            R(c, fx + 3, fy + fh * .32, fw * .3, 3, '#05060a'); R(c, fx + fw * .58, fy + fh * .32, fw * .3, 3, '#05060a');
            R(c, fx + fw * .1, fy + fh * .25, fw * .35, 1, '#05060a'); R(c, fx + fw * .55, fy + fh * .22, fw * .35, 1, '#05060a');
            R(c, fx + fw * .3, fy + fh * .7, fw * .4, 2, '#05060a');
            R(c, x - 4, NIGHT_FLOOR - 30, 8, 30, '#0a0b12');
            if (h.st === 2 && h.ext) { const L = Math.round(70 * h.ext); R(c, x - 12 - L, 127, L, 6, '#05060a'); R(c, x - 12 - L + 1, 128, L - 1, 4, '#6a7080'); R(c, x - 14 - L, 128, 4, 3, '#6a7080'); }
            c.globalAlpha = 1;
          }
        }
      }
      for (const p of proj) {
        const x = Math.round(p.x), y = Math.round(p.y);
        if (p.k === 'email') iconMail(c, x, y, '#c8d0f0', 2);
        else { R(c, x - 1, y - 1, 18, 14, OUT); R(c, x + 2, y, 12, 12, '#d8a040'); R(c, x + 4, y + 2, 8, 8, '#f3efe6'); R(c, x + 7, y + 3, 1, 4, '#222'); R(c, x + 7, y + 6, 3, 1, '#222'); R(c, x, y - 1, 4, 3, '#d8a040'); R(c, x + 12, y - 1, 4, 3, '#d8a040'); }
      }
      if (this.showHero) hero.draw(c);
      parts.draw(c);
      c.restore();
      if (this.flashD > 0) { c.globalAlpha = this.flashD; R(c, 0, 0, W, H, '#000010'); c.globalAlpha = 1; }
      // avisos de projéteis entrando pela direita
      for (const h of HZ) if (h.st === 1 && (h.t === 'email' || h.t === 'alarm') && !h.used) { if (Math.floor(G.t * 10) % 2) { R(c, W - 10, h.high ? 120 : 140, 6, 14, '#ff5252'); pixText(c, '!', W - 7, h.high ? 124 : 144, '#fff', 1, 'center'); } }
    },
    ui(c) {
      if (this.showHero) hudBar(c, 6, 10, 80, 'SANIDADE', this.san / 100, '#8a9ad8', '#5a6aa8');
      if (this.cur) promptAt(c, 1960 - this.cam.x, 92, 'a', 'Abrir o portão');
      if (this.showHero && !hero.frozen) { const k = clamp(hero.cx / 1960, 0, 1); R(c, 100, 172, 120, 2, 'rgba(255,255,255,.15)'); R(c, 100 + 120 * k - 1, 170, 3, 6, '#d8323c'); T(c, 'casa', 224, 168, { f: FONT2, size: 8, col: '#8a90b0' }); }
    }
  };
  return sc;
};

/* ---------- Mini-game 2: Sufocado pelo Próprio Teto ---------- */
const HOUSE_W = 640, HOUSE_FLOOR = 150;
let _house = null;
function buildHouse() {
  if (_house) return _house;
  const rng = srand(13);
  _house = makeCanvas(HOUSE_W, H, (c) => {
    R(c, 0, 0, HOUSE_W, 26, '#0c0d14'); R(c, 0, 26, HOUSE_W, 2, '#1a1a22');
    vgrad(c, 0, 28, HOUSE_W, 122, ['#2a2c3a', '#22242e']);
    dither(c, 0, 28, HOUSE_W, 122, '#262836', 6);
    // descascados na parede
    for (let i = 0; i < 30; i++) R(c, Math.floor(rng() * HOUSE_W), 30 + Math.floor(rng() * 100), 3 + Math.floor(rng() * 6), 2, '#30323e');
    // piso de tábuas
    R(c, 0, 150, HOUSE_W, 30, '#2a2018'); for (let x = 0; x < HOUSE_W; x += 18) R(c, x, 150, 1, 30, '#1e1610'); R(c, 0, 150, HOUSE_W, 2, '#3a2c20');
    R(c, 0, 148, HOUSE_W, 2, '#14161c');
    // porta de entrada
    R(c, 6, 82, 24, 68, '#3a2a22'); R(c, 8, 84, 20, 64, '#4a3628'); R(c, 24, 116, 2, 4, '#8a6a4a');
    // sofá
    R(c, 34, 124, 60, 26, '#3a3050'); R(c, 34, 116, 60, 10, '#443a5c'); R(c, 30, 120, 6, 30, '#3a3050'); R(c, 92, 120, 6, 30, '#3a3050'); R(c, 40, 130, 24, 2, '#2a2240');
    // rack e TV
    R(c, 106, 130, 40, 20, '#3a2e24'); R(c, 108, 104, 34, 26, '#141418'); R(c, 110, 106, 30, 20, '#1e2028'); R(c, 120, 128, 10, 2, '#141418');
    // janela da sala
    R(c, 160, 60, 40, 44, '#0a0c16'); R(c, 160, 60, 40, 2, '#3a3a44'); R(c, 160, 102, 40, 3, '#3a3a44'); R(c, 179, 60, 2, 44, '#3a3a44');
    for (let i = 0; i < 6; i++) R(c, 164 + i * 6, 74 + (i % 2) * 6, 4, 6, '#1a1e30');
    // cozinha
    R(c, 222, 40, 3, 110, '#1a1a22');
    R(c, 234, 92, 20, 58, '#c8ccd0'); R(c, 234, 92, 20, 2, '#e8ecf0'); R(c, 234, 116, 20, 1, '#9a9ea8'); R(c, 250, 100, 2, 10, '#888'); R(c, 238, 96, 5, 4, '#ffd54a');
    R(c, 262, 122, 64, 28, '#5a4a3a'); R(c, 262, 118, 64, 4, '#8a8a8a'); R(c, 278, 120, 26, 4, '#4a4a52');
    for (let i = 0; i < 6; i++) R(c, 280 + (i % 3) * 7, 108 - Math.floor(i / 3) * 5, 8, 4, pick(['#d8d8d0', '#c8c0b0', '#e0e0d8']));
    R(c, 270, 60, 50, 22, '#3a3020'); R(c, 272, 62, 46, 18, '#2a2418');
    R(c, 340, 126, 52, 4, '#6a4a32'); R(c, 344, 130, 3, 20, '#4a3424'); R(c, 386, 130, 3, 20, '#4a3424');
    for (let i = 0; i < 5; i++) R(c, 346 + i * 8, 122 - (i % 2), 7, 4, i % 2 ? '#f4f4ee' : '#e8d8d0');
    R(c, 396, 118, 10, 32, '#4a3a2a'); R(c, 396, 116, 12, 3, '#5a4a3a');
    // corredor
    R(c, 418, 40, 3, 110, '#1a1a22');
    R(c, 428, 70, 16, 20, '#3a3020'); R(c, 430, 72, 12, 16, '#4a6a8a'); pixText(c, 'CORP', 436, 77, '#fff', 1, 'center');
    R(c, 452, 66, 14, 12, '#3a3020'); R(c, 454, 68, 10, 8, '#5a5040');
    R(c, 444, 134, 22, 16, '#6a5a3a'); R(c, 446, 128, 18, 8, '#7a6a8a');
    // parede do quarto e porta
    R(c, 480, 40, 12, 110, '#1e2028');
    // quarto
    R(c, 500, 80, 26, 70, '#3a2a22'); R(c, 502, 82, 10, 66, '#4a3628'); R(c, 514, 82, 10, 66, '#4a3628'); R(c, 511, 110, 1, 6, '#8a6a4a'); R(c, 514, 110, 1, 6, '#8a6a4a');
    R(c, 556, 58, 46, 40, '#0a0c16'); for (let y = 60; y < 98; y += 4) R(c, 556, y, 46, 2, '#2a2c38');
    R(c, 540, 128, 76, 22, '#3a2e24'); R(c, 542, 120, 72, 10, '#5a6a8a'); R(c, 542, 120, 72, 2, '#7a8aaa'); R(c, 600, 114, 16, 8, '#c8ccd8'); R(c, 538, 108, 6, 42, '#3a2e24');
    R(c, 620, 132, 14, 18, '#3a2e24'); R(c, 620, 130, 14, 2, '#4a3e34');
    R(c, 0, 26, 6, 124, '#0c0d14'); R(c, HOUSE_W - 4, 26, 4, 124, '#0c0d14');
  });
  return _house;
}
const ORB_SPOTS = [[66, 'MENSAGENS: 47'], [125, 'TV: CRISE'], [180, 'VIZINHOS'], [244, 'GELADEIRA VAZIA'], [296, 'LOUÇA'], [366, 'CONTAS'], [404, 'ALUGUEL'], [436, 'CRACHÁ'], [456, 'ROUPA SUJA']];
SCENES.c4_house = () => {
  const bg = buildHouse();
  const hero = new Hero(34, HOUSE_FLOOR - 24, LOOKS.mirangoNight); hero.speed = 46; hero.slump = 1; hero.frozen = true;
  const mA = heroActor(hero);
  const parts = new Parts();
  const dark = makeCanvas(W, H);
  const dc = dark.getContext('2d');
  const wall = { x: 482, y: 40, w: 10, h: 110 };
  const solids = [{ x: -20, y: HOUSE_FLOOR, w: HOUSE_W + 40, h: 30 }, { x: -10, y: 0, w: 14, h: H }, wall];
  const sc = {
    cam: { x: 0, y: 0 }, music: 'house', amb: 'house', capY: 32, hero, botTarget() { if (this.open) return 576; let b = null; for (const o of this.orbs) if (!b || Math.abs(o.x - hero.cx) < Math.abs(b.x - hero.cx)) b = o; return b ? b.x : hero.cx; }, t: 0, orbs: [], spawnT: 2.5, count: 0, press: 0, pressV: 0, open: false, doorA: 0, done: false, vig: .4,
    enter() {
      this.script = new Script((function* () {
        sfx('door'); yield .4; sfx('click');
        yield caption('Mirango entra na casa escura e tranca a porta.', { auto: 2.4 });
        yield caption('O silêncio do lar amplifica o barulho interno da angústia.', { auto: 3 });
        Balloons.add(null, 'Aproxime-se das lembranças pulsantes e pressione ' + Input.label('a') + ' para afastá-las antes que estourem.', { type: 'caption', auto: 5.5, bottom: true });
        hero.frozen = false;
      })());
    },
    *crush() {
      hero.frozen = true; hero.pose = { crouch: true, arms: 'face' }; sfx('boom'); G.shake(8);
      yield caption('As paredes imaginárias do escritório cercam a sala. O teto desce.', { auto: 2.6 });
      yield fadeTo(1, .6);
      this.orbs = []; this.press = 0; this.count = Math.max(0, this.count - 3); hero.x = 34; hero.pose = {}; this.spawnT = 2.5;
      yield fadeTo(0, .6);
      hero.frozen = false;
    },
    *finish() {
      this.done = true; hero.frozen = true; this.orbs.forEach(o => o.fade = true);
      yield heroTo(hero, 576);
      hero.face = 1;
      yield caption('Mirango desaba de bruços na cama, sem tirar os sapatos.', { auto: 2.6 });
      this.lying = true; sfx('thud');
      yield 1;
      yield caption('Puxa o travesseiro contra a cabeça para abafar a dor.', { auto: 2.6 });
      G.go('c4_end', { dur: 1.2 });
    },
    update(dt) {
      this.t += dt;
      if (this.script) { this.script.update(dt); if (this.script.done) this.script = null; }
      hero.update(dt, solids, { minX: 4, maxX: HOUSE_W - 6, parts, upJump: false, canJump: false, stride: 10 });
      // esferas de lembranças
      if (!hero.frozen && !this.done) {
        this.spawnT -= dt;
        const maxOrbs = this.count < 4 ? 2 : 3;
        if (this.spawnT <= 0 && this.orbs.length < maxOrbs) {
          const free = ORB_SPOTS.filter(([x]) => !this.orbs.some(o => o.x === x) && Math.abs(x - hero.cx) > 30);
          if (free.length) { const [x, l] = pick(free); this.orbs.push({ x, y: rnd(96, 124), t: 0, life: rnd(6, 7.5), label: l }); sfx('notif'); }
          this.spawnT = Math.max(1.6, 2.8 - this.count * .12);
        }
      }
      for (const o of this.orbs) {
        if (o.fade) { o.f = (o.f || 1) - dt; continue; }
        if (hero.frozen) continue;
        o.t += dt;
        if (Math.floor(o.t * (1 + o.t)) !== Math.floor((o.t - dt) * (1 + o.t - dt)) && o.t > o.life * .6) sfx('heart');
        if (o.t >= o.life) {
          o.dead = true; this.press++; sfx('boom'); G.shake(6); G.flash('#400010', .5);
          parts.burst(o.x, o.y, 30, { col: ['#ff5252', '#8a2a5a', '#2a0a1a'], min: 40, max: 140, lmax: .8 });
          sayAuto(mA, pick(['NÃO!', 'Para, para, para...', 'Eu não consigo...']), 1.2, { type: 'thought' });
          if (this.press >= 4 && !this.script) this.script = new Script(this.crush());
        }
      }
      this.orbs = this.orbs.filter(o => !o.dead && (o.f == null || o.f > 0));
      // afastar
      let near = null, bd = 24;
      for (const o of this.orbs) { if (o.fade) continue; const d = Math.abs(o.x - hero.cx); if (d < bd) { bd = d; near = o; } }
      this.cur = !hero.frozen && near;
      if (near && !hero.frozen && Input.pressed('a')) {
        near.dead = true; this.count++; sfx('pop'); hero.pose = { arms: 'out' }; setTimeout(() => { if (!sc.lying) hero.pose = {}; }, 300);
        parts.burst(near.x, near.y, 18, { col: ['#a8c0ff', '#e8f0ff', '#6a7ab8'], min: 20, max: 70, lmax: .9 });
        if (this.count % 3 === 0 && this.press > 0) this.press--;
        sayAuto(mA, pick(['Respira...', 'Agora não.', 'Vai embora.', 'Um de cada vez.']), 1, { type: 'thought' });
      }
      this.orbs = this.orbs.filter(o => !o.dead);
      if (!this.open && this.count >= 8) {
        this.open = true; wall.off = true; sfx('creak');
        Balloons.add(null, 'A porta do quarto range e se abre.', { type: 'caption', auto: 2.6 });
      }
      if (this.open) this.doorA = Math.min(1, this.doorA + dt);
      this.pressV = lerp(this.pressV, this.press, dt * 3);
      this.vig = .4 + this.pressV * .1;
      this.bed = this.open && !this.done && !hero.frozen && Math.abs(hero.cx - 576) < 28;
      if (this.bed && Input.pressed('a')) this.script = new Script(this.finish());
      parts.update(dt);
      const tx = clamp(hero.cx - W / 2, 0, HOUSE_W - W);
      this.cam.x = lerp(this.cam.x, tx, Math.min(1, dt * 4));
    },
    draw(c) {
      const cx = Math.round(this.cam.x);
      c.drawImage(bg, -cx, 0);
      c.save(); c.translate(-cx, 0);
      // porta do quarto
      if (!this.open) { R(c, 482, 82, 10, 68, '#4a3628'); R(c, 488, 114, 2, 4, '#8a6a4a'); }
      else { R(c, 482, 82, Math.round(10 * (1 - this.doorA)) + 2, 68, '#4a3628'); }
      if (this.lying) {
        drawPerson(c, 590, 121, LOOKS.mirangoNight, { rot: Math.PI / 2, eyes: 'closed' });
        R(c, 596, 112, 16, 9, '#c8ccd8'); R(c, 596, 112, 16, 2, '#e8ecf0');
      } else hero.draw(c);
      parts.draw(c);
      c.restore();
      // escuridão com buracos de luz
      dc.globalCompositeOperation = 'source-over'; dc.clearRect(0, 0, W, H);
      dc.fillStyle = 'rgba(2,3,10,.68)'; dc.fillRect(0, 0, W, H);
      dc.globalCompositeOperation = 'destination-out';
      const hole = (x, y, r, a = 1) => { const g = dc.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); dc.fillStyle = g; dc.fillRect(x - r, y - r, r * 2, r * 2); };
      hole(hero.cx - cx, hero.y + 8, 56, .9);
      hole(180 - cx, 90, 50, .8); hole(579 - cx, 90, 52, .7); hole(240 - cx, 98, 18, .4);
      for (const o of this.orbs) hole(o.x - cx, o.y, 20 + o.t * 3, .8);
      c.drawImage(dark, 0, 0);
      // feixes de luz do poste pela janela
      c.globalCompositeOperation = 'lighter'; c.globalAlpha = .08;
      c.fillStyle = '#a8c0ff'; c.beginPath(); c.moveTo(160 - cx, 62); c.lineTo(200 - cx, 62); c.lineTo(240 - cx, 150); c.lineTo(170 - cx, 150); c.fill();
      c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
      // esferas
      for (const o of this.orbs) {
        const k = clamp(o.t / o.life, 0, 1), pulse = Math.sin(o.t * (4 + k * 14)) * (1 + k * 2);
        const r = Math.round(3 + k * 9 + pulse) * (o.fade ? Math.max(0, o.f) : 1);
        const x = Math.round(o.x - cx), y = Math.round(o.y);
        const col = mix('#6a7ab8', '#ff3040', k);
        c.globalAlpha = .3; c.fillStyle = col; c.beginPath(); c.arc(x, y, r + 4, 0, 7); c.fill();
        c.globalAlpha = 1; c.beginPath(); c.arc(x, y, Math.max(1, r), 0, 7); c.fill();
        c.fillStyle = '#fff'; c.globalAlpha = .6; c.fillRect(x - 1, y - Math.round(r / 2), 2, 2); c.globalAlpha = 1;
        if (k > .25) pixText(c, o.label, x, y - r - 9, k > .7 ? '#ff8a8a' : '#a8b0d0', 1, 'center');
      }
      // paredes do escritório se fechando
      const p = this.pressV;
      if (p > .02) {
        const ww = Math.round(p * 26), ch = Math.round(p * 12);
        for (const side of [0, 1]) {
          const x0 = side ? W - ww : 0;
          R(c, x0, 0, ww, H, '#56647a'); dither(c, x0, 0, ww, H, '#5e6c83', 3);
          for (let yy = 0; yy < H; yy += 30) R(c, x0, yy, ww, 2, '#46526a');
          R(c, side ? x0 : x0 + ww - 2, 0, 2, H, '#7a889c');
        }
        R(c, 0, 0, W, ch, '#262b34'); R(c, 0, ch, W, 2, '#e8f2ff');
      }
    },
    ui(c) {
      pxBox(c, 6, 6, 92, 22, 'rgba(10,10,20,.8)', '#5a6aa8');
      T(c, 'Afastadas: ' + this.count + '/8', 10, 8, { f: FONT2, size: 9, col: '#c8d0f0' });
      T(c, 'Pressão: ' + '■'.repeat(this.press) + '□'.repeat(Math.max(0, 4 - this.press)), 10, 17, { f: FONT2, size: 9, col: this.press >= 3 ? '#ff8a8a' : '#c8d0f0' });
      if (this.cur) promptAt(c, this.cur.x - this.cam.x, this.cur.y + 18, 'a', 'Afastar');
      if (this.bed) promptAt(c, 576 - this.cam.x, 90, 'a', 'Desabar na cama');
      if (this.open && !this.done && !this.bed) objectiveUI(c, this, 'Vá para o quarto', 576, 110);
    }
  };
  return sc;
};

/* ---------- Quarto (usado no fim do cap. 4 e início do cap. 5) ---------- */
function drawBedroom(c, mode, t) {
  const night = mode === 'night';
  vgrad(c, 0, 0, W, 150, night ? ['#10121c', '#181a26'] : ['#5a6070', '#7a808e']);
  R(c, 0, 150, W, 30, night ? '#1a1410' : '#4a3a2c'); for (let x = 0; x < W; x += 18) R(c, x, 150, 1, 30, night ? '#120e0a' : '#3a2c20');
  // janela com persiana
  R(c, 190, 30, 70, 56, night ? '#06070e' : '#b8c0cc');
  for (let y = 32; y < 86; y += 5) R(c, 190, y, 70, 3, night ? '#20222c' : '#d8dce4');
  R(c, 188, 28, 74, 3, '#3a3020'); R(c, 188, 86, 74, 3, '#3a3020');
  // guarda-roupa
  R(c, 30, 60, 46, 90, night ? '#2a2018' : '#5a4430'); R(c, 32, 62, 20, 86, night ? '#34281e' : '#6a5038'); R(c, 54, 62, 20, 86, night ? '#34281e' : '#6a5038'); R(c, 50, 100, 2, 6, '#8a6a4a'); R(c, 54, 100, 2, 6, '#8a6a4a');
  // cama
  R(c, 120, 126, 120, 24, night ? '#2a2018' : '#5a4430'); R(c, 120, 116, 120, 12, night ? '#2a3448' : '#5a6a8a'); R(c, 120, 116, 120, 2, night ? '#3a4458' : '#7a8aaa'); R(c, 114, 100, 8, 50, night ? '#2a2018' : '#5a4430');
  // criado-mudo + despertador
  R(c, 250, 126, 22, 24, night ? '#2a2018' : '#5a4430'); R(c, 250, 124, 22, 3, night ? '#34281e' : '#6a5038');
  R(c, 254, 114, 14, 10, '#1a1a1a'); pixText(c, '06:00', 261, 117, mode === 'alarm' && Math.floor(t * 4) % 2 ? '#1a1a1a' : '#ff3030', 1, 'center');
  // porta
  R(c, 292, 74, 24, 76, night ? '#2a2018' : '#5a4430'); R(c, 294, 76, 20, 72, night ? '#34281e' : '#6a5038'); R(c, 310, 112, 2, 4, '#8a6a4a');
}
function blindsLight(c, a, col) {
  c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 11; i++) {
    c.globalAlpha = a; c.fillStyle = col; c.beginPath();
    const y = 32 + i * 5; c.moveTo(190, y); c.lineTo(260, y); c.lineTo(230, y + 90); c.lineTo(150, y + 90); c.closePath(); c.fill();
  }
  c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
}
SCENES.c4_end = () => {
  const sc = {
    music: 'house', amb: 'night', t: 0, vig: .6,
    enter() { this.script = new Script(this.run()); },
    *run() {
      yield 1;
      yield caption('Mirango jaz imóvel na escuridão.', { auto: 2.4 });
      yield caption('A depressão o envolve como um cobertor de chumbo.', { auto: 2.8 });
      yield caption('Sem raiva. Sem ilusões. Restou apenas o peso de saber que a realidade o aguarda logo cedo.', { auto: 4.2 });
      yield caption('As luzes amareladas da rua cortam o quarto em sombras frias.', { auto: 3 });
      G.unlock(5);
      yield endCard('FIM DO CAPÍTULO 4', 'Depressão');
      G.go('c5_wake', { cut: true, black: true });
    },
    update(dt) { this.t += dt; if (this.script) this.script.update(dt); },
    draw(c) {
      drawBedroom(c, 'night', this.t);
      drawPerson(c, 186, 118, LOOKS.mirangoNight, { rot: Math.PI / 2, eyes: 'closed' });
      R(c, 202, 108, 22, 10, '#c8ccd8'); R(c, 202, 108, 22, 2, '#e8ecf0');
      blindsLight(c, .05, '#ffd890');
      if (Math.floor(this.t * .5) % 2) { R(c, 196, 104, 1, 1, '#9fd3ff'); }
    }
  };
  return sc;
};
