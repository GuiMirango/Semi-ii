'use strict';
/* =========================================================
   Pixel art procedural: personagens, fonte 3x5, objetos e cenários.
   ========================================================= */
const OUT = '#140f18';

/* ---------- visuais dos personagens ---------- */
const MIR = { skin: '#9a6644', skinD: '#76482d', hair: '#1a1110', hairL: '#3a2a22', style: 'afro', shirt: '#a7b0ba', shirtD: '#7f8893', pants: '#353a48', pantsD: '#272b36', shoes: '#1d1a1c', scarf: '#d8323c', scarfD: '#9e1f2a', eye: '#120c0c', bags: true };
const LOOKS = {
  mirango: MIR,
  mirangoBeach: Object.assign({}, MIR, { shirt: '#f4f0e0', shirtD: '#cfc6ad', pants: '#2f9aa5', pantsD: '#1f7580', shorts: true, barefoot: true, style: 'bandana', scarf: null, band: '#d8323c', short: true, bags: false }),
  mirangoNight: Object.assign({}, MIR, { shirt: '#7d8794', shirtD: '#5d6570', untucked: true }),
  mirangoGray: Object.assign({}, MIR, { shirt: '#8e9196', shirtD: '#6c6f74', pants: '#3a3c42', pantsD: '#2a2c30' }),
  mirangoPJ: Object.assign({}, MIR, { shirt: '#5d6b80', shirtD: '#47536a', pants: '#4d5a70', pantsD: '#3a465a', barefoot: true, scarf: null }),
  plinio: { skin: '#e3b78f', skinD: '#c39570', hair: '#6b4a2b', style: 'short', shirt: '#ddd6b8', shirtD: '#b9b192', pants: '#4d4a44', pantsD: '#3a3833', shoes: '#2a211b', tie: '#3b6fb0', mouth: 'smile', eye: '#1b1b1b' },
  sueli: { skin: '#c98e6a', skinD: '#a8714f', hair: '#3a2318', style: 'bun', shirt: '#e9e2dc', shirtD: '#c9c0b8', jacket: '#7a2f4f', jacketD: '#5a1f39', pants: '#2b2b33', pantsD: '#1f1f26', shoes: '#111', glasses: true, eye: '#1b1b1b' },
  diretor: { skin: '#f0c7a0', skinD: '#d1a37c', hair: '#bdbdbd', style: 'bald', shirt: '#f2f2f2', shirtD: '#cfcfcf', jacket: '#1f2633', jacketD: '#141924', pants: '#1f2633', pantsD: '#141924', shoes: '#0d0d0d', tie: '#b8962e', mustache: true, eye: '#1b1b1b' },
  chefe: { skin: '#b97a52', skinD: '#965d3b', hair: '#2a1d14', style: 'short', shirt: '#f5f5f5', shirtD: '#d4d4d4', jacket: '#4a4f5c', jacketD: '#353945', pants: '#353945', pantsD: '#262a33', shoes: '#0d0d0d', tie: '#8a1c1c', beard: true, eye: '#1b1b1b' },
  colegaA: { skin: '#7a4b31', skinD: '#5e3722', hair: '#120c0a', style: 'long', shirt: '#6f8f7a', shirtD: '#56715f', pants: '#3b3b44', pantsD: '#2c2c33', shoes: '#1a1a1a', eye: '#111' },
  colegaB: { skin: '#f2d0b0', skinD: '#d4ae8c', hair: '#c79a4a', style: 'spiky', shirt: '#8a7fb0', shirtD: '#6c628e', pants: '#2f3a52', pantsD: '#222b3e', shoes: '#1a1a1a', glasses: true, eye: '#111' },
  vendedor: { skin: '#a06a46', skinD: '#7c4f31', hair: '#d9d9d9', style: 'hat', shirt: '#f0ece0', shirtD: '#cfc8b4', apron: '#3f7fbf', pants: '#5a4a3a', pantsD: '#463a2d', shoes: '#2a211b', mustache: true, eye: '#111' },
  apressado: { skin: '#e8bf98', skinD: '#c99c74', hair: '#2a2a2a', style: 'short', shirt: '#eaeaea', shirtD: '#c4c4c4', jacket: '#2e4a7a', jacketD: '#20365c', pants: '#2e4a7a', pantsD: '#20365c', shoes: '#0d0d0d', tie: '#d8b02e', shades: true, eye: '#111' },
  nativo: { skin: '#8a5634', skinD: '#6a3f22', hair: '#0f0b08', style: 'long', shirt: '#8a5634', shirtD: '#6a3f22', pants: '#e0a33a', pantsD: '#b8812a', shorts: true, barefoot: true, shoes: null, beard: true, eye: '#111', necklace: true },
  passA: { skin: '#5e3a26', skinD: '#472a1a', hair: '#111', style: 'cap', cap: '#c43b3b', shirt: '#e3c34a', shirtD: '#bfa133', pants: '#3a4a6a', pantsD: '#2b3850', shoes: '#eee', eye: '#111' },
  passB: { skin: '#e8c4a0', skinD: '#c9a27e', hair: '#5a3a22', style: 'long', shirt: '#c45a8a', shirtD: '#9e436c', pants: '#2b2b33', pantsD: '#1f1f26', shoes: '#222', eye: '#111' },
  passC: { skin: '#b07a52', skinD: '#8e5d3a', hair: '#999', style: 'bald', shirt: '#4a7a5a', shirtD: '#365c43', pants: '#5a5040', pantsD: '#463e30', shoes: '#222', mustache: true, glasses: true, eye: '#111' },
  passD: { skin: '#6e432b', skinD: '#55321e', hair: '#111', style: 'afro', shirt: '#3b5fa0', shirtD: '#2c4780', pants: '#222', pantsD: '#181818', shoes: '#ddd', eye: '#111' },
  terno: { skin: '#d9b08c', skinD: '#b88c66', hair: '#3a2a1a', style: 'short', shirt: '#f2f2f2', shirtD: '#cfcfcf', jacket: '#3a3f4a', jacketD: '#2a2e36', pants: '#3a3f4a', pantsD: '#2a2e36', shoes: '#0d0d0d', tie: '#d8323c', eye: '#111' },
  rival: { skin: '#d9a77c', skinD: '#b8865c', hair: '#3a2a1a', style: 'bun', shirt: '#7aa04a', shirtD: '#5e7f36', pants: '#3a3a44', pantsD: '#2a2a32', shoes: '#222', eye: '#111' }
};

