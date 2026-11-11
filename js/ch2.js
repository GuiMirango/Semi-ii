'use strict';
/* =========================================================
   CAPÍTULO 2 — RAIVA: a subversão da matriz centralizada
   ========================================================= */

/* ---------- Abertura: "NÃO." ---------- */
SCENES.c2_reject = () => {
  const L = buildOffice(false);
  const m = npc(LOOKS.mirango, 214, FLOOR, { face: -1 });
  const plinio = npc(LOOKS.plinio, 162, FLOOR, { face: 1 });
  const sueli = npc(LOOKS.sueli, 292, FLOOR, { face: -1, pose: { eyes: 'wide', mouth: 'open' } });
  const colA = npc(LOOKS.colegaA, 110, FLOOR, { face: 1, pose: { eyes: 'wide', mouth: 'open', arms: 'face' } });
  const parts = new Parts();
  const sc = {
    cam: { x: 0, y: 0 }, music: null, amb: 'office', holdBlack: true, elevOpen: 0, vig: .25, prompt: false,
    elevInside(c) { if (m.inElev) m.draw(c); },
    enter() { this.script = new Script(this.run()); },
    *run() {
      G.fadeA = 1; m.pose = { arms: 'fist', mouth: 'shout', eyes: 'wide' };
      yield .3; G.fadeA = 0; G.flash('#fff', .8); sfx('shout'); G.shake(7);
      yield shout(m, 'EU ME DEMITO!', { size: 24, maxW: 260, auto: 1.3 });
      m.pose = { eyes: 'wide' };
      yield titleCard('CAPÍTULO 2', 'RAIVA');
      yield 1.0;
      Music.play('rage');
      m.pose = {};
      yield think(m, 'Pela primeira vez em anos... eu tô de pé. De verdade.');
      plinio.pose = { arms: 'hold' };
      yield walkTo(plinio, 180, 60); plinio.face = 1;
      yield say(plinio, 'M-mas, Mirangão... e esses contratos? Você não pode simplesmente... :)', { name: 'PLÍNIO' });
      this.prompt = true;
      yield Tk.until(() => Input.pressed('b'));
      this.prompt = false;
      m.pose = { arms: 'out', mouth: 'shout', eyes: 'wide' }; sfx('shout'); sfx('paper'); G.shake(5);
      parts.burst(184, 132, 22, { col: ['#f4f4ee', '#e8e8e0', '#ddd'], min: 30, max: 120, g: 140, type: 'paper', lmax: 1.8, drag: 1 });
      plinio.pose = { eyes: 'wide', mouth: 'open' };
      yield shout(m, 'NÃO.', { size: 22, auto: 1.1 });
      yield { t: 0, update(dt) { this.t += dt; plinio.x = lerp(180, 150, Math.min(1, this.t / .4)); plinio.pose = { rot: -Math.min(1, this.t / .4) * 1.4, eyes: 'wide', mouth: 'open' }; return this.t > .5; } };
      sfx('thud');
      m.pose = {};
      yield .3;
      yield { t: 0, update(dt) { this.t += dt; sc.elevOpen = Math.min(1, this.t / .7); return this.t >= .7; } };
      sfx('ding');
      yield walkTo(m, 38, 62);
      m.inElev = true; m.face = 1;
      plinio.pose = {};
      yield .3;
      yield [walkTo(plinio, 74, 70), { t: 0, update(dt) { this.t += dt; sc.elevOpen = Math.max(0, 1 - this.t / 1.1); return this.t >= 1.1; } }];
      plinio.face = -1; sfx('thud'); G.shake(3); plinio.pose = { eyes: 'closed', mouth: 'sad' };
      sayAuto(plinio, 'Ai! Meu nariz!', 1.6, { name: 'PLÍNIO' });
      yield 1.4;
      yield fadeTo(1, .6);
      this.floorCount = 14;
      for (let f = 14; f >= 0; f--) { this.floorCount = f; sfx('click'); yield .12; }
      sfx('ding'); yield .5;
      G.go('c2_frogger', { cut: true, black: true });
    },
    update(dt) { if (this.script) this.script.update(dt); parts.update(dt); },
    draw(c) {
      c.drawImage(L.far, 0, 18); c.drawImage(L.bg, 0, 0);
      drawOfficeDyn(c, this, { shock: true, frozen: true });
      monitorP(c, 136, 134, '#3b6a9a', '#9fc4ef'); monitorP(c, 248, 134, '#9a2a2a', '#ffd0d0');
      colA.draw(c); sueli.draw(c); plinio.draw(c); if (!m.inElev) m.draw(c);
      if (plinio.pose.arms === 'hold') { R(c, plinio.x + 3, 129, 8, 6, '#c9a05a'); R(c, plinio.x + 4, 128, 6, 1, '#f4f4ee'); }
      parts.draw(c);
      drawLights(c, this, 0, 0);
    },
    ui(c) {
      if (this.prompt) promptAt(c, 184, 88, 'b', 'Rejeitar');
    },
    uiTop(c) {
      if (this.floorCount != null && G.fadeA > .9) {
        R(c, W / 2 - 22, 70, 44, 30, '#111'); pxBox(c, W / 2 - 22, 70, 44, 30, '#1a1a1a', '#555');
        T(c, this.floorCount === 0 ? 'T' : String(this.floorCount), W / 2, 77, { size: 14, align: 'center', col: '#ff6a3a', sh: false });
        T(c, '▼', W / 2 + 16, 74, { size: 5, col: '#ff6a3a', sh: false });
      }
    }
  };
  return sc;
};

