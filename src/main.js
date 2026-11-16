import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  CFG, LAYOUT, COLORS, DEG, FSM_LABELS, STEPS, PARTS,
} from './config.js';
import {
  clamp, lerp, damp, signedDeg, makeGlowTexture, makeContactShadowTexture,
} from './utils.js';
import { createMaterials } from './materials.js';
import { createStageEnvironment } from './environment.js';
import { createInstrument } from './instrument.js';
import { createGear } from './gear.js';
import { createPostPipeline } from './post.js';
import { MeasurementEngine, TOL, U, LENGTH } from './measurement.js';
import { ProfileChart } from './charts.js';
import { AudioEngine } from './audio.js';
import { CameraDirector } from './camera.js';
import { AnnotationSystem } from './annotations.js';

const $ = id => document.getElementById(id);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const app = $('app');
const stage = $('stage');

const dom = {
  topStatus: $('topStatus'), topStatusText: $('topStatusText'),
  qualitySelect: $('qualitySelect'), labelToggle: $('labelToggle'),
  soundToggle: $('soundToggle'), volumeWrap: $('volumeWrap'), volumeRange: $('volumeRange'),
  helpButton: $('helpButton'),
  canvasHost: $('canvasHost'), labelLayer: $('labelLayer'), leaderSvg: $('leaderSvg'),
  consoleScroll: $('consoleScroll'),
  workpiece: document.querySelector('.workpiece-card'),
  observationHud: document.querySelector('.observation-hud'),
  hudSpeed: $('hudSpeed'), hudObs: $('hudObs'), hudMag: $('hudMag'), hudSignal: $('hudSignal'),
  cameraRail: document.querySelector('.camera-rail'),
  stageCaption: document.querySelector('.stage-caption'),
  heroStatement: document.querySelector('.hero-statement'),
  modeCaption: $('modeCaption'), modeEyebrow: $('modeEyebrow'), modeTitle: $('modeTitle'), modeCopy: $('modeCopy'),
  datumLive: $('datumLive'), datumState: $('datumState'), datumFill: $('datumFill'), datumU: $('datumU'),
  orbitHint: $('orbitHint'),
  micronScale: $('micronScale'), scaleMag: $('scaleMag'), scaleFill: $('scaleFill'),
  scaleMarker: $('scaleMarker'), scaleDelta: $('scaleDelta'), scaleNote: $('scaleNote'),
  cinemaLayer: $('cinemaLayer'), cinemaTime: $('cinemaTime'), cinemaTitle: $('cinemaTitle'),
  cinemaCopy: $('cinemaCopy'), cinemaProgress: $('cinemaProgress'),
  dock: $('dock'), dockFace: $('dockFace'), processSteps: $('processSteps'),
  btnPlay: $('btnPlay'), btnPause: $('btnPause'), btnPlayText: $('btnPlayText'),
  timelineRange: $('timelineRange'), timelineRead: $('timelineRead'), timelineFill: $('timelineFill'),
  timelineSamples: $('timelineSamples'), timelineKnob: $('timelineKnob'), timelineTrack: $('timelineTrack'),
  dockObserve: $('dockObserve'),
  fsStatus: $('fsmStatus'), faceTag: $('faceTag'),
  readS: $('readS'), readPhi: $('readPhi'), readDelta: $('readDelta'), read3d: $('read3d'),
  readErr: $('readErr'), readAlpha: $('readAlpha'), readYPos: $('readYPos'), readRpm: $('readRpm'),
  readAngle: $('readAngle'),
  signalPreset: $('signalPreset'),
  scanSpeed: $('scanSpeed'), speedValue: $('speedValue'),
  sampleCount: $('sampleCount'), samplesValue: $('samplesValue'),
  observeModes: $('observeModes'), observeValue: $('observeValue'), observeModeLabel: $('observeModeLabel'),
  presentationScale: $('presentationScale'),
  magnify: $('magnify'), magnifyValue: $('magnifyValue'),
  coarseX: $('coarseX'), coarseValue: $('coarseValue'), micValue: $('micValue'),
  probeForce: $('probeForce'), forceValue: $('forceValue'),
  faceSegmented: $('faceSegmented'),
  chartSection: $('chartSection'), profileChart: $('profileChart'), axisToggle: $('axisToggle'),
  chartResult: $('chartResult'), ffLeft: $('ffLeft'), ffRight: $('ffRight'),
  sourceBars: document.querySelector('.source-bars'),
  partInspector: $('partInspector'), inspectorCode: $('inspectorCode'),
  inspectorName: $('inspectorName'), inspectorDesc: $('inspectorDesc'), inspectorSpecs: $('inspectorSpecs'),
  inspectorClose: $('inspectorClose'),
  eduMag: $('eduMag'),
  helpModal: $('helpModal'), loadingScreen: $('loadingScreen'), loadingProgress: $('loadingProgress'),
  loadingText: $('loadingText'), loadingPct: $('loadingPct'), fatalScreen: $('fatalScreen'),
  toast: $('toast'), debugPanel: $('debugPanel'),
  debugFps: $('debugFps'), debugCalls: $('debugCalls'), debugTris: $('debugTris'),
  debugS: $('debugS'), debugA: $('debugA'), debugScale: $('debugScale'),
  debugMag: $('debugMag'), debugFsm: $('debugFsm'),
};

const ui = {
  actionButtons: $$('[data-action]'),
  playButtons: $$('[data-action="play"]'),
  pauseButtons: $$('[data-action="pause"]'),
  playLabels: $$('[data-action="play"] .action-label'),
  pauseLabels: $$('[data-action="pause"] .action-label'),
  positionButtons: $$('[data-action="position"]'),
  reverseButtons: $$('[data-action="reverse"]'),
  resetButtons: $$('[data-action="reset"], [data-action="reset-measurement"]'),
  faceButtons: $$('#faceSegmented button'),
  viewButtons: $$('.camera-rail [data-view]'),
  structureButtons: $$('.view-modes [data-structure]'),
  observeButtons: $$('[data-observe]'),
  micButtons: $$('[data-mic]'),
  sourceButtons: $$('[data-source]'),
  processItems: $$('#processSteps li'),
  rangeInputs: $$('input[type="range"]'),
};

const state = {
  quality: 'auto',
  observeMode: 'auto',
  manualScale: 1,
  presentationScale: 1,
  magnify: 500,
  structure: 'exterior',
  frozen: false,
  estop: false,
  exploded: false,
  explodeTarget: 0,
  explodeProgress: 0,
  leavingExplode: false,
  explodeState: null,
  labelsOn: true,
  selectedKeys: [],
  micrometer: 0,
  timelineDragging: false,
  debug: false,
  cinema: {
    active: false, t: 0, duration: 26.8, events: [], index: 0,
    savedSpeed: 2, savedObserveMode: 'auto', savedObserveScale: 1,
    changedSpeed: false, labelsBefore: true, startedAt: 0,
  },
};

let renderer, scene, camera, controls, environment, materials, post, instrument, gear, engine;
let cameraDirector, annotations, chart, audio;
let explodeLight = null;
let sampleSystems = {};
let contactGlow = null;
let sampleFlash = null;
let selectionLines = [];
let pulseLines = [];
let pulseLineClearAt = 0;
let explodeEntries = [];
let gearBasePosition = new THREE.Vector3();
let lastFrame = performance.now();
let lastUI = 0;
let firstFrameRendered = false;
let loadingProgress = 0;
let fpsAvg = 60;
let frameCount = 0;
let fpsAccum = 0;
let sampleSerialSeen = 0;
let pulseUntil = 0;
let lastMode = null;
let lastSampleTick = 0;
let lastPointerDown = null;
let hoverRayTimer = 0;
let pendingOpenSection = false;
let cameraTweenWasActive = false;
let lastObserveValue = null;
let resizeScheduled = false;
let lastPositioned = false;
let lastPinLocked = true;
let lastAudioUpdate = 0;
let lastCompletionMode = null;
let shadowUpdateFrame = 0;
let lastShadowState = null;
let shadowDirty = true;

function pruneSmallShadowCasters(root) {
  const geoRadius = new Map();
  root.traverse(o => {
    if (!o.isMesh && !o.isInstancedMesh) return;
    const geo = o.geometry;
    if (!geo) return;
    let radius = geoRadius.get(geo);
    if (radius === undefined) {
      if (!geo.boundingSphere) geo.computeBoundingSphere();
      radius = geo.boundingSphere?.radius || 0;
      geoRadius.set(geo, radius);
    }
    if (radius < 38) {
      o.castShadow = false;
      o.receiveShadow = false;
    }
  });
}

const frameState = {
  engineSnapshot: null,
  timeScale: 1,
  visualDelta: 0,
  camMoving: false,
};

const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();

function setLoading(pct, text) {
  loadingProgress = pct;
  if (dom.loadingProgress) dom.loadingProgress.style.width = `${pct}%`;
  if (dom.loadingPct) dom.loadingPct.textContent = String(Math.round(pct)).padStart(2, '0');
  if (dom.loadingText && text) dom.loadingText.textContent = text;
}

function showFatal(message) {
  console.error(message);
  if (dom.fatalScreen) {
    dom.fatalScreen.hidden = false;
    const p = dom.fatalScreen.querySelector('p');
    if (p && message) p.textContent = String(message);
  }
  dom.loadingScreen?.classList.add('is-done');
}

function nextAnimationFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