function drawPerson(c, x, y, L, P = {}) {
  x = Math.round(x); y = Math.round(y);
  if (P.tremble) x += Math.round(rnd(-1, 1));
  if (P.rot) { c.save(); c.translate(x, y); c.rotate(P.rot); const Q = Object.assign({}, P, { rot: 0, tremble: 0 }); personBody(c, 0, 0, L, Q); c.restore(); return; }
  personBody(c, x, y, L, P);
}
function personBody(c, x, y, L, P) {
  if (P.alpha != null) c.globalAlpha = P.alpha;
  if (!P.noOutline) for (const o of [[-1, 0], [1, 0], [0, -1], [0, 1]]) personParts(c, x + o[0], y + o[1], L, P, P.outline || OUT);
  personParts(c, x, y, L, P, P.mono || null);
  c.globalAlpha = 1;
}
function personParts(c, x, y, L, P, mono) {
  const f = P.face || 1;
  const r = (dx, dy, w, h, k) => { if (!k) return; c.fillStyle = mono || k; c.fillRect(f > 0 ? x + dx : x - dx - w, y + dy, w, h); };
  let lf = 0, lb = 0, af = 0, ab = 0, bob = 0;
  if (P.walk != null) { const s = Math.sin(P.walk * Math.PI * 2); lf = Math.round(s * 2); lb = -lf; af = -Math.round(s * 1.4); ab = -af; bob = Math.abs(s) > .6 ? 0 : -1; }
  const sl = Math.round((P.slump || 0) * 2);
  const cr = P.crouch ? 6 : 0;
  const by = bob + cr + (sl > 1 ? 1 : 0);
  const skin = L.skin, skinD = L.skinD, shoes = L.barefoot ? L.skinD : L.shoes;
  const leg = (dx, dy, h, pc) => {
    if (L.shorts) { const ph = Math.min(4, h); r(dx, dy, 3, ph, pc); r(dx, dy + ph, 3, h - ph, pc === L.pants ? skin : skinD); }
    else r(dx, dy, 3, h, pc);
  };
  // pernas
  if (P.sit) {
    r(-3, -9, 7, 3, L.pants); r(-3, -9, 7, 1, L.pantsD);
    leg(2, -6, 6, L.pants); r(2, -1, 5, 1, shoes); r(2, -2, 4, 1, shoes);
  } else if (P.air && !P.crouch) {
    leg(-4, -9, 7, L.pantsD); leg(1, -10, 7, L.pants);
    r(-5, -3, 4, 2, shoes); r(2, -4, 4, 2, shoes);
  } else if (cr) {
    leg(-3, -5, 5, L.pantsD); r(-1, -6, 5, 3, L.pants); leg(1, -4, 4, L.pants);
    r(-3, -1, 4, 1, shoes); r(1, -1, 4, 1, shoes);
  } else {
    leg(-3 + lb, -9, 9, L.pantsD); leg(lf, -9, 9, L.pants);
    r(-3 + lb, -2, 4, 2, shoes); r(lf, -2, 4, 2, shoes);
    if (!mono && !L.barefoot) { r(-3 + lb, -1, 4, 1, '#0a0a0a'); r(lf, -1, 4, 1, '#0a0a0a'); }
  }
  const ty = -18 + by;
  const sleeve = L.jacket || L.shirt, sleeveD = L.jacketD || L.shirtD;
  // braço de trás
  const arms = P.arms;
  if (arms === 'up2' || arms === 'shrug') { r(-3, ty - 6, 2, 7, sleeveD); r(-3, ty - 8, 2, 2, skinD); }
  else if (arms === 'type' || arms === 'out2') { r(-2, ty + 4, 6, 2, sleeveD); r(4, ty + 4, 2, 2, skinD); }
  else if (!P.sit || arms) { r(-3 + ab, ty + 1, 2, 7, sleeveD); r(-3 + ab, ty + 8, 2, 2, skinD); }
  // tronco
  r(-4, ty, 8, 9, L.shirt); r(-4, ty, 2, 9, L.shirtD);
  if (L.jacket) { r(-4, ty, 8, 9, L.jacket); r(-4, ty, 2, 9, L.jacketD); r(1, ty, 2, 6, L.shirt); }
  if (L.apron) { r(0, ty + 2, 4, 7, L.apron); }
  if (!L.untucked && !L.shorts) r(-4, ty + 7, 8, 1, '#1d1a20');
  if (L.untucked && !mono) r(-4, ty + 8, 8, 1, L.shirtD);
  if (L.tie) { r(2, ty + 1, 1, 5, L.tie); r(1, ty + 1, 2, 1, L.tie); }
  if (L.necklace && !mono) { r(-1, ty, 4, 1, '#e8e0c0'); r(1, ty + 1, 1, 1, '#d8323c'); }
  if (L.short && !mono) { r(-1, ty, 3, 3, skinD); }
  // cabeça
  let hx = sl, hy = -26 + by + sl;
  if (P.tic) hx -= 1;
  if (P.nod) hy += 1;
  r(-3 + hx, hy, 7, 8, skin); r(-3 + hx, hy + 7, 7, 1, skinD); r(-1 + hx, hy + 8, 3, 1, skinD);
  r(-2 + hx, hy + 3, 1, 2, skinD); r(4 + hx, hy + 4, 1, 1, skin);
  // cabelo
  const hair = L.hair;
  switch (L.style) {
    case 'afro': r(-4 + hx, hy - 3, 9, 5, hair); r(-4 + hx, hy + 2, 2, 3, hair); r(-3 + hx, hy - 4, 7, 1, hair); if (!mono) r(-2 + hx, hy - 3, 3, 1, L.hairL || hair); break;
    case 'bandana': r(-4 + hx, hy - 3, 9, 5, hair); r(-4 + hx, hy + 2, 2, 3, hair); r(-3 + hx, hy - 4, 7, 1, hair); r(-4 + hx, hy, 9, 1, L.band); r(-6 + hx, hy + 1, 2, 3, L.band); break;
    case 'short': r(-3 + hx, hy - 1, 7, 2, hair); r(-3 + hx, hy + 1, 2, 2, hair); break;
    case 'bald': r(-3 + hx, hy + 2, 2, 3, hair); if (!mono) r(0 + hx, hy, 2, 1, '#fff3e0'); break;
    case 'bun': r(-3 + hx, hy - 1, 7, 2, hair); r(-3 + hx, hy + 1, 2, 3, hair); r(-6 + hx, hy - 1, 3, 3, hair); break;
    case 'long': r(-4 + hx, hy - 1, 8, 2, hair); r(-4 + hx, hy + 1, 3, 7, hair); break;
    case 'spiky': r(-3 + hx, hy - 1, 7, 2, hair); r(-2 + hx, hy - 2, 1, 1, hair); r(0 + hx, hy - 3, 1, 2, hair); r(2 + hx, hy - 2, 1, 1, hair); r(-3 + hx, hy + 1, 2, 2, hair); break;
    case 'cap': r(-3 + hx, hy - 1, 7, 3, L.cap); r(3 + hx, hy + 1, 3, 1, L.cap); r(-3 + hx, hy + 2, 2, 2, hair); break;
    case 'hat': r(-5 + hx, hy + 1, 11, 1, '#c9a24a'); r(-3 + hx, hy - 2, 7, 3, '#e8c46a'); r(-3 + hx, hy, 7, 1, '#a33'); break;
  }
  if (mono) { drawArmFront(); return; }
  // rosto
  const eye = L.eye || '#111';
  const eyes = P.eyes || L.eyes;
  if (L.glasses) r(-1 + hx, hy + 3, 5, 2, '#cfe6f0');
  if (L.shades) r(-1 + hx, hy + 3, 6, 2, '#0d0d0d');
  else if (eyes === 'closed') { r(0 + hx, hy + 4, 1, 1, eye); r(2 + hx, hy + 4, 2, 1, eye); }
  else if (eyes === 'wide' || P.tic) { r(-1 + hx, hy + 2, 2, 3, '#fff'); r(2 + hx, hy + 2, 2, 3, '#fff'); r(0 + hx, hy + 3, 1, 1, eye); r(3 + hx, hy + 3, 1, 1, eye); }
  else { r(0 + hx, hy + 3, 1, 2, eye); r(2 + hx, hy + 3, 1, 2, eye); if (eyes === 'shine') { r(0 + hx, hy + 3, 1, 1, '#fff'); r(2 + hx, hy + 3, 1, 1, '#fff'); } }
  if (L.glasses) r(-1 + hx, hy + 2, 5, 1, '#222');
  if (L.bags && (P.slump || 0) > .3 && eyes !== 'closed') r(0 + hx, hy + 5, 3, 1, skinD);
  if (L.mustache) r(1 + hx, hy + 5, 3, 1, L.hair === '#bdbdbd' ? '#9a9a9a' : L.hair);
  if (L.beard) { r(-1 + hx, hy + 5, 5, 3, L.hair); r(4 + hx, hy + 5, 1, 2, L.hair); }
  const mouth = P.mouth || L.mouth;
  const md = '#4a2620';
  if (mouth === 'smile') { r(0 + hx, hy + 6, 4, 1, '#fff'); r(0 + hx, hy + 5, 1, 1, md); r(3 + hx, hy + 5, 1, 1, md); }
  else if (mouth === 'open') r(1 + hx, hy + 5, 2, 2, '#2a0d0d');
  else if (mouth === 'shout') { r(0 + hx, hy + 5, 4, 3, '#2a0d0d'); r(1 + hx, hy + 7, 2, 1, '#c44'); }
  else if (mouth === 'sad') { r(1 + hx, hy + 6, 2, 1, md); r(0 + hx, hy + 7, 1, 1, md); r(3 + hx, hy + 7, 1, 1, md); }
  else if (mouth === 'eat') r(1 + hx, hy + 5, 3, 2, '#c9a05a');
  else if (!L.beard) r(1 + hx, hy + 6, 2, 1, md);
  if (P.tic) r(5 + hx, hy - 1, 1, 2, '#9fd3ff');
  if (P.sweat) { r(-3 + hx, hy + 1, 1, 2, '#9fd3ff'); }
  // cachecol vermelho (marca do Mirango)
  if (L.scarf) {
    const fl = P.walk != null ? Math.floor(P.walk * 4) % 2 : 0;
    r(-4, ty - 1, 9, 2, L.scarf); r(-4, ty, 9, 1, L.scarfD); r(3, ty + 1, 2, 3, L.scarf);
    r(-6, ty + fl, 2, 4, L.scarfD); r(-5, ty - 1 + fl, 1, 1, L.scarf);
  }
  drawArmFront();
  function drawArmFront() {
    const sk = skin;
    switch (arms) {
      case 'out': case 'out2': r(1, ty + 2, 7, 2, sleeve); r(8, ty + 2, 2, 2, sk); break;
      case 'up': case 'up2': r(1, ty - 7, 2, 8, sleeve); r(1, ty - 9, 2, 2, sk); break;
      case 'fist': r(2, ty - 4, 2, 6, sleeve); r(2, ty - 7, 3, 3, sk); break;
      case 'hold': r(1, ty + 4, 5, 2, sleeve); r(5, ty + 3, 2, 2, sk); break;
      case 'type': r(1, ty + 5, 6, 2, sleeve); r(6, ty + 5, 2, 2, sk); break;
      case 'face': r(1, ty + 1, 2, 4, sleeve); r(2 + hx, hy + 4, 3, 3, sk); break;
      case 'point': r(1, ty + 1, 7, 2, sleeve); r(8, ty + 1, 3, 1, sk); r(8, ty + 2, 2, 1, sk); break;
      case 'phone': r(1, ty - 1, 2, 5, sleeve); r(2 + hx, hy + 3, 2, 3, sk); r(1 + hx - 1, hy + 2, 1, 5, '#222'); break;
      case 'shrug': r(1, ty - 6, 2, 7, sleeve); r(1, ty - 8, 2, 2, sk); break;
      case 'drink': r(1, ty + 1, 2, 3, sleeve); r(2, ty - 2, 3, 3, sk); break;
      default: r(af, ty + 1, 2, 7, sleeve); if (L.short) r(af, ty + 3, 2, 5, sk); r(af, ty + 8, 2, 2, sk);
    }
  }
}
// personagem em escala (close-ups, luta)
const _pc = makeCanvas(64, 64);
function drawPersonBig(c, x, y, L, P, sc) {
  const pc = _pc.getContext('2d'); pc.clearRect(0, 0, 64, 64);
  drawPerson(pc, 32, 56, L, P);
  c.imageSmoothingEnabled = false;
  if (P.rot2) { c.save(); c.translate(Math.round(x), Math.round(y - 24 * sc)); c.rotate(P.rot2); c.drawImage(_pc, -32 * sc, -32 * sc, 64 * sc, 64 * sc); c.restore(); }
  else c.drawImage(_pc, Math.round(x - 32 * sc), Math.round(y - 56 * sc), 64 * sc, 64 * sc);
}

