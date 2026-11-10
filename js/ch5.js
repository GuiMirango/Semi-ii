'use strict';
/* =========================================================
   CAPÍTULO 5 — ACEITAÇÃO: o ciclo eterno e a falsa promoção
   ========================================================= */
SCENES.c5_wake = () => {
  const hero = new Hero(170, 126, LOOKS.mirangoPJ); hero.speed = 44; hero.slump = 1; hero.frozen = true;
  const mA = heroActor(hero);
  const solids = [{ x: -20, y: 150, w: W + 40, h: 30 }];
  const sc = {
    hero, botTarget() { return this.dressed ? 304 : 53; }, music: null, amb: 'city', t: 0, mode: 'alarm', lying: true, alarmT: 0, holdBlack: true, vig: .35, desat: .25, stage: 0,
    enter() { this.script = new Script(this.run()); },
    *run() {
      G.fadeA = 1;
      yield titleCard('CAPÍTULO 5', 'ACEITAÇÃO', 'O ciclo eterno e a falsa promoção');
      yield fadeTo(0, .8);
      this.ringing = true;
      yield caption('O despertador toca sem piedade na manhã seguinte.', { auto: 2.6 });
      this.stage = 1;
      yield Tk.until(() => sc.stage === 2);
      this.ringing = false; this.mode = 'morning'; sfx('click');
      yield 1;
      yield caption('Mirango abre os olhos na cama simples. Não há praias. Não há fuga.', { auto: 3.2 });
      this.lying = false; hero.x = 176; hero.y = 126;
      yield think(mA, '...');
      yield caption('O peso da depressão continua cravado nos ombros. O passado não pode ser apagado.', { auto: 3.4 });
      hero.frozen = false; this.stage = 3;
    },
    update(dt) {
      this.t += dt;
      if (this.script) { this.script.update(dt); if (this.script.done) this.script = null; }
      if (this.ringing) { this.alarmT -= dt; if (this.alarmT <= 0) { sfx('alarm'); this.alarmT = .6; G.shake(.6); } }
      if (this.stage === 1 && Input.pressed('a')) { this.stage = 2; }
      if (!this.lying) hero.update(dt, solids, { minX: 62, maxX: 316, upJump: false, canJump: false, stride: 11 });
      this.cur = null;
      if (this.stage === 3 && !hero.frozen) {
        if (Math.abs(hero.cx - 53) < 30 && !this.dressed) this.cur = { x: 53, l: 'Vestir a roupa cinzenta', k: 'dress' };
        else if (Math.abs(hero.cx - 304) < 16 && this.dressed) this.cur = { x: 304, l: 'Sair para o trabalho', k: 'out' };
        if (this.cur && Input.pressed('a')) {
          if (this.cur.k === 'dress') { this.dressed = true; hero.look = LOOKS.mirangoGray; sfx('swoosh'); G.flash('#888', .5); sayAuto(mA, 'Cinza. Combina com tudo.', 1.6, { type: 'thought' }); }
          else { sfx('door'); hero.frozen = true; G.go('c5_street', { dur: .8 }); }
        }
      }
    },
    draw(c) {
      drawBedroom(c, this.mode === 'alarm' ? 'alarm' : 'morning', this.t);
      if (this.lying) {
        drawPerson(c, 186, 118, LOOKS.mirangoPJ, { rot: Math.PI / 2, eyes: this.stage >= 2 ? null : 'closed' });
        R(c, 202, 108, 22, 10, '#e8ecf0'); R(c, 202, 108, 22, 2, '#fff');
      } else hero.draw(c);
      blindsLight(c, .04, '#ffffff');
      if (this.ringing && Math.floor(this.t * 8) % 2) { pixText(c, '!', 252, 102, '#ff3030'); pixText(c, '!', 270, 100, '#ff3030'); R(c, 254 + irnd(-1, 1), 113, 14, 1, '#ff3030'); }
    },
    ui(c) {
      if (this.stage === 1) promptAt(c, 261, 92, 'a', 'Desligar o despertador');
      if (this.cur) promptAt(c, this.cur.x, 50, 'a', this.cur.l);
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
    // banca de jornal e outdoor
    R(c, 180, 104, 44, 40, '#2e5a3a'); R(c, 180, 104, 44, 4, '#1e4a2a'); R(c, 184, 112, 36, 18, '#e8e4d8');
    pixText(c, 'IA SUBSTITUI', 202, 114, '#c43b3b', 1, 'center'); pixText(c, '40% DOS', 202, 120, '#222', 1, 'center'); pixText(c, 'ESCRITORIOS', 202, 126, '#222', 1, 'center');
    R(c, 380, 30, 110, 50, '#2a2a30'); R(c, 383, 33, 104, 44, '#d8323c'); pixText(c, 'SEJA PROMOVIDO', 435, 42, '#fff', 1, 'center'); pixText(c, 'TRABALHE MAIS', 435, 52, '#ffd54a', 1, 'center'); pixText(c, 'S = E × I × P', 435, 64, '#fff', 1, 'center');
    R(c, 400, 80, 3, 34, '#2a2a30'); R(c, 466, 80, 3, 34, '#2a2a30');
    // fachada imponente
    R(c, 790, 0, 170, 140, '#2c3340'); for (let y = 6; y < 120; y += 8) for (let x = 796; x < 954; x += 10) R(c, x, y, 7, 6, (x + y) % 3 ? '#3e4c62' : '#5a6a82');
    R(c, 800, 74, 150, 14, '#d8323c'); pixText(c, 'CORP S.A.', 875, 76, '#fff', 2, 'center');
    R(c, 852, 100, 46, 40, '#14181e'); R(c, 856, 104, 18, 36, '#3a4a5a'); R(c, 876, 104, 18, 36, '#3a4a5a'); R(c, 874, 100, 2, 40, '#888');
    R(c, 840, 138, 70, 3, '#b8b2a6');
  });
  const hero = new Hero(10, DAY_FLOOR - 24, LOOKS.mirangoGray); hero.speed = 46; hero.slump = 1;
  const mA = heroActor(hero);
  const solids = [{ x: -20, y: DAY_FLOOR, w: DAY_W + 40, h: 30 }];
  const looks = [LOOKS.passA, LOOKS.passB, LOOKS.passC, LOOKS.passD, LOOKS.colegaA, LOOKS.colegaB, LOOKS.apressado];
  const peds = Array.from({ length: 14 }, (_, i) => ({ x: rnd(DAY_W), d: Math.random() < .5 ? -1 : 1, v: rnd(30, 60), look: pick(looks), back: i % 2 === 0, walk: rnd(4), phone: Math.random() < .6 }));
  const cars = [];
  const sc = {
    hero, botTarget: () => 875, cam: { x: 0, y: 0 }, music: 'street', amb: 'city', t: 0, desat: .55, vig: .25, carT: 0,
    enter() {
      this.script = new Script((function* () {
        yield caption('Ruas barulhentas. Todos olhando para as próprias telas.', { auto: 3 });
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
SCENES.c5_office = () => {
  const L = buildOffice(true);
  const hero = new Hero(33, FLOOR - 24, LOOKS.mirangoGray); hero.slump = 1; hero.frozen = true; hero.speed = 46;
  const mA = heroActor(hero);
  const chefe = npc(LOOKS.chefe, 584, FLOOR, { active: false });
  const solids = [{ x: -40, y: FLOOR, w: OFFICE_W + 80, h: 40 }, { x: 330, y: 128, w: 14, h: 22 }, { x: 452, y: 138, w: 18, h: 12 }, { x: 470, y: 126, w: 18, h: 24 }, { x: 900, y: 134, w: 14, h: 16 }];
  const vac = { x: 400, d: 1 };
  const parts = new Parts();
  const sc = {
    hero, botTarget: () => 256, cam: { x: 0, y: 0 }, music: null, amb: 'office', holdBlack: true, elevOpen: 0, t: 0, desat: .2, vig: .2, eyes: null, term: 0, termLines: [], beepT: 0, beepI: 1.2,
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
      yield caption('As portas se abrem. Exatamente o mesmo quadro do primeiro minuto.', { auto: 3 });
      this.inElev = false;
      hero.speed = 30; yield heroTo(hero, 104); hero.speed = 46;
      yield { t: 0, update(dt) { this.t += dt; sc.elevOpen = Math.max(0, 1 - this.t / .9); return this.t >= .9; } };
      yield caption('O ciclo se fecha geometricamente.', { auto: 2.4 });
      yield think(mA, '...Tem algo diferente.');
      hero.frozen = false; this.stage = 1;
    },
    *promo() {
      hero.frozen = true; hero.face = 1;
      yield think(mA, 'Cadê a impressora? Os contratos? Os e-mails de 13 segundos?');
      yield caption('As tarefas manuais sumiram. Sobre a mesa, apenas um terminal digital, automatizado e frio.', { auto: 3.8 });
      yield caption('O trabalho braçal foi totalmente substituído por inteligências artificiais.', { auto: 3.2 });
      yield think(mA, 'Eu sou... obsoleto?');
      chefe.active = true; chefe.x = 584;
      yield walkTo(chefe, hero.cx + 24, 55);
      chefe.face = -1; hero.face = 1; chefe.pose = { arms: 'out', mouth: 'smile' };
      sfx('thud');
      yield say(chefe, 'Mirango! *tapinha nas costas* Pensamos muito no seu caso...', { name: 'SR. CASTRO' });
      yield say(chefe, '...e decidimos te dar uma PROMOÇÃO.', { name: 'SR. CASTRO' });
      this.eyes = 'shine'; hero.slump = .2; sfx('sparkle');
      yield caption('Por um segundo, os olhos de Mirango brilham com esperança.', { auto: 2.6 });
      chefe.pose = { arms: 'point' };
      yield say(chefe, 'Vimos que seus velhos métodos foram automatizados. Por isso, agora você vai gerenciar o fluxo das máquinas...', { name: 'SR. CASTRO' });
      yield say(chefe, '...responder relatórios de conformidade automatizados em tempo real e supervisionar três novos setores ao mesmo tempo.', { name: 'SR. CASTRO' });
      this.eyes = null; hero.slump = 1; hero.pose = { mouth: 'sad' }; sfx('thud');
      yield caption('O sorriso desaba. A "promoção" é maquiagem corporativa para uma carga ainda mais complexa e algorítmica.', { auto: 4 });
      chefe.pose = { arms: 'point', mouth: 'smile' };
      yield say(chefe, 'É assim que o sistema funciona, meu amigo. O antigo ficou para trás, agora você tem uma nova fase. Bom trabalho.', { name: 'SR. CASTRO' });
      chefe.pose = {};
      yield walkTo(chefe, 584, 55); chefe.active = false;
      // o terminal
      this.term = 1;
      const lines = ['BEM-VINDO, MIRANGO', 'CARGO: GESTOR DE FLUXO JR.', '> setores supervisionados: 3', '> relatórios de conformidade: 147', '> fluxo das máquinas: 98,7% ▲', '> reuniões de alinhamento: 6 hoje', '> notificações: ∞'];
      for (const l of lines) { this.termLines.push(l); sfx('type'); yield .5; }
      yield 1;
      yield caption('Nem a revolta, nem o grito de demissão, nem o sonho com a ilha, nem a depressão quebraram o sistema.', { auto: 4.4 });
      yield caption('A engrenagem apenas o absorveu, o reajustou e o colocou de volta na roda do hamster, com uma coleira algorítmica mais justa.', { auto: 5 });
      this.term = 0;
      // senta
      yield heroTo(hero, 262);
      hero.face = -1; sfx('thud');
      yield caption('Ele puxa a cadeira com um suspiro resignado e senta-se diante da tela.', { auto: 3 });
      this.seated = true; hero.frozen = true;
      yield caption('Suas mãos trêmulas pousam no teclado. As luzes fluorescentes zumbem alto.', { auto: 3.4 });
      if (AU.ctx) AU.humG.gain.setTargetAtTime(.05, AU.ctx.currentTime, 1);
      this.beeping = true;
      yield caption('O jogo reinicia, sutilmente, o seu ciclo invisível.', { auto: 3 });
      yield fadeTo(1, 6);
      yield 1.2;
      this.beeping = false;
      if (AU.ctx) AU.humG.gain.setTargetAtTime(0, AU.ctx.currentTime, .3);
      yield overlayTask(4, (c, o) => { R(c, 0, 0, W, H, '#000'); c.globalAlpha = Math.min(1, o.t / 1.2); T(c, 'FIM DO JOGO', W / 2, 82, { size: 14, align: 'center', col: '#f3efe6' }); c.globalAlpha = 1; });
      G.go('credits', { cut: true, black: true });
    },
    update(dt) {
      this.t += dt;
      if (this.script) { this.script.update(dt); if (this.script.done) this.script = null; }
      hero.update(dt, solids, { minX: 4, maxX: OFFICE_W - 4, upJump: true, stride: 11 });
      if (this.seated) hero.pose = { sit: true, arms: 'type', tremble: Math.random() < .3 };
      else if (this.eyes) hero.pose = { eyes: this.eyes };
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
        if (Math.abs(hero.cx - 256) < 10) { this.stage = 2; this.script = new Script(this.promo()); }
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
      if (chefe.active) chefe.draw(c);
      if (!this.inElev) hero.draw(c);
      parts.draw(c);
      drawLights(c, this, cx, this.beeping ? .6 : 0);
      c.restore();
    },
    ui(c) {
      if (this.stage === 1 && !this.cur) objectiveUI(c, this, 'Vá até a sua mesa', 254, FLOOR - 40);
      if (this.cur) promptAt(c, this.cur.x - this.cam.x, 92, 'a', this.cur.l);
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
    ['O INFUNDÍBULO DE MIRANGO', 10, '#f3efe6'], ['', 6], ['Um jogo em cinco estágios e um ciclo.', 11, '#a9a3b8'], ['', 14],
    ['NEGAÇÃO · RAIVA · BARGANHA', 11, '#d8323c'], ['DEPRESSÃO · ACEITAÇÃO', 11, '#d8323c'], ['', 18],
    ['FUNDAMENTAÇÃO', 7, '#ffd54a'], ['', 4],
    ['Miguel Nicolelis', 12, '#f3efe6'], ['O cérebro relativístico — "o verdadeiro criador de tudo"', 9, '#a9a3b8'], ['', 8],
    ['Ernesto van Peborgh', 12, '#f3efe6'], ['O capitalismo em rede — S = E × I × P', 9, '#a9a3b8'], ['', 8],
    ['Kurt Vonnegut', 12, '#f3efe6'], ['Tralfamadore e o infundíbulo cronossinclástico', 9, '#a9a3b8'], ['', 18],
    ['ELENCO', 7, '#ffd54a'], ['', 4],
    ['Mirango ......... ele mesmo', 10, '#f3efe6'], ['Plínio ........... sorriso plastificado', 10, '#f3efe6'], ['Sueli ............ supervisão', 10, '#f3efe6'],
    ['Dr. Moura ........ sempre numa call', 10, '#f3efe6'], ['Sr. Castro ....... alinhamento', 10, '#f3efe6'], ['Seu Zé ........... juiz e paçoqueiro', 10, '#f3efe6'],
    ['O Apressado ...... atrasado', 10, '#f3efe6'], ['O Nativo ......... livre', 10, '#f3efe6'], ['', 18],
    ['Pixel art, trilha e efeitos 100% procedurais', 9, '#a9a3b8'], ['(nenhum arquivo externo foi ferido)', 9, '#6a6480'], ['', 22],
    ['"E assim vai."', 12, '#f3efe6'], ['— Kurt Vonnegut', 9, '#a9a3b8'], ['', 30]
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
        if (s && y > -20 && y < H + 10) T(c, s, W / 2, y, { f: size >= 10 ? FONT2 : FONT, size: size >= 10 ? size + 2 : size - 1, align: 'center', col: col || '#fff' });
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
