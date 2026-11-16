import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const invLerp = (a, b, v) => (v - a) / (b - a);
export const smoothstep = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
export const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
export const easeInOutQuint = t => t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2;
export const damp = (current, target, lambda, dt) => lerp(current, target, 1 - Math.exp(-lambda * dt));
export const deg = v => v * Math.PI / 180;
export const rad = v => v * 180 / Math.PI;
export const mod = (n, m) => ((n % m) + m) % m;

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

let roiGeo, planeGeo;
export function getPlaneGeometry() {
  if (!planeGeo) planeGeo = new THREE.PlaneGeometry(1, 1);
  return planeGeo;
}

export function roundedBoxGeo(w, h, d, radius = 2, segments = 2) {
  const r = Math.min(radius, Math.abs(w) / 2 - 0.01, Math.abs(h) / 2 - 0.01, Math.abs(d) / 2 - 0.01);
  if (r <= 0.05) return new THREE.BoxGeometry(w, h, d);
  return new RoundedBoxGeometry(w, h, d, segments, r);
}

export function makeMesh(geometry, material, parent, position, rotation, name) {
  const m = new THREE.Mesh(geometry, material);
  if (position) m.position.set(position[0], position[1], position[2]);
  if (rotation) m.rotation.set(rotation[0], rotation[1], rotation[2]);
  if (name) m.name = name;
  if (parent) parent.add(m);
  return m;
}

export function box(w, h, d, mat, parent, pos, radius = 0, segments = 2, rot, name) {
  const geo = radius > 0.1 ? roundedBoxGeo(w, h, d, radius, segments) : new THREE.BoxGeometry(w, h, d);
  return makeMesh(geo, mat, parent, pos, rot, name);
}

export function cylinder(rt, rb, h, mat, parent, pos, segments = 24, rot, openEnded = false, name) {
  const geo = new THREE.CylinderGeometry(rt, rb, h, segments, 1, openEnded);
  return makeMesh(geo, mat, parent, pos, rot, name);
}

export function sphere(r, mat, parent, pos, segments = 24, name) {
  return makeMesh(new THREE.SphereGeometry(r, segments, Math.max(12, segments / 2)), mat, parent, pos, null, name);
}

export function torus(r, tube, mat, parent, pos, rot, seg = 32, tubeSeg = 8, name) {
  return makeMesh(new THREE.TorusGeometry(r, tube, tubeSeg, seg), mat, parent, pos, rot, name);
}

export function setShadows(root, cast = true, receive = true) {
  root.traverse(obj => {
    if (!obj.isMesh && !obj.isInstancedMesh) return;
    if (obj.userData.noShadow) return;
    obj.castShadow = cast;
    obj.receiveShadow = receive;
  });
}

export function tagPart(group, key) {
  group.traverse(o => {
    if (o.isMesh || o.isInstancedMesh) {
      if (!o.userData.partKey) o.userData.partKey = key;
    }
  });
  group.userData.partKey = key;
}

export function createCanvasTexture(w, h, draw, opts = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = opts.colorSpace ?? THREE.SRGBColorSpace;
  if (opts.linear) tex.colorSpace = THREE.NoColorSpace;
  tex.anisotropy = opts.anisotropy ?? 4;
  if (opts.repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(opts.repeat[0], opts.repeat[1]);
  }
  tex.needsUpdate = true;
  return tex;
}