/* ---------- Minigame 1: A Faixa do Foda-se (top-down arcade) ---------- */
const LANES = [{ dir: -1, v: 78 }, { dir: -1, v: 62 }, { dir: 1, v: 70 }, { dir: 1, v: 90 }];
const LH = 22, laneY = i => 44 + i * LH;
const CAR_COLS = ['#c62828', '#1e5aa8', '#e3c34a', '#2e7d32', '#eeeeee', '#5d4037', '#7b1fa2', '#ff7043', '#455a64'];
function drawCarTop(c, v) {
  const x = Math.round(v.x), y = Math.round(laneY(v.lane) + (LH - v.h) / 2), w = v.w, h = v.h, d = LANES[v.lane].dir;
  R(c, x + 2, y + h, w - 2, 2, 'rgba(0,0,0,.35)');
  R(c, x, y + 1, w, h - 2, OUT); R(c, x + 1, y, w - 2, h, OUT);
  R(c, x + 1, y + 1, w - 2, h - 2, v.col);
  R(c, x + 1, y + 1, w - 2, 1, 'rgba(255,255,255,.35)'); R(c, x + 1, y + h - 2, w - 2, 1, 'rgba(0,0,0,.25)');
  const glass = '#8fb8d8';
  if (v.type === 'bus') {
    for (let i = 4; i < w - 6; i += 5) R(c, x + i, y + 2, 3, h - 4, i === 4 || i > w - 12 ? glass : '#b0c8dc');
    R(c, x + 3, y + 3, w - 6, h - 6, v.col); for (let i = 6; i < w - 8; i += 8) R(c, x + i, y + 4, 4, h - 8, '#c8d0d8');
  } else if (v.type === 'moto') {
    R(c, x + 2, y + 2, w - 4, h - 4, '#222'); R(c, x + w / 2 - 2, y + 1, 4, h - 2, v.col);
    R(c, x + (d > 0 ? 3 : w - 7), y + 1, 4, h - 2, '#5a3a22');
  } else {
    const fw = d > 0 ? x + w - 9 : x + 5, rw = d > 0 ? x + 3 : x + w - 6;
    R(c, fw, y + 2, 4, h - 4, glass); R(c, rw, y + 2, 3, h - 4, glass);
    R(c, Math.min(fw, rw) + 4, y + 2, Math.abs(fw - rw) - 3, h - 4, mix(v.col, '#000000', .2));
    if (v.type === 'taxi') { R(c, x + w / 2 - 2, y + h / 2 - 1, 4, 2, '#fff'); }
  }
  const fx = d > 0 ? x + w - 1 : x, bxp = d > 0 ? x : x + w - 1;
  R(c, fx, y + 1, 1, 2, '#fff7b0'); R(c, fx, y + h - 3, 1, 2, '#fff7b0');
  const br = v.braking ? '#ff3030' : '#7a1515';
  R(c, bxp, y + 1, 1, 2, br); R(c, bxp, y + h - 3, 1, 2, br);
  if (v.braking) { c.globalAlpha = .35; R(c, bxp - d * 3, y, 3, h, '#ff3030'); c.globalAlpha = 1; }
  if (v.driverOut) {
    const hx = d > 0 ? x + w - 12 : x + 8;
    R(c, hx - 2, y - 4, 5, 5, OUT); R(c, hx - 1, y - 3, 3, 3, v.skin); R(c, hx - 1, y - 4, 3, 1, '#222');
    if (Math.floor(G.t * 8) % 2) R(c, hx + 2, y - 6, 2, 2, v.skin);
  }
}
function drawMirTop(c, x, y, walk, o = {}) {
  x = Math.round(x); y = Math.round(y);
  R(c, x - 5, y + 3, 10, 3, 'rgba(0,0,0,.3)');
  const f = Math.floor(walk * 4) % 2;
  R(c, x - 3, y + 2 + (f ? 1 : 0), 2, 3, '#1d1a1c'); R(c, x + 1, y + 2 + (f ? 0 : 1), 2, 3, '#1d1a1c');
  R(c, x - 6, y - 3, 12, 6, OUT); R(c, x - 5, y - 2, 10, 4, MIR.shirt); R(c, x - 5, y + 1, 10, 1, MIR.shirtD);
  R(c, x - 7, y - 2 + (f ? 1 : -1), 2, 3, MIR.skin); R(c, x + 5, y - 2 + (f ? -1 : 1), 2, 3, MIR.skin);
  R(c, x - 4, y - 3, 8, 2, MIR.scarf); R(c, x - 5, y - 1, 2, 3, MIR.scarfD);
  R(c, x - 4, y - 8, 8, 7, OUT); R(c, x - 3, y - 7, 6, 5, MIR.hair); R(c, x - 2, y - 6, 2, 1, MIR.hairL);
  if (o.angry) { R(c, x - 6, y - 12, 1, 3, '#ff5252'); R(c, x + 5, y - 12, 1, 3, '#ff5252'); }
}
SCENES.c2_frogger = () => {
  const rng = srand(5);
  const bg = makeCanvas(W, H, (c) => {
    // calçada de cima
    R(c, 0, 0, W, 38, '#9a958c'); for (let x = 0; x < W; x += 12) for (let y = 0; y < 36; y += 12) R(c, x + ((y / 12) % 2) * 6, y, 11, 11, '#a7a297');
    R(c, 0, 0, W, 6, '#4a4540'); for (let x = 0; x < W; x += 30) R(c, x, 0, 26, 5, ['#6a4a3a', '#3a4a6a', '#5a5a4a'][(x / 30) % 3]);
    R(c, 0, 36, W, 4, '#c9c4b8'); R(c, 0, 39, W, 1, '#6a665e');
    // ponto de ônibus
    R(c, 234, 8, 68, 20, '#2a2a30'); R(c, 236, 10, 64, 16, '#4a6a8a'); R(c, 236, 10, 64, 2, '#6a8aaa'); pixText(c, 'ONIBUS', 268, 15, '#ffd54a', 1, 'center');
    R(c, 120, 8, 60, 22, '#2a2a30'); R(c, 122, 10, 56, 18, '#1f4a6a'); pixText(c, 'GAUDE AI', 150, 12, '#fff', 1, 'center'); pixText(c, 'SEM TRANSITO', 150, 20, '#7fd4ff', 1, 'center');
    R(c, 222, 6, 3, 30, '#555'); R(c, 218, 4, 11, 7, '#1e5aa8'); pixText(c, 'P', 223, 5, '#fff');
    // asfalto
    R(c, 0, 40, W, 96, '#3a3d44');
    for (let i = 0; i < 1400; i++) R(c, Math.floor(rng() * W), 40 + Math.floor(rng() * 96), 1, 1, rng() < .5 ? '#34373e' : '#42454c');
    for (let i = 1; i < 4; i++) { if (i === 2) { R(c, 0, laneY(i) - 1, W, 1, '#e3c34a'); R(c, 0, laneY(i) + 1, W, 1, '#e3c34a'); } else for (let x = 0; x < W; x += 16) R(c, x, laneY(i), 8, 1, '#d8d8d8'); }
    // a faixa
    for (let y = 42; y < 134; y += 6) R(c, 140, y, 38, 3, '#e8e8e2');
    // manchas e bueiro
    c.globalAlpha = .25; R(c, 60, 70, 18, 6, '#111'); R(c, 250, 110, 26, 5, '#111'); c.globalAlpha = 1;
    R(c, 90, 118, 8, 8, '#2a2a2a'); for (let i = 0; i < 4; i++) R(c, 91, 119 + i * 2, 6, 1, '#555');
    // calçada de baixo + prédio
    R(c, 0, 136, W, 4, '#c9c4b8'); R(c, 0, 136, W, 1, '#6a665e');
    R(c, 0, 140, W, 28, '#9a958c'); for (let x = 0; x < W; x += 12) for (let y = 140; y < 168; y += 12) R(c, x + (((y - 140) / 12) % 2) * 6, y, 11, 11, '#a7a297');
    R(c, 0, 168, W, 12, '#2c3340'); R(c, 0, 168, W, 2, '#59636f'); R(c, 40, 168, 40, 12, '#1a1e26'); pixText(c, 'CORP S.A.', 60, 172, '#8a96a6', 1, 'center');
    // árvores
    for (const [x, y] of [[20, 18], [84, 20], [196, 16], [26, 152], [230, 154], [300, 152]]) {
      R(c, x - 8, y - 6, 16, 12, '#1f5a2a'); R(c, x - 6, y - 8, 12, 16, '#1f5a2a'); R(c, x - 5, y - 6, 9, 8, '#2f7a3f'); R(c, x - 3, y - 5, 4, 3, '#4a9a5a');
    }
    // semáforo de pedestre
    R(c, 128, 140, 3, 18, '#333'); R(c, 124, 132, 11, 10, '#1a1a1a');
  });
  const m = { x: 60, y: 156, walk: 0, stun: 0, vx: 0, vy: 0, h: 14 };
  const cars = [];
  const parts = new Parts();
  const skids = [];
  const sc = {
    music: 'rage', amb: 'city', capY: 44, pat: 100, rev: 0, shoutWin: 0, fury: 0, t: 0, spawnT: LANES.map(() => rnd(.2, 1.5)), shoutCD: 0, won: false, script: null, honks: 0,
    enter() {
      // pré-povoa as faixas
      for (let i = 0; i < 4; i++) for (let k = 0; k < 2; k++) this.spawn(i, rnd(0, W));
      this.script = new Script((function* () {
        yield bigText('A FAIXA DO FODA-SE', 1.6, { size: 13, zoom: true, col: '#ffd54a' });
        Balloons.add(null, 'O sinal nunca abre. Atravesse mesmo assim: os carros freiam. Parado, sua PACIÊNCIA acaba. Quando buzinarem: ' + Input.label('b') + ' = Gritar de Volta.', { type: 'caption', auto: 6, bottom: true });
      })());
    },
    spawn(lane, x) {
      const r = Math.random(), d = LANES[lane].dir;
      const type = r < .12 ? 'bus' : r < .3 ? 'moto' : r < .38 ? 'taxi' : 'car';
      const w = type === 'bus' ? 46 : type === 'moto' ? 12 : rnd(22, 28) | 0, h = type === 'bus' ? 14 : type === 'moto' ? 6 : 12;
      const vmax = LANES[lane].v * rnd(.85, 1.15) * (type === 'moto' ? 1.3 : type === 'bus' ? .8 : 1);
      if (x == null) x = d > 0 ? -w - 4 : W + 4;
      for (const o of cars) if (o.lane === lane && Math.abs(o.x - x) < w + 14) return;
      cars.push({ lane, x, w, h, v: vmax, vmax, type, col: type === 'taxi' ? '#f2c12e' : pick(CAR_COLS), braking: false, honkT: rnd(.3, .9), driverOut: false, skin: pick(['#e3b78f', '#9a6644', '#5e3a26', '#c98e6a']) });
    },
    mBox() { return { x: m.x - 4, y: m.y - 5, w: 8, h: 9 }; },
    update(dt) {
      this.t += dt;
      if (this.script) { this.script.update(dt); if (this.script.done) this.script = null; }
      // movimento do Mirango (8 direções)
      let ix = 0, iy = 0;
      if (!this.won && m.stun <= 0) { if (Input.down('left')) ix--; if (Input.down('right')) ix++; if (Input.down('up') || Input.down('jump')) iy--; if (Input.down('down')) iy++; }
      const sp = 17 * (1 + this.rev / 80) * (this.fury > 0 ? 1.7 : 1);
      const n = Math.hypot(ix, iy) || 1;
      if (m.stun > 0) { m.stun -= dt; m.x += m.vx * dt; m.y += m.vy * dt; m.vx *= .9; m.vy *= .9; }
      else { m.x += ix / n * sp * dt; m.y += iy / n * sp * dt; }
      m.x = clamp(m.x, 6, W - 6); m.y = clamp(m.y, 6, 166);
      const moving = (ix || iy) && m.stun <= 0;
      if (moving) { const ow = m.walk; m.walk += sp * dt / 12; if (Math.floor(ow * 2) !== Math.floor(m.walk * 2)) sfx('step'); }
      // paciência
      if (!this.won) {
        if (!moving) this.pat -= (m.y > 136 ? 15 : 11) * dt; else this.pat = Math.min(100, this.pat + 4 * dt);
        if (this.pat <= 0) {
          this.pat = 55; m.stun = 1.2; m.vx = 0; m.vy = 0; sfx('shout'); G.shake(3);
          for (let i = 0; i < 10; i++) parts.add({ x: m.x + rnd(-4, 4), y: m.y - 8, vx: rnd(-10, 10), vy: rnd(-30, -10), life: rnd(.5, 1), col: '#e8e8e8', type: 'smoke', s: 2 });
        }
      }
      // grito
      this.shoutWin -= dt; this.shoutCD -= dt;
      if (Input.pressed('b') && this.shoutCD <= 0 && !this.won) {
        this.shoutCD = .5;
        const big = this.shoutWin > 0;
        sfx('shout'); G.shake(big ? 3 : 1);
        if (big) sayAuto({ x: m.x, y: m.y, h: 14 }, big ? pick(['VAI VOCÊ!', 'EU TÔ COM PRESSA TAMBÉM!', 'BUZINA PRO SEU CHEFE!', 'NÃO SOU OBRIGADO!', 'O SINAL NUNCA ABRE!', 'ME DEMITI HOJE, AMIGO!']) : 'HMPF!', big ? 1.3 : .6, { type: 'shout', world: false });
        this.rev = Math.min(100, this.rev + (big ? 24 : 3));
        if (big) { this.shoutWin = 0; for (const v of cars) v.driverOut = false; }
        if (this.rev >= 100) {
          this.rev = 0; this.fury = 3.6; sfx('brake'); G.flash('#ff3030', .5);
          G.overlays.push({ t: 0, dur: 1.2, draw(cc, o) { o.t += 1 / 60; if (o.t > o.dur) G.overlays = G.overlays.filter(v => v !== o); T(cc, 'FÚRIA!', W / 2, 70, { size: 20, align: 'center', col: '#ff5252', shc: '#000', sd: 2 }); } });
        }
      }
      this.fury -= dt;
      // carros
      for (let i = 0; i < 4; i++) { this.spawnT[i] -= dt; if (this.spawnT[i] <= 0) { this.spawnT[i] = rnd(1.3, 3) * 80 / LANES[i].v; this.spawn(i); } }
      const mb = this.mBox();
      for (const v of cars) {
        const d = LANES[v.lane].dir, ly = laneY(v.lane), front = d > 0 ? v.x + v.w : v.x;
        let target = v.vmax;
        for (const o of cars) {
          if (o === v || o.lane !== v.lane) continue;
          const gap = d > 0 ? o.x - front : v.x - (o.x + o.w);
          if (gap > -2 && gap < 14 + v.v * .15) target = Math.min(target, gap < 6 ? 0 : o.v);
        }
        let inLane = mb.y + mb.h > ly + 2 && mb.y < ly + LH - 2, dist = d > 0 ? mb.x - front : v.x - (mb.x + mb.w);
        const blocking = inLane && dist > -(v.w + 10) && dist < 36 + v.v * v.v / 700;
        if (blocking || this.fury > 0) target = 0;
        if (blocking && dist < 10) { v.v = 0; }  // nunca atropela: freia na hora
        const wasFast = v.v > 45;
        v.braking = target < v.v - 1;
        v.v = v.braking ? Math.max(target, v.v - 420 * dt) : Math.min(target, v.v + 70 * dt);
        if (v.braking && wasFast && (blocking || this.fury > 0) && !v.skidSnd) { v.skidSnd = true; sfx('screech'); skids.push({ x: front - d * 18, y: ly + 5, w: 18, t: 0 }); }
        if (!v.braking) v.skidSnd = false;
        v.x += d * v.v * dt;
        // buzina
        if (v.v < 3 && inLane && dist < 46 && dist > -6 && !this.won) {
          v.honkT -= dt;
          if (v.honkT <= 0) {
            v.honkT = rnd(1.6, 2.4); v.driverOut = true; sfx('honk'); this.shoutWin = 1.7; this.honks++;
            const hx = d > 0 ? v.x + v.w - 10 : v.x + 10;
            if (this.honks % 2 === 1) sayAuto({ x: hx, y: ly, h: 6 }, pick(['BIIIIII!', 'SAI DA FRENTE, MALUCO!', 'TÁ CEGO?!', 'FON FON!', 'Ô LOUCO!', 'O SINAL TÁ VERMELHO!']), 1.2, { world: false });
          }
        } else if (v.v > 10) v.driverOut = false;
      }
      for (let i = cars.length - 1; i >= 0; i--) if (cars[i].x < -70 || cars[i].x > W + 70) cars.splice(i, 1);
      for (const s of skids) s.t += dt; while (skids.length > 30) skids.shift();
      parts.update(dt);
      // chegou ao ponto
      if (!this.won && m.y < 34) {
        this.won = true; sfx('ok');
        this.script = new Script((function* () {
          yield bigText('ATRAVESSOU!', 1.2, { size: 14, zoom: true, col: '#7aff9a' });
          G.go('c2_stop');
        })());
      }
    },
    draw(c) {
      c.drawImage(bg, 0, 0);
      for (const s of skids) { c.globalAlpha = Math.max(0, .5 - s.t * .03); R(c, Math.round(s.x), s.y, s.w, 1, '#111'); R(c, Math.round(s.x), s.y + 8, s.w, 1, '#111'); c.globalAlpha = 1; }
      // boneco vermelho do semáforo
      R(c, 125, 133, 9, 8, '#2a0a0a'); const on = Math.floor(G.t * 2) % 2 || true;
      if (on) { R(c, 128, 134, 3, 2, '#ff3030'); R(c, 127, 136, 5, 3, '#ff3030'); R(c, 128, 139, 1, 1, '#ff3030'); R(c, 130, 139, 1, 1, '#ff3030'); }
      for (const v of cars) drawCarTop(c, v);
      drawMirTop(c, m.x, m.y, m.walk, { angry: this.fury > 0 || this.shoutWin > 0 });
      parts.draw(c);
      if (this.fury > 0) { c.globalAlpha = .12 + Math.sin(G.t * 20) * .05; R(c, 0, 0, W, H, '#ff2020'); c.globalAlpha = 1; }
    },
    ui(c) {
      hudBar(c, 6, 10, 64, 'PACIÊNCIA', this.pat / 100, '#7ad0ff', '#3a90c0');
      hudBar(c, 6, 27, 64, 'REVOLTA', this.rev / 100, '#ff5252', '#b02020');
      if (this.shoutWin > 0 && !this.won) promptAt(c, m.x, m.y - 30, 'b', 'Gritar de Volta');
      T(c, 'buzinadas: ' + this.honks, W - 6, 4, { f: FONT2, size: 9, align: 'right', col: '#fff' });
    }
  };
  return sc;
};