async function boot() {
  try {
    setLoading(4, '正在建立测量坐标系');
    await nextAnimationFrame();

    renderer = new THREE.WebGLRenderer({
      antialias: true, alpha: true, powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.56;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.needsUpdate = true;
    renderer.info.autoReset = false;
    renderer.domElement.style.touchAction = 'none';
    renderer.setClearAlpha(0);
    dom.canvasHost.appendChild(renderer.domElement);

    const w = Math.max(320, stage.clientWidth);
    const h = Math.max(300, stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(w, h, false);

    scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.FogExp2(0xEEF2F7, 0.00005);

    camera = new THREE.PerspectiveCamera(LAYOUT.camera.fov, w / h, LAYOUT.camera.near, LAYOUT.camera.far);
    camera.position.set(...LAYOUT.camera.defaultPos);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...LAYOUT.camera.defaultTarget);
    controls.enableDamping = true;
    controls.dampingFactor = 0.065;
    controls.minDistance = 260;
    controls.maxDistance = 7000;
    controls.minPolarAngle = 0.07;
    controls.maxPolarAngle = Math.PI * 0.493;
    controls.zoomSpeed = 0.8;
    controls.rotateSpeed = 0.65;
    controls.panSpeed = 0.55;
    controls.update();

    setLoading(16, '配置摄影棚环境光');
    materials = createMaterials(renderer);
    environment = createStageEnvironment(renderer, scene, materials, state.quality);
    explodeLight = new THREE.SpotLight(0xc4d8e5, 0, 1700, 0.62, 0.85, 0);
    explodeLight.position.set(820, 880, 1240);
    explodeLight.target.position.set(0, 130, 0);
    explodeLight.castShadow = false;
    scene.add(explodeLight, explodeLight.target);
    await nextAnimationFrame();

    setLoading(34, '装配 L 形悬臂机构');
    engine = new MeasurementEngine();
    engine.setSpeed(CFG.scan.defaultSpeed);
    engine.setSampleCount(CFG.scan.defaultSamples);
    instrument = createInstrument(materials);
    scene.add(instrument.root);
    pruneSmallShadowCasters(instrument.root);
    engine.setUserCoarse(34);

    // Find the exact measurement contact point once, using the same
    // authoritative kinematics that will drive the live scene.
    instrument.motion.apply({
      s: LENGTH / 2, xCoarse: 60, alphaDeg: CFG.reversal.angle,
      ballDrop: 1, visualDelta: 0, forceN: 0.3, lockPinned: true, motorAngle: 0,
    });
    instrument.root.updateMatrixWorld(true);
    const contact = new THREE.Vector3();
    instrument.anchors.ruby.getWorldPosition(contact);

    setLoading(52, '就位巨型人字齿轮扇段');
    gear = createGear(materials, contact, instrument.root.rotation.y);
    gear.group.traverse(o => {
      if (o.isMesh && !o.userData.partKey) o.userData.partKey = 'gear';
    });
    scene.add(gear.group);
    gearBasePosition.copy(gear.group.position);
    await nextAnimationFrame();

    setLoading(68, '接入三轴测量链');
    const snap = engine.getSnapshot();
    instrument.motion.apply({
      s: snap.s, xCoarse: snap.xCoarse, alphaDeg: snap.alpha,
      ballDrop: snap.ballDrop, visualDelta: 0, forceN: snap.forceN,
      lockPinned: snap.pinLocked, motorAngle: snap.motorAngle,
    });
    setupStageExtras();

    setLoading(82, '编排实时测量界面');
    try {
      post = createPostPipeline(renderer, scene, camera, state.quality);
    } catch (err) {
      console.warn('Post-processing unavailable, using direct render path.', err);
      post = null;
    }
    chart = new ProfileChart(dom.profileChart);
    audio = new AudioEngine();
    cameraDirector = new CameraDirector(camera, controls, annotationsAnchors(), instrument.root.rotation.y, syncViewButtons);
    annotations = new AnnotationSystem({
      layer: dom.labelLayer,
      svg: dom.leaderSvg,
      anchors: annotationsAnchors(),
      camera,
      renderer,
      occluders: instrument.partGroups.base?.concat(instrument.partGroups.column || []) || [],
    });
    annotations.resize();
    annotations.setEnabled(state.labelsOn);

    wireEvents();
    applyQuality(state.quality, true);
    if (dom.datumU) {
      const repeat = CFG.precision.errors.find(e => e.name.includes('定位重复性'))?.u;
      dom.datumU.textContent = repeat == null ? '—' : String(repeat);
    }
    bindRangeFills();
    updateObserveUI(true);
    updateAllUI(true);
    resizeScene();
    setLoading(100, '测量坐标系已建立');
    await nextAnimationFrame();
    dom.loadingScreen.classList.add('is-done');
    requestAnimationFrame(tick);
    window.__APP__ = {
      THREE, scene, camera, renderer, controls, post, instrument, gear, engine,
      cameraDirector, annotations, chart, audio, environment, materials, state,
      setSection, setStructure, applyQuality, enterExplosion, exitExplosion,
      startCinema, stopCinema, selectPartKeys, clearSelection,
      applyExplosion, updateExplosion, finishExplodeState, refreshUI, updateAllUI,
      updateCinema, doPlay, doPause, doReset, resizeScene, raycastPart,
      get debugFunctions() {
        return { applyExplosion, updateExplosion, updateCinema, refreshUI };
      },
    };
  } catch (err) {
    showFatal(err?.stack || err?.message || err);
  }
}

function annotationsAnchors() {
  if (!instrument) return {};
  return {
    ...instrument.anchors,
    gear: gear?.anchor,
    column: instrument.anchors.column,
  };
}

function setupStageExtras() {
  // Soft contact under the instrument base.
  const shadowTex = makeContactShadowTexture(256, 0.82);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex, transparent: true, opacity: 0.42, color: 0x000000,
    depthWrite: false, toneMapped: false,
  });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(780, 660), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.5, -20);
  shadow.renderOrder = 1;
  shadow.raycast = () => {};
  instrument.root.add(shadow);

  // Persistent sample-point clouds, one per flank group.
  const dotTex = makeGlowTexture(64, '#A94B0B', 'rgba(255,250,242,1)', 'rgba(169,75,11,.70)');
  const maxSamples = CFG.scan.maxSamples;
  for (const face of ['left', 'right']) {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(maxSamples * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setDrawRange(0, 0);
    geo.computeBoundingSphere();
    const mat = new THREE.PointsMaterial({
      size: face === 'left' ? 7.4 : 6.4,
      map: dotTex,
      color: new THREE.Color(COLORS.amber).multiplyScalar(face === 'left' ? 1.35 : 1.1),
      transparent: true, opacity: 0.95, depthWrite: false, depthTest: false,
      blending: THREE.NormalBlending, sizeAttenuation: true, toneMapped: false,
    });
    const points = new THREE.Points(geo, mat);
    points.renderOrder = 5;
    points.frustumCulled = false;
    points.name = `SamplePoints_${face}`;
    scene.add(points);
    sampleSystems[face] = { points, geo, positions, mat, count: 0 };
  }

  // A contact glow on the ruby itself.
  const glowTex = makeGlowTexture(64, '#A94B0B', 'rgba(255,250,242,.98)', 'rgba(169,75,11,.58)');
  const glowMat = new THREE.SpriteMaterial({
    map: glowTex, color: new THREE.Color(COLORS.amber).multiplyScalar(1.25),
    transparent: true, opacity: 0.0, depthWrite: false, depthTest: false,
    blending: THREE.NormalBlending, toneMapped: false,
  });
  contactGlow = new THREE.Sprite(glowMat);
  contactGlow.scale.set(17, 17, 1);
  contactGlow.renderOrder = 6;
  instrument.anchors.ruby.add(contactGlow);

  // Flash for the newest sample event.
  const flashMat = new THREE.SpriteMaterial({
    map: glowTex, color: new THREE.Color(0xC96A12),
    transparent: true, opacity: 0, depthWrite: false, depthTest: false,
    blending: THREE.NormalBlending, toneMapped: false,
  });
  sampleFlash = new THREE.Sprite(flashMat);
  sampleFlash.scale.set(34, 34, 1);
  sampleFlash.renderOrder = 7;
  scene.add(sampleFlash);

  // Slightly enlarge the ruby identity point with a tiny emissive glint.
  const glint = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: new THREE.Color(0xB42318),
    transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.NormalBlending,
    toneMapped: false,
  }));
  glint.scale.set(8, 8, 1);
  instrument.anchors.ruby.add(glint);
}

/* ------------------------------------------------------------------ */
/* Presentation scale, quality, layout                                 */
/* ------------------------------------------------------------------ */

const QUALITY = {
  high:   { dpr: () => Math.min(window.devicePixelRatio || 1, 2.0), shadow: 2048, post: true, dust: true },
  auto:   {
    dpr: () => {
      if (window.innerWidth <= 760) return Math.min(window.devicePixelRatio || 1, 1.15);
      const cores = navigator.hardwareConcurrency || 8;
      return Math.min(window.devicePixelRatio || 1, cores <= 4 ? 1.25 : 1.5);
    },
    shadow: 1024, post: true, dust: true,
  },
  smooth: { dpr: () => Math.min(window.devicePixelRatio || 1, 1.0), shadow: 512, post: false, dust: false },
};
const SIGNAL_LABELS = {
  idle: 'STANDBY', positioning: 'POSITIONING', approach: 'APPROACH',
  scanning: 'SCANNING', retract: 'RETRACT', reversing: 'REVERSING', done: 'COMPLETE',
};

function setStatusTone(el, tone) {
  if (el) el.dataset.tone = tone || 'idle';
}

function formatMm(v, digits = 3) {
  return Number(v).toFixed(digits);
}
function formatMicron(v, digits = 1) {
  return Number(v).toFixed(digits);
}
function signedNum(v, digits = 2, unit = '°') {
  const n = Number(v);
  return `${n >= 0 ? '+' : '−'}${Math.abs(n).toFixed(digits)}${unit}`;
}

function currentTimeScale() {
  if (state.cinema.active) return 1;
  if (state.observeMode === 'real') return 1;
  if (state.observeMode === 'auto') {
    const close = state.structure === 'section' || cameraDirector?.currentPreset === 'transfer';
    return close ? 0.2 : 1;
  }
  return state.manualScale;
}

function setRangeFill(input) {
  if (!input) return;
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const val = Number(input.value);
  const pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
  input.style.setProperty('--fill', `${clamp(pct, 0, 100)}%`);
}

function bindRangeFills() {
  for (const input of ui.rangeInputs) {
    setRangeFill(input);
    input.addEventListener('input', () => setRangeFill(input), { passive: true });
  }
}

function applyQuality(mode, initial = false) {
  const q = QUALITY[mode] || QUALITY.auto;
  state.quality = mode;
  if (!renderer) return;
  const w = Math.max(320, stage.clientWidth);
  const h = Math.max(300, stage.clientHeight);
  const dpr = q.dpr();
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  shadowDirty = true;
  const autoCompact = mode === 'auto' && window.innerWidth <= 760;
  const renderMode = autoCompact ? 'smooth' : mode;
  environment?.setQuality(renderMode);
  if (post) {
    post.setMode(renderMode === 'smooth' ? 'smooth' : mode);
    post.resize(w, h, dpr);
  }
  if (dom.qualitySelect) dom.qualitySelect.value = mode;
  resizeScene();
  if (!initial) toast(`画质已切换为${mode === 'high' ? '高画质' : mode === 'smooth' ? '流畅' : '自动'}`, 'info');
}

function resizeScene() {
  if (!renderer || !camera) return;
  const w = Math.max(320, stage.clientWidth);
  const h = Math.max(300, stage.clientHeight);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  if (cameraDirector && cameraDirector.currentPreset === 'overview' && !cameraDirector.tween) {
    camera.fov = window.innerWidth <= 760 ? 48 : LAYOUT.camera.fov;
  }
  camera.updateProjectionMatrix();
  if (post) post.resize(w, h, renderer.getPixelRatio());
  annotations?.resize();
  chart?.resize();
}

function syncViewButtons(name) {
  for (const btn of ui.viewButtons) {
    const v = btn.dataset.view;
    btn.classList.toggle('is-active', !!name && (v === name || (name === 'reset' && v === 'reset')));
  }
  applyAnnotationModeForView(name);
}

function applyAnnotationModeForView(name) {
  if (!annotations || state.cinema.active) return;
  if (state.structure === 'section') annotations.setMode('section');
  else if (state.structure === 'exploded') annotations.setMode('exploded');
  else if (name === 'positioning') annotations.setMode('positioning');
  else annotations.setMode('default');
}

function showToast(message, tone = 'info', duration = 2300) {
  if (!dom.toast) return;
  dom.toast.textContent = message;
  dom.toast.dataset.tone = tone;
  dom.toast.classList.add('is-visible');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => dom.toast.classList.remove('is-visible'), duration);
}

function toast(message, tone = 'info', duration = 2300) {
  showToast(message, tone, duration);
}

function openHelp() {
  dom.helpModal.hidden = false;
  document.body.classList.add('modal-open');
  setTimeout(() => dom.helpModal.querySelector('.modal-close')?.focus(), 30);
}
function closeHelp() {
  dom.helpModal.hidden = true;
  document.body.classList.remove('modal-open');
  dom.helpButton?.focus();
}

function setLoadingOverlayProgress() {}

/* ------------------------------------------------------------------ */
/* UI synchronisation                                                  */
/* ------------------------------------------------------------------ */

