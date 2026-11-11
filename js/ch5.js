'use strict';
/* =========================================================
   CAPÍTULO 5 — ACEITAÇÃO: o ciclo eterno e a falsa promoção
   ========================================================= */
SCENES.c5_wake = () => {
  const hero = new Hero(80, BR_FLOOR - 24, LOOKS.mirangoPJ); hero.speed = 24; hero.slump = 1; hero.frozen = true;
  const mA = { get x() { return hero.cx * 2; }, get y() { return hero.fy * 2; }, h: 56 };
  const solids = [{ x: -20, y: BR_FLOOR, w: 200, h: 30 }];
  const sc = {
    hints() { return this.stage === 1 ? [['a', 'Desligar o despertador']] : this.stage === 3 ? [['move', 'Andar'], ['a', 'Interagir']] : null; },
    hero, botTarget() { return this.dressed ? 146 : 21; }, music: null, amb: 'city', t: 0, mode: 'alarm', lying: true, alarmT: 0, holdBlack: true, vig: .35, desat: .25, stage: 0,
    enter() { this.script = new Script(this.run()); },
    *run() {
      G.fadeA = 1;
      yield titleCard('CAPÍTULO 5', 'ACEITAÇÃO');
      yield fadeTo(0, .8);
      this.ringing = true;
      this.stage = 1;
      yield Tk.until(() => sc.stage === 2);
      this.ringing = false; this.mode = 'morning'; sfx('click');
      yield 1;
      this.lying = false; hero.x = 80; hero.y = BR_FLOOR - 24;
      yield think(mA, '...Ontem eu me demiti.');
      yield 1.2;
      yield think(mA, 'As contas. O aluguel. A geladeira vazia.');
      yield 1;
      hero.pose = { arms: 'fist' };
      yield think(mA, 'Eu vou voltar. Vou pedir meu emprego de volta.');
      hero.pose = {};
      hero.frozen = false; this.stage = 3;
    },
    update(dt) {
      this.t += dt;
      if (this.script) { this.script.update(dt); if (this.script.done) this.script = null; }
      if (this.ringing) { this.alarmT -= dt; if (this.alarmT <= 0) { sfx('alarm'); this.alarmT = .6; G.shake(.6); } }
      if (this.stage === 1 && Input.pressed('a')) { this.stage = 2; }
      if (!this.lying) hero.update(dt, solids, { minX: 32, maxX: 156, upJump: false, canJump: false, stride: 8 });
      this.cur = null;
      if (this.stage === 3 && !hero.frozen) {
        if (Math.abs(hero.cx - 21) < 18 && !this.dressed) this.cur = { x: 42, l: 'Vestir a roupa cinzenta', k: 'dress' };
        else if (Math.abs(hero.cx - 146) < 10 && this.dressed) this.cur = { x: 292, l: 'Sair para o trabalho', k: 'out' };
        if (this.cur && Input.pressed('a')) {
          if (this.cur.k === 'dress') { this.dressed = true; hero.look = LOOKS.mirangoGray; sfx('swoosh'); G.flash('#888', .5); sayAuto(mA, 'Cinza. Combina com tudo.', 1.6, { type: 'thought' }); }
          else { sfx('door'); hero.frozen = true; G.go('c5_street', { dur: .8 }); }
        }
      }
    },
    draw(c) {
      bedroomFrame(c, (x) => {
        drawBedroom(x, this.mode === 'alarm' ? 'alarm' : 'morning', this.t);
        if (this.lying) {
          drawPerson(x, 72, 58, LOOKS.mirangoPJ, { rot: Math.PI / 2, eyes: this.stage >= 2 ? null : 'closed' });
          R(x, 92, 55, 10, 6, '#e8ecf0'); R(x, 92, 55, 10, 1, '#fff');
        } else hero.draw(x);
        blindsLight(x, .04, '#ffffff');
        if (this.ringing && Math.floor(this.t * 8) % 2) { pixText(x, '!', 110, 52, '#ff3030'); pixText(x, '!', 120, 51, '#ff3030'); }
      });
    },
    ui(c) {
      if (this.stage === 1) promptAt(c, 230, 96, 'a', 'Desligar o despertador');
      if (this.cur) promptAt(c, this.cur.x, 58, 'a', this.cur.l);
    }
  };
  return sc;
};

