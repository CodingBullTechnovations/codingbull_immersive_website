'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { DevicePerformanceProfile } from '@/hooks/useDevicePerformanceProfile';
import { buildMindShapes, type MindShapeName } from './mindShapes';

interface CognitiveFieldSceneProps {
  /** The formation the field should currently hold. */
  shape: MindShapeName;
  /** True while an opaque chapter covers the layer — stops all rendering. */
  paused?: boolean;
  profile: Exclude<DevicePerformanceProfile, 'pending' | 'reducedMotion'>;
  onReadyChange: (ready: boolean) => void;
}

interface FieldController {
  setShape: (shape: MindShapeName) => void;
  setPaused: (paused: boolean) => void;
}

/**
 * Morphing particle field. Every particle carries a `from` and `to` position;
 * uMix blends between them, so the field can travel through an arbitrary
 * library of meaningful formations (logo → ECG → cart → workforce grid → node
 * graph → circuit lattice → logo) rather than a fixed set of abstract blobs.
 *
 * Interrupting a morph is safe: the renderer snapshots the current blended
 * positions into `aFrom` before retargeting, so shapes never pop.
 */
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMix;
  uniform float uScroll;
  uniform float uLogoPresence;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform float uPixelRatio;
  attribute float aSeed;
  attribute float aTone;
  attribute vec3 aFrom;
  attribute vec3 aTo;
  varying float vEnergy;
  varying float vTone;

  void main() {
    float eased = smoothstep(0.0, 1.0, uMix);
    vec3 p = mix(aFrom, aTo, eased);

    // Formation energy: particles brighten and spread slightly while travelling.
    float travel = sin(eased * 3.14159);

    // Ambient life so a settled formation never looks like a frozen bitmap.
    p.x += sin(uTime * 0.24 + aSeed * 21.0) * 0.055;
    p.y += cos(uTime * 0.19 + aSeed * 13.0) * 0.055;
    p.z += sin(uTime * 0.27 + aSeed * 17.0) * 0.12;

    // The logo formation breathes; other formations stay architectural.
    p.xy *= 1.0 + sin(uTime * 0.7 + aSeed * 8.0 + p.y * 0.7) * 0.022 * uLogoPresence;

    // Scatter outward mid-morph so the transition reads as motion, not a cut.
    p += normalize(p + vec3(0.001)) * travel * (0.35 + aSeed * 0.5);

    // Scroll parallax within the current chapter.
    p.y += uScroll * (0.55 + aSeed * 0.7);

    // Pointer repulsion field.
    vec2 pointerPosition = vec2(uPointer.x * 4.4, uPointer.y * 3.2);
    vec2 delta = p.xy - pointerPosition;
    float distanceToPointer = max(length(delta), 0.16);
    float influence = smoothstep(2.4, 0.05, distanceToPointer) * uPointerStrength;
    p.xy += normalize(delta) * influence * (0.68 + aSeed * 0.42);
    p.z += influence * (0.9 + sin(aSeed * 18.0) * 0.3);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (1.85 + aSeed * 2.6 + influence * 2.6 + travel * 1.2 + aTone * 1.4) * uPixelRatio * (9.2 / -mvPosition.z);
    vEnergy = 0.42 + aSeed * 0.44 + influence * 0.55 + travel * 0.35 + aTone * 0.4;
    vTone = aTone;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vEnergy;
  varying float vTone;

  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float distanceToCenter = length(center);
    float core = 1.0 - smoothstep(0.04, 0.5, distanceToCenter);
    float halo = (1.0 - smoothstep(0.18, 0.5, distanceToCenter)) * 0.42;
    float alpha = (core + halo) * min(vEnergy, 1.0);
    if (alpha < 0.02) discard;
    vec3 base = mix(uColor * 0.78, vec3(0.82, 0.95, 1.0), vEnergy * 0.5);
    // Particles sampled from the logo's white eye fills stay hot white.
    vec3 color = mix(base, vec3(1.0), vTone * 0.9);
    gl_FragColor = vec4(color, alpha);
  }
