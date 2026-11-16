import * as THREE from 'three';
import {
  makeNoiseTexture, makeCastTexture, makeFloorTexture, makeTextTexture, makeDialTexture, makeGlowTexture,
} from './utils.js';
import { COLORS } from './config.js';

function std(params) {
  return new THREE.MeshStandardMaterial(params);
}
function phys(params) {
  return new THREE.MeshPhysicalMaterial(params);
}

export function createMaterials(renderer) {
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const brushed = makeNoiseTexture({ size: 256, base: 136, amp: 22, horizontal: true, seed: 22 });
  brushed.anisotropy = anisotropy;
  brushed.repeat.set(5, 2);
  const cast = makeCastTexture(256, 12);
  cast.anisotropy = anisotropy;
  cast.repeat.set(2.4, 2.4);
  const rubberNoise = makeNoiseTexture({ size: 128, base: 80, amp: 30, seed: 9 });
  rubberNoise.repeat.set(5, 5);
  const floorTex = makeFloorTexture(512, 31);
  floorTex.anisotropy = anisotropy;
  floorTex.repeat.set(3, 3);
  const gearRough = makeNoiseTexture({ size: 512, base: 120, amp: 28, horizontal: false, seed: 61, blur: true });
  gearRough.anisotropy = anisotropy;
  gearRough.repeat.set(4, 2);

  const mats = {
    floor: new THREE.ShadowMaterial({
      color: 0x2A4664, opacity: 0.13, transparent: true, depthWrite: false,
    }),
    floorRing: std({
      map: floorTex, color: 0xC9D4DF, metalness: 0.08, roughness: 0.76,
      envMapIntensity: 0.58,
    }),
    displayBase: std({
      color: 0x1E2A35, metalness: 0.48, roughness: 0.55, envMapIntensity: 0.8,
    }),
    castIron: phys({
      color: 0x414B55, metalness: 0.55, roughness: 0.56,
      roughnessMap: cast, clearcoat: 0.12, clearcoatRoughness: 0.52,
      envMapIntensity: 1.12,
    }),
    castIronDark: phys({
      color: 0x2D363F, metalness: 0.52, roughness: 0.58,
      roughnessMap: cast, clearcoat: 0.08, clearcoatRoughness: 0.58,
      envMapIntensity: 1.02,
    }),
    machined: phys({
      color: 0x929CA5, metalness: 0.92, roughness: 0.29,
      roughnessMap: brushed, clearcoat: 0.16, clearcoatRoughness: 0.32,
      envMapIntensity: 1.45, anisotropy: 0.35,
    }),
    machinedEdge: phys({
      color: 0xb5bec6, metalness: 0.96, roughness: 0.20,
      clearcoat: 0.2, clearcoatRoughness: 0.2, envMapIntensity: 1.55,
    }),
    aluminum: phys({
      color: 0xA1ABB4, metalness: 0.84, roughness: 0.34,
      roughnessMap: brushed, clearcoat: 0.18, clearcoatRoughness: 0.42,
      envMapIntensity: 1.4, anisotropy: 0.28,
    }),
    aluminumDark: phys({
      color: 0x6E7882, metalness: 0.82, roughness: 0.39,
      roughnessMap: brushed, clearcoat: 0.12, clearcoatRoughness: 0.5,
      envMapIntensity: 1.18,
    }),
    aluminum7075: phys({
      color: 0x8E99A3, metalness: 0.86, roughness: 0.32,
      clearcoat: 0.15, clearcoatRoughness: 0.35, envMapIntensity: 1.32,
    }),
    blackAnodized: phys({
      color: 0x1F2B35, metalness: 0.72, roughness: 0.37,
      roughnessMap: cast, clearcoat: 0.16, clearcoatRoughness: 0.32,
      envMapIntensity: 1.10,
    }),
    blackAnodizedMatte: phys({
      color: 0x17222B, metalness: 0.55, roughness: 0.6,
      roughnessMap: cast, clearcoat: 0.06, clearcoatRoughness: 0.65,
      envMapIntensity: 0.92,
    }),
    polishedSteel: phys({
      color: 0xDDE5EB, metalness: 1.0, roughness: 0.075,
      clearcoat: 0.45, clearcoatRoughness: 0.04, envMapIntensity: 1.9,
    }),
    steel: phys({
      color: 0xABB4BC, metalness: 0.96, roughness: 0.20,
      roughnessMap: brushed, clearcoat: 0.18, clearcoatRoughness: 0.2,
      envMapIntensity: 1.55, anisotropy: 0.22,
    }),
    steelDark: phys({
      color: 0x747E88, metalness: 0.93, roughness: 0.31,
      roughnessMap: brushed, envMapIntensity: 1.22,
    }),
    tungsten: phys({
      color: 0xC7CFD6, metalness: 1.0, roughness: 0.12,
      clearcoat: 0.35, clearcoatRoughness: 0.08, envMapIntensity: 1.72,
    }),
    chrome: phys({
      color: 0xE3EAF0, metalness: 1.0, roughness: 0.06,
      clearcoat: 0.55, clearcoatRoughness: 0.04, envMapIntensity: 2.05,
    }),
    ruby: phys({
      color: 0xc5153f, metalness: 0.28, roughness: 0.055,
      clearcoat: 1.0, clearcoatRoughness: 0.012,
      ior: 1.76, sheen: 0.45, sheenColor: 0xff8da0,
      emissive: 0x540414, emissiveIntensity: 0.55,
      envMapIntensity: 2.2,
    }),
    bronze: phys({
      color: 0xb98243, metalness: 0.9, roughness: 0.28,
      clearcoat: 0.22, clearcoatRoughness: 0.3, envMapIntensity: 1.35,
      anisotropy: 0.2,
    }),
    brass: phys({
      color: 0xc6a05d, metalness: 0.93, roughness: 0.27,
      clearcoat: 0.25, envMapIntensity: 1.25,
    }),
    springSteel: phys({
      color: 0x6d7a84, metalness: 0.92, roughness: 0.3,
      clearcoat: 0.15, envMapIntensity: 1.1,
    }),
    rubber: std({
      color: 0x0b0d0f, metalness: 0.02, roughness: 0.94,
      roughnessMap: rubberNoise, envMapIntensity: 0.35,
    }),
    ptfe: std({
      color: 0xe4e3dc, metalness: 0.0, roughness: 0.63, envMapIntensity: 0.5,
    }),
    glass: phys({
      color: 0x6E8FA3, metalness: 0.05, roughness: 0.08,
      transparent: true, opacity: 0.36, clearcoat: 1, clearcoatRoughness: 0.04,
      envMapIntensity: 1.9, side: THREE.DoubleSide, depthWrite: false,
    }),
    darkGlass: phys({
      color: 0x101B24, metalness: 0.25, roughness: 0.12,
      transparent: true, opacity: 0.58, clearcoat: 0.8,
      envMapIntensity: 1.5, side: THREE.DoubleSide, depthWrite: false,
    }),
    gearBody: phys({
      color: 0x525D68, metalness: 0.48, roughness: 0.44,
      roughnessMap: gearRough, clearcoat: 0.24, clearcoatRoughness: 0.40,
      envMapIntensity: 1.26, anisotropy: 0.32,
    }),
    gearWeb: phys({
      color: 0x3B4650, metalness: 0.28, roughness: 0.56,
      roughnessMap: cast, clearcoat: 0.22, clearcoatRoughness: 0.48,
      envMapIntensity: 1.20,
    }),
    gearMachined: phys({
      color: 0x7E8993, metalness: 0.74, roughness: 0.38,
      roughnessMap: brushed, clearcoat: 0.23, clearcoatRoughness: 0.36,
      envMapIntensity: 1.26, anisotropy: 0.4,
    }),
    gearCut: phys({
      color: 0x808B95, metalness: 0.52, roughness: 0.44,
      clearcoat: 0.15, envMapIntensity: 1.16,
    }),
    gearGroove: phys({
      color: 0x333C45, metalness: 0.7, roughness: 0.7,
      envMapIntensity: 0.60,
    }),
    accentLine: new THREE.LineBasicMaterial({
      color: COLORS.cyan, transparent: true, opacity: 0.48, toneMapped: false, depthWrite: false,
    }),
    cyanGlow: new THREE.MeshBasicMaterial({
      color: new THREE.Color(COLORS.cyan).multiplyScalar(3.5), toneMapped: false,
    }),
    amberGlow: new THREE.MeshBasicMaterial({
      color: new THREE.Color(COLORS.amber).multiplyScalar(3.8), toneMapped: false,
    }),
    redGlow: new THREE.MeshBasicMaterial({
      color: new THREE.Color(COLORS.red).multiplyScalar(3.2), toneMapped: false,
    }),
    greenGlow: new THREE.MeshBasicMaterial({
      color: new THREE.Color(COLORS.green).multiplyScalar(2.8), toneMapped: false,
    }),
    contactShadow: new THREE.MeshBasicMaterial({
      map: makeGlowTexture(128, '#000', 'rgba(0,0,0,.95)', 'rgba(0,0,0,.58)'),
      transparent: true, opacity: 0.30, depthWrite: false,
      color: 0x000000, blending: THREE.NormalBlending, toneMapped: false,
    }),
    pointDot: new THREE.PointsMaterial({
      size: 4.2, map: makeGlowTexture(64, '#A94B0B', 'rgba(255,250,242,1)', 'rgba(169,75,11,.72)'), color: new THREE.Color(COLORS.amber).multiplyScalar(1.4),
      transparent: true, depthWrite: false, blending: THREE.NormalBlending,
      sizeAttenuation: true, toneMapped: false, opacity: 1.0,
    }),
    pointDotCyan: new THREE.PointsMaterial({
      size: 3.2, map: makeGlowTexture(64, '#0E7490', 'rgba(248,253,255,1)', 'rgba(14,116,144,.66)'), color: new THREE.Color(COLORS.cyan).multiplyScalar(1.25),
      transparent: true, depthWrite: false, blending: THREE.NormalBlending,
      sizeAttenuation: true, toneMapped: false, opacity: 0.8,
    }),
    sectionLine: new THREE.LineBasicMaterial({
      color: 0x2E93A4, transparent: true, opacity: 0.78, toneMapped: false, depthWrite: false,
    }),
    hatch: std({
      color: 0x79838D, metalness: 0.72, roughness: 0.42, envMapIntensity: 1.12,
    }),
  };

  // Per-label materials are cloned in the instrument builder.
  mats._textures = {
    brushed, cast, rubberNoise, floorTex, gearRough,
  };
  mats._rendererAnisotropy = anisotropy;
  return mats;
}

