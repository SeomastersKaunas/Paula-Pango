import { useEffect, useRef, useState } from 'react';

interface GyroTransform {
  x: number;
  y: number;
}

export type GyroPermission = 'unknown' | 'granted' | 'denied';

const LS_KEY = 'pp_gyro_permission';

/** True if running on iOS 13+ (where requestPermission is required) */
export function isIOSGyro(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    typeof (DeviceOrientationEvent as any).requestPermission === 'function'
  );
}

/**
 * Call this inside a user-gesture handler (onClick).
 * Stores result in localStorage so we never ask again.
 */
export async function requestIOSGyroPermission(): Promise<GyroPermission> {
  try {
    const result = await (DeviceOrientationEvent as any).requestPermission();
    const permission: GyroPermission = result === 'granted' ? 'granted' : 'denied';
    localStorage.setItem(LS_KEY, permission);
    return permission;
  } catch {
    return 'denied';
  }
}

/** Read cached permission from localStorage */
export function getCachedGyroPermission(): GyroPermission {
  if (typeof window === 'undefined') return 'unknown';
  const v = localStorage.getItem(LS_KEY);
  if (v === 'granted' || v === 'denied') return v;
  return 'unknown';
}

/**
 * Smooth gyroscope-based tilt effect for mobile.
 * On iOS: only activates if permission is 'granted'.
 * On Android: activates automatically.
 * Returns { x, y } offsets in px + permission state.
 */
export function useGyroscope(maxShift = 12): GyroTransform & { permission: GyroPermission } {
  const [transform, setTransform] = useState<GyroTransform>({ x: 0, y: 0 });
  const [permission, setPermission] = useState<GyroPermission>(() => {
    if (typeof window === 'undefined') return 'unknown';
    if (!isIOSGyro()) return 'granted'; // Android — always allowed
    return getCachedGyroPermission();
  });

  const smoothed = useRef<GyroTransform>({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const latest = useRef<GyroTransform>({ x: 0, y: 0 });
  const active = permission === 'granted';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.DeviceOrientationEvent) return;
    if (!active) return;

    function handleOrientation(e: DeviceOrientationEvent) {
      const beta = e.beta ?? 0;
      const gamma = e.gamma ?? 0;
      const normX = Math.max(-1, Math.min(1, gamma / 45));
      const normY = Math.max(-1, Math.min(1, (beta - 45) / 45));
      latest.current = { x: normX * maxShift, y: normY * maxShift };
    }

    window.addEventListener('deviceorientation', handleOrientation, true);

    function tick() {
      const alpha = 0.08;
      smoothed.current = {
        x: smoothed.current.x + (latest.current.x - smoothed.current.x) * alpha,
        y: smoothed.current.y + (latest.current.y - smoothed.current.y) * alpha,
      };
      setTransform({ x: smoothed.current.x, y: smoothed.current.y });
      rafId.current = requestAnimationFrame(tick);
    }

    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [active, maxShift]);

  return { ...transform, permission };
}