function processModeLabel() {
  if (state.estop) return '急停';
  if (state.frozen) return '已暂停';
  if (engine.paused) return '已暂停';
  switch (engine.mode) {
    case 'positioning': return '定位中';
    case 'approach': return '进给中';
    case 'scanning': return '扫描中';
    case 'retract': return '退回中';
    case 'reversing': return '换向中';
    case 'done': return '完成';
    default: return '待机';
  }
}

function setDisabled(el, disabled) {
  if (!el) return;
  el.disabled = !!disabled;
}

function updateActionButtons(snapshot) {
  const active = engine.isActive();
  const paused = engine.paused;
  const blocked = state.estop || state.frozen || state.exploded;
  const playDisabled = blocked || (active && !paused);
  const pauseDisabled = blocked || !active;
  const positionDisabled = blocked || active;
  const reverseDisabled = blocked || active;
  const faceDisabled = blocked || active;

  for (const b of ui.playButtons) { setDisabled(b, playDisabled); b.setAttribute('aria-disabled', String(playDisabled)); }
  for (const b of ui.pauseButtons) { setDisabled(b, pauseDisabled); b.setAttribute('aria-pressed', String(paused)); }
  for (const b of ui.positionButtons) setDisabled(b, positionDisabled);
  for (const b of ui.reverseButtons) setDisabled(b, reverseDisabled);
  for (const b of ui.faceButtons) setDisabled(b, faceDisabled);

  const playLabel = state.estop ? '急停中' : blocked ? '机构已冻结' : paused ? '继续测量' : active ? '测量中' : engine.mode === 'done' ? '重新测量' : '启动测量';
  for (const label of ui.playLabels) label.textContent = playLabel;
  if (dom.btnPlayText) dom.btnPlayText.textContent = playLabel;
  for (const label of ui.pauseLabels) label.textContent = paused ? '继续' : '暂停';

  setDisabled(dom.coarseX, blocked || active);
  setDisabled(dom.timelineRange, blocked);
  for (const b of ui.micButtons) setDisabled(b, blocked || active);
}

function updateProcessSteps(snapshot) {
  const completed = new Set(snapshot.completedSteps || []);
  if (snapshot.mode === 'done') STEPS.forEach(s => completed.add(s.key));
  const active = snapshot.activeStep || (snapshot.paused ? engine.pausedMode && mapModeStep(engine.pausedMode) : null);
  for (const li of ui.processItems) {
    const k = li.dataset.step;
    li.classList.toggle('is-active', k === active);
    li.classList.toggle('is-done', completed.has(k) && k !== active);
    li.classList.toggle('is-position', k === 'position');
    li.classList.toggle('is-reverse', k === 'reverse');
    if (k === 'done' && snapshot.mode === 'done') li.classList.add('is-done');
  }
}

function mapModeStep(mode) {
  return ({ positioning: 'position', approach: 'approach', scanning: 'scan', retract: 'retract', reversing: 'reverse', done: 'done' })[mode] || null;
}

function updateChartAndResult(snapshot, now) {
  const hasData = snapshot.faces.left.samples.length + snapshot.faces.right.samples.length > 0;
  chart.update({
    faces: {
      left: { samples: snapshot.faces.left.samples, complete: snapshot.faces.left.complete },
      right: { samples: snapshot.faces.right.samples, complete: snapshot.faces.right.complete },
    },
    current: hasData || engine.isActive() ? { s: snapshot.s, e: snapshot.currentError } : null,
    currentFace: snapshot.face,
    result: snapshot.result,
  });
  chart.draw(now);

  const leftFF = snapshot.faces.left.samples.length >= 2 ? snapshot.faces.left.ff : null;
  const rightFF = snapshot.faces.right.samples.length >= 2 ? snapshot.faces.right.ff : null;
  if (dom.ffLeft) dom.ffLeft.textContent = leftFF == null ? '—' : `${formatMicron(leftFF)} μm`;
  if (dom.ffRight) dom.ffRight.textContent = rightFF == null ? '—' : `${formatMicron(rightFF)} μm`;

  const activeScan = engine.isActive() || engine.paused;
  const hasAny = leftFF != null || rightFF != null;
  let tone = 'idle';
  let label = '等待扫描数据';
  if (hasAny) {
    if (snapshot.mode === 'done' || (snapshot.faces.left.complete && snapshot.faces.right.complete)) {
      tone = snapshot.result.tone;
      label = snapshot.result.label;
    } else if (activeScan) {
      tone = 'active';
      const faceName = snapshot.face === 'left' ? '左' : '右';
      label = `扫描中 · ${faceName}齿面 ff ${formatMicron(snapshot.faces[snapshot.face].ff ?? 0)} μm`;
    } else {
      tone = snapshot.result.tone;
      label = snapshot.result.label;
    }
  }
  const roleEl = dom.chartResult.querySelector('.result-state');
  if (roleEl) {
    roleEl.dataset.tone = tone;
    roleEl.querySelector('span').textContent = label;
  }
  app.dataset.result = (tone === 'fail' || tone === 'warn') ? tone : (snapshot.result.tone === 'fail' ? 'fail' : '');
  return { tone, label };
}

function buildTimelineTicks(count) {
  if (!dom.timelineSamples || dom.timelineSamples.dataset.count === String(count)) return;
  dom.timelineSamples.dataset.count = String(count);
  dom.timelineSamples.innerHTML = '';
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const mark = document.createElement('i');
    mark.style.left = `${(i / (count - 1)) * 100}%`;
    frag.appendChild(mark);
  }
  dom.timelineSamples.appendChild(frag);
}

function updateTimeline(snapshot) {
  const pct = clamp(snapshot.s / LENGTH, 0, 1) * 100;
  if (dom.timelineFill) dom.timelineFill.style.width = `${pct}%`;
  if (dom.timelineKnob) dom.timelineKnob.style.left = `${pct}%`;
  if (dom.timelineRead) dom.timelineRead.textContent = formatMm(snapshot.s);
  if (dom.timelineRange && !state.timelineDragging) dom.timelineRange.value = snapshot.s;
  buildTimelineTicks(engine.sampleCount);
}

function updateFaceAndAngleUI(snapshot) {
  const targetFace = snapshot.nextFace || snapshot.face;
  const faceName = targetFace === 'left' ? '左齿面' : '右齿面';
  const actual = signedNum(snapshot.alpha);
  if (dom.faceTag) {
    dom.faceTag.dataset.face = targetFace;
    dom.faceTag.innerHTML = `${faceName} <b>${actual}</b>`;
  }
  if (dom.dockFace) dom.dockFace.innerHTML = `${faceName} · <b>${actual}</b>`;
  for (const b of ui.faceButtons) b.classList.toggle('is-active', b.dataset.face === targetFace);
  if (dom.readAlpha) dom.readAlpha.textContent = actual;
  if (dom.readAngle) dom.readAngle.textContent = actual.replace('°', '');
}

function refreshUI(snapshot, force = false) {
  if (!snapshot) snapshot = engine.getSnapshot();
  const now = performance.now();
  if (!force && now - lastUI < 45) return;
  lastUI = now;

  const detailView = state.structure !== 'exterior' ||
    (cameraDirector?.currentPreset && !['overview', 'reset', null].includes(cameraDirector.currentPreset));
  stage.classList.toggle('is-detail', !!detailView);
  stage.classList.toggle('is-exploded', state.structure === 'exploded');
  stage.classList.toggle('is-section', state.structure === 'section');
  const datumActive = !state.cinema.active && (engine.mode === 'positioning' ||
    (engine.positioned && now < pulseUntil + 500));
  stage.classList.toggle('is-datum', datumActive);
  if (instrument?.motion.datumFill) {
    instrument.motion.datumFill.intensity = datumActive ? 1.25 : 0;
  }
  if (datumActive) {
    const p = engine.mode === 'positioning' ? clamp(engine.stateT / 2.2, 0, 1) : 1;
    if (dom.datumFill) dom.datumFill.style.width = `${(p * 100).toFixed(1)}%`;
    if (dom.datumState) dom.datumState.textContent = p >= 0.999 ? '基准锁定' : '入槽中';
  }
  updateModeCaption();
  const modeLabel = processModeLabel();
  const blocked = state.estop || state.frozen || state.exploded;
  let tone = 'idle';
  if (state.estop) tone = 'error';
  else if (state.frozen) tone = 'paused';
  else if (engine.paused) tone = 'paused';
  else if (engine.mode === 'done') {
    const t = snapshot.result.tone;
    tone = t === 'fail' ? 'error' : t === 'warn' ? 'paused' : 'done';
  } else if (engine.mode === 'reversing') tone = 'reversal';
  else if (['approach', 'scanning', 'retract'].includes(engine.mode)) tone = 'run';
  else tone = 'idle';

  if (dom.topStatusText) dom.topStatusText.textContent = modeLabel;
  if (dom.fsStatus) dom.fsStatus.textContent = state.cinema.active ? '电影演示' : modeLabel;
  setStatusTone(dom.topStatus, tone);
  app.dataset.fsm = state.estop ? 'error' : state.frozen ? 'paused' : engine.paused ? 'paused' : engine.mode;

  const s = snapshot.s;
  if (dom.readS) dom.readS.textContent = formatMm(s);
  if (dom.readPhi) dom.readPhi.textContent = `${formatMm((s / CFG.gear.rb) * 180 / Math.PI, 3)}°`;
  const activeReading = engine.mode === 'scanning' || engine.mode === 'approach' ||
    engine.mode === 'done' || (engine.paused && ['scanning', 'approach', 'done'].includes(engine.pausedMode)) ||
    snapshot.faces[snapshot.face].samples.length > 0;
  const e = activeReading ? snapshot.currentError : 0;
  if (dom.readDelta) dom.readDelta.textContent = formatMicron(e, 1);
  if (dom.read3d) dom.read3d.textContent = formatMicron(e * 3, 1);
  if (dom.readErr) dom.readErr.textContent = formatMicron(e, 1);
  if (dom.readYPos) dom.readYPos.textContent = `${formatMm(s, 3)} mm`;
  if (dom.readRpm) dom.readRpm.textContent = (engine.speed * 12).toFixed(1);
  if (dom.readAngle) dom.readAngle.textContent = signedNum(snapshot.alpha).replace('°', '');
  updateFaceAndAngleUI(snapshot);
  updateTimeline(snapshot);
  updateProcessSteps(snapshot);
  updateActionButtons(snapshot);

  if (dom.hudSignal) dom.hudSignal.textContent = state.estop ? 'E-STOP' : state.frozen ? 'FROZEN' : engine.paused ? 'PAUSED' : SIGNAL_LABELS[engine.mode] || 'STANDBY';
  if (dom.hudSpeed) dom.hudSpeed.textContent = engine.speed.toFixed(1);
  if (dom.speedValue) dom.speedValue.textContent = engine.speed.toFixed(1);
  if (dom.samplesValue) dom.samplesValue.textContent = String(engine.sampleCount);
  if (dom.coarseValue) dom.coarseValue.textContent = engine.xCoarse.toFixed(1);
  if (dom.coarseX) {
    setRangeFill(dom.coarseX);
    if (!blocked && !engine.isActive() && document.activeElement !== dom.coarseX) {
      dom.coarseX.value = engine.xCoarse.toFixed(1);
    }
  }
  if (dom.micValue) dom.micValue.textContent = state.micrometer.toFixed(2);
  if (dom.forceValue) dom.forceValue.textContent = engine.forceN.toFixed(2);
  if (dom.probeForce && document.activeElement !== dom.probeForce) dom.probeForce.value = engine.forceN;
  if (dom.sampleCount && document.activeElement !== dom.sampleCount) {
    dom.sampleCount.value = engine.sampleCount;
    setRangeFill(dom.sampleCount);
  }
  if (dom.scanSpeed && document.activeElement !== dom.scanSpeed) {
    dom.scanSpeed.value = engine.speed;
    setRangeFill(dom.scanSpeed);
  }
  if (dom.magnifyValue) dom.magnifyValue.textContent = String(state.magnify);
  if (dom.hudMag) dom.hudMag.textContent = String(state.magnify);
  if (dom.eduMag) dom.eduMag.textContent = `×${state.magnify}`;
  if (dom.magnify && document.activeElement !== dom.magnify) {
    dom.magnify.value = state.magnify;
    setRangeFill(dom.magnify);
  }
  updateObserveUI(false);
  updateChartAndResult(snapshot, now);
  updateDebug(snapshot);
}

