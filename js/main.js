'use strict';
/* =========================================================
   Laço principal + pós-processamento (dessaturação, vinheta, glitch).
   ========================================================= */
let _last = performance.now();
function postFX(sc) {
  const d = sc.desat || 0;
  if (d > 0) { bx.globalCompositeOperation = 'saturation'; bx.fillStyle = `rgba(128,128,128,${clamp(d, 0, 1)})`; bx.fillRect(0, 0, W, H); bx.globalCompositeOperation = 'source-over'; }
  if (sc.tint) { bx.globalCompositeOperation = sc.tint[2] || 'multiply'; bx.globalAlpha = sc.tint[1]; R(bx, 0, 0, W, H, sc.tint[0]); bx.globalAlpha = 1; bx.globalCompositeOperation = 'source-over'; }
  const v = sc.vig || 0;
  if (v > 0) {
    const g = bx.createRadialGradient(W / 2, H / 2, W * (.42 - v * .22), W / 2, H / 2, W * .62);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${clamp(v, 0, 1)})`);
    bx.fillStyle = g; bx.fillRect(0, 0, W, H);
  }
  const gl = G.glitch;
  if (gl > 0) {
    const n = Math.floor(gl * 10);
    for (let i = 0; i < n; i++) {
      const y = irnd(0, H - 8), h = irnd(1, 8), dx = Math.round(rnd(-14, 14) * gl);
      bx.drawImage(buf, 0, y, W, h, dx, y, W, h);
    }
    for (let i = 0; i < gl * 260; i++) { const g2 = irnd(30, 230); R(bx, irnd(0, W), irnd(0, H), irnd(1, 3), 1, `rgb(${g2},${g2},${g2})`); }
    if (Math.random() < gl * .3) { bx.globalCompositeOperation = 'difference'; R(bx, 0, irnd(0, H), W, irnd(2, 20), pick(['#ff0044', '#00ffcc', '#ffffff'])); bx.globalCompositeOperation = 'source-over'; }
  }
}
function frame(ts) {
  const dt = clamp((ts - _last) / 1000, 0, .05); _last = Math.max(_last, ts);
  Input.update();
  if (Input.pressed('mute')) AU.toggleMute();
  if (Input.pressed('full')) toggleFull();
  if (Input.any) AU.unlock();
  Music.tick();
  G.t += dt;
  const tr = G.trans;
  if (tr) {
    tr.t += dt;
    if (tr.phase === 'out') { G.fadeA = Math.min(1, tr.t / tr.dur); if (tr.t >= tr.dur) { G._switch(tr.name, tr.o); tr.phase = 'in'; tr.t = 0; } }
    else {
      if (G.scene && G.scene.holdBlack) { G.trans = null; G.fadeA = 1; }
      else { G.fadeA = Math.max(0, 1 - tr.t / tr.dur); if (tr.t >= tr.dur) { G.trans = null; G.fadeA = 0; } }
    }
  }
  const sc = G.scene;
  if (sc && Input.pressed('start') && !G.trans && G.sceneName !== 'title' && !sc.noPause) { G.paused = !G.paused; Pause.sel = 0; sfx('sel'); }
  else if (G.paused) Pause.update();
  if (sc && !G.paused) {
    sc.update(dt * G.slow, dt);
    Balloons.update(dt);
    G.shakeA = Math.max(0, G.shakeA - dt * 12);
    G.flashA = Math.max(0, G.flashA - dt * 3);
  }
  // desenho
  bx.setTransform(1, 0, 0, 1, 0, 0); bx.imageSmoothingEnabled = false; bx.globalAlpha = 1; bx.globalCompositeOperation = 'source-over';
  R(bx, 0, 0, W, H, '#000');
  if (sc) { bx.save(); sc.draw(bx); bx.restore(); postFX(sc); }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false; ctx.globalAlpha = 1;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cv.width, cv.height);
  const sx = Math.round(rnd(-1, 1) * G.shakeA) * S, sy = Math.round(rnd(-1, 1) * G.shakeA) * S;
  ctx.drawImage(buf, 0, 0, W, H, sx, sy, cv.width, cv.height);
  ctx.setTransform(S, 0, 0, S, 0, 0);
  if (sc) {
    if (sc.ui) { ctx.save(); sc.ui(ctx); ctx.restore(); }
    if (sc.hints && !G.paused) { const hs = typeof sc.hints === 'function' ? sc.hints() : sc.hints; if (hs) { ctx.save(); controlsHint(ctx, hs); ctx.restore(); } }
    Balloons.draw(ctx);
    for (const o of G.overlays) { ctx.save(); o.draw(ctx, o); ctx.restore(); }
  }
  if (G.flashA > 0) { ctx.globalAlpha = Math.min(1, G.flashA); R(ctx, 0, 0, W, H, G.flashCol); ctx.globalAlpha = 1; }
  if (G.fadeA > 0) { ctx.globalAlpha = Math.min(1, G.fadeA); R(ctx, 0, 0, W, H, G.fadeCol); ctx.globalAlpha = 1; }
  if (sc && sc.uiTop) { ctx.save(); sc.uiTop(ctx); ctx.restore(); }
  if (G.paused) Pause.draw(ctx);
  requestAnimationFrame(frame);
}
(function boot() {
  const h = (location.hash || '').slice(1);
  window.__G = G;
  G._switch(SCENES[h] ? h : 'title', {});
  if (SCENES[h] && h !== 'title') { G.fadeA = 1; G.trans = { phase: 'in', t: 0, dur: .6 }; }
  requestAnimationFrame(frame);
})();