/* ---------- Cena: o ônibus vai embora + carrinho de paçoca ---------- */
const STREET_FLOOR = 158;
let _streetBG = null;
function buildStreet() {
  if (_streetBG) return _streetBG;
  const rng = srand(12);
  _streetBG = makeCanvas(W, H, (c) => {
    vgrad(c, 0, 0, W, 120, ['#e8804a', '#f2a65a', '#f7d08a']);
    R(c, 250, 22, 18, 18, '#ffe0a0'); R(c, 252, 20, 14, 22, '#ffe0a0'); R(c, 248, 24, 22, 14, '#ffe0a0');
    skyline(c, -5, W + 10, 104, rng, { col: '#c7765a', win: '#d48a6a', hmin: 30, hmax: 70 });
    skyline(c, -5, W + 10, 112, rng, { col: '#8a4a3a', win: '#9a5a48', lit: '#ffd77a', litP: .05, hmin: 20, hmax: 55 });
    // outdoor de IA
    R(c, 96, 34, 92, 34, '#2a2a30'); R(c, 98, 36, 88, 30, '#1f4a6a'); pixText(c, 'GAUDE AI', 142, 40, '#fff', 2, 'center'); pixText(c, 'DEIXA QUE A IA', 142, 53, '#7fd4ff', 1, 'center'); pixText(c, 'TRABALHA POR VOCE', 142, 59, '#7fd4ff', 1, 'center');
    R(c, 116, 68, 3, 12, '#2a2a30'); R(c, 166, 68, 3, 12, '#2a2a30');
    // lojas
    const shops = [[0, 70, 'PADARIA', '#c43b3b'], [74, 64, 'FARMACIA', '#2e7d32'], [142, 80, 'LOTERIAS', '#1e5aa8'], [226, 94, 'BAR DO ZE', '#e3a32a']];
    for (const [x, w, n, col] of shops) {
      R(c, x, 78, w - 2, 40, '#6a4a3e'); R(c, x, 78, w - 2, 2, '#8a6a5e');
      R(c, x + 2, 92, w - 6, 24, '#2a2228'); for (let i = x + 4; i < x + w - 6; i += 10) R(c, i, 94, 8, 20, '#3a3a48');
      R(c, x + 1, 82, w - 4, 8, col); pixText(c, n, x + (w - 2) / 2, 84, '#fff', 1, 'center');
      for (let i = x; i < x + w - 2; i += 6) { R(c, i, 90, 3, 3, col); R(c, i + 3, 90, 3, 3, '#f3efe6'); }
    }
    // rua e calçada
    R(c, 0, 118, W, 24, '#3a3a40'); for (let x = 0; x < W; x += 20) R(c, x, 129, 10, 1, '#d8d8d8');
    R(c, 0, 140, W, 4, '#b8b0a0'); R(c, 0, 143, W, 1, '#6a665e');
    R(c, 0, 144, W, 36, '#a39a8c'); for (let x = 0; x < W; x += 16) R(c, x, 144, 1, 36, '#8f877a'); R(c, 0, 160, W, 1, '#8f877a');
    // poste e lixeira

  });
  return _streetBG;
}
function streetFront(c) {
  // poste e lixeira ficam na calçada: na frente de qualquer veículo
  R(c, 2, 60, 3, 98, '#3a3a40'); R(c, 2, 60, 14, 3, '#3a3a40'); R(c, 12, 62, 6, 3, '#ffe9a0');
  R(c, 300, 140, 10, 18, '#2e7d32'); R(c, 299, 139, 12, 2, '#1f5a22');
}
function drawBusSide(c, x, y, col = '#1e5aa8', lit) {
  // y = base (rodas no chão)
  x = Math.round(x);
  R(c, x, y - 46, 130, 40, OUT); R(c, x + 1, y - 45, 128, 38, col); R(c, x + 1, y - 45, 128, 3, '#7ab0e8');
  R(c, x + 1, y - 20, 128, 6, '#f3efe6'); R(c, x + 1, y - 18, 128, 2, '#d8323c');
  for (let i = 0; i < 7; i++) R(c, x + 18 + i * 15, y - 40, 12, 14, lit ? '#ffe9a0' : '#9ac4e0');
  R(c, x + 2, y - 40, 12, 32, '#9ac4e0'); R(c, x + 3, y - 40, 4, 32, '#bcd8ec');
  R(c, x + 114, y - 40, 12, 14, '#9ac4e0');
  R(c, x + 124, y - 14, 4, 3, '#ffe9a0'); R(c, x + 1, y - 14, 3, 3, '#ff3030');
  R(c, x + 40, y - 46, 52, 7, '#111'); pixText(c, '310 LAPA', x + 66, y - 45, '#ffb030', 1, 'center');
  for (const wx of [x + 22, x + 100]) { R(c, wx - 1, y - 9, 16, 10, OUT); R(c, wx, y - 8, 14, 8, '#222'); R(c, wx + 4, y - 6, 6, 4, '#777'); }
}
function drawCart(c, x, y) {
  R(c, x - 2, y - 26, 44, 20, OUT); R(c, x - 1, y - 25, 42, 18, '#e8c46a'); R(c, x - 1, y - 25, 42, 3, '#f8dc8a');
  pixText(c, 'PACOCA', x + 20, y - 20, '#c43b3b', 1, 'center'); pixText(c, 'R$ 1', x + 20, y - 13, '#3a2a14', 1, 'center');
  for (let i = 0; i < 3; i++) { R(c, x + 3 + i * 13, y - 34, 9, 9, '#cfe6f0'); R(c, x + 4 + i * 13, y - 30, 7, 4, ['#c9a05a', '#d87a3a', '#e3c34a'][i]); }
  R(c, x + 18, y - 64, 2, 32, '#555');
  for (let i = 0; i < 8; i++) R(c, x - 6 + i * 7, y - 66 + Math.abs(i - 3.5) * 1.5, 7, 4, i % 2 ? '#fff' : '#d8323c');
  R(c, x - 6, y - 70, 56, 4, '#d8323c'); R(c, x + 2, y - 73, 40, 3, '#fff');
  R(c, x + 2, y - 5, 6, 6, OUT); R(c, x + 3, y - 4, 4, 4, '#555'); R(c, x + 32, y - 5, 6, 6, OUT); R(c, x + 33, y - 4, 4, 4, '#555');
}
SCENES.c2_stop = () => {
  const bg = buildStreet();
  const m = npc(LOOKS.mirango, -10, STREET_FLOOR, { face: 1 });
  const zé = npc(LOOKS.vendedor, 298, STREET_FLOOR, { face: -1 });
  const ap = npc(LOOKS.apressado, 340, STREET_FLOOR, { face: -1 });
  const parts = new Parts();
  const sc = {
    music: 'rage', amb: 'city', busX: 110, busV: 0,
    enter() { this.script = new Script(this.run()); },
    *run() {
      yield walkTo(m, 80, 85);
      m.pose = { arms: 'up', mouth: 'shout' }; sfx('door');
      sc.busV = 1;
      yield shout(m, 'EI! ESPERA! ESPERAAA!', { auto: 1.2 });
      yield walkTo(m, 150, 90);
      yield Tk.until(() => sc.busX > W + 20);
      m.pose = { arms: 'fist', mouth: 'sad' }; G.shake(1);
      yield think(m, 'Ótimo. Simplesmente ótimo. Nem o ônibus me espera.');
      m.pose = {};
      yield think(m, '...Pelo menos tem paçoca.');
      yield walkTo(m, 236, 50);
      yield say(m, 'Uma paçoca, por favor.');
      zé.pose = { arms: 'out' };
      yield say(zé, 'É a última, freguês! Saindo...', { name: 'SEU ZÉ' });
      yield walkTo(ap, 322, 140);
      ap.pose = { arms: 'point', mouth: 'open' };
      yield say(ap, 'EI! Essa paçoca é MINHA! Tô atrasado pra uma reunião de alinhamento!', { name: 'APRESSADO' });
      m.face = 1; m.pose = { arms: 'fist' };
      yield say(m, 'Reunião de alinhamento? Ah, agora é pessoal.');
      zé.pose = { arms: 'up' }; zé.face = 1;
      yield say(zé, 'Ô ô ô! Calma! Aqui se resolve na HONRA.', { name: 'SEU ZÉ' });
      zé.face = -1;
      yield say(zé, 'Duelo de Jokenpô. Melhor de três. Valendo a última paçoca!', { name: 'SEU ZÉ' });
      G.flash('#fff', 1); sfx('punch');
      yield bigText('DUELO!', 1, { size: 24, zoom: true, col: '#ffd54a' });
      G.go('c2_fight', { cut: true });
    },
    update(dt) {
      if (this.script) this.script.update(dt);
      if (this.busV) { this.busV = Math.min(90, this.busV + 50 * dt); this.busX += this.busV * dt; if (Math.random() < .5) parts.add({ x: this.busX, y: 146, vx: rnd(-20, -5), vy: rnd(-12, -4), life: rnd(1, 2), col: pick(['#111', '#222', '#333']), type: 'smoke', s: 3 }); }
      parts.update(dt);
    },
    draw(c) {
      c.drawImage(bg, 0, 0);
      drawBusSide(c, this.busX, 142);
      streetFront(c);
      // abrigo do ponto
      R(c, 150, 102, 70, 4, '#2a2a30'); R(c, 152, 106, 2, 50, '#555'); R(c, 216, 106, 2, 50, '#555'); R(c, 160, 136, 50, 3, '#6a4a3a');
      c.globalAlpha = .3; R(c, 154, 106, 62, 30, '#9ac4e0'); c.globalAlpha = 1;
      drawCart(c, 248, STREET_FLOOR);
      zé.draw(c); ap.draw(c); m.draw(c);
      if (zé.pose.arms === 'out') { R(c, zé.x - 12, 136, 5, 4, '#c9a05a'); R(c, zé.x - 12, 136, 5, 1, '#e3c88a'); }
      parts.draw(c);
    }
  };
  return sc;
};

