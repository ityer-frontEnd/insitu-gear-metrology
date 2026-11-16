import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const GradeShader = {
  name: 'InSituGrade',
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uVignette: { value: 0.09 },
    uGrain: { value: 0.0012 },
    uContrast: { value: 1.018 },
    uSaturation: { value: 0.99 },
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uVignette;
    uniform float uGrain;
    uniform float uContrast;
    uniform float uSaturation;
    varying vec2 vUv;

    float hash12(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    void main() {
      vec4 t = texture2D(tDiffuse, vUv);
      vec3 col = t.rgb;
      float l = dot(col, vec3(0.2126, 0.7152, 0.0722));

      // A restrained filmic contrast in the linear working space.
      col = (col - 0.5) * uContrast + 0.5;
      col = max(col, 0.0);

      // Cool, very slightly lifted shadows; clean neutral shoulders on paper.
      col += vec3(0.0015, 0.0030, 0.0055) * (1.0 - smoothstep(0.0, 0.22, l));
      col *= mix(vec3(1.0), vec3(1.006, 1.002, 0.996), smoothstep(0.18, 1.1, l));

      // Desaturate the dense graphite areas, leave cyan/amber accents alive.
      float grey = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(grey), col, uSaturation + 0.06 * smoothstep(0.32, 1.8, l));

      float d = distance(vUv, vec2(0.55, 0.47));
      float vig = smoothstep(0.86, 0.25, d);
      col *= mix(1.0 - uVignette, 1.0, vig);

      // Fine sensor grain only in the shadows/midtones.
      float grain = hash12(vUv * uResolution + vec2(uTime * 7.31, -uTime * 11.73));
      col += (grain - 0.5) * uGrain * (0.55 + 0.45 * (1.0 - smoothstep(0.1, 0.8, l)));

      gl_FragColor = vec4(col, t.a);
    }
  `,
};

export function createPostPipeline(renderer, scene, camera, initialMode = 'auto') {
  const size = renderer.getSize(new THREE.Vector2());
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(renderer.getPixelRatio());
  composer.setSize(size.x, size.y);

  const renderPass = new RenderPass(scene, camera);
  const gradePass = new ShaderPass(GradeShader);
  const outputPass = new OutputPass();
  composer.addPass(renderPass);
  composer.addPass(gradePass);
  composer.addPass(outputPass);

  let mode = initialMode;
  let enabled = true;
  let time = 0;

  function setMode(next) {
    mode = next;
    enabled = next !== 'smooth';
    composer.passes.forEach(p => { p.enabled = true; });
    gradePass.enabled = enabled;
    outputPass.enabled = true;
    renderPass.enabled = true;
  }

  function resize(width, height, pixelRatio) {
    composer.setPixelRatio(pixelRatio);
    composer.setSize(width, height);
    gradePass.uniforms.uResolution.value.set(width * pixelRatio, height * pixelRatio);
  }

  function render(dt) {
    time += dt;
    gradePass.uniforms.uTime.value = time;
    if (enabled) {
      composer.render(dt);
    } else {
      renderer.render(scene, camera);
    }
  }

  setMode(initialMode);

  return {
    composer, renderPass, gradePass, outputPass,
    render, resize, setMode,
    get mode() { return mode; },
    set enabled(v) { enabled = v; },
    get enabled() { return enabled; },
  };
}
