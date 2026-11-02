// Web Audio crowd/ceremony engine + Web Speech commentary. No audio files required.
let ctx = null, master = null, noiseBuf = null, crowd = null, crowdOn = true, base = 0.3;

const makeNoise = (c) => {
  const len = c.sampleRate * 3, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
  return buf;
};

export const AudioFX = {
  init() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
      noiseBuf = makeNoise(ctx);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  },
  crowdStart() {
    if (!ctx || crowd) return;
    const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 180;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 520; bp.Q.value = 0.6;
    const g = ctx.createGain(); g.gain.value = crowdOn ? base : 0;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.17;
    const lg = ctx.createGain(); lg.gain.value = 0.06; lfo.connect(lg); lg.connect(g.gain);
    src.connect(hp); hp.connect(bp); bp.connect(g); g.connect(master);
    src.start(); lfo.start();
    crowd = { src, lfo, bp, g };
  },
  setBase(v) {
    base = v;
    if (!ctx || !crowd || !crowdOn) return;
    const t = ctx.currentTime; crowd.g.gain.cancelScheduledValues(t);
    crowd.g.gain.setValueAtTime(crowd.g.gain.value, t); crowd.g.gain.linearRampToValueAtTime(v, t + 1.2);
  },
  setCrowd(on) {
    crowdOn = on;
    if (!ctx || !crowd) return;
    crowd.g.gain.setTargetAtTime(on ? base : 0, ctx.currentTime, 0.15);
  },
  swell(peak = 1.4, secs = 3, bright = 900) {
    if (!ctx || !crowd || !crowdOn) return;
    const t = ctx.currentTime, g = crowd.g.gain, f = crowd.bp.frequency;
    g.cancelScheduledValues(t); g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(peak, t + 0.25); g.linearRampToValueAtTime(base, t + secs);
    f.cancelScheduledValues(t); f.setValueAtTime(f.value, t);
    f.linearRampToValueAtTime(bright, t + 0.25); f.linearRampToValueAtTime(520, t + secs);
  },
  cheer(kind) {
    if (kind === 'six') { this.swell(2.2, 4.8, 1250); this.drums(8); }
    else if (kind === 'four') { this.swell(1.6, 3.4, 950); this.drums(4); }
    else if (kind === 'wicket') this.swell(1.8, 3.6, 700);
    else if (kind === 'win') { this.swell(2.4, 7, 1200); this.drums(12); }
  },
  groan() { this.swell(0.75, 1.7, 320); },
  hit(q = 0.7) {
    if (!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'triangle';
    o.frequency.setValueAtTime(230, t); o.frequency.exponentialRampToValueAtTime(70, t + 0.09);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.25 + 0.4 * q, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.14);
    const n = ctx.createBufferSource(); n.buffer = noiseBuf;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1800;
    const ng = ctx.createGain(); ng.gain.setValueAtTime(0.5 * q, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    n.connect(hp); hp.connect(ng); ng.connect(master); n.start(t, Math.random()); n.stop(t + 0.06);
  },
  drums(n = 6) {
    if (!ctx) return;
    const t0 = ctx.currentTime + 0.1;
    for (let i = 0; i < n; i++) {
      const t = t0 + i * 0.27 + (i % 2 ? 0.05 : 0);
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(i % 3 === 2 ? 170 : 120, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.18);
      const g = ctx.createGain(); g.gain.setValueAtTime(0.55, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.24);
    }
  },
  // Stately synthesized pad (C–F–G–C) used when no anthem audio file is present.
  ceremony(seconds = 14) {
    if (!ctx) return () => {};
    const t0 = ctx.currentTime + 0.05, nodes = [];
    const chords = [[261.6, 329.6, 392], [349.2, 440, 523.3], [392, 493.9, 587.3], [261.6, 329.6, 392, 523.3]];
    const step = seconds / chords.length;
    chords.forEach((ch, i) => ch.forEach((f) => {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
      const g = ctx.createGain(), s = t0 + i * step;
      g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(0.045, s + 0.7);
      g.gain.setValueAtTime(0.045, s + step - 0.5); g.gain.linearRampToValueAtTime(0, s + step + 0.25);
      o.connect(lp); lp.connect(g); g.connect(master); o.start(s); o.stop(s + step + 0.3); nodes.push(o);
    }));
    return () => nodes.forEach((o) => { try { o.stop(); } catch { /* already stopped */ } });
  },
  // Optional real anthem audio: drop client/public/audio/anthems/<CODE>.mp3 (e.g. IND.mp3) with audio you have rights to use.
  async loadAnthem(code) {
    try {
      const url = `/audio/anthems/${code}.mp3`;
      const r = await fetch(url, { method: 'HEAD' });
      if (!r.ok || !(r.headers.get('content-type') || '').startsWith('audio')) return null;
      return new Audio(url);
    } catch { return null; }
  },
  stopAll() {
    if (!crowd) return;
    try { crowd.src.stop(); crowd.lfo.stop(); } catch { /* noop */ }
    crowd = null;
  },
};

const CODES = { en: 'en-IN', ta: 'ta-IN', hi: 'hi-IN' };
const norm = (v) => v.lang.replace('_', '-').toLowerCase();

export const Speech = {
  enabled: true,
  supported: () => typeof window !== 'undefined' && 'speechSynthesis' in window,
  voice(lang) {
    if (!Speech.supported()) return null;
    const vs = window.speechSynthesis.getVoices(), code = CODES[lang].toLowerCase();
    return vs.find((v) => norm(v) === code) || vs.find((v) => norm(v).startsWith(code.slice(0, 2))) || null;
  },
  speak(text, lang, queue = false) {
    if (!Speech.enabled || !Speech.supported()) return;
    const s = window.speechSynthesis;
    if (!queue) s.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = CODES[lang]; const v = Speech.voice(lang); if (v) u.voice = v;
    u.rate = lang === 'en' ? 1.03 : 0.95; u.pitch = 1; u.volume = 1;
    s.speak(u);
  },
  cancel() { if (Speech.supported()) window.speechSynthesis.cancel(); },
};
