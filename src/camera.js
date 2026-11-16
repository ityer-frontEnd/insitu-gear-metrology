import * as THREE from 'three';
import { LAYOUT, DEG, CFG } from './config.js';
import { clamp, easeInOutCubic } from './utils.js';

export class CameraDirector {
  constructor(camera, controls, anchors, yawRad, onChange) {
    this.camera = camera;
    this.controls = controls;
    this.anchors = anchors;
    this.yaw = yawRad;
    this.onChange = onChange || (() => {});
    this.tween = null;
    this.currentPreset = 'overview';
    this.saved = null;
    this.lastInteraction = performance.now();
    this.autoEnabled = true;
    this.driftTime = 0;
    this._lastBase = null;
    this.controls.addEventListener('start', () => this.noteInteraction(true));
    this.controls.addEventListener('end', () => { this.lastInteraction = performance.now(); });
    this._pointerCancel = () => {
      if (this.tween) this.cancelTween(true);
      this.noteInteraction();
    };
    this.controls.domElement.addEventListener('pointerdown', this._pointerCancel, { passive: true });
    this.controls.domElement.addEventListener('wheel', this._pointerCancel, { passive: true });
    this.controls.domElement.addEventListener('touchstart', this._pointerCancel, { passive: true });
    this.resetToPreset('overview', true);
  }

  getInstrumentBasis() {
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const forward = new THREE.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
    const up = new THREE.Vector3(0, 1, 0);
    return { right, forward, up };
  }

  worldAnchor(key) {
    const a = this.anchors[key];
    if (!a) return new THREE.Vector3();
    return a.getWorldPosition(new THREE.Vector3());
  }

  relativeView(anchor, { right = 0, up = 0, forward = 0, targetLift = 0, fov = 30 }) {
    const { right: r, forward: f, up: u } = this.getInstrumentBasis();
    const target = anchor.clone().add(u.clone().multiplyScalar(targetLift));
    const pos = target.clone()
      .addScaledVector(r, right)
      .addScaledVector(u, up)
      .addScaledVector(f, forward);
    return { pos, target, fov };
  }

  preset(name) {
    switch (name) {
      case 'overview':
      case 'reset':
        if (typeof window !== 'undefined' && window.innerWidth <= 760) {
          return {
            pos: new THREE.Vector3(620, 460, 900),
            target: new THREE.Vector3(0, 190, -280),
            fov: 48,
          };
        }
        return {
          pos: new THREE.Vector3(...LAYOUT.camera.defaultPos),
          target: new THREE.Vector3(...LAYOUT.camera.defaultTarget),
          fov: LAYOUT.camera.fov,
        };
      case 'positioning': {
        const a = this.worldAnchor('ballA');
        const b = this.worldAnchor('ballB');
        const mid = a.clone().add(b).multiplyScalar(0.5);
        mid.y = Math.max(150, mid.y);
        // The working side is crowded by the column and control box. A high
        // rear three-quarter view is the only angle that clears both balls
        // while keeping the gear surface and both locator arms in frame.
        const target = mid.clone().add(new THREE.Vector3(0, 10, 0));
        const pos = target.clone().add(new THREE.Vector3(-120, 290, -120));
        return { pos, target, fov: 50 };
      }
      case 'drivetrain': {
        const a = this.worldAnchor('screw');
        const { right, forward, up } = this.getInstrumentBasis();
        const target = a.clone().add(new THREE.Vector3(0, -6, 20));
        const pos = target.clone()
          .addScaledVector(right, 250)
          .addScaledVector(up, 120)
          .addScaledVector(forward, 310);
        return { pos, target, fov: 29 };
      }
      case 'transfer': {
        const a = this.worldAnchor('lever');
        const { right, forward, up } = this.getInstrumentBasis();
        const target = a.clone().add(new THREE.Vector3(0, -18, 2));
        const pos = target.clone()
          .addScaledVector(right, 232)
          .addScaledVector(up, 135)
          .addScaledVector(forward, 355);
        return { pos, target, fov: 27 };
      }
      case 'reversal': {
        const a = this.worldAnchor('bearing');
        const { right, forward, up } = this.getInstrumentBasis();
        const target = a.clone().add(new THREE.Vector3(0, -18, 0));
        const pos = target.clone()
          .addScaledVector(right, 60)
          .addScaledVector(up, 130)
          .addScaledVector(forward, 340);
        return { pos, target, fov: 28 };
      }
      case 'section':
        return this.preset('transfer');
      case 'exploded': {
        return {
          pos: new THREE.Vector3(1120, 780, 1520),
          target: new THREE.Vector3(0, 120, 0),
          fov: 38,
        };
      }
      default:
        return this.preset('overview');
    }
  }

