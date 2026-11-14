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
      yield say(nat, 'O coco mais fresco fica lá no alto daquela palmeira gigante. Pedra e concha tem de sobra na areia.', { name: 'NATIVO' });
      yield think(mA, 'Com as próprias mãos, então.');
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
      if (this.cur && Input.pressed('a')) { sfx('ok'); G.go('c3_target'); }
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
      if (this.cur) promptAt(c, 608 - this.cam.x, 70, 'a', 'Derrubar os cocos');
      else if (this.stage === 2) objectiveUI(c, this, null);
      if (this.stage === 2 && !this.cur) { const sx = 608 - this.cam.x; if (sx > W - 6) { c.fillStyle = '#fff'; c.beginPath(); c.moveTo(W - 4, 100); c.lineTo(W - 10, 95); c.lineTo(W - 10, 105); c.fill(); } }
    }
  };
  return sc;
};

/* ---------- Minigame: Tiro ao Coco (mira + força) ---------- */
SCENES.c3_target = () => {
  const rng = srand(919);
  const PALM_X = 262, GRAV = 220, ANG = 56 * Math.PI / 180, NEED = 3;
  let crown = { x: 246, y: 46 };
  const palm = makeCanvas(W, H, (c) => { crown = palmP(c, PALM_X, BEACH_FLOOR + 2, 112, -16, rng, { big: 30, coco: false }); });
  const M = { x: 70, y: BEACH_FLOOR, h: 28 };          // Mirango (parado, arremessando)
  const hand = () => ({ x: M.x + 5, y: BEACH_FLOOR - 21 });
  const cocos = [[-6, 3], [-1, 5], [4, 3], [-3, 9], [3, 9]].map(([dx, dy]) => ({ x: crown.x + dx, y: crown.y + dy, ox: dx, oy: dy, st: 'on', vx: 0, vy: 0, r: 0 }));
  const birds = Array.from({ length: 3 }, (_, i) => ({ x: i * 120 - 40, y: 20 + i * 18, v: rnd(16, 26), d: 1, ph: rnd(6), dead: 0, vy: 0, rot: 0 }));
  const parts = new Parts();
  const LEAD = ['Menos um lead.', 'Lead descartado.', 'Esse não ia converter mesmo.', 'Taxa de rejeição: uma gaivota.', 'Menos um lead no funil.'];
  const sc = {
    music: 'beach', amb: 'waves', t: 0, phase: 'intro', kind: 'pedra', hits: 0, misses: 0, leads: 0, pose: {}, poseT: 0,
    cross: { x: 0, y: 0 }, lock: null, p: 0, pDir: 1, pStar: .6, band: .085, stone: null, trail: [], lastTrail: [], capSafe: [80, W - 4],
    hints() {
      return this.phase === 'pick' ? [['a', 'Pegar ' + this.kind]] : this.phase === 'aim' ? [['a', 'Travar a mira nos cocos']] :
        this.phase === 'power' ? [['a', 'Arremessar na força certa']] : null;
    },
    enter() {
      this.script = new Script((function* () {
        yield bigText('TIRO AO COCO', 1.4, { size: 14, zoom: true, col: '#ffd54a' });
        Balloons.add(null, 'Pegue pedras ou conchas da areia, trave a mira nos cocos e solte na força certa (faixa verde).', { type: 'caption', auto: 6 });
        sc.phase = 'pick';
      })());
    },
    onCoco() { return cocos.some(k => k.st === 'on' && Math.hypot(this.cocoPos(k).x + 1.5 - this.cross.x, this.cocoPos(k).y + 1.5 - this.cross.y) < 6); },
    say(t, s = 1.4) { sayAuto(M, t, s, {}); },
    cocoPos(k) { return k.st === 'on' ? { x: crown.x + k.ox, y: crown.y + k.oy + Math.round(Math.sin(G.t * 1.6 + k.ox) * .6) } : k; },
    throwIt() {
      const o = hand(), L = this.lock, dx = Math.max(30, L.x - o.x), up = o.y - L.y;
      const ta = Math.tan(ANG), c2 = Math.cos(ANG) ** 2;
      const den = Math.max(1, 2 * c2 * (dx * ta - up));
      const v0 = Math.sqrt(GRAV * dx * dx / den);
      const err = this.p - this.pStar;
      const v = v0 * (1 + err * .32);
      this.stone = { x: o.x, y: o.y, vx: v * Math.cos(ANG), vy: -v * Math.sin(ANG), kind: this.kind, rot: 0 };
      this.trail = []; this.phase = 'fly'; this.pose = { arms: 'out' }; this.poseT = .35; sfx('swoosh');
    },
    land(miss) {
      const s = this.stone; this.stone = null; this.lastTrail = this.trail;
      if (miss) {
        this.misses++; if (this.misses % 2 === 0) this.band = Math.min(.13, this.band + .015);
        const far = s && s.x > PALM_X + 10;
        this.say(pick(far ? ['Forte demais!', 'Passou longe...', 'Braço de mais.'] : ['Fraco demais...', 'Faltou força.', 'Quase.']), 1.2);
      }
      this.kind = this.kind === 'pedra' ? 'concha' : 'pedra';
      if (this.hits >= NEED) { this.phase = 'done'; this.script = new Script(this.win()); }
      else this.phase = 'pick';
    },
    *win() {
      yield .8;
      this.pose = { arms: 'up', mouth: 'smile' }; sfx('sparkle');
      yield say(M, 'Esforço orgânico direto. Funciona!', { auto: 1.8 });
      // vai buscar um coco
      const tgt = cocos.find(k => k.st === 'ground') || { x: 220 };
      yield { t: 0, update(dt) { this.t += dt; M.x = Math.min(tgt.x - 10, M.x + 50 * dt); sc.pose = { walk: this.t * 2.2 }; return M.x >= tgt.x - 10; } };
      this.pose = { crouch: true }; sfx('pop'); tgt.held = true;
      yield .4;
      this.pose = { arms: 'drink', mouth: 'smile' };
      yield think(M, 'Meu primeiro coco sem cartão de crédito.');
      G.go('c3_sunset', { dur: 1.2 });
    },
    update(dt) {
      this.t += dt;
      if (this.script) { this.script.update(dt); if (this.script.done) this.script = null; }
      if (this.poseT > 0) { this.poseT -= dt; if (this.poseT <= 0 && this.phase !== 'done') this.pose = {}; }
      // mira: retícula passeando pela copa da palmeira
      const k = this.t * .85;
      this.cross.x = Math.round(crown.x - 1 + Math.sin(k * 1.1) * 22);
      this.cross.y = Math.round(crown.y + 6 + Math.sin(k * 1.63 + 1) * 14);
      this.cur = null;
      if (this.phase === 'pick') {
        this.cur = { x: M.x };
        if (Input.pressed('a')) { this.phase = 'picking'; this.pose = { crouch: true }; sfx('stepSand'); setTimeout(() => { if (sc.phase === 'picking') { sc.phase = 'aim'; sc.pose = { arms: 'point' }; sfx('click'); } }, 380); }
      } else if (this.phase === 'aim') {
        this.pose = { arms: 'point' };
        if (Input.pressed('a')) { this.lock = { x: this.cross.x, y: this.cross.y }; this.phase = 'power'; this.p = 0; this.pDir = 1; this.pStar = rnd(.45, .8); sfx('ok'); }
      } else if (this.phase === 'power') {
        this.pose = { arms: 'up', tremble: Math.random() < .2 };
        this.p += this.pDir * dt * .85; if (this.p >= 1) { this.p = 1; this.pDir = -1; } if (this.p <= 0) { this.p = 0; this.pDir = 1; }
        if (Input.pressed('a')) this.throwIt();
      } else if (this.phase === 'fly' && this.stone) {
        const s = this.stone;
        for (let i = 0; i < 4 && this.stone; i++) {
          const h = dt / 4; s.vy += GRAV * h; s.x += s.vx * h; s.y += s.vy * h; s.rot += h * 12;
          if (i === 0) this.trail.push({ x: s.x, y: s.y });
          for (const c of cocos) {
            if (c.st !== 'on') continue; const cp = this.cocoPos(c);
            if (Math.hypot(cp.x + 1.5 - s.x, cp.y + 1.5 - s.y) < 7) {
              c.st = 'fall'; c.x = cp.x; c.y = cp.y; c.vx = rnd(-25, 5); c.vy = -20; this.hits++;
              sfx('crack'); G.shake(2); parts.burst(s.x, s.y, 10, { col: ['#3eaa4f', '#7a5a1a', '#fff'], min: 20, max: 70, lmax: .6 });
              this.say(this.hits >= NEED ? 'TRÊS! Isso!' : pick(['Isso!', 'Na mosca!', 'Toma, coco!']), 1.1);
              s.vx *= -.3; s.vy = -40; s.hit = true; break;
            }
          }
          for (const b of birds) {
            if (b.dead || s.hit) continue;
            if (Math.hypot(b.x - s.x, b.y - s.y) < 6) {
              b.dead = 1; b.vy = -20; this.leads++; sfx('gull'); sfx('pop');
              for (let j = 0; j < 8; j++) parts.add({ x: b.x, y: b.y, vx: rnd(-30, 30), vy: rnd(-30, 10), g: 30, life: 1.6, col: '#f3efe6', s: 1, drag: .5 });
              this.say(this.leads === 1 ? 'Menos um lead.' : pick(LEAD), 1.8);
            }
          }
          if (s.y >= BEACH_FLOOR - 1) { sfx('thud'); parts.burst(s.x, BEACH_FLOOR - 1, 5, { col: ['#e8d8a8', '#d8c490'], min: 10, max: 40, lmax: .4 }); this.land(!s.hit); break; }
          if (s.x > W + 30 || s.x < -30) { this.land(!s.hit); break; }
        }
      }
      // cocos caindo e rolando
      for (const c of cocos) {
        if (c.st !== 'fall') continue;
        c.vy += 320 * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.r += dt * 8;
        if (c.y >= BEACH_FLOOR - 4) { c.y = BEACH_FLOOR - 4; if (Math.abs(c.vy) > 60) { c.vy *= -.35; sfx('thud'); } else { c.vy = 0; c.vx *= .9; if (Math.abs(c.vx) < 2) c.st = 'ground'; } }
      }
      // gaivotas ao fundo
      for (const b of birds) {
        if (b.dead) {
          b.vy += 120 * dt; b.y += b.vy * dt; b.rot += dt * 9; b.dead += dt;
          if (b.y > 125) { b.y = 125; b.vy = 0; }
          if (b.dead > 4) { b.dead = 0; b.d = Math.random() < .5 ? 1 : -1; b.x = b.d > 0 ? -20 : W + 20; b.y = rnd(14, 70); b.v = rnd(16, 28); }
          continue;
        }
        b.x += b.d * b.v * dt; b.y += Math.sin(this.t * 1.3 + b.ph) * 4 * dt;
        if (b.x > W + 24 || b.x < -24) { b.d = -b.d; b.y = rnd(14, 70); if (Math.random() < .3) sfx('gull'); }
      }
      parts.update(dt);
    },
    draw(c) {
      drawBeach(c, 0, 0, { noProps: true });
      // gaivotas (fundo)
      for (const b of birds) {
        const x = Math.round(b.x), y = Math.round(b.y);
        if (b.dead) { R(c, x - 2, y - 1, 5, 2, '#f3efe6'); R(c, x - 1, y + 1, 1, 1, '#ff9a2a'); R(c, x + 2, y - 2, 1, 1, '#555'); continue; }
        const f = Math.floor(G.t * 5 + b.ph) % 2;
        R(c, x - 4, y + (f ? 0 : -2), 4, 1, '#fff'); R(c, x + 1, y + (f ? 0 : -2), 4, 1, '#fff'); R(c, x - 1, y, 3, 2, '#f3efe6'); R(c, x + (b.d > 0 ? 2 : -2), y, 1, 1, '#ff9a2a');
      }
      c.drawImage(palm, 0, 0);
      // cocos
      for (const k of cocos) {
        if (k.held || k.st === 'gone') continue;
        const p = this.cocoPos(k), x = Math.round(p.x), y = Math.round(p.y);
        R(c, x - 1, y - 1, 6, 6, OUT); R(c, x, y, 4, 4, '#6a4a1a'); R(c, x, y, 2, 1, '#9a7a3a');
      }
      // monte de pedras e conchas aos pés do Mirango
      for (const [dx, col] of [[-16, '#9a9488'], [-12, '#f6c8c8'], [-9, '#8a8478'], [-20, '#fff'], [-6, '#b8b2a6']]) { R(c, M.x + dx, BEACH_FLOOR - 2, 3, 2, col); }
      // rastro do último arremesso (para medir o próximo)
      c.globalAlpha = .35; for (let i = 0; i < this.lastTrail.length; i += 2) R(c, Math.round(this.lastTrail[i].x), Math.round(this.lastTrail[i].y), 1, 1, '#fff'); c.globalAlpha = 1;
      // Mirango
      drawPerson(c, M.x, M.y, LOOKS.mirangoBeach, Object.assign({ face: 1 }, this.pose));
      const held = cocos.find(k => k.held);
      if (held) { R(c, M.x + 2, BEACH_FLOOR - 24, 6, 6, OUT); R(c, M.x + 3, BEACH_FLOOR - 23, 4, 4, '#6a4a1a'); }
      const stoneAt = (x, y, kind, rot) => { x = Math.round(x); y = Math.round(y); if (kind === 'pedra') { R(c, x - 2, y - 2, 4, 4, OUT); R(c, x - 1, y - 1, 3, 3, '#8a8478'); R(c, x - 1, y - 1, 1, 1, '#b8b2a6'); } else { R(c, x - 2, y - 1, 5, 4, OUT); R(c, x - 1, y, 3, 2, '#f6c8c8'); R(c, x, y - 1, 1, 1, '#fff'); } };
      if (this.phase === 'aim' || this.phase === 'power') { const o = this.phase === 'power' ? { x: M.x + 2, y: BEACH_FLOOR - 28 } : hand(); stoneAt(o.x, o.y, this.kind); }
      if (this.stone) stoneAt(this.stone.x, this.stone.y, this.stone.kind, this.stone.rot);
      // retícula
      const drawCross = (x, y, col) => { R(c, x - 6, y, 4, 1, col); R(c, x + 3, y, 4, 1, col); R(c, x, y - 6, 1, 4, col); R(c, x, y + 3, 1, 4, col); R(c, x - 1, y - 1, 3, 3, 'rgba(0,0,0,0)'); c.strokeStyle = col; c.lineWidth = 1; c.beginPath(); c.arc(x + .5, y + .5, 4.5, 0, 7); c.stroke(); };
      if (this.phase === 'aim') { const on = this.onCoco(); drawCross(this.cross.x, this.cross.y, on ? '#7aff9a' : (Math.floor(G.t * 6) % 2 ? '#ffd54a' : '#ff9a2a')); }
      if ((this.phase === 'power' || this.phase === 'fly') && this.lock) drawCross(this.lock.x, this.lock.y, '#d8323c');
      parts.draw(c);
    },
    ui(c) {
      pxBox(c, 6, 6, 70, 13, 'rgba(10,10,20,.75)', '#ffd54a');
      T(c, 'COCOS ' + this.hits + '/' + NEED, 41, 9.5, { size: 5, align: 'center', col: '#fff' });
      if (this.phase === 'pick') promptAt(c, M.x, 98, 'a', 'Pegar ' + this.kind);
      if (this.phase === 'aim') T(c, 'MIRA', this.cross.x, this.cross.y + 9, { f: FONT2, size: 8, align: 'center', col: '#ffd54a' });
      if (this.phase === 'power') {
        const x0 = M.x - 30, y0 = 92, w = 60;
        pxBox(c, x0 - 3, y0 - 11, w + 6, 20, 'rgba(10,10,20,.85)', '#f3efe6');
        T(c, 'FORÇA', M.x, y0 - 9, { size: 4.5, align: 'center', col: '#fff' });
        R(c, x0, y0, w, 5, '#2c2638');
        R(c, x0 + w * (this.pStar - this.band), y0, w * this.band * 2, 5, '#3a9a4a');
        R(c, x0 + w * (this.pStar - this.band * .35), y0, w * this.band * .7, 5, '#7aff9a');
        R(c, Math.round(x0 + w * this.p) - 1, y0 - 2, 3, 9, '#ffd54a');
      }
    }
  };
  sc.botTarget = () => null;
  return sc;
};

