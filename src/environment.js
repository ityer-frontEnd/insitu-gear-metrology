import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { COLORS } from './config.js';
import { makeContactShadowTexture, makeGlowTexture, mulberry32 } from './utils.js';

function makeStudioEnvironment(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const env = new THREE.Scene();

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(100, 32, 20),
    new THREE.MeshBasicMaterial({ color: 0x52606E, side: THREE.BackSide }),
  );
  env.add(dome);

  function panel(w, h, x, y, z, color, intensity = 1) {
    const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
    mat.color.setRGB(color[0] * intensity, color[1] * intensity, color[2] * intensity);
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    mesh.position.set(x, y, z);
    mesh.lookAt(0, 0, 0);
    env.add(mesh);
    return mesh;
  }

  // Large warm-neutral overhead softbox.
  panel(52, 34, -23, 36, 25, [1.0, 0.88, 0.75], 3.7);
  // Tall cool strip behind-left.
  panel(16, 44, 16, 13, -36, [0.32, 0.78, 0.96], 3.0);
  // Narrow overhead white strip.
  panel(6, 36, 18, 30, 12, [0.92, 0.97, 1.0], 2.5);
  // Low warm bounce at front-left.
  panel(32, 10, -35, -2, 17, [0.92, 0.55, 0.34], 0.65);
  // Very subtle edge cards to preserve metal silhouettes.
  panel(8, 26, -41, 10, -10, [0.35, 0.52, 0.65], 0.7);
  panel(28, 6, 22, -6, 30, [0.5, 0.63, 0.7], 0.3);

  const renderTarget = pmrem.fromScene(env, 0.04, 0.1, 200);
  pmrem.dispose();
  dome.geometry.dispose();
  dome.material.dispose();
  return renderTarget.texture;
}

function makeBackdrop() {
  const geo = new THREE.SphereGeometry(11000, 48, 28);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTop: { value: new THREE.Color(0xF8FAFC) },
      uHorizon: { value: new THREE.Color(0xEFF3F8) },
      uBottom: { value: new THREE.Color(0xE5EAF1) },
      uWarm: { value: new THREE.Color(0xF3ECE5) },
    },
    vertexShader: `
      varying vec3 vWorld;
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: `
      uniform vec3 uTop;
      uniform vec3 uHorizon;
      uniform vec3 uBottom;
      uniform vec3 uWarm;
      varying vec3 vWorld;
      void main(){
        vec3 d = normalize(vWorld);
        float h = clamp(d.y * 0.5 + 0.5, 0.0, 1.0);
        vec3 col = mix(uBottom, uHorizon, smoothstep(0.0, 0.55, h));
        col = mix(col, uTop, smoothstep(0.48, 0.96, h));
        float horizon = exp(-pow(abs(d.y) * 11.0, 1.5));
        float warm = pow(clamp(dot(normalize(vec3(d.x, 0.0, d.z)), normalize(vec3(-0.72, 0.0, 0.69))), 0.0, 1.0), 5.0);
        col += uWarm * horizon * warm * 0.07;
        float cool = pow(clamp(dot(normalize(vec3(d.x, 0.0, d.z)), normalize(vec3(0.62, 0.0, -0.78))), 0.0, 1.0), 5.0);
        col += vec3(0.006, 0.012, 0.020) * horizon * cool;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = -10;
  mesh.frustumCulled = false;
  return mesh;
}

function makeDust(renderer) {
  const rand = mulberry32(77);
  const count = 260;
  const pos = new Float32Array(count * 3);
  const seedAttr = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3 + 0] = (rand() - 0.5) * 4300 - 120;
    pos[i * 3 + 1] = 50 + rand() * 1450;
    pos[i * 3 + 2] = (rand() - 0.5) * 3500 - 500;
    seedAttr[i] = rand();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const tex = makeGlowTexture(32, '#7A8FA5', 'rgba(255,255,255,.82)', 'rgba(122,143,165,.42)');
  const mat = new THREE.PointsMaterial({
    size: 2.0, map: tex, color: 0x7A8FA5, transparent: true, opacity: 0.16,
    depthWrite: false, blending: THREE.NormalBlending, sizeAttenuation: true,
    toneMapped: false,
  });
  const points = new THREE.Points(geo, mat);
  points.userData.count = count;
  points.userData.seed = seedAttr;
  points.userData.base = pos.slice();
  points.frustumCulled = false;
  return points;
}

