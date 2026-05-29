'use client';

import { RefObject, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { DevicePerformanceProfile } from '@/hooks/useDevicePerformanceProfile';

gsap.registerPlugin(ScrollTrigger);

type FrameStageProgress = {
  frameIndex: number;
  frameProgress: number;
  scrollProgress: number;
};

interface UseCinematicFrameStageOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLElement | HTMLDivElement | null>;
  frames: string[];
  profile: DevicePerformanceProfile;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  lazyStart?: string | false;
  preloadRadius?: number;
  onProgress?: (progress: FrameStageProgress) => void;
}

const clampDpr = (profile: DevicePerformanceProfile) => {
  if (profile === 'reducedMotion') return 1;
  if (profile === 'mobilePremium') return Math.min(window.devicePixelRatio || 1, 1.35);
  return Math.min(window.devicePixelRatio || 1, 2);
};

export function useCinematicFrameStage({
  canvasRef,
  containerRef,
  frames,
  profile,
  start = 'top top',
  end = 'bottom bottom',
  scrub = 1,
  lazyStart = false,
  preloadRadius,
  onProgress,
}: UseCinematicFrameStageOptions) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || frames.length === 0) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const cache = new Map<number, HTMLImageElement>();
    const requested = new Set<number>();
    const playhead = { frame: 0 };
    let displayWidth = 0;
    let displayHeight = 0;
    let lastRenderedFrame = -1;
    let pendingFrame: number | null = null;
    let rafId: number | null = null;
    let hasStartedLoading = false;
    let backgroundIndex = 0;
    let backgroundTimeoutId: ReturnType<typeof setTimeout> | null = null;

    let lastWidth = 0;
    let lastHeight = 0;

    const resizeCanvas = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      const widthChanged = currentWidth !== lastWidth;
      const heightChanged = Math.abs(currentHeight - lastHeight) > 120; // Ignore minor Safari url bar height changes

      if (!widthChanged && !heightChanged) return;

      lastWidth = currentWidth;
      lastHeight = currentHeight;

      const dpr = clampDpr(profile);
      displayWidth = currentWidth;
      displayHeight = currentHeight;
      canvas.width = Math.ceil(displayWidth * dpr);
      canvas.height = Math.ceil(displayHeight * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Force redraw current frame since resizing the canvas clears the drawing buffer
      lastRenderedFrame = -1;
      renderFrame(Math.round(playhead.frame));
    };

    const drawImage = (image: HTMLImageElement) => {
      const hRatio = displayWidth / image.width;
      const vRatio = displayHeight / image.height;
      const ratio = Math.max(hRatio, vRatio);
      const x = (displayWidth - image.width * ratio) / 2;
      const y = (displayHeight - image.height * ratio) / 2;

      context.clearRect(0, 0, displayWidth, displayHeight);
      context.drawImage(image, 0, 0, image.width, image.height, x, y, image.width * ratio, image.height * ratio);
    };

    const renderFrame = (frameIndex: number) => {
      const safeIndex = Math.max(0, Math.min(frames.length - 1, frameIndex));
      const image = cache.get(safeIndex);

      if (!image || !image.complete || image.naturalHeight === 0) return;
      if (lastRenderedFrame === safeIndex) return;

      lastRenderedFrame = safeIndex;
      drawImage(image);
      setIsReady(true);
    };

    const scheduleRender = (frameIndex: number) => {
      pendingFrame = frameIndex;
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (pendingFrame !== null) renderFrame(pendingFrame);
      });
    };

    const requestPriorityFrame = (frameIndex: number) => {
      const safeIndex = Math.max(0, Math.min(frames.length - 1, frameIndex));
      if (requested.has(safeIndex)) return;

      requested.add(safeIndex);
      const image = new Image();
      image.decoding = 'async';
      image.src = frames[safeIndex];
      image.onload = () => {
        cache.set(safeIndex, image);
        if (safeIndex === Math.round(playhead.frame)) {
          scheduleRender(safeIndex);
        }
      };
      image.decode?.().catch(() => undefined);
    };

    const loadBackground = () => {
      while (backgroundIndex < frames.length && requested.has(backgroundIndex)) {
        backgroundIndex++;
      }
      if (backgroundIndex >= frames.length) return;

      const indexToLoad = backgroundIndex;
      requested.add(indexToLoad);

      const image = new Image();
      image.decoding = 'async';
      image.src = frames[indexToLoad];
      image.onload = () => {
        cache.set(indexToLoad, image);
        if (indexToLoad === Math.round(playhead.frame)) {
          scheduleRender(indexToLoad);
        }
        backgroundTimeoutId = setTimeout(loadBackground, 20);
      };
      image.onerror = () => {
        backgroundTimeoutId = setTimeout(loadBackground, 20);
      };
      image.decode?.().catch(() => undefined);
    };

    const requestWindow = (frameIndex: number) => {
      const activeRadius = preloadRadius ?? (profile === 'mobilePremium' ? 8 : 16);
      const startIndex = Math.max(0, frameIndex - activeRadius);
      const endIndex = Math.min(frames.length - 1, frameIndex + activeRadius);

      // Request active window frames with high priority
      for (let index = startIndex; index <= endIndex; index += 1) {
        if (!requested.has(index)) {
          requestPriorityFrame(index);
        }
      }

      // Ensure first and last frames are requested
      if (!requested.has(0)) requestPriorityFrame(0);
      if (!requested.has(frames.length - 1)) requestPriorityFrame(frames.length - 1);

      if (profile !== 'desktop') {
        const keepRadius = activeRadius * 4;
        for (const index of cache.keys()) {
          if (index !== 0 && index !== frames.length - 1 && Math.abs(index - frameIndex) > keepRadius) {
            const image = cache.get(index);
            if (image && image.complete) {
              cache.delete(index);
              requested.delete(index);
              if (index < backgroundIndex) {
                backgroundIndex = index;
              }
            }
          }
        }
      }
    };

    const startLoading = () => {
      if (hasStartedLoading) return;
      hasStartedLoading = true;
      requestPriorityFrame(0);
      backgroundTimeoutId = setTimeout(loadBackground, 100);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    requestPriorityFrame(0);

    if (profile === 'reducedMotion') {
      startLoading();
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        if (rafId !== null) cancelAnimationFrame(rafId);
        if (backgroundTimeoutId !== null) clearTimeout(backgroundTimeoutId);
        cache.forEach((image) => { image.src = ''; });
      };
    }

    const ctx = gsap.context(() => {
      if (lazyStart) {
        ScrollTrigger.create({
          trigger: container,
          start: lazyStart,
          onEnter: startLoading,
          once: true,
        });
      } else {
        startLoading();
      }

      gsap.to(playhead, {
        frame: frames.length - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start,
          end,
          scrub,
        },
        onUpdate: () => {
          const frameIndex = Math.round(playhead.frame);
          requestWindow(frameIndex);
          scheduleRender(frameIndex);
          onProgress?.({
            frameIndex,
            frameProgress: frames.length <= 1 ? 0 : frameIndex / (frames.length - 1),
            scrollProgress: frames.length <= 1 ? 0 : frameIndex / (frames.length - 1),
          });
        },
      });
    }, container);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', resizeCanvas);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (backgroundTimeoutId !== null) clearTimeout(backgroundTimeoutId);
      cache.forEach((image) => { image.src = ''; });
      cache.clear();
      requested.clear();
    };
  }, [canvasRef, containerRef, end, frames, lazyStart, onProgress, preloadRadius, profile, scrub, start]);

  return { isReady };
}
