import { useState, useEffect, useRef, useCallback } from "react";

export interface SimpleFrameAnimationInstance {
  id: number;
  x: number;
  y: number;
  frame: number;
}

/**
 * Lightweight hook managing simple sprite / sequential frame animation instances.
 * @param frames - Array of image URL sources
 * @param frameDuration - Time each frame stays active in milliseconds
 */
export function useFrameAnimation(frames: string[], frameDuration: number = 45) {
  const [animations, setAnimations] = useState<SimpleFrameAnimationInstance[]>([]);
  const idCounter = useRef(0);

  // Preload frames to avoid rendering flashes
  useEffect(() => {
    frames.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [frames]);

  // Spawns a new animation at the target coordinate
  const trigger = useCallback((x: number, y: number) => {
    const id = idCounter.current++;
    setAnimations((prev) => [...prev, { id, x, y, frame: 0 }]);
  }, []);

  // Frame tick interval advancing frames and culling finished instances
  useEffect(() => {
    if (animations.length === 0) return;

    const timer = setInterval(() => {
      setAnimations((prev) =>
        prev
          .map((anim) => ({ ...anim, frame: anim.frame + 1 }))
          .filter((anim) => anim.frame < frames.length)
      );
    }, frameDuration);

    return () => clearInterval(timer);
  }, [animations.length, frames.length, frameDuration]);

  return { animations, trigger };
}
