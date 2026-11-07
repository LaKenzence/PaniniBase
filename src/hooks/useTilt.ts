import { useRef, useState, useCallback } from 'react';

interface TiltState {
  rotateX: number;
  rotateY: number;
  glareX: number; // 0-100
  glareY: number; // 0-100
  active: boolean;
}

const REST: TiltState = { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, active: false };

/**
 * Effet d'inclinaison 3D façon carte holographique : suit la souris (desktop)
 * ou le doigt (mobile), avec une position de reflet qui se déplace en même
 * temps. À appliquer uniquement sur des éléments "vedette" (pas en grille
 * dense) pour ne pas multiplier les listeners inutilement.
 */
export function useTilt(maxTilt: number = 14) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<TiltState>(REST);

  const update = useCallback((clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    // Pas d'inclinaison si l'utilisateur a demandé moins d'animations à son système
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width;  // 0..1
    const py = (clientY - rect.top) / rect.height;  // 0..1
    const rotateY = (px - 0.5) * 2 * maxTilt;
    const rotateX = -(py - 0.5) * 2 * maxTilt;
    setTilt({ rotateX, rotateY, glareX: px * 100, glareY: py * 100, active: true });
  }, [maxTilt]);

  const onMouseMove = useCallback((e: React.MouseEvent) => update(e.clientX, e.clientY), [update]);
  const onMouseLeave = useCallback(() => setTilt(REST), []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    if (t) update(t.clientX, t.clientY);
  }, [update]);
  const onTouchEnd = useCallback(() => setTilt(REST), []);

  const reset = useCallback(() => setTilt(REST), []);

  return {
    ref,
    tilt,
    reset,
    handlers: { onMouseMove, onMouseLeave, onTouchMove, onTouchEnd, onTouchStart: onTouchMove },
  };
}
