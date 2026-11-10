'use strict';
/* =========================================================
   Tela de título, seleção de capítulos e controles.
   ========================================================= */
SCENES.title = () => {
  const rng = srand(77);
  const bg = makeCanvas(W, H, (c) => {
    vgrad(c, 0, 0, W, H, ['#07070f', '#141a2e', '#1d2440']);
    // janela panorâmica com cidade à noite
    R(c, 0, 20, W, 92, '#0b0f1e');
    skyline(c, -10, W + 20, 112, rng, { col: '#161d33', win: '#1d2640', lit: '#f2c45a', litP: .12, hmin: 30, hmax: 80 });
    skyline(c, -10, W + 20, 112, rng, { col: '#0f1426', win: '#151b30', lit: '#ffd77a', litP: .2, hmin: 15, hmax: 50 });
    for (let x = 0; x < W; x += 64) R(c, x, 20, 3, 92, '#262b3c');
    R(c, 0, 18, W, 3, '#2b3044'); R(c, 0, 111, W, 4, '#2b3044');
    // piso e mesas
    R(c, 0, 115, W, 65, '#151722'); dither(c, 0, 115, W, 65, '#1b1e2b', 3);
    deskP(c, 120, 160, 60, '#3a3238', '#2a2328');
    chairP(c, 172, 160, '#1d2028');
    cabinetP(c, 20, 160, 16, 26, '#3b404c'); cabinetP(c, 270, 160, 16, 20, '#3b404c');
    plantP(c, 300, 160, 1, rng);
  });
  const rain = Array.from({ length: 60 }, () => ({ x: rnd(W), y: rnd(20, 112), v: rnd(80, 140) }));
  const mails = Array.from({ length: 10 }, () => ({ x: rnd(W), y: rnd(-60, 100), v: rnd(6, 16), r: rnd(6) }));
  const sc = {
    music: 'title', amb: 'office', noPause: true, state: 'press', sel: 0, sub: null, csel: 0, t: 0, vig: .5,
    items: ['Novo jogo', 'Capítulos', 'Controles', 'Tela cheia'],
    chapters: [
      ['1', 'Negação', 'O cérebro institucionalizado', 'c1_office'],
      ['2', 'Raiva', 'A subversão da matriz centralizada', 'c2_reject'],
      ['3', 'Barganha', 'O infundíbulo cronossinclástico', 'c3_beach'],
      ['4', 'Depressão', 'O labirinto de pensamentos intrusivos', 'c4_street'],
      ['5', 'Aceitação', 'O ciclo eterno e a falsa promoção', 'c5_wake']
    ],
    update(dt) {
      this.t += dt;
      for (const r of rain) { r.y += r.v * dt; r.x -= r.v * .2 * dt; if (r.y > 112) { r.y = 20; r.x = rnd(W + 20); } }
      for (const m of mails) { m.y += m.v * dt; m.r += dt; if (m.y > 120) { m.y = -10; m.x = rnd(W); } }
      if (this.state === 'press') { if (Input.any || Input.pressed('tap')) { AU.unlock(); this.state = 'menu'; sfx('ok'); } return; }
      if (G.trans) return;
      const nav = (n, k) => { if (Input.pressed('up')) { sfx('sel'); return (k + n - 1) % n; } if (Input.pressed('down')) { sfx('sel'); return (k + 1) % n; } return k; };
      if (this.sub === 'chap') {
        this.csel = nav(5, this.csel);
        if (Input.pressed('b') || Input.pressed('start')) { this.sub = null; sfx('sel'); }
        else if (Input.confirm()) { sfx('ok'); G.store = {}; G.go(this.chapters[this.csel][3], { dur: .8 }); }
        return;
      }
      if (this.sub === 'ctrl') { if (Input.confirm() || Input.pressed('b') || Input.pressed('start')) { this.sub = null; sfx('sel'); } return; }
      this.sel = nav(this.items.length, this.sel);
      if (Input.confirm()) {
        sfx('ok');
        if (this.sel === 0) { G.store = {}; G.go('c1_office', { dur: 1 }); }
        else if (this.sel === 1) this.sub = 'chap';
        else if (this.sel === 2) this.sub = 'ctrl';
        else toggleFull();
      }
    },
    draw(c) {
      c.drawImage(bg, 0, 0);
      c.fillStyle = 'rgba(150,170,220,.35)';
      for (const r of rain) c.fillRect(Math.round(r.x), Math.round(r.y), 1, 3);
      for (const m of mails) { c.globalAlpha = .25; iconMail(c, Math.round(m.x), Math.round(m.y), '#7f8cb0'); c.globalAlpha = 1; }
      // brilho do monitor
      const fl = .55 + Math.sin(this.t * 7) * .03 + (Math.random() < .03 ? -.2 : 0);
      c.globalAlpha = fl * .35; c.fillStyle = '#6fa8ff'; c.beginPath(); c.moveTo(150, 132); c.lineTo(110, 160); c.lineTo(200, 160); c.closePath(); c.fill(); c.globalAlpha = 1;
      monitorP(c, 140, 144, '#3b7fd0', '#cfe3ff');
      drawPerson(c, 170, 160, LOOKS.mirango, { face: -1, sit: true, slump: 1, arms: 'type', eyes: Math.floor(this.t) % 5 === 0 ? 'closed' : null });
      R(c, 125, 141, 6, 4, '#ddd'); R(c, 126, 139, 4, 2, '#8a5a3a');
    },
    ui(c) {
      const k = Math.min(1, this.t / 1.5);
      c.globalAlpha = k;
      T(c, 'O INFUNDÍBULO', W / 2, 16, { size: 14, align: 'center', col: '#f3efe6', shc: '#5a0d16', sd: 1.5 });
      T(c, 'DE MIRANGO', W / 2, 34, { size: 14, align: 'center', col: '#d8323c', shc: '#2a0408', sd: 1.5 });
      T(c, 'S = E × I × P', W / 2, 54, { f: FONT2, size: 11, align: 'center', col: '#8f9bc0' });
      c.globalAlpha = 1;
      if (this.state === 'press') {
        if (Math.floor(this.t * 2) % 2 === 0) T(c, 'PRESSIONE QUALQUER TECLA', W / 2, 150, { size: 6, align: 'center', col: '#ffd54a' });
        T(c, 'teclado • toque • gamepad', W / 2, 162, { f: FONT2, size: 9, align: 'center', col: '#8a84a0' });
        return;
      }
      if (this.sub === 'chap') {
        pxBox(c, 34, 66, 252, 108, 'rgba(14,12,20,.94)', '#d8323c');
        T(c, 'CAPÍTULOS', W / 2, 72, { size: 6, align: 'center', col: '#f3efe6' });
        this.chapters.forEach((ch, i) => {
          const on = i === this.csel, y = 86 + i * 16;
          if (on) R(c, 38, y - 2, 244, 15, 'rgba(216,50,60,.25)');
          T(c, ch[0], 46, y + 2, { size: 6, col: on ? '#ffd54a' : '#8a84a0' });
          T(c, ch[1], 60, y - 1, { f: FONT2, size: 11, col: on ? '#fff' : '#cfc8dc' });
          T(c, ch[2], 60, y + 6, { f: FONT2, size: 8, col: '#8a84a0' });
        });
        return;
      }
      if (this.sub === 'ctrl') {
        pxBox(c, 30, 64, 260, 110, 'rgba(14,12,20,.94)', '#d8323c');
        T(c, 'CONTROLES', W / 2, 70, { size: 6, align: 'center', col: '#f3efe6' });
        const rows = [['← → / A D', 'Mover'], ['ESPAÇO / ↑ / W', 'Pular'], ['↓ / S', 'Agachar · segurar'], ['E / Z / ENTER', 'Interagir · confirmar'], ['X / Q', 'Gritar · rejeitar · empurrar'], ['SHIFT / C', 'Esquivar (cap. 4)'], ['ESC / P', 'Pausa'], ['M · F', 'Som · Tela cheia']];
        rows.forEach((r, i) => { T(c, r[0], 44, 84 + i * 10.5, { f: FONT2, size: 10, col: '#ffd54a' }); T(c, r[1], 150, 84 + i * 10.5, { f: FONT2, size: 10, col: '#e8e4f0' }); });
        T(c, 'Gamepad: A pular · X interagir · B gritar · RB esquivar', W / 2, 166, { f: FONT2, size: 8, align: 'center', col: '#8a84a0' });
        return;
      }
      this.items.forEach((it, i) => {
        const on = i === this.sel, y = 112 + i * 13;
        if (on) { T(c, '▶', 118, y + 1, { size: 6, col: '#d8323c' }); }
        T(c, it, 130, y, { f: FONT2, size: 12, col: on ? '#ffd54a' : '#cfc8dc' });
      });
      T(c, 'Nicolelis · van Peborgh · Vonnegut', W - 4, 171, { f: FONT2, size: 8, align: 'right', col: '#5d5874' });
    }
  };
  return sc;
};