/* ---------- fonte de pixel 3x5 (textos dentro do mundo) ---------- */
const GLY = {
  A: [2, 5, 7, 5, 5], B: [6, 5, 6, 5, 6], C: [3, 4, 4, 4, 3], D: [6, 5, 5, 5, 6], E: [7, 4, 6, 4, 7], F: [7, 4, 6, 4, 4], G: [3, 4, 5, 5, 3], H: [5, 5, 7, 5, 5],
  I: [7, 2, 2, 2, 7], J: [1, 1, 1, 5, 2], K: [5, 5, 6, 5, 5], L: [4, 4, 4, 4, 7], M: [5, 7, 7, 5, 5], N: [6, 5, 5, 5, 5], O: [2, 5, 5, 5, 2], P: [6, 5, 6, 4, 4],
  Q: [2, 5, 5, 6, 3], R: [6, 5, 6, 5, 5], S: [3, 4, 2, 1, 6], T: [7, 2, 2, 2, 2], U: [5, 5, 5, 5, 7], V: [5, 5, 5, 5, 2], W: [5, 5, 7, 7, 5], X: [5, 5, 2, 5, 5],
  Y: [5, 5, 2, 2, 2], Z: [7, 1, 2, 4, 7], 0: [7, 5, 5, 5, 7], 1: [2, 6, 2, 2, 7], 2: [6, 1, 2, 4, 7], 3: [6, 1, 2, 1, 6], 4: [5, 5, 7, 1, 1], 5: [7, 4, 6, 1, 6],
  6: [3, 4, 7, 5, 7], 7: [7, 1, 2, 2, 2], 8: [7, 5, 7, 5, 7], 9: [7, 5, 7, 1, 6], '.': [0, 0, 0, 0, 2], ',': [0, 0, 0, 2, 4], '!': [2, 2, 2, 0, 2], '?': [6, 1, 2, 0, 2],
  ':': [0, 2, 0, 2, 0], '-': [0, 0, 7, 0, 0], '+': [0, 2, 7, 2, 0], '=': [0, 7, 0, 7, 0], '×': [0, 5, 2, 5, 0], '%': [5, 1, 2, 4, 5], '$': [3, 6, 2, 3, 6], '/': [1, 1, 2, 4, 4],
  '(': [1, 2, 2, 2, 1], ')': [4, 2, 2, 2, 4], '@': [2, 5, 7, 4, 3], "'": [2, 2, 0, 0, 0], '>': [4, 2, 1, 2, 4], '<': [1, 2, 4, 2, 1], '#': [5, 7, 5, 7, 5], '*': [5, 2, 7, 2, 5], '^': [2, 5, 0, 0, 0], '_': [0, 0, 0, 0, 7], '|': [2, 2, 2, 2, 2]
};
function pixText(c, s, x, y, col, sc = 1, align = 'left') {
  s = String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
  const wd = s.length * 4 * sc - sc;
  if (align === 'center') x -= Math.floor(wd / 2); else if (align === 'right') x -= wd;
  x = Math.round(x); y = Math.round(y);
  c.fillStyle = col;
  for (let i = 0; i < s.length; i++) {
    const g = GLY[s[i]]; if (!g) continue;
    for (let row = 0; row < 5; row++) for (let b = 0; b < 3; b++) if (g[row] & (4 >> b)) c.fillRect(x + (i * 4 + b) * sc, y + row * sc, sc, sc);
  }
  return wd;
}