/* ---------- O retorno ao ponto de partida ---------- */
const DAY_W = 960, DAY_FLOOR = 156;
SCENES.c5_street = () => {
  const rng = srand(55);
  const sky = makeCanvas(W, H, (c) => { vgrad(c, 0, 0, W, H, ['#8a9098', '#a8acb2', '#c0c2c4'], 30); });
  const far = makeCanvas(W + 220, H, (c, w) => { skyline(c, 0, w, 130, rng, { col: '#7a7e86', win: '#868a92', hmin: 40, hmax: 110 }); skyline(c, 0, w, 130, rng, { col: '#62666e', win: '#6e727a', hmin: 25, hmax: 80 }); });
  const main = makeCanvas(DAY_W, H, (c) => {
    R(c, 0, 114, DAY_W, 26, '#4a4c52'); for (let x = 0; x < DAY_W; x += 20) R(c, x, 126, 10, 1, '#c8c8c8');
    R(c, 0, 140, DAY_W, 4, '#9a968e'); R(c, 0, 144, DAY_W, 36, '#86827a'); for (let x = 0; x < DAY_W; x += 16) R(c, x, 144, 1, 36, '#76726a');
    // outdoor (fica atrás da pista: as pernas terminam na calçada do outro lado)
    R(c, 380, 30, 110, 50, '#2a2a30'); R(c, 383, 33, 104, 44, '#d8323c'); pixText(c, 'SEJA PROMOVIDO', 435, 42, '#fff', 1, 'center'); pixText(c, 'TRABALHE MAIS', 435, 52, '#ffd54a', 1, 'center'); pixText(c, 'COM GAUDE AI', 435, 64, '#fff', 1, 'center');
    R(c, 400, 80, 3, 30, '#2a2a30'); R(c, 466, 80, 3, 30, '#2a2a30'); R(c, 380, 110, 110, 4, '#7a7a74');
  });
  // primeiro plano: tudo que fica na calçada do Mirango, na FRENTE dos carros
  const front = makeCanvas(DAY_W, H, (c) => {
    R(c, 172, 106, 60, 38, '#2e5a3a'); R(c, 172, 106, 60, 4, '#1e4a2a'); R(c, 175, 112, 54, 21, '#e8e4d8'); R(c, 170, 142, 64, 3, '#1e3a2a');
    pixText(c, 'IA SUBSTITUI', 202, 115, '#c43b3b', 1, 'center'); pixText(c, '40% DOS', 202, 121, '#222', 1, 'center'); pixText(c, 'ESCRITORIOS', 202, 127, '#222', 1, 'center');
    R(c, 790, 0, 170, 144, '#2c3340'); R(c, 788, 0, 2, 144, '#1a1e26'); for (let y = 6; y < 120; y += 8) for (let x = 796; x < 954; x += 10) R(c, x, y, 7, 6, (x + y) % 3 ? '#3e4c62' : '#5a6a82');
    R(c, 800, 74, 150, 14, '#d8323c'); pixText(c, 'CORP S.A.', 875, 76, '#fff', 2, 'center');
    R(c, 852, 100, 46, 44, '#14181e'); R(c, 856, 104, 18, 40, '#3a4a5a'); R(c, 876, 104, 18, 40, '#3a4a5a'); R(c, 874, 100, 2, 44, '#888');
    R(c, 784, 140, 176, 4, '#b8b2a6');
  });
  const hero = new Hero(10, DAY_FLOOR - 24, LOOKS.mirangoGray); hero.speed = 46; hero.slump = 1;
  const mA = heroActor(hero);
  const solids = [{ x: -20, y: DAY_FLOOR, w: DAY_W + 40, h: 30 }];
  const looks = [LOOKS.passA, LOOKS.passB, LOOKS.passC, LOOKS.passD, LOOKS.colegaA, LOOKS.colegaB, LOOKS.apressado];
  const peds = Array.from({ length: 14 }, (_, i) => ({ x: rnd(DAY_W), d: Math.random() < .5 ? -1 : 1, v: rnd(30, 60), look: pick(looks), back: i % 2 === 0, walk: rnd(4), phone: Math.random() < .6 }));
  const cars = [];
  const sc = {
    hints: [['move', 'Andar'], ['a', 'Interagir']],
    hero, botTarget: () => 875, cam: { x: 0, y: 0 }, music: 'street', amb: 'city', t: 0, desat: .55, vig: .25, carT: 0,
    enter() {
      this.script = new Script((function* () {
        yield 1.2;
      })());
    },
    update(dt) {
      this.t += dt;
      if (this.script) { this.script.update(dt); if (this.script.done) this.script = null; }
      hero.update(dt, solids, { minX: 4, maxX: DAY_W - 4, upJump: false, canJump: false, stride: 11 });
      for (const p of peds) { p.x += p.d * p.v * dt; p.walk += p.v * dt / 14; if (p.x < -20) p.x = DAY_W + 20; if (p.x > DAY_W + 20) p.x = -20; }
      this.carT -= dt; if (this.carT <= 0) { this.carT = rnd(.8, 2); const d = Math.random() < .5 ? -1 : 1; cars.push({ x: d > 0 ? this.cam.x - 40 : this.cam.x + W + 40, d, v: rnd(90, 140), col: pick(CAR_COLS), lane: d > 0 ? 130 : 122 }); if (Math.random() < .3) sfx('honk'); }
      for (const c of cars) c.x += c.d * c.v * dt;
      for (let i = cars.length - 1; i >= 0; i--) if (Math.abs(cars[i].x - this.cam.x - W / 2) > W) cars.splice(i, 1);
      this.cur = !hero.frozen && Math.abs(hero.cx - 875) < 20;
      if (this.cur && Input.pressed('a')) { hero.frozen = true; sfx('door'); G.go('c5_office', { dur: .8 }); }
      const tx = clamp(hero.cx - W / 2 + 40, 0, DAY_W - W);
      this.cam.x = lerp(this.cam.x, tx, Math.min(1, dt * 4));
    },
    draw(c) {
      const cx = Math.round(this.cam.x);
      c.drawImage(sky, 0, 0); c.drawImage(far, -Math.round(cx * .2), 0);
      c.drawImage(main, -cx, 0);
      c.save(); c.translate(-cx, 0);
      for (const v of cars) { const x = Math.round(v.x); R(c, x, v.lane - 8, 30, 8, OUT); R(c, x + 1, v.lane - 7, 28, 6, v.col); R(c, x + 6, v.lane - 12, 16, 5, OUT); R(c, x + 7, v.lane - 11, 14, 4, '#9ac4e0'); R(c, x + 4, v.lane - 2, 5, 4, '#111'); R(c, x + 21, v.lane - 2, 5, 4, '#111'); }
      c.drawImage(front, 0, 0);
      for (const p of peds) if (p.back) drawPerson(c, p.x, DAY_FLOOR - 6, p.look, { face: p.d, walk: p.walk, arms: p.phone ? 'phone' : undefined, slump: .6, alpha: .7 });
      hero.draw(c);
      for (const p of peds) if (!p.back) drawPerson(c, p.x, DAY_FLOOR + 14, p.look, { face: p.d, walk: p.walk, arms: p.phone ? 'phone' : undefined, slump: .6 });
      c.restore();
    },
    ui(c) {
      if (this.cur) promptAt(c, 875 - this.cam.x, 82, 'a', 'Entrar no prédio');
      else objectiveUI(c, this, null);
    }
  };
  return sc;
};

