'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { useDevicePerformanceProfile } from '@/hooks/useDevicePerformanceProfile';
import type { MindShapeName } from './mindShapes';

const CognitiveFieldScene = dynamic(() => import('./CognitiveFieldScene'), { ssr: false });

const VALID_SHAPES: MindShapeName[] = ['logo', 'healthcare', 'commerce', 'hrms', 'custom', 'lattice'];

/**
 * The persistent homepage mind: one fixed WebGL layer behind the whole
 * narrative. Any section can direct it by declaring `data-mind-shape="…"`, and
 * the field morphs into that formation as the section crosses the viewport
 * centre — so the story literally builds a different system per industry as
 * you scroll, then resolves back to the bull.
 *
 * Centre-line selection (rather than intersection ratios) stays deterministic
 * in both scroll directions and for sections taller than the viewport.
 *
 * Reduced-motion / save-data visitors get no canvas at all; the hero's
 * server-rendered static logo remains visible. `data-mind-ready` on <html>
 * fades that static logo out once the field takes over.
 */
export function NeuralMind() {
  const profile = useDevicePerformanceProfile();
  const [shape, setShape] = useState<MindShapeName>('logo');
  const [dimmed, setDimmed] = useState(false);

  const handleReadyChange = useCallback((ready: boolean) => {
    if (ready) {
      document.documentElement.setAttribute('data-mind-ready', '1');
    } else {
      document.documentElement.removeAttribute('data-mind-ready');
    }
  }, []);

  useEffect(() => () => document.documentElement.removeAttribute('data-mind-ready'), []);

  useEffect(() => {
    const zones = Array.from(document.querySelectorAll<HTMLElement>('[data-mind-shape]'));
    if (zones.length === 0) return;
    const dimZones = Array.from(document.querySelectorAll<HTMLElement>('[data-mind-dim]'));
    let frame = 0;

    const update = () => {
      frame = 0;
      const centerY = window.innerHeight / 2;

      // The last zone whose top has crossed the viewport centre wins.
      let active: MindShapeName = 'logo';
      for (const element of zones) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= centerY) {
          const value = element.getAttribute('data-mind-shape') as MindShapeName | null;
          if (value && VALID_SHAPES.includes(value)) active = value;
        }
      }
      setShape(active);

      setDimmed(
        dimZones.some((element) => {
          const rect = element.getBoundingClientRect();
          return rect.top <= centerY && rect.bottom >= centerY;
        }),
      );
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  if (profile === 'pending' || profile === 'reducedMotion') return null;

  return (
    <div
      className="mind-layer"
      aria-hidden="true"
      style={{ opacity: dimmed ? 0 : 1, transition: 'opacity 0.8s var(--ease-premium)' }}
    >
      <CognitiveFieldScene
        shape={shape}
        paused={dimmed}
        profile={profile}
        onReadyChange={handleReadyChange}
      />
    </div>
  );
}