/* ---------- objetos ---------- */
function deskP(c, x, y, w, col = '#8a6b4c', colD = '#6a4f36') {
  // y = chão; tampo a 16px
  R(c, x, y - 16, w, 3, col); R(c, x, y - 13, w, 1, colD);
  R(c, x + 1, y - 13, 2, 13, colD); R(c, x + w - 3, y - 13, 2, 13, colD);
  R(c, x + w - 14, y - 13, 11, 9, col); R(c, x + w - 13, y - 9, 9, 1, colD); R(c, x + w - 9, y - 11, 2, 1, '#d4c09a');
}
function monitorP(c, x, y, scr = '#2b5d8a', glow) {
  R(c, x, y - 10, 13, 9, '#2a2d33'); R(c, x + 1, y - 9, 11, 7, scr);
  if (glow) { R(c, x + 2, y - 8, 6, 1, glow); R(c, x + 2, y - 6, 8, 1, glow); R(c, x + 2, y - 4, 4, 1, glow); }
  R(c, x + 5, y - 1, 3, 1, '#2a2d33'); R(c, x + 3, y, 7, 1, '#1d1f24');
}
function chairP(c, x, y, col = '#2f3440') {
  R(c, x, y - 18, 3, 10, col); R(c, x, y - 9, 9, 2, col); R(c, x + 4, y - 7, 1, 5, '#555'); R(c, x + 1, y - 2, 7, 1, '#444'); R(c, x + 1, y - 1, 1, 1, '#222'); R(c, x + 7, y - 1, 1, 1, '#222');
}
function plantP(c, x, y, s = 1, rng = Math.random) {
  R(c, x - 4, y - 7, 9, 7, '#9a5a3a'); R(c, x - 4, y - 7, 9, 1, '#b8704a'); R(c, x - 3, y - 2, 7, 2, '#7a4428');
  const g = ['#2f7a3f', '#3e9a4f', '#226030'];
  for (let i = 0; i < 9 * s; i++) { const a = -Math.PI / 2 + (rng() - .5) * 2.2, L = (6 + rng() * 8) * s; for (let k = 0; k < L; k++) R(c, Math.round(x + Math.cos(a) * k * .8), Math.round(y - 7 + Math.sin(a) * k), 2, 1, g[(i + k) % 3]); }
}
function cabinetP(c, x, y, w, h, col = '#7c8592') {
  R(c, x, y - h, w, h, col); R(c, x, y - h, w, 1, '#a3abb6'); R(c, x + w - 1, y - h, 1, h, '#5c646f');
  for (let yy = y - h + 3; yy < y - 3; yy += 8) { R(c, x + 1, yy + 5, w - 2, 1, '#5c646f'); R(c, x + w / 2 - 2, yy + 2, 4, 1, '#d8dde3'); }
}
function boxP(c, x, y, w, h) {
  R(c, x, y - h, w, h, '#b88b55'); R(c, x, y - h, w, 1, '#d4a86c'); R(c, x + w - 1, y - h, 1, h, '#946c3e');
  R(c, x + Math.floor(w / 2) - 1, y - h, 2, h, '#d9c8a0'); R(c, x + 2, y - h + 3, 4, 2, '#2a2a2a');
}
function skyline(c, x0, w, baseY, rng, P) {
  // P: {far, near, win, lit, litP, hmin, hmax}
  let x = x0;
  while (x < x0 + w) {
    const bw = Math.floor(14 + rng() * 26), bh = Math.floor((P.hmin || 30) + rng() * ((P.hmax || 80) - (P.hmin || 30)));
    R(c, x, baseY - bh, bw, bh, P.col);
    if (rng() < .3) { R(c, x + Math.floor(bw / 2) - 1, baseY - bh - 6, 2, 6, P.col); if (P.lit) R(c, x + Math.floor(bw / 2) - 1, baseY - bh - 7, 2, 1, '#ff4040'); }
    if (rng() < .25) R(c, x + 2, baseY - bh - 3, bw - 4, 3, P.col);
    if (P.win) for (let yy = baseY - bh + 3; yy < baseY - 3; yy += 4) for (let xx = x + 2; xx < x + bw - 2; xx += 3) {
      const lit = P.lit && rng() < (P.litP || .3);
      if (lit || rng() < .5) R(c, xx, yy, 1, 2, lit ? P.lit : P.win);
    }
    x += bw + Math.floor(rng() * 4);
  }
}
function lightCone(c, x, y, w, h, col, a) {
  c.globalAlpha = a; c.fillStyle = col; c.beginPath(); c.moveTo(x - 3, y); c.lineTo(x + 3, y); c.lineTo(x + w / 2, y + h); c.lineTo(x - w / 2, y + h); c.closePath(); c.fill(); c.globalAlpha = 1;
}
function dither(c, x, y, w, h, col, step = 2) { c.fillStyle = col; for (let yy = y; yy < y + h; yy++) for (let xx = x + ((yy - y) % 2); xx < x + w; xx += step) c.fillRect(xx, yy, 1, 1); }

