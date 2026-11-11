'use strict';
/* =========================================================
   CAPÍTULO 1 — NEGAÇÃO: o cérebro institucionalizado
   Plataforma 2D no escritório + reunião de alinhamento.
   ========================================================= */
const OFFICE_W = 1040, FLOOR = 150;
const _offCache = {};
function buildOffice(auto) {
  const key = auto ? 'a' : 'n'; if (_offCache[key]) return _offCache[key];
  const rng = srand(auto ? 99 : 42);
  const farW = W + Math.ceil((OFFICE_W - W) * .3) + 8;
  const far = makeCanvas(farW, 44, (c, w, h) => {
    vgrad(c, 0, 0, w, h, auto ? ['#aeb8c4', '#d6dbe0'] : ['#9fb4c8', '#cfdbe4']);
    R(c, 20, 6, 10, 3, '#e8eef3'); R(c, 140, 10, 16, 3, '#e8eef3'); R(c, 300, 5, 12, 2, '#e8eef3');
    skyline(c, 0, w, h + 4, rng, { col: '#8a9bb0', win: '#9fb0c3', hmin: 18, hmax: 40 });
    skyline(c, 0, w, h + 4, rng, { col: '#6c7d93', win: '#8395ab', hmin: 8, hmax: 26 });
  });
  const bg = makeCanvas(OFFICE_W, H, (c) => {
    R(c, 0, 0, OFFICE_W, 12, '#262b34'); R(c, 0, 12, OFFICE_W, 2, '#1a1e25');
    for (let x = 0; x < OFFICE_W; x += 20) R(c, x, 0, 1, 12, '#20242c');
    vgrad(c, 0, 14, OFFICE_W, 96, ['#4b5564', '#3a4351']);
    // faixa de janelas (vazada para ver a cidade)
    c.clearRect(0, 18, OFFICE_W, 44);
    for (let x = 0; x < OFFICE_W; x += 40) R(c, x, 18, 3, 44, '#2c323c');
    R(c, 0, 17, OFFICE_W, 2, '#59636f'); R(c, 0, 61, OFFICE_W, 4, '#59636f'); R(c, 0, 64, OFFICE_W, 1, '#2c323c');
    // paredes sólidas sobre a janela (elevador e sala de reunião)
    R(c, 0, 14, 72, 51, '#434c5a'); R(c, 512, 14, 136, 51, '#434c5a');
    dither(c, 0, 66, OFFICE_W, 42, '#414a58', 4);
    // divisórias de baias ao fundo
    for (const [a, b] of [[88, 214], [292, 384], [652, 768], [800, 944]]) {
      R(c, a, 106, b - a, 44, '#56647a'); dither(c, a, 108, b - a, 40, '#5e6c83', 3);
      R(c, a, 104, b - a, 3, '#7a889c'); for (let x = a; x < b; x += 30) R(c, x, 104, 2, 46, '#46526a');
    }
    // piso de carpete
    R(c, 0, 150, OFFICE_W, 30, '#2a303c'); dither(c, 0, 151, OFFICE_W, 29, '#323949', 3);
    for (let x = 0; x < OFFICE_W; x += 24) R(c, x, 150, 1, 30, '#262b36');
    R(c, 0, 148, OFFICE_W, 2, '#1d2129');
    // elevador
    R(c, 8, 66, 58, 84, '#7a8592'); R(c, 10, 68, 54, 82, '#5d6773'); R(c, 8, 66, 58, 2, '#a6b0bb');
    R(c, 24, 58, 26, 7, '#1a1d22'); R(c, 66, 104, 5, 9, '#9aa3ad'); R(c, 67, 106, 3, 2, '#ffcf5a'); R(c, 67, 109, 3, 2, '#666');
    // sala de reunião (vidro com persianas)
    R(c, 516, 66, 128, 84, '#2e3644');
    for (let y = 70; y < 146; y += 3) R(c, 518, y, 124, 1, '#4a5568');
    R(c, 516, 66, 128, 2, '#8a96a6'); R(c, 516, 66, 2, 84, '#8a96a6'); R(c, 642, 66, 2, 84, '#8a96a6');
    R(c, 568, 80, 30, 70, '#3a4352'); R(c, 568, 80, 30, 2, '#8a96a6'); R(c, 568, 80, 2, 70, '#8a96a6'); R(c, 596, 80, 2, 70, '#8a96a6'); R(c, 590, 114, 3, 2, '#ddd');
    pixText(c, 'SALA DE REUNIAO', 580, 71, '#cfd8e3', 1, 'center');
    // cartazes motivacionais
    const posters = auto
      ? [[96, 'AUTOMATIZE', 'SE', '#2a6a9a'], [298, 'PRODUZA', '24/7 IA', '#3a3a5a'], [420, 'OBRIGADO', 'PELA IA', '#7a2a3a'], [690, 'VISTA A', 'NUVEM', '#2a5a4a'], [866, 'GRATIDAO', 'ALGORIT.', '#5a4a2a']]
      : [[96, 'FOCO', '100%', '#2a6a9a'], [298, 'GAUDE AI', 'EM BREVE', '#1f4a6a'], [420, 'SINERGIA', 'SEMPRE', '#7a2a3a'], [690, 'VISTA A', 'CAMISA', '#2a5a4a'], [866, 'GAUDE AI', 'NOVO COLEGA', '#1f4a6a']];
    for (const [x, a, b, col] of posters) {
      R(c, x - 1, 71, 50, 28, '#1d2028'); R(c, x, 72, 48, 26, col); R(c, x + 2, 74, 44, 14, 'rgba(255,255,255,.12)');
      pixText(c, a, x + 24, 77, '#f3efe6', 1, 'center'); pixText(c, b, x + 24, 89, '#ffd54a', 1, 'center');
    }
    // extintor e bebedouro
    R(c, 504, 128, 6, 14, '#c62828'); R(c, 505, 125, 4, 3, '#333'); R(c, 500, 112, 14, 10, '#ddd'); pixText(c, 'EXT', 507, 115, '#c62828', 1, 'center');
    R(c, 72, 126, 14, 24, '#dfe6ee'); R(c, 72, 126, 14, 2, '#fff'); R(c, 74, 132, 4, 3, '#4a90e2'); R(c, 80, 132, 4, 3, '#e24a4a');
    c.globalAlpha = .75; R(c, 74, 110, 10, 16, '#7fc4ef'); c.globalAlpha = 1; R(c, 75, 108, 8, 3, '#5aa0d0');
    // mesas
    deskP(c, 128, FLOOR, 42); deskP(c, 228, FLOOR, 48); deskP(c, 668, FLOOR, 42);
    // Mirango: telefone, caneca, papéis
    R(c, 232, 129, 9, 5, '#2a2a30'); R(c, 233, 127, 7, 2, '#3a3a40');
    R(c, 266, 129, 5, 5, '#e8e8e8'); R(c, 271, 130, 1, 3, '#e8e8e8'); pixText(c, 'S', 267, 129, '#d8323c');
    R(c, 243, 131, 8, 3, '#f4f4ee'); R(c, 243, 130, 8, 1, '#ddd');
    // arquivo, caixas, prateleira
    R(c, 758, 118, 54, 3, '#8a6b4c'); R(c, 760, 121, 2, 6, '#555'); R(c, 806, 121, 2, 6, '#555');
    for (let i = 0; i < 5; i++) R(c, 772 + i * 5, 110, 4, 8, ['#3b6fb0', '#c43b3b', '#e3c34a', '#4a7a5a', '#7a4a9a'][i]);
    // máquina de café
    R(c, 384, 136, 24, 14, '#6a4f36'); R(c, 386, 112, 20, 24, '#30343c'); R(c, 388, 115, 16, 6, '#1a1d22'); R(c, 390, 117, 8, 2, '#5aff8a');
    R(c, 393, 124, 6, 4, '#111'); R(c, 394, 129, 4, 5, '#eee'); pixText(c, 'CAFE', 396, 106, '#ffd54a', 1, 'center');
    if (!auto) {
      // impressora gigante
      R(c, 962, 120, 44, 30, '#d8d4c8'); R(c, 962, 120, 44, 2, '#f0ece2'); R(c, 1004, 120, 2, 30, '#a8a49a');
      R(c, 960, 112, 48, 8, '#bdb8ab'); R(c, 960, 112, 48, 2, '#d8d4c8'); R(c, 966, 132, 32, 2, '#8a867c'); R(c, 966, 140, 32, 6, '#c8c4b8');
      R(c, 990, 123, 12, 6, '#2a3a2a'); pixText(c, 'XEROX?', 984, 104, '#cfd8e3', 1, 'center');
      R(c, 1012, 132, 12, 18, '#8a8f99'); R(c, 1013, 128, 10, 4, '#f4f4ee');
    } else {
      c.globalAlpha = .35; R(c, 962, 148, 44, 2, '#000'); c.globalAlpha = 1;
      for (let x = 962; x < 1006; x += 4) R(c, x, 147, 2, 1, '#555');
      pixText(c, 'AQUI FICAVA', 984, 126, '#8a96a6', 1, 'center'); pixText(c, 'A IMPRESSORA', 984, 133, '#8a96a6', 1, 'center');
    }
    plantP(c, 206, FLOOR, 1, rng); plantP(c, 622, FLOOR, 1.1, rng); plantP(c, 1028, FLOOR, 1.2, rng); plantP(c, 864, FLOOR, .8, rng);
    R(c, 300, 140, 8, 10, '#3a3f48'); R(c, 299, 139, 10, 2, '#4a4f58');
    chairP(c, 162, FLOOR, '#2f3440'); if (!auto) chairP(c, 262, FLOOR, '#7a2a30'); else { R(c, 258, 147, 10, 1, '#555'); pixText(c, 'SEM CADEIRA', 263, 140, '#8a96a6', 1, 'center'); } chairP(c, 700, FLOOR, '#2f3440');
  });
  return (_offCache[key] = { far, bg });
}
// obstáculos do escritório: cores fortes, contorno escuro e faixa de alerta para não se confundirem com a decoração
const OFFICE_OBST = [
  { x: 326, w: 16, h: 22, k: 'arquivo' }, { x: 450, w: 18, h: 12, k: 'caixa' }, { x: 468, w: 26, h: 26, k: 'caixa' },
  { x: 534, w: 22, h: 10, k: 'cadeiras' }, { x: 896, w: 18, h: 18, k: 'arquivo' }
];
function officeObstSolids() { return OFFICE_OBST.map(o => ({ x: o.x, y: FLOOR - o.h, w: o.w, h: o.h })); }
function drawOfficeObst(c) {
  for (const o of OFFICE_OBST) {
    const x = o.x, y = FLOOR - o.h, w = o.w, h = o.h;
    c.globalAlpha = .35; R(c, x - 2, FLOOR - 1, w + 4, 2, '#000'); c.globalAlpha = 1;
    R(c, x - 1, y - 1, w + 2, h + 1, OUT);
    if (o.k === 'caixa') {
      R(c, x, y, w, h, '#e0913a'); R(c, x, y, w, 2, '#ffbf6a'); R(c, x + w - 2, y, 2, h, '#a8641e');
      R(c, x + Math.floor(w / 2) - 1, y, 3, h, '#ffe27a'); if (h > 16) pixText(c, 'FRAGIL', x + w / 2, y + 5, '#c4141e', 1, 'center'); else pixText(c, '!', x + w / 2, y + 3, '#c4141e', 1, 'center');
    } else if (o.k === 'cadeiras') {
      R(c, x, y, w, h, '#2a7ad8'); R(c, x, y, w, 2, '#6ab0ff'); for (let i = 2; i < w; i += 6) R(c, x + i, y + 3, 2, h - 3, '#1a4a8a');
    } else {
      R(c, x, y, w, h, '#d8463a'); R(c, x, y, w, 2, '#ff8a6a'); R(c, x + w - 2, y, 2, h, '#8a201a');
      for (let yy = y + 5; yy < FLOOR - 3; yy += 7) { R(c, x + 1, yy + 4, w - 2, 1, '#8a201a'); R(c, x + w / 2 - 2, yy + 1, 4, 1, '#ffe0d0'); }
    }
    // faixa zebrada de alerta na base
    for (let i = 0; i < w; i += 4) { R(c, x + i, FLOOR - 3, 2, 3, '#ffd54a'); R(c, x + i + 2, FLOOR - 3, 2, 3, '#111'); }
  }
}
// cabeças de colegas atrás das divisórias
const BG_HEADS = [[104, '#7a4b31', '#120c0a'], [186, '#e3b78f', '#6b4a2b'], [312, '#c98e6a', '#2a1a10'], [356, '#f0d0b0', '#c79a4a'], [668, '#5e3a26', '#111'], [742, '#e8c4a0', '#5a3a22'], [818, '#b07a52', '#999'], [920, '#6e432b', '#111']];
function drawOfficeDyn(c, sc, o = {}) {
  const t = G.t;
  // monitores das baias + cabeças
  BG_HEADS.forEach(([x, sk, hr], i) => {
    if (o.auto) {
      R(c, x - 6, 94, 14, 10, '#1d2028'); R(c, x - 5, 95, 12, 8, '#1a3a5a');
      const blink = Math.floor(t * 2 + i) % 3 === 0;
      R(c, x - 2, 97, 1, blink ? 1 : 2, '#7fd4ff'); R(c, x + 2, 97, 1, blink ? 1 : 2, '#7fd4ff'); R(c, x - 2, 100, 5, 1, '#7fd4ff');
      return;
    }
    const frozen = o.frozen; const bob = frozen ? 0 : (Math.sin(t * 9 + i * 2) > .7 ? 1 : 0);
    R(c, x - 3, 96 + bob, 7, 9, sk); R(c, x - 4, 94 + bob, 9, 4, hr);
    if (o.shock) { R(c, x - 2, 99, 2, 2, '#fff'); R(c, x + 1, 99, 2, 2, '#fff'); pixText(c, '!', x + 6, 86 + Math.sin(t * 8 + i) * 1, '#ffd54a'); }
    R(c, x + 4, 98, 10, 7, '#2a2d33'); R(c, x + 5, 99, 8, 5, (i + Math.floor(t)) % 4 === 0 ? '#4a7fb0' : '#3b6a9a');
  });
  // relógio de parede
  const cx = 486, cy = 82;
  R(c, cx - 7, cy - 7, 14, 14, '#1d2028'); R(c, cx - 6, cy - 6, 12, 12, '#f3efe6');
  const mins = (sc.clockMin != null ? sc.clockMin : 9 * 60 + t * 4) % 720;
  const am = (mins % 60) / 60 * Math.PI * 2, ah = mins / 720 * Math.PI * 2;
  for (let k = 0; k < 5; k++) R(c, Math.round(cx + Math.sin(am) * k), Math.round(cy - Math.cos(am) * k), 1, 1, '#222');
  for (let k = 0; k < 3; k++) R(c, Math.round(cx + Math.sin(ah) * k), Math.round(cy - Math.cos(ah) * k), 1, 1, '#d8323c');
  // elevador (interior + portas)
  const op = sc.elevOpen || 0;
  R(c, 12, 70, 50, 80, '#3a3328'); R(c, 12, 70, 50, 3, '#ffe6a0');
  if (sc.elevInside) sc.elevInside(c);
  const dw = Math.round(25 * (1 - op));
  R(c, 12, 70, dw, 80, '#b8c2cc'); R(c, 62 - dw, 70, dw, 80, '#b8c2cc');
  if (dw > 0) { R(c, 12 + dw - 1, 70, 1, 80, '#7a8592'); R(c, 62 - dw, 70, 1, 80, '#7a8592'); R(c, 14, 72, 2, 76, '#d8e0e8'); }
  pixText(c, sc.elevFloor || '14', 37, 59, '#ff6a3a', 1, 'center');
}
function drawLights(c, sc, x0, flick) {
  c.globalCompositeOperation = 'lighter';
  for (let x = 40; x < OFFICE_W; x += 80) {
    if (x < x0 - 60 || x > x0 + W + 60) continue;
    let a = .07;
    if (flick) { const n = Math.sin(G.t * 23 + x) * Math.sin(G.t * 7.3 + x * .1); if (n > .55 * (1 - flick) + .2) a = .01; }
    lightCone(c, x, 13, 90, 137, '#cfe6ff', a);
  }
  c.globalCompositeOperation = 'source-over';
  for (let x = 40; x < OFFICE_W; x += 80) { R(c, x - 12, 12, 24, 3, '#e8f2ff'); R(c, x - 13, 11, 26, 1, '#7a8492'); }
}
function endCard(t1, t2, dur = 3.2) {
  return overlayTask(dur, (c, o) => {
    R(c, 0, 0, W, H, '#000');
    const k = Math.min(1, o.t / .8) * Math.min(1, (o.dur - o.t) / .6);
    c.globalAlpha = Math.max(0, k);
    T(c, t1, W / 2, 78, { size: 8, align: 'center', col: '#f3efe6' });
    T(c, t2, W / 2, 94, { f: FONT2, size: 12, align: 'center', col: '#d8323c' });
    c.globalAlpha = 1;
  });
}
function drawPapers(c, h) { const x = Math.round(h.cx + h.face * 5 - 3), y = Math.round(h.fy - 17); R(c, x - 1, y - 1, 8, 6, OUT); R(c, x, y, 6, 4, '#f4f4ee'); R(c, x + 1, y + 1, 4, 1, '#aaa'); R(c, x, y - 1, 6, 1, '#fff'); }

