'use strict';
/* =========================================================
   CAPÍTULO 3 — BARGANHA: o infundíbulo cronossinclástico e o paraíso vazio
   ========================================================= */
const BEACH_FLOOR = 158, BEACH_W = 640;
function palmP(c, x, y, h, lean, rng, o = {}) {
  // tronco curvo em anéis
  let px = x, py = y;
  for (let i = 0; i <= h; i += 3) {
    const k = i / h; px = x + lean * k * k; py = y - i;
    R(c, Math.round(px) - 3, Math.round(py) - 3, 7, 3, (i / 3) % 2 ? '#8a6a3a' : '#a07a44'); R(c, Math.round(px) - 3, Math.round(py) - 3, 1, 3, '#6a4a28');
  }
  const cx = Math.round(px), cy = Math.round(py) - 2;
  const g = o.dark ? ['#1a3a22', '#224a2a', '#163018'] : ['#2f8a3f', '#3eaa4f', '#226a30'];
  for (let f = 0; f < 7; f++) {
    const a = -Math.PI + f / 6 * Math.PI + (rng() - .5) * .3, L = (o.big || 26) + rng() * 8;
    for (let k = 0; k < L; k++) {
      const t = k / L, fx = cx + Math.cos(a) * k, fy = cy + Math.sin(a) * k * .5 + t * t * 14;
      R(c, Math.round(fx), Math.round(fy), 2, 2, g[f % 3]);
      if (k % 3 === 0 && k > 3) { R(c, Math.round(fx), Math.round(fy) + 2, 1, 3, g[(f + 1) % 3]); }
    }
  }
  if (o.coco !== false) for (const [dx, dy] of [[-3, 2], [1, 2], [-1, 4], [3, 4]]) { R(c, cx + dx, cy + dy, 3, 3, '#5a3a14'); R(c, cx + dx - 1, cy + dy + 1, 1, 1, '#5a3a14'); R(c, cx + dx, cy + dy, 1, 1, '#9a7a3a'); }
  return { x: cx, y: cy };
}
let _beach = null;
function buildBeach() {
  if (_beach) return _beach;
  const rng = srand(2024);
  const sky = (stops) => makeCanvas(W, 100, (c) => vgrad(c, 0, 0, W, 100, stops, 25));
  const skies = [sky(['#3aa8e8', '#6ccaf2', '#b8ecff']), sky(['#4a3a8a', '#d8607a', '#ffb070']), sky(['#141838', '#3a2a5a', '#7a4a6a'])];
  const sea = makeCanvas(W, 40, (c) => {
    vgrad(c, 0, 0, W, 40, ['#1f8fb0', '#2fc0c8', '#6fe0d0'], 10);
    for (let i = 0; i < 4; i++) { const ix = 20 + i * 90; R(c, ix, -2, 30 + i * 4, 4, '#2a6a6a'); R(c, ix + 6, -4, 14, 2, '#2f7a5a'); }
  });
  const sand = makeCanvas(BEACH_W, 60, (c) => {
    vgrad(c, 0, 0, BEACH_W, 60, ['#e8d8a8', '#f3e3b3', '#e0c890'], 12);
    for (let i = 0; i < 900; i++) R(c, Math.floor(rng() * BEACH_W), Math.floor(rng() * 60), 1, 1, rng() < .5 ? '#d8c490' : '#fff4d0');
    R(c, 0, 0, BEACH_W, 2, '#bfe8e0'); dither(c, 0, 2, BEACH_W, 3, '#d8f0e0', 2);
    for (let i = 0; i < 14; i++) { const x = Math.floor(rng() * BEACH_W), y = 8 + Math.floor(rng() * 44); R(c, x, y, 3, 2, pick(['#f6c8c8', '#fff', '#f2d8a8'])); }
    for (let i = 0; i < 5; i++) { const x = Math.floor(rng() * BEACH_W), y = 20 + Math.floor(rng() * 30); R(c, x, y, 7, 4, '#9a9488'); R(c, x + 1, y, 5, 1, '#b8b2a6'); }
    R(c, 300, 30, 5, 5, '#ff8a5a'); R(c, 302, 28, 1, 9, '#ff8a5a'); R(c, 298, 32, 9, 1, '#ff8a5a');
  });
  const props = makeCanvas(BEACH_W, H, (c) => {
    palmP(c, 40, BEACH_FLOOR + 2, 70, 14, rng); palmP(c, 200, BEACH_FLOOR + 4, 60, -10, rng);
    palmP(c, 470, BEACH_FLOOR, 66, -8, rng); palmP(c, 530, BEACH_FLOOR, 62, 10, rng);
    palmP(c, 610, BEACH_FLOOR + 2, 120, -20, rng, { big: 34 });
    // barraca
    const tx = 400;
    R(c, tx, 112, 3, 46, '#6a4a28'); R(c, tx + 46, 112, 3, 46, '#6a4a28');
    for (let i = 0; i < 14; i++) R(c, tx - 6 + i * 4, 104 + Math.abs(i - 6.5) * .8, 5, 10, i % 2 ? '#c9a24a' : '#b88a3a');
    R(c, tx - 8, 112, 66, 3, '#8a6a2a');
    R(c, tx + 2, 136, 46, 4, '#8a6a3a'); R(c, tx + 4, 140, 42, 18, '#a07a44'); for (let i = 0; i < 5; i++) R(c, tx + 6 + i * 8, 142, 6, 14, '#8a6a3a');
    for (let i = 0; i < 4; i++) { R(c, tx + 6 + i * 10, 130, 7, 6, '#5a7a2a'); R(c, tx + 8 + i * 10, 128, 3, 2, '#3a5a1a'); }
    R(c, tx + 34, 131, 6, 5, '#e3c34a'); R(c, tx + 24, 132, 5, 4, '#ff8a3a');
  });
  return (_beach = { skies, sea, sand, props });
}
function drawBeach(c, cx, tod, o = {}) {
  const B = buildBeach();
  const k = clamp(tod, 0, 2);
  const i0 = Math.floor(Math.min(k, 1.999)), t = k - i0;
  c.drawImage(B.skies[i0], 0, 0); if (t > 0) { c.globalAlpha = t; c.drawImage(B.skies[i0 + 1], 0, 0); c.globalAlpha = 1; }
  // sol
  const sy = Math.round(lerp(26, 104, clamp(tod, 0, 1.1))), sxp = 240 - Math.round(cx * .05);
  const sunc = o.redSun ? '#ff2020' : tod > .5 ? '#ffb050' : '#fff6c0';
  c.fillStyle = sunc; for (const [r, a] of [[22, .08], [16, .14], [12, .22]]) { c.globalAlpha = a; c.beginPath(); c.arc(sxp, sy, r, 0, 7); c.fill(); } c.globalAlpha = 1;
  R(c, sxp - 8, sy - 6, 16, 12, sunc); R(c, sxp - 6, sy - 8, 12, 16, sunc);
  // nuvens
  for (let i = 0; i < 4; i++) { const x = ((i * 97 + G.t * 3 - cx * .1) % (W + 60)) - 30, y = 14 + i * 9; c.globalAlpha = tod > .6 ? .5 : .9; R(c, x, y, 26, 5, tod > .6 ? '#f0a0a0' : '#fff'); R(c, x + 6, y - 3, 14, 3, tod > .6 ? '#f0a0a0' : '#fff'); c.globalAlpha = 1; }
  // ilhas
  R(c, 30 - cx * .08, 88, 50, 4, '#3a7a6a'); R(c, 40 - cx * .08, 85, 24, 3, '#3a7a6a'); R(c, 230 - cx * .08, 89, 30, 3, '#3a7a6a');
  c.drawImage(B.sea, 0, 92);
  if (tod > 0) { c.globalAlpha = Math.min(.55, tod * .45); R(c, 0, 92, W, 40, tod > 1 ? '#1a1838' : '#c8605a'); c.globalAlpha = 1; }
  // reflexo do sol e brilhos
  for (let i = 0; i < 8; i++) { const yy = 96 + i * 4, w = 14 - i; c.globalAlpha = .6; R(c, sxp - w / 2 + Math.sin(G.t * 3 + i) * 2, yy, w, 1, sunc); c.globalAlpha = 1; }
  for (let i = 0; i < 14; i++) { if ((Math.floor(G.t * 3) + i) % 3) continue; R(c, (i * 53 + 17) % W, 94 + (i * 7) % 30, 2, 1, '#e8ffff'); }
  // ondas chegando
  const wv = Math.sin(G.t * 1.2) * 3;
  c.drawImage(B.sand, -cx, 122);
  c.globalAlpha = .8; R(c, -cx, Math.round(121 + wv), BEACH_W, 2, '#f0fff8'); c.globalAlpha = .35; R(c, -cx, Math.round(123 + wv), BEACH_W, 3, '#9ae0d8'); c.globalAlpha = 1;
  if (tod > 0) { c.globalAlpha = Math.min(.5, tod * .4); R(c, 0, 122, W, 58, tod > 1 ? '#2a2850' : '#d07050'); c.globalAlpha = 1; }
  if (o.pre) o.pre(c);
  if (!o.noProps) c.drawImage(B.props, -cx, 0);
}