/* ---------- Minigame 2: O Duelo da Paçoca (jogo de luta + jokenpô) ---------- */
const HANDS = {
  pedra: ['..XXXXX..', '.XXXXXXX.', 'XXXXXXXXX', 'XXXXXXXXX', 'XXXXXXXXX', '.XXXXXXXX', '..XXXXXX.', '...XXXX..', '...XXXX..'],
  papel: ['.X.X.X...', '.X.X.X.X.', '.X.X.X.X.', '.XXXXXXX.', 'XXXXXXXX.', '.XXXXXXX.', '..XXXXX..', '...XXXX..', '...XXXX..'],
  tesoura: ['.X...X...', '.X..X....', '..X.X....', '..XXX....', '.XXXXXX..', '.XXXXXXX.', '..XXXXX..', '...XXXX..', '...XXXX..']
};
function drawHand(c, k, x, y, s, skin, flip) {
  const g = HANDS[k];
  for (let pass = 0; pass < 2; pass++) for (let r = 0; r < 9; r++) for (let q = 0; q < 9; q++) {
    if (g[r][q] !== 'X') continue; const qq = flip ? 8 - q : q;
    if (pass === 0) R(c, x + qq * s - s, y + r * s - s, s * 3, s * 3, OUT);
    else R(c, x + qq * s, y + r * s, s, s, r > 6 ? '#a7b0ba' : skin);
  }
}
const BEATS = { pedra: 'tesoura', tesoura: 'papel', papel: 'pedra' };
const LOSES_TO = { pedra: 'papel', tesoura: 'pedra', papel: 'tesoura' };
SCENES.c2_fight = () => {
  const bg = buildStreet();
  const crowd = Array.from({ length: 18 }, (_, i) => ({ x: i * 19 + rnd(-4, 4), h: rnd(16, 26), c: pick(['#3a2a3a', '#2a2a3a', '#4a3a3a', '#2a3a3a']), ph: rnd(6) }));
  const zé = npc(LOOKS.vendedor, 160, 128, { face: 1 });
  const A = { x: 92, y: 162, face: 1, look: LOOKS.mirango, hp: 1, pose: {}, rot: 0, k: 'mir' };
  const B = { x: 228, y: 162, face: -1, look: LOOKS.apressado, hp: 1, pose: {}, rot: 0, k: 'ap' };
  const parts = new Parts();
  const sc = {
    music: 'fight', amb: 'city', round: 0, score: [0, 0], choosing: false, sel: 0, choice: null, ch: ['pedra', 'papel', 'tesoura'], reveal: null, count: '', t: 0, vig: .2, bullet: 0,
    enter() { this.script = new Script(this.run()); },
    *jo(slow) {
      const step = slow ? 1 : .42;
      for (const w of ['JO...', 'KEN...', 'PÔ!']) {
        this.count = w; A.pose = { arms: 'fist' }; B.pose = { arms: 'fist' }; this.pump = 1;
        if (slow) { sfx('heart'); G.shake(1); } else sfx('sel');
        yield step;
      }
      this.count = '';
    },
    *choose() {
      this.choosing = true; this.choice = null; this.chT = 7;
      yield Tk.until(() => this.choice != null);
      this.choosing = false; sfx('ok');
    },
    *hit(att, def, perfect, ko) {
      const x0 = att.x, dir = att.face;
      att.pose = { arms: 'out', mouth: 'shout' };
      yield { t: 0, update(dt) { this.t += dt; att.x = lerp(x0, def.x - dir * 30, Math.min(1, this.t / .18)); return this.t >= .18; } };
      sfx('punch'); G.shake(ko ? 10 : 5); G.flash('#fff', .5);
      parts.burst(def.x - dir * 10, def.y - 40, 16, { col: ['#fff', '#ffd54a', '#ff8a3a'], min: 40, max: 140, lmax: .4 });
      def.pose = { eyes: 'closed', mouth: 'open' };
      const hp0 = def.hp;
      if (ko) {
        sfx('ko'); G.slow = .35;
        yield { t: 0, update(dt) { this.t += dt; def.x += dir * 260 * dt; def.y = 162 - Math.sin(Math.min(1, this.t / 1.1) * Math.PI) * 60; def.rot += dir * 12 * dt; def.hp = Math.max(0, hp0 - .5, hp0 - this.t * 3); return this.t > 1.1; } };
        G.slow = 1;
      } else {
        yield { t: 0, update(dt) { this.t += dt; def.x += dir * 120 * dt * (1 - this.t * 2); def.hp = Math.max(0, hp0 - .5, hp0 - this.t * 3); return this.t >= .4; } };
        def.rot = dir * 1.5; def.y = 168; sfx('thud'); G.shake(3);
      }
      yield { t: 0, update(dt) { this.t += dt; att.x = lerp(def.x - dir * 30, x0, Math.min(1, this.t / .3)); return this.t >= .3; } };
      att.pose = { arms: 'fist' };
    },
    reset() { A.x = 92; A.y = 162; A.rot = 0; A.pose = {}; B.x = 228; B.y = 162; B.rot = 0; B.pose = {}; this.reveal = null; },
    *run() {
      yield bigText('O DUELO DA PAÇOCA', 1.6, { size: 13, zoom: true, col: '#ffd54a' });
      yield say(zé, 'Melhor de três! Cada vitória tira metade da vida. Duas e é nocaute!', { name: 'SEU ZÉ — JUIZ', auto: 2.6 });
      for (let r = 1; r <= 3; r++) {
        this.round = r; this.reset();
        sfx('punch'); yield bigText('ROUND ' + r, 1.1, { size: 18, zoom: true });
        yield bigText(r === 3 ? 'ÚLTIMO ROUND!' : 'JOKENPÔ!', .9, { size: 14, col: '#ffd54a' });
        yield* this.choose();
        const mc = this.choice;
        const oc = r === 1 ? LOSES_TO[mc] : BEATS[mc];
        if (r === 3) {
          this.bullet = 1; Music.muffle(500); this.vig = .7; this.desat = .5;
          yield 0.5;
        }
        yield* this.jo(r === 3);
        this.reveal = [mc, oc]; sfx('swoosh'); G.shake(2);
        yield r === 3 ? 1.2 : .7;
        if (r === 3) { this.bullet = 0; Music.muffle(18000); this.vig = .2; this.desat = 0; }
        if (r === 1) {
          sayAuto(B, 'HÁ! Previsível!', 1.4, { name: 'APRESSADO' });
          yield* this.hit(B, A, false, false);
          this.score[1]++; sfx('hurt');
          yield bigText('0 x 1', 1.2, { size: 18, col: '#ff8a8a' });
          sayAuto(A, 'Foi só aquecimento...', 1.6, { type: 'thought' }); yield 1.2;
        } else if (r === 2) {
          yield* this.hit(A, B, true, false);
          this.score[0]++;
          yield bigText('PERFECT!', 1.2, { size: 20, zoom: true, col: '#7aff9a' });
          yield bigText('1 x 1', 1, { size: 18 });
        } else {
          yield* this.hit(A, B, false, true);
          this.score[0]++; sfx('crowd');
          for (let i = 0; i < 40; i++) parts.add({ x: rnd(W), y: -5, vx: rnd(-20, 20), vy: rnd(30, 80), life: 3, col: pick(['#ffd54a', '#d8323c', '#7ad0ff', '#7aff9a']), s: 2 });
          yield bigText('K.O.', 1.8, { size: 34, zoom: true, col: '#ff3030', shc: '#000' });
        }
      }
      A.pose = { arms: 'up', mouth: 'smile' };
      zé.x = 160;
      yield say(zé, 'A paçoca é sua, campeão!', { name: 'SEU ZÉ' });
      A.pose = { arms: 'hold' }; this.pacoca = true; sfx('coin');
      yield think(A, 'O doce sabor da primeira vitória do dia.');
      yield caption('Lá vem o 310 Lapa...', { auto: 1.6 });
      G.go('c2_bus');
    },
    update(dt, rdt) {
      this.t += dt;
      if (this.script) this.script.update(dt);
      if (this.choosing) {
        this.chT -= rdt;
        if (Input.pressed('left')) { this.sel = (this.sel + 2) % 3; sfx('sel'); }
        if (Input.pressed('right')) { this.sel = (this.sel + 1) % 3; sfx('sel'); }
        if (Input.pressed('n1')) { this.sel = 0; this.choice = 'pedra'; }
        else if (Input.pressed('n2')) { this.sel = 1; this.choice = 'papel'; }
        else if (Input.pressed('n3')) { this.sel = 2; this.choice = 'tesoura'; }
        else if (Input.confirm()) this.choice = this.ch[this.sel];
        else if (this.chT <= 0) this.choice = this.ch[this.sel];
      }
      this.pump = Math.max(0, (this.pump || 0) - dt * 4);
      parts.update(dt);
    },
    drawFighter(c, F) {
      const bob = F.rot ? 0 : Math.round(Math.sin(this.t * 6 + (F.k === 'ap' ? 1 : 0)) * 1 + (this.pump || 0) * 2);
      drawPersonBig(c, F.x, F.y + bob, F.look, Object.assign({ face: F.face, rot2: F.rot }, F.pose), 2);
    },
    draw(c) {
      c.drawImage(bg, 0, 0);
      streetFront(c);
      c.globalAlpha = .45; R(c, 0, 0, W, H, '#2a0a14'); c.globalAlpha = 1;
      drawCart(c, 176, 128);
      zé.pose = { arms: this.count ? 'up' : undefined }; zé.draw(c);
      for (const p of crowd) { const y = 172 - p.h + Math.round(Math.sin(this.t * 5 + p.ph) * (this.round ? 1.5 : .5)); R(c, p.x, y, 14, p.h + 10, p.c); R(c, p.x + 3, y - 8, 8, 9, p.c); }
      R(c, 0, 162, W, 18, '#3a2a2a'); dither(c, 0, 162, W, 18, '#4a3434', 2);
      this.drawFighter(c, B); this.drawFighter(c, A);
      if (this.pacoca) { R(c, A.x + 14, A.y - 30, 7, 5, '#c9a05a'); R(c, A.x + 14, A.y - 30, 7, 1, '#e3c88a'); }
      if (this.reveal) {
        drawHand(c, this.reveal[0], A.x + 10, 52, 3, MIR.skin, false);
        drawHand(c, this.reveal[1], B.x - 38, 52, 3, LOOKS.apressado.skin, true);
      }
      parts.draw(c);
    },
    ui(c) {
      // barras de vida estilo luta
      const bar = (x, w, v, name, right) => {
        pxBox(c, x, 8, w + 4, 10, '#1a0a0a', '#f3efe6');
        R(c, x + 2, 10, w, 6, '#5a1010');
        const fw = Math.round(w * v); R(c, right ? x + 2 + w - fw : x + 2, 10, fw, 6, v > .5 ? '#ffd54a' : '#ff8a3a'); R(c, right ? x + 2 + w - fw : x + 2, 10, fw, 2, 'rgba(255,255,255,.4)');
        R(c, x + 2 + w / 2 - .5, 9, 1, 8, '#f3efe6');
        T(c, name, right ? x + w + 4 : x, 21, { size: 5, align: right ? 'right' : 'left', col: '#fff' });
      };
      bar(8, 120, A.hp, 'MIRANGO', false); bar(188, 120, B.hp, 'APRESSADO', true);
      pxBox(c, 142, 4, 36, 22, '#1a0a0a', '#d8323c');
      T(c, this.score[0] + ' x ' + this.score[1], W / 2, 9, { size: 6, align: 'center', col: '#ffd54a' });
      T(c, 'R' + Math.max(1, this.round), W / 2, 18, { size: 4, align: 'center', col: '#cfc8dc' });
      for (let i = 0; i < 2; i++) { R(c, 30 + i * 8, 28, 5, 5, i < this.score[0] ? '#ffd54a' : '#3a2a2a'); R(c, 282 + i * 8, 28, 5, 5, i < this.score[1] ? '#ffd54a' : '#3a2a2a'); }
      if (this.count) T(c, this.count, W / 2, 70, { size: this.bullet ? 22 : 16, align: 'center', col: '#fff', shc: '#a1101e', sd: 2 });
      if (this.choosing) {
        const names = ['PEDRA', 'PAPEL', 'TESOURA'];
        T(c, 'ESCOLHA SUA JOGADA', W / 2, 104, { size: 6, align: 'center', col: '#ffd54a' });
        for (let i = 0; i < 3; i++) {
          const x = 88 + i * 52, on = i === this.sel;
          pxBox(c, x, 116, 40, 46, on ? '#d8323c' : 'rgba(20,10,14,.9)', on ? '#ffd54a' : '#f3efe6');
          T(c, names[i], x + 20, 154, { size: 4.5, align: 'center', col: '#fff' });
          T(c, String(i + 1), x + 4, 119, { size: 4, col: '#ffd54a' });
        }
        T(c, '← → escolher  •  ' + Input.label('a') + ' confirmar  •  ' + Math.ceil(this.chT) + 's', W / 2, 166, { f: FONT2, size: 9, align: 'center', col: '#cfc8dc' });
      }
    },
    uiTop(c) {
      if (!this.choosing) return;
      // ícones das mãos sobre os cartões (desenhados em alta resolução)
      for (let i = 0; i < 3; i++) drawHand(c, this.ch[i], 88 + i * 52 + 7, 121, 2.8, MIR.skin, false);
    }
  };
  return sc;
};

