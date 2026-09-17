import { useState, useEffect, useRef, useCallback } from "react";
import type { Axes3D, Rotation3D } from "./defaultConfig";

export interface ActiveAnimation {
  id: number;
  tag?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  spinAxes?: Axes3D;
  spinSpeed?: number;
  speed: number;
  maxDistance: number;
  traveledDistance: number;
  opacity: number;
  frame: number;
  frames: string[];
  frameDuration: number;
  lastUpdate: number;
  lastKeepAlive?: number;
  loopFrames: boolean;
  isSingleton: boolean;
  isStopping?: boolean;
}

export interface TriggerAnimationOptions {
  frames?: string[];
  width?: number;
  height?: number;
  size?: number;
  frameDuration?: number;
  speed?: number;
  angleRad?: number;
  angleDeg?: number;
  rotationOffset?: number;
  initialRotation?: Rotation3D;
  spinAxes?: Axes3D;
  spinSpeed?: number;
  maxDistance?: number;
  rotateToAngle?: boolean;
}

export interface TriggerSingletonOptions {
  frames?: string[];
  width?: number;
  height?: number;
  frameDuration?: number;
  initialRotation?: Rotation3D;
  spinAxes?: Axes3D;
  spinSpeed?: number;
}

/**
 * Central animation loop orchestrator managing discrete gesture instances
 * (clicks, drag shots) and singleton loop animations (scroll spin vortex).
 */