function drawAdPlane(c, t) {
  // até no paraíso a propaganda chega: um aviãozinho com faixa
  const x = Math.round(((t * 16) % 760) - 260), y = 18 + Math.round(Math.sin(t) * 2);
  R(c, x + 196, y, 14, 4, '#e8e8e8'); R(c, x + 206, y - 3, 3, 3, '#d8323c'); R(c, x + 200, y + 3, 6, 1, '#888'); R(c, x + 210, y + 1, 2, 2, '#333');
  for (let i = 0; i < 12; i++) R(c, x + 186 + i, y + 2 + Math.round(Math.sin(t * 6 + i)), 1, 1, '#aaa');
  R(c, x, y - 3 + Math.round(Math.sin(t * 5)), 186, 11, '#f3efe6'); R(c, x, y - 3 + Math.round(Math.sin(t * 5)), 186, 1, '#d8323c');
  pixText(c, 'GAUDE AI: FERIAS? A IA TRABALHA POR VOCE', x + 93, y - 1 + Math.round(Math.sin(t * 5)), '#1f4a6a', 1, 'center');
}
/* ---------- Cena 4: o paraíso vazio + a moeda sem valor ---------- */
SCENES.c3_beach = () => {
  const hero = new Hero(40, BEACH_FLOOR - 24, LOOKS.mirangoBeach); hero.speed = 66; hero.frozen = true;
  const mA = heroActor(hero);
  const nat = { x: 500, y: 140, h: 22, swing: 0 };
  const parts = new Parts();
  const gulls = Array.from({ length: 4 }, (_, i) => ({ x: rnd(BEACH_W), y: rnd(20, 60), v: rnd(10, 20), ph: rnd(6) }));
  const crabs = [{ x: 150, d: 1 }, { x: 330, d: -1 }];
  const solids = [{ x: -20, y: BEACH_FLOOR, w: BEACH_W + 40, h: 30 }];
  const sc = {
    cam: { x: 0, y: 0 }, music: 'beach', amb: 'waves', t: 0, stage: 0, items: null, hero, botTarget: () => 608, hints() { return this.stage >= 1 ? [['move', 'Andar'], ['a', 'Interagir']] : null; },
    enter() {
      this.script = new Script((function* () {
        yield titleCard('CAPÍTULO 3', 'BARGANHA');
        yield 1.2;
        yield think(mA, 'Eu... consegui? Então é isso? A fuga definitiva?');
        hero.frozen = false; sc.stage = 1;
      })());
    },
    *native() {
      hero.frozen = true; hero.face = 1;
      yield say(nat, 'Ôpa. Bem-vindo, viajante.', { name: 'NATIVO' });
      hero.pose = { arms: 'out' }; sc.items = 1; sfx('coin');
      yield say(mA, 'Eu preciso de suprimentos. Pode passar no crédito ou em espécie, quanto custa?');
      sfx('crowd');
      yield say(nat, 'Hahaha... Comprar? O que é dinheiro? Aqui não trocamos valor por papel colorido.', { name: 'NATIVO' });
      yield say(nat, 'Se quer comer ou beber, o mundo está aberto. Vá lá e pega.', { name: 'NATIVO' });
      // o vento leva o dinheiro
      sc.items = 0; sfx('swoosh');
      for (let i = 0; i < 16; i++) parts.add({ x: hero.cx + 8, y: hero.fy - 16, vx: rnd(10, 70), vy: rnd(-60, -10), g: 20, life: 3, col: pick(['#4a9a5a', '#7aca8a', '#3a7a4a']), s: 3, drag: .3 });
      hero.pose = { arms: 'shrug', eyes: 'wide' };
      yield 1.2;
      hero.pose = {};
      yield think(mA, 'Esforço orgânico direto... tá bom. Tá bom.');
      yield say(nat, 'O coco mais fresco fica lá no alto daquela palmeira gigante.', { name: 'NATIVO' });
      hero.frozen = false; sc.stage = 2;
    },
    update(dt) {
      this.t += dt;
      if (this.script) { this.script.update(dt); if (this.script.done) this.script = null; }
      hero.update(dt, solids, { minX: 4, maxX: BEACH_W - 4, parts, upJump: true, stepSfx: 'stepSand', dust: '#e8d8a8' });
      if (this.stage === 1 && hero.cx > 418) { this.stage = 1.5; this.script = new Script(this.native()); }
      nat.swing = Math.sin(this.t * 1.4) * 2;
      for (const g of gulls) { g.x += g.v * dt; if (g.x > BEACH_W + 20) g.x = -20; if (Math.random() < .002) sfx('gull'); }
      for (const cb of crabs) { cb.x += cb.d * 12 * dt; if (Math.random() < .01) cb.d *= -1; cb.x = clamp(cb.x, 60, 600); }
      this.cur = this.stage === 2 && Math.abs(hero.cx - 608) < 18 ? { x: 608 } : null;
      if (this.cur && Input.pressed('a')) { sfx('ok'); G.go('c3_climb'); }
      parts.update(dt);
      const tx = clamp(hero.cx - W / 2 + hero.face * 20, 0, BEACH_W - W);
      this.cam.x = lerp(this.cam.x, tx, Math.min(1, dt * 4));
    },
    draw(c) {
      const cx = Math.round(this.cam.x);
      drawBeach(c, cx, 0, { pre: (cc) => drawAdPlane(cc, this.t) });
      c.save(); c.translate(-cx, 0);
      for (const g of gulls) { const f = Math.floor(G.t * 4 + g.ph) % 2; R(c, Math.round(g.x) - 3, Math.round(g.y) + (f ? 0 : -1), 3, 1, '#fff'); R(c, Math.round(g.x) + 1, Math.round(g.y) + (f ? 0 : -1), 3, 1, '#fff'); R(c, Math.round(g.x), Math.round(g.y) + 1, 1, 1, '#ddd'); }
      for (const cb of crabs) { const x = Math.round(cb.x); R(c, x - 3, 160, 7, 3, '#e04a3a'); R(c, x - 4, 159, 1, 2, '#e04a3a'); R(c, x + 4, 159, 1, 2, '#e04a3a'); R(c, x - 1, 159, 1, 1, '#111'); R(c, x + 1, 159, 1, 1, '#111'); }
      // rede com o nativo
      const sw = Math.round(nat.swing);
      c.strokeStyle = '#e8d0a0'; R(c, 470, 112, 1, 2, '#c9a24a');
      for (let i = 0; i <= 56; i += 2) { const yy = 118 + Math.round(Math.sin(i / 56 * Math.PI) * 12) + Math.round(sw * Math.sin(i / 56 * Math.PI)); R(c, 473 + i, yy, 2, 3, i % 4 ? '#e85a4a' : '#f3d27a'); }
      drawPerson(c, nat.x + 2, 127 + sw, LOOKS.nativo, { rot: -Math.PI / 2 + .1, eyes: 'closed', mouth: 'smile', noOutline: false });
      nat.x = 498; nat.y = 124 + sw;
      hero.draw(c);
      if (this.items) { const x = hero.cx + 9, y = hero.fy - 20; R(c, x, y, 7, 5, '#d8b02e'); R(c, x + 2, y - 3, 6, 4, '#4a9a5a'); R(c, x - 1, y + 4, 6, 4, '#2a6ab0'); R(c, x, y + 5, 4, 1, '#fff'); }
      parts.draw(c);
      c.restore();
    },
    ui(c) {
      if (this.cur) promptAt(c, 608 - this.cam.x, 70, 'a', 'Escalar a palmeira');
      else if (this.stage === 2) objectiveUI(c, this, null);
      if (this.stage === 2 && !this.cur) { const sx = 608 - this.cam.x; if (sx > W - 6) { c.fillStyle = '#fff'; c.beginPath(); c.moveTo(W - 4, 100); c.lineTo(W - 10, 95); c.lineTo(W - 10, 105); c.fill(); } }
    }
  };
  return sc;
};