/* ------------------------------------------------------------------ */
/* Main loop                                                           */
/* ------------------------------------------------------------------ */

function tick(now) {
  requestAnimationFrame(tick);
  if (document.hidden) {
    lastFrame = now;
    return;
  }
  const measuredDt = Math.max(0.001, (now - lastFrame) / 1000);
  const rawDt = clamp(measuredDt, 0, 0.25);
  lastFrame = now;
  fpsAccum += measuredDt; frameCount++;
  if (fpsAccum > 0.5) { fpsAvg = frameCount / fpsAccum; fpsAccum = 0; frameCount = 0; }

  if (state.cinema.active) updateCinema(rawDt, now);

  const timeScale = currentTimeScale();
  state.presentationScale = timeScale;
  const simDt = (state.frozen || state.estop) ? 0 : rawDt * timeScale;
  if (simDt > 0) {
    let remaining = simDt;
    let substeps = 0;
    while (remaining > 1e-6 && substeps < 6) {
      const step = Math.min(0.06, remaining);
      engine.update(step);
      remaining -= step;
      substeps++;
    }
  } else {
    engine.update(0);
  }
  const snapshot = engine.getSnapshot();
  frameState.engineSnapshot = snapshot;

  if (engine.positioned && !lastPositioned) {
    pulseUntil = now + 3300;
    instrument.motion.setDatumPulse(true, 1);
    if (audio) audio.positionChime();
    if (!state.cinema.active) toast('基准已建立 · W 258.88 mm · k 11', 'info', 2600);
  }
  if (!engine.positioned) lastPositioned = false;
  else lastPositioned = true;

  if (engine.pinLocked && !lastPinLocked && engine.mode !== 'done' && !engine.paused) {
    if (audio) audio.lockClick();
  }
  lastPinLocked = engine.pinLocked;

  if (engine.mode === 'done' && lastCompletionMode !== 'done') {
    const result = engine.getResult();
    if (audio) audio.completionTone(result.tone !== 'fail');
    if (!state.cinema.active) toast(result.label, result.tone === 'fail' ? 'error' : result.tone === 'warn' ? 'warn' : 'info', 3600);
  }
  lastCompletionMode = engine.mode;

  if (audio && audio.ctx && !audio.muted && now - lastAudioUpdate > 220) {
    lastAudioUpdate = now;
    audio.update({
      running: engine.isRunning,
      speed: engine.speed,
      closeup: state.structure === 'section' || cameraDirector?.currentPreset === 'transfer',
      reversing: engine.mode === 'reversing',
    });
  }

  // Derived micro-displacement for the 3-D mechanism. The high-pass component
  // keeps the lever visibly alive while the bounded ±5° stop protects the model.
  let targetVisual = 0;
  if (!engine.paused && !state.frozen && !state.estop) {
    if (engine.mode === 'scanning') {
      targetVisual = clamp((snapshot.highPass / 1000) * state.magnify, -1.30, 1.30);
    } else if (engine.mode === 'approach') {
      targetVisual = -0.06;
    }
  }
  if (engine.paused || state.frozen || state.estop) {
    // keep the last visual position frozen
  } else {
    frameState.visualDelta = damp(frameState.visualDelta, targetVisual, 16, Math.min(rawDt, 0.08));
  }

  instrument.motion.apply({
    s: snapshot.s,
    xCoarse: snapshot.xCoarse,
    alphaDeg: snapshot.alpha,
    ballDrop: snapshot.ballDrop,
    visualDelta: frameState.visualDelta,
    forceN: snapshot.forceN,
    lockPinned: snapshot.pinLocked,
    motorAngle: snapshot.motorAngle,
    micrometer: state.micrometer,
    headLift: 0,
  });

  updateExplosion(rawDt);
  updatePulse(now, snapshot);
  updateSampleCloud(snapshot, now);
  updateContactGlow(snapshot, now);

  cameraDirector.update(rawDt, !state.frozen && !state.cinema.active);
  if (!cameraDirector.tween) controls.update();
  frameState.camMoving = !!cameraDirector.tween;

  updateMicronScale(snapshot, now);
  annotations.update(now, frameState.camMoving);
  if (pulseLineClearAt && now > pulseLineClearAt) {
    clearTemporaryHighlights();
    pulseLineClearAt = 0;
  }

  refreshUI(snapshot, false);

  // Directional shadows only need refreshing while the mechanism moves.
  const changedMotion = !lastShadowState || Math.abs(snapshot.s - lastShadowState.s) > 0.002 ||
    Math.abs(snapshot.xCoarse - lastShadowState.x) > 0.01 ||
    Math.abs(snapshot.ballDrop - lastShadowState.ball) > 0.002 ||
    Math.abs(snapshot.alpha - lastShadowState.alpha) > 0.01;
  lastShadowState = { s: snapshot.s, x: snapshot.xCoarse, ball: snapshot.ballDrop, alpha: snapshot.alpha };
  shadowUpdateFrame++;
  if (renderer) {
    renderer.shadowMap.needsUpdate = shadowDirty || (changedMotion && shadowUpdateFrame % 3 === 0);
    shadowDirty = false;
    renderer.info.reset();
    try {
      if (post) post.render(rawDt);
      else renderer.render(scene, camera);
    } catch (err) {
      console.error('Render error, switching to direct render.', err);
      post = null;
      renderer.render(scene, camera);
    }
  }
  if (dom.debugPanel && !dom.debugPanel.hidden) updateDebug(snapshot, true);
  if (!firstFrameRendered) {
    firstFrameRendered = true;
    dom.loadingScreen?.classList.add('is-done');
  }
}

function updateDebug(snapshot, valid = false) {
  if (!state.debug) return;
  if (!dom.debugPanel || dom.debugPanel.hidden) return;
  if (dom.debugFps) dom.debugFps.textContent = `${fpsAvg.toFixed(0)} FPS`;
  if (dom.debugCalls) dom.debugCalls.textContent = String(renderer.info.render.calls);
  if (dom.debugTris) dom.debugTris.textContent = String(renderer.info.render.triangles);
  if (dom.debugS) dom.debugS.textContent = `${formatMm(snapshot.s)} mm`;
  if (dom.debugA) dom.debugA.textContent = signedNum(snapshot.alpha);
  if (dom.debugScale) dom.debugScale.textContent = `${state.presentationScale.toFixed(2)}×`;
  if (dom.debugMag) dom.debugMag.textContent = `${state.magnify}×`;
  if (dom.debugFsm) dom.debugFsm.textContent = engine.mode.toUpperCase();
}

/* ------------------------------------------------------------------ */
/* Visual effects: pulse, sample points, contact, microruler           */
/* ------------------------------------------------------------------ */

function updatePulse(now, snapshot) {
  const group = instrument.motion.pulseGroup;
  if (!group) return;
  if (engine.positioned && !state.frozen && !state.estop) {
    if (pulseUntil === 0) { pulseUntil = now + 3300; instrument.motion.setDatumPulse(true, 1); }
  }
  if (now > pulseUntil || !engine.positioned) {
    group.visible = false;
    group.userData.target = 0;
    return;
  }
  group.visible = true;
  const remain = clamp((pulseUntil - now) / 3300, 0, 1);
  const pulse = 0.55 + 0.25 * Math.sin(now * 0.012);
  group.userData.lineMat.opacity = remain * pulse * 0.95;
  group.userData.ringMat.opacity = remain * (0.42 + 0.3 * Math.sin(now * 0.014));
  const sc = 1 + 0.06 * Math.sin(now * 0.01);
  for (const r of group.userData.rings) r.scale.setScalar(sc);
}

function probePositionAt(s, out = new THREE.Vector3()) {
  if (!instrument || !engine) return out.set(0, 0, 0);
  const local = new THREE.Vector3(
    s - LENGTH / 2,
    LAYOUT.instrument.rubyY,
    (LAYOUT.instrument.xCarriageOriginZ - engine.xCoarse) + LAYOUT.instrument.rotorZ,
  );
  instrument.root.updateMatrixWorld();
  return instrument.root.localToWorld(local);
}

function updateSampleCloud(snapshot, now) {
  const currentFace = snapshot.face;
  for (const face of ['left', 'right']) {
    const sys = sampleSystems[face];
    if (!sys) continue;
    if (face !== currentFace) {
      sys.geo.setDrawRange(0, 0);
      sys.count = 0;
      continue;
    }
    const samples = snapshot.faces[face].samples;
    const limit = snapshot.s;
    let count = 0;
    const arr = sys.positions;
    for (const sp of samples) {
      if (sp.s > limit + 0.001 && !(snapshot.mode === 'done' && snapshot.s >= LENGTH - 0.001)) continue;
      const p = probePositionAt(sp.s, _v2);
      arr[count * 3] = p.x;
      arr[count * 3 + 1] = p.y;
      arr[count * 3 + 2] = p.z;
      count++;
    }
    sys.geo.setDrawRange(0, count);
    sys.geo.attributes.position.needsUpdate = true;
    sys.geo.computeBoundingSphere();
    sys.count = count;
    sys.mat.opacity = 0.2 + 0.75 * (state.estop ? 0 : state.frozen ? 0.2 : 1);
  }

  // A momentary flash on the newest sample.
  if (sampleFlash) {
    const age = now / 1000 - (sampleFlash.userData.bornAt || -10);
    if (age < 0.45) {
      const t = age / 0.45;
      sampleFlash.material.opacity = (1 - t) * 0.85;
      sampleFlash.scale.setScalar(24 + t * 28);
    } else {
      sampleFlash.material.opacity = 0;
    }
  }

  if (sampleSerialSeen !== snapshot.sampleSerial) {
    const delta = snapshot.sampleSerial - sampleSerialSeen;
    sampleSerialSeen = snapshot.sampleSerial;
    if (delta > 0 && delta <= 2 && snapshot.lastNewSample && !engine.paused && !state.frozen) {
      const p = probePositionAt(snapshot.lastNewSample.s, _v2);
      if (sampleFlash) {
        sampleFlash.position.copy(p);
        sampleFlash.userData.bornAt = now / 1000;
        sampleFlash.material.opacity = 0.85;
        sampleFlash.scale.setScalar(24);
      }
      if (audio) audio.sampleTick();
      lastSampleTick = now;
    }
  }
}