/* ---------- O escritório automatizado e a "promoção" ---------- */
const NOTIFS = ['Reunião de alinhamento — 08:00', 'Nova função: Supervisor de Prompts', 'Convite: alinhamento do alinhamento', 'Nova função: treinar a IA', 'Gaude AI: 148/147 relatórios', 'URGENTE: daily às 23h', 'Nova função: Embaixador da Cultura', 'Reunião de realinhamento', '+3 setores atribuídos a você', 'Nova função: plantão de domingo', 'URGENTE: responda AGORA', 'Alinhamento estratégico (obrig.)', 'Nova função: Gestor de Gestores', 'Feedback 360º em 5 min', 'Gaude AI precisa de você ∞', 'Reunião sobre a reunião'];
SCENES.c5_office = () => {
  const L = buildOffice(true);
  const hero = new Hero(33, FLOOR - 24, LOOKS.mirangoGray); hero.slump = 1; hero.frozen = true; hero.speed = 46;
  const mA = heroActor(hero);
  const chefe = npc(LOOKS.chefe, 584, FLOOR, { active: false });
  const solids = [{ x: -40, y: FLOOR, w: OFFICE_W + 80, h: 40 }, ...officeObstSolids()];
  const vac = { x: 400, d: 1 };
  const parts = new Parts();
  const sc = {
    hints() { return this.stage === 1 ? [['move', 'Andar'], ['jump', 'Pular'], ['a', 'Interagir']] : null; },
    pops: [], hero, botTarget: () => 604, cam: { x: 0, y: 0 }, music: null, amb: 'office', holdBlack: true, elevOpen: 0, t: 0, desat: .2, vig: .2, eyes: null, term: 0, termLines: [], beepT: 0, beepI: 1.2,
    elevInside(c) { if (sc.inElev) hero.draw(c); },
    enter() { this.script = new Script(this.intro()); },
    *intro() {
      G.fadeA = 1; this.inElev = true;
      this.elevFloor = 'T';
      yield .4;
      for (let f = 1; f <= 14; f++) { this.elevFloor = String(f); sfx('click'); yield .14; }
      AU.amb('office'); sfx('ding');
      yield fadeTo(0, 1.2);
      yield { t: 0, update(dt) { this.t += dt; sc.elevOpen = Math.min(1, this.t / .9); return this.t >= .9; } };
      this.inElev = false;
      hero.speed = 30; yield heroTo(hero, 104); hero.speed = 46;
      yield { t: 0, update(dt) { this.t += dt; sc.elevOpen = Math.max(0, 1 - this.t / .9); return this.t >= .9; } };
      yield think(mA, '...Tem algo diferente.');
      chefe.active = true; chefe.x = 604; chefe.face = -1;
      hero.frozen = false; this.stage = 1;
    },
    *promo() {
      hero.frozen = true; hero.face = hero.cx < chefe.x ? 1 : -1; chefe.face = -hero.face;
      yield say(mA, 'Sr. Castro... sobre ontem. Eu me precipitei.');
      yield say(mA, 'Eu quero meu emprego de volta. Por favor.');
      yield 1;
      chefe.pose = { arms: 'out' };
      yield say(chefe, 'Hm. Olha só quem voltou.', { name: 'SR. CASTRO' });
      yield say(chefe, 'Muita coisa mudou desde ontem. Impressora, contratos, e-mails... a Gaude AI faz tudo agora.', { name: 'SR. CASTRO' });
      yield think(mA, 'Então eu sou... obsoleto?');
      chefe.pose = { arms: 'out', mouth: 'smile' }; sfx('thud');
      yield say(chefe, 'Mas a gente pensou muito no seu caso... *tapinha nas costas*', { name: 'SR. CASTRO' });
      yield say(chefe, '...e decidimos te dar uma PROMOÇÃO.', { name: 'SR. CASTRO' });
      this.eyes = 'shine'; hero.slump = .2; sfx('sparkle');
      yield 1.6;
      chefe.pose = { arms: 'point' };
      yield say(chefe, 'Parabéns! Sabe todo aquele trabalho chato? Imprimir, responder e-mail... ACABOU! A Gaude AI faz tudo isso agora!', { name: 'SR. CASTRO' });
      yield say(chefe, 'Então agora você é GESTOR DE FLUXO INTELIGENTE! Vai supervisionar três setores ao mesmo tempo. Coisa simples!', { name: 'SR. CASTRO' });
      this.eyes = null; hero.slump = .5; hero.pose = { eyes: 'wide' }; sfx('thud');
      yield say(chefe, 'E como a IA não para nunca, você acompanha ela em tempo real. Uns 147 relatórios por hora. Ela é rapidinha, você pega o jeito!', { name: 'SR. CASTRO' });
      yield say(chefe, 'Ah, e de noite e no fim de semana você fica de olho nela pelo celular. Mas olha a responsabilidade! Isso é crescimento!', { name: 'SR. CASTRO' });
      chefe.pose = { arms: 'out', mouth: 'smile' };
      yield say(chefe, 'Salário, por enquanto, o mesmo. Mas olha o título novo no crachá! E tiramos sua cadeira: gestor de verdade trabalha em pé, é mais dinâmico!', { name: 'SR. CASTRO' });
      hero.slump = 1; hero.pose = { mouth: 'sad' };
      yield think(mA, '...Obrigado?');
      chefe.pose = { arms: 'point', mouth: 'smile' };
      yield say(chefe, 'É assim que o sistema funciona, meu amigo. O antigo ficou pra trás, agora você tem uma nova fase. Merecido! Bom trabalho!', { name: 'SR. CASTRO' });
      chefe.pose = {};
      yield walkTo(chefe, 584, 55); chefe.active = false;
      yield heroTo(hero, 256);
      hero.face = 1;
      // o terminal
      this.term = 1;
      const lines = ['BEM-VINDO, MIRANGO', 'GESTOR DE FLUXO INTELIGENTE', '> setores supervisionados: 3', '> relatórios por hora: 147', '> disponibilidade: 24h / 7 dias', '> cadeira: não incluída', '> notificações: ∞'];
      for (const l of lines) { this.termLines.push(l); sfx('type'); yield .5; }
      yield 1;
      yield caption('A engrenagem apenas o absorveu, o reajustou e o colocou de volta na roda.', { auto: 4 });
      this.term = 0;
      // percebe que não há cadeira: a câmera se aproxima devagar
      hero.face = 1; hero.frozen = true;
      this.zoomT = 1.9;
      yield think(mA, '...Não tem cadeira mesmo.');
      this.standType = true;
      yield 1.2;
      // notificações sem parar: alinhamentos e novas funções
      if (AU.ctx) AU.humG.gain.setTargetAtTime(.05, AU.ctx.currentTime, 1);
      this.notifOn = true; this.beeping = true;
      yield 4.5;
      // as luzes começam a falhar
      this.flick = .4; sfx('click');
      yield 3;
      this.flick = 1; this.zoomT = 2.6;
      yield 2.5;
      // o surto
      this.surto = true; this.zoomT = 3.2; sfx('glitch'); G.shake(8);
      if (AU.ctx) AU.humG.gain.setTargetAtTime(.12, AU.ctx.currentTime, .3);
      yield shout(mA, 'CHEGA!!!', { auto: 1.4 });
      yield shout(mA, 'EU NÃO AGUENTO MAIS!!!', { auto: 1.6 });
      yield { t: 0, update(dt) { this.t += dt; G.glitch = Math.min(1, this.t / 1.6); G.shake(3); return this.t >= 2; } };
      // corte seco: o caos volta ao começo
      this.beeping = false; this.notifOn = false; G.glitch = 0; G.fadeA = 1; sfx('pum');
      if (AU.ctx) AU.humG.gain.setTargetAtTime(0, AU.ctx.currentTime, .05);
      yield 1.4;
      yield overlayTask(4, (c, o) => { R(c, 0, 0, W, H, '#000'); c.globalAlpha = Math.min(1, o.t / 1.2); T(c, 'FIM DO JOGO', W / 2, 82, { size: 14, align: 'center', col: '#f3efe6' }); c.globalAlpha = 1; });
      G.go('credits', { cut: true, black: true });
    },
    update(dt) {
      this.t += dt;
      if (this.script) { this.script.update(dt); if (this.script.done) this.script = null; }
      hero.update(dt, solids, { minX: 4, maxX: OFFICE_W - 4, upJump: true, stride: 11 });
      if (this.surto) hero.pose = { arms: Math.floor(this.t * 8) % 2 ? 'up2' : 'shrug', mouth: 'shout', eyes: 'wide', slump: 0, tremble: true, sweat: true };
      else if (this.seated) hero.pose = { sit: true, arms: 'type', tremble: Math.random() < .3 };
      else if (this.standType) hero.pose = { arms: 'type', slump: 1, tremble: Math.random() < .3 };
      else if (this.eyes) hero.pose = { eyes: this.eyes };
      // zoom progressivo no Mirango
      if (this.zoomT) {
        this.zoom = this.zoom || { k: 1, x: W / 2, y: H / 2 };
        this.zoom.k = lerp(this.zoom.k, this.zoomT, Math.min(1, dt * .45));
        this.zoom.x = hero.cx - this.cam.x; this.zoom.y = hero.y + 8;
      }
      // enxurrada de notificações
      if (this.notifOn) {
        this.notifT = (this.notifT || 0) - dt;
        if (this.notifT <= 0) {
          const n = this.nN = (this.nN || 0) + 1;
          const txt = NOTIFS[(n - 1) % NOTIFS.length];
          // nas laterais, deixando o Mirango (centro da tela) sempre visível
          const toast = n <= 4, left = n % 2 === 0;
          this.pops.push({ s: txt, t: 0, side: toast ? 1 : left ? -1 : 1, off: toast ? 4 : rnd(2, 14), y: toast ? 4 + (n - 1) * 15 : rnd(2, H - 18), red: /URGENTE|AGORA|∞/.test(txt) });
          this.notifT = Math.max(.1, 1.1 * Math.pow(.88, n));
          if (this.pops.length > 28) this.pops.shift();
        }
        for (const p of this.pops) p.t += dt;
      }
      // luzes falhando de forma intermitente
      if (this.flick) {
        this.darkT = (this.darkT || 0) - dt;
        if (this.darkT <= 0) { this.dark = !this.dark && Math.random() < .35 + this.flick * .4; this.darkT = this.dark ? rnd(.05, .25) : rnd(.15, 1.2 - this.flick * .8); if (this.dark) sfx('click'); }
      }
      vac.x += vac.d * 22 * dt; if (vac.x > 640 || vac.x < 380) vac.d *= -1;
      if (this.beeping) { this.beepT -= dt; if (this.beepT <= 0) { sfx('notif'); this.beepI = Math.max(.08, this.beepI * .86); this.beepT = this.beepI; } }
      this.cur = null;
      if (this.stage === 1 && !hero.frozen) {
        if (Math.abs(hero.cx - 150) < 18) this.cur = { x: 150, l: 'Olhar a mesa do Plínio', k: 'plinio' };
        if (Math.abs(hero.cx - 984) < 26) this.cur = { x: 984, l: 'Olhar', k: 'printer' };
        if (this.cur && Input.pressed('a')) {
          if (this.cur.k === 'plinio') sayAuto({ x: 150, y: 128, h: 10 }, 'PLÍNIO.AI v2 — "Sorriso 100% otimizado :)"', 2.4, { name: 'SERVIDOR' });
          else sayAuto(mA, 'A impressora... foi pra onde?', 2, { type: 'thought' });
        }
        if (Math.abs(hero.cx - chefe.x) < 26) { this.stage = 2; this.script = new Script(this.promo()); }
      }
      parts.update(dt);
      const tx = clamp(hero.cx - W / 2 + hero.face * 20, 0, OFFICE_W - W);
      this.cam.x = lerp(this.cam.x, tx, Math.min(1, dt * 4));
    },
    draw(c) {
      const cx = Math.round(this.cam.x);
      c.drawImage(L.far, -Math.round(cx * .3), 18);
      c.drawImage(L.bg, -cx, 0);
      c.save(); c.translate(-cx, 0);
      drawOfficeDyn(c, this, { auto: true });
      // servidor no lugar do Plínio
      R(c, 132, 104, 30, 30, '#1a1d24'); R(c, 132, 104, 30, 2, '#3a3e48');
      for (let i = 0; i < 6; i++) { R(c, 135, 108 + i * 4, 24, 3, '#262a32'); R(c, 137 + (i * 5) % 18, 109 + i * 4, 1, 1, Math.floor(G.t * 6 + i) % 3 ? '#5aff8a' : '#1a5a2a'); }
      pixText(c, 'PLINIO.AI', 147, 98, '#7fd4ff', 1, 'center');
      // terminal único de Mirango
      R(c, 244, 116, 22, 18, '#1d1f24'); R(c, 245, 117, 20, 14, '#0a2a3a'); R(c, 253, 134, 4, 2, '#1d1f24');
      const blink = Math.floor(G.t * 2) % 2;
      R(c, 247, 119, 10, 1, '#7fd4ff'); R(c, 247, 122, 14, 1, '#7fd4ff'); R(c, 247, 125, 6, 1, '#7fd4ff'); if (blink) R(c, 255, 125, 2, 1, '#7fd4ff');
      c.globalCompositeOperation = 'lighter'; c.globalAlpha = .12; c.fillStyle = '#7fd4ff'; c.beginPath(); c.moveTo(250, 124); c.lineTo(226, 150); c.lineTo(290, 150); c.fill(); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
      monitorP(c, 676, 134, '#0a2a3a', '#7fd4ff');
      // aspirador-robô
      R(c, Math.round(vac.x) - 6, FLOOR - 4, 12, 4, '#2a2d33'); R(c, Math.round(vac.x) - 5, FLOOR - 5, 10, 1, '#4a4e58'); R(c, Math.round(vac.x) + (vac.d > 0 ? 3 : -4), FLOOR - 4, 1, 1, Math.floor(G.t * 4) % 2 ? '#5aff8a' : '#111');
      drawOfficeObst(c);
      if (chefe.active) chefe.draw(c);
      if (!this.inElev) hero.draw(c);
      parts.draw(c);
      drawLights(c, this, cx, this.flick ? Math.min(1, .5 + this.flick * .5) : this.beeping ? .3 : 0);
      c.restore();
      if (this.dark) { c.globalAlpha = .55 + (this.flick || 0) * .3; R(c, 0, 0, W, H, '#05060c'); c.globalAlpha = 1; }
      if (this.surto && Math.random() < .25) { c.globalAlpha = .18; R(c, 0, 0, W, H, '#d8323c'); c.globalAlpha = 1; }
    },
    ui(c) {
      if (this.stage === 1 && !this.cur) objectiveUI(c, this, 'Fale com o Sr. Castro', chefe.x, FLOOR - 40);
      if (this.cur) promptAt(c, this.cur.x - this.cam.x, 92, 'a', this.cur.l);
      // notificações (por cima de tudo, cada vez mais caóticas)
      for (const p of this.pops) {
        c.font = '8px ' + FONT2; const tw = Math.ceil(c.measureText(p.s).width);
        const bw = tw + 18, x = p.side < 0 ? p.off : W - bw - p.off, y = p.y + (p.t < .15 ? (1 - p.t / .15) * -6 : 0);
        pxBox(c, x, y, bw, 14, p.red ? '#3a0c12' : '#14202c', p.red ? '#ff5252' : '#7fd4ff');
        R(c, x + 3, y + 3, 8, 8, p.red ? '#ff5252' : '#7fd4ff'); T(c, '!', x + 7, y + 4.5, { size: 4.5, align: 'center', col: '#000', sh: false });
        T(c, p.s, x + 14, y + 2.5, { f: FONT2, size: 8, col: '#f3efe6', sh: false });
      }
      if (this.term) {
        pxBox(c, 60, 34, 200, 104, '#06121a', '#2a4a5a');
        R(c, 64, 38, 192, 96, '#0a1e2a');
        for (let y = 38; y < 134; y += 2) { c.globalAlpha = .15; R(c, 64, y, 192, 1, '#000'); c.globalAlpha = 1; }
        this.termLines.forEach((l, i) => T(c, l, 70, 42 + i * 12, { f: FONT2, size: i < 2 ? 11 : 10, col: i === this.termLines.length - 1 && l.includes('∞') ? '#ff6a6a' : '#7fd4ff', sh: false }));
        if (Math.floor(G.t * 2) % 2) R(c, 70, 42 + this.termLines.length * 12, 5, 8, '#7fd4ff');
      }
    }
  };
  return sc;
};