export function makePlateLabel(lines, widthMM, heightMM, opts = {}) {
  const {
    align = 'left', color = '#d7e1e8', width = 1024, height = 256, opacity = 0.76, rotation = 0,
  } = opts;
  const tex = makeTextTexture(lines, {
    width, height, align, color, padding: 30,
    dim: 'rgba(188,205,218,.58)',
    font: '500',
  });
  const mat = new THREE.MeshBasicMaterial({
    map: tex, transparent: true, depthWrite: false, toneMapped: false,
    opacity, side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(widthMM, heightMM), mat);
  mesh.rotation.z = rotation;
  mesh.userData.noShadow = true;
  mesh.raycast = () => {};
  return mesh;
}

export function makeDialPlane(sizeMM, opts = {}) {
  const tex = makeDialTexture(opts);
  const mat = new THREE.MeshBasicMaterial({
    map: tex, transparent: true, depthWrite: false, toneMapped: false,
    opacity: 0.8, side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(new THREE.CircleGeometry(sizeMM / 2, 64), mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.userData.noShadow = true;
  mesh.raycast = () => {};
  return mesh;
}

export function createIndicatorMaterial(color, intensity = 2.6) {
  return new THREE.MeshStandardMaterial({
    color: 0x0b0f12, emissive: color, emissiveIntensity: intensity,
    metalness: 0.3, roughness: 0.22, toneMapped: false,
  });
}