  noteInteraction(cancelTween = false) {
    this.lastInteraction = performance.now();
    this.driftTime = 0;
    if (cancelTween && this.tween) this.cancelTween(true);
  }

  cancelTween(enableControls = true) {
    this.tween = null;
    if (enableControls) this.controls.enabled = true;
  }

  _compactFov(fov) {
    const compact = typeof window !== 'undefined' && window.innerWidth <= 760;
    return compact ? Math.max(38, fov) : fov;
  }

  flyTo(name, { duration = 1.15, immediate = false, silent = false } = {}) {
    const p = this.preset(name);
    if (!p) return;
    p.fov = this._compactFov(p.fov);
    this.currentPreset = name === 'reset' ? 'overview' : name;
    this.onChange(this.currentPreset);
    if (immediate) {
      this.camera.position.copy(p.pos);
      this.camera.fov = p.fov;
      this.camera.updateProjectionMatrix();
      this.controls.target.copy(p.target);
      this.controls.update();
      this.controls.enabled = true;
      this._lastBase = { pos: p.pos.clone(), target: p.target.clone(), fov: p.fov };
      return;
    }
    this.cancelTween(false);
    this.controls.enabled = false;
    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    const startFov = this.camera.fov;
    const distance = startPos.distanceTo(p.pos);
    const arc = Math.min(180, distance * 0.07);
    this.tween = {
      name,
      t: 0,
      duration: clamp(duration, 0.35, 2.0),
      startPos, startTarget, startFov,
      endPos: p.pos.clone(), endTarget: p.target.clone(), endFov: p.fov,
      arc,
      silent,
    };
    this._lastBase = { pos: p.pos.clone(), target: p.target.clone(), fov: p.fov };
  }

  resetToPreset(name = 'overview', immediate = false) {
    this.flyTo(name, { immediate, duration: 1.0 });
  }

  saveState() {
    this.saved = {
      pos: this.camera.position.clone(),
      target: this.controls.target.clone(),
      fov: this.camera.fov,
      preset: this.currentPreset,
    };
    return this.saved;
  }

  restoreState(state = this.saved) {
    if (!state) return;
    this.tween = null;
    this.controls.enabled = true;
    this.camera.position.copy(state.pos);
    this.controls.target.copy(state.target);
    this.camera.fov = state.fov;
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.currentPreset = state.preset || 'overview';
    this.onChange(this.currentPreset);
    this._lastBase = { pos: state.pos.clone(), target: state.target.clone(), fov: state.fov };
  }

  update(dt, allowDrift = true) {
    if (this.tween) {
      this.tween.t += dt;
      const u = clamp(this.tween.t / this.tween.duration, 0, 1);
      const e = easeInOutCubic(u);
      const pos = new THREE.Vector3().lerpVectors(this.tween.startPos, this.tween.endPos, e);
      pos.y += Math.sin(Math.PI * e) * this.tween.arc;
      const target = new THREE.Vector3().lerpVectors(this.tween.startTarget, this.tween.endTarget, e);
      this.camera.position.copy(pos);
      this.controls.target.copy(target);
      this.camera.fov = this.tween.startFov + (this.tween.endFov - this.tween.startFov) * e;
      this.camera.updateProjectionMatrix();
      this.controls.update();
      if (u >= 1) {
        this.tween = null;
        this.controls.enabled = true;
      }
      return;
    }

    // Very gentle observation drift only after a long idle, never a fast orbit.
    if (allowDrift && this.autoEnabled) {
      const idleMs = performance.now() - this.lastInteraction;
      if (idleMs > 16000 && !this.controls.active && this.currentPreset === 'overview') {
        this.driftTime += dt;
        const base = this._lastBase || {
          pos: new THREE.Vector3(...LAYOUT.camera.defaultPos),
          target: new THREE.Vector3(...LAYOUT.camera.defaultTarget),
        };
        const angle = Math.sin(this.driftTime * 0.045) * 0.018;
        const off = this.camera.position.clone().sub(this.controls.target);
        off.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle * dt * 0.6);
        this.camera.position.copy(this.controls.target).add(off);
        const target = this.controls.target.clone();
        target.x += Math.sin(this.driftTime * 0.033) * 0.03;
        this.controls.target.lerp(target, 0.02);
        this.controls.update();
      }
    }
  }
}
