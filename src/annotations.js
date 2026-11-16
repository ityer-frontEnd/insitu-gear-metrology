import * as THREE from 'three';
import { CFG } from './config.js';
import { clamp } from './utils.js';

// Engineering labels are projections of the same configuration that drives
// the mechanism. Only descriptive material phrases remain authored here.
const D = CFG.gear.D;
const Z = CFG.gear.Z;
const MN = CFG.gear.mn;
const W = CFG.gear.W;
const K = CFG.gear.k;
const BALL_D = CFG.locator.ballD;
const RUBY_D = CFG.stylus.ballD;
const RUBY_HRA = CFG.stylus.ballMaterial.replace(/^.*?·\s*/, '');
const SCREW = `φ${CFG.drive.screwDia} × ${CFG.drive.screwPitch}`;
const FLEX_MAT = CFG.flexure.material.split(/\s+/)[0];
const LEVER_MAT = CFG.lever.material.split(/\s+/)[0];
const FORCE_RANGE = `${CFG.machine.forceMin}–${CFG.machine.forceMax} N`;
const ANGLE = CFG.reversal.angle;
const BEARING_SIZE = CFG.reversal.bearing.replace(/^交叉滚子轴承\s*/, '');

const DEFAULT_LABELS = [
  { key: 'dualBall', anchor: 'ballA', title: '双定位球 A / B', value: `φ${BALL_D} mm · W ${W} · k ${K}`, side: 'left', dx: -55, dy: 6, noOcclude: true },
  { key: 'ruby', anchor: 'ruby', title: '红宝石测球', value: `φ${RUBY_D} mm · ${RUBY_HRA}`, side: 'right', dx: 78, dy: 48 },
  { key: 'screw', anchor: 'screw', title: 'C3 滚珠丝杆', value: `${SCREW} · 回差 < 0.5 μm`, side: 'right', dx: 52, dy: -54 },
];

const POSITIONING_LABELS = [
  { key: 'dualBall', anchor: 'ballA', title: '主定位球 A', value: `φ${BALL_D} mm · W ${W} · k ${K}`, side: 'left', noOcclude: true, dx: -52, dy: 24 },
  { key: 'ballB', anchor: 'ballB', title: '副定位球 B', value: `${CFG.locator.springK} N/mm 弹簧浮动`, side: 'right', noOcclude: true, dx: 45, dy: 12 },
  { key: 'ruby', anchor: 'ruby', title: '红宝石测球', value: `φ${RUBY_D} mm · 测量力 ${FORCE_RANGE}`, side: 'right', noOcclude: true, dx: 55, dy: 64 },
];

const SECTION_LABELS = [
  { key: 'ruby', anchor: 'ruby', title: '红宝石测球', value: `φ${RUBY_D} mm · 测量力 ${FORCE_RANGE}`, side: 'right', noOcclude: true, dx: 40, dy: 24 },
  { key: 'flexure', anchor: 'flexure', title: '单片簧铰链', value: `${FLEX_MAT} · ${CFG.flexure.kAlpha} N·mm/rad`, side: 'left' },
  { key: 'lever', anchor: 'lever', title: `${CFG.lever.ratio} : 1 精密杠杆`, value: `${LEVER_MAT} · L1/L2 = ${CFG.lever.L1} / ${CFG.lever.L2} mm`, side: 'left' },
  { key: 'lvdt', anchor: 'lvdt', title: 'LVDT 位移传感器', value: `接收 ${CFG.lever.ratio}δ · 不锈钢壳体`, side: 'right' },
  { key: 'bearing', anchor: 'bearing', title: '交叉滚子轴承', value: `${BEARING_SIZE} · ±${ANGLE}°`, side: 'left' },
];