function updateContactGlow(snapshot, now) {
  if (!contactGlow || !sampleFlash) return;
  const active = (snapshot.mode === 'scanning' || snapshot.mode === 'approach' || engine.paused) && !state.frozen && !state.estop;
  const pulse = 0.55 + 0.18 * Math.sin(now * 0.009);
  contactGlow.material.opacity = active ? pulse : 0;
  contactGlow.visible = active;
  const isRubySelected = state.selectedKeys.includes('ruby');
  contactGlow.scale.setScalar(isRubySelected ? 22 + Math.sin(now * 0.006) * 2 : 16);
}

function updateMicronScale(snapshot, now) {
  if (!dom.micronScale) return;
  const close = state.structure === 'section' || cameraDirector?.currentPreset === 'transfer' ||
    state.cinema.active && cameraDirector?.currentPreset === 'transfer' ||
    state.selectedKeys.includes('ruby');
  const active = engine.mode === 'scanning' || engine.mode === 'approach' ||
    engine.mode === 'done' || (engine.paused && ['scanning', 'approach'].includes(engine.pausedMode));
  const visible = close && active && !state.exploded && !state.estop;
  dom.micronScale.classList.toggle('is-visible', visible);
  if (!visible) return;
  const anchor = instrument.anchors.ruby;
  anchor.getWorldPosition(_v);
  const projected = _v.clone().project(camera);
  const w = stage.clientWidth, h = stage.clientHeight;
  const x = clamp((projected.x * 0.5 + 0.5) * w + 58, 115, w - 110);
  const y = clamp((-projected.y * 0.5 + 0.5) * h - 10, 250, h - 185);
  dom.micronScale.style.left = `${x}px`;
  dom.micronScale.style.top = `${y}px`;
  const real = snapshot.currentError;
  const vis = Math.abs(frameState.visualDelta);
  if (dom.scaleDelta) dom.scaleDelta.textContent = formatMicron(real, 1);
  if (dom.scaleNote) dom.scaleNote.innerHTML = `视觉位移 <b>${vis.toFixed(2)}</b> mm`;
  if (dom.scaleMag) dom.scaleMag.textContent = String(state.magnify);
  const pct = clamp(vis / 1.3 * 100, 1, 100);
  if (dom.scaleFill) dom.scaleFill.style.width = `${pct}%`;
  if (dom.scaleMarker) dom.scaleMarker.style.left = `${pct}%`;
}

/* ------------------------------------------------------------------ */
/* Observe rate UI                                                     */
/* ------------------------------------------------------------------ */

function updateObserveUI(force = false) {
  const mode = state.observeMode;
  const scale = currentTimeScale();
  if (mode === 'manual' && !state.cinema.active) state.presentationScale = state.manualScale;
  for (const b of ui.observeButtons) {
    const v = b.dataset.observe;
    b.classList.toggle('is-active', (mode === 'auto' && v === 'auto') || (mode === 'manual' && v === 'manual') || (mode === 'real' && v === 'real'));
  }
  if (dom.observeModeLabel) dom.observeModeLabel.textContent = mode === 'auto' ? '自动' : mode === 'real' ? '真实 1×' : '手动';
  if (dom.observeValue) dom.observeValue.textContent = scale.toFixed(2);
  if (dom.hudObs) dom.hudObs.textContent = scale.toFixed(2);
  if (dom.presentationScale) {
    if (mode !== 'manual' || state.cinema.active) {
      dom.presentationScale.value = scale;
    }
    dom.presentationScale.disabled = mode !== 'manual' || state.estop || state.frozen || state.cinema.active;
    setRangeFill(dom.presentationScale);
  }
  if (dom.dockObserve) {
    const value = mode === 'auto' ? 'auto' : String(state.presentationScale.toFixed(2));
    if (![...dom.dockObserve.options].some(o => o.value === value)) {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = `${state.presentationScale.toFixed(2)}×`;
      dom.dockObserve.appendChild(opt);
    }
    dom.dockObserve.value = value;
  }
  if (dom.presentationScale) {
    if (!dom.presentationScale.disabled && document.activeElement !== dom.presentationScale && mode === 'manual') {
      dom.presentationScale.value = state.manualScale;
    }
    setRangeFill(dom.presentationScale);
  }
  if (dom.hudSpeed) dom.hudSpeed.textContent = engine.speed.toFixed(1);
  if (dom.hudMag) dom.hudMag.textContent = String(state.magnify);
}

/* ------------------------------------------------------------------ */
/* Actions and controls                                                */
/* ------------------------------------------------------------------ */

function updateAllUI(force = true) {
  if (!engine) return;
  const snapshot = engine.getSnapshot();
  refreshUI(snapshot, true);
  updateStructureButtons();
  updatePresetOption();
  if (dom.micValue) dom.micValue.textContent = state.micrometer.toFixed(2);
  if (dom.labelToggle) dom.labelToggle.setAttribute('aria-pressed', String(state.labelsOn));
  if (dom.volumeWrap) dom.volumeWrap.classList.toggle('is-visible', !audio?.muted);
  if (dom.volumeRange) { dom.volumeRange.value = String(audio?.volume ?? 0.36); setRangeFill(dom.volumeRange); }
  if (dom.soundToggle) dom.soundToggle.setAttribute('aria-pressed', String(!(audio?.muted ?? true)));
}

function updatePresetOption() {
  if (dom.signalPreset && engine) dom.signalPreset.value = engine.preset;
}

function doPlay() {
  if (state.estop) { toast('急停已触发，请先复位', 'warn'); return; }
  if (state.frozen || state.exploded) { toast('分层/冻结状态下不能启动测量', 'warn'); return; }
  if (engine.isActive() && !engine.paused) return;
  if (engine.isActive() && engine.paused) {
    const r = engine.pauseToggle();
    if (r.ok) toast('测量继续', 'info');
    frameState.visualDelta = 0;
    updateAllUI(true);
    return;
  }
  if (engine.mode === 'done') {
    engine.reset(true);
  }
  const res = engine.start();
  if (!res.ok) { toast(res.reason || '无法启动测量', 'warn'); return; }
  pulseUntil = 0;
  frameState.visualDelta = 0;
  if (engine.positioned) {
    pulseUntil = performance.now() + 2000;
    instrument.motion.setDatumPulse(true, 1);
  }
  toast(engine.mode === 'approach' ? '测量继续 · 进入扫描' : '测量启动 · 双球定位中', 'info');
  updateAllUI(true);
}

function doPause() {
  if (state.frozen || state.exploded) { toast('请先退出分层视图', 'warn'); return; }
  if (!engine.isActive()) { toast('当前没有进行中的测量', 'warn'); return; }
  const res = engine.pauseToggle();
  if (res.ok) toast(engine.paused ? '测量已暂停' : '测量继续', engine.paused ? 'warn' : 'info');
  updateAllUI(true);
}

function doPosition() {
  if (state.estop) { toast('急停已触发，请先复位', 'warn'); return; }
  if (state.frozen || state.exploded) { toast('请先退出现有结构视图', 'warn'); return; }
  const res = engine.positionOnly();
  if (!res.ok) { toast(res.reason || '定位不能开始', 'warn'); return; }
  if (cameraDirector && !state.cinema.active) cameraDirector.flyTo('positioning', { duration: 1.15 });
  toast('双球入槽定位 · 建立基准', 'info');
  updateAllUI(true);
}

function doReverse() {
  if (state.estop) { toast('急停已触发，请先复位', 'warn'); return; }
  if (state.frozen || state.exploded) { toast('请先退出分层视图', 'warn'); return; }
  if (engine.isActive()) { toast('测量进行中，换向由流程自动完成', 'warn'); return; }
  const target = engine.face === 'left' ? 'right' : 'left';
  const res = engine.manualReverseTo(target);
  if (!res.ok) { toast(res.reason || '换向不能开始', 'warn'); return; }
  toast(`换向至${target === 'left' ? '左' : '右'}齿面 · 定位销锁紧`, 'info');
  updateAllUI(true);
}

function doReset() {
  if (state.cinema.active) stopCinema(false);
  if (state.exploded) {
    // Instant collapse for a deterministic reset.
    state.explodeProgress = 0;
    state.explodeTarget = 0;
    state.leavingExplode = false;
    applyExplosion(0);
    finishExplodeState(true);
  }
  state.estop = false;
  stage.classList.remove('is-estop');
  engine.reset(true);
  state.micrometer = 0;
  pulseUntil = 0;
  frameState.visualDelta = 0;
  instrument.motion.setDatumPulse(false, 0);
  const p = instrument.motion.pulseGroup;
  if (p) p.visible = false;
  clearSelection();
  clearTemporaryHighlights();
  toast('测量已复位 · 双球基准解除', 'info');
  updateAllUI(true);
}

function selectFace(face) {
  if (!['left', 'right'].includes(face)) return;
  if (state.estop || state.frozen || state.exploded) { toast('当前视图下不可换向', 'warn'); return; }
  if (engine.isActive()) { toast('测量进行中，请先暂停', 'warn'); return; }
  if (face === engine.face) return;
  const res = engine.manualReverseTo(face);
  if (!res.ok) { toast(res.reason || '换向不能开始', 'warn'); return; }
  toast(`换向至${face === 'left' ? '左' : '右'}齿面`, 'info');
  updateAllUI(true);
}

function triggerEmergencyStop() {
  state.estop = true;
  stage.classList.add('is-estop');
  engine.emergencyStop();
  if (state.cinema.active) stopCinema(false);
  if (audio) audio.lockClick();
  toast('急停 · 机构保持当前位置，请复位后继续', 'error', 3400);
  refreshUI(engine.getSnapshot(), true);
}

function setObserveMode(mode) {
  if (!['auto', 'manual', 'real'].includes(mode)) return;
  state.observeMode = mode;
  if (mode === 'real') state.presentationScale = 1;
  updateObserveUI(true);
  updateAllUI(false);
}

function setManualObserveScale(v) {
  state.observeMode = 'manual';
  state.manualScale = clamp(Number(v) || 1, 0.05, 1);
  state.presentationScale = state.manualScale;
  updateObserveUI(true);
  updateAllUI(false);
}

function changeMagnify(v) {
  state.magnify = clamp(Math.round(Number(v) / 50) * 50, 100, 2000);
  if (dom.magnifyValue) dom.magnifyValue.textContent = String(state.magnify);
  if (dom.hudMag) dom.hudMag.textContent = String(state.magnify);
  if (dom.eduMag) dom.eduMag.textContent = `×${state.magnify}`;
  if (dom.scaleMag) dom.scaleMag.textContent = String(state.magnify);
}

function changeMicrometer(dir) {
  if (engine.isActive() || state.frozen || state.estop) return;
  const next = clamp(state.micrometer + dir * 0.01, -0.99, 0.99);
  state.micrometer = Math.round(next * 100) / 100;
  if (dom.micValue) dom.micValue.textContent = state.micrometer.toFixed(2);
  refreshUI(engine.getSnapshot(), true);
}

function setScanPreset(value) {
  if (state.cinema.active) stopCinema(false);
  if (state.estop) { toast('急停已触发，请先复位', 'warn'); updatePresetOption(); return; }
  if (state.exploded) { toast('请先退出分层视图', 'warn'); updatePresetOption(); return; }
  engine.setPreset(value);
  clearSelection();
  frameState.visualDelta = 0;
  pulseUntil = 0;
  toast(`误差信号切换为${value === 'pass' ? '合格示例' : value === 'fail' ? '超差示例' : '随机示意'}`, 'info');
  updateAllUI(true);
}

/* ------------------------------------------------------------------ */
/* Structure modes, section and exploded view                          */
/* ------------------------------------------------------------------ */