/* ---------- ícones ---------- */
function iconMail(c, x, y, col = '#f4f4f4', s = 1) {
  R(c, x, y, 9 * s, 6 * s, col); R(c, x, y, 9 * s, s, '#999'); c.fillStyle = '#888';
  for (let i = 0; i < 4; i++) { c.fillRect(x + i * s, y + i * s, s, s); c.fillRect(x + (8 - i) * s, y + i * s, s, s); }
  R(c, x - s, y - s, 9 * s + 2 * s, s, OUT); R(c, x - s, y + 6 * s, 9 * s + 2 * s, s, OUT); R(c, x - s, y, s, 6 * s, OUT); R(c, x + 9 * s, y, s, 6 * s, OUT);
}
function iconPaper(c, x, y) { R(c, x, y, 6, 8, '#f4f4ee'); R(c, x + 1, y + 2, 4, 1, '#aaa'); R(c, x + 1, y + 4, 4, 1, '#aaa'); R(c, x + 1, y + 6, 3, 1, '#aaa'); R(c, x + 4, y, 2, 2, '#ccc'); }
function iconPrinter(c, x, y, col = '#ddd') { R(c, x + 2, y, 6, 3, '#fff'); R(c, x, y + 3, 10, 5, col); R(c, x + 2, y + 8, 6, 2, '#fff'); R(c, x + 7, y + 4, 2, 1, '#e33'); }