/* ---------- Minigame 1: A Colheita do Coco (plataforma vertical) ---------- */
const CLIMB_H = 1000;
SCENES.c3_climb = () => {
  const rng = srand(777);
  const plats = [{ x: -10, y: 980, w: 340, h: 40, type: 'ground' }];
  const vines = [], monkeys = [];
  let x = 140, y = 980, pw = 40;
  for (let i = 0; i < 28; i++) {
    if (i === 8 || i === 18) {
      const pc = x + pw / 2, dir = pc < 160 ? 1 : -1;
      const ax = pc + dir * 52, ay = y - 74;
      vines.push({ ax, ay, len: 56, th: 0, w: 0 });
      x = clamp(ax + dir * 62 - 22, 8, 268); y = y - 44; pw = 44;
      plats.push({ x, y, w: pw, h: 6, type: 'rock', oneway: true });
      continue;
    }
    y -= 30;
    let dx = (rng() < .5 ? -1 : 1) * (38 + rng() * 26);
    if (x + dx < 10 || x + dx > 262) dx = -dx;
    x = clamp(x + dx, 10, 262);
    const type = i % 3 === 1 ? 'branch' : 'rock';
    pw = type === 'branch' ? 36 : Math.floor(38 + rng() * 14) + 6;
    plats.push({ x, y, w: pw, h: 6, type, oneway: true, t: 0, fall: 0 });
    if (type === 'rock' && i % 5 === 3) monkeys.push({ x: x + pw / 2, y, t: rnd(3, 5), arm: 0 });
  }
  const topY = y - 34;
  plats.push({ x: 100, y: topY, w: 120, h: 6, type: 'leaf', oneway: true });
  const coco = { x: 160, y: topY - 12 };
  const bg = makeCanvas(W, CLIMB_H, (c) => {
    vgrad(c, 0, 0, W, CLIMB_H, ['#6ccaf2', '#9adcf6', '#b8ecff', '#7ad8e0'], 60);
    for (let i = 0; i < 18; i++) { const cy = Math.floor(rng() * 800), cx = Math.floor(rng() * W); R(c, cx, cy, 30, 6, 'rgba(255,255,255,.6)'); R(c, cx + 8, cy - 3, 14, 3, 'rgba(255,255,255,.6)'); }
    vgrad(c, 0, 900, W, 80, ['#2fc0c8', '#1f8fb0'], 10);
    // tronco gigante ao fundo
    for (let yy = topY; yy < 980; yy += 4) { const xx = 160 + Math.round(Math.sin(yy / 90) * 6); R(c, xx - 9, yy, 18, 4, (yy / 4) % 2 ? '#7a5a32' : '#8a6a3a'); R(c, xx - 9, yy, 3, 4, '#5a4020'); }
    // falésias laterais
    for (let yy = 0; yy < CLIMB_H; yy += 8) {
      const lw = 8 + Math.round(Math.sin(yy / 40) * 5 + rng() * 4), rw = 8 + Math.round(Math.cos(yy / 50) * 5 + rng() * 4);
      R(c, 0, yy, lw, 8, '#5a6a5a'); R(c, lw - 2, yy, 2, 8, '#4a5a4a'); R(c, W - rw, yy, rw, 8, '#5a6a5a'); R(c, W - rw, yy, 2, 8, '#6a7a6a');
      if (rng() < .3) R(c, lw, yy + 2, 3, 3, '#2f8a3f'); if (rng() < .3) R(c, W - rw - 3, yy + 2, 3, 3, '#2f8a3f');
    }
    R(c, 0, 980, W, 20, '#e8d8a8');
    palmP(c, 160, topY + 14, 2, 0, rng, { big: 46, coco: false });
  });
  const hero = new Hero(150, 950, LOOKS.mirangoBeach); hero.jumpV = 248; hero.speed = 80;
  const mA = heroActor(hero);
  const parts = new Parts(), peels = [];
  const sc = {
    hints() { return this.vine ? [['move', 'Balançar'], ['vert', 'Subir/descer no cipó'], ['jump', 'Soltar e pular']] : [['move', 'Andar'], ['jump', 'Pular (encoste no cipó para agarrar)']]; },
    cam: { x: 0, y: CLIMB_H - H }, music: 'beach', amb: 'waves', t: 0, vine: null, grabCD: 0, done: false, maxH: 0,
    enter() {
      this.script = new Script((function* () {
        yield bigText('A COLHEITA DO COCO', 1.4, { size: 13, zoom: true, col: '#ffd54a' });
        Balloons.add(null, 'Pule de pedra em pedra até o topo. Galhos finos quebram se você demorar. Encoste nos cipós para se agarrar.', { type: 'caption', auto: 6, y: 20 });
      })());
    },
    update(dt) {
      this.t += dt;
      if (this.script) { this.script.update(dt); if (this.script.done) this.script = null; }
      this.grabCD -= dt;
      if (this.vine) {
        const v = this.vine;
        let inp = 0; if (Input.down('left')) inp -= 1; if (Input.down('right')) inp += 1;
        v.w += (-(640 / v.r) * Math.sin(v.th) + inp * 7) * dt; v.w *= 1 - .25 * dt; v.th += v.w * dt; v.th = clamp(v.th, -1.3, 1.3);
        if (Input.down('up')) v.r = Math.max(18, v.r - 30 * dt); if (Input.down('down')) v.r = Math.min(v.len, v.r + 30 * dt);
        const cx = v.ax + Math.sin(v.th) * v.r, cy = v.ay + Math.cos(v.th) * v.r;
        hero.x = cx - hero.w / 2; hero.y = cy - hero.h / 2 + 6; hero.vx = 0; hero.vy = 0; if (inp) hero.face = inp;
        hero.pose = { arms: 'up' };
        if (Input.pressed('jump')) {
          hero.vx = v.w * v.r * Math.cos(v.th) + hero.face * 30; hero.vy = Math.min(0, -v.w * v.r * Math.sin(v.th)) - 190;
          this.vine = null; this.grabCD = .35; hero.pose = {}; sfx('jump');
        }
      } else {
        hero.update(dt, plats, { minX: 6, maxX: W - 6, parts, upJump: false, stepSfx: 'step', dust: '#c8b890' });
        if (hero.stun > 0) hero.pose = { eyes: 'wide' }; else hero.pose = {};
        if (this.grabCD <= 0) for (const v of vines) {
          const vx = v.ax + Math.sin(v.th) * v.len, vy = v.ay + Math.cos(v.th) * v.len;
          // distância do herói ao segmento do cipó
          const hx = hero.cx, hy = hero.y + 8, dx = vx - v.ax, dy = vy - v.ay, l2 = dx * dx + dy * dy;
          const tt = clamp(((hx - v.ax) * dx + (hy - v.ay) * dy) / l2, .3, 1);
          const px = v.ax + dx * tt, py = v.ay + dy * tt;
          if (Math.hypot(hx - px, hy - py) < 13 && !hero.onGround) {
            this.vine = v; v.r = Math.max(18, tt * v.len); v.th = Math.atan2(hx - v.ax, hy - v.ay); v.w = (hero.vx * Math.cos(v.th)) / v.r; sfx('zip');
            break;
          }
        }
      }
      for (const v of vines) if (v !== this.vine) { v.w += -(640 / v.len) * Math.sin(v.th) * dt; v.w *= 1 - .6 * dt; v.th += v.w * dt; }
      // galhos quebradiços
      for (const p of plats) {
        if (p.type !== 'branch') continue;
        if (p.off) { p.fall += dt; if (p.fall > 3) { p.off = false; p.fall = 0; p.t = 0; } continue; }
        if (hero.ground === p && hero.onGround) { p.t += dt; if (p.t > 1.1 && !p.cracked) { p.cracked = true; sfx('crack'); } if (p.t > 1.9) { p.off = true; p.cracked = false; sfx('crack'); parts.burst(p.x + p.w / 2, p.y, 8, { col: ['#6a4a28', '#2f8a3f'], min: 10, max: 50, g: 200 }); } }
        else p.t = Math.max(0, p.t - dt * .5);
      }
      // macacos
      for (const mk of monkeys) {
        mk.arm = Math.max(0, mk.arm - dt);
        if (Math.abs(hero.cy() - mk.y) < 85 && !this.done) {
          mk.t -= dt;
          if (mk.t <= 0) {
            mk.t = rnd(5.5, 7.5); mk.arm = .4; sfx('monkey');
            const T = 1.35, tx = hero.cx, ty = hero.y + 8, g = 220;
            peels.push({ x: mk.x, y: mk.y - 12, vx: (tx - mk.x) / T, vy: (ty - (mk.y - 12)) / T - .5 * g * T, g, t: 0 });
            if (Math.random() < .5) sayAuto({ x: mk.x, y: mk.y, h: 14 }, pick(['Uh uh!', 'Ah ah ah!', 'Uuuh!']), .9, {});
          }
        }
      }
      for (const p of peels) {
        p.t += dt; p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        if (hero.inv <= 0 && overlap(hero, { x: p.x - 3, y: p.y - 3, w: 6, h: 6 })) {
          p.t = 9; hero.inv = 1.4; hero.stun = .12; if (!this.vine) { hero.vx = Math.sign(p.vx || 1) * 45; } sfx('hurt'); G.shake(1);
          sayAuto(mA, pick(['Ei!', 'Casca de banana?!', 'Sério isso?']), 1, {});
        }
      }
      for (let i = peels.length - 1; i >= 0; i--) if (peels[i].t > 3) peels.splice(i, 1);
      parts.update(dt);
      // topo: o cacho de cocos
      this.cur = !this.done && hero.onGround && Math.abs(hero.cx - coco.x) < 22 && Math.abs(hero.fy - topY) < 4;
      if (this.cur && Input.pressed('a')) { this.done = true; this.script = new Script(this.finish()); }
      this.maxH = Math.max(this.maxH, Math.round((980 - hero.fy) / 10));
      const ty = clamp(hero.y - 100, 0, CLIMB_H - H);
      this.cam.y = lerp(this.cam.y, ty, Math.min(1, dt * 5));
    },
    *finish() {
      hero.frozen = true; hero.pose = { arms: 'out', mouth: 'shout' }; sfx('punch'); G.shake(3);
      for (let i = 0; i < 4; i++) parts.add({ x: coco.x + i * 3, y: coco.y, vx: rnd(-30, 30), vy: rnd(-40, 0), g: 400, life: 2.2, draw(c, p) { R(c, Math.round(p.x) - 3, Math.round(p.y) - 3, 6, 6, OUT); R(c, Math.round(p.x) - 2, Math.round(p.y) - 2, 4, 4, '#6a4a1a'); } });
      this.cocoGone = true;
      yield shout(mA, 'TOMA!', { auto: .8 });
      hero.pose = { arms: 'up' };
      yield 0.6;
      const y0 = hero.y;
      yield { t: 0, update(dt) { this.t += dt; const k = ease(Math.min(1, this.t / 1.8)); hero.x = lerp(hero.x, 156, .2); hero.y = lerp(y0, 956, k); hero.pose = { arms: 'up', eyes: 'closed' }; if (Math.random() < .6) parts.add({ x: hero.cx, y: hero.y, vx: rnd(-10, 10), vy: -10, life: .5, col: '#a07a44' }); sc.cam.y = clamp(hero.y - 100, 0, CLIMB_H - H); return this.t >= 1.9; } };
      sfx('land');
      G.go('c3_sunset');
    },
    draw(c) {
      const cy = Math.round(this.cam.y);
      c.drawImage(bg, 0, -cy);
      c.save(); c.translate(0, -cy);
      for (const v of vines) {
        const r = this.vine === v ? v.r : v.len;
        const ex = v.ax + Math.sin(v.th) * (this.vine === v ? v.len : v.len), ey = v.ay + Math.cos(v.th) * v.len;
        R(c, v.ax - 6, v.ay - 4, 12, 4, '#2f8a3f');
        for (let k = 0; k <= 1; k += .03) { const px = lerp(v.ax, ex, k), py = lerp(v.ay, ey, k); R(c, Math.round(px), Math.round(py), 2, 2, '#3a7a2a'); if (Math.floor(k * 33) % 6 === 0) R(c, Math.round(px) + 2, Math.round(py), 3, 2, '#4aaa4a'); }
      }
      for (const p of plats) {
        if (p.type === 'ground') continue;
        if (p.type === 'branch') {
          const dy = p.off ? Math.round(p.fall * p.fall * 200) : 0; if (dy > 200) continue;
          const sh = p.cracked ? irnd(-1, 1) : 0;
          c.globalAlpha = p.off ? Math.max(0, 1 - p.fall) : 1;
          R(c, p.x + sh, p.y + dy, p.w, 3, '#7a5a32'); R(c, p.x + sh, p.y + dy, p.w, 1, '#9a7a4a'); R(c, p.x + p.w - 4 + sh, p.y - 3 + dy, 5, 3, '#3eaa4f'); R(c, p.x + 2 + sh, p.y + 3 + dy, 3, 2, '#2f8a3f');
          if (p.cracked) R(c, p.x + p.w / 2, p.y + dy, 1, 3, '#2a1a0a');
          c.globalAlpha = 1;
        } else if (p.type === 'leaf') {
          for (let i = 0; i < p.w; i += 4) R(c, p.x + i, p.y + Math.abs(i - p.w / 2) * .1, 5, 3, i % 8 ? '#3eaa4f' : '#2f8a3f');
        } else {
          R(c, p.x, p.y, p.w, 7, '#6a6a6a'); R(c, p.x + 1, p.y, p.w - 2, 2, '#8a8a8a'); R(c, p.x + 2, p.y + 4, p.w - 4, 4, '#5a5a5a');
          R(c, p.x + 3, p.y - 1, 6, 2, '#2f8a3f'); R(c, p.x + p.w - 9, p.y - 1, 5, 2, '#3eaa4f'); dither(c, p.x + 2, p.y + 2, p.w - 4, 4, '#7a8a7a', 4);
        }
      }
      if (!this.cocoGone) for (let i = 0; i < 5; i++) { R(c, coco.x - 6 + (i % 3) * 5, coco.y + Math.floor(i / 3) * 5, 6, 6, OUT); R(c, coco.x - 5 + (i % 3) * 5, coco.y + 1 + Math.floor(i / 3) * 5, 4, 4, '#7a5a1a'); R(c, coco.x - 5 + (i % 3) * 5, coco.y + 1 + Math.floor(i / 3) * 5, 2, 1, '#9a7a3a'); }
      for (const mk of monkeys) {
        const x = Math.round(mk.x), y = mk.y;
        R(c, x - 5, y - 11, 10, 11, OUT); R(c, x - 4, y - 10, 8, 9, '#7a4a28'); R(c, x - 3, y - 15, 7, 6, OUT); R(c, x - 2, y - 14, 5, 4, '#7a4a28'); R(c, x - 1, y - 13, 3, 3, '#e8c8a0');
        R(c, x, y - 13, 1, 1, '#111'); R(c, x + 2, y - 13, 1, 1, '#111'); R(c, x + 5, y - 6, 3, 1, '#7a4a28'); R(c, x + 7, y - 9, 1, 3, '#7a4a28');
        if (mk.arm > 0) R(c, x - 6, y - 16, 2, 6, '#7a4a28'); else R(c, x - 6, y - 8, 2, 5, '#7a4a28');
      }
      for (const p of peels) { R(c, Math.round(p.x) - 2, Math.round(p.y) - 2, 5, 4, OUT); R(c, Math.round(p.x) - 1, Math.round(p.y) - 1, 3, 2, '#f2d02a'); R(c, Math.round(p.x) + 1, Math.round(p.y) - 2, 2, 1, '#f2d02a'); }
      hero.draw(c);
      parts.draw(c);
      c.restore();
    },
    ui(c) {
      T(c, 'ALTURA ' + this.maxH + 'm', W - 6, 6, { size: 5, align: 'right', col: '#fff' });
      R(c, W - 8, 20, 3, 140, 'rgba(0,0,0,.3)'); R(c, W - 8, 20 + 140 * (1 - clamp((980 - hero.fy) / (980 - topY), 0, 1)), 3, 3, '#ffd54a'); R(c, W - 9, 18, 5, 2, '#7a5a1a');
      if (this.cur) promptAt(c, hero.cx, hero.y - this.cam.y - 22, 'a', 'Chutar o cacho');
    }
  };
  hero.cy = () => hero.y + hero.h / 2;
  return sc;
};

