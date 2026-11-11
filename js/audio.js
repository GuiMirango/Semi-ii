'use strict';
/* =========================================================
   Áudio 100% sintetizado (WebAudio) — trilha adaptativa chiptune,
   efeitos sonoros e ambiências. Sem arquivos externos.
   ========================================================= */
const AU = {
  ctx: null, master: null, mus: null, musF: null, sfxG: null, muted: false, pendingAmb: null, noiseBuf: null,
  LEVELS: [1, .75, .5, .25, 0], vol: 2,
  gainNow() { return this.LEVELS[this.vol] * .8; },
  setVol(i) { this.vol = (i + this.LEVELS.length) % this.LEVELS.length; this.muted = this.vol === this.LEVELS.length - 1; try { localStorage.setItem('mirango_vol', this.vol); } catch (e) { } if (this.master) this.master.gain.value = this.gainNow(); },
  _silentEl: null,
  iosPlayback() {
    // iPhone no modo silencioso corta o WebAudio: um <audio> mudo em loop muda a sessão para "reprodução"
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { }
    try {
      if (!this._silentEl) {
        const a = this._silentEl = document.createElement('audio');
        a.setAttribute('playsinline', ''); a.loop = true; a.volume = .01;
        const n = 4000, buf = new Uint8Array(44 + n), dv = new DataView(buf.buffer), w = (o, t) => { for (let i = 0; i < t.length; i++) buf[o + i] = t.charCodeAt(i); };
        w(0, 'RIFF'); dv.setUint32(4, 36 + n, true); w(8, 'WAVEfmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
        dv.setUint32(24, 8000, true); dv.setUint32(28, 8000, true); dv.setUint16(32, 1, true); dv.setUint16(34, 8, true); w(36, 'data'); dv.setUint32(40, n, true); buf.fill(128, 44);
        a.src = URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
      }
      const pr = this._silentEl.play(); if (pr && pr.catch) pr.catch(() => { });
    } catch (e) { }
  },
  unlock() {
    this.iosPlayback();
    if (this.ctx) { if (this.ctx.state !== 'running') { const pr = this.ctx.resume(); if (pr && pr.catch) pr.catch(() => { }); } return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    const c = this.ctx = new AC();
    if (c.state !== 'running') { const pr = c.resume(); if (pr && pr.catch) pr.catch(() => { }); }
    // um "clique" inaudível dentro do gesto destrava o áudio em navegadores antigos do iOS
    try { const b = c.createBuffer(1, 1, 22050), s = c.createBufferSource(); s.buffer = b; s.connect(c.destination); s.start(0); } catch (e) { }
    this.master = c.createGain(); this.master.gain.value = this.gainNow(); this.master.connect(c.destination);
    this.musF = c.createBiquadFilter(); this.musF.type = 'lowpass'; this.musF.frequency.value = 18000; this.musF.connect(this.master);
    this.mus = c.createGain(); this.mus.gain.value = .55; this.mus.connect(this.musF);
    this.sfxG = c.createGain(); this.sfxG.gain.value = .8; this.sfxG.connect(this.master);
    const nb = this.noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    // ambiência contínua
    const ns = c.createBufferSource(); ns.buffer = nb; ns.loop = true;
    this.ambF = c.createBiquadFilter(); this.ambF.type = 'lowpass'; this.ambF.frequency.value = 500;
    this.ambG = c.createGain(); this.ambG.gain.value = 0;
    ns.connect(this.ambF); this.ambF.connect(this.ambG); this.ambG.connect(this.master); ns.start();
    this.lfo = c.createOscillator(); this.lfo.frequency.value = .12; this.lfoG = c.createGain(); this.lfoG.gain.value = 0;
    this.lfo.connect(this.lfoG); this.lfoG.connect(this.ambG.gain); this.lfo.start();
    this.hum = c.createOscillator(); this.hum.type = 'sine'; this.hum.frequency.value = 120; this.humG = c.createGain(); this.humG.gain.value = 0;
    this.hum.connect(this.humG); this.humG.connect(this.master); this.hum.start();
    Music.next = c.currentTime + .05;
    this.amb(this.pendingAmb);
  },
  toggleMute() { this.setVol(this.muted ? 2 : this.LEVELS.length - 1); },
  amb(name) {
    this.pendingAmb = name; if (!this.ctx) return;
    const P = {
      office: [600, 'lowpass', .018, 0, .12, 120, .012, 'sine'], city: [520, 'lowpass', .06, .015, .2, 0, 0, 'sine'],
      waves: [800, 'lowpass', .07, .055, .13, 0, 0, 'sine'], bus: [260, 'lowpass', .08, .01, .9, 55, .025, 'sawtooth'],
      night: [420, 'bandpass', .04, .025, .07, 0, 0, 'sine'], house: [180, 'lowpass', .02, 0, .1, 50, .012, 'sine'],
      ring: [300, 'lowpass', .008, 0, .1, 6200, .004, 'sine'], dream: [700, 'lowpass', .03, .02, .09, 0, 0, 'sine']
    }[name] || [500, 'lowpass', 0, 0, .1, 0, 0, 'sine'];
    const t = this.ctx.currentTime;
    this.ambF.type = P[1]; this.ambF.frequency.setTargetAtTime(P[0], t, .3);
    this.ambG.gain.setTargetAtTime(P[2], t, .5); this.lfoG.gain.setTargetAtTime(P[3], t, .5); this.lfo.frequency.value = P[4];
    if (P[5]) { this.hum.type = P[7]; this.hum.frequency.setTargetAtTime(P[5], t, .1); }
    this.humG.gain.setTargetAtTime(P[6], t, .5);
  }
};

function nfreq(n) {
  const m = /^([A-G])(#|b)?(-?\d)$/.exec(n); if (!m) return 0;
  const idx = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  const midi = 12 * (+m[3] + 1) + idx; return 440 * Math.pow(2, (midi - 69) / 12);
}
function tone(f0, f1, dur, type = 'square', vol = .3, delay = 0, dest) {
  const c = AU.ctx; if (!c) return; const t = c.currentTime + delay;
  const o = c.createOscillator(), g = c.createGain(); o.type = type;
  o.frequency.setValueAtTime(Math.max(1, f0), t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  o.connect(g); g.connect(dest || AU.sfxG); o.start(t); o.stop(t + dur + .02);
}
function noise(dur, vol = .3, ft = 'lowpass', f0 = 1000, f1, delay = 0, q = 1, dest) {
  const c = AU.ctx; if (!c) return; const t = c.currentTime + delay;
  const s = c.createBufferSource(); s.buffer = AU.noiseBuf; const f = c.createBiquadFilter(); f.type = ft; f.Q.value = q;
  f.frequency.setValueAtTime(f0, t); if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  s.connect(f); f.connect(g); g.connect(dest || AU.sfxG); s.start(t, Math.random()); s.stop(t + dur + .02);
}
const SFX = {
  jump: () => tone(260, 520, .12, 'square', .07),
  land: () => noise(.06, .12, 'lowpass', 400),
  step: () => noise(.03, .05, 'bandpass', rnd(900, 1400), 0, 0, 2),
  stepSand: () => noise(.06, .06, 'lowpass', 1600),
  dash: () => noise(.18, .15, 'bandpass', 3000, 600, 0, 1.5),
  blip: () => tone(rnd(560, 640), 560, .025, 'square', .025),
  sel: () => tone(660, 660, .05, 'square', .06),
  ok: () => { tone(660, 660, .06, 'square', .07); tone(990, 990, .1, 'square', .07, .06); },
  email: () => { tone(1320, 1320, .25, 'sine', .14); tone(1760, 1760, .35, 'sine', .1, .09); },
  phone: () => { for (let i = 0; i < 6; i++) tone(i % 2 ? 900 : 760, i % 2 ? 900 : 760, .07, 'square', .06, i * .07); },
  print: () => { for (let i = 0; i < 6; i++) noise(.07, .1, 'bandpass', 1800, 0, i * .11, 3); tone(90, 90, .7, 'sawtooth', .03); },
  type: () => noise(.02, .06, 'highpass', 3000),
  ding: () => { tone(1046, 1046, .8, 'sine', .15); tone(1318, 1318, .9, 'sine', .1, .02); },
  door: () => { noise(.5, .06, 'lowpass', 300); tone(70, 60, .5, 'sawtooth', .03); },
  honk: () => { tone(330, 330, .35, 'sawtooth', .07); tone(415, 415, .35, 'sawtooth', .06); },
  screech: () => noise(.6, .1, 'bandpass', 3500, 2400, 0, 8),
  shout: () => { noise(.25, .18, 'bandpass', 900, 500, 0, 2); tone(220, 160, .25, 'sawtooth', .07); },
  punch: () => { noise(.12, .3, 'lowpass', 1200, 200); tone(120, 50, .15, 'sine', .3); },
  ko: () => { tone(150, 30, .9, 'sine', .4); noise(.6, .25, 'lowpass', 800, 100); },
  heart: () => { tone(70, 40, .14, 'sine', .45); tone(66, 38, .14, 'sine', .3, .2); },
  glitch: () => { for (let i = 0; i < 5; i++) tone(rnd(100, 2000), rnd(100, 2000), .04, 'square', .05, i * .04); },
  pum: () => { tone(110, 25, 1.1, 'sine', .55); noise(.8, .4, 'lowpass', 1500, 80); },
  paper: () => noise(.15, .1, 'highpass', 2500, 5000),
  alarm: () => { for (let i = 0; i < 4; i++) tone(2100, 2100, .06, 'square', .06, i * .12); },
  hurt: () => { tone(400, 120, .2, 'square', .1); noise(.1, .12, 'lowpass', 900); },
  coin: () => { tone(988, 988, .07, 'square', .06); tone(1318, 1318, .2, 'square', .06, .07); },
  crack: () => noise(.1, .2, 'highpass', 1500),
  pop: () => { tone(500, 1200, .1, 'sine', .1); noise(.08, .05, 'highpass', 4000); },
  boom: () => { tone(90, 30, .6, 'sine', .4); noise(.4, .3, 'lowpass', 600, 80); },
  swoosh: () => noise(.25, .1, 'bandpass', 600, 2400, 0, 2),
  monkey: () => { tone(700, 1100, .08, 'square', .05); tone(800, 1300, .08, 'square', .05, .12); },
  slurp: () => noise(.4, .08, 'bandpass', 500, 1500, 0, 6),
  gull: () => tone(1500, 1100, .2, 'sawtooth', .025),
  creak: () => tone(180, 120, .7, 'sawtooth', .04),
  click: () => noise(.03, .15, 'highpass', 2000),
  thud: () => { tone(90, 50, .2, 'sine', .3); noise(.1, .15, 'lowpass', 500); },
  notif: () => tone(1567, 1567, .12, 'sine', .07),
  sparkle: () => { tone(1800, 2400, .15, 'sine', .05); tone(2400, 3000, .15, 'sine', .04, .08); },
  crowd: () => noise(1.2, .1, 'bandpass', 1200, 800, 0, .7),
  zip: () => tone(300, 1200, .2, 'triangle', .07),
  brake: () => { noise(.8, .12, 'bandpass', 2800, 1500, 0, 6); tone(60, 40, .8, 'sawtooth', .05); }
};
let _sfxLast = {};
function sfx(n) { if (!AU.ctx || !SFX[n]) return; const now = AU.ctx.currentTime; if (_sfxLast[n] && now - _sfxLast[n] < .03) return; _sfxLast[n] = now; SFX[n](); }

/* ---------- sequenciador de música ---------- */
const rep = (s, n) => Array(n).fill(s).join(' ');
const TRACKS = {
  title: { bpm: 72, ch: [
    { i: 'tri', v: .22, n: [rep('A3 C4 E4 C4', 4), rep('F3 A3 C4 A3', 4), rep('C4 E4 G4 E4', 4), rep('G3 B3 D4 B3', 4)].join(' ') },
    { i: 'sine', v: .3, n: 'A2 - - - - - - - - - - - - - - - F2 - - - - - - - - - - - - - - - C3 - - - - - - - - - - - - - - - G2 - - - - - - - - - - - - - - -' },
    { i: 'sq', v: .05, n: 'E5 - - - . . D5 - C5 - - - . . . . C5 - - - . . A4 - - - . . . . . . G4 - - - . . E5 - D5 - - - . . . . D5 - - - - - - - B4 - - - . . . .' }] },
  office: { bpm: 100, ch: [
    { i: 'pluck', v: .12, n: 'C3 . C3 . G2 . C3 . Eb3 . C3 . G2 . Bb2 . Ab2 . Ab2 . Eb3 . Ab2 . G2 . G2 . D3 . G2 .' },
    { i: 'drum', v: .5, n: 'k . h . . . h . k . h . . . h . k . h . . . h . k . h . . . h h' },
    { i: 'tri', v: .14, n: 'G4 . . . Eb4 . . . F4 . G4 . . . . . Ab4 . . . G4 . . . F4 . Eb4 . D4 . . .' }] },
  rage: { bpm: 150, ch: [
    { i: 'saw', v: .1, n: 'E2 . E2 . E2 . G2 . A2 . A2 . G2 . F#2 . E2 . E2 . D2 . D2 . C2 . C2 . D2 . B1 .' },
    { i: 'drum', v: .6, n: 'k . h . s . h . k . k . s . h . k . h . s . h . k k . . s . s s' },
    { i: 'sq', v: .06, n: 'E4 - G4 - A4 - B4 - D5 - B4 - A4 - G4 - E4 - - - D4 - - - B3 - - - D4 - E4 -' }] },
  fight: { bpm: 168, ch: [
    { i: 'saw', v: .09, n: 'A2 . A3 . A2 . A3 . G2 . G3 . G2 . G3 . F2 . F3 . F2 . F3 . E2 . E3 . E2 . G#2 .' },
    { i: 'drum', v: .6, n: 'k . h . s . h . k . h k s . h . k . h . s . h . k k h . s . s s' },
    { i: 'sq', v: .06, n: 'A4 - - C5 - - E5 - D5 - C5 - B4 - G4 - A4 - - - - - E4 - F4 - G#4 - B4 - E5 -' }] },
  bus: { bpm: 108, ch: [
    { i: 'tri', v: .2, n: 'D3 . . D3 . . F3 . G3 . . A3 . . C4 . G2 . . G2 . . B2 . C3 . . D3 . . C3 .' },
    { i: 'drum', v: .45, n: 'k . h . s . h k . . h . s . h . k . h . s . h k . . h . s . s h' },
    { i: 'pluck', v: .08, n: 'A4 . C5 . D5 . . . F5 . E5 . D5 . C5 . B4 . . . A4 . G4 . A4 - - - . . . .' }] },
  calm: { bpm: 76, ch: [
    { i: 'tri', v: .18, n: [rep('F3 A3 C4 E4 F4 E4 C4 A3', 2), rep('Bb2 D3 F3 A3 Bb3 A3 F3 D3', 2), rep('G2 Bb2 D3 F3 G3 F3 D3 Bb2', 2), rep('C3 E3 G3 Bb3 C4 Bb3 G3 E3', 2)].join(' ') },
    { i: 'sine', v: .14, n: 'A4 - - - - - - - C5 - - - A4 - G4 - F4 - - - - - - - D4 - - - . . . . G4 - - - Bb4 - - - A4 - - - G4 - - - E4 - - - - - - - - - - - . . . .' }] },
  beach: { bpm: 116, ch: [
    { i: 'tri', v: .22, n: 'C3 . . C3 . . G2 . C3 . . . G2 . . . A2 . . A2 . . E2 . A2 . . . E2 . . . F2 . . F2 . . C3 . F2 . . . C3 . . . G2 . . G2 . . D3 . G2 . . . B2 . . .' },
    { i: 'pluck', v: .07, n: [rep('C4 . E4 G4 . E4 C4 .', 2), rep('A3 . C4 E4 . C4 A3 .', 2), rep('F3 . A3 C4 . A3 F3 .', 2), rep('G3 . B3 D4 . B3 G3 .', 2)].join(' ') },
    { i: 'sq', v: .05, n: 'E5 - G5 - E5 - D5 - C5 - - - . . . . C5 - E5 - C5 - B4 - A4 - - - . . . . A4 - C5 - F5 - E5 - D5 - C5 - A4 - . . B4 - D5 - G5 - F5 - E5 - D5 - B4 - G4 -' },
    { i: 'drum', v: .4, n: 'k . . h s . . h k . k h s . . h' }] },
  dream: { bpm: 84, ch: [
    { i: 'pad', v: .12, n: 'C4 - - - D4 - - - E4 - - - F#4 - - - G#4 - - - A#4 - - - G#4 - - - E4 - - -' },
    { i: 'sine', v: .07, n: '. . C6 . . . . . . . G#5 . . . . . . . . . A#5 . . . . . . . D6 . . .' },
    { i: 'sine', v: .2, n: 'C2 - - - - - - - - - - - - - - - F#2 - - - - - - - - - - - - - - -' }] },
  night: { bpm: 56, ch: [
    { i: 'drum', v: .5, n: 'k . k . . . . . . . . . . . . .' },
    { i: 'pad', v: .1, n: 'D3 - - - - - - - F3 - - - - - - - C3 - - - - - - - A2 - - - - - - -' },
    { i: 'sine', v: .07, n: '. . . . A4 - - - . . . . G4 - F4 - . . . . E4 - - - - - - - . . . .' }] },
  house: { bpm: 48, ch: [
    { i: 'sine', v: .2, n: 'D2 - - - - - - - - - - - - - - - Eb2 - - - - - - - - - - - - - - -' },
    { i: 'pad', v: .06, n: 'A3 - - - - - - - Bb3 - - - - - - - A3 - - - - - - - G#3 - - - - - - -' },
    { i: 'drum', v: .35, n: 'k . k . . . . . . . . . . . . .' }] },
  end: { bpm: 66, ch: [
    { i: 'box', v: .09, n: 'A5 . E5 . C5 . E5 . A5 . B5 . C6 . B5 . G5 . E5 . C5 . E5 . G5 . A5 . B5 . G5 . F5 . C5 . A4 . C5 . F5 . G5 . A5 . G5 . E5 . B4 . G#4 . B4 . E5 - - - . . . .' },
    { i: 'sine', v: .2, n: 'A2 - - - - - - - - - - - - - - - C3 - - - - - - - - - - - - - - - F2 - - - - - - - - - - - - - - - E2 - - - - - - - - - - - - - - -' }] },
  street: { bpm: 88, ch: [
    { i: 'pluck', v: .1, n: 'C3 . . C3 . . G2 . Bb2 . . Bb2 . . F2 . Ab2 . . Ab2 . . Eb2 . G2 . . G2 . . D2 .' },
    { i: 'drum', v: .4, n: 'k . h . . . h . k . h . . . h . k . h . . . h . k . h . . . h h' }] }
};
for (const k in TRACKS) for (const ch of TRACKS[k].ch) ch.tok = ch.n.trim().split(/\s+/);
const Music = {
  name: null, cur: null, step: 0, next: 0, tempo: 1,
  play(name) {
    if (this.name === name) return;
    this.name = name; this.cur = TRACKS[name] || null; this.step = 0; this.tempo = 1;
    if (AU.ctx) { this.next = AU.ctx.currentTime + .08; this.muffle(18000); }
  },
  muffle(f) { if (AU.ctx) AU.musF.frequency.setTargetAtTime(f, AU.ctx.currentTime, .3); },
  tick() {
    const c = AU.ctx; if (!c || !this.cur || c.state !== 'running') return;
    const tr = this.cur, spb = 60 / (tr.bpm * this.tempo) / 4;
    if (this.next < c.currentTime - .5) this.next = c.currentTime + .02;
    while (this.next < c.currentTime + .12) {
      for (const ch of tr.ch) {
        const tk = ch.tok[this.step % ch.tok.length];
        if (tk === '.' || tk === '-') continue;
        let len = 1; while (ch.tok[(this.step + len) % ch.tok.length] === '-' && len < 32) len++;
        this.note(ch, tk, this.next, len * spb);
      }
      this.step++; this.next += spb;
    }
  },
  note(ch, tk, t, dur) {
    const c = AU.ctx, out = AU.mus;
    if (ch.i === 'drum') {
      for (const d of tk) {
        if (d === 'k') { const o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(40, t + .12); g.gain.setValueAtTime(ch.v * 1.4, t); g.gain.exponentialRampToValueAtTime(.001, t + .16); o.connect(g); g.connect(out); o.start(t); o.stop(t + .2); }
        else if (d === 's' || d === 'h' || d === 'o') {
          const s = c.createBufferSource(); s.buffer = AU.noiseBuf; const f = c.createBiquadFilter(); f.type = d === 's' ? 'bandpass' : 'highpass'; f.frequency.value = d === 's' ? 1800 : 7000;
          const g = c.createGain(); const L = d === 's' ? .13 : d === 'o' ? .15 : .03; g.gain.setValueAtTime(ch.v * (d === 's' ? .8 : .25), t); g.gain.exponentialRampToValueAtTime(.001, t + L);
          s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random()); s.stop(t + L + .02);
        }
      }
      return;
    }
    const f = nfreq(tk); if (!f) return;
    const o = c.createOscillator(), g = c.createGain();
    const type = { sq: 'square', pluck: 'square', tri: 'triangle', saw: 'sawtooth', sine: 'sine', pad: 'triangle', box: 'sine' }[ch.i] || 'square';
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (ch.i === 'pad') o.detune.value = rnd(-12, 12);
    const v = ch.v;
    if (ch.i === 'pluck' || ch.i === 'box') { g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + Math.min(.6, dur + .25)); }
    else {
      const a = ch.i === 'pad' ? Math.min(.3, dur * .4) : .01;
      g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(v, t + a);
      g.gain.setValueAtTime(v, t + Math.max(a, dur * .8)); g.gain.exponentialRampToValueAtTime(.001, t + dur + .05);
    }
    o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + .7);
  }
};

// volume salvo + destrava o áudio no primeiro gesto de qualquer tipo (toque, clique, tecla), inclusive dentro de iframe
try { const v = localStorage.getItem('mirango_vol'); if (v != null) AU.setVol(+v); } catch (e) { }
['touchstart', 'touchend', 'pointerdown', 'mousedown', 'click', 'keydown'].forEach(ev => document.addEventListener(ev, () => AU.unlock(), { capture: true, passive: true }));
document.addEventListener('visibilitychange', () => { if (!document.hidden && AU.ctx && AU.ctx.state !== 'running') AU.ctx.resume().catch(() => { }); });
