/* Programmatic, restrained instrument audio. AudioContext is created only
   after a user gesture (the sound toggle). */
export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.humGain = null;
    this.humOsc = null;
    this.humOsc2 = null;
    this.filter = null;
    this.noiseBuffer = null;
    this.volume = 0.36;
    this.muted = true;
    this.started = false;
  }

  async init() {
    if (this.ctx) {
      await this.ctx.resume();
      return;
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);

    this.humGain = this.ctx.createGain();
    this.humGain.gain.value = 0;
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 260;
    this.filter.Q.value = 0.8;
    this.humOsc = this.ctx.createOscillator();
    this.humOsc.type = 'sawtooth';
    this.humOsc.frequency.value = 42;
    this.humOsc2 = this.ctx.createOscillator();
    this.humOsc2.type = 'sine';
    this.humOsc2.frequency.value = 84;
    const g1 = this.ctx.createGain(); g1.gain.value = 0.16;
    const g2 = this.ctx.createGain(); g2.gain.value = 0.08;
    this.humOsc.connect(g1).connect(this.filter);
    this.humOsc2.connect(g2).connect(this.filter);
    this.filter.connect(this.humGain).connect(this.master);
    this.humOsc.start();
    this.humOsc2.start();
    this.noiseBuffer = this.makeNoiseBuffer(0.3);
    await this.ctx.resume();
  }

  makeNoiseBuffer(seconds) {
    const len = Math.floor(this.ctx.sampleRate * seconds);
    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
    return buffer;
  }

  async setMuted(muted) {
    this.muted = muted;
    if (!muted) await this.init();
    if (!this.ctx) return;
    const target = muted ? 0 : this.volume * 0.55;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.12);
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, Number(v)));
    if (!this.ctx || this.muted) return;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(this.volume * 0.55, this.ctx.currentTime + 0.1);
  }

  update({ running, speed, closeup = false, reversing = false }) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    const active = running || reversing;
    const targetGain = active ? (closeup ? 0.055 : 0.10) : 0.0;
    const rpm = Math.max(0, speed * 12);
    const f = 34 + rpm * 1.7 + (reversing ? 7 : 0);
    this.humGain.gain.cancelScheduledValues(t);
    this.humGain.gain.linearRampToValueAtTime(targetGain, t + 0.3);
    this.humOsc.frequency.cancelScheduledValues(t);
    this.humOsc.frequency.linearRampToValueAtTime(f, t + 0.4);
    this.humOsc2.frequency.cancelScheduledValues(t);
    this.humOsc2.frequency.linearRampToValueAtTime(f * 2.01, t + 0.4);
    this.filter.frequency.cancelScheduledValues(t);
    this.filter.frequency.linearRampToValueAtTime(180 + rpm * 4.2, t + 0.4);
  }

  _tone({ freq = 880, duration = 0.05, gain = 0.08, type = 'sine', decay = 0.05, delay = 0 }) {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq * 0.68), t0 + duration);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration + decay);
    osc.connect(g).connect(this.master);
    osc.start(t0);
    osc.stop(t0 + duration + decay + 0.01);
  }

  _noiseClick({ gain = 0.055, duration = 0.03, highpass = 900, delay = 0 } = {}) {
    if (!this.ctx || this.muted || !this.noiseBuffer) return;
    const t0 = this.ctx.currentTime + delay;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'highpass';
    bp.frequency.value = highpass;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    src.connect(bp).connect(g).connect(this.master);
    src.start(t0);
    src.stop(t0 + duration + 0.02);
  }

  sampleTick() {
    this._noiseClick({ gain: 0.035, duration: 0.018, highpass: 1800 });
    this._tone({ freq: 1240, duration: 0.012, gain: 0.018, type: 'triangle', decay: 0.02 });
  }

  positionChime() {
    this._tone({ freq: 620, duration: 0.07, gain: 0.032, type: 'sine', decay: 0.18 });
    this._tone({ freq: 930, duration: 0.055, gain: 0.022, type: 'sine', decay: 0.24, delay: 0.075 });
  }

  lockClick() {
    this._noiseClick({ gain: 0.09, duration: 0.025, highpass: 900 });
    this._tone({ freq: 140, duration: 0.04, gain: 0.05, type: 'square', decay: 0.06 });
  }

  completionTone(pass = true) {
    const freqs = pass ? [523.25, 659.25, 783.99] : [392, 392, 311];
    freqs.forEach((f, i) => this._tone({
      freq: f, duration: 0.14, gain: 0.045, type: 'sine', decay: 0.3, delay: i * 0.16,
    }));
  }
}