/* ---------- Minigame 3: Tetris Humano — a conquista do banco ---------- */
const BUS_W = 780, BUS_FLOOR = 150;
SCENES.c2_bus = () => {
  const rng = srand(31);
  // assento de ônibus de perfil (frente para a esquerda, onde fica o motorista)
  const seatP = (c, x, y, col = '#2a5aa8', dark) => {
    const cd = dark ? '#1e3a70' : '#1e4688';
    R(c, x - 1, y - 28, 6, 22, OUT); R(c, x, y - 27, 4, 20, col); R(c, x, y - 27, 1, 20, '#5a8ad8'); R(c, x - 1, y - 30, 6, 3, '#c9c9c9');
    R(c, x - 14, y - 10, 18, 5, OUT); R(c, x - 13, y - 9, 17, 3, col); R(c, x - 13, y - 9, 17, 1, '#5a8ad8'); R(c, x - 13, y - 6, 17, 1, cd);
    R(c, x - 8, y - 5, 2, 5, '#777'); R(c, x - 1, y - 5, 2, 5, '#777'); R(c, x - 10, y - 1, 12, 1, '#555');
  };
  const inner = makeCanvas(BUS_W, H, (c) => {
    // teto com luminárias
    R(c, 0, 0, BUS_W, 30, '#20252f'); R(c, 0, 30, BUS_W, 4, '#c9cdd2');
    for (let x = 60; x < BUS_W; x += 90) { R(c, x, 31, 40, 3, '#f4f8ff'); }
    // costado interno (bege) e faixa de anúncios
    vgrad(c, 0, 34, BUS_W, 116, ['#e2dccd', '#c4bba8']);
    R(c, 0, 36, BUS_W, 9, '#3a3f4a');
    const ads = ['GAUDE AI: TRABALHE ENQUANTO DORME', 'CURSO: SEJA SUBSTITUIDO COM DIGNIDADE', 'SEU CHEFE JA USA IA. E VOCE?', 'GAUDE AI - ELA NAO PEDE AUMENTO'];
    for (let i = 0, x = 110; x < BUS_W - 80; x += 170, i++) { R(c, x, 37, 150, 7, i % 2 ? '#d8323c' : '#1f4a6a'); pixText(c, ads[i % ads.length], x + 75, 38, '#fff', 1, 'center'); }
    // janelas com basculante (vazadas para ver a rua)
    for (let x = 100; x < BUS_W - 20; x += 60) {
      if (x > 380 && x < 470) continue; // porta do meio
      c.clearRect(x, 48, 54, 44);
      R(c, x - 2, 46, 58, 2, '#6a6458'); R(c, x - 2, 92, 58, 3, '#6a6458'); R(c, x + 26, 48, 2, 44, '#6a6458'); R(c, x - 2, 48, 2, 44, '#6a6458');
      R(c, x, 48, 54, 12, 'rgba(160,200,230,.35)'); R(c, x, 60, 54, 1, '#6a6458');
      if ((x / 60) % 3 === 1) { R(c, x + 30, 82, 22, 7, '#d8323c'); pixText(c, 'SAIDA', x + 41, 83, '#fff', 1, 'center'); }
    }
    R(c, 0, 95, BUS_W, 2, '#8a8478');
    // frente: para-brisa, motorista, porta dianteira e catraca
    c.clearRect(0, 40, 22, 60); R(c, 0, 40, 22, 2, '#555'); R(c, 20, 40, 3, 60, '#555');
    R(c, 0, 100, 34, 50, '#3a3f4a'); R(c, 6, 108, 16, 26, '#2a2f38'); R(c, 24, 104, 3, 14, '#222'); R(c, 18, 102, 14, 3, '#111');
    R(c, 36, 50, 26, 100, '#4a5058'); R(c, 38, 52, 10, 96, '#9ac4e0'); R(c, 50, 52, 10, 96, '#9ac4e0'); R(c, 48, 52, 2, 96, '#333');
    pixText(c, 'EMBARQUE', 49, 44, '#ffd54a', 1, 'center');
    R(c, 2, 34, 60, 8, '#111'); pixText(c, '310 LAPA', 32, 36, '#ffb030', 1, 'center');
    R(c, 70, 112, 16, 22, '#7a7f88'); R(c, 70, 112, 16, 2, '#a0a5ae'); R(c, 74, 120, 22, 2, '#c9cdd2'); R(c, 74, 126, 22, 2, '#c9cdd2'); pixText(c, 'CATRACA', 80, 104, '#5a5448', 1, 'center');
    R(c, 66, 100, 2, 50, '#e3c34a');
    // porta do meio (desembarque)
    R(c, 386, 50, 82, 100, '#4a5058'); R(c, 390, 54, 36, 92, '#9ac4e0'); R(c, 428, 54, 36, 92, '#9ac4e0'); R(c, 426, 54, 2, 92, '#333');
    R(c, 386, 146, 82, 4, '#ffd54a'); pixText(c, 'DESEMBARQUE', 427, 44, '#ffd54a', 1, 'center');
    R(c, 382, 80, 3, 5, '#d8323c'); R(c, 470, 80, 3, 5, '#d8323c');
    // caixa da roda traseira
    R(c, 560, 136, 60, 14, '#3a3a40'); R(c, 560, 136, 60, 2, '#5a5a62');
    // bancos ao fundo (de perfil, todos virados para a frente)
    for (let x = 118; x < 380; x += 28) seatP(c, x, 150);
    for (let x = 498; x < 560; x += 28) seatP(c, x, 150);
    for (let x = 640; x < 690; x += 28) seatP(c, x, 150);
    // banco do fundo (destino)
    R(c, 704, 112, 74, 38, '#6a6458'); seatP(c, 744, 150, '#2a5aa8'); seatP(c, 770, 150, '#2a5aa8');
    R(c, 712, 126, 8, 6, '#2a5aa8');
    // piso emborrachado
    R(c, 0, 150, BUS_W, 30, '#2f3034'); for (let x = 0; x < BUS_W; x += 4) R(c, x, 151, 2, 29, '#37383d');
    R(c, 0, 150, BUS_W, 1, '#55565c');
    // barra de apoio horizontal
    R(c, 0, 50, BUS_W, 2, '#d0d4d8');
    pixText(c, 'NAO FALE COM O MOTORISTA', 160, 98, '#6a6458');
  });
  const city = makeCanvas(W * 2, 60, (c, w, h) => { vgrad(c, 0, 0, w, h, ['#e88a5a', '#f2b47a']); skyline(c, 0, w, h, rng, { col: '#9a5a48', win: '#b07a62', lit: '#ffe0a0', litP: .1, hmin: 20, hmax: 55 }); });
  const hero = new Hero(96, BUS_FLOOR - 24, LOOKS.mirango); hero.speed = 58;
  const mA = heroActor(hero);
  const parts = new Parts();
  const obs = [
    { t: 'stand', x: 108, look: LOOKS.passA }, { t: 'bag', x: 172, w: 22, h: 14 }, { t: 'legs', x: 246, look: LOOKS.passC },
    { t: 'stand', x: 318, look: LOOKS.passB, grumpy: true }, { t: 'bag', x: 380, w: 16, h: 22 }, { t: 'stand', x: 446, look: LOOKS.passD, backpack: true },
    { t: 'legs', x: 520, look: LOOKS.colegaA }, { t: 'stand', x: 594, look: LOOKS.passC, grumpy: true }, { t: 'bag', x: 640, w: 20, h: 12 }
  ];
  const seated = [[118, LOOKS.passB], [174, LOOKS.passD], [258, LOOKS.colegaB], [342, LOOKS.passA], [498, LOOKS.passC], [526, LOOKS.passB], [668, LOOKS.passD]];
  const floor = { x: -20, y: BUS_FLOOR, w: BUS_W + 40, h: 30 };
  function solids() {
    const s = [floor];
    for (const o of obs) {
      if (o.t === 'stand' && !o.cleared) s.push({ x: o.x - 4, y: 40, w: 8, h: BUS_FLOOR - 40 });
      if (o.t === 'bag') s.push({ x: o.x, y: BUS_FLOOR - o.h, w: o.w, h: o.h });
      if (o.t === 'legs') s.push({ x: o.x, y: BUS_FLOOR - 5, w: 14, h: 5 });
    }
    return s;
  }
  const sc = {
    cam: { x: 0, y: 0 }, music: 'bus', amb: 'bus', t: 0, sway: 0, ev: null, evT: 5, stumble: 0, hold: false, qte: null, done: false, cityX: 0,
    enter() {
      this.script = new Script((function* () {
        hero.frozen = true;
        yield bigText('TETRIS HUMANO', 1.4, { size: 14, zoom: true, col: '#ffd54a' });
        Balloons.add(null, 'Chegue ao banco livre no fundo  •  ' + Input.label('down') + ' segurar nas curvas  •  ' + Input.label('a') + ' "Com licença!"  •  ' + Input.label('b') + ' empurrar', { type: 'caption', auto: 6, y: 4 });
        hero.frozen = false;
      })());
    },
    update(dt) {
      this.t += dt;
      if (this.script) { this.script.update(dt); if (this.script.done) this.script = null; }
      // balanço do ônibus
      let base = (Math.sin(this.t * .9) * .35 + Math.sin(this.t * 2.3 + 1) * .18);
      this.evT -= dt;
      if (!this.ev && this.evT <= 0 && !this.qte) { this.ev = { k: pick(['CURVA!', 'FREADA!', 'BURACO!', 'CURVA!']), t: 0, dir: Math.random() < .5 ? -1 : 1 }; if (this.ev.k === 'FREADA!') this.ev.dir = -1; sfx('alarm'); }
      if (this.ev) {
        this.ev.t += dt;
        if (this.ev.t > 1.2) { const k = this.ev.t - 1.2; base += this.ev.dir * 1.35 * Math.sin(Math.min(1, k / 1.4) * Math.PI); if (k < .05) { sfx(this.ev.k === 'FREADA!' ? 'brake' : 'swoosh'); G.shake(2); } }
        if (this.ev.t > 2.6) { this.ev = null; this.evT = rnd(4.5, 7.5); }
      }
      this.sway = base;
      this.cityX += dt * (60 + Math.sin(this.t * .3) * 20);
      // segurar
      this.hold = hero.onGround && Input.down('down') && !this.qte && !hero.frozen;
      const sol = solids();
      hero.update(dt, sol, { minX: 92, maxX: BUS_W - 6, parts: this.parts, speedMul: this.hold ? 0 : 1, upJump: false });
      hero.pose = this.hold ? { arms: 'up' } : hero.stun > 0 ? { rot: hero.face * -1.3, eyes: 'closed' } : {};
      // força do balanço
      if (!this.hold && !hero.frozen && !this.qte) {
        const push = this.sway * 34 * dt;
        const ox = hero.x; hero.x += push;
        for (const s of sol) if (!s.oneway && overlap(hero, s)) { hero.x = ox; break; }
        if (Math.abs(this.sway) > .9) { this.stumble += dt; if (this.stumble > .45 && hero.stun <= 0) { hero.stun = 1.1; hero.vx = Math.sign(this.sway) * 90; hero.vy = -60; this.stumble = 0; sfx('hurt'); sayAuto(mA, pick(['Ai!', 'Opa-opa-opa!', 'Uooou!']), 1, {}); } }
        else this.stumble = Math.max(0, this.stumble - dt);
      } else this.stumble = 0;
      // passageiros
      this.cur = null;
      if (!hero.frozen && !this.qte) {
        for (const o of obs) {
          if (o.t !== 'stand' || o.cleared || o.moving) continue;
          if (Math.abs(hero.cx - o.x) < 15 && hero.onGround) { this.cur = o; break; }
        }
        if (this.cur) {
          const o = this.cur;
          if (Input.pressed('a')) {
            sayAuto(mA, 'Com licença!', 1, {});
            if (o.grumpy && !o.asked) { o.asked = true; setTimeout(() => sayAuto({ x: o.x, y: BUS_FLOOR, h: 30 }, pick(['Hmpf.', 'Tá apertado pra todo mundo.', 'Não dá, não.']), 1.4, {}), 400); }
            else { o.moving = true; setTimeout(() => { o.cleared = true; o.moving = false; sayAuto({ x: o.x, y: BUS_FLOOR - 4, h: 30 }, pick(['Ah, claro...', 'Passa, passa.', 'Opa, foi mal.']), 1.2, {}); }, 500); }
          } else if (Input.pressed('b')) {
            hero.pose = { arms: 'out' }; sfx('punch'); o.cleared = true; o.shoved = .5; G.shake(2);
            sayAuto({ x: o.x, y: BUS_FLOOR - 4, h: 30 }, pick(['EI!!', 'Que isso, rapaz?!', 'GROSSO!']), 1.2, { type: 'shout' });
          }
        }
      }
      for (const o of obs) if (o.shoved) o.shoved = Math.max(0, o.shoved - dt);
      // clímax: QTE do assento
      if (!this.qte && !this.done && hero.cx > 676) {
        this.qte = { m: 0, r: 0, t: 0, rx: 790 }; hero.frozen = true; hero.vx = 0; sfx('alarm');
        sayAuto({ x: 760, y: BUS_FLOOR, h: 30 }, 'Esse banco é MEU!', 1.6, { name: 'PASSAGEIRA', type: 'shout' });
      }
      if (this.qte) {
        const q = this.qte; q.t += dt;
        if (Input.pressed('a') || Input.pressed('jump')) { q.m += .085; sfx('step'); hero.pose = { arms: 'out' }; }
        q.m = Math.max(0, q.m - .18 * dt); q.r += .2 * dt; q.rx = lerp(790, 744, Math.min(1, q.r));
        if (q.m >= 1) { this.qte = null; this.done = true; this.win(); }
        else if (q.r >= 1) {
          this.qte = null; hero.frozen = false; hero.x = 640; sfx('brake'); G.shake(4);
          this.script = new Script((function* () {
            yield say({ x: 744, y: BUS_FLOOR, h: 30 }, 'Hahá! Ops... é meu ponto. Fica pra você.', { name: 'PASSAGEIRA' });
            yield caption('Quase! Ela desceu... mas outra pessoa vai tentar. Martele ' + Input.label('a') + '!', { auto: 2.5 });
          })());
        }
      }
      parts.update(dt);
      const tx = clamp(hero.cx - W / 2 + 30, 0, BUS_W - W);
      this.cam.x = lerp(this.cam.x, tx, Math.min(1, dt * 4));
      this.cam.y = 0;
    },
    win() {
      this.script = new Script((function* () {
        hero.frozen = true;
        yield { t: 0, update(dt) { this.t += dt; hero.x = lerp(680, 728, Math.min(1, this.t / .5)); hero.pose = { crouch: true, arms: 'out' }; return this.t >= .55; } };
        sfx('thud'); G.shake(3);
        hero.pose = { sit: true, eyes: 'closed', mouth: 'smile' }; sc.seated = true;
        yield bigText('ASSENTO CONQUISTADO!', 1.6, { size: 11, zoom: true, col: '#7aff9a' });
        yield say(mA, 'Ufa.', {});
        G.go('c2_end', { dur: 1 });
      })());
    },
    draw(c) {
      const cx = Math.round(this.cam.x);
      // rua passando pela janela (o ônibus anda para a esquerda)
      const ox = (Math.round(this.cityX) % (W * 2)) - W * 2;
      c.drawImage(city, ox, 46); c.drawImage(city, ox + W * 2, 46);
      for (let i = 0; i < 6; i++) { const px = ((i * 70 + this.cityX * 2.2) % 420) - 50; R(c, px, 60, 2, 40, '#3a2a2a'); R(c, px - 4, 60, 10, 2, '#3a2a2a'); }
      c.save(); c.translate(-cx, 0);
      c.drawImage(inner, 0, 0);
      const lean = Math.round(this.sway * 2);
      // alças balançando e balaústres
      for (let x = 96; x < BUS_W; x += 22) { const dx = Math.round(this.sway * 4); c.fillStyle = '#9a9a9a'; for (let k = 0; k < 8; k++) c.fillRect(x + Math.round(dx * k / 8), 52 + k, 1, 1); R(c, x + dx - 2, 60, 5, 5, '#e8e8e8'); R(c, x + dx - 1, 61, 3, 3, '#bdb5a4'); }
      for (const x of [150, 300, 480, 620]) { R(c, x, 52, 3, 98, '#e3c34a'); R(c, x, 52, 1, 98, '#f8e08a'); R(c, x - 2, 112, 7, 4, '#d8323c'); }
      // passageiros sentados (fundo, mais apagados)
      for (const [x, L] of seated) drawPerson(c, x - 5 + lean, BUS_FLOOR, L, { face: -1, sit: true, eyes: Math.random() < .005 ? 'closed' : null, noOutline: true });
      c.globalAlpha = .28; R(c, cx, 96, W, 54, '#3a3a50'); c.globalAlpha = 1;
      // obstáculos: primeiro plano, contorno amarelo pulsante e alerta
      const pulse = Math.floor(G.t * 4) % 2 ? '#ffd54a' : '#ff9a2a';
      const mark = (x, y) => { R(c, x - 2, y - 9, 5, 8, OUT); R(c, x - 1, y - 8, 3, 6, pulse); R(c, x - 1, y - 8, 3, 1, OUT); R(c, x, y - 3, 1, 1, OUT); R(c, x - 1, y - 7, 3, 3, pulse); R(c, x, y - 7, 1, 3, OUT); R(c, x, y - 3, 1, 1, OUT); };
      for (const o of obs) {
        if (o.t === 'bag') {
          const y = BUS_FLOOR - o.h;
          R(c, o.x - 2, y - 2, o.w + 4, o.h + 2, pulse); R(c, o.x - 1, y - 1, o.w + 2, o.h + 1, OUT);
          R(c, o.x, y, o.w, o.h, '#e0503a'); R(c, o.x, y, o.w, 3, '#ff8a6a'); R(c, o.x + 3, y + 6, o.w - 6, 4, '#a82a1a'); R(c, o.x + o.w / 2 - 3, y - 3, 6, 2, '#333');
          mark(o.x + o.w / 2, y - 4);
        } else if (o.t === 'legs') {
          seatP(c, o.x - 2, BUS_FLOOR, '#2a5aa8');
          drawPerson(c, o.x - 7, BUS_FLOOR, o.look, { face: 1, sit: true, eyes: 'closed', slump: 1, outline: pulse });
          R(c, o.x - 2, BUS_FLOOR - 6, 18, 5, OUT); R(c, o.x - 1, BUS_FLOOR - 5, 16, 3, o.look.pants); R(c, o.x + 13, BUS_FLOOR - 7, 4, 7, '#222');
          for (let i = 0; i < 16; i += 4) R(c, o.x - 1 + i, BUS_FLOOR - 1, 2, 1, pulse);
          if (Math.floor(this.t * 1.5) % 2) pixText(c, 'ZZZ', o.x - 6, BUS_FLOOR - 44 - (this.t % 1) * 4, '#5a5448');
          mark(o.x + 7, BUS_FLOOR - 8);
        } else {
          const off = o.cleared ? (o.shoved ? 14 : 10) : o.moving ? 5 : 0;
          drawPerson(c, o.x + lean + (o.cleared ? -6 : 0), BUS_FLOOR - off * .4, o.look, { face: hero.cx < o.x ? -1 : 1, arms: 'up', alpha: o.cleared ? .6 : 1, eyes: o.shoved ? 'wide' : null, mouth: o.shoved ? 'open' : null, outline: o.cleared ? OUT : pulse });
          if (o.backpack) { const bx2 = o.x + lean + (hero.cx < o.x ? 4 : -12); R(c, bx2 - 1, BUS_FLOOR - 25, 10, 14, OUT); R(c, bx2, BUS_FLOOR - 24, 8, 12, '#e0503a'); }
          if (!o.cleared && !o.moving) mark(o.x + lean, BUS_FLOOR - 34);
        }
      }
      if (this.qte) drawPerson(c, this.qte.rx, BUS_FLOOR, LOOKS.rival, { face: -1, walk: this.t * 3, arms: 'out' });
      if (this.seated) drawPerson(c, 735, BUS_FLOOR, LOOKS.mirango, { face: -1, sit: true, eyes: 'closed', mouth: 'smile' });
      else hero.draw(c);
      parts.draw(c);
      c.restore();
    },
    ui(c) {
      // medidor de equilíbrio
      pxBox(c, W / 2 - 52, H - 16, 104, 11, 'rgba(20,18,28,.85)', '#f3efe6');
      R(c, W / 2 - 50, H - 13, 100, 5, '#2c2638'); R(c, W / 2 - 50, H - 13, 15, 5, '#7a2020'); R(c, W / 2 + 35, H - 13, 15, 5, '#7a2020');
      const mx = W / 2 + clamp(this.sway, -1.4, 1.4) / 1.4 * 48;
      R(c, mx - 1, H - 15, 3, 9, this.hold ? '#7aff9a' : Math.abs(this.sway) > .9 ? '#ff5252' : '#ffd54a');
      T(c, this.hold ? 'SEGURANDO' : 'EQUILÍBRIO', W / 2, H - 23, { size: 4.5, align: 'center', col: this.hold ? '#7aff9a' : '#fff' });
      if (this.ev && this.ev.t < 2.4 && Math.floor(G.t * 6) % 2) {
        pxBox(c, W / 2 - 40, 34, 80, 16, '#d8323c', '#ffd54a'); T(c, '⚠ ' + this.ev.k, W / 2, 38.5, { size: 7, align: 'center', col: '#fff' });
        if (!this.hold) T(c, 'segure ' + Input.label('down') + '!', W / 2, 52, { f: FONT2, size: 10, align: 'center', col: '#ffd54a' });
      }
      if (this.cur && !this.qte) { const sx = this.cur.x - this.cam.x; promptAt(c, sx, 78, 'a', 'Com licença'); promptAt(c, sx, 92, 'b', 'Empurrar'); }
      if (this.qte) {
        T(c, 'MARTELE ' + Input.label('a') + '!', W / 2, 60, { size: 10, align: 'center', col: '#ffd54a', shc: '#a1101e' });
        pxBox(c, 60, 78, 200, 10, '#1a1622', '#f3efe6'); R(c, 62, 80, 196 * clamp(this.qte.m, 0, 1), 6, '#7aff9a');
        pxBox(c, 60, 92, 200, 10, '#1a1622', '#f3efe6'); R(c, 62, 94, 196 * clamp(this.qte.r, 0, 1), 6, '#ff5252');
        T(c, 'MIRANGO', 58, 79, { size: 4.5, align: 'right', col: '#7aff9a' }); T(c, 'RIVAL', 58, 93, { size: 4.5, align: 'right', col: '#ff5252' });
      }
      T(c, 'Banco livre ▶', W - 6, 4, { f: FONT2, size: 9, align: 'right', col: '#fff' });
    }
  };
  sc.parts = parts; sc.hero = hero; sc.botTarget = () => BUS_W;
  return sc;
};

