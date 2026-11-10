'use strict';
/* =========================================================
   O INFUNDÍBULO DE MIRANGO — núcleo do motor
   Resolução interna 320x180 (pixel art), texto/HUD em alta resolução.
   ========================================================= */
const W = 320, H = 180;
const cv = document.getElementById('game');
const ctx = cv.getContext('2d');
const buf = document.createElement('canvas'); buf.width = W; buf.height = H;
const bx = buf.getContext('2d');
let S = 1;
const FONT = '"Press Start 2P", monospace';
const FONT2 = '"VT323", monospace';

/* ---------- utilidades ---------- */
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const rnd = (a = 1, b) => b === undefined ? Math.random() * a : a + Math.random() * (b - a);
const irnd = (a, b) => Math.floor(rnd(a, b + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const approach = (v, t, d) => v < t ? Math.min(v + d, t) : Math.max(v - d, t);
const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
function srand(seed) { let s = (seed >>> 0) || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
function R(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(x, y, w, h); }
function makeCanvas(w, h, fn) { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; if (fn) fn(x, w, h); return c; }
function hex2rgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function mix(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return 'rgb(' + A.map((v, i) => Math.round(lerp(v, B[i], t))).join(',') + ')'; }
function vgrad(c, x, y, w, h, stops, bands) {
  // gradiente vertical em faixas com dithering (estética 16-bit)
  bands = bands || Math.max(2, Math.floor(h / 4));
  for (let i = 0; i < bands; i++) {
    const t = i / (bands - 1);
    let col; const n = stops.length - 1, k = Math.min(n - 1, Math.floor(t * n)), lt = t * n - k;
    col = mix(stops[k], stops[k + 1], lt);
    const y0 = y + Math.floor(i * h / bands), y1 = y + Math.floor((i + 1) * h / bands);
    R(c, x, y0, w, y1 - y0, col);
    if (i > 0) { // linha pontilhada de transição
      c.fillStyle = mix(stops[k], stops[k + 1], Math.max(0, lt - .5 / bands * n));
      for (let xx = x + (i % 2); xx < x + w; xx += 2) c.fillRect(xx, y0, 1, 1);
    }
  }
}

/* ---------- tela ---------- */
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const ww = window.innerWidth, wh = window.innerHeight;
  const sc = Math.min(ww / W, wh / H);
  const cssW = Math.floor(W * sc), cssH = Math.floor(H * sc);
  cv.style.width = cssW + 'px'; cv.style.height = cssH + 'px';
  cv.width = Math.round(cssW * dpr); cv.height = Math.round(cssH * dpr);
  S = cv.width / W;
  ctx.imageSmoothingEnabled = false;
}
window.addEventListener('resize', resize);
resize();

/* ---------- entrada: teclado, toque e gamepad ---------- */
const KEYMAP = {
  ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
  Space: 'jump', KeyK: 'jump', KeyE: 'a', KeyZ: 'a', Enter: 'a', KeyJ: 'a', KeyX: 'b', KeyQ: 'b', KeyL: 'b',
  ShiftLeft: 'dash', ShiftRight: 'dash', KeyC: 'dash', Escape: 'start', KeyP: 'start',
  Digit1: 'n1', Digit2: 'n2', Digit3: 'n3', Numpad1: 'n1', Numpad2: 'n2', Numpad3: 'n3', KeyM: 'mute', KeyF: 'full'
};
const Input = {
  k: {}, hit: {}, t: {}, cur: {}, prev: {}, dev: 'kb', any: false,
  down(a) { return !!this.cur[a]; },
  pressed(a) { return !!this.cur[a] && !this.prev[a]; },
  released(a) { return !this.cur[a] && !!this.prev[a]; },
  confirm() { return this.pressed('a') || this.pressed('jump'); },
  update() {
    this.prev = this.cur;
    const c = {};
    for (const k in this.k) if (this.k[k]) c[k] = 1;
    for (const k in this.hit) c[k] = 1;
    for (const k in this.t) if (this.t[k]) c[k] = 1;
    this.hit = {};
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const p of pads) {
      if (!p) continue;
      const b = i => p.buttons[i] && p.buttons[i].pressed;
      const ax = p.axes[0] || 0, ay = p.axes[1] || 0;
      const m = { left: ax < -.4 || b(14), right: ax > .4 || b(15), up: ay < -.5 || b(12), down: ay > .5 || b(13), jump: b(0), b: b(1) || b(3), a: b(2), dash: b(4) || b(5) || b(6) || b(7), start: b(9) };
      for (const k in m) if (m[k]) { c[k] = 1; this.dev = 'pad'; }
    }
    this.any = Object.keys(c).some(k => !this.prev[k]);
    this.cur = c;
  },
  label(a) {
    const kb = { a: 'E', b: 'X', jump: 'ESPAÇO', dash: 'SHIFT', down: '↓', up: '↑', left: '←', right: '→', start: 'ESC' };
    const pad = { a: 'X', b: 'B', jump: 'A', dash: 'RB', down: '↓', up: '↑', left: '←', right: '→', start: 'START' };
    const tch = { a: 'E', b: 'X', jump: 'PULO', dash: '⇢', down: '▼', up: '▲', left: '◀', right: '▶', start: 'II' };
    return (this.dev === 'pad' ? pad : this.dev === 'touch' ? tch : kb)[a] || a;
  }
};
window.addEventListener('keydown', e => {
  const a = KEYMAP[e.code];
  if (a) { if (!e.repeat) Input.hit[a] = 1; Input.k[a] = 1; Input.dev = 'kb'; e.preventDefault(); }
  AU.unlock();
});
window.addEventListener('keyup', e => { const a = KEYMAP[e.code]; if (a) { Input.k[a] = 0; e.preventDefault(); } });
window.addEventListener('blur', () => { Input.k = {}; Input.t = {}; });
(function setupTouch() {
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0 && matchMedia('(pointer: coarse)').matches);
  if (isTouch) { document.body.classList.add('touch'); Input.dev = 'touch'; }
  document.querySelectorAll('#touch .tb').forEach(btn => {
    const act = btn.dataset.act;
    const on = e => { e.preventDefault(); Input.t[act] = 1; Input.hit[act] = 1; btn.classList.add('on'); Input.dev = 'touch'; AU.unlock(); };
    const off = e => { e.preventDefault(); Input.t[act] = 0; btn.classList.remove('on'); };
    btn.addEventListener('pointerdown', on); btn.addEventListener('pointerup', off);
    btn.addEventListener('pointercancel', off); btn.addEventListener('pointerleave', off);
  });
  cv.addEventListener('pointerdown', () => { AU.unlock(); Input.hit.tap = 1; });
})();

