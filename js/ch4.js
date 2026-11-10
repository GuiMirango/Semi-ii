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
// linguagem visual de AMEAÇA: aura vermelha pulsante + contorno vermelho (nada inofensivo usa essas cores)
function threat(c, x, y, w, h) {
  const p = .25 + Math.sin(G.t * 7) * .12;
  c.globalCompositeOperation = 'lighter'; c.globalAlpha = p; R(c, x - 4, y - 4, w + 8, h + 8, '#ff1a3a'); c.globalAlpha = p * .6; R(c, x - 7, y - 7, w + 14, h + 14, '#a0102a');
  c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  R(c, x - 2, y - 2, w + 4, 1, '#ff2a4a'); R(c, x - 2, y + h + 1, w + 4, 1, '#ff2a4a'); R(c, x - 2, y - 2, 1, h + 4, '#ff2a4a'); R(c, x + w + 1, y - 2, 1, h + 4, '#ff2a4a');
}
function angryEyes(c, x, y) { R(c, x, y, 3, 2, '#ff3040'); R(c, x + 5, y, 3, 2, '#ff3040'); R(c, x, y - 1, 2, 1, '#0a0a10'); R(c, x + 6, y - 1, 2, 1, '#0a0a10'); }
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
      yield titleCard('CAPÍTULO 4', 'DEPRESSÃO');
      G.fadeA = 0; this.busX = -150; this.busV = 120;
      sfx('brake');
      yield Tk.until(() => sc.busX >= 0);
      this.busV = 0; sfx('door');
      yield .5;
      this.showHero = true;
      yield 1.2;
      this.busV = 40;
      yield 1.2;
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
      yield 1.0;
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
      for (const lx of LAMPS) { R(c, lx + 12, 74, 8, 2, this.lit[lx] ? '#e8f0ff' : '#a8b8d8'); if (!this.lit[lx] && lx > 100) { const b = Math.round(Math.sin(G.t * 4) * 2); pixText(c, '+', lx + 8, 140 + b, '#ffe9a0'); } }
      // outdoor iluminado de IA (único ponto vivo da rua)
      R(c, 1180, 34, 104, 40, '#141620'); R(c, 1182, 36, 100, 36, '#1f4a6a'); pixText(c, 'GAUDE AI', 1232, 40, '#fff', 2, 'center'); pixText(c, 'ELA NAO CANSA.', 1232, 54, '#7fd4ff', 1, 'center'); pixText(c, 'ELA NAO DORME.', 1232, 61, '#7fd4ff', 1, 'center');
      R(c, 1200, 74, 3, 30, '#141620'); R(c, 1262, 74, 3, 30, '#141620');
      if (this.busX > -140 && this.busX < NIGHT_W) drawBusSide(c, this.busX, NIGHT_FLOOR - 2, '#2a3a5a', true);
      // perigos
      for (const h of HZ) {
        if (h.used && h.t !== 'shadow') continue;
        if (h.t === 'trash') {
          threat(c, h.x, NIGHT_FLOOR - 12, 14, 12);
          R(c, h.x, NIGHT_FLOOR - 12, 14, 12, OUT); R(c, h.x + 1, NIGHT_FLOOR - 11, 12, 11, '#2a2a34'); R(c, h.x - 2, NIGHT_FLOOR - 14 + (Math.floor(G.t * 3) % 2), 18, 2, '#1a1a22');
          R(c, h.x + 2, NIGHT_FLOOR - 11, 10, 4, '#05050a'); angryEyes(c, h.x + 3, NIGHT_FLOOR - 10);
          for (let i = 0; i < 5; i++) R(c, h.x + 2 + i * 2, NIGHT_FLOOR - 7, 1, 2, '#e8e8e0');
        } else if (h.t === 'flyer') {
          const x = Math.round(h.x + h.fx), y = Math.round(124 + Math.sin(h.t0 * 3) * 4);
          threat(c, x, y, 11, 10);
          R(c, x - 1, y - 1, 13, 12, OUT); R(c, x, y, 11, 10, '#3a1a24'); R(c, x, y, 11, 3, '#ff2a4a'); pixText(c, 'VAGA', x + 6, y + 4, '#ffb0b8', 1, 'center');
        } else if (h.t === 'shadow') {
          if (h.used) continue;
          const x = h.x;
          if (h.st === 0) { threat(c, x - 5, NIGHT_FLOOR - 30, 10, 30); drawPerson(c, x, NIGHT_FLOOR, LOOKS.chefe, { face: -1, mono: '#0a0b12', outline: '#ff2a4a' }); R(c, x - 3, NIGHT_FLOOR - 23, 2, 1, '#ff3040'); R(c, x, NIGHT_FLOOR - 23, 2, 1, '#ff3040'); }
          else {
            const grow = h.st === 1 ? Math.min(1, h.t0 / .55) : 1, fade = h.st === 3 ? Math.max(0, 1 - h.t0 / .6) : 1;
            c.globalAlpha = fade;
            const fw = Math.round(16 + 20 * grow), fh = Math.round(18 + 24 * grow), fx = x - fw / 2, fy = NIGHT_FLOOR - 30 - fh;
            threat(c, fx, fy, fw, fh);
            R(c, fx - 1, fy - 1, fw + 2, fh + 2, '#05060a'); R(c, fx, fy, fw, fh, '#5a6070'); R(c, fx + 3, fy + fh * .32 - 1, 2, 2, '#ff3040'); R(c, fx + fw * .62, fy + fh * .32 - 1, 2, 2, '#ff3040');
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
        threat(c, x, y, 18, 12);
        if (p.k === 'email') iconMail(c, x, y, '#ffb0b8', 2);
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
const HOUSE_W = 580, HOUSE_FLOOR = 150, HOUSE_CEIL = 92;
let _house = null;
function buildHouse() {
  // móveis na escala do personagem (≈26 px de altura): porta ≈34, pé-direito ≈58
  if (_house) return _house;
  const rng = srand(13);
  _house = makeCanvas(HOUSE_W, H, (c) => {
    // telhado / sótão escuro acima do forro
    R(c, 0, 0, HOUSE_W, HOUSE_CEIL, '#07080e');
    for (let x = -60; x < HOUSE_W; x += 12) { c.fillStyle = '#0d0e16'; c.fillRect(x + 60, 40 + ((x / 12) % 2) * 2, 10, 2); }
    c.fillStyle = '#12131c'; c.beginPath(); c.moveTo(0, HOUSE_CEIL - 4); c.lineTo(HOUSE_W / 2, 30); c.lineTo(HOUSE_W, HOUSE_CEIL - 4); c.closePath(); c.fill();
    R(c, 0, HOUSE_CEIL - 4, HOUSE_W, 4, '#1a1a22');
    // paredes
    vgrad(c, 0, HOUSE_CEIL, HOUSE_W, HOUSE_FLOOR - HOUSE_CEIL, ['#2c2e3c', '#22242e']);
    dither(c, 0, HOUSE_CEIL, HOUSE_W, HOUSE_FLOOR - HOUSE_CEIL, '#262836', 6);
    for (let i = 0; i < 24; i++) R(c, Math.floor(rng() * HOUSE_W), HOUSE_CEIL + 4 + Math.floor(rng() * 40), 2 + Math.floor(rng() * 4), 1, '#30323e');
    R(c, 0, 146, HOUSE_W, 4, '#1a1c24');
    // piso de tábuas
    R(c, 0, 150, HOUSE_W, 30, '#2a2018'); for (let x = 0; x < HOUSE_W; x += 14) R(c, x, 150, 1, 30, '#1e1610'); R(c, 0, 150, HOUSE_W, 2, '#3a2c20');
    // SALA — porta de entrada (34)
    R(c, 6, 115, 20, 35, '#3a2a22'); R(c, 8, 117, 16, 33, '#4a3628'); R(c, 21, 133, 2, 2, '#8a6a4a');
    // sofá (assento a 10, encosto a 20)
    R(c, 32, 138, 46, 12, '#3a3050'); R(c, 32, 130, 46, 8, '#443a5c'); R(c, 30, 134, 4, 16, '#3a3050'); R(c, 76, 134, 4, 16, '#3a3050'); R(c, 36, 139, 18, 1, '#2a2240'); R(c, 56, 139, 18, 1, '#2a2240');
    // rack e TV
    R(c, 92, 140, 30, 10, '#3a2e24'); R(c, 92, 140, 30, 1, '#4a3e34'); R(c, 98, 126, 18, 13, '#141418'); R(c, 99, 127, 16, 10, '#1e2028'); R(c, 105, 139, 4, 1, '#141418');
    // janela da sala
    R(c, 140, 100, 34, 26, '#0a0c16'); R(c, 140, 100, 34, 2, '#3a3a44'); R(c, 140, 124, 34, 3, '#3a3a44'); R(c, 156, 100, 2, 26, '#3a3a44');
    for (let i = 0; i < 5; i++) R(c, 143 + i * 6, 110 + (i % 2) * 5, 3, 4, '#1a1e30');
    // arco para a cozinha
    R(c, 192, HOUSE_CEIL, 6, 18, '#1a1a22');
    // COZINHA — geladeira (34), bancada (14) com pia e louça, armário aéreo, mesa (14)
    R(c, 204, 116, 16, 34, '#c8ccd0'); R(c, 204, 116, 16, 1, '#e8ecf0'); R(c, 204, 128, 16, 1, '#9a9ea8'); R(c, 217, 120, 1, 5, '#888'); R(c, 207, 119, 4, 3, '#ffd54a');
    R(c, 226, 136, 50, 14, '#5a4a3a'); R(c, 226, 135, 50, 2, '#8a8a8a'); R(c, 240, 135, 16, 2, '#4a4a52'); for (let i = 0; i < 4; i++) R(c, 230 + i * 12, 140, 10, 9, '#4e4032');
    for (let i = 0; i < 6; i++) R(c, 241 + (i % 3) * 5, 131 - Math.floor(i / 3) * 3, 5, 3, pick(['#d8d8d0', '#c8c0b0', '#e0e0d8']));
    R(c, 230, 104, 42, 12, '#3a3020'); R(c, 232, 106, 18, 8, '#2a2418'); R(c, 252, 106, 18, 8, '#2a2418');
    R(c, 290, 136, 32, 2, '#6a4a32'); R(c, 292, 138, 2, 12, '#4a3424'); R(c, 318, 138, 2, 12, '#4a3424');
    for (let i = 0; i < 4; i++) R(c, 294 + i * 6, 134 - (i % 2), 5, 2, i % 2 ? '#f4f4ee' : '#e8d8d0');
    R(c, 326, 140, 4, 10, '#4a3a2a'); R(c, 326, 130, 2, 10, '#4a3a2a'); R(c, 326, 139, 8, 2, '#5a4a3a');
    R(c, 340, 142, 7, 8, '#3a3a40');
    // CORREDOR — fotos e cesto de roupa
    R(c, 352, HOUSE_CEIL, 4, 58, '#1a1a22');
    R(c, 364, 108, 10, 12, '#3a3020'); R(c, 365, 109, 8, 10, '#4a6a8a'); pixText(c, 'C', 369, 111, '#fff', 1, 'center');
    R(c, 380, 104, 9, 8, '#3a3020'); R(c, 381, 105, 7, 6, '#5a5040');
    R(c, 378, 142, 14, 8, '#6a5a3a'); R(c, 379, 139, 12, 4, '#7a6a8a');
    // parede do quarto (a porta é desenhada à parte)
    R(c, 404, HOUSE_CEIL, 8, 24, '#1e2028');
    // QUARTO — guarda-roupa (38), janela com persiana, cama (12) e criado-mudo (10)
    R(c, 422, 112, 22, 38, '#3a2a22'); R(c, 423, 113, 10, 36, '#4a3628'); R(c, 434, 113, 9, 36, '#4a3628'); R(c, 432, 128, 1, 4, '#8a6a4a'); R(c, 435, 128, 1, 4, '#8a6a4a');
    R(c, 462, 100, 30, 24, '#0a0c16'); for (let y = 101; y < 124; y += 3) R(c, 462, y, 30, 1, '#2a2c38');
    R(c, 484, 138, 46, 12, '#3a2e24'); R(c, 484, 134, 46, 5, '#5a6a8a'); R(c, 484, 134, 46, 1, '#7a8aaa'); R(c, 528, 126, 4, 24, '#3a2e24');
    R(c, 538, 140, 10, 10, '#3a2e24'); R(c, 538, 139, 10, 2, '#4a3e34'); R(c, 540, 135, 6, 4, '#1a1a1a'); R(c, 541, 136, 4, 1, '#ff3030');
    R(c, 0, HOUSE_CEIL, 3, 58, '#0c0d14'); R(c, HOUSE_W - 3, HOUSE_CEIL, 3, 58, '#0c0d14');
  });
  return _house;
}
const ORB_SPOTS = [[56, 'MENSAGENS: 47'], [107, 'TV: CRISE'], [157, 'VIZINHOS'], [212, 'GELADEIRA VAZIA'], [250, 'LOUÇA'], [306, 'CONTAS'], [338, 'ALUGUEL'], [369, 'CRACHÁ'], [385, 'ROUPA SUJA']];
SCENES.c4_house = () => {
  const bg = buildHouse();
  const hero = new Hero(34, HOUSE_FLOOR - 24, LOOKS.mirangoNight); hero.speed = 46; hero.slump = 1; hero.frozen = true;
  const mA = heroActor(hero);
  const parts = new Parts();
  const dark = makeCanvas(W, H);
  const dc = dark.getContext('2d');
  const wall = { x: 404, y: HOUSE_CEIL, w: 8, h: 58 };
  const solids = [{ x: -20, y: HOUSE_FLOOR, w: HOUSE_W + 40, h: 30 }, { x: -10, y: 0, w: 14, h: H }, wall];
  const sc = {
    cam: { x: 0, y: 0 }, music: 'house', amb: 'house', capY: 32, hero, botTarget() { if (this.open) return 506; let b = null; for (const o of this.orbs) if (!b || Math.abs(o.x - hero.cx) < Math.abs(b.x - hero.cx)) b = o; return b ? b.x : hero.cx; }, t: 0, orbs: [], spawnT: 2.5, count: 0, press: 0, pressV: 0, open: false, doorA: 0, done: false, vig: .4,
    enter() {
      this.script = new Script((function* () {
        sfx('door'); yield .4; sfx('click');
        yield 1.0;
        yield 1.2;
        Balloons.add(null, 'Aproxime-se das lembranças pulsantes e pressione ' + Input.label('a') + ' para afastá-las antes que estourem.', { type: 'caption', auto: 5.5, bottom: true });
        hero.frozen = false;
      })());
    },
    *crush() {
      hero.frozen = true; hero.pose = { crouch: true, arms: 'face' }; sfx('boom'); G.shake(8);
      yield 1.0;
      yield fadeTo(1, .6);
      this.orbs = []; this.press = 0; this.count = Math.max(0, this.count - 3); hero.x = 34; hero.pose = {}; this.spawnT = 2.5;
      yield fadeTo(0, .6);
      hero.frozen = false;
    },
    *finish() {
      this.done = true; hero.frozen = true; this.orbs.forEach(o => o.fade = true);
      yield heroTo(hero, 500);
      hero.face = 1;
      yield 1.0;
      this.lying = true; sfx('thud');
      yield 1;
      yield 1.0;
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
          if (free.length) { const [x, l] = pick(free); this.orbs.push({ x, y: rnd(106, 130), t: 0, life: rnd(6, 7.5), label: l }); sfx('notif'); }
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
      this.bed = this.open && !this.done && !hero.frozen && Math.abs(hero.cx - 506) < 24;
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
      if (!this.open) { R(c, 404, 116, 8, 34, '#4a3628'); R(c, 409, 132, 2, 2, '#8a6a4a'); }
      else { R(c, 404, 116, Math.round(6 * (1 - this.doorA)) + 2, 34, '#4a3628'); }
      if (this.lying) {
        drawPerson(c, 498, 130, LOOKS.mirangoNight, { rot: Math.PI / 2, eyes: 'closed' });
        R(c, 514, 126, 12, 7, '#c8ccd8'); R(c, 514, 126, 12, 2, '#e8ecf0');
      } else hero.draw(c);
      parts.draw(c);
      c.restore();
      // escuridão com buracos de luz
      dc.globalCompositeOperation = 'source-over'; dc.clearRect(0, 0, W, H);
      dc.fillStyle = 'rgba(2,3,10,.68)'; dc.fillRect(0, 0, W, H);
      dc.globalCompositeOperation = 'destination-out';
      const hole = (x, y, r, a = 1) => { const g = dc.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); dc.fillStyle = g; dc.fillRect(x - r, y - r, r * 2, r * 2); };
      hole(hero.cx - cx, hero.y + 8, 56, .9);
      hole(157 - cx, 114, 40, .8); hole(477 - cx, 114, 40, .7); hole(212 - cx, 122, 14, .4);
      for (const o of this.orbs) hole(o.x - cx, o.y, 20 + o.t * 3, .8);
      c.drawImage(dark, 0, 0);
      // feixes de luz do poste pela janela
      c.globalCompositeOperation = 'lighter'; c.globalAlpha = .08;
      c.fillStyle = '#a8c0ff'; c.beginPath(); c.moveTo(140 - cx, 102); c.lineTo(174 - cx, 102); c.lineTo(200 - cx, 150); c.lineTo(150 - cx, 150); c.fill();
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
      if (this.bed) promptAt(c, 506 - this.cam.x, 96, 'a', 'Desabar na cama');
      if (this.open && !this.done && !this.bed) objectiveUI(c, this, 'Vá para o quarto', 506, 120);
    }
  };
  return sc;
};

/* ---------- Quarto (usado no fim do cap. 4 e início do cap. 5) ---------- */
// O quarto é desenhado em meia resolução (160x90) e ampliado 2x: assim a cama, a porta e o
// guarda-roupa ficam na escala correta em relação ao Mirango, como em um close.
const BR_FLOOR = 75;
const _brc = makeCanvas(160, 90);
function bedroomFrame(c, fn) { const x = _brc.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, 160, 90); fn(x); c.drawImage(_brc, 0, 0, 320, 180); }
function drawBedroom(c, mode, t) {
  const night = mode === 'night', wood = night ? '#2a2018' : '#5a4430', woodL = night ? '#34281e' : '#6a5038';
  vgrad(c, 0, 0, 160, BR_FLOOR, night ? ['#10121c', '#181a26'] : ['#5a6070', '#7a808e'], 12);
  R(c, 0, BR_FLOOR - 2, 160, 2, night ? '#0c0d14' : '#4a4e58');
  R(c, 0, BR_FLOOR, 160, 15, night ? '#1a1410' : '#4a3a2c'); for (let x = 0; x < 160; x += 9) R(c, x, BR_FLOOR, 1, 15, night ? '#120e0a' : '#3a2c20');
  // janela com persiana
  R(c, 63, 21, 32, 24, '#3a3020'); R(c, 64, 22, 30, 22, night ? '#06070e' : '#b8c0cc');
  for (let y = 22; y < 44; y += 3) R(c, 64, y, 30, 2, night ? '#20222c' : '#d8dce4');
  // guarda-roupa (38)
  R(c, 12, 37, 19, 38, wood); R(c, 13, 38, 8, 37, woodL); R(c, 22, 38, 8, 37, woodL); R(c, 20, 54, 1, 3, '#8a6a4a'); R(c, 23, 54, 1, 3, '#8a6a4a');
  // cama (12) com cabeceira
  R(c, 60, 66, 44, 9, wood); R(c, 60, 62, 44, 4, night ? '#2a3448' : '#5a6a8a'); R(c, 60, 62, 44, 1, night ? '#3a4458' : '#7a8aaa'); R(c, 102, 54, 4, 21, wood); R(c, 58, 60, 3, 15, wood);
  // criado-mudo (10) e despertador
  R(c, 110, 65, 10, 10, wood); R(c, 110, 64, 10, 2, woodL);
  R(c, 111, 59, 8, 5, '#1a1a1a'); if (!(mode === 'alarm' && Math.floor(t * 4) % 2)) { R(c, 112, 61, 2, 1, '#ff3030'); R(c, 116, 61, 2, 1, '#ff3030'); R(c, 115, 60, 1, 1, '#ff3030'); R(c, 115, 62, 1, 1, '#ff3030'); }
  // porta (34)
  R(c, 137, 40, 18, 35, wood); R(c, 138, 41, 16, 34, woodL); R(c, 151, 58, 1, 2, '#8a6a4a');
}
function blindsLight(c, a, col) {
  c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 8; i++) {
    c.globalAlpha = a; c.fillStyle = col; c.beginPath();
    const y = 22 + i * 3; c.moveTo(64, y); c.lineTo(94, y); c.lineTo(84, y + 45); c.lineTo(48, y + 45); c.closePath(); c.fill();
  }
  c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
}
SCENES.c4_end = () => {
  const sc = {
    music: 'house', amb: 'night', t: 0, vig: .6,
    enter() { this.script = new Script(this.run()); },
    *run() {
      yield 1;
      yield 1.0;
      yield caption('A depressão o envolve como um cobertor de chumbo.', { auto: 2.8 });
      yield 1.2;
      yield 1.2;
      G.unlock(5);
      yield endCard('FIM DO CAPÍTULO 4', 'Depressão');
      G.go('c5_wake', { cut: true, black: true });
    },
    update(dt) { this.t += dt; if (this.script) this.script.update(dt); },
    draw(c) {
      bedroomFrame(c, (x) => {
        drawBedroom(x, 'night', this.t);
        drawPerson(x, 72, 58, LOOKS.mirangoNight, { rot: Math.PI / 2, eyes: 'closed' });
        R(x, 92, 55, 10, 6, '#c8ccd8'); R(x, 92, 55, 10, 1, '#e8ecf0');
        blindsLight(x, .05, '#ffd890');
      });
    }
  };
  return sc;
};