function applySectionVisual(section) {
  if (!instrument) return;
  for (const obj of instrument.motion.sectionHide || []) obj.visible = !section;
  for (const obj of instrument.motion.sectionShow || []) obj.visible = section;
  for (const obj of instrument.motion.bearingSectionHide || []) obj.visible = !section;
  const cutFace = instrument.motion.headShell?.userData?.cutFace;
  // The cut face is a cosmetic overlay plane; keep the actual opening clear so
  // the lever, flexure and LVDT remain legible.
  if (cutFace) cutFace.visible = false;
}

function updateStructureButtons() {
  for (const b of ui.structureButtons) {
    b.classList.toggle('is-active', b.dataset.structure === state.structure);
  }
}

function updateModeCaption() {
  if (!dom.modeCaption) return;
  if (state.structure === 'exploded') {
    dom.modeEyebrow.textContent = 'EXPLODED / 05 MODULES';
    dom.modeTitle.textContent = '分层爆炸视图';
    dom.modeCopy.textContent = '基座 → 立柱悬臂 → Y 轴驱动 → 微位移传递 → 齿轮';
  } else if (state.structure === 'section') {
    dom.modeEyebrow.textContent = 'SECTION A—A / TRANSFER';
    dom.modeTitle.textContent = '3 : 1 微位移传递链';
    dom.modeCopy.textContent = '红宝石测球 → 测杆 → 杠杆 → 单片簧 → LVDT';
  }
}

function setSection(enabled, opts = {}) {
  if (!instrument) return;
  if (state.exploded) {
    exitExplosion({ pendingStructure: enabled ? 'section' : 'exterior' });
    return;
  }
  state.structure = enabled ? 'section' : 'exterior';
  applySectionVisual(enabled);
  shadowDirty = true;
  if (annotations && annotations.mode !== 'exploded') {
    annotations.setMode(enabled ? 'section' : 'default');
    annotations.setEnabled(state.labelsOn && !state.cinema.active);
  }
  updateStructureButtons();
  if (enabled) {
    if (!opts.skipCamera && cameraDirector) cameraDirector.flyTo('transfer', { duration: 1.15 });
    toast('A—A 局部剖切 · 误差传递链已显露', 'info');
  } else {
    toast('恢复外观视图', 'info');
  }
  updateObserveUI(true);
  updateAllUI(true);
}

function setStructureExterior() {
  if (!instrument) return;
  if (state.exploded) { exitExplosion({ pendingStructure: 'exterior' }); return; }
  state.structure = 'exterior';
  applySectionVisual(false);
  if (annotations && annotations.mode !== 'exploded') {
    annotations.setMode('default');
    annotations.setEnabled(state.labelsOn && !state.cinema.active);
  }
  updateStructureButtons();
  updateObserveUI(true);
  updateAllUI(true);
}

function buildExplosionEntries() {
  if (explodeEntries.length) return;
  explodeEntries = instrument.explodeGroups.map(e => ({
    ...e, base: e.base.clone(), offset: e.offset.clone(),
  }));
  // Keep the transfer housing with the Y stage; only its internal chain is
  // separated. Detaching the whole head makes the exploded diagram hard to read.
  explodeEntries.sort((a, b) => (a.delay || 0) - (b.delay || 0));
}

function enterExplosion() {
  if (!instrument || state.exploded) return;
  if (state.cinema.active) stopCinema(false);
  if (state.estop) { toast('急停状态下不能进入分层视图', 'warn'); return; }
  buildExplosionEntries();
  state.explodeState = {
    structure: state.structure,
    camera: cameraDirector?.saveState(),
    paused: engine.paused,
    labels: state.labelsOn,
  };
  state.frozen = true;
  state.exploded = true;
  state.structure = 'exploded';
  state.explodeTarget = 1;
  state.explodeProgress = 0;
  state.leavingExplode = false;
  state.explodeFloor = { floor: environment.floor.visible, shadow: environment.shadow.visible, dust: environment.dust.visible };
  environment.floor.visible = false;
  environment.shadow.visible = false;
  environment.dust.visible = false;
  if (explodeLight) explodeLight.intensity = 1.55;
  applySectionVisual(true);
  applyExplosion(0);
  updateStructureButtons();
  if (annotations && state.labelsOn) {
    annotations.setMode('exploded');
    annotations.setEnabled(state.labelsOn);
  }
  if (cameraDirector) {
    cameraDirector.autoEnabled = false;
    cameraDirector.flyTo('exploded', { duration: 1.35 });
  }
  toast('分层爆炸图 · 机构展示已暂停', 'info', 2800);
  refreshUI(engine.getSnapshot(), true);
}

function exitExplosion(opts = {}) {
  if (!state.exploded && state.explodeProgress <= 0.001) return;
  if (state.leavingExplode) return;
  state.leavingExplode = true;
  state.explodeTarget = 0;
  state.pendingStructure = opts.pendingStructure || (state.explodeState?.structure === 'section' ? 'section' : 'exterior');
  if (state.pendingStructure === 'section') {
    // collapse then re-open the section once the assembly is home
  }
}

function updateExplosion(dt) {
  if (Math.abs(state.explodeProgress - state.explodeTarget) < 0.0005) {
    if (state.leavingExplode && state.explodeProgress <= 0.0005) finishExplodeState();
    return;
  }
  const dir = Math.sign(state.explodeTarget - state.explodeProgress);
  state.explodeProgress = clamp(state.explodeProgress + dir * dt / 1.32, 0, 1);
  shadowDirty = true;
  applyExplosion(state.explodeProgress);
  if (state.explodeProgress >= 0.999 && state.explodeTarget === 1) {
    state.explodeProgress = 1;
    applyExplosion(1);
  }
  if (state.explodeProgress <= 0.001 && state.explodeTarget === 0) {
    state.explodeProgress = 0;
    applyExplosion(0);
    if (state.leavingExplode) finishExplodeState();
  }
}

function applyExplosion(progress) {
  const p = clamp(progress, 0, 1);
  if (gear) {
    const gearOffset = new THREE.Vector3(-720, -40, -420);
    const local = clamp(p / 0.65, 0, 1);
    const e = local * local * (3 - 2 * local);
    gear.group.position.copy(gearBasePosition).addScaledVector(gearOffset, e);
  }
  for (const entry of explodeEntries) {
    const start = (entry.delay || 0) * 0.45;
    const local = clamp((p - start) / (1 - start), 0, 1);
    const e = local * local * (3 - 2 * local);
    if (!entry.object) continue;
    entry.object.position.copy(entry.base).addScaledVector(entry.offset, e);
  }
  if (p <= 0.0001) {
    // Literal rest restore for deterministic assembly.
    if (gear) gear.group.position.copy(gearBasePosition);
    for (const entry of explodeEntries) {
      if (entry.object) entry.object.position.copy(entry.base);
    }
  }
}

function finishExplodeState(instant = false) {
  if (!state.exploded && !state.explodeState) return;
  const prev = state.explodeState;
  const pending = state.pendingStructure || prev?.structure || 'exterior';
  state.exploded = false;
  state.frozen = false;
  state.leavingExplode = false;
  state.pendingStructure = null;
  state.explodeTarget = 0;
  state.explodeProgress = 0;
  applyExplosion(0);
  if (state.explodeFloor) {
    environment.floor.visible = state.explodeFloor.floor;
    environment.shadow.visible = state.explodeFloor.shadow;
    environment.dust.visible = state.explodeFloor.dust;
    state.explodeFloor = null;
  }
  if (explodeLight) explodeLight.intensity = 0;
  if (prev?.camera) cameraDirector?.restoreState(prev.camera);
  if (prev?.paused !== undefined) {
    engine.paused = prev.paused;
    engine.pausedMode = prev.paused ? engine.pausedMode : null;
  }
  if (pending === 'section') {
    state.structure = 'section';
    applySectionVisual(true);
    if (!instant) cameraDirector?.flyTo('section', { duration: 1.1 });
    state.explodeState = null;
    if (annotations) { annotations.setMode('section'); annotations.setEnabled(state.labelsOn && !state.cinema.active); }
    updateStructureButtons();
    updateAllUI(true);
    return;
  }
  state.structure = 'exterior';
  applySectionVisual(false);
  state.explodeState = null;
  if (annotations) { annotations.setMode('default'); annotations.setEnabled(state.labelsOn && !state.cinema.active); }
  updateStructureButtons();
  updateAllUI(true);
}

function setStructure(mode) {
  if (!['exterior', 'section', 'exploded'].includes(mode)) return;
  if (state.cinema.active) stopCinema(false);
  if (mode === 'exploded') {
    if (state.exploded) exitExplosion();
    else enterExplosion();
    return;
  }
  if (state.exploded) {
    exitExplosion({ pendingStructure: mode });
    return;
  }
  if (mode === 'section') setSection(true);
  else setStructureExterior();
}

/* ------------------------------------------------------------------ */
/* Cinema director                                                     */
/* ------------------------------------------------------------------ */

function setCinemaCaption(title, copy) {
  if (dom.cinemaTitle) dom.cinemaTitle.innerHTML = title;
  if (dom.cinemaCopy) dom.cinemaCopy.textContent = copy;
}

