import * as THREE from 'three';
import { CFG, LAYOUT, DEG, COLORS } from './config.js';
import {
  clamp, lerp, deg, box, cylinder, sphere, torus, roundedBoxGeo, setShadows, tagPart,
  makeMesh, createCanvasTexture, makeGlowTexture, makeDialTexture, textPlane,
  tubeFromPoints, makeHelixPoints, createCoilGeometry,
} from './utils.js';

const I = LAYOUT.instrument;
const METAL_WHITE = 0xdce5eb;

/* ------------------------------------------------------------------ */
/* Local helpers                                                       */
/* ------------------------------------------------------------------ */

function knurlTexture() {
  return createCanvasTexture(512, 64, (ctx, w, h) => {
    ctx.fillStyle = '#777';
    ctx.fillRect(0, 0, w, h);
    const n = 120;
    for (let i = 0; i < n; i++) {
      const x = (i / n) * w;
      const g = ctx.createLinearGradient(x, 0, x + 3, 0);
      g.addColorStop(0, 'rgba(255,255,255,.28)');
      g.addColorStop(0.5, 'rgba(0,0,0,.32)');
      g.addColorStop(1, 'rgba(255,255,255,.15)');
      ctx.fillStyle = g;
      ctx.fillRect(x, 0, 3.2, h);
    }
    ctx.globalAlpha = 0.18;
    for (let y = 0; y < h; y += 8) {
      ctx.fillStyle = y % 16 ? '#fff' : '#000';
      ctx.fillRect(0, y, w, 0.7);
    }
  }, { linear: true, repeat: [1, 1] });
}

function makeKnurledMaterial(base, texture) {
  const mat = base.clone();
  mat.roughness = Math.min(0.52, (mat.roughness ?? 0.35) + 0.08);
  mat.bumpMap = texture;
  mat.bumpScale = 0.18;
  mat.roughnessMap = texture;
  mat.needsUpdate = true;
  return mat;
}

function addBolts(parent, positions, mat, radius = 4.0, height = 2.6) {
  if (!positions.length) return null;
  const geo = new THREE.CylinderGeometry(radius, radius, height, 6);
  const inst = new THREE.InstancedMesh(geo, mat, positions.length);
  const dummy = new THREE.Object3D();
  positions.forEach((p, i) => {
    dummy.position.set(p[0], p[1], p[2]);
    dummy.rotation.set(p[3] || 0, p[4] || 0, p[5] || 0);
    dummy.updateMatrix();
    inst.setMatrixAt(i, dummy.matrix);
  });
  inst.instanceMatrix.needsUpdate = true;
  inst.name = 'fasteners';
  parent.add(inst);
  return inst;
}

function addNut(parent, x, y, z, mat, r = 11, h = 8, rot = [0, 0, 0]) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.set(rot[0], rot[1], rot[2]);
  parent.add(g);
  cylinder(r, r, h, mat, g, [0, 0, 0], 6);
  cylinder(r * 0.58, r * 0.58, h + 0.2, mat, g, [0, 0, 0], 20);
  return g;
}

function addSocketScrew(parent, x, y, z, mat, rot = [0, 0, 0], size = 1) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.set(rot[0], rot[1], rot[2]);
  cylinder(3.8 * size, 3.8 * size, 1.8 * size, mat, g, [0, 0, 0], 16);
  const socket = cylinder(1.7 * size, 1.7 * size, 0.35 * size, new THREE.MeshBasicMaterial({ color: 0x05080b }), g, [0, 0.95 * size, 0], 6);
  socket.raycast = () => {};
  parent.add(g);
  return g;
}

function addLinearTicks(parent, {
  length = 100, count = 20, origin = [0, 0, 0], axis = 'z', normal = 'x', majorEvery = 5,
  color = 0xb8c4cc, opacity = 0.5,
} = {}) {
  const pts = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const major = i % majorEvery === 0;
    const l = major ? 3.4 : 1.8;
    if (axis === 'z') {
      pts.push(origin[0], origin[1], origin[2] + t * length);
      pts.push(origin[0] + (normal === 'x' ? l : 0), origin[1] + (normal === 'y' ? l : 0), origin[2] + t * length);
    } else if (axis === 'x') {
      pts.push(origin[0] + t * length, origin[1], origin[2]);
      pts.push(origin[0] + t * length, origin[1] + (normal === 'y' ? l : 0), origin[2] + (normal === 'z' ? l : 0));
    } else {
      pts.push(origin[0], origin[1] + t * length, origin[2]);
      pts.push(origin[0] + (normal === 'x' ? l : 0), origin[1] + t * length, origin[2] + (normal === 'z' ? l : 0));
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const line = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({
    color, transparent: true, opacity, depthWrite: false, toneMapped: false,
  }));
  line.raycast = () => {};
  parent.add(line);
  return line;
}

function addDialTicks(parent, radius, y, count = 96, color = 0x9fb3bf) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const major = i % 8 === 0;
    const r0 = radius * (major ? 0.86 : 0.92);
    positions.push(Math.cos(a) * r0, y, Math.sin(a) * r0);
    positions.push(Math.cos(a) * radius, y, Math.sin(a) * radius);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const line = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({
    color, transparent: true, opacity: 0.44, depthWrite: false, toneMapped: false,
  }));
  line.raycast = () => {};
  parent.add(line);
  return line;
}

function addCable(parent, points, radius = 1.25, material) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  const geo = new THREE.TubeGeometry(curve, 80, radius, 5, false);
  const m = new THREE.Mesh(geo, material);
  m.castShadow = true;
  m.raycast = () => {};
  parent.add(m);
  return m;
}

function addHexVent(parent, pos, mat, radius = 10, depth = 1.6) {
  const g = new THREE.Group();
  g.position.set(...pos);
  const outer = cylinder(radius, radius, depth, mat, g, [0, 0, 0], 6);
  outer.rotation.x = Math.PI / 2;
  for (let i = 0; i < 3; i++) {
    const slit = box(radius * 1.35, 1.0, 0.4, new THREE.MeshBasicMaterial({ color: 0x05080b }), g, [0, -3 + i * 3, depth / 2 + 0.2]);
    slit.rotation.z = -0.2;
    slit.raycast = () => {};
  }
  parent.add(g);
  return g;
}

function createMicrometerHead(mats, knurlMat, options = {}) {
  const {
    scale = 1, color = 'dark', axisLength = 26,
  } = options;
  const g = new THREE.Group();
  const bodyMat = color === 'dark' ? mats.blackAnodized : mats.aluminum;
  const barrelMat = mats.steel;
  cylinder(9, 9, 20, bodyMat, g, [0, 2, 0], 24);
  const scaleRing = cylinder(9.3, 9.3, 2.4, mats.machined, g, [0, 7.2, 0], 32);
  // engraved axial ticks on the barrel
  const tickTex = makeDialTexture({ size: 512, marks: 50, labels: ['0', '10', '20', '30', '40'], color: '#d7e2e8' });
  const tickMat = new THREE.MeshBasicMaterial({ map: tickTex, transparent: true, opacity: 0.6, toneMapped: false });
  const tickPlane = new THREE.Mesh(new THREE.PlaneGeometry(17, 9), tickMat);
  tickPlane.position.set(0, 7.5, 9.28);
  tickPlane.raycast = () => {};
  g.add(tickPlane);
  const thimble = cylinder(10.3, 10.3, 12, knurlMat, g, [0, -10, 0], 40);
  thimble.name = 'micrometerThimble';
  cylinder(3, 3, 34, barrelMat, g, [0, -26, 0], 16);
  // vernier reference edge
  const ring = torus(9.5, 0.4, mats.polishedSteel, g, [0, 3.6, 0], [Math.PI / 2, 0, 0], 32, 5);
  g.userData.thimble = thimble;
  g.userData.scaleRing = scaleRing;
  g.userData.spindle = barrelMat;
  g.scale.setScalar(scale);
  return g;
}

function createScrewThreadGeometry(length, shaftRadius, threadRadius, pitch) {
  const pts = makeHelixPoints({
    radius: shaftRadius, pitch, turns: length / pitch, startY: 0,
    segmentsPerTurn: 22, axis: 'y', clockwise: true,
  });
  const curve = new THREE.CatmullRomCurve3(pts);
  const geo = new THREE.TubeGeometry(curve, Math.ceil(length / pitch * 22), threadRadius, 5, false);
  geo.translate(0, -length / 2, 0);
  return geo;
}

function createSimpleGearGeometry(teeth = 40, module = 0.5, thickness = 6) {
  const rRoot = (module * teeth) / 2 - module * 1.25;
  const rTip = (module * teeth) / 2 + module;
  const shape = new THREE.Shape();
  const steps = teeth * 4;
  for (let i = 0; i <= steps; i++) {
    const t = i % 4;
    const a = (i / steps) * Math.PI * 2;
    const r = t === 1 || t === 2 ? rTip : rRoot;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness, bevelEnabled: true, bevelSize: 0.35, bevelThickness: 0.4,
    bevelSegments: 1, curveSegments: 32,
  });
  geo.center();
  geo.rotateX(-Math.PI / 2);
  return { geo, rRoot, rTip, pitchR: module * teeth / 2 };
}

function addSmallDisplayLabel(parent, lines, pos, rot, width, height, opacity = 0.7) {
  const plate = textPlane(lines, {
    width, height,
    textureOptions: {
      width: 1024, height: 256, align: 'center', color: 'rgba(211,224,232,.72)',
      dim: 'rgba(175,193,205,.46)', padding: 26,
    },
    opacity,
    material: new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }),
  });
  plate.position.set(...pos);
  plate.rotation.set(...rot);
  plate.raycast = () => {};
  parent.add(plate);
  return plate;
}

/* ------------------------------------------------------------------ */
/* Instrument                                                          */
/* ------------------------------------------------------------------ */

