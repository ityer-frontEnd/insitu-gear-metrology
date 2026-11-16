import { CFG } from './config.js';
import { clamp, damp, easeInOutCubic, lerp, mulberry32 } from './utils.js';

const LENGTH = CFG.scan.length;
const TOL = CFG.gear.ff * 1000;       // 45 μm
const U = CFG.machine.U;              // 9.6 μm (k=2)
const ALPHA = CFG.reversal.angle;     // 22.45°
const DENSE = 513;

const STEP_ORDER = ['position', 'approach', 'scan', 'retract', 'reverse', 'done'];

function presetTargets(preset, seed) {
  if (preset === 'fail') {
    return { left: 67 + (seed % 5) * 0.9, right: 71 + (seed % 4) * 1.3, shape: 'fail' };
  }
  if (preset === 'random') {
    const rand = mulberry32(seed);
    return {
      left: 29 + rand() * 38,
      right: 29 + rand() * 38,
      shape: 'random',
      phases: [rand() * 6.28, rand() * 6.28, rand() * 6.28, rand() * 6.28],
    };
  }
  return { left: 29.5 + (seed % 3) * 0.7, right: 32.2 + (seed % 2) * 0.8, shape: 'pass' };
}

function makeErrorSignal(face, targetFF, shape, seed) {
  const rand = mulberry32(seed + (face === 'right' ? 57 : 13));
  const p = [rand() * 6.283, rand() * 6.283, rand() * 6.283, rand() * 6.283];
  const weights = shape === 'fail'
    ? [0.38, 0.28, 0.20, 0.14]
    : [0.56, 0.24, 0.13, 0.07];
  const values = new Float32Array(DENSE);
  for (let i = 0; i < DENSE; i++) {
    const s = (i / (DENSE - 1)) * LENGTH;
    const t = (s / LENGTH) * Math.PI * 2;
    let v = 0;
    v += Math.sin(t * 1.03 + p[0]) * weights[0];
    v += Math.sin(t * 2.61 + p[1]) * weights[1];
    v += Math.sin(t * 5.77 + p[2] + 0.5) * weights[2];
    v += Math.sin(t * 11.9 + p[3]) * weights[3];
    v += Math.sin(t * 0.43 + p[1] * 0.7) * 0.06;
    if (shape === 'fail') {
      // A broad local hollow is a characteristic profile-form error, still smooth.
      const c = 0.56 + 0.06 * Math.sin(p[0]);
      v -= Math.exp(-Math.pow((s / LENGTH - c) / 0.22, 2)) * 0.16;
    }
    values[i] = v;
  }
  let min = Infinity, max = -Infinity;
  for (const v of values) { if (v < min) min = v; if (v > max) max = v; }
  const span = max - min || 1;
  for (let i = 0; i < DENSE; i++) {
    values[i] = ((values[i] - min) / span - 0.5) * targetFF;
  }
  return values;
}

function classifyFF(ff) {
  if (ff == null || !Number.isFinite(ff)) {
    return { tone: 'idle', label: '等待扫描数据' };
  }
  if (ff <= TOL - U) return { tone: 'pass', label: '合格 · 位于复检裕度之外' };
  if (ff <= TOL + U) return { tone: 'warn', label: '临界 · 建议复检' };
  return { tone: 'fail', label: '超差 · ff 超出公差带' };
}

export class MeasurementEngine {
  constructor() {
    this.speed = CFG.scan.defaultSpeed;
    this.sampleCount = CFG.scan.defaultSamples;
    this.preset = 'pass';
    this.seed = 20261115;
    this.forceN = 0.3;
    this.magnify = 500;
    this.time = 0;
    this.slowPresentation = false;

    this.signals = {};
    this.faceTargets = {};
    this.regenerateSignals();

    this.mode = 'idle';          // idle, positioning, approach, scanning, retract, reversing, done
    this.paused = false;
    this.pausedMode = null;
    this.positioned = false;
    this.userCoarse = 34;        // mm, idle coarse carriage coordinate
    this.xCoarse = 34;
    this.ballDrop = 0;
    this.alpha = ALPHA;
    this.alphaTarget = ALPHA;
    this.face = 'left';
    this.nextFace = null;
    this.stageS = 0;
    this.motorAngle = 0;
    this.stateT = 0;
    this.reverseStartAlpha = ALPHA;
    this.reverseEndAlpha = ALPHA;
    this.reverseFromMode = 'idle';
    this.autoRun = false;
    this.completedSteps = new Set();
    this.activeStep = null;
    this.pinLocked = true;
    this._stepSerial = 0;
    this._dataSerial = 0;
    this._sampleSerial = 0;
    this.lastNewSample = null;
    this.resetFaceData('left');
    this.resetFaceData('right');
    this.refreshStep();
  }