SCENES.c1_office = (o) => (o.resume && G.store.c1) ? G.store.c1 : (G.store.c1 = makeOffice());
function makeOffice() {
  const L = buildOffice(false);
  const hero = new Hero(33, FLOOR - 24, LOOKS.mirango);
  hero.slump = .8; hero.frozen = true; hero.speed = 84; hero.jumpV = 225;
  const mA = heroActor(hero);
  const plinio = npc(LOOKS.plinio, 162, FLOOR, { face: -1, pose: { sit: true, arms: 'type' }, home: 162 });
  const sueli = npc(LOOKS.sueli, 702, FLOOR, { face: -1, pose: { sit: true, arms: 'type' }, home: 702 });
  const diretor = npc(LOOKS.diretor, 1080, FLOOR, { active: false, busy: false, bt: 3, tx: 900, wait: 0, spd: 56 });
  const chefe = npc(LOOKS.chefe, 580, FLOOR, { active: false });
  const intern = npc(LOOKS.colegaB, 760, FLOOR);
  const cart = { x: 740, dir: 1, w: 22, h: 16, spd: 40, active: false };
  const solids = [
    { x: -40, y: FLOOR, w: OFFICE_W + 80, h: 40 },
    { x: 128, y: 134, w: 42, h: 4, oneway: true }, { x: 228, y: 134, w: 48, h: 4, oneway: true }, { x: 668, y: 134, w: 42, h: 4, oneway: true },
    ...officeObstSolids(),
    { x: 758, y: 118, w: 54, h: 3, oneway: true }, { x: 384, y: 136, w: 24, h: 3, oneway: true }
  ];
  const sc = {
    cam: { x: 0, y: 0 }, music: 'office', amb: 'office', capY: 44, parts: new Parts(), hero, phase: 0, showHUD: false,
    energy: 100, sanity: 100, emails: 0, answered: 0, etimer: 13, eint: 13, jobs: [], signs: 0, hasDocs: false, busy: 0, busyFn: null,
    coffeeCD: 0, donut: true, obj: null, objX: null, elevOpen: 0, t: 0, vig: .12, mailPops: [], badge: 0, prod: 100, ringing: false,
    script: null, holdBlack: true, flick: 0, p5t: 0, heartT: 0, chefeCalled: false, floatTx: [],
    restartOpts: {},
    elevInside: null,
    enter(o) {
      if (o.resume) { this.holdBlack = false; if (o.resume === 1) this.startPhase3(); else this.startPhase5(); return; }
      this.script = new Script(this.intro());
    },
    *intro() {
      G.fadeA = 1; hero.x = 33; this.elevOpen = 0; this.inElev = true;
      this.elevInside = (c) => { if (sc.inElev) hero.draw(c); };
      yield .6; sfx('ding'); yield fadeTo(0, 1.4);
      yield { t: 0, update(dt) { this.t += dt; sc.elevOpen = Math.min(1, this.t / .9); return this.t >= .9; } };
      yield .4;
      this.inElev = false; hero.speed = 40; yield heroTo(hero, 104); hero.speed = 84;
      yield think(mA, 'Só mais um dia, tudo bem... eu dou conta.');
      yield { t: 0, update(dt) { this.t += dt; sc.elevOpen = Math.max(0, 1 - this.t / .9); return this.t >= .9; } };
      yield titleCard('CAPÍTULO 1', 'NEGAÇÃO');
      plinio.pose = {}; plinio.face = -1;
      yield walkTo(plinio, hero.cx + 20, 50);
      plinio.face = -1;
      yield say(plinio, 'Bom dia, Mirangão! Imprime esses contratos pra mim? Coisa rápida! :)', { name: 'PLÍNIO' });
      yield think(mA, '...Claro. Rapidinho.');
      yield walkTo(plinio, plinio.home, 50); plinio.face = -1; plinio.pose = { sit: true, arms: 'type' };
      this.phase = 1; this.jobs.push({ for: plinio, st: 'queued', t: 0 });
      hero.frozen = false;
      Balloons.add(null, 'Mover: ← →   Pular: ' + Input.label('jump') + '   Interagir: ' + Input.label('a'), { type: 'caption', auto: 5, bottom: true });
    },
    startPhase2() {
      this.phase = 2; this.ringing = true; sfx('phone'); this.ringT = 1.2;
    },
    *phoneCall() {
      this.ringing = false; hero.frozen = true; hero.pose = { arms: 'phone' }; hero.face = -1;
      const ph = { x: 236, y: 128, h: 4 };
      yield say(ph, 'Mirango? Aqui é o Castro, seu gerente. A partir de hoje, e-mail respondido em TEMPO REAL, ok? Tô de olho no indicador.', { name: 'TELEFONE — SR. CASTRO', nameCol: '#3b6fb0' });
      hero.pose = {};
      yield think(mA, 'Tudo bem... eu dou conta.');
      hero.frozen = false; this.showHUD = true; this.etimer = 4; this.eint = 13;
      this.p2t = 0; this.p2jobs = 0;
    },
    startPhase3() {
      // depois da 1ª reunião: o volume de tarefas explode
      this.phase = 3; this.eint = 7; this.etimer = 2; this.emails += 5; this.p3t = 0; this.p3jobs = 0;
      hero.x = 578; hero.y = FLOOR - 24; hero.frozen = false;
      Music.play('office'); Music.tempo = 1.15;
      sueli.pose = {}; sayAuto(sueli, 'MIRANGO! Aqui, AGORA!', 2.2, { name: 'SUELI' }); sfx('alarm');
    },
    *sueliTalk() {
      hero.frozen = true;
      yield say(sueli, 'Preciso de 3 assinaturas do Dr. Moura nesses documentos. PRA ONTEM.', { name: 'SUELI — SUPERVISORA' });
      yield say(sueli, 'Ele tá andando pelo andar. Boa sorte pegando ele parado.', { name: 'SUELI — SUPERVISORA' });
      this.hasDocs = true; diretor.active = true; diretor.x = 1060; diretor.tx = 820;
      sueli.pose = { sit: true, arms: 'type' };
      hero.frozen = false;
    },
    *sueliDeliver() {
      hero.frozen = true; this.hasDocs = false;
      yield say(sueli, 'Hm. Demorou. Mas tá ok.', { name: 'SUELI — SUPERVISORA' });
      diretor.active = false;
      hero.frozen = false;
      yield* this.callMeeting(2);
    },
    *callMeeting(n) {
      this.phase = 4; this.meetN = n; this.chefeCalled = true; chefe.active = true; chefe.x = 584;
      yield .3;
      yield walkTo(chefe, clamp(hero.cx + (hero.cx < 584 ? 26 : -26), 20, 1000), 70);
      chefe.face = hero.cx < chefe.x ? -1 : 1;
      hero.frozen = true;
      if (n === 1) yield say(chefe, 'Mirango, chega aqui. Uma reuniãozinha RÁPIDA de alinhamento. Cinco minutinhos.', { name: 'SR. CASTRO — GERENTE' });
      else { yield say(chefe, 'Mirango! Mais uma rapidinha. Pra alinhar o que a gente alinhou.', { name: 'SR. CASTRO — GERENTE' }); yield think(mA, 'De novo...?'); }
      yield walkTo(chefe, 584, 70); chefe.active = false;
      hero.frozen = false;
    },
    startPhase5() {
      this.phase = 5; this.showHUD = true; this.eint = 4; this.etimer = 1; this.emails += 14;
      hero.x = 578; hero.y = FLOOR - 24; hero.frozen = false; hero.slump = 1; this.p5t = 0;
      this.energy = Math.min(this.energy, 55); this.sanity = Math.min(this.sanity, 45);
      Music.play('office'); Music.tempo = 1.3;
      sayAuto(mA, 'Quanta coisa ficou acumulada...?', 2.4, { type: 'thought' });
    },
    *checkTotal() {
      // depois da 2ª reunião: ele confere o total acumulado... e quebra
      hero.frozen = true; hero.x = clamp(hero.x, 246, 252); hero.face = 1; hero.pose = { arms: 'type' };
      this.panel = { t: 0, rows: [] };
      const rows = [['E-mails não lidos', this.emails + 131], ['Impressões pendentes', 38], ['Assinaturas do Dr. Moura', 12], ['Reuniões de alinhamento', 9], ['Relatórios "pra ontem"', 27]];
      let total = 0;
      for (const [k, v] of rows) { this.panel.rows.push([k, v]); total += v; sfx('notif'); G.shake(1); this.sanity = Math.max(0, this.sanity - 9); yield .7; }
      this.panel.total = total; sfx('alarm'); G.shake(3);
      yield 1.6;
      this.panel = null; hero.pose = {};
      this.energy = 0; this.sanity = 0;
      yield* this.ending();
    },
    *ending() {
      this.phase = 6; hero.frozen = true; hero.vx = 0; this.showHUD = true; this.obj = null;
      Music.play(null); AU.amb('ring'); this.timeStop = true;
      yield { t: 0, update(dt) { this.t += dt; sc.desat = Math.min(1, this.t); sc.vig = lerp(.6, .8, this.t); return this.t > 1; } };
      for (let i = 0; i < 3; i++) { sfx('heart'); G.shake(1); yield .95; }
      yield { t: 0, update(dt) { this.t += dt; hero.slump = lerp(1, 0, Math.min(1, this.t / 1.4)); hero.pose = { tremble: 1, eyes: 'wide' }; return this.t >= 1.6; } };
      hero.pose = { tremble: 1, arms: 'fist', eyes: 'wide', mouth: 'sad' }; yield 1;
      hero.pose = { arms: 'out', eyes: 'wide', mouth: 'shout' }; sfx('thud'); G.shake(5);
      this.parts.burst(hero.cx + hero.face * 8, hero.fy - 14, 14, { col: ['#f4f4ee', '#ddd'], min: 30, max: 90, g: 120, type: 'paper', lmax: 1.4 });
      yield .25;
      G.flash('#fff', .9); sfx('shout'); sfx('boom'); G.shake(9); this.desat = 0; this.lightsOut = true;
      for (let x = 40; x < OFFICE_W; x += 80) this.parts.burst(x, 14, 8, { col: ['#fff', '#cfe6ff', '#ffd54a'], min: 20, max: 80, g: 200, lmax: 1 });
      yield shout(mA, 'EU ME DEMITO!', { size: 24, maxW: 260 });
      G.fadeA = 1; G.fadeCol = '#000'; Balloons.clear(); sfx('thud');
      yield 1;
      G.unlock(2);
      yield endCard('FIM DO CAPÍTULO 1', 'Negação');
      G.go('c2_reject', { cut: true, black: true });
    },
    speedMul() {
      if (this.phase === 5) return clamp(.45 + this.energy / 160, .45, .8);
      return [1, 1, 1.06, 1.12, 1.12][this.phase] || 1;
    },
    update(dt) {
      this.t += dt;
      if (this.script) { this.script.update(dt); if (this.script.done) this.script = null; }
      if (this.timeStop) { this.parts.update(dt); hero.update(dt, solids, { minX: 4, maxX: OFFICE_W - 4 }); return; }
      // digitando no terminal
      if (this.busy > 0) {
        this.busy -= dt; hero.pose = { arms: 'type' }; hero.face = 1; if (Math.random() < .35) sfx('type');
        if (this.busy <= 0) { hero.pose = {}; hero.frozen = false; const f = this.busyFn; this.busyFn = null; if (f) f(); }
      }
      hero.update(dt, solids, { minX: 4, maxX: OFFICE_W - 4, speedMul: this.speedMul(), parts: this.parts, tics: this.phase >= 3, upJump: true, stride: this.phase === 5 ? 11 : 15 });
      if (this.phase === 5) hero.slump = 1; else if (this.phase >= 3) hero.slump = .55; else if (this.phase >= 1) hero.slump = .7;
      // e-mails e barras
      const live = this.showHUD && (this.phase === 2 || this.phase === 3 || this.phase === 5) && !this.script;
      if (live || (this.showHUD && this.phase === 4)) {
        this.etimer -= dt;
        if (this.etimer <= 0) {
          this.etimer = this.eint; this.emails++; sfx('email'); this.badge = .5;
          this.mailPops.push({ x: 254 + rnd(-6, 6), y: 120, t: 0 });
        }
        const pend = Math.min(this.emails, 12);
        let dE = .32 + (hero.moving ? .25 : 0), dS = .3 * pend;
        if (this.phase === 3) { dE *= 1.3; dS *= 1.3; }
        if (this.phase === 5) { dE = 1.4; dS = 1.2 + pend * .05; }
        this.energy -= dE * dt; this.sanity -= dS * dt;
        if (this.phase < 5) { this.energy = Math.max(14, this.energy); this.sanity = Math.max(14, this.sanity); }
        this.prod = clamp(100 - this.emails * 6, 0, 100);
      }
      this.badge = Math.max(0, this.badge - dt);
      if (this.showHUD) this.prod = clamp(100 - this.emails * 6, 0, 100);
      for (const p of this.mailPops) { p.t += dt; p.y -= 16 * dt; }
      this.mailPops = this.mailPops.filter(p => p.t < 1.4);
      for (const f of this.floatTx) { f.t += dt; f.y -= 12 * dt; }
      this.floatTx = this.floatTx.filter(f => f.t < 1.4);
      // impressões
      for (const j of this.jobs) if (j.st === 'printing') { j.t -= dt; if (j.t <= 0) { j.st = 'ready'; sfx('ding'); } }
      hero.carry = this.jobs.some(j => j.st === 'carry') || (this.hasDocs && this.signs >= 3) ? drawPapers : null;
      this.coffeeCD -= dt;
      // telefone tocando
      if (this.ringing) { this.ringT -= dt; if (this.ringT <= 0) { sfx('phone'); this.ringT = 1.4; } }
      // fase 2: pedidos extras de impressão
      if (this.phase === 2 && this.showHUD && !this.script) {
        this.p2t += dt;
        if (this.p2jobs === 0 && this.p2t > 5) { this.p2jobs = 1; this.jobs.push({ for: sueli, st: 'queued', t: 0 }); sueli.pose = { arms: 'up' }; sayAuto(sueli, 'Mirango! Imprime o relatório trimestral pra mim?', 3, { name: 'SUELI' }); setTimeout(() => { sueli.pose = { sit: true, arms: 'type' }; }, 2500); }
        if (this.p2jobs === 1 && this.p2t > 18) { this.p2jobs = 2; this.jobs.push({ for: plinio, st: 'queued', t: 0 }); sayAuto(plinio, 'Mirangão! Mais uma cópia daqueles contratos? :)', 3, { name: 'PLÍNIO' }); }
        if (this.answered >= 4 && this.p2jobs === 2 && this.jobs.every(j => j.st === 'done')) this.script = new Script(this.callMeeting(1));
      }
      // fase 3: pedidos de impressão extras no meio das assinaturas
      if (this.phase === 3 && !this.script) {
        this.p3t += dt;
        if (this.p3jobs === 0 && this.p3t > 6) { this.p3jobs = 1; this.jobs.push({ for: plinio, st: 'queued', t: 0 }); sayAuto(plinio, 'Mirangão! Imprime a pauta da próxima reunião? :)', 2.6, { name: 'PLÍNIO' }); }
        if (this.p3jobs === 1 && this.p3t > 22) { this.p3jobs = 2; this.jobs.push({ for: sueli, st: 'queued', t: 0 }); sayAuto(sueli, 'E a ata da reunião! Impressa!', 2.6, { name: 'SUELI' }); }
      }
      // diretor andarilho
      if (diretor.active) {
        diretor.bt -= dt; if (diretor.bt <= 0) { diretor.busy = !diretor.busy; diretor.bt = diretor.busy ? rnd(2.5, 3.5) : rnd(2.5, 3.2); }
        diretor.pose = diretor.busy ? { arms: 'phone' } : {};
        if (diretor.wait > 0) { diretor.wait -= dt; diretor.moving = false; }
        else {
          const d = diretor.tx - diretor.x;
          if (Math.abs(d) < 2) { diretor.wait = rnd(.6, 1.6); diretor.tx = rnd(380, 1000); }
          else { diretor.face = Math.sign(d); diretor.moving = true; const st = Math.min(Math.abs(d), diretor.spd * dt); diretor.x += Math.sign(d) * st; diretor.walk += st / 14; }
        }
      }
      // carrinho de correspondência
      cart.active = this.phase >= 2 && this.phase <= 5;
      if (cart.active) {
        cart.x += cart.dir * cart.spd * dt;
        if (cart.x > 860) cart.dir = -1; if (cart.x < 724) cart.dir = 1;
        intern.x = cart.x + (cart.dir > 0 ? -8 : cart.w + 8); intern.face = cart.dir; intern.moving = true; intern.walk += cart.spd * dt / 14;
        const cb = { x: cart.x, y: FLOOR - cart.h, w: cart.w, h: cart.h };
        if (overlap(hero, cb) && hero.inv <= 0) {
          hero.vx = (hero.cx < cart.x + cart.w / 2 ? -1 : 1) * 150; hero.vy = -120; hero.stun = .35; hero.inv = 1; hero.onGround = false;
          this.energy = Math.max(this.phase < 5 ? 14 : 0, this.energy - 5); sfx('hurt'); G.shake(2);
          sayAuto(intern, pick(['Foi mal!', 'Opa! Desculpa!', 'Correspondência passando!']), 1.4, { name: 'ESTAGIÁRIO' });
        }
      }
      // café extra na prateleira
      if (this.donut && overlap(hero, { x: 780, y: 108, w: 8, h: 10 })) { this.donut = false; this.energy = Math.min(100, this.energy + 20); sfx('coin'); this.floatTx.push({ x: 784, y: 104, t: 0, s: '+20 ENERGIA', col: '#ffd54a' }); }
      // interação
      this.cur = (!hero.frozen && this.busy <= 0 && !this.script) ? nearInter(this.inters, hero) : null;
      if (this.cur && Input.pressed('a')) this.cur.act();
      // fase 5: ruptura
      if (this.phase === 5 && !this.script) {
        this.p5t += dt;
        this.vig = lerp(this.vig, .55 + (1 - this.sanity / 100) * .3, dt);
        this.desat = clamp((1 - this.sanity / 100) * .6, 0, .6);
        this.flick = clamp(this.p5t / 20, .2, 1);
        Music.tempo = 1.3 + this.p5t / 60; Music.muffle(lerp(6000, 700, clamp(this.p5t / 30, 0, 1)));
        this.heartT -= dt; if (this.heartT <= 0) { sfx('heart'); this.heartT = lerp(.9, .5, clamp(this.p5t / 30, 0, 1)); }
        this.energy = Math.max(6, this.energy); this.sanity = Math.max(6, this.sanity);
      }
      this.parts.update(dt);
      // câmera
      const tx = clamp(hero.cx - W / 2 + hero.face * 20, 0, OFFICE_W - W);
      this.cam.x = lerp(this.cam.x, tx, Math.min(1, dt * 4));
      // objetivo
      this.computeObjective();
    },
    computeObjective() {
      const J = s => this.jobs.find(j => j.st === s);
      let t = null, x = null;
      if (this.phase === 1 || this.phase === 2) {
        if (this.ringing) { t = 'Atenda o telefone na sua mesa'; x = 236; }
        else if (J('carry')) { const j = J('carry'); t = 'Entregue as impressões'; x = j.for.x; }
        else if (J('ready')) { t = 'Pegue as impressões na impressora'; x = 984; }
        else if (J('queued')) { t = 'Envie a impressão no seu terminal'; x = 254; }
        else if (J('printing')) { t = 'Imprimindo...'; x = 984; }
        else if (this.phase === 2 && this.showHUD) { t = 'Responda os e-mails (' + Math.min(this.answered, 4) + '/4)'; x = 254; }
      } else if (this.phase === 3) {
        if (J('carry')) { const j = J('carry'); t = 'Entregue as impressões'; x = j.for.x; }
        else if (J('ready')) { t = 'Pegue as impressões na impressora'; x = 984; }
        else if (J('queued') && this.hasDocs) { t = 'Envie a impressão no seu terminal'; x = 254; }
        else if (!this.hasDocs && this.signs === 0) { t = 'Fale com a Sueli'; x = sueli.x; }
        else if (this.signs < 3) { t = 'Pegue a assinatura do Diretor (' + this.signs + '/3)'; x = diretor.x; }
        else { t = 'Entregue os documentos à Sueli'; x = sueli.x; }
      } else if (this.phase === 4) { if (!this.script) { t = 'Vá para a sala de reunião'; x = 582; } }
      else if (this.phase === 5) { t = 'Confira o total de tarefas no seu terminal'; x = 254; }
      this.obj = t; this.objX = x;
    },
    draw(c) {
      const cx = Math.round(this.cam.x);
      c.drawImage(L.far, -Math.round(cx * .3), 18);
      if (this.lightsOut) { c.globalAlpha = .5; R(c, 0, 18, W, 44, '#000'); c.globalAlpha = 1; }
      c.drawImage(L.bg, -cx, 0);
      c.save(); c.translate(-cx, 0);
      drawOfficeDyn(c, this, { frozen: this.timeStop });
      // telas dos monitores
      const pend = this.emails;
      monitorP(c, 136, 134, '#3b6a9a', '#9fc4ef');
      monitorP(c, 248, 134, pend > 3 ? (Math.floor(G.t * 4) % 2 ? '#9a2a2a' : '#5a1a1a') : '#2b5d8a', pend ? '#ffd0d0' : '#cfe3ff');
      monitorP(c, 676, 134, '#3b6a9a', '#9fc4ef');
      if (pend) { iconMail(c, 251, 120, '#fff'); pixText(c, String(Math.min(pend, 99)), 263, 117, '#ff5252'); }
      if (this.ringing && Math.floor(G.t * 8) % 2) { R(c, 232 + irnd(-1, 1), 126, 9, 2, '#ffd54a'); pixText(c, '!', 237, 116, '#ffd54a'); }
      // impressora: luz e papéis
      const printing = this.jobs.some(j => j.st === 'printing'), ready = this.jobs.some(j => j.st === 'ready');
      R(c, 993, 125, 2, 2, printing ? (Math.floor(G.t * 8) % 2 ? '#5aff8a' : '#1a5a2a') : ready ? '#ffd54a' : '#2a8a4a');
      if (printing) { const k = (G.t * 2) % 1; R(c, 970, 134 + Math.round(k * 4), 24, 2, '#f4f4ee'); }
      if (ready) { R(c, 969, 136, 26, 4, '#f4f4ee'); R(c, 969, 136, 26, 1, '#fff'); }
      // NPCs
      plinio.draw(c); sueli.draw(c);
      if (diretor.active) { diretor.draw(c); if (diretor.busy) pixText(c, '...', diretor.x, FLOOR - 36, '#ffd54a', 1, 'center'); }
      if (chefe.active) chefe.draw(c);
      if (cart.active) {
        intern.draw(c);
        R(c, cart.x - 1, FLOOR - 17, cart.w + 2, 15, OUT); R(c, cart.x, FLOOR - 16, cart.w, 12, '#e8c42a'); R(c, cart.x, FLOOR - 16, cart.w, 2, '#fff07a');
        for (let i = 0; i < cart.w; i += 4) R(c, cart.x + i, FLOOR - 7, 2, 3, '#111');
        R(c, cart.x + 3, FLOOR - 21, 7, 5, '#d9c8a0'); R(c, cart.x + 11, FLOOR - 20, 8, 4, '#f4f4ee');
        R(c, cart.x + cart.w / 2 - 1, FLOOR - 24, 3, 3, Math.floor(G.t * 6) % 2 ? '#ff3030' : '#7a1010');
        R(c, cart.x + 2, FLOOR - 3, 4, 3, '#222'); R(c, cart.x + cart.w - 6, FLOOR - 3, 4, 3, '#222');
      }
      if (this.donut) { const b = Math.sin(G.t * 3) > 0 ? 0 : 1; R(c, 780, 111 + b, 7, 6, '#eee'); R(c, 781, 112 + b, 5, 4, '#6a3a1a'); R(c, 787, 112 + b, 2, 3, '#eee'); if (Math.floor(G.t * 4) % 4 === 0) R(c, 782, 106 + b, 1, 2, '#fff'); }
      drawOfficeObst(c);
      if (!this.inElev) hero.draw(c);
      this.parts.draw(c);
      for (const p of this.mailPops) { c.globalAlpha = 1 - p.t / 1.4; iconMail(c, Math.round(p.x), Math.round(p.y), '#fff'); c.globalAlpha = 1; }
      drawLights(c, this, cx, this.phase === 5 ? this.flick : 0);
      if (this.lightsOut) { c.globalAlpha = .45; R(c, cx, 0, W, H, '#000'); c.globalAlpha = 1; }
      c.restore();
    },
    ui(c) {
      const cam = this.cam;
      for (const f of this.floatTx) T(c, f.s, f.x - cam.x, f.y, { size: 5, align: 'center', col: f.col || '#fff' });
      if (this.showHUD) {
        hudBar(c, 6, 10, 70, 'ENERGIA', this.energy / 100, '#ffd54a', '#c49a1a');
        hudBar(c, 6, 27, 70, 'SANIDADE', this.sanity / 100, '#b07aff', '#7a4ad0');
        // caixa de entrada
        const bx0 = W - 62, sh = this.badge > 0 ? rnd(-1.5, 1.5) : 0;
        pxBox(c, bx0, 6, 56, 26, '#1a1622', OUT);
        iconMail(c, bx0 + 5 + sh, 11, this.emails ? '#fff' : '#8a84a0');
        T(c, String(this.emails), bx0 + 19, 10, { size: 7, col: this.emails > 5 ? '#ff5252' : '#fff' });
        T(c, 'próximo: ' + Math.max(0, Math.ceil(this.etimer)) + 's', bx0 + 4, 22, { f: FONT2, size: 8, col: '#cfc8dc' });
        const k = clamp(this.etimer / this.eint, 0, 1);
        R(c, bx0 + 34, 12, 18, 3, '#2c2638'); R(c, bx0 + 34, 12, Math.round(18 * k), 3, k < .3 ? '#ff5252' : '#7ad0ff');
        T(c, 'PRODUTIVIDADE ' + Math.round(this.prod) + '%', W - 6, 36, { f: FONT2, size: 8, align: 'right', col: this.prod < 50 ? '#ff8a8a' : '#8f9bc0' });
      }
      if (this.obj && !Balloons.l.some(b => b.type === 'caption')) objectiveUI(c, this, this.obj, this.objX, FLOOR - 40, this.showHUD ? H - 14 : 15);
      if (this.cur) promptAt(c, this.cur.x - cam.x, (this.cur.py || 96) - cam.y, 'a', this.cur.label());
      if (this.panel) {
        const pn = this.panel;
        pxBox(c, 70, 30, 180, 110, 'rgba(10,8,16,.94)', '#d8323c');
        T(c, 'SUAS TAREFAS', W / 2, 36, { size: 6, align: 'center', col: '#ff5252' });
        pn.rows.forEach(([k, v], i) => { T(c, k, 78, 50 + i * 12, { f: FONT2, size: 10, col: '#e8e4f0' }); T(c, String(v), 242, 50 + i * 12, { f: FONT2, size: 10, align: 'right', col: '#ffd54a' }); });
        if (pn.total) { R(c, 78, 112, 164, 1, '#d8323c'); T(c, 'TOTAL: ' + pn.total, W / 2, 118, { size: 9, align: 'center', col: '#ff3030' }); }
      }
      if (this.busy > 0) { const k = 1 - this.busy / this.busyMax; pxBox(c, hero.cx - cam.x - 15, hero.y - 14, 30, 5, '#1a1622'); R(c, hero.cx - cam.x - 14, hero.y - 13, 28 * k, 3, '#7ad0ff'); }
    }
  };
  const startBusy = (sec, fn) => { sc.busy = sc.busyMax = sec; sc.busyFn = fn; hero.frozen = true; hero.vx = 0; hero.x = clamp(hero.x, 246, 252); };
  sc.inters = [
    { x: 256, y: FLOOR, r: 18, py: 104,
      cond: () => sc.phase >= 1 && sc.phase !== 4 && !sc.ringing && (sc.phase === 5 || sc.jobs.some(j => j.st === 'queued') || (sc.emails > 0 && sc.showHUD)),
      label: () => sc.phase === 5 ? 'Conferir total de tarefas' : sc.jobs.some(j => j.st === 'queued') ? 'Enviar impressão' : 'Responder e-mail',
      act: () => {
        if (sc.phase === 5) { sc.script = new Script(sc.checkTotal()); return; }
        if (sc.jobs.some(j => j.st === 'queued')) startBusy(.45, () => { for (const j of sc.jobs) if (j.st === 'queued') { j.st = 'printing'; j.t = 1.4; } sfx('print'); sc.floatTx.push({ x: 256, y: 110, t: 0, s: 'ENVIADO!', col: '#7ad0ff' }); });
        else startBusy(sc.phase === 5 ? .7 : .4, () => { if (sc.emails > 0) { sc.emails--; sc.answered++; sc.sanity = Math.min(100, sc.sanity + (sc.phase === 5 ? 2 : 3)); sfx('ok'); sc.floatTx.push({ x: 256, y: 110, t: 0, s: pick(['RESPONDIDO', 'OK!', 'CIENTE', 'DE ACORDO', 'SEGUE ANEXO']), col: '#7aff9a' }); } });
      } },
    { x: 238, y: FLOOR, r: 16, py: 104, cond: () => sc.ringing, label: () => 'Atender telefone', act: () => { sc.script = new Script(sc.phoneCall()); } },
    { x: 984, y: FLOOR, r: 22, py: 98, cond: () => sc.jobs.some(j => j.st === 'ready'), label: () => 'Pegar impressões', act: () => { for (const j of sc.jobs) if (j.st === 'ready') j.st = 'carry'; sfx('paper'); } },
    { get x() { return plinio.x; }, y: FLOOR, r: 18, py: 100, cond: () => sc.jobs.some(j => j.st === 'carry' && j.for === plinio), label: () => 'Entregar ao Plínio',
      act: () => {
        for (const j of sc.jobs) if (j.st === 'carry' && j.for === plinio) j.st = 'done'; sfx('paper');
        if (sc.phase === 1) sc.script = new Script((function* () { hero.frozen = true; plinio.pose = {}; plinio.face = -1; yield say(plinio, 'Valeu! Você é DEMAIS! :) Ah, o Castro te ligou, viu?', { name: 'PLÍNIO' }); plinio.pose = { sit: true, arms: 'type' }; hero.frozen = false; yield .8; sc.startPhase2(); })());
        else sayAuto(plinio, 'Valeu! :)', 1.4, { name: 'PLÍNIO' });
      } },
    { get x() { return sueli.x; }, y: FLOOR, r: 18, py: 100, cond: () => sc.jobs.some(j => j.st === 'carry' && j.for === sueli), label: () => 'Entregar à Sueli', act: () => { for (const j of sc.jobs) if (j.st === 'carry' && j.for === sueli) j.st = 'done'; sfx('paper'); sayAuto(sueli, 'Já não era sem tempo.', 1.6, { name: 'SUELI' }); } },
    { get x() { return sueli.x; }, y: FLOOR, r: 18, py: 100, cond: () => sc.phase === 3 && !sc.hasDocs && sc.signs === 0, label: () => 'Falar com a Sueli', act: () => { sc.script = new Script(sc.sueliTalk()); } },
    { get x() { return sueli.x; }, y: FLOOR, r: 18, py: 100, cond: () => sc.phase === 3 && sc.signs >= 3, label: () => 'Entregar documentos', act: () => { sc.script = new Script(sc.sueliDeliver()); } },
    { get x() { return diretor.x; }, y: FLOOR, r: 16, py: 100, cond: () => sc.phase === 3 && diretor.active && sc.hasDocs && sc.signs < 3, label: () => 'Pedir assinatura',
      act: () => {
        if (diretor.busy) { sayAuto(diretor, pick(['Agora não! Tô numa call!', 'Depois, depois!', 'Manda por e-mail!']), 1.6, { name: 'DR. MOURA' }); diretor.tx = hero.cx < 690 ? rnd(820, 1000) : rnd(380, 520); diretor.wait = 0; diretor.spd = 70; setTimeout(() => diretor.spd = 56, 1400); sfx('hurt'); }
        else {
          sc.signs++; sfx('paper'); sc.floatTx.push({ x: diretor.x, y: 110, t: 0, s: 'ASSINATURA ' + sc.signs + '/3', col: '#ffd54a' });
          sayAuto(diretor, ['Rabisca aqui... pronto. Próximo!', 'Assinado. Não me interrompa de novo.', 'Isso é urgente mesmo? Tá, tá.'][sc.signs - 1], 1.8, { name: 'DR. MOURA' });
          diretor.busy = true; diretor.bt = 3.5; diretor.tx = hero.cx < 690 ? rnd(800, 1000) : rnd(380, 520); diretor.wait = 0;
        }
      } },
    { x: 396, y: FLOOR, r: 14, py: 92, cond: () => sc.showHUD && sc.coffeeCD <= 0 && sc.phase < 6, label: () => 'Tomar café', act: () => { sc.coffeeCD = 14; sc.energy = Math.min(100, sc.energy + 28); sfx('slurp'); sc.floatTx.push({ x: 396, y: 100, t: 0, s: '+28 ENERGIA', col: '#ffd54a' }); hero.pose = { arms: 'drink' }; hero.frozen = true; setTimeout(() => { hero.pose = {}; hero.frozen = false; }, 350); } },
    { x: 582, y: FLOOR, r: 14, py: 70, cond: () => sc.phase === 4 && !sc.script, label: () => 'Entrar na reunião', act: () => { sfx('door'); G.go('c1_meeting', { n: sc.meetN || 1 }); } }
  ];
  return sc;
}