export function createInstrument(materials, opts = {}) {
  const root = new THREE.Group();
  root.name = 'Instrument';
  root.position.fromArray(opts.position || I.rootWorld);
  root.rotation.y = deg(opts.yawDeg ?? I.yawDeg);

  const motion = {};
  const anchors = {};
  const explodeGroups = [];
  const partGroups = {};
  const clickables = [];

  const knurlTex = knurlTexture();
  const knurlMat = makeKnurledMaterial(materials.blackAnodized, knurlTex);
  const knurlSilver = makeKnurledMaterial(materials.steel, knurlTex);

  const copperMat = materials.bronze.clone();
  copperMat.color = new THREE.Color(0xa67d48);

  const register = (key, mesh) => {
    tagPart(mesh, key);
    (partGroups[key] ||= []).push(mesh);
  };
  const bindAnchor = (key, obj, pos = [0, 0, 0]) => {
    const a = new THREE.Object3D();
    a.position.set(pos[0], pos[1], pos[2]);
    obj.add(a);
    anchors[key] = a;
    return a;
  };
  const addExplode = (name, object, parent, base = [0, 0, 0], offset = [0, 0, 0], delay = 0) => {
    const g = new THREE.Group();
    g.name = `EXPLODE_${name}`;
    g.position.set(base[0], base[1], base[2]);
    parent.add(g);
    const entry = {
      name, object: g, base: g.position.clone(),
      offset: new THREE.Vector3(offset[0], offset[1], offset[2]), delay,
    };
    explodeGroups.push(entry);
    return g;
  };

  /* ---------------------------------------------------------------- */
  /* Feet and base                                                     */
  /* ---------------------------------------------------------------- */
  const feetExpl = addExplode('feet', new THREE.Group(), root, [0, 0, 0], [0, -190, 0], 0.05);
  const feetGroup = feetExpl;
  {
    const feet = [
      [-158, -110, 0.94], [158, -110, 1.0], [4, 138, 1.05],
    ];
    for (const [x, z, s] of feet) {
      const f = new THREE.Group();
      f.position.set(x, 0, z);
      f.scale.setScalar(s);
      cylinder(27, 29, 6, materials.rubber, f, [0, 3, 0], 48);
      cylinder(23, 23, 4, materials.brass, f, [0, 8.2, 0], 40);
      cylinder(8, 8, 22, materials.steel, f, [0, 18, 0], 20);
      // thread illusion
      const rings = new THREE.Group();
      for (let i = 0; i < 7; i++) {
        const r = torus(8.1, 0.45, materials.steelDark, rings, [0, 12 + i * 2.4, 0], [Math.PI / 2, 0, 0], 20, 4);
        r.raycast = () => {};
      }
      f.add(rings);
      addNut(f, 0, 20.7, 0, materials.steelDark, 13, 7);
      addNut(f, 0, 26.5, 0, materials.steelDark, 12, 5);
      cylinder(19, 22, 4, materials.castIronDark, f, [0, 28, 0], 24);
      feetGroup.add(f);
    }
    // ground contact shadows
    const shadowTex = makeGlowTexture(96, '#000', 'rgba(0,0,0,.9)', 'rgba(0,0,0,.3)');
    for (const [x, z] of [[-158, -110], [158, -110], [4, 138]]) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(142, 142), new THREE.MeshBasicMaterial({
        map: shadowTex, transparent: true, opacity: 0.42, color: 0x000000, depthWrite: false, toneMapped: false,
      }));
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, 0.28, z);
      m.renderOrder = 1;
      m.raycast = () => {};
      feetGroup.add(m);
    }
  }

  const baseGroup = new THREE.Group();
  baseGroup.name = 'Base';
  root.add(baseGroup);
  {
    const body = box(400, 80, 300, materials.castIron, baseGroup, [0, 60, 0], 5, 3, null, 'BaseCastBody');
    body.receiveShadow = true;
    // machined top plate
    box(396, 5, 296, materials.machined, baseGroup, [0, 102.5, 0], 1.6, 2, null, 'MachinedTop');
    // lower machined pad under the X slide
    box(214, 2.4, 184, materials.steelDark, baseGroup, [0, 101.6, 6], 0.8, 2);
    // recessed front panel
    box(266, 48, 3.2, materials.castIronDark, baseGroup, [0, 52, 150.7], 1.4, 2);
    // cross ribs: the visual motif of the HT200 casting
    const rib1 = box(232, 9, 5, materials.castIron, baseGroup, [0, 55, 153.2], 1.6, 2);
    rib1.rotation.z = 0.56;
    const rib2 = box(232, 9, 5, materials.castIron, baseGroup, [0, 55, 153.2], 1.6, 2);
    rib2.rotation.z = -0.56;
    // side insets
    box(2.4, 38, 198, materials.castIronDark, baseGroup, [-200.2, 61, -10], 0.8, 2);
    box(2.4, 38, 198, materials.castIronDark, baseGroup, [200.2, 61, -10], 0.8, 2);
    // lifting / drain bosses
    addHexVent(baseGroup, [-128, 40, 151], materials.steelDark, 8, 1.1);
    addHexVent(baseGroup, [128, 40, 151], materials.steelDark, 8, 1.1);
    // top perimeter fastener field
    addBolts(baseGroup, [
      [-180, 105, -134, 0, 0, 0], [180, 105, -134, 0, 0, 0],
      [-180, 105, 134, 0, 0, 0], [180, 105, 134, 0, 0, 0],
      [-90, 105, -134, 0, 0, 0], [90, 105, -134, 0, 0, 0],
      [-90, 105, 134, 0, 0, 0], [90, 105, 134, 0, 0, 0],
    ], materials.steel, 3.6, 2.2);
    // front mounting bolts
    addBolts(baseGroup, [
      [-169, 80, 151.8, Math.PI / 2, 0, 0], [169, 80, 151.8, Math.PI / 2, 0, 0],
      [-169, 36, 151.8, Math.PI / 2, 0, 0], [169, 36, 151.8, Math.PI / 2, 0, 0],
    ], materials.steelDark, 4.6, 2.7);
    const badge = addSmallDisplayLabel(baseGroup, [
      'IN-SITU  /  MS-04',
      'GEAR PROFILE METROLOGY 路 鍦ㄤ綅娴嬮噺',
    ], [0, 76, 152.05], [0, 0, 0], 150, 40, 0.7);
    addLinearTicks(baseGroup, {
      length: 120, count: 24, origin: [-72, 114, -140], axis: 'z', normal: 'y',
      majorEvery: 5, opacity: 0.3,
    });
    // spirit level near the front right, a small precision-instrument detail
    const bubbleG = new THREE.Group();
    bubbleG.position.set(148, 106, 104);
    cylinder(10, 10, 4.5, materials.blackAnodized, bubbleG, [0, 0, 0], 28);
    const glass = cylinder(8.2, 8.2, 2.2, materials.glass, bubbleG, [0, 2.4, 0], 28);
    glass.raycast = () => {};
    const bubble = cylinder(3.1, 3.1, 0.5, new THREE.MeshStandardMaterial({
      color: 0x9beec4, emissive: 0x226b48, emissiveIntensity: 0.45,
      roughness: 0.15, metalness: 0.0,
    }), bubbleG, [1.3, 3.55, 0], 20);
    bubble.raycast = () => {};
    baseGroup.add(bubbleG);
    setShadows(baseGroup, true, true);
    register('base', baseGroup);
  }

  /* ---------------------------------------------------------------- */
  /* HT150 control enclosure, E-stop, status LEDs                      */
  /* ---------------------------------------------------------------- */
  const controlBoxExpl = addExplode('controlBox', new THREE.Group(), root, [0, 0, 0], [170, 70, 120], 0.3);
  const controlBox = controlBoxExpl;
  const indicators = {};
  {
    const g = new THREE.Group();
    g.position.set(160, 118, 70);
    const shell = box(92, 122, 112, materials.castIron, g, [0, 46, 0], 3.5, 3, null, 'HT150ControlBox');
    box(82, 58, 2.4, materials.darkGlass, g, [0, 65, 56.6], 1.2, 2);
    box(96, 7, 118, materials.castIronDark, g, [0, 108, 0], 2, 2);
    box(84, 24, 1.8, materials.blackAnodized, g, [0, 21, 56.6], 1.2, 2);
    addBolts(g, [
      [-39, 100, 28, 0, 0, 0], [39, 100, 28, 0, 0, 0],
      [-39, 100, -28, 0, 0, 0], [39, 100, -28, 0, 0, 0],
    ], materials.steelDark, 3.3, 2);
    // top cable glands
    for (const x of [-24, 0, 24]) {
      cylinder(5, 6, 10, materials.blackAnodizedMatte, g, [x, 115, -22], 16);
      cylinder(2.8, 2.8, 2, materials.rubber, g, [x, 121, -22], 12);
    }
    // status light column
    const ledGroup = new THREE.Group();
    ledGroup.position.set(-28, 65, 57.6);
    for (let i = 0; i < 3; i++) {
      const col = [COLORS.cyan, COLORS.amber, COLORS.red][i];
      const mat = new THREE.MeshStandardMaterial({
        color: 0x11171d, emissive: col, emissiveIntensity: 0.08,
        roughness: 0.14, metalness: 0.25,
      });
      const lens = cylinder(3.4, 3.4, 2.0, mat, ledGroup, [0, 9 - i * 8, 0], 16);
      lens.rotation.x = Math.PI / 2;
      lens.raycast = () => {};
      indicators[['idle', 'run', 'error'][i]] = mat;
    }
    g.add(ledGroup);
    // labels
    addSmallDisplayLabel(g, [
      { text: 'METROLOGY CONTROL', size: 32, color: 'rgba(208,221,230,.62)' },
      { text: 'IDLE  路  READY  路  FAULT', size: 20, color: 'rgba(160,180,194,.38)' },
    ], [14, 81, 57.0], [0, 0, 0], 44, 24, 0.8);
    // E-stop RAL2004 style mushroom
    const estop = new THREE.Group();
    estop.position.set(28, 66, 58);
    const orange = new THREE.MeshStandardMaterial({
      color: 0xe8803a, roughness: 0.29, metalness: 0.34,
      emissive: 0x3b1203, emissiveIntensity: 0.18,
    });
    const bezel = cylinder(11.5, 11.5, 4, materials.blackAnodized, estop, [0, 0, 2], 32);
    bezel.rotation.x = Math.PI / 2;
    const btn = cylinder(8.7, 10.3, 6.5, orange, estop, [0, 0, 6.6], 32);
    btn.rotation.x = Math.PI / 2;
    const top = cylinder(7.1, 8.3, 2.8, orange, estop, [0, 0, 11.1], 32);
    top.rotation.x = Math.PI / 2;
    const symbol = new THREE.Mesh(
      new THREE.TorusGeometry(3.5, 0.55, 5, 24, Math.PI * 1.5),
      new THREE.MeshBasicMaterial({ color: 0x120b06 }),
    );
    symbol.position.set(0, 0, 12.6);
    estop.add(symbol);
    tagPart(estop, 'emergencyStop');
    (partGroups.emergencyStop ||= []).push(estop);
    g.add(estop);
    // tiny lower legend
    addSmallDisplayLabel(g, [
      { text: 'E-STOP', size: 28, color: 'rgba(232,128,58,.65)' },
      { text: 'PRESS TO HOLD', size: 17, color: 'rgba(190,200,210,.34)' },
    ], [28, 45, 57.0], [0, 0, 0], 27, 12, 0.62);
    // hinges / vents
    box(2.2, 48, 1.4, materials.steelDark, g, [-44.8, 64, 47.5], 0.6, 2);
    // cast rib around lower shell
    box(88, 3, 120, materials.castIronDark, g, [0, 108.4, 0], 1, 2);
    controlBox.add(g);
    setShadows(controlBox, true, true);
    register('controlBox', controlBox);
    register('emergencyStop', estop);
  }

  /* ---------------------------------------------------------------- */
  /* X-axis dovetail slide (fixed guide + moving saddle)               */
  /* ---------------------------------------------------------------- */
  const xGuideGroup = new THREE.Group();
  xGuideGroup.name = 'XAxisDovetailGuide';
  baseGroup.add(xGuideGroup);
  {
    // Dovetail profile extruded along Z. Sits on the machined base pad.
    const shape = new THREE.Shape();
    shape.moveTo(-84, 0);
    shape.lineTo(84, 0);
    shape.lineTo(84, 6);
    shape.lineTo(61, 18);
    shape.lineTo(-61, 18);
    shape.lineTo(-84, 6);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 176, bevelEnabled: true, bevelThickness: 1.2, bevelSize: 1.2,
      bevelSegments: 2, steps: 1,
    });
    geo.center();
    const fixed = new THREE.Mesh(geo, materials.castIronDark);
    fixed.position.set(0, 112, 10);
    fixed.castShadow = fixed.receiveShadow = true;
    xGuideGroup.add(fixed);
    // exposed machined dovetail surfaces
    for (const s of [-1, 1]) {
      const slideFace = box(17, 2.3, 172, materials.steel, xGuideGroup, [s * 72, 124.1, 10], 0.8, 2);
      slideFace.rotation.z = s * 0.36;
      // bronze gib strip
      const gib = box(2.2, 13, 150, materials.bronze, xGuideGroup, [s * 82.5, 119, 8], 0.5, 2);
      gib.rotation.z = s * 0.13;
    }
    addBolts(xGuideGroup, [
      [-66, 127, -72, 0, 0, 0], [66, 127, -72, 0, 0, 0],
      [-66, 127, 88, 0, 0, 0], [66, 127, 88, 0, 0, 0],
    ], materials.steel, 3.4, 2);
    addLinearTicks(xGuideGroup, {
      length: 130, count: 26, origin: [87, 121, -56], axis: 'z', normal: 'y',
      majorEvery: 5, opacity: 0.4,
    });
    // X hand wheel on the front
    const wheelG = new THREE.Group();
    wheelG.position.set(0, 105, 162);
    wheelG.rotation.x = Math.PI / 2;
    cylinder(5, 5, 12, materials.steel, wheelG, [0, 0, 0], 16);
    const wheel = new THREE.Group();
    wheel.rotation.x = Math.PI / 2;
    cylinder(20, 20, 4, knurlMat, wheel, [0, 0, 0], 38);
    cylinder(6, 6, 6, materials.blackAnodized, wheel, [0, 0, 0], 20);
    new Array(3).fill(0).forEach((_, i) => {
      const a = i * Math.PI * 2 / 3;
      const spoke = box(33, 2.2, 3, materials.steelDark, wheel, [0, 0, 0], 1, 1);
      spoke.rotation.z = a;
    });
    wheelG.add(wheel);
    xGuideGroup.add(wheelG);
    xGuideGroup.userData.wheel = wheel;
    register('xslide', xGuideGroup);
  }

  const xCarriage = new THREE.Group();
  xCarriage.name = 'XAxisMovingSaddle';
  xCarriage.position.set(0, 0, I.xCarriageOriginZ - I.xCoarseIdle);
  root.add(xCarriage);
  motion.xCarriage = xCarriage;
  {
    const saddle = new THREE.Group();
    xCarriage.add(saddle);
    box(176, 15, 154, materials.castIron, saddle, [0, 119, 6], 3, 3);
    box(158, 3, 142, materials.machined, saddle, [0, 127, 5], 0.8, 2);
    box(74, 7, 74, materials.steelDark, saddle, [0, 129.5, 70], 1.2, 2);
    // X lock lever
    const lock = new THREE.Group();
    lock.position.set(-72, 131, 52);
    cylinder(3.4, 3.4, 14, materials.steel, lock, [0, 0, 0], 16);
    const lever = box(4, 17, 4, knurlMat, lock, [0, 8, 0], 1, 2);
    lever.rotation.z = -0.35;
    cylinder(7, 7, 4, materials.blackAnodized, lock, [0, 16, 0], 24);
    xCarriage.add(lock);
    setShadows(saddle, true, true);
  }

  /* ---------------------------------------------------------------- */
  /* Column and cantilever                                            */
  /* ---------------------------------------------------------------- */
  const columnArmExpl = addExplode('columnArm', new THREE.Group(), xCarriage, [0, 0, 0], [0, 280, 140], 0.36);
  const columnArm = columnArmExpl;
  {
    const column = new THREE.Group();
    column.position.set(0, 0, 62);
    // mounting foot
    box(86, 14, 86, materials.castIronDark, column, [0, 129, 0], 2.2, 2);
    box(76, 5, 76, materials.machined, column, [0, 137, 0], 1, 2);
    addBolts(column, [
      [-32, 147, -32, 0, 0, 0], [32, 147, -32, 0, 0, 0],
      [-32, 147, 32, 0, 0, 0], [32, 147, 32, 0, 0, 0],
    ], materials.steel, 3.8, 2.4);
    // 60x60 square tube, 250 tall
    const tube = box(60, 250, 60, materials.aluminum, column, [0, 265, 0], 2.2, 3, null, 'ColumnTube');
    // vertical recessed grooves
    box(1.8, 214, 27, materials.aluminumDark, column, [-30.9, 262, 0], 0.6, 2);
    box(1.8, 214, 27, materials.aluminumDark, column, [30.9, 262, 0], 0.6, 2);
    box(27, 214, 1.8, materials.aluminumDark, column, [0, 262, -30.9], 0.6, 2);
    // top cap and arm mount
    box(76, 10, 76, materials.castIronDark, column, [0, 390, 0], 1.8, 2);
    box(72, 4, 72, materials.machined, column, [0, 396.5, 0], 1, 2);
    addBolts(column, [
      [-27, 400, -27, 0, 0, 0], [27, 400, -27, 0, 0, 0],
      [-27, 400, 27, 0, 0, 0], [27, 400, 27, 0, 0, 0],
    ], materials.steel, 4.3, 2.6);
    // vertical scale / identity
    addLinearTicks(column, {
      length: 212, count: 42, origin: [-31.2, 158, 17], axis: 'y', normal: 'z',
      majorEvery: 10, opacity: 0.22,
    });
    addSmallDisplayLabel(column, [
      { text: '6061-T6', size: 34, color: 'rgba(196,209,219,.50)' },
      { text: 'OPTICAL BENCH COLUMN 路 250', size: 18, color: 'rgba(155,174,189,.30)' },
    ], [31.1, 338, 0], [0, Math.PI / 2, 0], 96, 24, 0.6);
    // gusset shape in Y-Z, extruded in X
    const gusShape = new THREE.Shape();
    gusShape.moveTo(0, 0);
    gusShape.lineTo(-96, 0);
    gusShape.lineTo(-96, 54);
    gusShape.lineTo(-8, 54);
    gusShape.closePath();
    const gusGeo = new THREE.ExtrudeGeometry(gusShape, {
      depth: 10, bevelEnabled: true, bevelThickness: 1, bevelSize: 1,
      bevelSegments: 1, steps: 1,
    });
    gusGeo.rotateY(Math.PI / 2);
    const gusset = new THREE.Mesh(gusGeo, materials.aluminumDark);
    gusset.position.set(-10, 314, 62);
    gusset.castShadow = gusset.receiveShadow = true;
    column.add(gusset);
    // cantilever beam
    const arm = new THREE.Group();
    const armBeam = box(76, 28, 286, materials.aluminum, arm, [0, 352, -78], 3.2, 3, null, 'CantileverBeam');
    // End milled face and side pockets
    box(72, 3, 262, materials.machined, arm, [0, 367.4, -78], 1, 2);
    box(2, 18, 230, materials.aluminumDark, arm, [-38.2, 351, -82], 0.5, 2);
    box(2, 18, 230, materials.aluminumDark, arm, [38.2, 351, -82], 0.5, 2);
    box(58, 3, 185, materials.aluminumDark, arm, [0, 337.4, -75], 1, 2);
    // underside mounting rail
    box(332, 11, 92, materials.blackAnodized, arm, [0, 329, -190], 2, 2);
    // M8 fasteners at the column joint
    addBolts(arm, [
      [-26, 368, 44, 0, 0, 0], [26, 368, 44, 0, 0, 0],
      [-26, 368, 4, 0, 0, 0], [26, 368, 4, 0, 0, 0],
    ], materials.steel, 4.2, 2.6);
    // diagonal lightening recesses on the beam sides
    for (const s of [-1, 1]) {
      const pocket = box(1.3, 10, 96, materials.aluminumDark, arm, [s * 38.4, 348, -150], 0.4, 1);
      pocket.rotation.x = 0.16;
    }
    // Cable channel and clips along the side
    addCable(arm, [
      [-34, 378, 60], [-34, 382, 10], [-33, 379, -90], [-32, 365, -170], [-32, 346, -202],
    ], 2.1, materials.rubber);
    addCable(arm, [
      [32, 360, 40], [31, 356, -40], [30, 345, -132], [26, 336, -186],
    ], 1.4, materials.rubber);
    for (let z = 30; z > -170; z -= 42) {
      box(7, 5, 13, materials.blackAnodizedMatte, arm, [-35, 377, z], 1.3, 2);
    }
    column.add(arm);
    setShadows(column, true, true);
    columnArm.add(column);
    bindAnchor('column', column, [0, 310, -80]);
    register('column', column);
  }

  /* ---------------------------------------------------------------- */
  /* Y-axis: rail, ballscrew, motor, coupling, stage                   */
  /* ---------------------------------------------------------------- */
  const yDriveExpl = addExplode('yDrive', new THREE.Group(), xCarriage, [0, 0, 0], [0, 55, 220], 0.52);
  const yDrive = yDriveExpl;
  const yMotion = {};
  {
    // Main bridge plate below the arm.
    box(344, 10, 94, materials.blackAnodized, yDrive, [0, 323, -186], 2.4, 2);
    box(322, 5, 74, materials.machined, yDrive, [0, 329, -186], 1.2, 2);
    // left and right vertical supports
    for (const s of [-1, 1]) {
      box(28, 31, 84, materials.aluminumDark, yDrive, [s * 156, 310, -188], 2, 2);
      addBolts(yDrive, [
        [s * 156, 326, -220, Math.PI / 2, 0, 0], [s * 156, 326, -156, Math.PI / 2, 0, 0],
      ], materials.steel, 3.4, 2.1);
    }
    // Y rail (one P4 profile rail, two blocks)
    const railExp = addExplode('rail', new THREE.Group(), yDrive, [0, 0, 0], [0, 70, -150], 0.62);
    {
      const railBase = box(320, 12, 34, materials.steelDark, railExp, [0, 299, -215], 2, 2, null, 'P4RailBase');
      const strip = new THREE.Mesh(new THREE.BoxGeometry(314, 5, 11), materials.polishedSteel);
      strip.position.set(0, 307.6, -215);
      strip.castShadow = strip.receiveShadow = true;
      railExp.add(strip);
      // top and side bearing races
      for (const s of [-1, 1]) {
        const race = new THREE.Mesh(new THREE.BoxGeometry(312, 3.4, 5), materials.steel);
        race.position.set(0, 304.3, -215 + s * 10.7);
        race.castShadow = race.receiveShadow = true;
        railExp.add(race);
      }
      // mounting hole pattern
      const holes = [];
      for (let x = -145; x <= 145; x += 29) {
        holes.push([x, 301.3, -215 + 12]);
        holes.push([x, 301.3, -215 - 12]);
      }
      addBolts(railExp, holes.map(p => [p[0], p[1], p[2], Math.PI / 2, 0, 0]), materials.steelDark, 1.6, 1.2);
      addSmallDisplayLabel(railExp, [
        { text: 'P4 / 25 脳 320', size: 28, color: 'rgba(204,218,228,.55)' },
        { text: 'PRECISION LINEAR GUIDE', size: 16, color: 'rgba(160,180,194,.36)' },
      ], [0, 288.8, -230.8], [0, Math.PI, 0], 72, 18, 0.58);
      register('rail', railBase);
    }

    // Motor / coupling / screw subassemblies
    const motorExp = addExplode('motor', new THREE.Group(), yDrive, [0, 0, 0], [-430, 80, 80], 0.58);
    const motorGroup = new THREE.Group();
    motorGroup.position.set(-198, 312, -186);
    motorGroup.rotation.z = Math.PI / 2; // axis along X
    {
      const body = cylinder(21, 21, 54, materials.blackAnodized, motorGroup, [0, 6, 0], 32);
      cylinder(22, 22, 4, materials.steelDark, motorGroup, [0, -23, 0], 32);
      cylinder(23, 23, 6, materials.blackAnodized, motorGroup, [0, 35, 0], 32);
      cylinder(12, 12, 5, materials.machined, motorGroup, [0, 40, 0], 24);
      cylinder(5, 5, 22, materials.steel, motorGroup, [0, 51, 0], 16);
      // longitudinal details / motor ribs
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const fin = box(2.8, 42, 3.2, materials.blackAnodizedMatte, motorGroup, [Math.cos(a) * 20.6, 7, Math.sin(a) * 20.6], 0.8, 2);
        fin.rotation.y = -a;
      }
      const band = torus(21.6, 0.6, materials.steelDark, motorGroup, [0, 22, 0], [Math.PI / 2, 0, 0], 32, 5);
      const band2 = torus(21.6, 0.6, materials.steelDark, motorGroup, [0, -4, 0], [Math.PI / 2, 0, 0], 32, 5);
      addSmallDisplayLabel(motorGroup, [
        { text: 'N85BYGH', size: 30, color: 'rgba(208,220,230,.62)' },
        { text: '450A-04 路 0.4 N路m', size: 17, color: 'rgba(160,180,194,.38)' },
      ], [0, 7, 21.2], [0, Math.PI / 2, 0], 38, 14, 0.66);
      // cable bundle and rear connector
      const gland = cylinder(5, 5, 8, materials.blackAnodizedMatte, motorGroup, [0, -31, 0], 16);
      const cable = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -34, 0), new THREE.Vector3(0, -50, -4),
        new THREE.Vector3(-12, -72, -18), new THREE.Vector3(-40, -90, -48),
      ]);
      const cm = new THREE.Mesh(new THREE.TubeGeometry(cable, 24, 2.3, 5, false), materials.rubber);
      cm.castShadow = true;
      cm.raycast = () => {};
      motorGroup.add(cm);
      motorGroup.rotation.set(0, 0, -Math.PI / 2);
      // correct transform: build cylinder along Y, rotate it so axis is X
      motorGroup.rotation.set(0, 0, -Math.PI / 2);
      motorExp.add(motorGroup);
      setShadows(motorExp, true, true);
      tagPart(motorExp, 'motor');
      (partGroups.motor ||= []).push(motorExp);
      bindAnchor('motor', motorGroup, [0, 0, 0]);
    }

    const couplingExp = addExplode('coupling', new THREE.Group(), yDrive, [0, 0, 0], [-260, 120, 100], 0.5);
    const couplingGroup = new THREE.Group();
    couplingGroup.position.set(-137, 312, -186);
    couplingGroup.rotation.z = Math.PI / 2;
    {
      const rot = new THREE.Group();
      cylinder(12.5, 12.5, 11, materials.aluminum, rot, [0, -8, 0], 28);
      cylinder(12.5, 12.5, 11, materials.aluminum, rot, [0, 8, 0], 28);
      for (let i = 0; i < 4; i++) {
        const disc = cylinder(13.6, 13.6, 1.4, i % 2 ? materials.polishedSteel : materials.steel, rot, [0, -2.5 + i * 1.6, 0], 32);
        disc.scale.x = 0.96;
      }
      for (let i = 0; i < 4; i++) {
        const a = i * Math.PI / 2 + 0.4;
        const bolt = cylinder(1.2, 1.2, 25, materials.steel, rot, [Math.cos(a) * 8.2, 0, Math.sin(a) * 8.2], 6);
      }
      cylinder(4.8, 4.8, 31, materials.steel, rot, [0, 0, 0], 16);
      couplingGroup.add(rot);
      couplingGroup.userData.rotor = rot;
      couplingExp.add(couplingGroup);
      setShadows(couplingExp, true, true);
      tagPart(couplingExp, 'coupling');
      (partGroups.coupling ||= []).push(couplingExp);
      bindAnchor('coupling', couplingGroup);
    }

    const screwExp = addExplode('screw', new THREE.Group(), yDrive, [0, 0, 0], [60, 170, -210], 0.66);
    const screwGroup = new THREE.Group();
    screwGroup.position.set(30, 313, -186);
    screwGroup.rotation.z = -Math.PI / 2; // physical axis now along X
    const screwSpin = new THREE.Group();
    screwGroup.add(screwSpin);
    {
      const screwBody = cylinder(7.1, 7.1, 268, materials.steel, screwSpin, [0, 0, 0], 24);
      const threadGeo = createScrewThreadGeometry(250, 7.0, 0.72, 5);
      const thread = new THREE.Mesh(threadGeo, materials.polishedSteel);
      thread.castShadow = thread.receiveShadow = true;
      screwSpin.add(thread);
      screwGroup.userData.thread = thread;
      // journals spin with the screw; bearing sleeves around them stay static.
      cylinder(9.2, 9.2, 18, materials.machined, screwSpin, [0, -136, 0], 24);
      cylinder(9.2, 9.2, 18, materials.machined, screwSpin, [0, 136, 0], 24);
      screwExp.add(screwGroup);
      setShadows(screwExp, true, true);
      tagPart(screwExp, 'screw');
      (partGroups.screw ||= []).push(screwExp);
      bindAnchor('screw', screwGroup, [0, 0, 20]);
      motion.screwSpin = screwSpin;
    }

    // Fixed bearing block with cutaway cover.
    const bearingsExp = addExplode('bearingBlocks', new THREE.Group(), yDrive, [0, 0, 0], [250, 100, 30], 0.58);
    const bearingCovers = [];
    {
      // Left fixed block, axis converted from local +Y to world +X.
      const lblock = new THREE.Group();
      lblock.position.set(-104, 313, -186);
      lblock.rotation.z = -Math.PI / 2;
      cylinder(23, 23, 30, materials.castIronDark, lblock, [0, 0, 0], 32);
      cylinder(17, 17, 33, materials.steelDark, lblock, [0, 0, 0], 28);
      for (let k = 0; k < 2; k++) {
        const b = new THREE.Group();
        b.position.set(0, (k - 0.5) * 9.5, 0);
        cylinder(12.5, 12.5, 4, materials.polishedSteel, b, [0, 0, 0], 32);
        cylinder(7.5, 7.5, 5, materials.steelDark, b, [0, 0, 0], 24);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(9.7, 1.0, 6, 32), materials.steel);
        ring.rotation.x = Math.PI / 2;
        b.add(ring);
        lblock.add(b);
      }
      // The front cover is what opens in section view.
      const lCover = box(42, 42, 8, materials.aluminumDark, lblock, [0, 0, 19], 2, 2);
      const lCoverBolt = addBolts(lblock, [
        [-13, 13, 23.5, 0, 0, 0], [13, 13, 23.5, 0, 0, 0],
        [-13, -13, 23.5, 0, 0, 0], [13, -13, 23.5, 0, 0, 0],
      ], materials.steel, 2.5, 1.6);
      bearingCovers.push(lCover);
      bearingsExp.add(lblock);
      addSmallDisplayLabel(bearingsExp, [
        { text: 'FIXED / 7000C PAIR', size: 24, color: 'rgba(207,219,228,.52)' },
      ], [-104, 284, -154], [0, 0, 0], 54, 11, 0.55);

      // Right floating end block.
      const rblock = new THREE.Group();
      rblock.position.set(170, 313, -186);
      box(38, 38, 40, materials.aluminumDark, rblock, [0, 0, 0], 2, 2);
      cylinder(15, 15, 43, materials.steelDark, rblock, [0, 0, 0], 32);
      cylinder(8.6, 8.6, 52, materials.polishedSteel, rblock, [0, 0, 0], 24);
      addBolts(rblock, [
        [-13, 14, -17, 0, 0, 0], [13, 14, -17, 0, 0, 0],
        [-13, 14, 17, 0, 0, 0], [13, 14, 17, 0, 0, 0],
      ], materials.steel, 2.8, 1.8);
      bearingsExp.add(rblock);
      addSmallDisplayLabel(bearingsExp, [
        { text: 'FLOATING / DEEP GROOVE', size: 22, color: 'rgba(200,213,223,.44)' },
      ], [170, 285, -156], [0, 0, 0], 58, 11, 0.5);
      bearingsExp.userData.sectionHide = bearingCovers;
      setShadows(bearingsExp, true, true);
      register('bearingEnds', bearingsExp);
    }

    // Ball screw nut assembly (moves with the Y stage).
    const yCarriage = new THREE.Group();
    yCarriage.name = 'YStage';
    yDrive.add(yCarriage);
    motion.yCarriage = yCarriage;
    {
      const stagePlate = box(70, 17, 55, materials.blackAnodized, yCarriage, [0, 287, -220], 2, 2);
      box(56, 3, 45, materials.machined, yCarriage, [0, 296, -220], 1, 2);
      // two runner blocks on the P4 rail
      for (const sx of [-35, 35]) {
        box(54, 17, 38, materials.aluminumDark, yCarriage, [sx, 299, -215], 2, 2);
        box(40, 3, 2, materials.steel, yCarriage, [sx, 289, -234.2], 0.6, 1);
      }
      // double nut around the screw
      box(36, 28, 38, materials.bronze, yCarriage, [0, 313, -186], 2, 2);
      cylinder(15, 15, 12, materials.machined, yCarriage, [0, 313, -186], 28).rotation.z = Math.PI / 2;
      // vertical neck to the measurement head
      box(44, 56, 38, materials.aluminum, yCarriage, [0, 310, -214], 2.4, 3);
      box(74, 14, 62, materials.blackAnodized, yCarriage, [0, 281, -218], 2, 2);
      addBolts(yCarriage, [
        [-23, 318, -230.5, Math.PI / 2, 0, 0], [23, 318, -230.5, Math.PI / 2, 0, 0],
        [-23, 294, -230.5, Math.PI / 2, 0, 0], [23, 294, -230.5, Math.PI / 2, 0, 0],
      ], materials.steel, 3.2, 2);
      setShadows(yCarriage, true, true);
      tagPart(stagePlate, 'stage');
      // Tag the stage assembly representative parts carefully (not the whole
      // carriage, since the head contains more specific parts).
      (partGroups.stage ||= []).push(stagePlate);
    }
    motion.yStage = yCarriage;
    motion.railExp = railExp;
    motion.screwGroup = screwGroup;
    motion.couplingRotor = couplingGroup.userData.rotor;
    motion.motorRotor = motorGroup;
    motion.screwThread = screwGroup.userData.thread;
    motion.bearingCover = bearingsExp.userData.sectionHide;
    motion.motorGroup = motorGroup;
    motion.couplingGroup = couplingGroup;
    setShadows(yDrive, true, true);
    register('stage', yCarriage);
    register('screw', screwGroup);
    register('motor', motorExp);
    register('coupling', couplingExp);
    register('rail', railExp);
  }

  /* ---------------------------------------------------------------- */
  /* Dual locating balls                                               */
  /* ---------------------------------------------------------------- */
  const datumExp = addExplode('datumFrame', new THREE.Group(), yDrive, [0, 0, 0], [0, 60, 90], 0.6);
  const datumFrame = datumExp;
  {
    // slender bridge with a central clearance for the head
    box(330, 12, 24, materials.aluminum, datumFrame, [0, 276, -238], 2, 2);
    box(318, 2.2, 19, materials.machined, datumFrame, [0, 282.5, -238], 0.8, 1);
    for (const s of [-1, 1]) {
      box(12, 34, 24, materials.aluminumDark, datumFrame, [s * 152, 289, -238], 1.6, 2);
    }
    addBolts(datumFrame, [
      [-142, 284, -238, 0, 0, 0], [142, 284, -238, 0, 0, 0],
      [-105, 284, -238, 0, 0, 0], [105, 284, -238, 0, 0, 0],
    ], materials.steel, 3.5, 2.2);
    // datum beam engraved identity
    addSmallDisplayLabel(datumFrame, [
      { text: 'DATUM A鈥揃  /  k = 11', size: 26, color: 'rgba(118,220,231,.58)' },
      { text: 'W 258.88 mm', size: 16, color: 'rgba(150,184,194,.35)' },
    ], [0, 288, -250.1], [0, 0, 0], 72, 16, 0.7);
  }

  function makeBallA() {
    const wrapper = addExplode('ballA', new THREE.Group(), datumFrame, [-I.ballSpan, 0, 0], [-110, 10, -30], 0.78);
    const assembly = new THREE.Group();
    wrapper.add(assembly);
    const slider = new THREE.Group();
    assembly.add(slider);
    // fixed upper bracket + micrometer
    box(30, 18, 38, materials.aluminumDark, assembly, [0, 286, -238], 1.8, 2);
    const micro = createMicrometerHead(materials, knurlMat, { scale: 0.72 });
    micro.position.set(0, 296, -238);
    micro.rotation.set(0, 0, Math.PI / 2);
    assembly.add(micro);
    // 129 mm locating arm, ending above the ball seat so the sphere stays
    // fully exposed instead of being half-buried in the arm.
    const arm = box(20, 112, 30, materials.aluminum, slider, [0, 223.5, -238], 2, 2);
    box(2, 104, 22, materials.machined, slider, [10.2, 222, -238], 0.4, 1);
    addLinearTicks(slider, {
      length: 96, count: 20, origin: [10.8, 172, -228], axis: 'y', normal: 'x',
      majorEvery: 5, opacity: 0.35,
    });
    // clamp collar and M4 threaded ball seat
    box(28, 24, 36, materials.aluminumDark, slider, [0, 281, -238], 1.8, 2);
    cylinder(8.2, 8.2, 10, materials.steelDark, slider, [0, 163, -238], 20);
    cylinder(8.2, 8.2, 6, materials.brass, slider, [0, 169, -238], 24);
    // locating sphere (polished, mirror), tangent to the seat above
    const ball = sphere(8, materials.chrome, slider, [0, 150, -238], 32, 'LocatorBallA');
    bindAnchor('ballA', ball);
    register('ballA', slider);
    wrapper.userData.slider = slider;
    wrapper.userData.thimble = micro.userData.thimble;
    bindAnchor('armA', arm, [0, 0, 20]);
    return { wrapper, slider, micro, ball };
  }

  function makeBallB() {
    const wrapper = addExplode('ballB', new THREE.Group(), datumFrame, [I.ballSpan, 0, 0], [110, 10, -30], 0.78);
    const assembly = new THREE.Group();
    wrapper.add(assembly);
    box(34, 16, 36, materials.aluminumDark, assembly, [0, 287, -238], 1.8, 2);
    // short B arm and mini rail
    box(10, 39, 17, materials.aluminum, assembly, [0, 260, -238], 1.5, 2);
    const slider = new THREE.Group();
    assembly.add(slider);
    box(18, 8, 22, materials.steelDark, slider, [0, 249, -238], 1.2, 2);
    box(20, 40, 28, materials.aluminum, slider, [0, 222, -238], 1.8, 2);
    // The B carriage is shorter than A's; this shaft closes the 34 mm gap
    // between the sliding arm and the ball seat so B is visibly mounted.
    cylinder(3.2, 3.2, 36, materials.steel, slider, [0, 185, -238], 16);
    cylinder(8.2, 8.2, 10, materials.steelDark, slider, [0, 163, -238], 20);
    const ball = sphere(8, materials.chrome, slider, [0, 150, -238], 32, 'LocatorBallB');
    // B preload spring: anchored at the top, compresses as B follows the groove.
    const springGroup = new THREE.Group();
    springGroup.position.set(0, 266, -222);
    const springGeo = createCoilGeometry({ radius: 5.2, wire: 0.75, pitch: 3.1, turns: 9, segments: 24 });
    const spring = new THREE.Mesh(springGeo, materials.springSteel);
    spring.rotation.x = Math.PI;
    spring.position.y = -3;
    spring.castShadow = true;
    springGroup.add(spring);
    cylinder(2.2, 2.2, 25, materials.steelDark, springGroup, [0, -14, 0], 12);
    assembly.add(springGroup);
    const springTop = box(13, 5, 13, materials.blackAnodized, assembly, [0, 268, -222], 1, 2);
    const springBottom = box(12, 4, 12, materials.steel, slider, [0, 247, -222], 1, 2);
    bindAnchor('ballB', ball);
    register('ballB', slider);
    register('spring', springGroup);
    wrapper.userData.slider = slider;
    wrapper.userData.spring = springGroup;
    wrapper.userData.springMesh = spring;
    wrapper.userData.springLimits = [springTop, springBottom];
    bindAnchor('armB', assembly, [0, 260, 0]);
    return { wrapper, slider, springGroup, spring, ball };
  }

  const ballA = makeBallA();
  const ballB = makeBallB();
  // Tag the parent datum assembly only after children have their own tags.
  tagPart(datumFrame, 'dualBall');
  // But tagPart does not overwrite specific tags; ensure representative group is registered.
  (partGroups.dualBall ||= []).push(datumFrame);
  register('armA', ballA.wrapper);
  register('armB', ballB.wrapper);
  bindAnchor('dualBall', datumFrame, [0, 250, -238]);

  // Datum close-up fill: activated only while positioning so the two chrome
  // spheres read against the gear surface instead of reflecting the dark bay.
  const datumFill = new THREE.PointLight(0xffe2c2, 0, 230, 0);
  datumFill.position.set(0, 205, -188);
  datumFill.castShadow = false;
  datumFrame.add(datumFill);
  motion.datumFill = datumFill;

  // Datum pulse: red baseline with two amber locator halos.
  const pulseGroup = new THREE.Group();
  pulseGroup.visible = false;
  {
    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -I.ballSpan, 150, -238, I.ballSpan, 150, -238,
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(COLORS.red).multiplyScalar(1.45), transparent: true, opacity: 0.0,
      depthWrite: false, depthTest: false,
      blending: THREE.NormalBlending, toneMapped: false,
    });
    const line = new THREE.Line(geom, lineMat);
    line.renderOrder = 12;
    line.frustumCulled = false;
    line.raycast = () => {};
    pulseGroup.add(line);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(COLORS.amber).multiplyScalar(1.8),
      transparent: true, opacity: 0.0, depthWrite: false, depthTest: false,
      blending: THREE.NormalBlending, toneMapped: false,
    });
    const rings = [];
    for (let i = 0; i < 2; i++) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(12.4, 0.55, 5, 40), ringMat);
      r.rotation.x = Math.PI / 2;
      r.position.set((i ? 1 : -1) * I.ballSpan, 150, -238);
      r.renderOrder = 13;
      r.frustumCulled = false;
      r.raycast = () => {};
      pulseGroup.add(r);
      rings.push(r);
    }
    pulseGroup.userData = { line, lineMat, ringMat, rings, geom, time: 0 };
    datumFrame.add(pulseGroup);
  }

  // Y-drive motion details
  motion.screwAngle = 0;
  motion.xCoarse = I.xCoarseIdle;
  motion.ballDrop = 0;
  motion.ballA = ballA;
  motion.ballB = ballB;
  motion.pulseGroup = pulseGroup;
  motion.yDrive = yDrive;

  /* ---------------------------------------------------------------- */
  /* Reversal stage, cross-roller bearing and error-transfer head       */
  /* ---------------------------------------------------------------- */
  const headGroup = new THREE.Group();
  headGroup.name = 'ReversalAndTransferHead';
  motion.yStage.add(headGroup);
  motion.headGroup = headGroup;
  const rotor = new THREE.Group();
  rotor.name = 'ReversalRotor';
  rotor.position.set(0, 246, -215);
  headGroup.add(rotor);
  motion.rotor = rotor;

  const headAnchors = {};

  // Vertical bracket connecting the Y carriage to the rotary head.
  box(56, 26, 54, materials.aluminum, headGroup, [0, 274, -215], 2.4, 2);
  box(70, 9, 70, materials.blackAnodized, headGroup, [0, 286, -215], 2, 2);
  addBolts(headGroup, [
    [-22, 291, -232, 0, 0, 0], [22, 291, -232, 0, 0, 0],
    [-22, 291, -198, 0, 0, 0], [22, 291, -198, 0, 0, 0],
  ], materials.steel, 3.2, 2);

  // Fixed bearing outer frame + goniometer scale
  const bearingFixed = new THREE.Group();
  bearingFixed.position.set(0, 254, -215);
  headGroup.add(bearingFixed);
  {
    cylinder(30, 30, 16, materials.machined, bearingFixed, [0, 0, 0], 48);
    cylinder(24, 24, 17, materials.blackAnodized, bearingFixed, [0, 0.5, 0], 48);
    // fixed outer ring cutaway look: four arcs and bolts
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2 + Math.PI / 4;
      const clamp = box(14, 7, 20, materials.aluminumDark, bearingFixed, [Math.cos(a) * 28, 9, Math.sin(a) * 28], 1.3, 2);
      clamp.rotation.y = -a;
    }
    addDialTicks(bearingFixed, 37, 11, 96, 0x8fa9b8);
    // fixed angle index
    const idx = box(2.5, 4, 10, materials.cyanGlow, bearingFixed, [0, 12, 38], 0.4, 1);
    idx.raycast = () => {};
    // pointer to zero
    const pointer = new THREE.Mesh(new THREE.ConeGeometry(2.2, 8, 3), new THREE.MeshBasicMaterial({
      color: new THREE.Color(COLORS.cyan).multiplyScalar(1.6), toneMapped: false,
    }));
    pointer.position.set(0, 12.5, 42);
    pointer.rotation.x = Math.PI / 2;
    pointer.raycast = () => {};
    bearingFixed.add(pointer);
    const bearing = new THREE.Group();
    // visible crossed rollers
    const rollerGeo = new THREE.CylinderGeometry(1.25, 1.25, 6.5, 10);
    const rollers = new THREE.InstancedMesh(rollerGeo, materials.polishedSteel, 28);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * 21.2, 8.2, Math.sin(a) * 21.2);
      dummy.rotation.set(Math.PI / 2, 0, -a + (i % 2 ? Math.PI / 2 : 0));
      dummy.updateMatrix();
      rollers.setMatrixAt(i, dummy.matrix);
    }
    rollers.instanceMatrix.needsUpdate = true;
    rollers.castShadow = true;
    bearing.add(rollers);
    cylinder(17, 17, 9, materials.steelDark, bearing, [0, 8, 0], 32);
    rotor.add(bearing);
    rotor.userData.innerBearing = bearing;
    register('bearing', bearingFixed);
    bindAnchor('bearing', bearingFixed, [0, 8, 0]);
  }

  // Bearing inner rotor plate and 7075 base
  {
    cylinder(28, 28, 8, materials.aluminum7075, rotor, [0, 4, 0], 48);
    cylinder(22, 22, 10, materials.steel, rotor, [0, 0, 0], 32);
  }

  // Rack-and-pinion visible drive + locking pin
  const reversalMechanism = new THREE.Group();
  headGroup.add(reversalMechanism);
  {
    // curved rack attached to rotor
    const rackGroup = new THREE.Group();
    // Local to the rotor: rotate around the ruby axis instead of adding the
    // rotor's world offset a second time.
    rackGroup.position.set(0, 0, 0);
    const toothMat = materials.steel;
    const rackTeeth = [];
    const rackRadius = 62;
    for (let i = 0; i < 24; i++) {
      const a = (-36 + i * 3.1) * DEG;
      const pos = [Math.sin(a) * rackRadius, -7, Math.cos(a) * rackRadius];
      const b = box(3.2, 5, 5.5, toothMat, rackGroup, pos, 0.5, 1);
      b.rotation.y = a;
      rackTeeth.push(b);
    }
    const arc = torus(rackRadius, 2.2, materials.aluminumDark, rackGroup, [0, -10.5, 0], [Math.PI / 2, 0, 0], 48, 6);
    rackGroup.rotation.y = 0;
    rotor.add(rackGroup);
    rotor.userData.rack = rackGroup;
    // register rack separately
    tagPart(rackGroup, 'rack');
    (partGroups.rack ||= []).push(rackGroup);
    // pinion fixed to head bracket at the front, meshing with the curved rack
    const pinion = new THREE.Group();
    const gearData = createSimpleGearGeometry(40, 0.5, 7);
    const pinionMesh = new THREE.Mesh(gearData.geo, materials.polishedSteel);
    // gearData.geo is already built in the XZ plane; keep its axis vertical so
    // the pinion meshes with the horizontal curved rack instead of standing up
    // through the differential thimble.
    pinionMesh.castShadow = true;
    pinion.add(pinionMesh);
    cylinder(5, 5, 19, materials.steel, pinion, [0, 0, 0], 20);
    pinion.position.set(68, 239.5, -242);
    headGroup.add(pinion);
    motion.rackPinion = pinion;
    // differential thimble above the pinion
    const diff = createMicrometerHead(materials, knurlMat, { scale: 0.55 });
    diff.position.set(68, 259, -242);
    diff.rotation.x = 0;
    headGroup.add(diff);
    motion.reversalKnob = diff.userData.thimble;
    // Fixed yoke tying the outboard pinion/differential axis back to the head
    // bracket. Without it the whole visible drive appears to float beside the
    // rotor even though the gear itself meshes with the curved rack.
    box(42, 8, 16, materials.aluminum, headGroup, [47, 280, -230], 1.5, 2);
    box(8, 20, 10, materials.aluminumDark, headGroup, [68, 270, -230], 1.2, 2);
    box(8, 6, 14, materials.aluminumDark, headGroup, [68, 260, -236], 1.1, 2);
    addSmallDisplayLabel(headGroup, [
      { text: 'm 0.5  /  Z 40', size: 28, color: 'rgba(206,220,229,.52)' },
      { text: 'M4 DIFFERENTIAL', size: 16, color: 'rgba(155,175,189,.33)' },
    ], [68, 228, -231], [0, 0, 0], 48, 12, 0.6);
    // lock pin and knob
    const lockGroup = new THREE.Group();
    lockGroup.position.set(-63, 255, -238);
    box(20, 16, 26, materials.aluminumDark, lockGroup, [0, 12, 0], 1.5, 2);
    const pin = cylinder(2, 2, 22, materials.brass, lockGroup, [0, -2, 0], 18);
    cylinder(5.4, 5.4, 4, knurlMat, lockGroup, [0, 18, 0], 24);
    lockGroup.userData.pin = pin;
    headGroup.add(lockGroup);
    motion.lockPin = pin;
    motion.lockGroup = lockGroup;
    tagPart(lockGroup, 'reversalPin');
    (partGroups.reversalPin ||= []).push(lockGroup);
    bindAnchor('reversalPin', lockGroup, [0, 4, 0]);
    bindAnchor('rack', rackGroup, [0, -4, 42]);
  }

  /* ---------------------------------------------------------------- */
  /* Error transfer mechanism                                          */
  /* ---------------------------------------------------------------- */
  const transferExpl = addExplode('transfer', new THREE.Group(), rotor, [0, 0, 0], [0, -80, 40], 0.8);
  const transfer = transferExpl;
  const transferAnchors = {};

  // Rotating chassis of the head: open front, glass canopy.
  const headShell = new THREE.Group();
  transfer.add(headShell);
  {
    // 7075 base ring and frame
    box(112, 8, 102, materials.aluminum7075, headShell, [0, -58, 0], 2.4, 3);
    // side frames (open top/front). The near wall is removed in section.
    const nearWall = [];
    for (const s of [-1, 1]) {
      const side = box(7, 52, 102, materials.aluminumDark, headShell, [s * 52, -32, 0], 1.8, 3);
      // angular lightening cut implied by recess
      const inset = box(1.5, 23, 67, materials.blackAnodizedMatte, headShell, [s * 55.8, -30, 0], 0.5, 2);
      if (s === 1) nearWall.push(side, inset);
    }
    // rear frame and lower strip
    box(102, 52, 7, materials.aluminumDark, headShell, [0, -32, -49], 1.8, 3);
    box(94, 5, 4, materials.aluminum, headShell, [0, -57, 51], 1, 2);
    // top perimeter frame (clear central opening)
    box(112, 6, 7, materials.aluminumDark, headShell, [0, -5, -49], 1.4, 2);
    box(7, 6, 96, materials.aluminumDark, headShell, [-52, -5, 0], 1.4, 2);
    const topNear = box(7, 6, 96, materials.aluminumDark, headShell, [52, -5, 0], 1.4, 2);
    nearWall.push(topNear);
    // glass canopy, front
    const glass = box(88, 44, 2, materials.glass, headShell, [0, -31, 50], 1.2, 2);
    glass.raycast = () => {};
    glass.renderOrder = 4;
    const glassFrame = new THREE.Group();
    box(92, 3, 4, materials.aluminum, glassFrame, [0, -9, 51.2], 0.6, 2);
    box(92, 3, 4, materials.aluminum, glassFrame, [0, -53, 51.2], 0.6, 2);
    box(3, 44, 4, materials.aluminum, glassFrame, [-45, -31, 51.2], 0.6, 2);
    box(3, 44, 4, materials.aluminum, glassFrame, [45, -31, 51.2], 0.6, 2);
    headShell.add(glassFrame);
    // section edge marker
    const sectionFrame = new THREE.Group();
    sectionFrame.visible = false;
    const boxGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(96, 48, 4));
    const edges = new THREE.LineSegments(boxGeo, new THREE.LineBasicMaterial({
      color: 0x9ddbe5, transparent: true, opacity: 0.55, toneMapped: false,
    }));
    edges.position.set(0, -31, 50.5);
    edges.raycast = () => {};
    sectionFrame.add(edges);
    headShell.add(sectionFrame);
    headShell.userData.sectionHide = [glass, glassFrame, ...nearWall];
    headShell.userData.sectionShow = [sectionFrame];
    // internal LED light strip and hazard micro-label
    const stripMat = new THREE.MeshStandardMaterial({
      color: 0x16130d, emissive: 0xffb46e, emissiveIntensity: 0.8,
      roughness: 0.3, metalness: 0.1,
    });
    box(48, 1.2, 1.1, stripMat, headShell, [0, -9, -41], 0.2, 1);
    // M2.5 probe aperture ring
    cylinder(7, 8, 5, materials.steelDark, headShell, [0, -60, 0], 24);
    addBolts(headShell, [
      [-44, -54, 50, Math.PI / 2, 0, 0], [44, -54, 50, Math.PI / 2, 0, 0],
      [-44, -17, 50, Math.PI / 2, 0, 0], [44, -17, 50, Math.PI / 2, 0, 0],
    ], materials.steel, 2.2, 1.6);
    addSmallDisplayLabel(headShell, [
      { text: 'MICRO TRANSFER', size: 22, color: 'rgba(200,225,232,.45)' },
      { text: '3 : 1  /  ±5° LIMIT', size: 14, color: 'rgba(140,178,190,.32)' },
    ], [0, -56, 52.2], [0, 0, 0], 58, 13, 0.55);
    // register a small internal shell as section-cut surface
    const cutSurfMat = materials.machinedEdge.clone();
    cutSurfMat.side = THREE.DoubleSide;
    const cutFace = new THREE.Mesh(new THREE.PlaneGeometry(88, 40), cutSurfMat);
    cutFace.position.set(0, -31, 49.0);
    cutFace.visible = false;
    cutFace.raycast = () => {};
    headShell.add(cutFace);
    headShell.userData.cutFace = cutFace;
    // Local warm source for the open transfer bay. It is deliberately small:
    // the scene's key light stays cool and broad, while this light gives the
    // micrometer-scale mechanism readable relief in the close-up.
    const bayLight = new THREE.PointLight(0xffd7b3, 1.8, 260, 0);
    bayLight.position.set(0, -31, 24);
    bayLight.castShadow = false;
    headShell.add(bayLight);
    headShell.userData.bayLight = bayLight;
    setShadows(headShell, true, true);
  }

  // Flexure hinge
  const flexureExpl = addExplode('flexure', new THREE.Group(), transfer, [0, 0, 0], [-120, 180, 100], 1.02);
  {
    const flex = new THREE.Group();
    flex.position.set(-15, -46, 0);
    // vertical single leaf, clamped top and bottom
    const leaf = box(14, 8, 0.45, materials.bronze, flex, [0, 0, 0], 0.3, 1, null, 'SingleLeafSpring');
    box(15, 3, 4, materials.steelDark, flex, [0, 5, 0], 0.7, 2);
    box(15, 3, 4, materials.steelDark, flex, [0, -5, 0], 0.7, 2);
    // pivot post
    box(8, 13, 8, materials.aluminum, flex, [-7.5, 0, 0], 1, 2);
    transfer.add(flex);
    flexureExpl.add(flex);
    register('flexure', leaf);
    bindAnchor('flexure', leaf, [0, 0, 1]);
    flexureExpl.userData.leaf = leaf;
  }

  // Lever (probe arm 15 mm / sensor arm 45 mm 鈫?exact 3:1)
  const leverExpl = addExplode('lever', new THREE.Group(), transfer, [0, 0, 0], [150, 45, 130], 1.08);
  let leverPivot;
  {
    leverPivot = new THREE.Group();
    leverPivot.position.set(-15, -46, 0);
    // bar extends from local x=0 at pivot toward +x. Probe pickup at +15, sensor at +45.
    const bar = box(66, 6, 10, materials.aluminum, leverPivot, [18, 0, 0], 1.2, 2, null, 'PrecisionLever');
    box(10, 7, 12, materials.steelDark, leverPivot, [15, 0, 0], 1, 2);
    cylinder(3.4, 3.4, 8, materials.steel, leverPivot, [15, 0, 0], 16);
    box(12, 7, 9, materials.brass, leverPivot, [45, 0, 0], 1, 2);
    // stylus neck / ruby stylus assembly
    const stylusExpl = addExplode('stylus', new THREE.Group(), transfer, [0, 0, 0], [-120, -310, 0], 1.15);
    const stylusMotion = new THREE.Group();
    stylusMotion.position.set(0, 0, 0);
    stylusExpl.add(stylusMotion);
    {
      const collet = cylinder(4.6, 4.6, 9, materials.steelDark, stylusMotion, [0, -45.5, 0], 20);
      const rod = cylinder(1.5, 1.5, 44.5, materials.tungsten, stylusMotion, [0, -68.25, 0], 20, null, null, 'TungstenStylus');
      const neck = cylinder(2.2, 1.2, 4.2, materials.tungsten, stylusMotion, [0, -92.2, 0], 18);
      const ruby = sphere(1.7, materials.ruby, stylusMotion, [0, -96, 0], 32, 'RubyProbe');
      // Ruby centre sits at local y=-96 => world y=150, inside the real slot
      // opened between the visual tooth flanks. The neck ends at the sphere's
      // north pole; the ruby itself remains fully exposed.
      register('ruby', ruby);
      bindAnchor('ruby', ruby);
      transferAnchors.ruby = ruby;
      const stylusGroup = new THREE.Group();
      stylusGroup.add(collet, rod, neck, ruby);
      stylusMotion.add(stylusGroup);
      tagPart(stylusMotion, 'stylus');
      (partGroups.stylus ||= []).push(stylusMotion);
      bindAnchor('stylus', rod, [0, 0, 0]);
      stylusMotion.userData.rod = rod;
      stylusMotion.userData.ruby = ruby;
      stylusExpl.userData.motion = stylusMotion;
      levers: {
        // inner flex link between probe and lever, visible as a small bronze ribbon
        const link = box(3, 10, 1.2, materials.bronze, stylusMotion, [0, -44.5, 0], 0.3, 1);
        link.rotation.x = 0.1;
      }
    }
    transfer.add(stylusExpl);
    leverExpl.add(leverPivot);
    transfer.add(leverExpl);
    register('lever', bar);
    bindAnchor('lever', bar, [0, 3, 0]);
    // sensor pickup plunger and LVDT
    const lvdtExpl = addExplode('lvdt', new THREE.Group(), transfer, [0, 0, 0], [280, 30, -80], 1.22);
    {
      const ly = -46, lx = 30;
      const housing = cylinder(8, 8, 40, materials.steel, lvdtExpl, [lx, ly, -38], 32);
      housing.rotation.x = Math.PI / 2;
      // rings / lock nuts
      for (const z of [-20, -55]) {
        const nut = cylinder(10.5, 10.5, 4, materials.steelDark, lvdtExpl, [lx, ly, z], 24);
        nut.rotation.x = Math.PI / 2;
      }
      cylinder(4.2, 4.2, 7, materials.aluminumDark, lvdtExpl, [lx, ly, -12], 20).rotation.x = Math.PI / 2;
      const plunger = cylinder(1.35, 1.35, 39, materials.polishedSteel, lvdtExpl, [lx, ly, -7], 16);
      plunger.rotation.x = Math.PI / 2;
      const plungerTip = sphere(2.0, materials.polishedSteel, lvdtExpl, [lx, ly, 12.5], 18);
      // cable from rear
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(lx, ly, -58), new THREE.Vector3(30, ly + 4, -68),
        new THREE.Vector3(25, ly + 30, -60), new THREE.Vector3(18, -7, -20),
      ]);
      const cable = new THREE.Mesh(new THREE.TubeGeometry(curve, 30, 1.2, 5, false), materials.rubber);
      cable.castShadow = true; cable.raycast = () => {};
      lvdtExpl.add(cable);
      transfer.add(lvdtExpl);
      tagPart(lvdtExpl, 'lvdt');
      (partGroups.lvdt ||= []).push(lvdtExpl);
      bindAnchor('lvdt', housing);
      lvdtExpl.userData.plunger = plungerTip;
      lvdtExpl.userData.plungerRod = plunger;
      lvdtExpl.userData.anchor = housing;
    }
    // preload spring acting along z on the lever
    const springExpl = addExplode('preloadSpring', new THREE.Group(), transfer, [0, 0, 0], [-190, 20, 140], 1.26);
    {
      const sg = new THREE.Group();
      sg.position.set(20, -42, -24);
      const coil = new THREE.Mesh(createCoilGeometry({ radius: 3.8, wire: 0.6, pitch: 2.9, turns: 7, segments: 22 }), materials.springSteel);
      coil.rotation.x = Math.PI / 2;
      coil.position.z = -2;
      coil.castShadow = true;
      sg.add(coil);
      box(9, 8, 5, materials.steelDark, sg, [0, 0, -24], 1, 2);
      cylinder(2.5, 2.5, 17, materials.steel, sg, [0, 0, 0], 16);
      transfer.add(springExpl);
      springExpl.add(sg);
      register('spring', coil);
      bindAnchor('spring', coil, [0, 0, 0]);
      springExpl.userData.coil = coil;
    }
    // PTFE limit blocks at ±5°
    const limitGroup = new THREE.Group();
    for (const s of [-1, 1]) {
      const lb = box(8, 10, 4, materials.ptfe, limitGroup, [30, -46, s * 9.5], 0.6, 2);
      lb.rotation.x = s * 0.03;
    }
    transfer.add(limitGroup);
    // pivot bridge and sensor indicator
    box(39, 3, 7, materials.aluminumDark, transfer, [0, -39, 0], 0.8, 2);
    // mechanical scale behind lever
    addLinearTicks(transfer, {
      length: 54, count: 18, origin: [-6, -35, -52], axis: 'x', normal: 'y',
      majorEvery: 3, color: 0x9dbcc8, opacity: 0.35,
    });
    // include mechanical limit labels
    addSmallDisplayLabel(transfer, [
      { text: '±5°', size: 24, color: 'rgba(210,224,230,.42)' },
    ], [31, -33, -2], [0, 0, 0], 18, 10, 0.55);
    motion.leverPivot = leverPivot;
    motion.flexureExpl = flexureExpl;
    motion.stylusExpl = stylusExpl;
    motion.stylusMotion = stylusExpl.userData.motion;
    motion.lvdtExpl = lvdtExpl;
    motion.springExpl = springExpl;
    motion.transfer = transfer;
    setShadows(transfer, true, true);
  }

  /* ---------------------------------------------------------------- */
  /* Final assembly, initial pose, and API                             */
  /* ---------------------------------------------------------------- */
  // Rack pinion and reversal knob initial pose.
  motion.alphaTarget = CFG.reversal.angle;
  motion.alphaCurrent = CFG.reversal.angle;

  // Initial X position / Y stage / alpha / balls.
  xCarriage.position.z = I.xCarriageOriginZ - I.xCoarseIdle;
  motion.yStage.position.x = 0;
  rotor.rotation.y = -deg(CFG.reversal.angle);
  motion.lockPin.position.y = 8;
  motion.lockPin.visible = false;

  // Status light references and LED pulse
  motion.indicators = indicators;

  // Update helper: all motion is rebuilt from one authoritative state.
  motion.apply = ({ s, xCoarse, alphaDeg, ballDrop, visualDelta, forceN, lockPinned, motorAngle, micrometer = 0, headLift = 0 }) => {
    motion.xCoarse = xCoarse;
    xCarriage.position.z = I.xCarriageOriginZ - xCoarse;
    const stageGroup = motion.yStage;
    const stageX = s - CFG.scan.length / 2;
    stageGroup.position.x = stageX;
    stageGroup.position.y = headLift;
    motion.screwAngle = motorAngle;
    if (motion.screwSpin) motion.screwSpin.rotation.y = motorAngle;
    if (motion.couplingRotor) motion.couplingRotor.rotation.y = -motorAngle;
    if (motion.reversalKnob) motion.reversalKnob.rotation.y = deg(alphaDeg) * 4.2;
    if (motion.rackPinion) motion.rackPinion.rotation.y = -deg(alphaDeg) * 6.2;
    rotor.rotation.y = -deg(alphaDeg);
    // The pin drops home at the end of the reversal.
    const pinTarget = lockPinned ? 8 : 20.5;
    motion.lockPin.position.y += (pinTarget - motion.lockPin.position.y) * 0.18;
    motion.lockPin.visible = true;
    // Dual locating balls. The visual gear has a closed top face, so stop the
    // ball centres at the tooth-top datum instead of letting the spheres sink
    // through the solid teaching model. At full drop the ball is tangent to
    // the gear face (centre 168, radius 8).
    const drop = clamp(ballDrop, 0, 1);
    const ballY = lerp(182, 150, drop);
    ballA.slider.position.y = ballY - 150;
    ballB.slider.position.y = ballY - 150;
    const compression = 1 - 0.13 * drop - clamp((forceN - 0.1) / 0.4, 0, 1) * 0.035;
    const sg = ballB.springGroup;
    sg.scale.y = compression;
    sg.position.y = 266 + (ballY - 150) * 0.34;
    ballA.micro.userData.thimble.rotation.y = -deg(drop * 78) + micrometer * 7.5;
    ballA.slider.position.x = clamp(micrometer, -0.99, 0.99) * 2.2;
    // Visual micro-displacement bounded by the ±5° mechanical stop.
    const v = clamp(visualDelta, -1.32, 1.32);
    const theta = v / 15;
    leverPivot.rotation.y = -theta;
    motion.stylusMotion.position.z = v;
    if (motion.flexureExpl?.userData.leaf) {
      motion.flexureExpl.userData.leaf.rotation.y = -theta * 0.18;
    }
    if (motion.lvdtExpl?.userData.plunger) {
      motion.lvdtExpl.userData.plunger.position.z = 12.5 + v * 3;
      motion.lvdtExpl.userData.plungerRod.position.z = -7 + v * 3;
    }
    if (motion.springExpl?.userData.coil) {
      motion.springExpl.userData.coil.position.z = -2 - v * 0.55;
    }
    motion.visualDelta = v;
    // Keep the virtual baseline aligned with the actual ball centres even
    // while the spring-loaded B ball settles into its tooth gap.
    const line = pulseGroup.userData.line;
    const pos = line.geometry.attributes.position.array;
    pos[1] = ballY + 4;
    pos[4] = ballY + 4;
    line.geometry.attributes.position.needsUpdate = true;
    for (let i = 0; i < pulseGroup.userData.rings.length; i++) {
      pulseGroup.userData.rings[i].position.y = ballY + 4;
    }
    anchors.alphaWorld = rotor;
  };

  // A compact function to begin/clear the datum pulse.
  motion.setDatumPulse = (on, strength = 1) => {
    pulseGroup.visible = on;
    pulseGroup.userData.target = strength;
  };

  // Register explicit click targets for the head components that were tagged
  // after their groups were merged.
  // The component map is used by the raycaster and inspector.
  const partObjects = partGroups;
  motion.anchors = anchors;
  motion.partObjects = partObjects;
  motion.explodeGroups = explodeGroups;
  motion.transferAnchors = transferAnchors;
  motion.headShell = headShell;
  motion.sectionHide = headShell.userData.sectionHide;
  motion.sectionShow = headShell.userData.sectionShow;
  motion.bearingSectionHide = motion.bearingCover;

  // Set nice initial pose.
  motion.apply({
    s: 0, xCoarse: I.xCoarseIdle, alphaDeg: CFG.reversal.angle,
    ballDrop: 0, visualDelta: 0, forceN: 0.3, lockPinned: false, motorAngle: 0,
  });

  setShadows(root, true, true);
  // Disable shadow casting for glass and thin cosmetic labels.
  root.traverse(o => {
    if (o.isMesh && o.material?.transparent) { o.castShadow = false; o.receiveShadow = false; }
  });

  // Annotation anchors for macro callouts
  anchors.ballA = anchors.ballA || null;

  return {
    root, motion, anchors, partGroups, explodeGroups, clickables,
    initialXCoarse: I.xCoarseIdle,
    measurementXCoarse: I.xCoarseMeasurement,
  };
}