  regenerateSignals() {
    const targets = presetTargets(this.preset, this.seed);
    this.faceTargets = targets;
    for (const face of ['left', 'right']) {
      const target = face === 'left' ? targets.left : targets.right;
      this.signals[face] = makeErrorSignal(face, target, targets.shape, this.seed);
    }
    for (const face of ['left', 'right']) {
      if (!this.faces?.[face]) continue;
      this.faces[face].complete = false;
      this.faces[face].ff = null;
      this.faces[face].classification = classifyFF(null);
      this.faces[face].samples = [];
      this.faces[face].nextIndex = 0;
    }
    this._dataSerial++;
  }

  resetFaceData(face) {
    this.faces = this.faces || {};
    this.faces[face] = {
      samples: [], nextIndex: 0, complete: false,
      ff: null, classification: classifyFF(null), targetFF: face === 'left' ? this.faceTargets.left : this.faceTargets.right,
    };
  }

  reset(hard = true) {
    this.mode = 'idle';
    this.paused = false;
    this.pausedMode = null;
    this.positioned = false;
    this.xCoarse = 34;
    this.userCoarse = 34;
    this.ballDrop = 0;
    this.face = 'left';
    this.nextFace = null;
    this.stageS = 0;
    this.motorAngle = 0;
    this.alphaTarget = ALPHA;
    this.stateT = 0;
    this.autoRun = false;
    this.completedSteps.clear();
    this.activeStep = null;
    this.pinLocked = false;
    this._sampleSerial = 0;
    this.lastNewSample = null;
    this.resetFaceData('left');
    this.resetFaceData('right');
    if (hard) {
      this.alpha = ALPHA;
    }
    this.refreshStep();
    this._dataSerial++;
  }

  setSpeed(v) {
    this.speed = clamp(Number(v) || CFG.scan.defaultSpeed, CFG.scan.minSpeed, CFG.scan.maxSpeed);
  }

  setSampleCount(n) {
    const next = clamp(Math.round(Number(n) || CFG.scan.defaultSamples), CFG.scan.minSamples, CFG.scan.maxSamples);
    if (next === this.sampleCount) return;
    this.sampleCount = next;
    // Rebuilding keeps the current physical displacement visible and consistent.
    if (this.mode === 'scanning' || (this.paused && (this.pausedMode === 'scanning'))) {
      this.rebuildFaceUpTo(this.face, this.stageS, false);
    } else if (!this.isActive()) {
      for (const f of ['left', 'right']) {
        if (!this.faces[f].complete) this.resetFaceData(f);
      }
      this._dataSerial++;
    }
  }

  setPreset(preset) {
    if (!['pass', 'fail', 'random'].includes(preset)) return;
    this.preset = preset;
    if (preset === 'random') this.seed = (this.seed * 1664525 + 1013904223) >>> 0;
    this.regenerateSignals();
    this.reset(true);
  }

  setForce(v) {
    this.forceN = clamp(Number(v) || 0.3, CFG.machine.forceMin, CFG.machine.forceMax);
  }

  setUserCoarse(v) {
    this.userCoarse = clamp(Number(v), 0, 80);
  }

  isActive() {
    return ['positioning', 'approach', 'scanning', 'retract', 'reversing'].includes(this.mode);
  }

  get isRunning() {
    return this.isActive() && !this.paused;
  }

  start() {
    if (this.isActive() && !this.paused) return { ok: false, reason: '测量正在运行' };
    if (this.paused) {
      this.paused = false;
      this.mode = this.pausedMode;
      this.pausedMode = null;
      return { ok: true, resumed: true };
    }
    if (this.mode === 'positioning' || this.mode === 'reversing') return { ok: false, reason: '机构正在动作' };
    this.clearMeasurementData();
    this.autoRun = true;
    this.paused = false;
    this.face = 'left';
    this.nextFace = null;
    this.stageS = 0;
    this.alphaTarget = ALPHA;
    this.completedSteps.clear();
    this.completedSteps.add('done'); // ignored until done; convenient removal below
    this.completedSteps.delete('done');
    this.activeStep = null;
    this.stateT = 0;
    this.pinLocked = false;
    if (this.positioned) {
      this.mode = 'approach';
      this.xCoarse = Math.max(this.xCoarse, 55);
    } else {
      this.mode = 'positioning';
      this.xCoarse = Math.min(this.xCoarse, 34);
    }
    this.refreshStep();
    return { ok: true };
  }