/* ---------- Fase 4: a reunião rápida de alinhamento ---------- */
SCENES.c1_meeting = (o) => {
  const N = o.n || 1;
  const off = G.store.c1 || { energy: 60, sanity: 50, emails: 4 };
  const chefe = npc(LOOKS.chefe, 252, 150, { face: -1 });
  const mir = { x: 112, y: 140, h: 30 };
  const slides = N === 2 ? [
    ['REALINHAMENTO', 'DO ALINHAMENTO', 0], ['GAUDE AI CHEGOU', 'ELA NAO DORME', 1], ['METAS Q4', 'DOBRADAS', 2],
    ['RESILIENCIA', 'SORRIA :)', 3], ['TAREFAS EXTRAS', 'PARA ONTEM', 4], ['REUNIAO PARA', 'ALINHAR ESTA', 5]
  ] : [
    ['ALINHAMENTO', 'ESTRATEGICO Q3', 0], ['PILOTO GAUDE AI', 'EFICIENCIA +300%', 1], ['KPI DOS KPIS', '+ METAS', 2],
    ['CULTURA DE DONO', 'SEM SER DONO', 3], ['MAIS INTERCONEXAO', 'EMAIL A CADA 13S', 4], ['REUNIAO PARA', 'ALINHAR A PROX.', 5]
  ];
  const lines = N === 2 ? [
    'Pessoal, rapidinho de novo. Só pra realinhar o alinhamento.', 'A Gaude AI já está em teste. Ela não pede café, nem férias.',
    'As metas do trimestre? Dobramos. Por motivos de sinergia.', 'Lembrem: problema é oportunidade. Muitas oportunidades.',
    'Vou mandar umas tarefas extras. Nada demais. Umas quarenta.', 'Ótimo. Depois a gente marca outra pra alinhar essa.'
  ] : [
    'Então, pessoal, rapidinho, cinco minutinhos...', 'Ah, e no Q4 chega o piloto da Gaude AI. Nada com que se preocupar. Por enquanto.',
    'Precisamos sinergizar as sinergias. KPI do KPI.', 'Aqui todo mundo é dono. Menos do lucro, claro.',
    'Mais interconectividade! E-mail a cada 13 segundos é POUCO.', 'Quem não se alinha... se desalinha.'
  ];
  const sc = {
    restartOpts: { n: N }, music: 'office', amb: 'office', capY: 44, t: 0, slide: 0, st: 0, qte: null, nextQ: 2.5, minute: 0, vig: .35, eng: 0,
    pops: [], script: null, moveWarn: 0,
    enter() {
      Music.tempo = 1.15;
      this.script = new Script((function* () {
        if (N === 2) return;
        Balloons.add(null, 'Quando o gerente olhar pra você, pressione ' + Input.label('a') + ' para concordar com a cabeça.', { type: 'caption', auto: 4.5, bottom: true });
      })());
    },
    update(dt) {
      this.t += dt; this.st += dt;
      if (this.script) { this.script.update(dt); if (this.script.done) this.script = null; }
      if (this.ending) return;
      off.energy = Math.max(14, off.energy - .7 * dt); off.sanity = Math.max(10, off.sanity - 1 * dt);
      off.etimer -= dt; if (off.etimer <= 0) { off.etimer = 4; off.emails++; sfx('notif'); }
      this.minute += dt * 1.6;
      if (this.st > 4.6) {
        this.st = 0; this.slide++;
        if (this.slide >= slides.length) { this.finish(); return; }
      }
      if (this.st > .3 && this.st < .35 && !this.said) { this.said = true; }
      if (this.lastSaid !== this.slide) { this.lastSaid = this.slide; sayAuto(chefe, lines[this.slide], 3.2, { name: 'SR. CASTRO' }); sfx('click'); }
      // QTE: concordar
      this.nextQ -= dt;
      if (!this.qte && this.nextQ <= 0) { this.qte = { t: 1.35 }; chefe.face = -1; sfx('sel'); }
      if (this.qte) {
        this.qte.t -= dt;
        if (Input.pressed('a')) { this.qte = null; this.eng++; this.nod = .5; sfx('ok'); this.pops.push({ s: '+1 ENGAJAMENTO', t: 0, col: '#7aff9a' }); this.nextQ = rnd(2.4, 3.6); }
        else if (this.qte.t <= 0) { this.qte = null; off.sanity = Math.max(8, off.sanity - 7); sfx('hurt'); G.shake(2); sayAuto(chefe, 'Mirango? Tá comigo?', 1.4, { name: 'SR. CASTRO' }); this.pops.push({ s: '-SANIDADE', t: 0, col: '#ff8a8a' }); this.nextQ = rnd(2.4, 3.6); }
      }
      this.nod = Math.max(0, (this.nod || 0) - dt);
      for (const p of this.pops) p.t += dt; this.pops = this.pops.filter(p => p.t < 1.2);
      this.moveWarn -= dt;
      if ((Input.pressed('left') || Input.pressed('right') || Input.pressed('jump')) && this.moveWarn <= 0) { this.moveWarn = 3; sayAuto(mir, pick(['Não tem como sair...', 'A porta tá logo ali... e tão longe.', 'Só mais cinco minutinhos...']), 1.8, { type: 'thought' }); }
    },
    finish() {
      this.ending = true; this.qte = null;
      this.script = new Script((function* () {
        yield say(chefe, N === 1 ? 'Perfeito! Super alinhados. Vou marcar outra reunião pra alinhar ESSA.' : 'Excelente. Agora, de volta ao trabalho. Tem bastante coisa esperando.', { name: 'SR. CASTRO' });
        yield caption(N === 1 ? '47 minutos depois...' : '1 hora e 12 minutos depois...', { auto: 1.6 });
        off.emails += 3;
        G.go('c1_office', { resume: N });
      })());
    },
    draw(c) {
      // parede
      vgrad(c, 0, 0, W, 150, ['#3a4250', '#2e3540']);
      R(c, 0, 0, W, 10, '#22262e');
      // vidro com o escritório lá fora (ícones piscando em vermelho)
      R(c, 10, 22, 130, 84, '#1c2430'); R(c, 10, 22, 130, 2, '#8a96a6'); R(c, 10, 104, 130, 2, '#8a96a6'); R(c, 74, 22, 2, 84, '#8a96a6');
      for (let i = 0; i < 6; i++) { R(c, 18 + i * 20, 70, 14, 36, '#2b3442'); R(c, 20 + i * 20, 62, 10, 8, '#232b38'); }
      const blink = Math.floor(this.t * 4) % 2;
      for (let i = 0; i < 5; i++) { const x = 20 + i * 24, y = 34 + (i % 2) * 14; if ((i + Math.floor(this.t * 3)) % 2) { c.globalAlpha = .9; iconMail(c, x, y, blink ? '#ff5252' : '#a02020'); c.globalAlpha = 1; } }
      iconPrinter(c, 112, 80, blink ? '#ff5252' : '#a02020');
      pixText(c, 'EMAILS: ' + off.emails, 108, 96, '#ff5252', 1, 'center');
      for (let y = 24; y < 104; y += 3) { c.globalAlpha = .25; R(c, 10, y, 130, 1, '#000'); c.globalAlpha = 1; }
      // relógio
      const mm = Math.floor(this.minute), hh = 9 + Math.floor((5 + mm) / 60), m2 = (5 + mm) % 60;
      R(c, 148, 26, 30, 12, '#111'); pixText(c, String(hh).padStart(2, '0') + ':' + String(m2).padStart(2, '0'), 163, 29, '#ff5252', 1, 'center');
      // tela de projeção
      R(c, 182, 14, 128, 82, '#1a1a1a'); R(c, 184, 16, 124, 76, '#f3f1ea');
      const s = slides[Math.min(this.slide, slides.length - 1)];
      R(c, 184, 16, 124, 12, '#2a4a7a'); pixText(c, s[0], 246, 19, '#fff', 1, 'center');
      pixText(c, s[1], 246, 80, '#2a4a7a', 1, 'center');
      // gráficos
      const k = s[2];
      if (k === 1) { pixText(c, 'GAUDE AI', 246, 36, '#1f4a6a', 3, 'center'); pixText(c, 'NUNCA DORME', 246, 58, '#d8323c', 1, 'center'); R(c, 238, 66, 4, 4, '#7fd4ff'); R(c, 250, 66, 4, 4, '#7fd4ff'); R(c, 240, 72, 12, 1, '#7fd4ff'); }
      else if (k === 2 || k === 4) { for (let i = 0; i < 7; i++) R(c, 200 + i * 14, 72 - (i * i + 3) * .9, 9, (i * i + 3) * .9, i % 2 ? '#d8323c' : '#2a4a7a'); R(c, 196, 72, 100, 1, '#333'); }
      else if (k === 3) { R(c, 226, 36, 40, 36, '#d8323c'); R(c, 232, 30, 28, 8, '#d8323c'); pixText(c, 'DONO', 246, 50, '#fff', 1, 'center'); }
      else if (k === 5) { for (let i = 0; i < 4; i++) { R(c, 200 + i * 26, 40, 18, 14, '#2a4a7a'); if (i < 3) R(c, 218 + i * 26, 46, 8, 2, '#333'); pixText(c, 'R' + (i + 1), 209 + i * 26, 44, '#fff', 1, 'center'); } pixText(c, '∞', 246, 62, '#d8323c'); }
      else { c.strokeStyle = '#2a4a7a'; for (let i = 0; i < 3; i++) { R(c, 205 + i * 30, 42, 22, 22, ['#2a4a7a', '#d8323c', '#e3c34a'][i]); } pixText(c, '+', 230, 50, '#333'); pixText(c, '+', 260, 50, '#333'); }
      // chão e mesa
      R(c, 0, 150, W, 30, '#262b36'); dither(c, 0, 150, W, 30, '#2e3442', 3);
      // pessoas atrás da mesa
      drawPerson(c, 60, 140, LOOKS.colegaA, { face: 1, sit: true, eyes: 'closed', slump: 1 });
      if (Math.floor(this.t) % 3 === 0) pixText(c, 'Z', 66, 112 - (this.t % 1) * 6, '#cfd8e3');
      drawPerson(c, mir.x, 140, LOOKS.mirango, { face: 1, sit: true, slump: .8, nod: this.nod > .25, eyes: this.qte ? 'wide' : null, tic: Math.random() < .01 });
      drawPerson(c, 160, 140, LOOKS.colegaB, { face: 1, sit: true, nod: Math.floor(this.t * 2) % 2 === 0 });
      chefe.pose = { arms: this.qte ? 'point' : (Math.floor(this.t * 1.5) % 3 === 0 ? 'out' : undefined), mouth: Math.floor(this.t * 6) % 2 ? 'open' : null };
      chefe.draw(c);
      R(c, 30, 128, 196, 6, '#6a4f36'); R(c, 30, 128, 196, 2, '#8a6b4c'); R(c, 34, 134, 4, 16, '#4a3626'); R(c, 218, 134, 4, 16, '#4a3626');
      R(c, 70, 124, 10, 4, '#f4f4ee'); R(c, 120, 124, 6, 4, '#e8e8e8'); R(c, 150, 123, 12, 5, '#2a2d33');
      if (this.qte) { const b = Math.sin(this.t * 20) > 0; R(c, chefe.x - 6, 108, 12, 7, '#fff'); R(c, chefe.x - 6, 108, 12, 1, OUT); R(c, chefe.x - 2, 110, 4, 4, b ? '#d8323c' : '#111'); }
    },
    ui(c) {
      hudBar(c, 6, 10, 70, 'ENERGIA', off.energy / 100, '#ffd54a', '#c49a1a');
      hudBar(c, 6, 27, 70, 'SANIDADE', off.sanity / 100, '#b07aff', '#7a4ad0');
      T(c, 'Engajamento: ' + this.eng, W - 6, 170, { f: FONT2, size: 9, align: 'right', col: '#8f9bc0' });
      if (this.qte) { promptAt(c, mir.x, 76, 'a', 'Concordar'); R(c, mir.x - 15, 90, 30 * (this.qte.t / 1.35), 2, '#ffd54a'); }
      this.pops.forEach(p => T(c, p.s, mir.x, 82 - p.t * 16, { size: 5, align: 'center', col: p.col }));
    }
  };
  return sc;
};