function startCinema() {
  if (state.cinema.active) return;
  if (state.estop) { toast('请先复位急停', 'warn'); return; }
  if (state.exploded) { toast('请先退出分层爆炸视图', 'warn'); return; }
  if (state.structure !== 'exterior') {
    state.structure = 'exterior';
    applySectionVisual(false);
    if (annotations) annotations.setMode('default');
    updateStructureButtons();
  }
  clearSelection();
  clearTemporaryHighlights();
  const c = state.cinema;
  c.savedSpeed = engine.speed;
  c.savedObserveMode = state.observeMode;
  c.savedObserveScale = state.manualScale;
  c.labelsBefore = state.labelsOn;
  c.changedSpeed = false;
  c.active = true;
  c.t = 0;
  c.index = 0;
  c.startedAt = performance.now();
  engine.reset(true);
  engine.setSpeed(CFG.scan.maxSpeed);
  if (dom.scanSpeed) { dom.scanSpeed.value = engine.speed; setRangeFill(dom.scanSpeed); }
  if (annotations) annotations.setEnabled(false);
  if (cameraDirector) {
    cameraDirector.autoEnabled = false;
    cameraDirector.flyTo('overview', { duration: 1.1 });
  }
  dom.stage?.classList.add('is-cinema');
  stage.classList.add('is-cinema');
  app.classList.add('is-cinema');
  dom.cinemaLayer?.classList.add('is-visible');
  dom.cinemaLayer?.setAttribute('aria-hidden', 'false');
  if (dom.cinemaTime) dom.cinemaTime.textContent = '00:00';
  if (dom.cinemaProgress) dom.cinemaProgress.style.width = '0%';
  setCinemaCaption('在大齿轮旁，<br />重建一微米的秩序。', '双球定位 · 切线扫描 · 微米级误差传递');
  if (audio) audio.setMuted(audio.muted); // no-op if muted
  c.events = [
    { t: 0.15, fn: () => setCinemaCaption('在大齿轮旁，<br />重建一微米的秩序。', '双球定位 · 切线扫描 · 微米级误差传递') },
    { t: 1.9, fn: () => { cameraDirector?.flyTo('drivetrain', { duration: 1.25 }); setCinemaCaption('01 / 传动链', '步进电机 → 膜片联轴器 → C3 滚珠丝杆 → P4 导轨 → 滑台'); } },
    { t: 2.4, fn: () => flashParts(['motor'], 900) },
    { t: 2.8, fn: () => { engine.start(); } },
    { t: 3.4, fn: () => flashParts(['coupling'], 900) },
    { t: 3.9, fn: () => flashParts(['screw'], 900) },
    { t: 4.4, fn: () => flashParts(['rail'], 900) },
    { t: 4.9, fn: () => flashParts(['stage'], 900) },
    { t: 5.7, fn: () => { cameraDirector?.flyTo('overview', { duration: 1.2 }); setCinemaCaption('02 / 双球定基准', '齿槽即天然基准 · W 258.88 mm · k 11'); } },
    { t: 6.2, fn: () => flashParts(['ballA', 'ballB'], 1300) },
    { t: 7.0, fn: () => { cameraDirector?.flyTo('transfer', { duration: 1.25 }); setCinemaCaption('03 / 微米传递', '测杆 → 杠杆 3:1 → 单片簧 → LVDT · 位移按 ×' + state.magnify + ' 呈现'); } },
    { t: 10.4, fn: () => { cameraDirector?.flyTo('overview', { duration: 1.2 }); setCinemaCaption('04 / 扫描采样', '2.0 mm/s 教学速度 · 60 个采样点 · ff = e<sub>max</sub> − e<sub>min</sub>'); } },
    { t: 11.5, fn: () => { cameraDirector?.flyTo('reversal', { duration: 1.25 }); setCinemaCaption('05 / ±22.45° 换向', '齿条齿轮驱动 · 交叉滚子轴承 · φ4 定位销锁紧'); } },
    { t: 12.2, fn: () => flashParts(['bearing', 'rack'], 1400) },
    { t: 16.3, fn: () => { cameraDirector?.flyTo('overview', { duration: 1.2 }); setCinemaCaption('06 / 右齿面', '第二组误差曲线以虚线生长 · 与左齿面共用 45 μm 公差带'); } },
    { t: 18.4, fn: () => flashParts(['ruby', 'lever', 'lvdt'], 1300) },
    { t: 19.4, fn: () => cameraDirector?.flyTo('transfer', { duration: 1.2 }) },
    { t: 22.2, fn: () => cameraDirector?.flyTo('overview', { duration: 1.35 }) },
    { t: 25.2, fn: () => {
      const res = engine.getResult();
      const l = engine.faces.left.ff;
      const r = engine.faces.right.ff;
      const ffText = `${l == null ? '—' : formatMicron(l)} / ${r == null ? '—' : formatMicron(r)} μm`;
      setCinemaCaption('双齿面评定', `${res.label} · ff 左 / 右 = ${ffText}`);
    } },
    { t: 26.7, fn: () => stopCinema(true) },
  ];
  updateAllUI(true);
}