/* ---------- Cena 2: a síndrome de abstinência (pôr do sol) ---------- */
SCENES.c3_sunset = () => {
  const m = { x: 560, y: BEACH_FLOOR, h: 28 };
  const parts = new Parts();
  const sc = {
    music: 'calm', amb: 'waves', tod: 0, t: 0, pose: { sit: true, arms: 'drink', face: -1 }, qs: [],
    enter() { this.script = new Script(this.run()); },
    *run() {
      const sit = (o = {}) => { this.pose = Object.assign({ sit: true, face: -1 }, o); };
      sfx('slurp');
      yield think(m, 'Ahh... água de coco gelada. À sombra. Paz.');
      yield 1.0;
      sit(); Music.play(null);
      yield 3;
      yield say(m, 'É isso...', { auto: 1.8 });
      yield 3;
      yield say(m, '...legal.', { auto: 1.4 });
      yield 3.5;
      sit({ face: 1 });
      yield 1.5;
      yield say(m, 'Bonito, né. O mar.', { auto: 1.8 });
      yield 3;
      yield 0.9;
      yield { t: 0, update(dt) { this.t += dt; sc.tod = Math.min(.6, this.t / 7); return this.t > 4.5; } };
      yield say(m, 'Uma onda... duas ondas...', { auto: 2 });
      yield { t: 0, update(dt) { this.t += dt; sc.tod = Math.min(1, .6 + this.t / 8); return this.t > 2.5; } };
      yield say(m, '...trezentas e doze ondas.', { auto: 2 });
      yield 2.5;
      sit({ face: 1, arms: 'out' }); sfx('swoosh');
      parts.add({ x: m.x + 8, y: 140, vx: 70, vy: -60, g: 120, life: 1.4, col: '#8a8490', s: 2 });
      yield 1.5; sit({ face: 1 });
      yield say(m, 'Legal.', { auto: 1.2 });
      yield 3.5;
      sit({ face: 1, mouth: 'open', eyes: 'closed' });
      yield say(m, '*bocejo*', { auto: 1.4 });
      sit({ face: 1 });
      yield 3;
      sit({ face: -1, tic: true });
      sfx('notif'); this.qs.push({ x: m.x + 10, y: 120, t: 0 });
      yield think(m, '...Isso foi uma notificação?');
      sit({ face: -1, arms: 'phone' });
      yield think(m, 'Cadê meu celular? Que horas são? Tem alguma meta? Algum prazo?');
      AU.amb('ring');
      sfx('notif'); this.qs.push({ x: m.x - 20, y: 110, t: 0 });
      sit({ face: 1, tic: true, eyes: 'wide' });
      yield 1.2;
      yield { t: 0, update(dt) { this.t += dt; sc.tod = 1 + Math.min(.6, this.t / 4); sc.desat = Math.min(.4, this.t / 6); return this.t > 3; } };
      sit({ face: 1 });
      yield say(m, 'É isso. Isso é tudo.', { auto: 2 });
      yield 2.5;
      yield caption('O silêncio da ilha soa ensurdecedor.', { auto: 2.6 });
      this.pose = { face: -1, tremble: 1, eyes: 'wide' };
      yield think(m, 'Eu preciso... produzir alguma coisa. QUALQUER coisa.');
      G.go('c3_dream', { col: '#2a1a3a', dur: 1 });
    },
    update(dt) { this.t += dt; if (this.script) this.script.update(dt); for (const q of this.qs) { q.t += dt; q.y -= 8 * dt; } this.qs = this.qs.filter(q => q.t < 2); parts.update(dt); },
    draw(c) {
      const cx = BEACH_W - W;
      drawBeach(c, cx, this.tod, { pre: (cc) => { if (this.tod < .9) drawAdPlane(cc, this.t + 20); } });
      // sombra comprida
      c.globalAlpha = .25; R(c, m.x - cx - 30 - this.tod * 30, BEACH_FLOOR - 1, 30 + this.tod * 30, 3, '#3a2a1a'); c.globalAlpha = 1;
      drawPerson(c, m.x - cx, m.y, LOOKS.mirangoBeach, this.pose);
      if (this.pose.arms === 'drink') { R(c, m.x - cx - 9, 135, 7, 7, OUT); R(c, m.x - cx - 8, 136, 5, 5, '#5a7a2a'); R(c, m.x - cx - 6, 133, 1, 3, '#e8e8e8'); }
      else { R(c, m.x - cx + 8, 153, 7, 6, OUT); R(c, m.x - cx + 9, 154, 5, 4, '#5a7a2a'); }
      for (const q of this.qs) { c.globalAlpha = 1 - q.t / 2; pixText(c, '?', q.x - cx, q.y, '#ffffff', 2); c.globalAlpha = 1; }
      parts.draw(c);
    }
  };
  return sc;
};