`;

function seededNoise(index: number) {
  const value = Math.sin(index * 91.731 + 17.113) * 43758.5453;
  return value - Math.floor(value);
}

interface SampledLogo {
  positions: Float32Array;
  seeds: Float32Array;
  tones: Float32Array;
  selected: Array<[number, number, number]>;
}

function sampleLogo(image: HTMLImageElement, isMobile: boolean): SampledLogo | null {
  const width = isMobile ? 142 : 176;
  const height = Math.round(width * (image.naturalHeight / image.naturalWidth));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return null;

  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  const pixels = context.getImageData(0, 0, width, height).data;
  const candidates: Array<[number, number, number]> = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const alpha = pixels[offset + 3];
      if (alpha <= 70) continue;
      // The logo's eye fills are the only near-white opaque pixels — tag them
      // so those particles render hot white, matching the brand mark.
      const isWhite = pixels[offset] > 200 && pixels[offset + 1] > 200 && pixels[offset + 2] > 200;
      candidates.push([x, y, isWhite ? 1 : 0]);
    }
  }

  const cap = isMobile ? 4200 : 9000;
  const count = Math.min(candidates.length, cap);
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const tones = new Float32Array(count);
  const selected: Array<[number, number, number]> = [];
  const scale = 6.0 / height;

  for (let index = 0; index < count; index += 1) {
    const sourceIndex = Math.floor((index / count) * candidates.length);
    const [x, y, tone] = candidates[sourceIndex];
    const seed = seededNoise(index);

    const px = (x - width / 2) * scale;
    const py = (height / 2 - y) * scale;
    const pz = (seed - 0.5) * 0.2;
    positions[index * 3] = px;
    positions[index * 3 + 1] = py;
    positions[index * 3 + 2] = pz;
    seeds[index] = seed;
    tones[index] = tone;
    selected.push([px, py, pz]);
  }

  return { positions, seeds, tones, selected };
}

function buildFilaments(points: Array<[number, number, number]>, isMobile: boolean) {
  const segmentCount = isMobile ? 130 : 360;
  const positions = new Float32Array(segmentCount * 6);

  for (let index = 0; index < segmentCount; index += 1) {
    const aIndex = Math.floor(seededNoise(index + 500) * points.length);
    const a = points[aIndex];
    let nearest = points[(aIndex + 1) % points.length];
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (let offset = 1; offset <= 28; offset += 1) {
      const b = points[(aIndex + offset * 11) % points.length];
      const dx = a[0] - b[0];
      const dy = a[1] - b[1];
      const distance = dx * dx + dy * dy;
      if (distance > 0.018 && distance < nearestDistance) {
        nearestDistance = distance;
        nearest = b;
      }
    }

    positions.set(a, index * 6);
    positions.set(nearest, index * 6 + 3);
  }

  return positions;
}

export default function CognitiveFieldScene({ shape, paused = false, profile, onReadyChange }: CognitiveFieldSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<FieldController | null>(null);
  const initialShapeRef = useRef(shape);
  const initialPausedRef = useRef(paused);

  useEffect(() => controllerRef.current?.setShape(shape), [shape]);
  useEffect(() => controllerRef.current?.setPaused(paused), [paused]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = profile === 'mobilePremium';
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let disposed = false;
    let frameId = 0;
    let visible = true;
    let pageVisible = !document.hidden;
    let pausedByChapter = initialPausedRef.current;
    let lastFrameTime = 0;
    let lastActivityTime = performance.now();
    let pointerStrength = 0;
    let targetPointerStrength = 0;
    let scrollPhase = 0;
    let targetScrollPhase = 0;
    let mix = 1;
    let currentShape: MindShapeName = initialShapeRef.current;
    const pointer = new THREE.Vector2();
    const targetPointer = new THREE.Vector2();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 40);
    camera.position.set(0, 0.05, isMobile ? 11.6 : 10.2);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' });
    } catch {
      onReadyChange(false);
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.35));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = 'absolute inset-0 h-full w-full';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    mount.appendChild(renderer.domElement);

    const field = new THREE.Group();
    scene.add(field);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    let pointMaterial: THREE.ShaderMaterial | null = null;
    let filamentMaterial: THREE.LineBasicMaterial | null = null;
    let fromAttribute: THREE.BufferAttribute | null = null;
    let toAttribute: THREE.BufferAttribute | null = null;
    let shapes: Record<MindShapeName, Float32Array> | null = null;

    const image = new Image();
    image.decoding = 'async';
    image.src = '/images/logo/logo.png';
    image.onload = () => {
      if (disposed) return;
      const sampled = sampleLogo(image, isMobile);
      if (!sampled) return;

      const count = sampled.seeds.length;
      shapes = buildMindShapes(count, sampled.positions);

      const start = shapes[currentShape] ?? sampled.positions;
      const pointGeometry = new THREE.BufferGeometry();
      // `position` is required by three for frustum culling maths; the shader
      // reads aFrom/aTo instead.
      pointGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(start), 3));
      pointGeometry.setAttribute('aSeed', new THREE.BufferAttribute(sampled.seeds, 1));
      pointGeometry.setAttribute('aTone', new THREE.BufferAttribute(sampled.tones, 1));
      fromAttribute = new THREE.BufferAttribute(new Float32Array(start), 3);
      toAttribute = new THREE.BufferAttribute(new Float32Array(start), 3);
      pointGeometry.setAttribute('aFrom', fromAttribute);
      pointGeometry.setAttribute('aTo', toAttribute);
      geometries.push(pointGeometry);

      pointMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMix: { value: 1 },
          uScroll: { value: 0 },
          uLogoPresence: { value: currentShape === 'logo' ? 1 : 0 },
          uPointer: { value: pointer },
          uPointerStrength: { value: 0 },
          uPixelRatio: { value: renderer.getPixelRatio() },
          uColor: { value: new THREE.Color(0x39b1e6) },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      materials.push(pointMaterial);
      const points = new THREE.Points(pointGeometry, pointMaterial);
      points.frustumCulled = false;
      field.add(points);

      // Filaments trace the logo's circuit lines; they belong to the logo
      // formation only and fade out as the field travels elsewhere.
      const filamentGeometry = new THREE.BufferGeometry();
      filamentGeometry.setAttribute('position', new THREE.BufferAttribute(buildFilaments(sampled.selected, isMobile), 3));
      filamentMaterial = new THREE.LineBasicMaterial({ color: 0x8bdcf8, transparent: true, opacity: 0.17, blending: THREE.AdditiveBlending });
      geometries.push(filamentGeometry);
      materials.push(filamentMaterial);
      const filaments = new THREE.LineSegments(filamentGeometry, filamentMaterial);
      filaments.frustumCulled = false;
      field.add(filaments);

      resize();
      onReadyChange(true);
      startRendering();
    };
    image.onerror = () => onReadyChange(false);

    /** Retarget the morph, snapshotting mid-flight positions so nothing pops. */
    const retarget = (next: MindShapeName) => {
      if (!shapes || !fromAttribute || !toAttribute) {
        currentShape = next;
        return;
      }
      const destination = shapes[next];
      if (!destination) return;

      const from = fromAttribute.array as Float32Array;
      const to = toAttribute.array as Float32Array;
      const eased = mix * mix * (3 - 2 * mix);
      for (let i = 0; i < from.length; i += 1) {
        from[i] = from[i] + (to[i] - from[i]) * eased;
        to[i] = destination[i];
      }
      fromAttribute.needsUpdate = true;
      toAttribute.needsUpdate = true;
      mix = 0;
      currentShape = next;
      lastActivityTime = performance.now();
    };

    controllerRef.current = {
      setShape: (next) => {
        if (next === currentShape) return;
        retarget(next);
        startRendering();
      },
      setPaused: (isPaused) => {
        pausedByChapter = isPaused;
        if (isPaused && frameId) {
          window.cancelAnimationFrame(frameId);
          frameId = 0;
        } else if (!isPaused) {
          lastActivityTime = performance.now();
          startRendering();
        }
      },
    };

    const minimumFrameTime = 1000 / (isMobile ? 30 : 45);
    const render = (time: number) => {
      frameId = 0;
      if (disposed || !visible || !pageVisible || pausedByChapter) return;
      // Idle stop: once every driver has settled, halt entirely — zero GPU
      // cost while the visitor reads. Any input resumes the loop.
      const settled =
        time - lastActivityTime > 3000 &&
        mix > 0.999 &&
        pointerStrength < 0.005 &&
        Math.abs(targetScrollPhase - scrollPhase) < 0.005;
      if (settled) return;
      if (time - lastFrameTime < minimumFrameTime) {
        frameId = window.requestAnimationFrame(render);
        return;
      }
      lastFrameTime = time;

      mix = Math.min(1, mix + 0.016);
      pointerStrength += (targetPointerStrength - pointerStrength) * 0.075;
      scrollPhase += (targetScrollPhase - scrollPhase) * 0.06;
      pointer.x += (targetPointer.x - pointer.x) * 0.08;
      pointer.y += (targetPointer.y - pointer.y) * 0.08;

      if (pointMaterial) {
        pointMaterial.uniforms.uTime.value = time * 0.001;
        pointMaterial.uniforms.uMix.value = mix;
        pointMaterial.uniforms.uScroll.value = scrollPhase;
        pointMaterial.uniforms.uPointerStrength.value = pointerStrength;
        const logoPresence = currentShape === 'logo' ? mix : 1 - mix;
        pointMaterial.uniforms.uLogoPresence.value = currentShape === 'logo' ? logoPresence : 0;
        if (filamentMaterial) {
          filamentMaterial.opacity = 0.17 * (currentShape === 'logo' ? mix : Math.max(0, 1 - mix));
        }
      }

      field.rotation.y += (targetPointer.x * 0.075 - field.rotation.y) * 0.035;
      field.rotation.x += (-targetPointer.y * 0.045 - field.rotation.x) * 0.035;

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };

    function startRendering() {
      if (!frameId && visible && pageVisible && !pausedByChapter && !disposed) {
        frameId = window.requestAnimationFrame(render);
      }
    }

    const updatePointer = (event: PointerEvent) => {
      targetPointer.set(
        (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2,
        -(event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2
      );
      targetPointerStrength = 1;
      lastActivityTime = performance.now();
      startRendering();
    };
    const releasePointer = () => {
      targetPointerStrength = 0;
      lastActivityTime = performance.now();
      startRendering();
    };
    const updateScroll = () => {
      const viewport = Math.max(window.innerHeight, 1);
      targetScrollPhase = ((window.scrollY % viewport) / viewport - 0.5) * 0.4;
      lastActivityTime = performance.now();
      startRendering();
    };
    // Arrow (not a hoisted declaration) so `mount`'s non-null narrowing holds.
    // Only ever invoked asynchronously: from onload, the observer, or below.
    const resize = () => {
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      if (pointMaterial) pointMaterial.uniforms.uPixelRatio.value = renderer.getPixelRatio();

      // Frustum-aware fit: formations span roughly 8 x 6 world units. Scale the
      // field so the whole shape stays inside the viewport with safe space at
      // every aspect ratio.
      const fovRadians = (camera.fov * Math.PI) / 180;
      const worldHeight = 2 * Math.tan(fovRadians / 2) * camera.position.z;
      const worldWidth = worldHeight * camera.aspect;
      const heightFit = (worldHeight * 0.82) / 6.0;
      const widthFit = (worldWidth * (isMobile ? 0.94 : 0.72)) / 8.0;
      field.scale.setScalar(Math.min(heightFit, widthFit, 1.15));

      lastActivityTime = performance.now();
      startRendering();
    };
    const handleVisibility = () => {
      pageVisible = !document.hidden;
      if (!pageVisible && frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      } else startRendering();
    };
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      onReadyChange(false);
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible && frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      } else startRendering();
    }, { threshold: 0.02 });
    const resizeObserver = new ResizeObserver(resize);
    visibilityObserver.observe(mount);
    resizeObserver.observe(mount);
    if (finePointer) {
      window.addEventListener('pointermove', updatePointer, { passive: true });
      window.addEventListener('pointerdown', updatePointer, { passive: true });
      window.addEventListener('pointerup', releasePointer, { passive: true });
      window.addEventListener('pointercancel', releasePointer, { passive: true });
    }
    window.addEventListener('scroll', updateScroll, { passive: true });
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    document.addEventListener('visibilitychange', handleVisibility);
    resize();

    return () => {
      disposed = true;
      controllerRef.current = null;
      onReadyChange(false);
      if (frameId) window.cancelAnimationFrame(frameId);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      if (finePointer) {
        window.removeEventListener('pointermove', updatePointer);
        window.removeEventListener('pointerdown', updatePointer);
        window.removeEventListener('pointerup', releasePointer);
        window.removeEventListener('pointercancel', releasePointer);
      }
      window.removeEventListener('scroll', updateScroll);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      document.removeEventListener('visibilitychange', handleVisibility);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onReadyChange, profile]);

  return <div ref={mountRef} className="absolute inset-0" style={{ touchAction: 'pan-y' }} />;
}