/* ---------- roteiros (geradores) e tarefas ---------- */
const Tk = {
  wait: s => ({ t: s, update(dt) { return (this.t -= dt) <= 0; } }),
  until: fn => ({ update: fn }),
  all: list => { const ts = list.map(toTask); return { update(dt) { let ok = true; for (let i = 0; i < ts.length; i++) { if (ts[i] && !ts[i].update(dt)) ok = false; else ts[i] = null; } return ok; } }; },
  call: fn => ({ update() { fn(); return true; } }),
  gen: g => { const s = new Script(g); return { update(dt) { s.update(dt); return s.done; } }; }
};
function toTask(v) {
  if (v == null) return null;
  if (typeof v === 'number') return Tk.wait(v);
  if (Array.isArray(v)) return Tk.all(v);
  if (typeof v === 'function') return { update: v };
  if (typeof v.next === 'function' && typeof v.update !== 'function') return Tk.gen(v);
  return v;
}
class Script {
  constructor(gen) { this.g = gen; this.cur = null; this.done = false; this.adv(); }
  adv() { const r = this.g.next(); if (r.done) { this.done = true; this.cur = null; } else this.cur = toTask(r.value); }
  update(dt) { let guard = 0; while (!this.done && guard++ < 200) { if (this.cur && !this.cur.update(dt)) return; dt = 0; this.adv(); } }
}
// mover ator (cutscene)
function walkTo(a, x, speed = 40) {
  return { update(dt) {
    const d = x - a.x; if (Math.abs(d) < 1) { a.x = x; a.moving = false; return true; }
    a.face = Math.sign(d); a.moving = true;
    const st = Math.min(Math.abs(d), speed * dt); a.x += Math.sign(d) * st; a.walk = (a.walk || 0) + st / 16;
    if (a.hero) { a.hero.x = a.x - a.hero.w / 2; a.hero.face = a.face; a.hero.walk = a.walk; }
    return false;
  } };
}

function heroTo(h, x) { let s = false; return { update() { if (!s) { h.auto = x; s = true; } return h.auto == null; } }; }
function heroActor(h) { return { get x() { return h.cx; }, get y() { return h.fy; }, h: 30 }; }
function npc(look, x, y, o = {}) {
  return Object.assign({
    look, x, y, face: 1, walk: 0, moving: false, pose: {}, h: 30,
    draw(c) { drawPerson(c, this.x, this.y, this.look, Object.assign({ face: this.face, walk: this.moving ? this.walk : null }, this.pose)); }
  }, o);
}
/* ---------- física simples de plataforma ---------- */
function moveBody(b, solids, dt, drop) {
  b.x += b.vx * dt;
  for (const s of solids) {
    if (s.oneway || s.off) continue;
    if (overlap(b, s)) { if (b.vx > 0) b.x = s.x - b.w; else if (b.vx < 0) b.x = s.x + s.w; b.vx = 0; b.hitWall = true; }
  }
  const py = b.y; b.y += b.vy * dt; b.onGround = false; b.ground = null;
  for (const s of solids) {
    if (s.off || !overlap(b, s)) continue;
    if (b.vy >= 0 && py + b.h <= s.y + 1) { if (s.oneway && drop) continue; b.y = s.y - b.h; b.vy = 0; b.onGround = true; b.ground = s; }
    else if (!s.oneway && b.vy < 0 && py >= s.y + s.h - 1) { b.y = s.y + s.h; b.vy = 0; }
  }
}