/* ---------- Minigame 2: O Construtor de Ilusões (labirinto do tédio) ---------- */
SCENES.c3_dream = () => {
  const hero = new Hero(40, BEACH_FLOOR - 24, LOOKS.mirangoBeach); hero.speed = 70;
  const mA = heroActor(hero);
  const parts = new Parts();
  const solids = [{ x: -20, y: BEACH_FLOOR, w: BEACH_W + 40, h: 30 }];
  // caranguejos que andam de lado (pule por cima) e uma gaivota que mergulha avisando antes
  const crabs = [[200, 160, 250], [400, 370, 470], [590, 560, 620]].map(([x, a, b]) => ({ x, a, b, d: Math.random() < .5 ? -1 : 1, snap: 0 }));
  const diver = { st: 'off', t: 0, x: 0, y: -20, tx: 0 };
  const shells = [70, 190, 260, 420, 600].map(x => ({ x, got: false }));
  const gulls = Array.from({ length: 3 }, (_, i) => ({ x: 100 + i * 200, y: 50 + i * 8, v: 14 }));
  const sc = {
    cam: { x: 0, y: 0 }, music: 'dream', amb: 'dream', t: 0, bore: 100, shellsDone: false, sheet: 0, sheetDone: false, waveHits: 0, waveDone: false,
    hero, botTarget() { const s = shells.find(s => !s.got); if (s) return s.x; if (!this.shellsDone) return 120; if (!this.sheetDone) return 330; return 545; },
    hints() { return this.waveGame ? [['a', 'Marcar no verde'], ['b', 'Sair']] : [['move', 'Andar'], ['jump', 'Pular caranguejos'], ['a', 'Interagir (segure na planilha)']]; },
    waveGame: null, diveT: 5, tint: ['#b8a0ff', .22, 'multiply'], desat: .3, aligned: false, melt: false, climax: false, rocks: [[150, 0], [470, 0]],
    enter() {
      this.script = new Script((function* () {
        hero.frozen = true;
        yield bigText('O CONSTRUTOR DE ILUSÕES', 1.6, { size: 11, zoom: true, col: '#d8c0ff' });
        yield 1.2;
        Balloons.add(null, 'Recrie o trabalho: alinhe 5 conchas, desenhe uma planilha na areia e cronometre as ondas. Pule os caranguejos; fuja da sombra da gaivota.', { type: 'caption', auto: 6.5, bottom: true });
        hero.frozen = false;
      })());
    },
    hurt(src) {
      if (hero.inv > 0) return;
      hero.inv = 1.6; hero.stun = .2; hero.vx = (hero.cx < src ? -1 : 1) * 80; hero.vy = -70; this.bore -= 8; sfx('hurt'); G.shake(2);
    },
    *meltdown() {
      this.melt = true; hero.frozen = true; hero.vx = 0;
      const g = gulls[0]; g.x = clamp(hero.cx + 30, 20, BEACH_W - 20);
      hero.pose = { arms: 'point', mouth: 'shout', eyes: 'wide' }; hero.face = 1;
      yield shout(mA, 'VOCÊS ESTÃO ATRASADAS COM O RELATÓRIO, GAIVOTAS!', { auto: 2 });
      sfx('gull');
      hero.pose = { arms: 'out', mouth: 'open' };
      yield say(mA, 'E você, pedra: 27,5% de imposto. Retido na fonte. Assina aqui.', { auto: 2.6 });
      hero.pose = {}; this.bore = 50; hero.frozen = false; this.melt = false;
    },
    *climaxGen() {
      this.climax = true; hero.frozen = true; hero.vx = 0; Music.play(null); sfx('glitch');
      yield { t: 0, update(dt) { this.t += dt; G.glitch = Math.min(1, this.t / 1.5); sc.redSun = Math.floor(this.t * 6) % 2 === 0; if (Math.random() < .2) sfx('glitch'); return this.t > 1.6; } };
      yield 1.2;
      // tropeça num caranguejo
      const cb = crabs[0]; cb.a = cb.b = cb.x = hero.cx + hero.face * 14; cb.d = 0;
      hero.auto = hero.cx + 30; hero.frozen = false;
      yield .35; hero.auto = null; hero.frozen = true;
      yield { t: 0, update(dt) { this.t += dt; hero.pose = { rot: hero.face * Math.min(1.5, this.t * 5), eyes: 'wide', mouth: 'shout' }; return this.t > .4; } };
      sfx('thud');
      yield shout(mA, 'AAAAAAAAAAH!', { auto: 1 });
      G.flash('#fff', 1);
      yield .1;
      G.glitch = 0; sfx('pum'); G.shake(12);
      yield bigText('PUM!', 1, { size: 40, zoom: true, col: '#fff', shc: '#000' });
      G.go('c3_wake', { cut: true, black: true });
    },
    update(dt) {
      this.t += dt;
      if (this.script) { this.script.update(dt); if (this.script.done) this.script = null; }
      if (this.waveGame) {
        const wg = this.waveGame; wg.p += dt * wg.s; const pos = (Math.sin(wg.p) + 1) / 2;
        if (Input.pressed('a')) {
          if (pos > .78) { this.waveHits++; sfx('ok'); G.shake(1); sayAuto(mA, ['PRAZO: 14h32!', 'PRAZO: 14h33!', 'PRAZO: 14h34! ENTREGUE!'][this.waveHits - 1], 1.2, {}); wg.s += .8; }
          else { sfx('hurt'); this.bore -= 4; sayAuto(mA, 'Atrasou! ATRASOU!', 1, {}); }
          if (this.waveHits >= 3) { this.waveDone = true; this.waveGame = null; hero.frozen = false; this.bore = Math.min(100, this.bore + 25); }
        }
        if (Input.pressed('b')) { this.waveGame = null; hero.frozen = false; }
      }
      hero.update(dt, solids, { minX: 4, maxX: BEACH_W - 4, parts, upJump: true, stepSfx: 'stepSand', dust: '#c8b8d8' });
      if (!this.climax && !this.melt) {
        this.bore -= 1.5 * dt;
        if (this.bore <= 0 && !this.script) { this.bore = 0; this.script = new Script(this.meltdown()); }
      }
      const lack = 1 - clamp(this.bore / 100, 0, 1);
      if (!this.climax) { this.desat = .25 + lack * .5; this.vig = lack * .7; G.glitch = Math.max(0, G.glitch - dt * 1.5); if (lack > .7 && Math.random() < .02) G.glitch = .25; }
      // caranguejos
      for (const cb of crabs) {
        cb.x += cb.d * 13 * dt; if (cb.x < cb.a) cb.d = 1; if (cb.x > cb.b) cb.d = -1;
        cb.snap = Math.abs(hero.cx - cb.x) < 28 ? cb.snap + dt : 0;
        if (!this.climax && overlap(hero, { x: cb.x - 4, y: BEACH_FLOOR - 5, w: 9, h: 5 })) { this.hurt(cb.x); if (hero.inv > 1.5) sayAuto(mA, 'Ai! Belisco não tem prazo!', 1.2, {}); }
      }
      // gaivota mergulhadora (aviso → mergulho → vai embora)
      if (!this.climax && !this.melt) {
        const d = diver;
        if (d.st === 'off') { this.diveT -= dt; if (this.diveT <= 0) { d.st = 'warn'; d.t = 0; d.tx = hero.cx; d.x = hero.cx - 80; d.y = 30; sfx('gull'); } }
        else if (d.st === 'warn') { d.t += dt; d.x = lerp(d.x, d.tx + Math.cos(d.t * 5) * 20, dt * 3); d.y = 30 + Math.sin(d.t * 5) * 4; if (d.t > 1.4) { d.st = 'dive'; d.t = 0; d.sx = d.x; d.sy = d.y; sfx('swoosh'); } }
        else if (d.st === 'dive') { d.t += dt; const k = Math.min(1, d.t / .45); d.x = lerp(d.sx, d.tx, k); d.y = lerp(d.sy, BEACH_FLOOR - 10, k * k); if (d.y > BEACH_FLOOR - 26 && overlap(hero, { x: d.x - 6, y: d.y - 4, w: 12, h: 8 })) { this.hurt(d.x); sayAuto(mA, 'Sai, gaivota!', 1, {}); } if (k >= 1) { d.st = 'up'; d.t = 0; } }
        else if (d.st === 'up') { d.t += dt; d.x += 90 * dt; d.y -= 70 * dt; if (d.y < -20) { d.st = 'off'; this.diveT = rnd(3.5, 5.5); } }
      } else diver.st = 'off';
      // conchas
      for (const s of shells) if (!s.got && Math.abs(hero.cx - s.x) < 8 && hero.fy > BEACH_FLOOR - 4) { s.got = true; sfx('coin'); }
      for (const g of gulls) { g.x += g.v * dt; if (g.x > BEACH_W + 20) g.x = -20; }
      // estações
      const got = shells.filter(s => s.got).length;
      this.cur = null;
      if (!hero.frozen && !this.script) {
        if (Math.abs(hero.cx - 120) < 16 && !this.shellsDone && got === 5) this.cur = { x: 120, l: 'Alinhar conchas', k: 'shell' };
        else if (Math.abs(hero.cx - 330) < 18 && !this.sheetDone) this.cur = { x: 330, l: 'Desenhar planilha (segure)', k: 'sheet' };
        else if (Math.abs(hero.cx - 545) < 18 && !this.waveDone) this.cur = { x: 545, l: 'Cronometrar ondas', k: 'wave' };
      }
      if (this.cur) {
        const k = this.cur.k;
        if (k === 'shell' && Input.pressed('a')) { this.shellsDone = true; this.aligned = 0; sfx('sparkle'); this.bore = Math.min(100, this.bore + 25); sayAuto(mA, 'Milimetricamente alinhadas. Padrão ISO.', 2, {}); }
        if (k === 'sheet' && Input.down('a')) { this.sheet += dt / 2.6; hero.pose = { crouch: true, arms: 'out' }; if (Math.random() < .3) sfx('paper'); if (this.sheet >= 1) { this.sheetDone = true; hero.pose = {}; this.bore = Math.min(100, this.bore + 25); sfx('ok'); sayAuto(mA, 'Planilha.xlsx — salva na areia.', 2, {}); } }
        else if (k === 'sheet') hero.pose = {};
        if (k === 'wave' && Input.pressed('a')) { this.waveGame = { p: 0, s: 2.2 }; hero.frozen = true; hero.vx = 0; }
      } else if (!this.climax && !this.melt) hero.pose = {};
      if (this.aligned !== false && this.aligned < 1) this.aligned = Math.min(1, this.aligned + dt);
      if (!this.climax && this.shellsDone && this.sheetDone && this.waveDone && !this.script) this.script = new Script(this.climaxGen());
      parts.update(dt);
      const tx = clamp(hero.cx - W / 2 + hero.face * 20, 0, BEACH_W - W);
      this.cam.x = lerp(this.cam.x, tx, Math.min(1, dt * 4));
    },
    draw(c) {
      const cx = Math.round(this.cam.x);
      drawBeach(c, cx, 1.3, { redSun: this.redSun, noProps: true });
      c.save(); c.translate(-cx, 0);
      // estações na areia
      const allShells = shells.every(s2 => s2.got) && !this.shellsDone;
      if (allShells) { c.globalAlpha = .35 + Math.sin(G.t * 6) * .25; R(c, 100, 160, 42, 12, '#ffe98a'); c.globalAlpha = 1; }
      R(c, 104, 168, 34, 1, allShells ? '#ffd54a' : '#9a8aa8'); pixText(c, 'LINHA', 120, 172, allShells ? '#ffd54a' : '#7a6a8a', 1, 'center');
      shells.forEach((s, i) => {
        let x = s.x, y = BEACH_FLOOR + 2;
        if (this.shellsDone) { const tx = 106 + i * 6; x = lerp(s.x, tx, ease(this.aligned)); y = 162; }
        else if (s.got) return;
        R(c, Math.round(x), y, 4, 3, '#f6c8c8'); R(c, Math.round(x) + 1, y, 2, 1, '#fff');
        if (!s.got) { const k = .4 + Math.sin(G.t * 5 + i) * .3; c.globalAlpha = k; R(c, Math.round(x) - 2, y - 2, 8, 7, '#ffe98a'); c.globalAlpha = 1; R(c, Math.round(x), y, 4, 3, '#f6c8c8'); R(c, Math.round(x) + 1, y, 2, 1, '#fff'); R(c, Math.round(x) + 1, y - 4 - Math.round(k * 3), 1, 2, '#fff'); }
      });
      // planilha
      const sp = this.sheetDone ? 1 : this.sheet;
      if (sp > 0) {
        const cols = 6, rows = 3, gx = 306, gy = 162;
        for (let r = 0; r <= rows; r++) R(c, gx, gy + r * 5, Math.round(48 * clamp(sp * 2 - r * .15, 0, 1)), 1, '#8a7a5a');
        for (let k = 0; k <= cols; k++) if (sp > .5) R(c, gx + k * 8, gy, 1, Math.round(15 * clamp((sp - .5) * 2, 0, 1)), '#8a7a5a');
        if (sp >= 1) pixText(c, 'Σ', gx + 50, gy + 4, '#8a7a5a');
      }
      R(c, 330, 150, 1, 8, '#6a4a28'); pixText(c, 'XLS', 330, 142, '#7a6a8a', 1, 'center');
      R(c, 545, 146, 2, 12, '#6a4a28'); R(c, 541, 146, 10, 6, '#d8323c'); pixText(c, 'T', 546, 147, '#fff', 1, 'center');
      // pedras
      for (const [x] of this.rocks) { R(c, x, 154, 10, 6, '#7a7488'); R(c, x + 1, 154, 8, 2, '#9a94a8'); }
      for (const g of gulls) { const f = Math.floor(G.t * 4) % 2; R(c, Math.round(g.x) - 3, g.y + (f ? 0 : -1), 3, 1, '#eee'); R(c, Math.round(g.x) + 1, g.y + (f ? 0 : -1), 3, 1, '#eee'); }
      // caranguejos (vermelho vivo, garras abrindo quando você chega perto)
      for (const cb of crabs) {
        const x = Math.round(cb.x), y = BEACH_FLOOR, op = Math.floor(cb.snap * 8) % 2;
        R(c, x - 5, y - 5, 11, 5, OUT); R(c, x - 4, y - 4, 9, 3, '#e8402a'); R(c, x - 4, y - 4, 9, 1, '#ff8a6a');
        R(c, x - 7, y - 7 - op, 3, 3, '#e8402a'); R(c, x + 5, y - 7 - op, 3, 3, '#e8402a'); R(c, x - 7, y - 7 - op, 1, 1, OUT); R(c, x + 7, y - 7 - op, 1, 1, OUT);
        R(c, x - 2, y - 7, 1, 2, '#111'); R(c, x + 2, y - 7, 1, 2, '#111');
        for (let i = -3; i <= 3; i += 2) R(c, x + i, y - 1, 1, 1, '#a82a1a');
      }
      // gaivota: sombra de aviso no chão e o mergulho
      const d = diver;
      if (d.st === 'warn' || d.st === 'dive') {
        const k = d.st === 'warn' ? Math.min(1, d.t / 1.4) : 1;
        c.globalAlpha = .25 + k * .45; R(c, Math.round(d.tx) - 8, BEACH_FLOOR, 16, 3, '#2a0a1a'); c.globalAlpha = 1;
        if (d.st === 'warn' && Math.floor(G.t * 8) % 2) pixText(c, '!', Math.round(d.tx), BEACH_FLOOR - 40, '#ff5252', 2, 'center');
      }
      if (d.st !== 'off') {
        const x = Math.round(d.x), y = Math.round(d.y), f = d.st === 'dive' ? 0 : Math.floor(G.t * 8) % 2;
        R(c, x - 4, y - 2, 9, 4, OUT); R(c, x - 3, y - 1, 7, 2, '#f4f4f4'); R(c, x + 3, y - 1, 3, 1, '#ffb030');
        R(c, x - 9, y - 2 - (f ? 2 : 0), 6, 1, '#d8d8d8'); R(c, x + 3, y - 2 - (f ? 2 : 0), 6, 1, '#d8d8d8'); R(c, x + 1, y - 2, 1, 1, '#111');
      }
      hero.draw(c);
      parts.draw(c);
      c.restore();
    },
    ui(c) {
      const got = shells.filter(s => s.got).length;
      const row = (y, ok, s) => T(c, (ok ? '☑ ' : '☐ ') + s, 8, y, { f: FONT2, size: 9, col: ok ? '#9aff9a' : '#e8e0f8' });
      c.font = '9px ' + FONT2; const cw = Math.max(...['☐ Conchas 5/5 + alinhar', '☐ Ondas cronometradas 3/3'].map(t => c.measureText(t).width)) + 10;
      pxBox(c, 4, 4, cw, 36, 'rgba(30,20,44,.75)', '#8a7aa8');
      row(6, this.shellsDone, 'Conchas ' + (this.shellsDone ? 5 : got) + '/5 + alinhar');
      row(16, this.sheetDone, 'Planilha na areia');
      row(26, this.waveDone, 'Ondas cronometradas ' + this.waveHits + '/3');
      // próximo passo sempre indicado com seta + brilho no chão
      if (!this.climax && !this.waveGame && !this.melt) {
        let t = null, x = null;
        const left = shells.filter(s => !s.got);
        if (left.length && !this.shellsDone) { t = 'Pegue as conchas brilhando (' + (5 - left.length) + '/5)'; let b = left[0]; for (const s2 of left) if (Math.abs(s2.x - hero.cx) < Math.abs(b.x - hero.cx)) b = s2; x = b.x; }
        else if (!this.shellsDone) { t = 'Leve as conchas até a LINHA e aperte ' + Input.label('a'); x = 120; }
        else if (!this.sheetDone) { t = 'Desenhe a planilha na areia (XLS)'; x = 330; }
        else if (!this.waveDone) { t = 'Cronometre as ondas na bandeira'; x = 545; }
        if (t && !this.cur) objectiveUI(c, this, t, x, BEACH_FLOOR - 40, H - HINT_H - 13);
      }
      if (this.cur && !this.waveGame) promptAt(c, this.cur.x - this.cam.x, 104, 'a', this.cur.l);
      if (this.cur && this.cur.k === 'sheet' && this.sheet > 0 && !this.sheetDone) { R(c, this.cur.x - this.cam.x - 15, 120, 30, 3, '#2a2438'); R(c, this.cur.x - this.cam.x - 15, 120, 30 * this.sheet, 3, '#ffd54a'); }
      if (this.waveGame) {
        const pos = (Math.sin(this.waveGame.p) + 1) / 2;
        pxBox(c, 80, 60, 160, 40, 'rgba(20,14,30,.9)', '#d8c0ff');
        T(c, 'CRONOMETRE A ONDA NO PICO', W / 2, 64, { size: 4.5, align: 'center', col: '#fff' });
        R(c, 90, 80, 140, 8, '#2a2438'); R(c, 90 + 140 * .78, 80, 140 * .22, 8, '#3a8a4a');
        const mx = 90 + 140 * pos; R(c, mx - 1, 77, 3, 14, '#ffd54a');
        T(c, Input.label('a') + ' no verde  •  ' + Input.label('b') + ' sair', W / 2, 92, { f: FONT2, size: 8, align: 'center', col: '#cfc8dc' });
      }
    }
  };
  return sc;
};