function updateCinema(dt, now) {
  const c = state.cinema;
  c.t += dt;
  while (c.index < c.events.length && c.t >= c.events[c.index].t) {
    const ev = c.events[c.index];
    c.index++;
    try { ev.fn(); } catch (err) { console.warn('Cinematic step failed', err); }
  }
  const pct = clamp(c.t / c.duration, 0, 1);
  if (dom.cinemaProgress) dom.cinemaProgress.style.width = `${pct * 100}%`;
  if (dom.cinemaTime) {
    const total = Math.floor(c.t);
    dom.cinemaTime.textContent = `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  }
  if (c.t >= c.duration) stopCinema(true);
}

function stopCinema(normal = false) {
  const c = state.cinema;
  if (!c.active) return;
  c.active = false;
  c.index = c.events.length;
  dom.cinemaLayer?.classList.remove('is-visible');
  dom.cinemaLayer?.setAttribute('aria-hidden', 'true');
  stage.classList.remove('is-cinema');
  app.classList.remove('is-cinema');
  dom.stage?.classList.remove('is-cinema');
  if (annotations) annotations.setEnabled(state.labelsOn);
  clearTemporaryHighlights();
  if (cameraDirector) cameraDirector.autoEnabled = true;
  if (normal) {
    // A completed film returns the teaching controls to their pre-film values.
    if (!c.changedSpeed) engine.setSpeed(c.savedSpeed);
    state.observeMode = c.savedObserveMode;
    state.manualScale = c.savedObserveScale;
    if (dom.scanSpeed) { dom.scanSpeed.value = engine.speed; setRangeFill(dom.scanSpeed); }
    toast('演示完成 · 双齿面评定已生成', 'info', 3000);
  } else if (cameraDirector?.tween) {
    cameraDirector.cancelTween(true);
  }
  if (cameraDirector) applyAnnotationModeForView(cameraDirector.currentPreset);
  updateObserveUI(true);
  updateAllUI(true);
}

/* ------------------------------------------------------------------ */
/* Sample highlighting and selection                                   */
/* ------------------------------------------------------------------ */

function clearEdgeRecords(records) {
  for (const rec of records) {
    try {
      rec.parent.remove(rec.line);
      rec.line.geometry.dispose();
    } catch { /* ignore */ }
  }
  records.length = 0;
}

function clearSelection() {
  clearEdgeRecords(selectionLines);
  state.selectedKeys = [];
  if (dom.partInspector) dom.partInspector.hidden = true;
  for (const b of ui.sourceButtons) b.classList.remove('is-active');
}

function clearTemporaryHighlights() {
  clearEdgeRecords(pulseLines);
  pulseLineClearAt = 0;
}

function collectMeshesForKeys(keys) {
  const meshes = new Set();
  for (const key of keys) {
    if (key === 'gear') {
      // The gear is enormous; only its visible rim and web need an accent.
      if (gear) {
        const candidates = [];
        gear.group.traverse(o => {
          if (o.isMesh && o.geometry?.attributes?.position && !o.material?.transparent) candidates.push(o);
        });
        candidates.slice(0, 8).forEach(m => meshes.add(m));
      }
      continue;
    }
    const groups = instrument.partGroups?.[key];
    if (!groups) continue;
    for (const g of groups) {
      g.traverse(o => {
        if (o.isMesh && !o.isInstancedMesh && o.geometry?.attributes?.position && !o.material?.transparent) {
          if (o.geometry.attributes.position.count > 35000) return;
          meshes.add(o);
        }
      });
    }
  }
  return [...meshes].slice(0, 34);
}

function addEdgeSet(meshes, color, opacity) {
  const records = [];
  const mat = new THREE.LineBasicMaterial({
    color, transparent: true, opacity, depthWrite: false,
    toneMapped: false,
  });
  let n = 0;
  for (const mesh of meshes) {
    if (n++ > 34) break;
    try {
      const edges = new THREE.EdgesGeometry(mesh.geometry, 32);
      if (!edges.attributes.position?.count) continue;
      const line = new THREE.LineSegments(edges, mat);
      line.raycast = () => {};
      line.renderOrder = 3;
      mesh.add(line);
      records.push({ parent: mesh, line });
    } catch { /* ignore exotic geometry */ }
  }
  return records;
}

function flashParts(keys, duration = 1200) {
  clearTemporaryHighlights();
  const meshes = collectMeshesForKeys(keys);
  const records = addEdgeSet(meshes, 0x0E7490, 0.82);
  pulseLines = records;
  pulseLineClearAt = performance.now() + duration;
}

function selectPartKeys(keys, overrideInfo = null, { scroll = true } = {}) {
  if (!keys || !keys.length) { clearSelection(); return; }
  clearSelection();
  state.selectedKeys = [...new Set(keys)];
  const meshes = collectMeshesForKeys(state.selectedKeys);
  selectionLines = addEdgeSet(meshes, 0x0B6477, 0.78);
  let info = overrideInfo;
  if (!info) {
    if (state.selectedKeys.length === 1) info = PARTS[state.selectedKeys[0]];
    else {
      const names = state.selectedKeys.map(k => PARTS[k]?.name).filter(Boolean);
      info = {
        code: 'MULTI / SELECTION',
        name: names.join(' · '),
        desc: '多个机构部件联合高亮。沿误差链查看各部件的受力、刚度与传动关系。',
        specs: state.selectedKeys.flatMap(k => (PARTS[k]?.specs || []).slice(0, 3)).slice(0, 10),
      };
    }
  }
  if (!info) return;
  dom.inspectorCode.textContent = info.code || 'COMPONENT';
  dom.inspectorName.textContent = info.name || '部件';
  dom.inspectorDesc.textContent = info.desc || '';
  dom.inspectorSpecs.innerHTML = '';
  for (const pair of info.specs || []) {
    const dt = document.createElement('dt');
    dt.textContent = pair[0];
    const dd = document.createElement('dd');
    dd.textContent = pair[1];
    dom.inspectorSpecs.append(dt, dd);
  }
  dom.partInspector.hidden = false;
  if (scroll) {
    try {
      if (window.innerWidth <= 760) {
        dom.partInspector.scrollIntoView({ block: 'center', behavior: 'smooth' });
      } else if (dom.consoleScroll) {
        const top = dom.partInspector.getBoundingClientRect().top -
          dom.consoleScroll.getBoundingClientRect().top + dom.consoleScroll.scrollTop - 10;
        dom.consoleScroll.scrollTo({ top, behavior: 'smooth' });
      }
    } catch { /* ignore */ }
  }
}

const SOURCE_SELECTIONS = {
  positioning: {
    keys: ['ballA', 'ballB'],
    info: { ...PARTS.dualBall, desc: '定位重复性贡献 32%。主球 A 锁定基准，副球 B 由预紧弹簧自适应，双球共同抵消安装偏心与重复定位误差。' },
  },
  straightness: {
    keys: ['rail'],
    info: { ...PARTS.rail, desc: '导轨直线度贡献 10%。P4 导轨与位移传感器基准平行度控制在 1.5 μm 内，误差采用软件补偿。' },
  },
  motion: {
    keys: ['screw', 'stage'],
    info: { ...PARTS.stage, desc: '运动平稳性贡献 6%。C3 双螺母滚珠丝杆与 P4 导轨的配合决定扫描爬行与速度平稳性。' },
  },
  others: {
    keys: ['coupling', 'lever', 'lvdt', 'bearing'],
    info: {
      code: 'RSS / OTHERS',
      name: '其余 7 项复合误差',
      desc: '平行度、传动回差、换向定位、线性度、测杆变形、机构滞后与温度变形合计贡献约 52%。高亮显示相关柔性环节和换向基准。',
      specs: [
        ['平行度', '1.2 μm · 均匀'],
        ['传动回差', '0.8 μm · 均匀'],
        ['换向定位', '1.8 μm · 正态'],
        ['传递线性度', '0.8 μm · 均匀'],
        ['测杆受力', '1.2 μm · 正态'],
        ['机构滞后', '0.4 μm · 正态'],
        ['温度变形', '1.8 μm · 均匀'],
        ['合成扩展不确定度', 'U ≈ 9.6 μm (k=2)'],
      ],
    },
  },
};

function applySourceSelection(key) {
  const sel = SOURCE_SELECTIONS[key];
  if (!sel) return;
  selectPartKeys(sel.keys, sel.info);
  for (const b of ui.sourceButtons) b.classList.toggle('is-active', b.dataset.source === key);
}

function partKeyOf(obj) {
  let p = obj;
  while (p) {
    if (p.userData?.partKey) return p.userData.partKey;
    p = p.parent;
  }
  return null;
}

function raycastPart(clientX, clientY) {
  const rect = renderer.domElement.getBoundingClientRect();
  ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(ndc, camera);
  const hits = raycaster.intersectObjects(scene.children, true);
  for (const hit of hits) {
    const o = hit.object;
    if (!o.isMesh && !o.isInstancedMesh) continue;
    if (o.material?.transparent) continue;
    const key = partKeyOf(o);
    if (key) return { key, object: o, point: hit.point };
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Input events                                                        */
/* ------------------------------------------------------------------ */

function wireEvents() {
  // Actions.
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn || btn.disabled) return;
    const action = btn.dataset.action;
    if (action === 'play') doPlay();
    else if (action === 'pause') doPause();
    else if (action === 'position') doPosition();
    else if (action === 'reverse') doReverse();
    else if (action === 'reset') doReset();
    else if (action === 'cinema') startCinema();
  });

  for (const btn of ui.viewButtons) {
    btn.addEventListener('click', () => {
      if (state.cinema.active) stopCinema(false);
      const name = btn.dataset.view;
      if (name === 'reset') {
        cameraDirector.flyTo('overview', { duration: 1.0 });
        return;
      }
      if (name === 'transfer' && state.structure !== 'exploded' && state.structure !== 'section') {
        setSection(true);
        return;
      }
      if (state.exploded) {
        toast('分层视图中仍可自由旋转镜头', 'info');
      }
      cameraDirector.flyTo(name, { duration: 1.12 });
    });
  }

  for (const btn of ui.structureButtons) {
    btn.addEventListener('click', () => {
      if (state.cinema.active) stopCinema(false);
      setStructure(btn.dataset.structure);
    });
  }

  for (const b of ui.faceButtons) {
    b.addEventListener('click', () => selectFace(b.dataset.face));
  }

  for (const b of ui.observeButtons) {
    b.addEventListener('click', () => setObserveMode(b.dataset.observe));
  }

  for (const b of ui.micButtons) {
    b.addEventListener('click', () => changeMicrometer(Number(b.dataset.mic)));
  }

  for (const b of ui.sourceButtons) {
    b.addEventListener('click', () => applySourceSelection(b.dataset.source));
  }

  dom.scanSpeed?.addEventListener('input', () => {
    engine.setSpeed(dom.scanSpeed.value);
    if (state.cinema.active) state.cinema.changedSpeed = true;
    if (dom.speedValue) dom.speedValue.textContent = engine.speed.toFixed(1);
    if (dom.hudSpeed) dom.hudSpeed.textContent = engine.speed.toFixed(1);
    setRangeFill(dom.scanSpeed);
  });
  dom.sampleCount?.addEventListener('input', () => {
    engine.setSampleCount(dom.sampleCount.value);
    if (dom.samplesValue) dom.samplesValue.textContent = String(engine.sampleCount);
    setRangeFill(dom.sampleCount);
    buildTimelineTicks(engine.sampleCount);
    updateAllUI(false);
  });
  dom.presentationScale?.addEventListener('input', () => {
    setManualObserveScale(dom.presentationScale.value);
  });
  dom.dockObserve?.addEventListener('change', () => {
    if (dom.dockObserve.value === 'auto') setObserveMode('auto');
    else if (dom.dockObserve.value === '1.00') setObserveMode('real');
    else setManualObserveScale(dom.dockObserve.value);
  });
  dom.magnify?.addEventListener('input', () => {
    changeMagnify(dom.magnify.value);
    setRangeFill(dom.magnify);
  });
  dom.coarseX?.addEventListener('input', () => {
    if (engine.isActive() || state.frozen) return;
    engine.setUserCoarse(dom.coarseX.value);
    if (dom.coarseValue) dom.coarseValue.textContent = Number(dom.coarseX.value).toFixed(1);
    setRangeFill(dom.coarseX);
    refreshUI(engine.getSnapshot(), true);
  });
  dom.probeForce?.addEventListener('input', () => {
    engine.setForce(dom.probeForce.value);
    if (dom.forceValue) dom.forceValue.textContent = engine.forceN.toFixed(2);
    setRangeFill(dom.probeForce);
    refreshUI(engine.getSnapshot(), true);
  });
  dom.signalPreset?.addEventListener('change', () => setScanPreset(dom.signalPreset.value));
  dom.axisToggle?.addEventListener('click', () => {
    const axis = chart.toggleAxis();
    dom.axisToggle.textContent = axis === 's' ? 'X：展开长度 s' : 'X：展开角 φ';
    chart.draw(performance.now());
  });
  dom.timelineRange?.addEventListener('pointerdown', () => {
    state.timelineDragging = true;
    stage.classList.add('has-interacted');
  });
  const endTimeline = () => { state.timelineDragging = false; };
  dom.timelineRange?.addEventListener('pointerup', endTimeline);
  dom.timelineRange?.addEventListener('pointercancel', endTimeline);
  dom.timelineRange?.addEventListener('input', () => {
    if (state.frozen || state.exploded || state.estop) return;
    if (engine.isActive() && !engine.paused) engine.pauseToggle();
    if (['positioning', 'reversing'].includes(engine.mode)) return;
    engine.seek(Number(dom.timelineRange.value));
    refreshUI(engine.getSnapshot(), true);
  });

  dom.qualitySelect?.addEventListener('change', () => applyQuality(dom.qualitySelect.value));
  dom.labelToggle?.addEventListener('click', () => {
    state.labelsOn = !state.labelsOn;
    annotations.setEnabled(state.labelsOn && !state.cinema.active);
    dom.labelToggle.setAttribute('aria-pressed', String(state.labelsOn));
    dom.labelToggle.classList.toggle('is-off', !state.labelsOn);
  });
  dom.soundToggle?.addEventListener('click', async () => {
    if (!audio) return;
    const muted = !audio.muted;
    try {
      await audio.setMuted(muted);
    } catch (err) {
      toast('音频初始化失败，浏览器可能禁止了自动音频', 'warn');
      return;
    }
    dom.soundToggle.setAttribute('aria-pressed', String(!muted));
    dom.volumeWrap?.classList.toggle('is-visible', !muted);
    toast(muted ? '声音已关闭' : '声音已开启 · 跟随真实扫描速度', 'info');
    if (!muted) audio.update({ running: engine.isRunning, speed: engine.speed });
  });
  dom.volumeRange?.addEventListener('input', () => {
    audio?.setVolume(Number(dom.volumeRange.value));
    setRangeFill(dom.volumeRange);
  });
  dom.helpButton?.addEventListener('click', openHelp);
  $('chartJump')?.addEventListener('click', () => {
    if (!dom.chartSection) return;
    if (window.innerWidth <= 760) {
      const top = dom.chartSection.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo(0, top);
      return;
    }
    if (!dom.consoleScroll) return;
    const top = dom.chartSection.getBoundingClientRect().top -
      dom.consoleScroll.getBoundingClientRect().top + dom.consoleScroll.scrollTop - 10;
    const oldBehavior = dom.consoleScroll.style.scrollBehavior;
    dom.consoleScroll.style.scrollBehavior = 'auto';
    dom.consoleScroll.scrollTop = top;
    dom.consoleScroll.style.scrollBehavior = oldBehavior;
  });
  for (const close of $$('[data-close]')) close.addEventListener('click', closeHelp);
  dom.inspectorClose?.addEventListener('click', clearSelection);
  dom.canvasHost?.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    showFatal('WebGL 上下文已丢失。请刷新页面重新建立三维场景。');
  });
  window.addEventListener('resize', () => {
    if (resizeScheduled) return;
    resizeScheduled = true;
    requestAnimationFrame(() => { resizeScheduled = false; resizeScene(); });
  });

  // Camera interaction clears the active preset label and stops idle drift.
  let camStart = null;
  controls.addEventListener('start', () => {
    camStart = camera.position.clone();
    if (state.cinema.active) stopCinema(false);
    stage.classList.add('has-interacted');
    if (dom.sliderHint) dom.sliderHint.style.opacity = '0';
  });
  controls.addEventListener('end', () => {
    if (camStart && camera.position.distanceTo(camStart) > 2) {
      cameraDirector.currentPreset = null;
      syncViewButtons(null);
    }
    camStart = null;
  });

  // Click / hover picking only on the WebGL canvas.
  let down = null;
  renderer.domElement.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    down = { x: e.clientX, y: e.clientY, t: performance.now() };
  });
  renderer.domElement.addEventListener('pointerup', (e) => {
    if (!down) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    const elapsed = performance.now() - down.t;
    down = null;
    if (moved > 6 || elapsed > 720) return;
    const hit = raycastPart(e.clientX, e.clientY);
    if (!hit) { clearSelection(); return; }
    if (hit.key === 'emergencyStop') {
      selectPartKeys(['emergencyStop'], PARTS.emergencyStop, { scroll: true });
      triggerEmergencyStop();
      return;
    }
    selectPartKeys([hit.key], null, { scroll: true });
  });
  renderer.domElement.addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (now - hoverRayTimer < 90) return;
    hoverRayTimer = now;
    const hit = raycastPart(e.clientX, e.clientY);
    renderer.domElement.style.cursor = hit ? 'pointer' : 'grab';
  });
  renderer.domElement.addEventListener('pointerleave', () => {
    renderer.domElement.style.cursor = 'grab';
  });

  // Cinema interruption. This runs before the target control receives its click,
  // so the control still performs the user's intended action.
  window.addEventListener('pointerdown', () => {
    if (state.cinema.active) stopCinema(false);
  }, true);
  window.addEventListener('wheel', () => {
    if (state.cinema.active) stopCinema(false);
  }, { capture: true, passive: true });
  window.addEventListener('keydown', () => {
    if (state.cinema.active) stopCinema(false);
  }, true);

  document.addEventListener('keydown', (e) => {
    const tag = (e.target?.tagName || '').toLowerCase();
    if (['input', 'select', 'textarea'].includes(tag) || e.target?.isContentEditable) return;
    if (e.key === 'Escape') {
      if (!dom.helpModal.hidden) { closeHelp(); return; }
      if (state.exploded) { exitExplosion(); return; }
      clearSelection();
      return;
    }
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      if (state.frozen) return;
      if (engine.isActive()) doPause();
      else doPlay();
      return;
    }
    if (state.cinema.active) stopCinema(false);
    const k = e.key.toLowerCase();
    if (k === 'r') cameraDirector.flyTo('overview', { duration: 1.0 });
    else if (k === 'c') setSection(state.structure !== 'section');
    else if (k === 'e') setStructure('exploded');
    else if (k === 'm') dom.soundToggle?.click();
    else if (k === 'd') toggleDebug();
    else if (['1', '2', '3', '4', '5'].includes(k)) {
      const names = ['overview', 'positioning', 'drivetrain', 'transfer', 'reversal'];
      const name = names[Number(k) - 1];
      if (name === 'transfer') setSection(true);
      else cameraDirector.flyTo(name, { duration: 1.05 });
    }
  });

  document.addEventListener('visibilitychange', () => {
    lastFrame = performance.now();
    if (document.hidden) {
      if (audio) audio.update({ running: false, speed: engine.speed });
    }
  });

  // A subtle motion-only feedback: sample flicker handled in tick.

  if (dom.micValue) dom.micValue.textContent = state.micrometer.toFixed(2);
}

function toggleDebug() {
  state.debug = !state.debug;
  if (dom.debugPanel) dom.debugPanel.hidden = !state.debug;
  if (state.debug) refreshUI(engine.getSnapshot(), true);
  toast(state.debug ? '调试读数已开启（D）' : '调试读数已关闭', 'info', 1300);
}

/* ------------------------------------------------------------------ */
/* Start                                                               */
/* ------------------------------------------------------------------ */

boot();