const EXPLODED_LABELS = [
  { key: 'gear', anchor: 'gear', title: '人字齿轮扇段', value: `Φ${D} · Z ${Z} · mn ${MN}`, side: 'left', noOcclude: true, dx: -10, dy: 10 },
  { key: 'column', anchor: 'column', title: '立柱 + 悬臂', value: '6061-T6 · 250 / 200 mm', side: 'left', noOcclude: true, dy: -20 },
  { key: 'motor', anchor: 'motor', title: '步进电机', value: `${CFG.drive.motorModel} · ${CFG.drive.holdTorque} N·m`, side: 'right', noOcclude: true, dx: 20, dy: -20 },
  { key: 'screw', anchor: 'screw', title: 'C3 滚珠丝杆', value: `${SCREW} · 双螺母预紧`, side: 'right', noOcclude: true, dx: 30, dy: 30 },
  { key: 'flexure', anchor: 'flexure', title: '单片簧铰链', value: `${FLEX_MAT} · kα = ${CFG.flexure.kAlpha} N·mm/rad`, side: 'left', noOcclude: true, dy: 20 },
  { key: 'ruby', anchor: 'ruby', title: '红宝石测球', value: `φ${RUBY_D} mm · 测量力 ${FORCE_RANGE}`, side: 'right', noOcclude: true, dx: 50, dy: 35 },
];

export class AnnotationSystem {
  constructor({ layer, svg, anchors, renderer, camera, occluders = [] }) {
    this.layer = layer;
    this.svg = svg;
    this.anchors = anchors;
    this.camera = camera;
    this.renderer = renderer;
    this.rawOccluders = occluders;
    this.raycaster = new THREE.Raycaster();
    this.entries = [];
    this.enabled = true;
    this.mode = 'default';
    this.width = 1; this.height = 1;
    this._occlusionTime = 0;
    this._visible = new Map();
    this.setMode('default', true);
  }

  setOccluders(objects) {
    this.rawOccluders = objects;
  }

  clear() {
    for (const e of this.entries) {
      e.el.remove();
      e.path.remove();
      e.dot.remove();
    }
    this.entries = [];
    this.svg.innerHTML = '';
  }

  setMode(mode, force = false) {
    if (!force && this.mode === mode) return;
    this.mode = mode;
    this.clear();
    const defs = mode === 'exploded' ? EXPLODED_LABELS
      : mode === 'section' ? SECTION_LABELS
      : mode === 'positioning' ? POSITIONING_LABELS
      : DEFAULT_LABELS;
    const ns = 'http://www.w3.org/2000/svg';
    for (const def of defs) {
      const anchorObj = this.anchors[def.anchor];
      if (!anchorObj) continue;
      const el = document.createElement('div');
      el.className = `annotation ${def.side === 'left' ? 'is-left' : 'is-right'}`;
      el.dataset.part = def.key;
      el.innerHTML = `
        <div class="annotation-card">
          <div class="annotation-title">
            <b><span class="annotation-index">●</span>${def.title}</b>
            <span>${def.value}</span>
          </div>
        </div>
        <span class="annotation-mark"></span>`;
      this.layer.appendChild(el);
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('class', 'leader-path');
      const dot = document.createElementNS(ns, 'circle');
      dot.setAttribute('class', 'leader-dot');
      dot.setAttribute('r', '1.7');
      this.svg.appendChild(path);
      this.svg.appendChild(dot);
      this.entries.push({ ...def, anchorObj, el, path, dot, card: el.querySelector('.annotation-card'), projected: new THREE.Vector3(), visible: false, occluded: false, width: 100 });
    }
  }

  setEnabled(v) {
    this.enabled = v;
    this.layer.style.display = v ? '' : 'none';
  }

  resize() {
    const rect = this.layer.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
    this.svg.setAttribute('width', this.width);
    this.svg.setAttribute('height', this.height);
    this._occlusionTime = 0;
  }

