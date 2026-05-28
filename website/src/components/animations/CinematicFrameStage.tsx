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
  scrub?: number;
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
    const radius = preloadRadius ?? (profile === 'mobilePremium' ? 8 : frames.length);
    const playhead = { frame: 0 };
    let displayWidth = 0;
    let displayHeight = 0;
    let lastRenderedFrame = -1;
    let pendingFrame: number | null = null;
    let rafId: number | null = null;
    let hasStartedLoading = false;
    let hasRequestedAllFrames = false;

    const resizeCanvas = () => {
      const dpr = clampDpr(profile);
      displayWidth = window.innerWidth;
      displayHeight = window.innerHeight;
      canvas.width = Math.ceil(displayWidth * dpr);
      canvas.height = Math.ceil(displayHeight * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
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

    const requestFrame = (frameIndex: number) => {
      const safeIndex = Math.max(0, Math.min(frames.length - 1, frameIndex));
      if (requested.has(safeIndex)) return;

      requested.add(safeIndex);
      const image = new Image();
      image.decoding = 'async';
      image.src = frames[safeIndex];
      image.onload = () => {
        if (safeIndex === 0 || safeIndex === Math.round(playhead.frame)) {
          scheduleRender(safeIndex);
        }
      };
      image.decode?.().catch(() => undefined);
      cache.set(safeIndex, image);
    };

    const requestWindow = (frameIndex: number) => {
      if (profile === 'desktop' && radius >= frames.length) {
        if (hasRequestedAllFrames) return;
        hasRequestedAllFrames = true;
        frames.forEach((_, index) => requestFrame(index));
        return;
      }

      const startIndex = Math.max(0, frameIndex - radius);
      const endIndex = Math.min(frames.length - 1, frameIndex + radius);

      requestFrame(0);
      requestFrame(frames.length - 1);
      for (let index = startIndex; index <= endIndex; index += 1) {
        requestFrame(index);
      }

      if (profile !== 'desktop') {
        for (const index of cache.keys()) {
          if (index !== 0 && index !== frames.length - 1 && Math.abs(index - frameIndex) > radius * 3) {
            const image = cache.get(index);
            if (image) image.src = '';
            cache.delete(index);
            requested.delete(index);
          }
        }
      }
    };

    const startLoading = () => {
      if (hasStartedLoading) return;
      hasStartedLoading = true;
      requestWindow(0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    requestFrame(0);

    if (profile === 'reducedMotion') {
      startLoading();
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        if (rafId !== null) cancelAnimationFrame(rafId);
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
      cache.forEach((image) => { image.src = ''; });
      cache.clear();
      requested.clear();
    };
  }, [canvasRef, containerRef, end, frames, lazyStart, onProgress, preloadRadius, profile, scrub, start]);

  return { isReady };
}
