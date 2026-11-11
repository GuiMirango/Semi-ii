'use strict';
/* =========================================================
   Interface: texto, balões de quadrinhos, legendas, HUD e menus.
   Desenha no canvas principal em alta resolução (coordenadas 320x180).
   ========================================================= */
// Press Start 2P desenha maiúsculas acentuadas em tamanho minúsculo: desenhamos os acentos à mão.
const ACC_RE = /[ÀÁÂÃÉÊÍÓÔÕÚÇ]/;
const ACC = { '́': [[4, -3, 2, 1], [3, -2, 2, 1]], '̀': [[2, -3, 2, 1], [3, -2, 2, 1]], '̂': [[3, -3, 2, 1], [2, -2, 1, 1], [5, -2, 1, 1]], '̃': [[1, -2, 1, 1], [2, -3, 2, 1], [4, -2, 2, 1], [6, -3, 1, 1]], '̧': [[3, 7, 2, 1], [4, 8, 1, 1], [2, 9, 3, 1]] };
function TPS(c, s, x, y, o) {
  const size = o.size || 8; let plain = '', marks = [];
  for (const ch of s) {
    if (ACC_RE.test(ch)) { const d = ch.normalize('NFD'); marks.push([plain.length, d[1]]); plain += d[0]; } else plain += ch;
  }
  T(c, plain, x, y, Object.assign({}, o, { _acc: 1 }));
  c.font = size + 'px ' + FONT; const tw = c.measureText(plain).width, cw = tw / plain.length, u = size / 8;
  const x0 = (o.align === 'center' ? x - tw / 2 : o.align === 'right' ? x - tw : x);
  const y0 = o.base === 'middle' ? y - size / 2 : y;
  const draw = (dx, dy, col) => { c.fillStyle = col; for (const [i, m] of marks) for (const r of (ACC[m] || [])) c.fillRect(x0 + i * cw + r[0] * u + dx, y0 + r[1] * u + dy, r[2] * u, r[3] * u); };
  if (o.sh !== false) { const d = o.sd || Math.max(.5, size / 10); draw(d, d, o.shc || 'rgba(0,0,0,.85)'); }
  draw(0, 0, o.col || '#fff');
}
function T(c, s, x, y, o = {}) {
  if (!o._acc && (o.f || FONT) === FONT && ACC_RE.test(s)) return TPS(c, s, x, y, o);
  const size = o.size || 8;
  c.font = (o.bold ? 'bold ' : '') + size + 'px ' + (o.f || FONT);
  c.textAlign = o.align || 'left'; c.textBaseline = o.base || 'top';
  if (o.sh !== false) { c.fillStyle = o.shc || 'rgba(0,0,0,.85)'; const d = o.sd || Math.max(.5, size / 10); c.fillText(s, x + d, y + d); }
  c.fillStyle = o.col || '#fff'; c.fillText(s, x, y);
}
function wrapText(c, s, maxW, font) {
  c.font = font; const out = [];
  for (const para of String(s).split('\n')) {
    let line = '';
    for (const w of para.split(' ')) {
      const t = line ? line + ' ' + w : w;
      if (c.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t;
    }
    out.push(line);
  }
  return out;
}
function pxBox(c, x, y, w, h, fill, border = OUT, t = 1) {
  c.fillStyle = border; c.fillRect(x + t, y, w - 2 * t, h); c.fillRect(x, y + t, w, h - 2 * t);
  c.fillStyle = fill; c.fillRect(x + t, y + t, w - 2 * t, h - 2 * t);
}

/* ---------- balões ---------- */
const Balloons = {
  l: [],
  clear() { this.l = []; },
  add(actor, text, o = {}) {
    if (o.auto && actor) this.l = this.l.filter(x => !(x.o.auto && x.actor === actor) && !(x.o.auto && actor.x != null && x.actor && Math.abs((x.actor.x || 0) - actor.x) < 1 && Math.abs((x.actor.y || 0) - actor.y) < 1));
    const b = { actor, text, o, shown: 0, age: 0, done: false, type: o.type || 'speech', hold: 0 };
    this.l.push(b); return b;
  },
  update(dt) {
    const blocking = this.l.filter(b => !b.o.auto && !b.done);
    const top = blocking[blocking.length - 1];
    for (const b of this.l) {
      b.age += dt;
      const sp = b.o.speed || (b.type === 'shout' ? 60 : 38);
      const before = Math.floor(b.shown);
      if (b.shown < b.text.length) {
        b.shown = Math.min(b.text.length, b.shown + sp * dt);
        if (Math.floor(b.shown) !== before && Math.floor(b.shown) % 2 === 0 && !b.o.silent && b.text[Math.floor(b.shown)] !== ' ') sfx('blip');
      }
      const typed = b.shown >= b.text.length;
      if (b.o.auto) { if (typed) { b.hold += dt; if (b.hold >= b.o.auto) b.done = true; } }
      else if (b === top && b.age > .18 && (Input.confirm() || Input.pressed('tap'))) {
        if (!typed) b.shown = b.text.length; else b.done = true;
      }
    }
    this.l = this.l.filter(b => !b.done);
  },
  draw(c) {
    const cam = camOf(G.scene);
    let capY = null;
    for (const b of this.l) {
      if (b.type === 'caption') { const yy = capY == null ? captionArea().top : capY; const h = drawCaption(c, b, b.text.slice(0, Math.floor(b.shown)), yy); capY = yy + h + 3; }
      else drawBalloon(c, b, cam);
    }
  }
};
function drawBalloon(c, b, cam) {
  const shown = b.text.slice(0, Math.floor(b.shown));
  if (b.type === 'caption') return drawCaption(c, b, shown);
  const size = b.o.size || (b.type === 'shout' ? 13 : 11);
  const font = (b.type === 'shout' ? 'bold ' : '') + size + 'px ' + FONT2;
  const maxW = b.o.maxW || (b.type === 'shout' ? 200 : 130);
  const lines = wrapText(c, b.text, maxW, font);
  c.font = font;
  let tw = 0; for (const l of lines) tw = Math.max(tw, c.measureText(l).width);
  const lh = size * .82, padX = 5, padY = 3;
  const nameH = b.o.name ? 7 : 0;
  if (b.o.name) { c.font = '4.5px ' + FONT; tw = Math.max(tw, c.measureText(b.o.name).width); c.font = font; }
  const bw = Math.ceil(tw + padX * 2), bh = Math.ceil(lines.length * lh + padY * 2 + nameH + 1);
  const a = b.actor || {};
  let ax = (a.x != null ? a.x : 160) - (b.o.world === false ? 0 : cam.x);
  let ay = (a.y != null ? a.y : 120) - (a.h || 28) - 4 - (b.o.world === false ? 0 : cam.y);
  if (a.headY != null) ay = a.headY - (b.o.world === false ? 0 : cam.y);
  if (b.o.dy) ay += b.o.dy;
  const zr = b.o.world === false ? null : zoomOf(G.scene);
  if (zr) { ax = (ax - zr.sx) * zr.k; ay = (ay + (a.h || 28) + 4 - zr.sy) * zr.k - ((a.h || 28) + 4) * zr.k; }
  let x = Math.round(ax - bw / 2 + (b.o.dx || 0)), y = Math.round(ay - bh - 8);
  const below = y < 2;
  if (below) y = Math.round(ay + (a.h || 28) + 10);
  x = clamp(x, 3, W - bw - 3); y = clamp(y, 2, H - bh - 2);
  let jx = 0, jy = 0;
  if (b.type === 'shout') { jx = rnd(-1, 1); jy = rnd(-1, 1); }
  c.save(); c.translate(jx, jy);
  const fill = b.o.fill || (b.type === 'shout' ? '#fff27a' : b.type === 'thought' ? '#eef3ff' : '#ffffff');
  // cauda
  const tx = clamp(ax, x + 6, x + bw - 6);
  if (b.type === 'thought') {
    const dir = below ? -1 : 1;
    const ty0 = below ? y : y + bh;
    for (let i = 0; i < 3; i++) {
      const r = 2.4 - i * .7, px = lerp(tx, ax, (i + 1) / 4), py = ty0 + dir * (3 + i * 4);
      c.fillStyle = OUT; c.beginPath(); c.arc(px, py, r + 1, 0, 7); c.fill(); c.fillStyle = fill; c.beginPath(); c.arc(px, py, r, 0, 7); c.fill();
    }
  } else if (b.type !== 'sys') {
    const ty0 = below ? y + 1 : y + bh - 1, ty1 = below ? y - 6 : y + bh + 6;
    c.fillStyle = OUT; c.beginPath(); c.moveTo(tx - 5, ty0); c.lineTo(tx + 3, ty0); c.lineTo(lerp(tx, ax, .6), ty1 + (below ? -1 : 1)); c.closePath(); c.fill();
    c.fillStyle = fill; c.beginPath(); c.moveTo(tx - 3.6, ty0); c.lineTo(tx + 1.6, ty0); c.lineTo(lerp(tx, ax, .6), ty1 - (below ? -.6 : .6)); c.closePath(); c.fill();
  }
  if (b.type === 'shout') {
    // contorno espinhoso
    c.fillStyle = OUT; c.beginPath();
    const cx = x + bw / 2, cy = y + bh / 2, n = 22;
    for (let i = 0; i <= n; i++) { const an = i / n * Math.PI * 2, rr = i % 2 ? 1 : 1.18; c.lineTo(cx + Math.cos(an) * (bw / 2 + 5) * rr, cy + Math.sin(an) * (bh / 2 + 5) * rr); }
    c.fill(); c.fillStyle = fill; c.beginPath();
    for (let i = 0; i <= n; i++) { const an = i / n * Math.PI * 2, rr = i % 2 ? 1 : 1.18; c.lineTo(cx + Math.cos(an) * (bw / 2 + 3.6) * rr, cy + Math.sin(an) * (bh / 2 + 3.6) * rr); }
    c.fill();
  } else if (b.type === 'thought') {
    c.fillStyle = OUT; roundRect(c, x - 1, y - 1, bw + 2, bh + 2, 6); c.fill();
    c.fillStyle = fill; roundRect(c, x, y, bw, bh, 5); c.fill();
  } else pxBox(c, x, y, bw, bh, fill, b.o.border || OUT, 1);
  if (b.o.name) T(c, b.o.name, x + padX, y + 2.5, { size: 4.5, col: b.o.nameCol || '#b0283a', sh: false });
  let shownLeft = shown.length;
  lines.forEach((l, i) => {
    const part = l.slice(0, Math.max(0, shownLeft)); shownLeft -= l.length + 1;
    T(c, part, x + padX, y + padY + nameH + i * lh, { f: FONT2, size, col: b.o.col || (b.type === 'shout' ? '#a1101e' : '#16121c'), sh: false, bold: b.type === 'shout' });
  });
  if (!b.o.auto && b.shown >= b.text.length && Math.floor(G.t * 3) % 2 === 0) T(c, '▼', x + bw - 7, y + bh - 6.5, { size: 4, col: '#b0283a', sh: false });
  c.restore();
}
function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
// Legendas de contexto (caixa amarela): SEMPRE no topo, dentro da faixa livre da cena
// (entre o HUD da esquerda e o da direita, e longe do botão MENU no toque). Empilham se houver mais de uma.
function captionArea() {
  const sc = G.scene || {};
  let [x0, x1] = sc.capSafe || [4, W - 4];
  if (Input.dev === 'touch') x1 = Math.min(x1, W - 74);
  return { x0, x1, top: sc.capTop != null ? sc.capTop : 3 };
}
function drawCaption(c, b, shown, yTop) {
  const A = captionArea(), avail = A.x1 - A.x0;
  let size = b.o.size || 10, font, lines, tw;
  // encolhe a fonte se o texto ficar com linhas demais para o espaço livre
  for (;;) {
    font = size + 'px ' + FONT2; lines = wrapText(c, b.text, Math.min(b.o.maxW || 250, avail - 12), font);
    if (lines.length <= 3 || size <= 8) break; size -= 1;
  }
  c.font = font; tw = 0; for (const l of lines) tw = Math.max(tw, c.measureText(l).width);
  const lh = size * .82, bw = Math.ceil(tw + 12), bh = Math.ceil(lines.length * lh + 7);
  const x = Math.round(A.x0 + (avail - bw) / 2), y = Math.round(yTop != null ? yTop : A.top);
  pxBox(c, x + 1.5, y + 1.5, bw, bh, 'rgba(0,0,0,.45)', 'rgba(0,0,0,0)');
  pxBox(c, x, y, bw, bh, b.o.fill || '#f3e2a6', b.o.border || '#3a2a14');
  let left = shown.length;
  lines.forEach((l, i) => { const part = l.slice(0, Math.max(0, left)); left -= l.length + 1; T(c, part, x + 6, y + 3.5 + i * lh, { f: FONT2, size, col: b.o.col || '#3a2a14', sh: false }); });
  if (!b.o.auto && b.shown >= b.text.length && Math.floor(G.t * 3) % 2 === 0) T(c, '▼', x + bw - 7, y + bh - 6.5, { size: 4, col: '#8a2a1a', sh: false });
  return bh;
}
// tarefas de diálogo
function balloonTask(actor, text, o) { return { b: null, update() { if (!this.b) this.b = Balloons.add(actor, text, o); return this.b.done; } }; }
const say = (a, t, o = {}) => balloonTask(a, t, o);
const think = (a, t, o = {}) => balloonTask(a, t, Object.assign({ type: 'thought' }, o));
const shout = (a, t, o = {}) => balloonTask(a, t, Object.assign({ type: 'shout' }, o));
const caption = (t, o = {}) => balloonTask(null, t, Object.assign({ type: 'caption' }, o));
function sayAuto(a, t, sec = 1.6, o = {}) { return Balloons.add(a, t, Object.assign({ auto: sec }, o)); }

/* ---------- fades e cartões ---------- */
function fadeTo(a, dur = .6, col = '#000') { const s = { t: 0 }; let a0; return { update(dt) { if (a0 == null) { a0 = G.fadeA; G.fadeCol = col; } s.t += dt; G.fadeA = lerp(a0, a, Math.min(1, s.t / dur)); return s.t >= dur; } }; }
function overlayTask(dur, drawFn, skippable = true) {
  const o = { t: 0, dur, draw: drawFn };
  return { update(dt) { if (!o.added) { G.overlays.push(o); o.added = true; } o.t += dt; const done = o.t >= dur || (skippable && o.t > .8 && Input.confirm()); if (done) G.overlays = G.overlays.filter(v => v !== o); return done; } };
}
function titleCard(num, name, sub) {
  return overlayTask(4.2, (c, o) => {
    const k = o.t < .6 ? o.t / .6 : o.t > o.dur - .6 ? (o.dur - o.t) / .6 : 1;
    c.globalAlpha = 1; R(c, 0, 0, W, H, '#07060a');
    c.globalAlpha = Math.max(0, k);
    T(c, num, W / 2, 58, { size: 7, align: 'center', col: '#d8323c' });
    T(c, name, W / 2, 72, { size: 16, align: 'center', col: '#f3efe6' });
    R(c, W / 2 - 60 * k, 96, 120 * k, 1, '#d8323c');
    c.globalAlpha = 1;
  });
}
function bigText(txt, dur = 1.2, o = {}) {
  return overlayTask(dur, (c, ov) => {
    const k = Math.min(1, ov.t / .15), sc = o.zoom ? lerp(2.2, 1, k) : 1;
    c.save(); c.translate(W / 2, o.y || 80); c.scale(sc, sc);
    T(c, txt, 0, 0, { size: o.size || 20, align: 'center', base: 'middle', col: o.col || '#fff', shc: o.shc || '#a1101e', sd: 2 });
    c.restore();
  }, false);
}

/* ---------- HUD ---------- */
function hudBar(c, x, y, w, label, v, col, colD, icon) {
  pxBox(c, x, y, w + 4, 9, '#1a1622', OUT);
  const fw = Math.max(0, Math.round((w) * clamp(v, 0, 1)));
  R(c, x + 2, y + 2, w, 5, '#2c2638');
  R(c, x + 2, y + 2, fw, 5, v < .25 && Math.floor(G.t * 6) % 2 ? '#ff5252' : col);
  R(c, x + 2, y + 2, fw, 1, 'rgba(255,255,255,.35)'); R(c, x + 2, y + 6, fw, 1, colD);
  T(c, label, x + 1, y - 6, { size: 4.5, col: '#e8e4f0' });
}
function keyCap(c, k, x, y, col = '#f3efe6') {
  c.font = '5px ' + FONT; const w = Math.max(8, c.measureText(k).width + 4);
  pxBox(c, x, y, w, 9, col, OUT); R(c, x + 1, y + 7, w - 2, 1, '#9a94a8');
  T(c, k, x + w / 2, y + 2.2, { size: 5, align: 'center', col: '#16121c', sh: false });
  return w;
}
const PAD_COL = { A: '#3fae49', B: '#e0403a', X: '#3a78e0', Y: '#e8b72a' };
// setas desenhadas à mão (a fonte pixelada não tem esses símbolos)
const ARROW_ACTS = { move: ['l', 'r'], vert: ['u', 'd'], down: ['d'], up: ['u'], left: ['l'], right: ['r'] };
function arrowTri(c, d, cx, cy) {
  c.fillStyle = '#16121c'; c.beginPath();
  if (d === 'l') { c.moveTo(cx - 2.5, cy); c.lineTo(cx + 2, cy - 2.5); c.lineTo(cx + 2, cy + 2.5); }
  if (d === 'r') { c.moveTo(cx + 2.5, cy); c.lineTo(cx - 2, cy - 2.5); c.lineTo(cx - 2, cy + 2.5); }
  if (d === 'u') { c.moveTo(cx, cy - 2.5); c.lineTo(cx - 2.5, cy + 2); c.lineTo(cx + 2.5, cy + 2); }
  if (d === 'd') { c.moveTo(cx, cy + 2.5); c.lineTo(cx - 2.5, cy - 2); c.lineTo(cx + 2.5, cy - 2); }
  c.closePath(); c.fill();
}
function btnW(c, act) { if (ARROW_ACTS[act]) return ARROW_ACTS[act].length * 9 - (ARROW_ACTS[act].length - 1); const k = Input.label(act); if (Input.dev !== 'kb' && PAD_COL[k]) return 9; c.font = '5px ' + FONT; return Math.max(8, c.measureText(k).width + 4); }
function btnIcon(c, act, x, y) {
  if (ARROW_ACTS[act]) {
    let xx = x;
    for (const d of ARROW_ACTS[act]) { pxBox(c, xx, y, 8, 9, '#f3efe6', OUT); R(c, xx + 1, y + 7, 6, 1, '#9a94a8'); arrowTri(c, d, xx + 4, y + 3.8); xx += 8; }
    return xx - x;
  }
  const k = Input.label(act);
  if (Input.dev !== 'kb' && PAD_COL[k]) {
    c.fillStyle = OUT; c.beginPath(); c.arc(x + 4.5, y + 4.5, 5, 0, 7); c.fill();
    c.fillStyle = PAD_COL[k]; c.beginPath(); c.arc(x + 4.5, y + 4.5, 4.2, 0, 7); c.fill();
    T(c, k, x + 4.6, y + 2.4, { size: 4.5, align: 'center', col: '#fff', sh: false });
    return 9;
  }
  return keyCap(c, k, x, y);
}
function promptAt(c, x, y, act, label) {
  c.font = '9px ' + FONT2; const lw = c.measureText(label).width;
  const kw = btnW(c, act);
  const tw = kw + 3 + lw + 6; const bx0 = clamp(x - tw / 2, 2, W - tw - 2), by0 = y + Math.sin(G.t * 5) * 1;
  pxBox(c, bx0, by0, tw, 12, 'rgba(22,18,28,.88)', '#f3efe6');
  btnIcon(c, act, bx0 + 2, by0 + 1.5);
  T(c, label, bx0 + kw + 5, by0 + 2, { f: FONT2, size: 9, col: '#fff', sh: false });
}
// faixa fixa com os comandos disponíveis no minigame (sempre visível na base da tela)
const HINT_H = 12;
function controlsHint(c, items) {
  if (!items || !items.length) return;
  c.font = '9px ' + FONT2;
  const parts = items.map(([act, lab]) => ({ act, lab, w: btnW(c, act) + 3 + c.measureText(lab).width }));
  const gap = 9, tw = parts.reduce((s, p) => s + p.w, 0) + gap * (parts.length - 1) + 10;
  let x = Math.round((W - tw) / 2) + 5; const y = H - HINT_H;
  c.globalAlpha = .82; R(c, Math.round((W - tw) / 2), y, tw, HINT_H, '#0c0a12'); c.globalAlpha = 1;
  R(c, Math.round((W - tw) / 2), y, tw, 1, '#d8323c');
  for (const p of parts) {
    const iw = btnIcon(c, p.act, x, y + 1.6);
    c.font = '9px ' + FONT2; T(c, p.lab, x + iw + 3, y + 1.8, { f: FONT2, size: 9, col: '#f3efe6', sh: false });
    x += p.w + gap;
  }
}
function objectiveUI(c, sc, text, tx, ty, by = 15) {
  if (!text) return;
  if (tx == null) return;
  const cam = camOf(sc); const sx = tx - cam.x, sy = (ty != null ? ty : 100) - cam.y;
  if (sx < 6 || sx > W - 6) {
    const dir = sx < 6 ? -1 : 1, ax = dir < 0 ? 8 : W - 8, ay = 52 + Math.sin(G.t * 3) * 2;
    const b = Math.sin(G.t * 8) * 1.5 * dir;
    c.fillStyle = OUT; c.beginPath(); c.moveTo(ax + b + dir * 7, ay); c.lineTo(ax + b - dir * 4, ay - 8); c.lineTo(ax + b - dir * 4, ay + 8); c.fill();
    c.fillStyle = '#ffd54a'; c.beginPath(); c.moveTo(ax + b + dir * 5, ay); c.lineTo(ax + b - dir * 3, ay - 6); c.lineTo(ax + b - dir * 3, ay + 6); c.fill();
  } else {
    const b = Math.sin(G.t * 6) * 2, gy = sy + 38, k = .5 + Math.sin(G.t * 5) * .5;
    c.globalAlpha = .25 + k * .35; c.strokeStyle = '#ffd54a'; c.lineWidth = 1.2; c.beginPath(); c.ellipse(sx, gy, 12 + k * 3, 3 + k, 0, 0, 7); c.stroke(); c.globalAlpha = 1;
    c.fillStyle = OUT; c.beginPath(); c.moveTo(sx, sy + 2 + b); c.lineTo(sx - 7, sy - 8 + b); c.lineTo(sx + 7, sy - 8 + b); c.fill();
    c.fillStyle = '#ffd54a'; c.beginPath(); c.moveTo(sx, sy + b); c.lineTo(sx - 5, sy - 7 + b); c.lineTo(sx + 5, sy - 7 + b); c.fill();
  }
}

/* ---------- interação (objetos próximos) ---------- */
function nearInter(list, hero) {
  let best = null, bd = 1e9;
  for (const it of list) {
    if (it.cond && !it.cond()) continue;
    const d = Math.abs(hero.cx - it.x);
    if (d < (it.r || 16) && (it.y == null || Math.abs(hero.fy - it.y) < (it.ry || 26)) && d < bd) { best = it; bd = d; }
  }
  return best;
}

/* ---------- menu de pausa ---------- */
const Pause = {
  sel: 0, opts: ['Continuar', 'Reiniciar cena', 'Volume: ', 'Tela cheia', 'Menu principal'],
  update() {
    if (Input.pressed('up')) { this.sel = (this.sel + this.opts.length - 1) % this.opts.length; sfx('sel'); }
    if (Input.pressed('down')) { this.sel = (this.sel + 1) % this.opts.length; sfx('sel'); }
    if (Input.pressed('start')) { G.paused = false; return; }
    if (this.sel === 2 && Input.pressed('left')) { AU.setVol(AU.vol + 1); sfx('sel'); }
    if (this.sel === 2 && Input.pressed('right')) { AU.setVol(AU.vol - 1); sfx('sel'); }
    let tapped = false;
    const bb = this.box; if (bb && Input.pressed('tap') && Input.tapX > bb.x && Input.tapX < bb.x + bb.w) { const i = Math.floor((Input.tapY - bb.y) / bb.rh); if (i >= 0 && i < this.opts.length) { this.sel = i; tapped = true; } }
    if (Input.confirm() || tapped) {
      sfx('ok');
      switch (this.sel) {
        case 0: G.paused = false; break;
        case 1: G.paused = false; G.go(G.sceneName, Object.assign({}, G.scene.restartOpts || {}, { restart: true })); break;
        case 2: AU.setVol(AU.vol + 1); break;
        case 3: toggleFull(); break;
        case 4: G.paused = false; G.go('title'); break;
      }
    }
  },
  draw(c) {
    R(c, 0, 0, W, H, 'rgba(8,6,12,.72)');
    const lab = (o, i) => i === 2 ? o + (AU.vol === AU.LEVELS.length - 1 ? 'mudo' : Math.round(AU.LEVELS[AU.vol] * 100) + '%') + ' ◂▸' : o;
    c.font = '10px ' + FONT2; const bw = Math.max(...this.opts.map((o, i) => c.measureText('▶ ' + lab(o, i)).width)) + 20;
    const bx = (W - bw) / 2, by = 52;
    this.box = { x: bx, y: by + 14, w: bw, rh: 11 };
    pxBox(c, bx, by, bw, 18 + this.opts.length * 11, '#16121c', '#d8323c');
    T(c, 'PAUSA', W / 2, by + 5, { size: 5, align: 'center', col: '#f3efe6' });
    this.opts.forEach((o, i) => {
      T(c, (i === this.sel ? '▶ ' : '  ') + lab(o, i), bx + 9, by + 15 + i * 11, { f: FONT2, size: 10, col: i === this.sel ? '#ffd54a' : '#cfc8dc' });
    });
  }
};
function toggleFull() {
  try { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); } catch (e) { }
}