/* ---------- partículas ---------- */
class Parts {
  constructor() { this.l = []; }
  add(p) { p.life = p.life || 1; p.t = 0; p.g = p.g || 0; p.s = p.s || 1; this.l.push(p); if (this.l.length > 600) this.l.shift(); return p; }
  burst(x, y, n, o = {}) {
    for (let i = 0; i < n; i++) {
      const a = (o.ang != null ? o.ang : 0) + rnd(-(o.spread || Math.PI), o.spread || Math.PI), sp = rnd(o.min || 10, o.max || 60);
      this.add({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: o.g || 0, life: rnd(o.lmin || .3, o.lmax || .8), col: Array.isArray(o.col) ? pick(o.col) : (o.col || '#fff'), s: o.s || 1, type: o.type, drag: o.drag || 0 });
    }
  }
  update(dt) {
    for (const p of this.l) { p.t += dt; p.vy += p.g * dt; if (p.drag) { p.vx *= 1 - p.drag * dt; p.vy *= 1 - p.drag * dt; } p.x += p.vx * dt; p.y += p.vy * dt; if (p.upd) p.upd(p, dt); }
    this.l = this.l.filter(p => p.t < p.life);
  }
  draw(c) {
    for (const p of this.l) {
      const k = 1 - p.t / p.life;
      if (p.draw) { p.draw(c, p, k); continue; }
      if (p.type === 'smoke') { c.globalAlpha = k * .8; const s = Math.round(p.s + (1 - k) * 4); R(c, Math.round(p.x - s / 2), Math.round(p.y - s / 2), s, s, p.col); c.globalAlpha = 1; continue; }
      if (p.type === 'paper') { R(c, Math.round(p.x), Math.round(p.y), 3, 2 + (Math.floor(p.t * 10) % 2), p.col); R(c, Math.round(p.x), Math.round(p.y), 3, 1, '#c9c9c9'); continue; }
      c.globalAlpha = Math.min(1, k * 1.5);
      R(c, Math.round(p.x), Math.round(p.y), p.s, p.s, p.col);
      c.globalAlpha = 1;
    }
  }
}