/* ---------- Encerramento do capítulo 2: a janela ---------- */
SCENES.c2_end = () => {
  const rng = srand(8);
  const far = makeCanvas(W * 2, 120, (c, w, h) => { vgrad(c, 0, 0, w, h, ['#5a3a7a', '#c86a6a', '#f2a65a']); skyline(c, 0, w, h, rng, { col: '#6a3a5a', win: '#7a4a6a', lit: '#ffd77a', litP: .15, hmin: 30, hmax: 80 }); });
  const near = makeCanvas(W * 2, 120, (c, w, h) => {
    let x = 0;
    while (x < w) { const bw = 30 + Math.floor(rng() * 40), bh = 40 + Math.floor(rng() * 50); R(c, x, h - bh, bw - 2, bh, pick(['#3a2438', '#2e2234', '#40283a'])); for (let yy = h - bh + 4; yy < h - 6; yy += 7) for (let xx = x + 3; xx < x + bw - 6; xx += 6) R(c, xx, yy, 3, 4, rng() < .3 ? '#ffd77a' : '#4a3448'); x += bw; }
    R(c, 300, 30, 90, 30, '#1a1018'); R(c, 302, 32, 86, 26, '#1f4a6a'); pixText(c, 'GAUDE AI', 345, 36, '#fff', 2, 'center'); pixText(c, 'SEM FERIAS. NUNCA.', 345, 50, '#7fd4ff', 1, 'center');
  });
  const cars = [];
  const parts = new Parts();
  const sc = {
    music: 'calm', amb: 'bus', t: 0, sx: 0, eat: 0, eyes: null, tower: -200, shown: 0,
    enter() { this.script = new Script(this.run()); },
    *run() {
      yield 1;
      yield 1.2;
      yield 1.2;
      this.eat = 1; sfx('slurp');
      yield 1.2;
      this.tower = -60;
      yield 1.2;
      const mA = { x: 206, y: 132, h: 6 };
      yield think(mA, 'Não sei o dia de amanhã...', { auto: 2.4 });
      yield think(mA, '...mas eu não volto.', { auto: 2.6 });
      G.unlock(3);
      this.eyes = 'closed';
      yield 1.2;
      yield 1.2;
      yield endCard('FIM DO CAPÍTULO 2', 'Raiva');
      G.go('c3_beach', { col: '#fff', dur: 1.4 });
    },
    update(dt) {
      this.t += dt; this.sx += dt * 40;
      if (this.script) this.script.update(dt);
      if (this.tower > -200 && this.tower < W + 40) this.tower += dt * 26;
      if (this.eat && Math.random() < .05) parts.add({ x: 194, y: 132, vx: rnd(-6, 6), vy: rnd(5, 20), g: 40, life: 1, col: '#c9a05a' });
      if (Math.random() < dt * .6) cars.push({ x: -40, v: rnd(30, 80), col: pick(CAR_COLS) });
      for (const v of cars) v.x += v.v * dt; for (let i = cars.length - 1; i >= 0; i--) if (cars[i].x > W) cars.splice(i, 1);
      parts.update(dt);
    },
    draw(c) {
      R(c, 0, 0, W, H, '#cfc6b2');
      // janela grande: a rua em movimento (o ônibus segue para a esquerda)
      const WX = 12, WY = 10, WW = 244, WH = 138;
      c.save(); c.beginPath(); c.rect(WX, WY, WW, WH); c.clip();
      const a = (Math.round(this.sx * .25) % (W * 2)) - W * 2, b = (Math.round(this.sx * .8) % (W * 2)) - W * 2;
      c.drawImage(far, a, WY); c.drawImage(far, a + W * 2, WY);
      if (this.tower > -200) {
        const tx = Math.round(this.tower);
        R(c, tx, 14, 60, 104, '#1a1424'); for (let y = 22; y < 116; y += 6) for (let x = tx + 4; x < tx + 56; x += 6) R(c, x, y, 3, 3, (x + y) % 5 ? '#2a2a3a' : '#ffe9a0');
        R(c, tx + 6, 18, 48, 9, '#d8323c'); pixText(c, 'CORP S.A.', tx + 30, 20, '#fff', 1, 'center');
      }
      c.drawImage(near, b, 4); c.drawImage(near, b + W * 2, 4);
      // calçada, postes e rua
      R(c, WX, 118, WW, 6, '#8a7e78'); R(c, WX, 124, WW, 24, '#3a3640'); for (let i = 0; i < 8; i++) R(c, ((i * 40 + this.sx * 2.4) % 320) - 30, 135, 16, 2, '#e8e0c8');
      for (let i = 0; i < 4; i++) { const px = ((i * 90 + this.sx * 1.6) % 360) - 40; R(c, px, 64, 3, 56, '#241a24'); R(c, px - 6, 64, 14, 3, '#241a24'); R(c, px + 4, 67, 4, 2, '#ffe9a0'); }
      for (const v of cars) { const x = Math.round(v.x); R(c, x, 128, 34, 10, OUT); R(c, x + 1, 129, 32, 8, v.col); R(c, x + 6, 124, 18, 5, OUT); R(c, x + 7, 125, 16, 4, '#9ac4e0'); R(c, x + 4, 136, 6, 4, '#111'); R(c, x + 24, 136, 6, 4, '#111'); }
      c.globalAlpha = .1; R(c, WX, WY, WW, WH, '#9ac4e0'); c.globalAlpha = 1;
      for (let i = 0; i < 5; i++) { c.globalAlpha = .08; R(c, 30 + i * 46 + Math.sin(this.t + i) * 2, WY + 4, 2, WH - 8, '#fff'); c.globalAlpha = 1; }
      c.restore();
      // moldura da janela, basculante e parede
      R(c, WX - 4, WY - 4, WW + 8, 4, '#6a6458'); R(c, WX - 4, WY + WH, WW + 8, 6, '#6a6458'); R(c, WX - 4, WY, 4, WH, '#6a6458'); R(c, WX + WW, WY, 4, WH, '#6a6458');
      R(c, WX + WW / 2 - 1, WY, 3, WH, '#6a6458'); R(c, WX, WY + 28, WW, 2, '#6a6458');
      R(c, 256, 14, 64, 14, '#111'); pixText(c, '310 LAPA', 288, 16, '#ffb030', 1, 'center'); pixText(c, 'PROX: CENTRO', 288, 22, '#ff7a30', 1, 'center');
      R(c, 0, 154, W, 26, '#b8af9a');
      // assento de ônibus de perfil (encosto atrás, à direita)
      const sx0 = 168;
      R(c, sx0 + 58, 104, 14, 62, OUT); R(c, sx0 + 60, 106, 10, 58, '#2a5aa8'); R(c, sx0 + 60, 106, 3, 58, '#5a8ad8'); R(c, sx0 + 56, 100, 18, 6, '#c9c9c9');
      R(c, sx0 + 4, 152, 70, 12, OUT); R(c, sx0 + 6, 154, 66, 8, '#2a5aa8'); R(c, sx0 + 6, 154, 66, 2, '#5a8ad8');
      R(c, sx0 + 20, 164, 4, 16, '#777'); R(c, sx0 + 56, 164, 4, 16, '#777');
      // Mirango sentado, cabeça encostada no vidro
      const vib = Math.floor(this.t * 12) % 2;
      drawPersonBig(c, sx0 + 46, 174 + vib, LOOKS.mirango, { face: -1, sit: true, slump: .4, eyes: this.eyes || (Math.floor(this.t * 1.3) % 6 === 0 ? 'closed' : null), mouth: this.eat && Math.floor(this.t * 2) % 3 === 0 ? 'eat' : null, arms: this.eat ? 'drink' : undefined, rot2: -.1, tremble: !this.eyes && Math.random() < .2 }, 2);
      if (this.eat && !this.eyes) { R(c, sx0 + 22, 126, 8, 6, '#c9a05a'); R(c, sx0 + 22, 126, 8, 2, '#e3c88a'); }
      parts.draw(c);
    }
  };
  return sc;
};