  pauseToggle() {
    if (!this.isActive()) return { ok: false, reason: '当前没有进行中的测量' };
    if (!this.paused) {
      this.paused = true;
      this.pausedMode = this.mode;
      this.pinLocked = true;
    } else {
      this.paused = false;
      this.mode = this.pausedMode || this.mode;
      this.pausedMode = null;
    }
    return { ok: true, paused: this.paused };
  }

  emergencyStop() {
    if (this.isActive()) {
      this.paused = true;
      this.pausedMode = this.mode;
    }
    this.pinLocked = true;
    return { ok: true };
  }

  clearMeasurementData() {
    this.resetFaceData('left');
    this.resetFaceData('right');
    this._dataSerial++;
    this._sampleSerial = 0;
    this.lastNewSample = null;
  }

  positionOnly() {
    if (this.isActive()) return { ok: false, reason: '测量正在运行' };
    this.autoRun = false;
    this.paused = false;
    this.mode = 'positioning';
    this.stateT = 0;
    this.activeStep = null;
    this.completedSteps.clear();
    this.pinLocked = false;
    this.refreshStep();
    return { ok: true };
  }

  manualReverseTo(targetFace = null) {
    if (this.isActive()) return { ok: false, reason: '测量进行中，换向由流程自动完成' };
    if (this.mode === 'positioning') return { ok: false, reason: '定位进行中' };
    const nf = targetFace || (this.face === 'left' ? 'right' : 'left');
    if (nf === this.face && this.mode !== 'reversing') {
      return { ok: true, already: true };
    }
    this.reverseFromMode = this.mode === 'done' ? 'done' : 'idle';
    this.mode = 'reversing';
    this.autoRun = false;
    this.nextFace = nf;
    this.reverseStartAlpha = this.alpha;
    this.reverseEndAlpha = nf === 'left' ? ALPHA : -ALPHA;
    this.alphaTarget = this.reverseEndAlpha;
    this.stateT = 0;
    this.pinLocked = false;
    this.activeStep = null;
    this.refreshStep();
    return { ok: true };
  }

  seek(value) {
    const s = clamp(Number(value), 0, LENGTH);
    if (this.isActive() && !this.paused) {
      this.paused = true;
      this.pausedMode = this.mode;
    }
    this.stageS = s;
    this.motorAngle = this.computeMotorAngle(s);
    if (this.mode === 'scanning' || (this.paused && this.pausedMode === 'scanning')) {
      const faceData = this.faces[this.face];
      if (!faceData.complete) {
        this.rebuildFaceUpTo(this.face, s, false);
      }
    }
    return s;
  }

  computeMotorAngle(s = this.stageS) {
    return (s / CFG.drive.screwPitch) * Math.PI * 2;
  }

  collectSamplesTo(face, s) {
    const data = this.faces[face];
    const N = this.sampleCount;
    while (data.nextIndex < N) {
      const i = data.nextIndex;
      const targetS = (i / (N - 1)) * LENGTH;
      if (targetS > s + 1e-7) break;
      const e = this.errorAt(face, targetS);
      const sample = { s: targetS, e, i, born: performance.now() / 1000 };
      data.samples.push(sample);
      this.lastNewSample = { ...sample, face };
      this._sampleSerial++;
      data.nextIndex++;
    }
    if (data.samples.length >= 2) {
      let min = Infinity, max = -Infinity;
      for (const sp of data.samples) { if (sp.e < min) min = sp.e; if (sp.e > max) max = sp.e; }
      data.ff = max - min;
      data.classification = classifyFF(data.ff);
    }
  }

  rebuildFaceUpTo(face, s, complete = false) {
    const data = this.faces[face];
    data.samples = [];
    data.nextIndex = 0;
    data.complete = false;
    data.ff = null;
    data.classification = classifyFF(null);
    this.collectSamplesTo(face, s);
    if (complete) {
      data.complete = true;
    }
    this._dataSerial++;
  }

  finishFace() {
    const data = this.faces[this.face];
    // ensure last sample exists even if floating point ends a hair short
    this.collectSamplesTo(this.face, LENGTH + 1e-5);
    data.complete = true;
    data.ff = data.samples.length ? Math.max(...data.samples.map(p => p.e)) - Math.min(...data.samples.map(p => p.e)) : 0;
    data.classification = classifyFF(data.ff);
    this._dataSerial++;
  }

  errorAt(face, s) {
    const values = this.signals[face];
    const x = clamp(s, 0, LENGTH) / LENGTH * (DENSE - 1);
    const i0 = Math.floor(x);
    const i1 = Math.min(DENSE - 1, i0 + 1);
    const f = x - i0;
    return values[i0] * (1 - f) + values[i1] * f;
  }

