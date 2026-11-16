import * as THREE from 'three';
import { LAYOUT, CFG, DEG } from './config.js';
import {
  clamp, setShadows, tagPart, textPlane, makeContactShadowTexture, mulberry32, cylinder,
} from './utils.js';

const PITCH_DEG = 360 / CFG.gear.Z; // 3.673469°
const TOOTH_CENTERS_DEG = Array.from({ length: 8 }, (_, i) => -26.0 + i * PITCH_DEG);
// Put the ruby-probe gap at the right-hand end of the exposed arc, so the
// enormous gear field sits to the left of the instrument in the hero framing.
// The two locator balls (±129.44 mm) land in the adjacent teeth gaps.
const GAP_ALIGN_DEG = (TOOTH_CENTERS_DEG[6] + TOOTH_CENTERS_DEG[7]) / 2; // -2.122°
const TOOTH_CENTERS = TOOTH_CENTERS_DEG.map(d => d * DEG);

function topSurface(r0, r1, a0, a1, y, segments, material) {
  const nA = Math.max(2, segments);
  const pos = [], uv = [], idx = [];
  const rows = 2;
  for (let i = 0; i < rows; i++) {
    const r = i === 0 ? r0 : r1;
    for (let j = 0; j <= nA; j++) {
      const a = a0 + (a1 - a0) * (j / nA);
      pos.push(Math.sin(a) * r, y, Math.cos(a) * r);
      uv.push((r - r0) / Math.max(1, r1 - r0), j / nA);
    }
  }
  for (let i = 0; i < 1; i++) {
    for (let j = 0; j < nA; j++) {
      const p = i * (nA + 1) + j;
      idx.push(p, p + nA + 1, p + nA + 2, p, p + nA + 2, p + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, material);
}

function bottomSurface(r0, r1, a0, a1, y, segments, material) {
  const nA = Math.max(2, segments);
  const pos = [], idx = [];
  for (let i = 0; i < 2; i++) {
    const r = i === 0 ? r0 : r1;
    for (let j = 0; j <= nA; j++) {
      const a = a0 + (a1 - a0) * (j / nA);
      pos.push(Math.sin(a) * r, y, Math.cos(a) * r);
    }
  }
  for (let j = 0; j < nA; j++) {
    const p = j;
    idx.push(p, p + 1, p + nA + 2, p, p + nA + 2, p + nA + 1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, material);
}

function cylindricalWall(r, a0, a1, y0, y1, segments, material, inward = false) {
  const nA = Math.max(2, segments);
  const pos = [], idx = [];
  for (let j = 0; j <= nA; j++) {
    const a = a0 + (a1 - a0) * (j / nA);
    pos.push(Math.sin(a) * r, y0, Math.cos(a) * r);
    pos.push(Math.sin(a) * r, y1, Math.cos(a) * r);
  }
  // pairs bottom,top per angular station
  for (let j = 0; j < nA; j++) {
    const b0 = j * 2, t0 = j * 2 + 1, b1 = (j + 1) * 2, t1 = (j + 1) * 2 + 1;
    if (!inward) idx.push(b0, b1, t1, b0, t1, t0);
    else idx.push(b0, t1, b1, b0, t0, t1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, material);
}

function radialEndFace(r0, r1, a, y0, y1, material, outwardTangent = true) {
  const pos = [
    Math.sin(a) * r0, y0, Math.cos(a) * r0,
    Math.sin(a) * r0, y1, Math.cos(a) * r0,
    Math.sin(a) * r1, y1, Math.cos(a) * r1,
    Math.sin(a) * r1, y0, Math.cos(a) * r1,
  ];
  const idx = outwardTangent ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, material);
  return mesh;
}

function makeToothHalfGeometry(sign, yMin, yMax, layers = 10) {
  const tip = 2100;
  const root = 2038;
  const rootHalf = 0.0315;
  const profile = [
    { r: root, a: -rootHalf },
    { r: root + 11, a: -rootHalf * 0.94 },
    { r: 2056, a: -0.0238 },
    { r: 2073, a: -0.0178 },
    { r: 2089, a: -0.0128 },
    { r: 2096, a: -0.0103 },
    { r: tip, a: -0.0069 },
    { r: tip, a: 0.0069 },
    { r: 2096, a: 0.0103 },
    { r: 2089, a: 0.0128 },
    { r: 2073, a: 0.0178 },
    { r: 2056, a: 0.0238 },
    { r: root + 11, a: rootHalf * 0.94 },
    { r: root, a: rootHalf },
  ];
  // Root arc between positive and negative root corners (reverse direction)
  for (let k = 1; k < 5; k++) {
    const t = k / 5;
    profile.push({ r: root, a: rootHalf + (-rootHalf - rootHalf) * t });
  }
  const nP = profile.length;
  const midY = 80;
  const tangent = Math.tan(CFG.gear.beta) / LAYOUT.gear.pitchR;
  const pos = [], idx = [];
  for (let l = 0; l <= layers; l++) {
    const t = l / layers;
    const y = yMin + (yMax - yMin) * t;
    const twist = sign * (y - midY) * tangent;
    for (let p = 0; p < nP; p++) {
      const { r, a } = profile[p];
      const angle = a + twist;
      pos.push(Math.sin(angle) * r, y, Math.cos(angle) * r);
    }
  }
  const layerVerts = nP;
  for (let l = 0; l < layers; l++) {
    for (let p = 0; p < nP; p++) {
      const a = l * layerVerts + p;
      const b = l * layerVerts + (p + 1) % nP;
      const c = (l + 1) * layerVerts + (p + 1) % nP;
      const d = (l + 1) * layerVerts + p;
      idx.push(a, b, d, b, c, d);
    }
  }
  // caps
  function addCap(level, upward) {
    const y = level === 0 ? yMin : yMax;
    const base = pos.length / 3;
    let cx = 0, cz = 0;
    for (let p = 0; p < nP; p++) {
      const i = (level * nP + p) * 3;
      pos.push(pos[i], y, pos[i + 2]);
      cx += pos[i]; cz += pos[i + 2];
    }
    cx /= nP; cz /= nP;
    pos.push(cx, y, cz);
    const centerIdx = base + nP;
    for (let p = 0; p < nP; p++) {
      const p1 = base + p;
      const p2 = base + (p + 1) % nP;
      if (upward) idx.push(centerIdx, p1, p2);
      else idx.push(centerIdx, p2, p1);
    }
  }
  addCap(0, false);
  addCap(layers, true);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

function makeWebGeometry(a0, a1, rIn, rOut, height, holes) {
  const shape = new THREE.Shape();
  const outerPts = [];
  const innerPts = [];
  const seg = 100;
  for (let i = 0; i <= seg; i++) {
    const a = a0 + (a1 - a0) * (i / seg);
    // After rotation.x = -90°, x -> x and y -> -z.
    outerPts.push(new THREE.Vector2(Math.sin(a) * rOut, -Math.cos(a) * rOut));
    innerPts.push(new THREE.Vector2(Math.sin(a) * rIn, -Math.cos(a) * rIn));
  }
  const pts = outerPts.concat(innerPts.reverse());
  shape.setFromPoints(pts);
  if (THREE.ShapeUtils.isClockWise(shape.getPoints())) {
    shape.setFromPoints(pts.reverse());
  }
  for (const hole of holes) {
    const path = new THREE.Path();
    const cx = Math.sin(hole.a) * hole.r;
    const cy = -Math.cos(hole.a) * hole.r;
    path.absarc(cx, cy, hole.radius, 0, Math.PI * 2, false);
    shape.holes.push(path);
  }
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelThickness: 2.2,
    bevelSize: 3.5,
    bevelSegments: 2,
    curveSegments: 48,
    steps: 1,
  });
  geo.rotateX(-Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

function addGearMarks(group, materials, a0, a1) {
  const positions = [];
  const rand = mulberry32(91);
  for (let r = LAYOUT.gear.innerR + 35; r < LAYOUT.gear.rootR - 10; r += 24) {
    const y = r > LAYOUT.gear.webOuterR ? LAYOUT.gear.topY + 0.18 : LAYOUT.gear.webTopY + 0.18;
    const segs = 78;
    for (let i = 0; i < segs; i++) {
      const a = a0 + (a1 - a0) * (i / segs);
      const b = a0 + (a1 - a0) * ((i + 1) / segs);
      if (rand() < 0.2) continue;
      positions.push(Math.sin(a) * r, y, Math.cos(a) * r);
      positions.push(Math.sin(b) * r, y, Math.cos(b) * r);
    }
  }
  // sparse radial grinding ticks
  for (let i = 0; i < 38; i++) {
    const a = a0 + (a1 - a0) * rand();
    const r0 = LAYOUT.gear.innerR + 30 + rand() * 110;
    const r1 = r0 + 20 + rand() * 80;
    const y = LAYOUT.gear.webTopY + 0.2;
    positions.push(Math.sin(a) * r0, y, Math.cos(a) * r0);
    positions.push(Math.sin(a) * r1, y, Math.cos(a) * r1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const mat = new THREE.LineBasicMaterial({
    color: 0x4F6070, transparent: true, opacity: 0.11, depthWrite: false, toneMapped: false,
  });
  const lines = new THREE.LineSegments(geo, mat);
  lines.raycast = () => {};
  group.add(lines);
}

function addTopEdges(group) {
  const mat = new THREE.LineBasicMaterial({
    color: 0x344553, transparent: true, opacity: 0.32, depthWrite: false, toneMapped: false,
  });
  const arcs = [
    { r: LAYOUT.gear.innerR + 1.5, y: LAYOUT.gear.webTopY + 0.35 },
    { r: LAYOUT.gear.webOuterR - 1.2, y: LAYOUT.gear.webTopY + 0.35 },
    { r: LAYOUT.gear.webOuterR + 1.2, y: LAYOUT.gear.topY + 0.35 },
    { r: LAYOUT.gear.rootR - 0.8, y: LAYOUT.gear.topY + 0.35 },
    { r: 1990, y: LAYOUT.gear.topY + 0.35 },
  ];
  const pts = [];
  for (const arc of arcs) {
    for (let i = 0; i < 100; i++) {
      const a = (-29.0 + i * 0.31) * DEG;
      const b = (-29.0 + (i + 1) * 0.31) * DEG;
      pts.push(Math.sin(a) * arc.r, arc.y, Math.cos(a) * arc.r);
      pts.push(Math.sin(b) * arc.r, arc.y, Math.cos(b) * arc.r);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const line = new THREE.LineSegments(geo, mat);
  line.raycast = () => {};
  group.add(line);
}

function addRaisedSectorBand(group, materials, {
  r0, r1, y0, y1, a0, a1, topMaterial, sideMaterial, segments = 100,
}) {
  const g = new THREE.Group();
  g.add(topSurface(r0, r1, a0, a1, y1, segments, topMaterial));
  g.add(cylindricalWall(r0, a0, a1, y0, y1, segments, sideMaterial, true));
  g.add(cylindricalWall(r1, a0, a1, y0, y1, segments, sideMaterial, false));
  g.add(radialEndFace(r0, r1, a0, y0, y1, sideMaterial, false));
  g.add(radialEndFace(r0, r1, a1, y0, y1, sideMaterial, true));
  group.add(g);
  return g;
}

function addGearFixtureDetails(group, materials, a0, a1) {
  const yTop = LAYOUT.gear.topY;
  const yWeb = LAYOUT.gear.webTopY;

  // Raised inner register and outer loading shoulder give the flat gear face
  // readable stepped structure under grazing studio light.
  addRaisedSectorBand(group, materials, {
    r0: LAYOUT.gear.innerR + 2, r1: LAYOUT.gear.innerR + 62,
    y0: yWeb, y1: yWeb + 10, a0, a1,
    topMaterial: materials.gearMachined, sideMaterial: materials.gearCut, segments: 100,
  });
  addRaisedSectorBand(group, materials, {
    r0: 1882, r1: 1932,
    y0: yTop, y1: yTop + 7, a0, a1,
    topMaterial: materials.gearCut, sideMaterial: materials.gearBody, segments: 100,
  });
  // Narrow raised chamfer tracks around the load shoulder.
  addRaisedSectorBand(group, materials, {
    r0: 1872, r1: 1882, y0: yTop, y1: yTop + 1.4, a0, a1,
    topMaterial: materials.gearMachined, sideMaterial: materials.gearMachined, segments: 100,
  });
  addRaisedSectorBand(group, materials, {
    r0: 1932, r1: 1944, y0: yTop, y1: yTop + 1.4, a0, a1,
    topMaterial: materials.gearMachined, sideMaterial: materials.gearMachined, segments: 100,
  });

  // Recessed grooves read as large circular machining stations.
  for (const r of [1450, 1848]) {
    const band = topSurface(r, r + 4.5, a0, a1, yWeb + 0.7, 100, materials.gearGroove);
    band.raycast = () => {};
    group.add(band);
  }

  // Chamfered rims of the three large lightening apertures.
  const holeSpecs = [
    { a: -25.2, r: 1660, radius: 118 },
    { a: -17.6, r: 1680, radius: 148 },
    { a: -9.1, r: 1670, radius: 135 },
  ];
  for (const hole of holeSpecs) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(hole.radius - 1.5, hole.radius + 9, 56),
      materials.gearMachined,
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(Math.sin(hole.a * DEG) * hole.r, yWeb + 0.85, Math.cos(hole.a * DEG) * hole.r);
    ring.raycast = () => {};
    group.add(ring);
  }

  // A bolt circle on the web adds a human-scale reference against the 4.2 m
  // workpiece. Each boss is a recessed socket head.
  const boltGroup = new THREE.Group();
  const angles = [-26.9, -24.0, -21.0, -14.2, -11.8, -6.0, -3.6, -0.9];
  for (const degA of angles) {
    const a = degA * DEG;
    const r = 1408;
    const boss = new THREE.Group();
    boss.position.set(Math.sin(a) * r, yWeb + 5, Math.cos(a) * r);
    cylinder(24, 27, 10, materials.gearBody, boss, [0, 0, 0], 24);
    const socket = cylinder(12.2, 12.2, 2.4, materials.gearGroove, boss, [0, 5.6, 0], 6);
    socket.raycast = () => {};
    boltGroup.add(boss);
  }
  group.add(boltGroup);

  // Small reference pads along the cut ends: they frame the section face and
  // make the edge read as a deliberately prepared exhibition section.
  for (const a of [a0, a1]) {
    for (const r of [1370, 1440]) {
      const pad = new THREE.Group();
      pad.position.set(Math.sin(a) * r, yTop + 0.3, Math.cos(a) * r);
      const plate = cylinder(17, 19, 5, materials.gearCut, pad, [0, 0, 0], 6);
      plate.rotation.y = a;
      group.add(pad);
    }
  }
}

function addGearLabel(group, materials) {
  const plate = textPlane([
    'IN-SITU  /  HERRINGBONE GEAR RING',
    'Φ4200  ·  Z 98  ·  mn 8  ·  β 28°21′27″  ·  CLASS 4',
  ], {
    width: 660, height: 118,
    textureOptions: {
      width: 1400, height: 250, align: 'center', color: 'rgba(35,48,60,.58)',
      dim: 'rgba(52,69,83,.38)', padding: 26,
    },
    opacity: 0.7,
    material: new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }),
  });
  const a = -17.2 * DEG;
  const r = 1930;
  const pivot = new THREE.Group();
  pivot.position.set(Math.sin(a) * r, LAYOUT.gear.topY + 0.55, Math.cos(a) * r);
  pivot.rotation.y = a;
  plate.rotation.x = -Math.PI / 2;
  plate.rotation.z = 0;
  plate.position.y = 0;
  pivot.add(plate);
  group.add(pivot);
}

export function createGear(materials, contactWorld, instrumentYaw) {
  const group = new THREE.Group();
  group.name = 'GearSector';

  const a0 = LAYOUT.gear.sectorStartDeg * DEG;
  const a1 = LAYOUT.gear.sectorEndDeg * DEG;
  const rIn = LAYOUT.gear.innerR;
  const rWebOut = LAYOUT.gear.webOuterR;
  const rRoot = LAYOUT.gear.rootR;
  const yWeb = LAYOUT.gear.webTopY;
  const yTop = LAYOUT.gear.topY;

  // Web with three large lightening apertures.
  const holes = [
    { a: -25.2 * DEG, r: 1660, radius: 118 },
    { a: -17.6 * DEG, r: 1680, radius: 148 },
    { a: -9.1 * DEG, r: 1670, radius: 135 },
  ];
  const webGeo = makeWebGeometry(a0, a1, rIn, rWebOut, yWeb, holes);
  const web = new THREE.Mesh(webGeo, materials.gearWeb);
  web.position.y = 0;
  web.castShadow = true;
  web.receiveShadow = true;
  group.add(web);

  // Raised outer rim. The top is split into a painted body land and a
  // machined ground land with no coplanar overlays (avoids depth fighting).
  group.add(topSurface(rWebOut, rRoot - 44, a0, a1, yTop, 112, materials.gearBody));
  group.add(topSurface(rRoot - 44, rRoot, a0, a1, yTop, 112, materials.gearMachined));
  group.add(bottomSurface(rWebOut, rRoot, a0, a1, 0, 48, materials.gearWeb));
  group.add(cylindricalWall(rRoot, a0, a1, 0, yTop, 112, materials.gearMachined, false));
  group.add(cylindricalWall(rWebOut, a0, a1, yWeb, yTop, 112, materials.gearCut, true));
  const a0FaceRim = radialEndFace(rWebOut, rRoot, a0, 0, yTop, materials.gearCut, false);
  const a1FaceRim = radialEndFace(rWebOut, rRoot, a1, 0, yTop, materials.gearCut, true);
  group.add(a0FaceRim, a1FaceRim);

  // Tooth halves: 8 herringbone teeth (visual sector). The left and right helices
  // meet at a visible central relief gap.
  const gap = 2.4;
  const upperGeo = makeToothHalfGeometry(1, 80 + gap / 2, yTop, LAYOUT.gear.toothLayers);
  const lowerGeo = makeToothHalfGeometry(-1, 0, 80 - gap / 2, LAYOUT.gear.toothLayers);
  const toothMat = materials.gearMachined.clone();
  toothMat.side = THREE.DoubleSide;
  toothMat.color = new THREE.Color(0x626D77);
  toothMat.roughness = 0.52;
  toothMat.metalness = 0.48;
  toothMat.clearcoat = 0.1;
  toothMat.clearcoatRoughness = 0.45;
  const upperTooth = new THREE.InstancedMesh(upperGeo, toothMat, TOOTH_CENTERS.length);
  const lowerTooth = new THREE.InstancedMesh(lowerGeo, toothMat, TOOTH_CENTERS.length);
  upperTooth.name = 'HerringboneTeethUpper';
  lowerTooth.name = 'HerringboneTeethLower';
  const dummy = new THREE.Object3D();
  TOOTH_CENTERS.forEach((a, i) => {
    dummy.position.set(0, 0, 0);
    dummy.rotation.set(0, a, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    upperTooth.setMatrixAt(i, dummy.matrix);
    lowerTooth.setMatrixAt(i, dummy.matrix);
  });
  upperTooth.instanceMatrix.needsUpdate = true;
  lowerTooth.instanceMatrix.needsUpdate = true;
  upperTooth.castShadow = lowerTooth.castShadow = true;
  upperTooth.receiveShadow = lowerTooth.receiveShadow = true;
  upperTooth.computeBoundingSphere?.();
  lowerTooth.computeBoundingSphere?.();
  group.add(upperTooth, lowerTooth);

  // A dark undercut ring hint separates the two herringbone hands at mid-face.
  const undercut = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 1, 12, 1, true),
    materials.gearGroove,
  );
  undercut.visible = false;
  group.add(undercut);

  addGearFixtureDetails(group, materials, a0, a1);
  addGearMarks(group, materials, a0, a1);
  addTopEdges(group);

  // Cut-face accent edges.
  const cutEdgePts = [];
  for (const a of [a0, a1]) {
    for (const r of [rIn, rWebOut, rRoot]) {
      cutEdgePts.push(Math.sin(a) * r, 0.2, Math.cos(a) * r);
      cutEdgePts.push(Math.sin(a) * r, r === rRoot ? yTop + 0.2 : yWeb + 0.2, Math.cos(a) * r);
    }
  }
  const cutEdgeGeo = new THREE.BufferGeometry();
  cutEdgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(cutEdgePts, 3));
  const cutEdges = new THREE.LineSegments(cutEdgeGeo, new THREE.LineBasicMaterial({
    color: 0x526471, transparent: true, opacity: 0.25, depthWrite: false, toneMapped: false,
  }));
  cutEdges.raycast = () => {};
  group.add(cutEdges);

  addGearLabel(group, materials);

  // Align a tooth-space centre with the ruby probe. Rcontact is inside the
  // tooth radial band so the small spheres can descend into the open gap.
  const Rcontact = LAYOUT.gear.pitchR;
  const outward = new THREE.Vector2(Math.sin(instrumentYaw), Math.cos(instrumentYaw));
  const cx = contactWorld.x - outward.x * Rcontact;
  const cz = contactWorld.z - outward.y * Rcontact;
  group.position.set(cx, 0, cz);
  group.rotation.y = instrumentYaw - GAP_ALIGN_DEG * DEG;

  // Anchor used by engineering callouts and exploded labels.
  const gapA = GAP_ALIGN_DEG * DEG;
  const anchor = new THREE.Object3D();
  anchor.position.set(Math.sin(gapA) * 2020, yTop + 3, Math.cos(gapA) * 2020);
  group.add(anchor);

  const shadowMat = new THREE.MeshBasicMaterial({
    map: makeContactShadowTexture(256, 0.82),
    transparent: true, opacity: 0.38, color: 0x000000, depthWrite: false,
    polygonOffset: true, polygonOffsetFactor: -1,
  });
  const contactShadow = new THREE.Mesh(new THREE.PlaneGeometry(2600, 1600), shadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.set(Math.sin(gapA) * 1990, 0.45, Math.cos(gapA) * 1990);
  contactShadow.rotation.z = GAP_ALIGN_DEG * DEG;
  contactShadow.raycast = () => {};
  contactShadow.renderOrder = 1;
  group.add(contactShadow);

  tagPart(group, 'gear');
  setShadows(group, true, true);
  group.traverse(o => {
    if (o.isMesh && o.material && o.material.transparent) { o.castShadow = false; o.receiveShadow = false; }
  });
  // The large gear benefits from receiving but not self-shadowing every fine piece.
  web.castShadow = true;

  return {
    group,
    anchor,
    center: new THREE.Vector3(cx, 0, cz),
    contact: new THREE.Vector3(contactWorld.x, 0, contactWorld.z),
    gapAlignDeg: GAP_ALIGN_DEG,
    toothCentersDeg: TOOTH_CENTERS_DEG,
    toothPitchDeg: PITCH_DEG,
    a0,
    a1,
    yWeb,
    yTop,
    teeth: [upperTooth, lowerTooth],
    bodyMeshes: [web],
  };
}