  _isOccluded(anchorWorld, camPos) {
    if (!this.rawOccluders.length) return false;
    const dir = anchorWorld.clone().sub(camPos);
    const dist = dir.length();
    dir.normalize();
    this.raycaster.set(camPos, dir);
    this.raycaster.far = dist - 80;
    const hits = this.raycaster.intersectObjects(this.rawOccluders, true);
    for (const h of hits) {
      if (h.object.userData.noOcclude) continue;
      if (h.distance < dist - 80) return true;
    }
    return false;
  }

  update(now, cameraMoving = false) {
    if (!this.enabled) return;
    const camPos = this.camera.position;
    const tmp = new THREE.Vector3();
    const doOcclusion = now - this._occlusionTime > 280;
    if (doOcclusion) this._occlusionTime = now;

    let visibleIndex = 0;
    for (const e of this.entries) {
      e.anchorObj.getWorldPosition(tmp);
      const distance = tmp.distanceTo(camPos);
      const p = e.projected.copy(tmp).project(this.camera);
      const behind = p.z > 1 || p.z < -1;
      const sx = (p.x * 0.5 + 0.5) * this.width;
      const sy = (-p.y * 0.5 + 0.5) * this.height;
      const pad = 30;
      let visible = !behind && sx > -40 && sx < this.width + 40 && sy > 40 && sy < this.height - 160;
      if (distance > 4200) visible = false;
      e.desiredY = clamp(sy + (e.dy || 0), 40, this.height - 170);
      if (doOcclusion && visible && !e.noOcclude) {
        e.occluded = this._isOccluded(tmp, camPos);
      } else if (e.noOcclude) {
        e.occluded = false;
      }
      if (e.occluded) visible = false;
      e.visible = visible;
      e.screenX = clamp(sx, 16, this.width - 16);
      e.screenY = clamp(sy, 40, this.height - 170);
      e.distance = distance;
      if (visible) visibleIndex++;
    }

    // Card layout: separate columns, sorted vertically to avoid leaders crossing.
    const visible = this.entries.filter(e => e.visible);
    for (const side of ['left', 'right']) {
      const column = visible.filter(e => e.side === side).sort((a, b) => a.desiredY - b.desiredY);
      let cursor = 54;
      for (const e of column) {
        e.width = Math.max(94, e.card.offsetWidth || 94);
        const h = Math.max(28, e.card.offsetHeight || 28);
        let y = Math.max(cursor, e.desiredY - h / 2);
        y = Math.min(y, this.height - 168 - h);
        e.cardY = y;
        cursor = y + h + 7;
      }
    }

    for (const e of this.entries) {
      const el = e.el;
      if (!e.visible) {
        el.classList.remove('is-visible');
        e.path.classList.remove('is-visible');
        e.dot.classList.remove('is-visible');
        continue;
      }
      const w = e.width;
      const h = Math.max(28, e.card.offsetHeight || 28);
      const gap = 22;
      let x = e.side === 'left' ? e.screenX - w - gap + (e.dx || 0) : e.screenX + gap + (e.dx || 0);
      x = clamp(x, 10, this.width - w - 10);
      const y = e.cardY;
      el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
      el.style.opacity = cameraMoving ? '0.35' : '1';
      el.classList.add('is-visible');

      const endX = e.side === 'left' ? x + w : x;
      const endY = y + h / 2;
      const elbowX = e.side === 'left' ? e.screenX - 18 : e.screenX + 18;
      const d = `M ${e.screenX.toFixed(1)} ${e.screenY.toFixed(1)} L ${elbowX.toFixed(1)} ${e.screenY.toFixed(1)} L ${elbowX.toFixed(1)} ${endY.toFixed(1)} L ${endX.toFixed(1)} ${endY.toFixed(1)}`;
      e.path.setAttribute('d', d);
      e.path.classList.add('is-visible');
      e.dot.setAttribute('cx', e.screenX);
      e.dot.setAttribute('cy', e.screenY);
      e.dot.classList.add('is-visible');
    }
  }

  get visibleCount() {
    return this.entries.filter(e => e.visible).length;
  }
}