/* ---------- Cutscene: a paz na praia… e os tremores ---------- */
SCENES.c3_sunset = () => {
  const cx = BEACH_W - W;
  const m = { x: 560, y: BEACH_FLOOR, h: 28 };
  const suit = npc(LOOKS.terno, cx - 20, BEACH_FLOOR, { active: false, h: 30 });
  const parts = new Parts();
  const sc = {
    cam: { x: cx, y: 0 }, music: 'calm', amb: 'waves', tod: 0, t: 0, pose: { sit: true, arms: 'drink', face: -1 }, jolt: 0, autoTrem: 0, tremT: 0,
    enter() { this.script = new Script(this.run()); },
    // um tremor: uma batida seca que sacode tudo de uma vez
    tremor(k = 1) {
      sfx('quake'); if (Music.name !== 'tense') Music.play('tense'); G.shake(5 + k * 4); this.jolt = 1;
      for (let i = 0; i < 18 * k; i++) parts.add({ x: cx + rnd(0, W), y: BEACH_FLOOR + rnd(-2, 18), vx: rnd(-8, 8), vy: rnd(-50, -20), g: 160, life: .8, col: pick(['#e8d8a8', '#d8c490', '#fff4d0']) });
      for (let i = 0; i < 5; i++) parts.add({ x: cx + rnd(0, W), y: rnd(60, 100), vx: rnd(-5, 5), vy: rnd(5, 25), g: 30, life: 1.6, col: pick(['#2f8a3f', '#3eaa4f']), s: 2, drag: .4 });
    },
    *run() {
      const sit = (o = {}) => { this.pose = Object.assign({ sit: true, face: -1 }, o); };
      sfx('slurp');
      yield think(m, 'Ahh... água de coco gelada. À sombra. Paz.');
      yield 1.2;
      sit({ arms: 'drink' });
      yield 3;
      sit({ face: 1 });
      yield say(m, 'Bonito, né. O mar.', { auto: 2 });
      yield { t: 0, update(dt) { this.t += dt; sc.tod = Math.min(.6, this.t / 7); return this.t > 5; } };
      yield say(m, 'Uma onda... duas ondas...', { auto: 2.2 });
      yield { t: 0, update(dt) { this.t += dt; sc.tod = Math.min(1, .6 + this.t / 8); return this.t > 3.5; } };
      sit({ face: 1, eyes: 'closed', mouth: 'smile' });
      yield think(m, 'Sem e-mail. Sem reunião. Sem meta.', { auto: 2.6 });
      yield 3;
      // o mundo começa a tremer
      this.tremor(1); sit({ face: 1, eyes: 'wide' });
      yield 2;
      yield think(m, '...O que foi isso?');
      yield 1.4;
      this.tremor(1);
      this.pose = { face: -1, eyes: 'wide', arms: 'shrug' };
      yield say(m, 'Terremoto?! Aqui?!', { auto: 1.6 });
      yield 1.8;
      this.tremor(1.2); this.pose = { face: 1, eyes: 'wide', tremble: true };
      yield 1.6;
      // um homem de terno atravessa a areia, como se nada estivesse acontecendo
      suit.active = true; this.autoTrem = 1; this.tremT = 1.4;
      this.pose = { face: -1, eyes: 'wide' };
      yield walkTo(suit, m.x - 32, 26);
      suit.face = 1;
      yield say(suit, 'Com licença...', { name: 'HOMEM DE TERNO', auto: 1.4 });
      yield .8;
      yield say(suit, 'Esse ônibus passa no Centro?', { name: 'HOMEM DE TERNO' });
      this.pose = { face: -1, eyes: 'wide', arms: 'shrug', mouth: 'open' };
      yield say(m, 'Ô-ônibus? Que ônibus?!', { auto: 1.8 });
      this.autoTrem = 0;
      yield 1;
      // a batida final
      this.tremor(2.5); sfx('pum'); G.flash('#fff', .9);
      yield .15;
      G.go('c3_wake', { cut: true, black: true });
    },
    update(dt) {
      this.t += dt; if (this.script) this.script.update(dt);
      this.jolt = Math.max(0, this.jolt - dt * 4);
      if (this.autoTrem) { this.tremT -= dt; if (this.tremT <= 0) { this.tremor(1); this.tremT = rnd(1.8, 2.6); } }
      parts.update(dt);
    },
    draw(c) {
      drawBeach(c, cx, this.tod, { pre: (cc) => { if (this.tod < .9) drawAdPlane(cc, this.t + 20); } });
      const j = Math.round(this.jolt * 2);
      // sombra comprida
      c.globalAlpha = .25; R(c, m.x - cx - 30 - this.tod * 30, BEACH_FLOOR - 1, 30 + this.tod * 30, 3, '#3a2a1a'); c.globalAlpha = 1;
      drawPerson(c, m.x - cx, m.y - j, LOOKS.mirangoBeach, this.pose);
      if (this.pose.arms === 'drink') { R(c, m.x - cx - 9, 135 - j, 7, 7, OUT); R(c, m.x - cx - 8, 136 - j, 5, 5, '#5a7a2a'); R(c, m.x - cx - 6, 133 - j, 1, 3, '#e8e8e8'); }
      else { R(c, m.x - cx + 8, 153 - j, 7, 6, OUT); R(c, m.x - cx + 9, 154 - j, 5, 4, '#5a7a2a'); }
      if (suit.active) {
        const x = suit.x - cx;
        c.globalAlpha = .25; R(c, x - 14, BEACH_FLOOR - 1, 14, 3, '#3a2a1a'); c.globalAlpha = 1;
        drawPerson(c, x, BEACH_FLOOR - j, LOOKS.terno, { face: suit.face, walk: suit.moving ? suit.walk : null, arms: 'hold' });
        const bx = x + suit.face * 5 - (suit.face < 0 ? 7 : 0); R(c, bx - 1, BEACH_FLOOR - 13 - j, 9, 7, OUT); R(c, bx, BEACH_FLOOR - 12 - j, 7, 5, '#5a3a20'); R(c, bx + 2, BEACH_FLOOR - 14 - j, 3, 1, OUT);
      }
      c.save(); c.translate(-cx, 0); parts.draw(c); c.restore();
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
    music: null, amb: 'bus', t: 0, sx: 0, holdBlack: true, eyes: 'closed', fog: 0, jolt: 0, bumpT: 99, pax: null, startle: 0,
    enter() { this.script = new Script(this.run()); },
    // buraco na pista: a mesma batida seca do sonho
    bump(k = 1) { sfx('bump'); G.shake(3 + k * 3); this.jolt = k; },
    *run() {
      const m = { x: 206, y: 132, h: 6 };
      const pax = this.pax = { x: 286, y: 192, h: 84, walk: 0, moving: false };
      G.fadeA = 1; this.bump(2); sfx('pum');
      yield .5;
      yield fadeTo(0, .3);
      // acorda num susto
      this.eyes = 'wide'; this.startle = 1; sfx('heart');
      yield 1.2;
      this.bump(1);
      yield .8;
      yield say(pax, 'Moço? Moço... esse ônibus passa no Centro?', { name: 'PASSAGEIRO' });
      this.startle = 0; this.eyes = null;
      yield 1;
      this.bumpT = 1.6;
      yield think(m, '...O ônibus. Os tremores eram os buracos.');
      yield say(m, 'Ah... passa. Quer dizer... acho que já passou.', {});
      yield say(pax, 'Ah, que droga.', { name: 'PASSAGEIRO', auto: 1.4 });
      yield walkTo(pax, 380, 30);
      this.pax = null;
      yield 1;
      this.fog = 1;
      yield think(m, 'Uma praia...');
      yield 1;
      yield think(m, 'Foi só um cochilo.');
      yield 1.2;
      G.unlock(4);
      yield endCard('FIM DO CAPÍTULO 3', 'Barganha');
      G.go('c4_street', { cut: true, black: true });
    },
    update(dt) {
      this.t += dt; this.sx += dt * 60; if (this.script) this.script.update(dt);
      this.jolt = Math.max(0, this.jolt - dt * 3);
      this.bumpT -= dt; if (this.bumpT <= 0) { this.bump(rnd(.6, 1)); this.bumpT = rnd(2.4, 4); }
    },
    draw(c) {
      busWindowView(c, true, (c) => {
        const WX = 0, WW = W;
        vgrad(c, 0, 0, W, 160, ['#05060e', '#12152a']);
        const b = (Math.round(this.sx * .8) % (W * 2)) - W * 2;
        c.drawImage(near, b, 4); c.drawImage(near, b + W * 2, 4);
        R(c, WX, 118, WW, 6, '#2a2830'); R(c, WX, 124, WW, 24, '#16151c');
        for (let i = 0; i < 4; i++) { const px = ((i * 90 + this.sx * 1.6) % 360) - 40; R(c, px, 64, 3, 56, '#0a0a10'); R(c, px - 6, 64, 14, 3, '#0a0a10'); R(c, px + 4, 67, 4, 2, '#ffcf7a'); c.globalAlpha = .12; R(c, px - 10, 70, 30, 48, '#ffcf7a'); c.globalAlpha = 1; }
      });
      R(c, 250, 26, 66, 16, '#111'); pixText(c, '310 LAPA', 283, 29, '#ffb030', 1, 'center'); pixText(c, 'PROX: PERIFERIA', 283, 35, '#ff7a30', 1, 'center');
      const sx0 = 168;
      c.save(); c.translate(sx0 - 6, 178); c.scale(2, 2); drawBusSeat(c, 0, 0, '#1e4680'); c.restore();
      c.save(); c.translate(sx0 + 46, 178); c.scale(2, 2); drawBusSeat(c, 0, 0, '#1e4680'); c.restore();
      const vib = Math.floor(this.t * 12) % 2 - Math.round(this.jolt * 3);
      drawPersonBig(c, sx0 + 46, 174 + vib, LOOKS.mirango, { face: -1, sit: true, slump: this.startle ? 0 : .7, eyes: this.eyes, mouth: this.startle ? 'open' : null, rot2: this.startle ? 0 : -.14, tremble: this.startle && Math.random() < .5 }, 2);
      // passageiro de terno em pé no corredor, segurando a alça
      if (this.pax) {
        const p = this.pax, px = Math.round(p.x), sw = Math.round(this.jolt * 2);
        drawPersonBig(c, px, p.y, LOOKS.terno, { face: p.moving ? 1 : -1, arms: p.moving ? null : 'up', walk: p.moving ? p.walk : null }, 3);
        if (!p.moving) { R(c, px - 6 + sw, 19, 1, 88, '#5a5f68'); R(c, px - 10 + sw, 104, 9, 8, '#2a6a34'); R(c, px - 8 + sw, 106, 5, 4, '#3a3c48'); }
      }
      if (this.fog) { c.globalAlpha = .35 + Math.sin(this.t * 2) * .05; R(c, 186, 120, 10, 14, '#d8e8f0'); R(c, 188, 118, 6, 18, '#d8e8f0'); c.globalAlpha = 1; }
      c.globalAlpha = .3; R(c, 0, 0, W, H, '#0a0c20'); c.globalAlpha = 1;
    }
  };
  return sc;
};