/* ---------- herói controlável ---------- */
class Hero {
  constructor(x, y, look) {
    this.x = x; this.y = y; this.w = 8; this.h = 24; this.vx = 0; this.vy = 0; this.look = look; this.face = 1;
    this.onGround = false; this.walk = 0; this.coyote = 0; this.jbuf = 0; this.duck = false; this.dashT = 0; this.dashCD = 0;
    this.inv = 0; this.stun = 0; this.slump = 0; this.speed = 70; this.jumpV = 215; this.grav = 640; this.frozen = false;
    this.pose = {}; this.idleT = 0; this.ticT = 0; this.carry = null; this.moving = false;
  }
  get cx() { return this.x + this.w / 2; }
  get fy() { return this.y + this.h; }
  update(dt, solids, opt = {}) {
    const sp = this.speed * (opt.speedMul || 1);
    let ix = 0;
    if (this.auto != null) { const d = this.auto - this.cx; if (Math.abs(d) > 1.5) ix = Math.sign(d); else { this.auto = null; this.vx = 0; } }
    else if (!this.frozen && this.stun <= 0) { if (Input.down('left')) ix -= 1; if (Input.down('right')) ix += 1; }
    const wantDuck = !this.frozen && opt.canDuck && this.onGround && Input.down('down');
    if (wantDuck !== this.duck) { const nh = wantDuck ? 15 : 24; this.y += this.h - nh; this.h = nh; this.duck = wantDuck; }
    if (this.duck) ix = 0;
    const acc = this.onGround ? (opt.acc || 900) : 520;
    if (this.dashT > 0) { this.dashT -= dt; this.vx = this.face * Math.max(sp, 60) * 2.7; }
    else if (this.stun > 0) this.vx = approach(this.vx, 0, 300 * dt);
    else this.vx = approach(this.vx, ix * sp, acc * dt);
    if (ix) this.face = ix;
    if (this.onGround) this.coyote = .1; else this.coyote -= dt;
    const jp = !this.frozen && (Input.pressed('jump') || (opt.upJump && Input.pressed('up')));
    if (jp) this.jbuf = .13; else this.jbuf -= dt;
    if (opt.canJump !== false && this.jbuf > 0 && this.coyote > 0 && this.stun <= 0 && !this.duck) {
      this.vy = -this.jumpV * (opt.jumpMul || 1); this.coyote = 0; this.jbuf = 0; this.onGround = false; sfx('jump');
    }
    if (this.vy < -90 && !Input.down('jump') && !(opt.upJump && Input.down('up'))) this.vy = -90;
    if (opt.canDash && !this.frozen && Input.pressed('dash') && this.dashCD <= 0 && this.stun <= 0) {
      this.dashT = .2; this.dashCD = .9; this.inv = Math.max(this.inv, .3); sfx('dash');
      if (opt.parts) opt.parts.burst(this.cx, this.fy - 4, 6, { col: '#8899aa', min: 10, max: 30, ang: this.face > 0 ? Math.PI : 0, spread: .6 });
    }
    this.dashCD -= dt;
    this.vy += this.grav * dt; if (this.vy > 420) this.vy = 420;
    if (this.dashT > 0 && this.vy > 0) this.vy *= .5;
    const wasG = this.onGround;
    this.hitWall = false;
    moveBody(this, solids, dt, !this.frozen && opt.canDrop && Input.down('down') && Input.pressed('jump'));
    if (!wasG && this.onGround) { sfx('land'); if (opt.parts) opt.parts.burst(this.cx, this.fy, 4, { col: opt.dust || '#9a9aa8', min: 8, max: 25, ang: -Math.PI / 2, spread: 1.2, lmax: .4 }); }
    if (opt.minX != null && this.x < opt.minX) { this.x = opt.minX; this.vx = Math.max(0, this.vx); }
    if (opt.maxX != null && this.x + this.w > opt.maxX) { this.x = opt.maxX - this.w; this.vx = Math.min(0, this.vx); }
    this.moving = this.onGround && Math.abs(this.vx) > 4;
    if (this.moving) {
      const ow = this.walk; this.walk += Math.abs(this.vx) * dt / (opt.stride || 15);
      if (Math.floor(ow * 2) !== Math.floor(this.walk * 2)) sfx(opt.stepSfx || 'step');
      this.idleT = 0;
    } else this.idleT += dt;
    this.stun -= dt; this.inv -= dt;
    // tiques nervosos em idle
    if (opt.tics && this.idleT > 1.2) { this.ticT -= dt; if (this.ticT < -rnd(.8, 2.4)) this.ticT = .18; } else this.ticT = 0;
  }
  pose2() {
    return Object.assign({
      face: this.face, walk: this.moving ? this.walk : null, air: !this.onGround, crouch: this.duck,
      slump: this.slump, tic: this.ticT > 0, arms: this.carry ? 'hold' : (this.dashT > 0 ? 'out' : undefined)
    }, this.pose);
  }
  draw(c) {
    if (this.inv > 0 && Math.floor(this.inv * 20) % 2 === 0 && !this.dashT) return;
    drawPerson(c, this.cx, this.fy + (this.duck ? 0 : 0), this.look, this.pose2());
    if (this.carry) this.carry(c, this);
  }
}

/* ---------- cenas ---------- */
const SCENES = {};
const G = {
  t: 0, scene: null, sceneName: '', trans: null, fadeA: 0, fadeCol: '#000', shakeA: 0, flashA: 0, flashCol: '#fff',
  paused: false, overlays: [], store: {}, glitch: 0, slow: 1,
  go(name, o = {}) {
    if (this.trans && this.trans.phase === 'out') return;
    if (o.cut) { this._switch(name, o); this.fadeA = o.black ? 1 : 0; this.trans = o.black ? { phase: 'in', t: 0, dur: o.dur || .6 } : null; return; }
    this.trans = { phase: 'out', t: 0, dur: o.dur || .5, name, o, col: o.col || '#000' };
    this.fadeCol = o.col || '#000';
  },
  _switch(name, o) {
    Balloons.clear(); this.overlays = []; this.glitch = 0; this.slow = 1; this.shakeA = 0;
    const f = SCENES[name]; if (!f) { console.error('cena desconhecida', name); return; }
    const sc = f(o || {});
    this.scene = sc; this.sceneName = name;
    if (sc.enter) sc.enter(o || {});
    if (sc.music !== undefined) Music.play(sc.music);
    if (sc.amb !== undefined) AU.amb(sc.amb);
    try { history.replaceState(null, '', '#' + name); } catch (e) { }
  },
  shake(a) { this.shakeA = Math.max(this.shakeA, a); },
  flash(col = '#fff', a = 1) { this.flashCol = col; this.flashA = a; },
  unlock(ch) { try { const u = +localStorage.getItem('mirango_ch') || 1; if (ch > u) localStorage.setItem('mirango_ch', ch); } catch (e) { } }
};
function camOf(sc) { return (sc && sc.cam) || { x: 0, y: 0 }; }