/* ---------- Créditos ---------- */
SCENES.credits = () => {
  const lines = [
    ['O CICLO DE MIRANGO', 7, '#f3efe6'], ['', 6], ['Um jogo em cinco estágios e um ciclo.', 11, '#a9a3b8'], ['', 14],
    ['IDEALIZAÇÃO', 7, '#ffd54a'], ['', 4], ['@guimirango', 14, '#f3efe6'], ['', 18],
    ['NEGAÇÃO · RAIVA · BARGANHA', 11, '#d8323c'], ['DEPRESSÃO · ACEITAÇÃO', 11, '#d8323c'], ['', 18],
    ['ELENCO', 7, '#ffd54a'], ['', 4],
    ['Mirango ......... ele mesmo', 10, '#f3efe6'], ['Plínio ........... sorriso plastificado', 10, '#f3efe6'], ['Sueli ............ supervisão', 10, '#f3efe6'],
    ['Dr. Moura ........ sempre numa call', 10, '#f3efe6'], ['Sr. Castro ....... alinhamento', 10, '#f3efe6'], ['Seu Zé ........... juiz e paçoqueiro', 10, '#f3efe6'],
    ['O Apressado ...... atrasado', 10, '#f3efe6'], ['O Nativo ......... livre', 10, '#f3efe6'], ['', 18],
    ['FATEC SEBRAE', 12, '#f3efe6'], ['Curso de Marketing — 3º Semestre', 10, '#a9a3b8'], ['Sociedade e Cultura — 2026', 10, '#a9a3b8'], ['', 18],
    ['AGRADECIMENTOS ESPECIAIS', 7, '#ffd54a'], ['', 4], ['Ao professor Alexander Homenko Neto', 11, '#f3efe6'], ['', 18],
    ['DEDICATÓRIA', 7, '#ffd54a'], ['', 4], ['À mulher da minha vida,', 11, '#f3efe6'], ['a biomédica Isabele Ribeiro,', 11, '#f3efe6'], ['celebrando 8 anos desde que nos conhecemos.', 10, '#d8323c'], ['', 22],
    ['Pixel art, trilha e efeitos 100% procedurais', 9, '#a9a3b8'], ['', 22],
    ['Gaude AI agradece a sua dedicação.', 11, '#7fd4ff'], ['', 30]
  ];
  let total = 0; for (const l of lines) total += l[1] + 4;
  const sc = {
    music: 'end', amb: null, t: 0, y: H + 10, noPause: false,
    update(dt) {
      this.t += dt; this.y -= dt * 16;
      const done = this.y + total < 70;
      if (done && Input.confirm()) { G.store = {}; G.go('c1_office', { dur: 1.2 }); }
      else if (Input.pressed('b') || (done && Input.pressed('start'))) G.go('title');
      else if (!done && Input.confirm()) this.y -= 40;
    },
    draw(c) { R(c, 0, 0, W, H, '#050408'); for (let i = 0; i < 30; i++) R(c, (i * 73) % W, (i * 41 + Math.floor(this.t * 4)) % H, 1, 1, '#2a2638'); },
    ui(c) {
      let y = this.y;
      for (const [s, size, col] of lines) {
        if (s && y > -20 && y < H + 10) T(c, s, W / 2, y, { f: size >= 8 ? FONT2 : FONT, size: size >= 8 ? size + 2 : size - 1, align: 'center', col: col || '#fff' });
        y += size + 4;
      }
      if (this.y + total < 70) {
        T(c, 'O ciclo recomeça.', W / 2, 96, { f: FONT2, size: 13, align: 'center', col: '#f3efe6' });
        if (Math.floor(this.t * 2) % 2) T(c, Input.label('a') + ' recomeçar o ciclo  •  ' + Input.label('b') + ' menu', W / 2, 116, { size: 5, align: 'center', col: '#ffd54a' });
      }
    }
  };
  return sc;
};
