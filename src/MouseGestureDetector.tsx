import { useMemo, useEffect } from "react";
import {
  DEFAULT_CONFIG,
  type MouseGesturesConfig,
  type PartialMouseGesturesConfig,
} from "./defaultConfig";
import { getFramesFromFolder } from "./frameLoader";
import {
  useMouseGestures,
  type ClickGestureData,
  type DragShootGestureData,
  type ScrollGestureData,
} from "./useMouseGestures";
import { useMultiFrameAnimation } from "./useMultiFrameAnimation";
import { resolveLocale, type LocaleData, type DeepPartial } from "./locales";
import AnimationRenderer from "./AnimationRenderer";
import GestureHUD from "./GestureHUD";

export interface MouseGestureDetectorProps {
  config?: PartialMouseGesturesConfig;
  locale?: DeepPartial<LocaleData>;
  onLeftClick?: (data: ClickGestureData) => void;
  onRightClick?: (data: ClickGestureData) => void;
  onDragShoot?: (data: DragShootGestureData) => void;
  onScroll?: (data: ScrollGestureData) => void;
  onVerticalDrag?: (data: DragShootGestureData) => void;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Desktop & Mobile Gesture Detector and Frame Animation Orchestrator.
 * Handles unified gesture capture, frame caching, and multi-instance rendering.
 */
export default function MouseGestureDetector({
  config: userConfig = {},
  locale,
  onLeftClick,
  onRightClick,
  onDragShoot,
  onScroll,
  onVerticalDrag,
  children,
  className,
}: MouseGestureDetectorProps) {
  // 1. Deep merge incoming user configuration with defaults
  const mergedConfig: MouseGesturesConfig = useMemo(() => {
    return {
      leftClick: { ...DEFAULT_CONFIG.leftClick, ...(userConfig.leftClick || {}) },
      rightClick: { ...DEFAULT_CONFIG.rightClick, ...(userConfig.rightClick || {}) },
      dragShoot: { ...DEFAULT_CONFIG.dragShoot, ...(userConfig.dragShoot || {}) },
      scroll: {
        ...DEFAULT_CONFIG.scroll,
        ...(userConfig.scroll || {}),
        axes: { ...DEFAULT_CONFIG.scroll.axes, ...(userConfig.scroll?.axes || {}) },
        initialRotation: {
          ...DEFAULT_CONFIG.scroll.initialRotation,
          ...(userConfig.scroll?.initialRotation || {}),
        },
      },
      general: {
        ...DEFAULT_CONFIG.general,
        ...(userConfig.general || {}),
        ...(locale ? { locale } : {}),
      },
    };
  }, [userConfig, locale]);

  const activeLocale = mergedConfig.general.locale;
  const t = useMemo(() => resolveLocale(activeLocale), [activeLocale]);

  // 2. Pre-resolve active animation frames for each gesture
  const frameMap = useMemo(() => {
    const map: Record<"leftClick" | "rightClick" | "dragShoot" | "scroll", string[]> = {
      leftClick: [],
      rightClick: [],
      dragShoot: [],
      scroll: [],
    };

    const gestures = ["leftClick", "rightClick", "dragShoot", "scroll"] as const;

    gestures.forEach((key) => {
      const gesture = mergedConfig[key];
      const isAnyActive = gesture?.enabled || gesture?.enabledMobile;
      if (!isAnyActive) {
        map[key] = [];
        return;
      }

      // Explicit frame array override takes highest priority
      if (gesture.frames && gesture.frames.length > 0) {
        map[key] = gesture.frames;
        return;
      }

      if (gesture?.folder) {
        map[key] = getFramesFromFolder({
          folder: gesture.folder,
          frameCount: gesture.frameCount,
          extension: gesture.extension,
          padZero: gesture.padZero,
          publicPath: mergedConfig.general.publicPath,
        });
      } else {
        map[key] = [];
      }
    });

    return map;
  }, [mergedConfig]);

  // 3. Preload images into browser cache to eliminate visual flicker on first interaction
  useEffect(() => {
    const allUrls = Object.values(frameMap).flat();
    allUrls.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [frameMap]);

  // 4. Central multi-instance animation engine
  const { activeAnimations, triggerAnimation, triggerSingletonAnimation } =
    useMultiFrameAnimation();

  // Helper check: determine whether gesture is enabled for the current platform (touch vs desktop)
  const isGestureActive = (
    gestureKey: "leftClick" | "rightClick" | "dragShoot" | "scroll",
    isTouch: boolean
  ) => {
    const gesture = mergedConfig[gestureKey];
    if (!gesture) return false;

    if (isTouch) {
      const isMobileAllowed = gesture.enableMobile ?? gesture.enabledMobile;
      return Boolean(mergedConfig.general.enableMobile && isMobileAllowed);
    }
    return Boolean(gesture.enabled);
  };

  // 5. Wire up mouse and touch listeners
  const { lastGesture } = useMouseGestures({
    enableMobile: mergedConfig.general.enableMobile,
    preventTextSelection: mergedConfig.general.preventTextSelection,
    preventElementDrag: mergedConfig.general.preventElementDrag,
    longPressMs: mergedConfig.rightClick.longPressMs || 500,
    scrollThrottleMs: 50,
    locale: activeLocale,
    leftClickOptions: {
      preventDefault: mergedConfig.leftClick.preventDefault,
      enableMobile: mergedConfig.leftClick.enableMobile ?? mergedConfig.leftClick.enabledMobile,
    },
    rightClickOptions: {
      preventDefault: mergedConfig.rightClick.preventDefault,
      enableMobile: mergedConfig.rightClick.enableMobile ?? mergedConfig.rightClick.enabledMobile,
    },
    dragShootOptions: {
      preventDefault: mergedConfig.dragShoot.preventDefault,
      enableMobile: mergedConfig.dragShoot.enableMobile ?? mergedConfig.dragShoot.enabledMobile,
    },
    scrollOptions: {
      preventDefault: mergedConfig.scroll.preventDefault,
      enableMobile: mergedConfig.scroll.enableMobile ?? mergedConfig.scroll.enabledMobile,
    },

    // LEFT CLICK / TAP -> Spawn static puff animation
    onLeftClick: (data) => {
      if (isGestureActive("leftClick", data.isTouch)) {
        triggerAnimation(data.x, data.y, {
          frames: frameMap.leftClick,
          width: mergedConfig.leftClick.width,
          height: mergedConfig.leftClick.height,
          frameDuration: mergedConfig.leftClick.frameDuration,
          speed: 0,
        });
      }
      onLeftClick?.(data);
    },

    // RIGHT CLICK / LONG PRESS -> Spawn explosion animation
    onRightClick: (data) => {
      if (isGestureActive("rightClick", data.isTouch)) {
        triggerAnimation(data.x, data.y, {
          frames: frameMap.rightClick,
          width: mergedConfig.rightClick.width,
          height: mergedConfig.rightClick.height,
          frameDuration: mergedConfig.rightClick.frameDuration,
          speed: 0,
        });
      }
      onRightClick?.(data);
    },

    // DRAG & SHOOT / TOUCH SWIPE -> Spawn directional projectile
    onDragShoot: (data) => {
      if (isGestureActive("dragShoot", data.isTouch)) {
        triggerAnimation(data.end.x, data.end.y, {
          frames: frameMap.dragShoot,
          width: mergedConfig.dragShoot.width,
          height: mergedConfig.dragShoot.height,
          frameDuration: mergedConfig.dragShoot.frameDuration,
          speed: mergedConfig.dragShoot.speed,
          angleRad: data.angleRad,
          angleDeg: data.angleDeg,
          maxDistance: mergedConfig.dragShoot.maxDistance,
          rotateToAngle: mergedConfig.dragShoot.rotateToAngle,
          rotationOffset: mergedConfig.dragShoot.rotationOffset || 0,
        });
      }
      onDragShoot?.(data);
      onVerticalDrag?.(data);
    },

    // MOUSE WHEEL / TOUCH SCROLL -> Update or spawn singleton spinning 3D vortex
    onScroll: (data) => {
      if (isGestureActive("scroll", data.isTouch)) {
        const isDown = data.direction === "down";
        const baseSpeed = mergedConfig.scroll.spinSpeed || 8;
        const initial = mergedConfig.scroll.initialRotation || { x: 0, y: 0, z: 0 };

        const spinSpeed = isDown ? baseSpeed : -baseSpeed;
        const initialRotation = {
          x: initial.x || 0,
          y: initial.y || 0,
          z: isDown ? initial.z || 0 : (initial.z || 0) + 180,
        };

        triggerSingletonAnimation("scroll-effect", data.x, data.y, {
          frames: frameMap.scroll,
          width: mergedConfig.scroll.width,
          height: mergedConfig.scroll.height,
          frameDuration: mergedConfig.scroll.frameDuration,
          initialRotation,
          spinAxes: mergedConfig.scroll.axes,
          spinSpeed,
        });
      }
      onScroll?.(data);
    },
  });

  return (
    <>
      {children && <div className={className}>{children}</div>}
      <AnimationRenderer animations={activeAnimations} />
      {mergedConfig.general.showHUD && (
        <GestureHUD text={lastGesture} label={t.hud.lastDetected} />
      )}
    </>
  );
}