  highPassAt(face, s) {
    const center = this.errorAt(face, s);
    let mean = 0;
    const n = 9, span = 3.0;
    for (let i = 0; i < n; i++) {
      mean += this.errorAt(face, clamp(s + (i / (n - 1) - 0.5) * span, 0, LENGTH));
    }
    mean /= n;
    return center - mean;
  }

  getCurrentError() {
    return this.errorAt(this.face, this.stageS);
  }

  getResult() {
    const left = this.faces.left;
    const right = this.faces.right;
    const anyComplete = left.complete || right.complete;
    if (!anyComplete) return { tone: 'idle', label: '等待扫描数据' };
    const tones = [left.classification.tone, right.classification.tone];
    let tone = 'pass';
    if (tones.includes('fail')) tone = 'fail';
    else if (tones.includes('warn')) tone = 'warn';
    let label = '合格 · 双齿面均通过';
    if (tone === 'fail') label = '超差 · 至少一个齿面超出公差';
    else if (tone === 'warn') label = '临界 · 建议复检';
    else if (!(left.complete && right.complete)) label = '扫描中 · 当前齿面数据生长';
    return {
      tone, label,
      left: left.complete ? left.ff : (left.samples.length > 2 ? left.ff : null),
      right: right.complete ? right.ff : (right.samples.length > 2 ? right.ff : null),
    };
  }

  beginScanning() {
    this.mode = 'scanning';
    this.stateT = 0;
    this.stageS = 0;
    this.motorAngle = 0;
    this.resetFaceData(this.face);
    this.faces[this.face].targetFF = this.face === 'left' ? this.faceTargets.left : this.faceTargets.right;
    this.faces[this.face].nextIndex = 0;
    this._dataSerial++;
    this.collectSamplesTo(this.face, 0);
    this.completedSteps.add('approach');
    this.completedSteps.add('position');
    this.refreshStep();
  }

  beginReversal(nextFace, returnMode, auto) {
    this.mode = 'reversing';
    this.nextFace = nextFace;
    this.reverseStartAlpha = this.alpha;
    this.reverseEndAlpha = nextFace === 'left' ? ALPHA : -ALPHA;
    this.alphaTarget = this.reverseEndAlpha;
    this.reverseFromMode = returnMode;
    this.autoRun = auto;
    this.stateT = 0;
    this.pinLocked = false;
    this.stageS = 0;
    this.motorAngle = 0;
    this.refreshStep();
  }

  finishReversal() {
    const next = this.nextFace;
    this.face = next;
    this.nextFace = null;
    this.alpha = this.alphaTarget;
    this.pinLocked = true;
    if (this.autoRun && next === 'right') {
      this.mode = 'approach';
      this.stateT = 0;
      this.stageS = 0;
      this.completedSteps.add('reverse');
      this.completedSteps.add('retract');
    } else {
      this.mode = this.reverseFromMode === 'done' ? 'done' : 'idle';
      this.stateT = 0;
      this.completedSteps.add('reverse');
      this._dataSerial++;
    }
    this.refreshStep();
  }

  refreshStep() {
    if (this.mode === 'positioning') this.activeStep = 'position';
    else if (this.mode === 'approach') this.activeStep = 'approach';
    else if (this.mode === 'scanning') this.activeStep = 'scan';
    else if (this.mode === 'retract') this.activeStep = 'retract';
    else if (this.mode === 'reversing') this.activeStep = 'reverse';
    else if (this.mode === 'done') this.activeStep = 'done';
    else if (this.mode === 'idle' && this.paused) this.activeStep = this.pausedMode === 'scanning' ? 'scan' : null;
    else this.activeStep = null;
  }

  markStepDone(step) {
    this.completedSteps.add(step);
  }