export function createStageEnvironment(renderer, scene, materials, initialQuality = 'auto') {
  const envTex = makeStudioEnvironment(renderer);
  scene.environment = envTex;
  scene.environmentIntensity = 1.22;

  const backdrop = makeBackdrop();
  // The page's CSS cold-grey gradient is the viewport background in the light
  // theme; the studio backdrop remains available only for dark fallbacks.
  backdrop.visible = false;
  scene.add(backdrop);

  RectAreaLightUniformsLib.init();

  // Soft studio sources: actual lights for material response.
  // Broad overhead softbox: the dominant metal reflection on the gear face.
  const rectOver = new THREE.RectAreaLight(0xffe7d2, 1.48, 3300, 1900);
  rectOver.position.set(-420, 2450, -820);
  rectOver.lookAt(-330, 40, -540);
  scene.add(rectOver);

  const rectKey = new THREE.RectAreaLight(0xffe5cd, 1.34, 2400, 1200);
  rectKey.position.set(-1320, 1620, 1080);
  rectKey.lookAt(-180, 170, -300);
  scene.add(rectKey);

  const rectRim = new THREE.RectAreaLight(0x87d5e5, 1.02, 650, 1900);
  rectRim.position.set(950, 1050, -1450);
  rectRim.lookAt(-200, 220, -280);
  scene.add(rectRim);

  const rectFill = new THREE.RectAreaLight(0xffb17b, 0.36, 1400, 560);
  rectFill.position.set(1100, 230, 900);
  rectFill.lookAt(-150, 180, -260);
  scene.add(rectFill);

  const hemi = new THREE.HemisphereLight(0xE4EDF5, 0xB9C5D2, 0.56);
  scene.add(hemi);

  const topFill = new THREE.DirectionalLight(0xE2EBF3, 0.32);
  topFill.position.set(200, 2800, 900);
  topFill.target.position.set(-380, 0, -520);
  scene.add(topFill, topFill.target);

  const key = new THREE.DirectionalLight(0xfff1dd, 1.08);
  key.position.set(-1550, 2200, 1450);
  key.target.position.set(-280, 60, -350);
  scene.add(key, key.target);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -1950;
  key.shadow.camera.right = 1950;
  key.shadow.camera.top = 1700;
  key.shadow.camera.bottom = -1500;
  key.shadow.camera.near = 50;
  key.shadow.camera.far = 6500;
  key.shadow.bias = -0.00018;
  key.shadow.normalBias = 0.55;
  key.shadow.radius = 3;
  key.shadow.blurSamples = 8;

  const rim = new THREE.DirectionalLight(0x5DB4C6, 0.95);
  rim.position.set(900, 1200, -2300);
  rim.target.position.set(-150, 220, -300);
  scene.add(rim, rim.target);

  const fill = new THREE.DirectionalLight(0xB58B6B, 0.28);
  fill.position.set(1300, 440, 1300);
  fill.target.position.set(0, 160, -200);
  scene.add(fill, fill.target);

  // Low front fill protects the leveling screws and isolator pads in shadow.
  const lowFill = new THREE.DirectionalLight(0x9AABB8, 0.36);
  lowFill.position.set(1100, 110, 1500);
  lowFill.target.position.set(0, 90, 0);
  scene.add(lowFill, lowFill.target);

  // A muted work light low to reveal the leveling feet.
  const low = new THREE.PointLight(0xFFC79C, 28, 1400, 2);
  low.position.set(300, 90, 680);
  scene.add(low);

  // Floor.
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(15000, 15000, 1, 1),
    materials.floor,
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  floor.name = 'floor';
  floor.userData.fixedColor = true;
  scene.add(floor);

  // An almost-invisible circular stage seam, giving the paper floor a sense of place.
  const seamMat = new THREE.LineBasicMaterial({
    color: 0x7B8B9C, transparent: true, opacity: 0.16, depthWrite: false, toneMapped: false,
  });
  const seamPts = [];
  const seamR = 2840;
  for (let i = 0; i <= 256; i++) {
    const a = (i / 256) * Math.PI * 2;
    seamPts.push(new THREE.Vector3(Math.cos(a) * seamR - 250, 0.6, Math.sin(a) * seamR - 400));
  }
  const seam = new THREE.Line(new THREE.BufferGeometry().setFromPoints(seamPts), seamMat);
  seam.raycast = () => {};
  scene.add(seam);

  const shelfMat = new THREE.MeshBasicMaterial({
    color: 0x1F3A56, transparent: true, opacity: 0.18, depthWrite: false,
    map: makeContactShadowTexture(256, 0.88),
  });
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(1300, 1300), shelfMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.set(-120, 0.7, -430);
  shadowPlane.renderOrder = 1;
  shadowPlane.raycast = () => {};
  scene.add(shadowPlane);

  const dust = makeDust(renderer);
  scene.add(dust);

  function setQuality(mode) {
    const q = mode === 'high' ? 2048 : mode === 'smooth' ? 512 : 1024;
    if (key.shadow.mapSize.x !== q) {
      key.shadow.mapSize.set(q, q);
      if (key.shadow.map) {
        key.shadow.map.dispose();
        key.shadow.map = null;
      }
    }
    dust.visible = mode !== 'smooth';
    dust.geometry.setDrawRange(0, mode === 'high' ? 260 : mode === 'smooth' ? 80 : 170);
  }
  setQuality(initialQuality);

  const clock = { t: 0 };
  function update(dt) {
    if (!dust.visible) return;
    clock.t += dt;
    const arr = dust.geometry.attributes.position.array;
    const base = dust.userData.base;
    for (let i = 0; i < arr.length / 3; i++) {
      const ph = dust.userData.seed[i] * Math.PI * 2;
      arr[i * 3] = base[i * 3] + Math.sin(clock.t * 0.035 + ph) * 28 + Math.sin(clock.t * 0.013 + ph * 2) * 55;
      arr[i * 3 + 1] = base[i * 3 + 1] + Math.cos(clock.t * 0.026 + ph) * 20;
      arr[i * 3 + 2] = base[i * 3 + 2] + Math.cos(clock.t * 0.031 + ph * 1.5) * 24;
    }
    dust.geometry.attributes.position.needsUpdate = true;
  }

  return {
    envTex, floor, key, rim, topFill, dust, update, setQuality,
    shadow: shadowPlane,
    rect: { key: rectKey, rim: rectRim, fill: rectFill, overhead: rectOver },
    low,
  };
}

export function disposeEnvironment(renderer, env) {
  env?.envTex?.dispose();
}