/* ---------- O despertar no ônibus ---------- */
SCENES.c3_wake = () => {
  // mesmo interior do 310 Lapa visto no fim do capítulo 2, agora à noite
  const rng = srand(31);
  const near = makeCanvas(W * 2, 120, (c, w, h) => {
    let x = 0;
    while (x < w) { const bw = 30 + Math.floor(rng() * 40), bh = 40 + Math.floor(rng() * 50); R(c, x, h - bh, bw - 2, bh, pick(['#10121e', '#141626', '#0e1018'])); for (let yy = h - bh + 4; yy < h - 6; yy += 7) for (let xx = x + 3; xx < x + bw - 6; xx += 6) R(c, xx, yy, 3, 4, rng() < .15 ? '#d8b86a' : '#181a2a'); x += bw; }
  });
  const sc = {
    music: null, amb: 'bus', t: 0, sx: 0, holdBlack: true, eyes: 'closed', fog: 0,
    enter() { this.script = new Script(this.run()); },
    *run() {
      G.fadeA = 1; sfx('pum'); G.shake(10);
      yield .8;
      yield fadeTo(0, .5);
      yield 1.2;
      this.eyes = null; sfx('heart');
      yield 1;
      this.fog = 1;
      const m = { x: 206, y: 132, h: 6 };
      yield think(m, '...Uma praia?');
      yield 1;
      yield think(m, 'Foi só... um cochilo.');
      yield 1.2;
      G.unlock(4);
      yield endCard('FIM DO CAPÍTULO 3', 'Barganha');
      G.go('c4_street', { cut: true, black: true });
    },
    update(dt) { this.t += dt; this.sx += dt * 60; if (this.script) this.script.update(dt); },
    draw(c) {
      R(c, 0, 0, W, H, '#2a2a36');
      const WX = 12, WY = 10, WW = 244, WH = 138;
      c.save(); c.beginPath(); c.rect(WX, WY, WW, WH); c.clip();
      vgrad(c, WX, WY, WW, WH, ['#05060e', '#12152a']);
      const b = (Math.round(this.sx * .8) % (W * 2)) - W * 2;
      c.drawImage(near, b, 4); c.drawImage(near, b + W * 2, 4);
      R(c, WX, 118, WW, 6, '#2a2830'); R(c, WX, 124, WW, 24, '#16151c');
      for (let i = 0; i < 4; i++) { const px = ((i * 90 + this.sx * 1.6) % 360) - 40; R(c, px, 64, 3, 56, '#0a0a10'); R(c, px - 6, 64, 14, 3, '#0a0a10'); R(c, px + 4, 67, 4, 2, '#ffcf7a'); c.globalAlpha = .12; R(c, px - 10, 70, 30, 48, '#ffcf7a'); c.globalAlpha = 1; }
      c.globalAlpha = .1; R(c, WX, WY, WW, WH, '#6a7ab0'); c.globalAlpha = 1;
      c.restore();
      R(c, WX - 4, WY - 4, WW + 8, 4, '#4a4640'); R(c, WX - 4, WY + WH, WW + 8, 6, '#4a4640'); R(c, WX - 4, WY, 4, WH, '#4a4640'); R(c, WX + WW, WY, 4, WH, '#4a4640');
      R(c, WX + WW / 2 - 1, WY, 3, WH, '#4a4640'); R(c, WX, WY + 28, WW, 2, '#4a4640');
      R(c, 256, 14, 64, 14, '#111'); pixText(c, '310 LAPA', 288, 16, '#ffb030', 1, 'center'); pixText(c, 'PROX: PERIFERIA', 288, 22, '#ff7a30', 1, 'center');
      R(c, 0, 154, W, 26, '#4a4438');
      const sx0 = 168;
      R(c, sx0 + 58, 104, 14, 62, OUT); R(c, sx0 + 60, 106, 10, 58, '#1e3a70'); R(c, sx0 + 60, 106, 3, 58, '#3a5a9a'); R(c, sx0 + 56, 100, 18, 6, '#8a8a8a');
      R(c, sx0 + 4, 152, 70, 12, OUT); R(c, sx0 + 6, 154, 66, 8, '#1e3a70'); R(c, sx0 + 6, 154, 66, 2, '#3a5a9a');
      R(c, sx0 + 20, 164, 4, 16, '#555'); R(c, sx0 + 56, 164, 4, 16, '#555');
      const vib = Math.floor(this.t * 12) % 2;
      drawPersonBig(c, sx0 + 46, 174 + vib, LOOKS.mirango, { face: -1, sit: true, slump: .7, eyes: this.eyes, rot2: -.14 }, 2);
      if (this.fog) { c.globalAlpha = .35 + Math.sin(this.t * 2) * .05; R(c, 186, 120, 10, 14, '#d8e8f0'); R(c, 188, 118, 6, 18, '#d8e8f0'); c.globalAlpha = 1; }
      c.globalAlpha = .3; R(c, 0, 0, W, H, '#0a0c20'); c.globalAlpha = 1;
    }
  };
  return sc;
};