/* Fine roughness texture; always grayscale, no sRGB. */
export function makeNoiseTexture({ size = 256, base = 126, amp = 26, horizontal = false, seed = 1, blur = false } = {}) {
  const rand = mulberry32(seed);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  let value = base;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      if (horizontal) {
        if (x === 0) value = base + (rand() - 0.5) * amp * 0.9;
        value = clamp(value + (rand() - 0.5) * 4, base - amp, base + amp);
      }
      let v = horizontal ? value : base + (rand() - 0.5) * amp;
      if (!horizontal && blur) {
        v = base + (rand() - 0.5) * amp * 0.4 + Math.sin(y * 0.19) * amp * 0.14 + Math.cos(x * 0.11) * amp * 0.12;
      }
      img.data[idx] = img.data[idx + 1] = img.data[idx + 2] = clamp(v, 0, 255);
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  // add sparse tool marks
  ctx.globalAlpha = 0.10;
  for (let i = 0; i < 20; i++) {
    ctx.strokeStyle = rand() > 0.5 ? '#ffffff' : '#000000';
    ctx.lineWidth = 0.5 + rand();
    ctx.beginPath();
    if (horizontal) {
      const yy = rand() * size;
      ctx.moveTo(0, yy); ctx.lineTo(size, yy + (rand() - 0.5) * 2);
    } else {
      const xx = rand() * size, yy = rand() * size;
      ctx.arc(xx, yy, 4 + rand() * 22, 0, Math.PI * 2);
    }
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.NoColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

export function makeCastTexture(size = 256, seed = 4) {
  const rand = mulberry32(seed);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#8d8d8d';
  ctx.fillRect(0, 0, size, size);
  // sandstone speckle
  const img = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (rand() - 0.5) * 30 + (rand() > 0.985 ? 25 : 0);
    img.data[i] = img.data[i + 1] = img.data[i + 2] = clamp(138 + n, 0, 255);
  }
  ctx.putImageData(img, 0, 0);
  ctx.globalAlpha = 0.10;
  for (let i = 0; i < 32; i++) {
    ctx.strokeStyle = rand() > 0.5 ? '#fff' : '#222';
    ctx.lineWidth = 0.35 + rand() * 1.5;
    ctx.beginPath();
    const x = rand() * size, y = rand() * size;
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + (rand() - 0.5) * 80, y + rand() * 35, x + rand() * 100, y + (rand() - 0.5) * 100, x + (rand() - 0.5) * 130, y + 45);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

export function makeFloorTexture(size = 512, seed = 7) {
  const rand = mulberry32(seed);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grd = ctx.createRadialGradient(size * 0.37, size * 0.34, 0, size * 0.5, size * 0.5, size * 0.8);
  grd.addColorStop(0, '#F7F9FC');
  grd.addColorStop(0.45, '#EEF2F7');
  grd.addColorStop(1, '#E4EAF1');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, size, size);
  ctx.globalAlpha = 0.07;
  for (let i = 0; i < 500; i++) {
    const x = rand() * size, y = rand() * size, r = rand() * 24 + 2;
    ctx.beginPath();
    ctx.fillStyle = rand() > 0.5 ? '#ffffff' : '#000000';
    ctx.ellipse(x, y, r, r * (0.3 + rand()), rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 40; i++) {
    ctx.strokeStyle = rand() > 0.5 ? '#ffffff' : '#000000';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    const y = rand() * size;
    ctx.moveTo(0, y);
    ctx.lineTo(size, y + (rand() - 0.5) * 4);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function makeGlowTexture(size = 64, color = '#ffab5e', inner = 'rgba(255,245,225,1)', mid = 'rgba(255,171,94,.55)') {
  return createCanvasTexture(size, size, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, inner);
    g.addColorStop(0.25, mid);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2); ctx.fill();
  }, { colorSpace: THREE.SRGBColorSpace });
}

export function makeContactShadowTexture(size = 256, opacity = 0.72) {
  return createCanvasTexture(size, size, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, `rgba(0,0,0,${opacity})`);
    g.addColorStop(0.35, `rgba(0,0,0,${opacity * 0.7})`);
    g.addColorStop(0.7, `rgba(0,0,0,${opacity * 0.20})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }, { colorSpace: THREE.SRGBColorSpace });
}

export function makeTextTexture(lines, {
  width = 1024,
  height = 256,
  background = 'transparent',
  color = '#dbe5ec',
  dim = 'rgba(180,198,212,.62)',
  align = 'left',
  font = '500',
  border = null,
  padding = 36,
} = {}) {
  return createCanvasTexture(width, height, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    if (background !== 'transparent') {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, w, h);
    }
    if (border) {
      ctx.strokeStyle = border;
      ctx.lineWidth = 2;
      ctx.strokeRect(3, 3, w - 6, h - 6);
    }
    const lineArray = Array.isArray(lines) ? lines : [{ text: lines }];
    const total = lineArray.length;
    const lineH = Math.min(58, (h - padding * 2) / Math.max(1, total));
    lineArray.forEach((line, i) => {
      const item = typeof line === 'string' ? { text: line } : line;
      const size = item.size ?? (i === 0 ? 44 : 22);
      const weight = item.weight ?? (i === 0 ? 600 : 400);
      const family = item.mono === false ? "'Noto Sans SC','Microsoft YaHei',sans-serif" : "'SFMono-Regular','Cascadia Mono',Consolas,monospace";
      ctx.fillStyle = item.color ?? (i === 0 ? color : dim);
      ctx.font = `${weight} ${size}px ${family}`;
      ctx.textAlign = item.align ?? align;
      ctx.textBaseline = 'middle';
      const x = align === 'center' ? w / 2 : (align === 'right' ? w - padding : padding);
      const y = padding + lineH * (i + 0.5);
      ctx.fillText(item.text, x, y);
      if (item.underline) {
        const m = ctx.measureText(item.text);
        ctx.fillRect(x, y + size * 0.7, m.width, 2);
      }
    });
  });
}

export function textPlane(lines, opts = {}) {
  const {
    width = 400, height = 100, material = new THREE.MeshBasicMaterial({
      transparent: true, depthWrite: false, toneMapped: false,
      side: THREE.DoubleSide, opacity: 0.9,
    }),
    textureOptions = {},
    opacity = 0.9,
    toneMapped = false,
  } = opts;
  const texture = makeTextTexture(lines, textureOptions);
  const mat = material.clone();
  mat.map = texture;
  mat.transparent = true;
  mat.depthWrite = false;
  mat.toneMapped = toneMapped;
  mat.opacity = opacity;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
  return mesh;
}

export function tubeFromPoints(points, radius, material, parent, tubularSegments = 64, radialSegments = 6) {
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
  return makeMesh(geo, material, parent);
}

export function makeHelixPoints({
  radius = 2, pitch = 5, turns = 8, startY = 0, segmentsPerTurn = 18, axis = 'y', clockwise = true,
} = {}) {
  const pts = [];
  const total = Math.ceil(turns * segmentsPerTurn);
  for (let i = 0; i <= total; i++) {
    const t = i / total;
    const a = t * turns * Math.PI * 2 * (clockwise ? 1 : -1);
    const y = startY + t * turns * pitch;
    if (axis === 'y') pts.push(new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius));
    else if (axis === 'x') pts.push(new THREE.Vector3(y, Math.cos(a) * radius, Math.sin(a) * radius));
    else pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, y));
  }
  return pts;
}

export function createCoilGeometry({ radius = 2, wire = 0.35, pitch = 2.2, turns = 8, segments = 20 } = {}) {
  const pts = makeHelixPoints({ radius, pitch, turns, segmentsPerTurn: segments });
  const curve = new THREE.CatmullRomCurve3(pts);
  return new THREE.TubeGeometry(curve, Math.ceil(turns * segments * 1.4), wire, 5, false);
}

export function makeDialTexture({
  size = 512, color = '#dfe7ed', bg = 'rgba(0,0,0,0)', marks = 40, labels = ['0', '10', '20', '30', '40'], title = '',
} = {}) {
  return createCanvasTexture(size, size, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.translate(w / 2, h / 2);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    for (let i = 0; i < marks; i++) {
      const major = i % 5 === 0;
      const a = (i / marks) * Math.PI * 2;
      const r1 = w * 0.40;
      const r2 = w * (major ? 0.335 : 0.365);
      ctx.lineWidth = major ? 2.2 : 0.8;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.72;
    ctx.font = "400 18px 'SFMono-Regular',Consolas,monospace";
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    labels.forEach((label, i) => {
      const a = -Math.PI / 2 + (i / labels.length) * Math.PI * 2;
      ctx.fillText(label, Math.cos(a) * w * 0.285, Math.sin(a) * w * 0.285);
    });
    if (title) {
      ctx.globalAlpha = 0.45;
      ctx.font = "400 11px 'SFMono-Regular',Consolas,monospace";
      ctx.fillText(title, 0, -w * 0.12);
    }
  });
}

export function addEdgeLines(mesh, color = 0xffffff, opacity = 0.25, threshold = 35) {
  const edges = new THREE.EdgesGeometry(mesh.geometry, threshold);
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false, toneMapped: false });
  const line = new THREE.LineSegments(edges, mat);
  line.raycast = () => {};
  mesh.add(line);
  return line;
}

export function makeInstancedBolts(positions, geometry, material, parent, {
  scale = 1, name = 'boltField',
} = {}) {
  const inst = new THREE.InstancedMesh(geometry, material, positions.length);
  const dummy = new THREE.Object3D();
  positions.forEach((p, i) => {
    dummy.position.set(p[0], p[1], p[2]);
    dummy.rotation.set(p[3] || 0, p[4] || 0, p[5] || 0);
    const s = (p[6] || 1) * scale;
    dummy.scale.set(s, s, s);
    dummy.updateMatrix();
    inst.setMatrixAt(i, dummy.matrix);
  });
  inst.instanceMatrix.needsUpdate = true;
  inst.name = name;
  parent.add(inst);
  return inst;
}

export function formatMM(v, digits = 3) {
  return Number(v).toFixed(digits);
}
export function formatMicron(v, digits = 1) {
  return Number(v).toFixed(digits);
}
export function signedDeg(v, digits = 2) {
  const n = Number(v);
  return `${n >= 0 ? '+' : '−'}${Math.abs(n).toFixed(digits)}°`;
}

export function clampPixelRatio(rendererWidth) {
  return rendererWidth <= 760 ? 1.35 : 1.75;
}

export function disposeObject(root) {
  root.traverse(o => {
    if (o.geometry) o.geometry.dispose?.();
    if (o.material) {
      if (Array.isArray(o.material)) o.material.forEach(m => m.dispose?.());
      else o.material.dispose?.();
    }
  });
}