  update(dt) {
    if (this.paused || dt <= 0) {
      this.pinLocked = this.mode === 'reversing' ? this.pinLocked : true;
      return;
    }
    this.time += dt;
    const targetX = (() => {
      if (this.mode === 'positioning') return 58;
      if (this.mode === 'approach' || this.mode === 'scanning') return 60;
      if (this.mode === 'retract' || this.mode === 'reversing') return 55;
      if (this.mode === 'done') return 60;
      return this.userCoarse;
    })();
    this.xCoarse = damp(this.xCoarse, targetX, 4.2, dt);

    const shouldBePositioned = this.positioned || this.mode === 'done' || this.mode === 'scanning' || this.mode === 'retract';
    const dropTarget = (this.mode === 'idle' && !this.positioned) ? 0 : (shouldBePositioned || this.activeStep === 'position' ? 1 : 0);
    this.ballDrop = damp(this.ballDrop, dropTarget, 3.6, dt);

    if (this.mode === 'reversing') {
      this.stateT += dt;
      const duration = 2.25;
      const u = clamp(this.stateT / duration, 0, 1);
      const eased = easeInOutCubic(u);
      this.alpha = lerp(this.reverseStartAlpha, this.reverseEndAlpha, eased);
      this.pinLocked = u > 0.9 && Math.abs(this.alpha - this.reverseEndAlpha) < 0.35;
      if (u >= 1) this.finishReversal();
      this.pinLocked = this.mode === 'reversing' ? this.pinLocked : true;
    } else {
      this.alphaTarget = this.face === 'left' ? ALPHA : -ALPHA;
      this.alpha = damp(this.alpha, this.alphaTarget, 4.2, dt);
      this.pinLocked = Math.abs(this.alpha - this.alphaTarget) < 0.06;
    }

    if (this.mode === 'positioning') {
      this.stateT += dt;
      if (this.stateT >= 2.2) {
        this.positioned = true;
        this.completedSteps.add('position');
        if (this.autoRun) {
          this.mode = 'approach';
          this.stateT = 0;
        } else {
          this.mode = 'idle';
          this.stateT = 0;
        }
        this.refreshStep();
      }
    } else if (this.mode === 'approach') {
      this.stateT += dt;
      this.stageS = 0;
      if (this.stateT >= 0.75) {
        this.completedSteps.add('approach');
        this.beginScanning();
      }
    } else if (this.mode === 'scanning') {
      const prev = this.stageS;
      this.stageS = Math.min(LENGTH, this.stageS + this.speed * dt);
      this.motorAngle = this.computeMotorAngle(this.stageS);
      this.collectSamplesTo(this.face, this.stageS);
      if (this.stageS >= LENGTH - 1e-7 && prev < LENGTH) {
        this.finishFace();
        this.completedSteps.add('scan');
        if (this.face === 'left' && this.autoRun) {
          this.mode = 'retract';
          this.stateT = 0;
          this.refreshStep();
        } else {
          this.mode = 'done';
          this.stateT = 0;
          this.finishFace();
          this.completedSteps.add('retract');
          this.completedSteps.add('reverse');
          this.completedSteps.add('done');
          this.activeStep = 'done';
          this.pinLocked = true;
          this._dataSerial++;
          this.refreshStep();
        }
      }
    } else if (this.mode === 'retract') {
      this.stateT += dt;
      this.stageS = Math.max(0, this.stageS - this.speed * 4.0 * dt);
      this.motorAngle = this.computeMotorAngle(this.stageS);
      if (this.stageS <= 0 && this.stateT > 0.2) {
        this.completedSteps.add('retract');
        if (this.autoRun) {
          this.beginReversal('right', 'idle', true);
        } else {
          this.mode = 'idle';
          this.stateT = 0;
          this.refreshStep();
        }
      }
    }
    if (this.mode === 'scanning') {
      // Sample lights are authored from the sample list; this timestamp keeps
      // the renderer from having to diff whole arrays every frame.
      this._dataSerial += 0;
    }
    this.refreshStep();
  }

  getSnapshot() {
    const left = this.faces.left;
    const right = this.faces.right;
    const result = this.getResult();
    const active = this.paused ? this.pausedMode : this.mode;
    return {
      mode: this.mode,
      activeMode: active,
      paused: this.paused,
      face: this.face,
      nextFace: this.nextFace,
      alpha: this.alpha,
      alphaTarget: this.alphaTarget,
      pinLocked: this.pinLocked,
      xCoarse: this.xCoarse,
      ballDrop: this.ballDrop,
      s: this.stageS,
      motorAngle: this.motorAngle,
      speed: this.speed,
      sampleCount: this.sampleCount,
      forceN: this.forceN,
      positioned: this.positioned,
      activeStep: this.activeStep,
      completedSteps: [...this.completedSteps],
      result,
      signals: this.signals,
      faces: {
        left: {
          samples: left.samples, complete: left.complete, ff: left.ff,
          classification: left.classification,
        },
        right: {
          samples: right.samples, complete: right.complete, ff: right.ff,
          classification: right.classification,
        },
      },
      currentError: this.getCurrentError(),
      highPass: this.highPassAt(this.face, this.stageS),
      dataSerial: this._dataSerial,
      sampleSerial: this._sampleSerial,
      lastNewSample: this.lastNewSample,
    };
  }
}

export { TOL, U, ALPHA, LENGTH, STEP_ORDER, classifyFF };