export function useMultiFrameAnimation() {
  const [activeAnimations, setActiveAnimations] = useState<ActiveAnimation[]>([]);
  const animIdCounter = useRef(0);

  // 1. Spawns a discrete animation instance (Left click, Right click, Drag & Shoot)
  const triggerAnimation = useCallback(
    (x: number, y: number, options: TriggerAnimationOptions = {}) => {
      const {
        frames = [],
        width = 60,
        height = 60,
        size,
        frameDuration = 45,
        speed = 0,
        angleRad = 0,
        angleDeg = 0,
        rotationOffset = 0,
        initialRotation = { x: 0, y: 0, z: 0 },
        spinAxes = { x: false, y: false, z: false },
        spinSpeed = 0,
        maxDistance = 400,
        rotateToAngle = false,
      } = options;

      if (!frames || frames.length === 0) return;

      const finalWidth = width || size || 60;
      const finalHeight = height || size || 60;
      const id = animIdCounter.current++;
      const vx = speed > 0 ? Math.cos(angleRad) * speed : 0;
      const vy = speed > 0 ? Math.sin(angleRad) * speed : 0;

      let startRotZ = (initialRotation?.z || 0) + rotationOffset;
      if (rotateToAngle) {
        startRotZ += angleDeg;
      }

      setActiveAnimations((prev) => [
        ...prev,
        {
          id,
          x,
          y,
          vx,
          vy,
          width: finalWidth,
          height: finalHeight,
          rotX: initialRotation?.x || 0,
          rotY: initialRotation?.y || 0,
          rotZ: startRotZ,
          spinAxes,
          spinSpeed,
          speed,
          maxDistance,
          traveledDistance: 0,
          opacity: 1,
          frame: 0,
          frames,
          frameDuration,
          lastUpdate: performance.now(),
          loopFrames: speed > 0,
          isSingleton: false,
        },
      ]);
    },
    []
  );

  // 2. Singleton loop animation (reuses a single tagged instance for continuous events like scroll)
  const triggerSingletonAnimation = useCallback(
    (tag: string, x: number, y: number, options: TriggerSingletonOptions = {}) => {
      const {
        frames = [],
        width = 80,
        height = 80,
        frameDuration = 40,
        initialRotation = { x: 0, y: 0, z: 0 },
        spinAxes = { x: false, y: true, z: true },
        spinSpeed = 8,
      } = options;

      if (!frames || frames.length === 0) return;

      const now = performance.now();

      setActiveAnimations((prev) => {
        const existingIndex = prev.findIndex((a) => a.tag === tag);

        if (existingIndex !== -1) {
          // Already exists: Update pointer origin, spin velocity, and extend keep-alive lifetime
          const existing = prev[existingIndex];
          const updated: ActiveAnimation = {
            ...existing,
            x,
            y,
            spinSpeed,
            spinAxes,
            opacity: 1,
            lastKeepAlive: now,
            isStopping: false,
          };
          const newArr = [...prev];
          newArr[existingIndex] = updated;
          return newArr;
        } else {
          // First occurrence: Instantiate singleton instance
          const id = animIdCounter.current++;
          return [
            ...prev,
            {
              id,
              tag,
              x,
              y,
              vx: 0,
              vy: 0,
              width,
              height,
              rotX: initialRotation?.x || 0,
              rotY: initialRotation?.y || 0,
              rotZ: initialRotation?.z || 0,
              spinAxes,
              spinSpeed,
              speed: 0,
              opacity: 1,
              frame: 0,
              frames,
              frameDuration,
              lastUpdate: now,
              lastKeepAlive: now,
              isSingleton: true,
              isStopping: false,
              traveledDistance: 0,
              maxDistance: 0,
              loopFrames: true,
            },
          ];
        }
      });
    },
    []
  );

  // High-performance requestAnimationFrame loop computing positions, 3D rotations, and fading
  useEffect(() => {
    if (activeAnimations.length === 0) return;

    let animFrameId: number;

    const updateLoop = (now: number) => {
      setActiveAnimations((prev) =>
        prev
          .map((anim) => {
            let {
              x,
              y,
              vx,
              vy,
              rotX,
              rotY,
              rotZ,
              spinAxes,
              spinSpeed,
              frame,
              frames,
              traveledDistance,
              maxDistance,
              speed,
              lastUpdate,
              frameDuration,
              opacity,
              loopFrames,
              isSingleton,
              lastKeepAlive,
              isStopping,
            } = anim;

            // --- SINGLETON (SCROLL) BEHAVIOR ---
            if (isSingleton) {
              // Increment continuous 3D Euler rotations
              if (spinSpeed !== 0 && spinAxes) {
                if (spinAxes.x) rotX += spinSpeed!;
                if (spinAxes.y) rotY += spinSpeed!;
                if (spinAxes.z) rotZ += spinSpeed!;
              }

              // After 250ms of silence, treat scroll as stopped and fade out smoothly
              if (lastKeepAlive && now - lastKeepAlive > 250) {
                isStopping = true;
                opacity = Math.max(0, opacity - 0.08);
              } else {
                // Keep cycling frames uninterrupted while scroll continues
                if (now - lastUpdate >= frameDuration) {
                  frame = (frame + 1) % frames.length;
                  lastUpdate = now;
                }
              }

              return {
                ...anim,
                x,
                y,
                rotX,
                rotY,
                rotZ,
                frame,
                opacity,
                isStopping,
                lastUpdate,
              };
            }

            // --- DISCRETE ANIMATIONS (Left click, Right click, Drag & Shoot) ---
            if (speed > 0) {
              x += vx;
              y += vy;
              traveledDistance += speed;

              // Smoothly fade out during the final 35% of flight distance
              const remaining = maxDistance - traveledDistance;
              const fadeZone = maxDistance * 0.35;
              if (remaining < fadeZone) {
                opacity = Math.max(0, remaining / fadeZone);
              }
            }

            if (spinSpeed !== 0 && spinAxes) {
              if (spinAxes.x) rotX += spinSpeed!;
              if (spinAxes.y) rotY += spinSpeed!;
              if (spinAxes.z) rotZ += spinSpeed!;
            }

            let nextFrame = frame;
            let updatedLastUpdate = lastUpdate;
            if (now - lastUpdate >= frameDuration) {
              if (loopFrames && speed > 0) {
                nextFrame = (frame + 1) % frames.length;
              } else {
                nextFrame = frame + 1;
              }
              updatedLastUpdate = now;
            }

            return {
              ...anim,
              x,
              y,
              rotX,
              rotY,
              rotZ,
              frame: nextFrame,
              traveledDistance,
              opacity,
              lastUpdate: updatedLastUpdate,
            };
          })
          .filter((anim) => {
            // Cull singleton once fully faded
            if (anim.isSingleton) {
              return anim.opacity > 0.05;
            }
            // Cull projectile once range exceeded or faded
            if (anim.speed > 0) {
              return anim.traveledDistance < anim.maxDistance && anim.opacity > 0.05;
            }
            // Cull static animation once final frame played
            return anim.frame < anim.frames.length;
          })
      );

      animFrameId = requestAnimationFrame(updateLoop);
    };

    animFrameId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animFrameId);
  }, [activeAnimations.length]);

  return { activeAnimations, triggerAnimation, triggerSingletonAnimation };
}
