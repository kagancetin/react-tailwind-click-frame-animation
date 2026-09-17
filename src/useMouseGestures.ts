import { useEffect, useRef, useState, useMemo } from "react";
import { calculateSwipe, type Point } from "./gestureMath";
import { resolveLocale, formatString, type LocaleData, type DeepPartial } from "./locales";

const CLICK_MOVE_THRESHOLD = 15; // px

export interface ClickGestureData {
  x: number;
  y: number;
  isTouch: boolean;
}

export interface DragShootGestureData {
  start: Point;
  end: Point;
  angleDeg: number;
  angleRad: number;
  distance: number;
  dx: number;
  dy: number;
  isTouch: boolean;
}

export interface ScrollGestureData {
  x: number;
  y: number;
  direction: "down" | "up";
  deltaY: number;
  isTouch: boolean;
}

export interface GestureBehaviorOptions {
  /** Prevent native browser default action (e.g. context menu or default click handling) */
  preventDefault?: boolean;
  /** Whether touch/mobile interactions trigger this specific gesture */
  enableMobile?: boolean;
}

export interface ScrollBehaviorOptions {
  /** Prevent native browser wheel scroll */
  preventDefault?: boolean;
  /** Whether touch/mobile interactions trigger this specific gesture */
  enableMobile?: boolean;
}

export interface UseMouseGesturesOptions {
  onLeftClick?: (data: ClickGestureData) => void;
  onRightClick?: (data: ClickGestureData) => void;
  onDragShoot?: (data: DragShootGestureData) => void;
  onScroll?: (data: ScrollGestureData) => void;
  scrollThrottleMs?: number;
  enableMobile?: boolean;
  longPressMs?: number;
  clickThreshold?: number;
  locale?: DeepPartial<LocaleData>;
  /** Master switch to prevent DOM text selection across all gestures (default: true) */
  preventTextSelection?: boolean;
  /** Prevent native HTML5 ghost element dragging and cursor change on images/links (default: true) */
  preventElementDrag?: boolean;
  // Per-gesture behavioral options:
  leftClickOptions?: GestureBehaviorOptions;
  rightClickOptions?: GestureBehaviorOptions;
  dragShootOptions?: GestureBehaviorOptions;
  scrollOptions?: ScrollBehaviorOptions;
}

/**
 * Hook listening for mouse and touch gestures with granular per-action controls.
 */
export function useMouseGestures({
  onLeftClick,
  onRightClick,
  onDragShoot,
  onScroll,
  scrollThrottleMs = 140,
  enableMobile = true,
  longPressMs = 500,
  clickThreshold = CLICK_MOVE_THRESHOLD,
  locale,
  preventTextSelection = true,
  preventElementDrag = true,
  leftClickOptions = { preventDefault: false },
  rightClickOptions = { preventDefault: true },
  dragShootOptions = { preventDefault: false },
  scrollOptions = { preventDefault: false },
}: UseMouseGesturesOptions = {}) {
  const t = useMemo(() => resolveLocale(locale), [locale]);
  const [lastGesture, setLastGesture] = useState<string>(t.gestures.none);

  const shouldPreventSelection = preventTextSelection;

  // Desktop mouse tracking state
  const isMouseDown = useRef(false);
  const startPos = useRef<Point>({ x: 0, y: 0 });
  const lastScrollTime = useRef(0);

  // Mobile touch tracking state
  const touchStartPos = useRef<Point>({ x: 0, y: 0 });
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressTriggered = useRef(false);
  const lastTouchTime = useRef(0); // Suppress synthetic ghost clicks triggered post-touch

  useEffect(() => {
    // -------------------------------------------------------------
    // 1. DESKTOP MOUSE EVENTS
    // -------------------------------------------------------------
    const handleMouseDown = (e: globalThis.MouseEvent) => {
      // Ignore synthetic mouse events fired immediately after touch actions
      if (Date.now() - lastTouchTime.current < 650) return;

      if (e.button === 0) {
        isMouseDown.current = true;
        startPos.current = { x: e.clientX, y: e.clientY };

        // Prevent accidental DOM text selection when click/drag initiates
        if (shouldPreventSelection) {
          document.body.style.userSelect = "none";
        }
      }
    };

    const handleMouseUp = (e: globalThis.MouseEvent) => {
      if (Date.now() - lastTouchTime.current < 650) return;
      if (e.button !== 0 || !isMouseDown.current) return;
      isMouseDown.current = false;

      // Restore normal text selection upon pointer release only if it was modified
      if (document.body.style.userSelect === "none") {
        document.body.style.userSelect = "";
      }
      if (shouldPreventSelection) {
        window.getSelection()?.removeAllRanges();
      }

      const endPos: Point = { x: e.clientX, y: e.clientY };
      const swipe = calculateSwipe(startPos.current, endPos, clickThreshold);

      // Case 1: Simple Left Click (Movement fell below swipe threshold)
      if (!swipe.isSwipe) {
        if (leftClickOptions.preventDefault) {
          e.preventDefault();
        }
        setLastGesture(`${t.gestures.leftClick} (X: ${endPos.x}, Y: ${endPos.y})`);
        onLeftClick?.({ x: endPos.x, y: endPos.y, isTouch: false });
        return;
      }

      // Case 2: Drag & Shoot (Pointer traveled past swipe threshold)
      if (dragShootOptions.preventDefault) {
        e.preventDefault();
      }

      const roundedAngle = Math.round(swipe.angleDeg);
      const roundedDist = Math.round(swipe.distance);
      setLastGesture(
        formatString(t.gestures.dragShoot, { angle: roundedAngle, distance: roundedDist })
      );

      onDragShoot?.({
        start: startPos.current,
        end: endPos,
        angleDeg: swipe.angleDeg,
        angleRad: swipe.angleRad,
        distance: swipe.distance,
        dx: swipe.dx,
        dy: swipe.dy,
        isTouch: false,
      });
    };

    // Right Click / Context Menu (Desktop and Mobile long-press popup)
    const handleContextMenu = (e: globalThis.MouseEvent) => {
      const isMobileTouch = Date.now() - lastTouchTime.current < 800;

      if (rightClickOptions.preventDefault || isLongPressTriggered.current || isMobileTouch) {
        e.preventDefault();
      }

      // If already triggered via mobile long-press timer, avoid redundant duplicate call
      if (isLongPressTriggered.current || isMobileTouch) {
        if (shouldPreventSelection) {
          window.getSelection()?.removeAllRanges();
        }
        return;
      }

      setLastGesture(`${t.gestures.rightClick} (X: ${e.clientX}, Y: ${e.clientY})`);
      onRightClick?.({ x: e.clientX, y: e.clientY, isTouch: false });
    };

    // Mouse Wheel / Scroll
    const handleWheel = (e: globalThis.WheelEvent) => {
      if (scrollOptions.preventDefault) {
        e.preventDefault();
      }

      const now = performance.now();
      if (now - lastScrollTime.current < scrollThrottleMs) return;
      lastScrollTime.current = now;

      const direction = e.deltaY > 0 ? "down" : "up";
      const label = direction === "down" ? t.gestures.scrollDown : t.gestures.scrollUp;
      setLastGesture(label);

      onScroll?.({
        x: e.clientX,
        y: e.clientY,
        direction,
        deltaY: e.deltaY,
        isTouch: false,
      });
    };

    // -------------------------------------------------------------
    // 2. MOBILE TOUCH EVENTS
    // -------------------------------------------------------------
    const handleTouchStart = (e: globalThis.TouchEvent) => {
      if (!enableMobile || e.touches.length === 0) return;

      lastTouchTime.current = Date.now();
      const touch = e.touches[0];
      touchStartPos.current = { x: touch.clientX, y: touch.clientY };
      isLongPressTriggered.current = false;

      // If text selection should be prevented on mobile tap/drag/long-press
      if (shouldPreventSelection) {
        document.body.style.userSelect = "none";
        (document.body.style as any).webkitUserSelect = "none";
        (document.body.style as any).webkitTouchCallout = "none";
      }

      // Start timer for simulated right-click via long-press (if rightClick on mobile is enabled)
      if (rightClickOptions.enableMobile !== false) {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
        longPressTimer.current = setTimeout(() => {
          isLongPressTriggered.current = true;

          // Clear any active native selection that mobile browser might have started (if requested)
          if (shouldPreventSelection) {
            window.getSelection()?.removeAllRanges();
          }

          setLastGesture(
            `${t.gestures.mobileLongPress} (X: ${Math.round(touch.clientX)}, Y: ${Math.round(touch.clientY)})`
          );

          // Optional haptic vibration feedback on supported mobile browsers
          if (typeof navigator !== "undefined" && "vibrate" in navigator) {
            navigator.vibrate(40);
          }

          onRightClick?.({
            x: touch.clientX,
            y: touch.clientY,
            isTouch: true,
          });
        }, longPressMs);
      }
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (!enableMobile || e.touches.length === 0) return;
      lastTouchTime.current = Date.now();

      const touch = e.touches[0];
      const dx = touch.clientX - touchStartPos.current.x;
      const dy = touch.clientY - touchStartPos.current.y;

      // Abort long press if finger moves significantly
      if (Math.hypot(dx, dy) > 12 && longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }

      // Detect touch swipe/scroll gesture (if scroll on mobile is enabled)
      if (scrollOptions.enableMobile !== false) {
        const now = performance.now();
        if (now - lastScrollTime.current > scrollThrottleMs && Math.abs(dy) > 10) {
          lastScrollTime.current = now;
          const direction = dy < 0 ? "down" : "up";
          onScroll?.({
            x: touch.clientX,
            y: touch.clientY,
            direction,
            deltaY: dy,
            isTouch: true,
          });
        }
      }
    };

    const handleTouchEnd = (e: globalThis.TouchEvent) => {
      if (!enableMobile) return;
      lastTouchTime.current = Date.now();
      if (longPressTimer.current) clearTimeout(longPressTimer.current);

      // Restore user-select on mobile release only if it was modified
      if (document.body.style.userSelect === "none") {
        document.body.style.userSelect = "";
        (document.body.style as any).webkitUserSelect = "";
        (document.body.style as any).webkitTouchCallout = "";
      }
      if (shouldPreventSelection) {
        window.getSelection()?.removeAllRanges();
      }

      // Skip tap/swipe if long-press was already fired
      if (isLongPressTriggered.current) {
        isLongPressTriggered.current = false;
        return;
      }

      const touch = e.changedTouches[0];
      if (!touch) return;

      const endPos: Point = { x: touch.clientX, y: touch.clientY };
      const swipe = calculateSwipe(touchStartPos.current, endPos, clickThreshold);

      // Case 1: Simple Tap (maps to Left Click)
      if (!swipe.isSwipe) {
        if (leftClickOptions.enableMobile !== false) {
          setLastGesture(`${t.gestures.mobileTap} (X: ${Math.round(endPos.x)}, Y: ${Math.round(endPos.y)})`);
          onLeftClick?.({ x: endPos.x, y: endPos.y, isTouch: true });
        }
        return;
      }

      // Case 2: Touch Swipe (maps to Drag & Shoot)
      if (dragShootOptions.enableMobile !== false) {
        const roundedAngle = Math.round(swipe.angleDeg);
        const roundedDist = Math.round(swipe.distance);
        setLastGesture(
          formatString(t.gestures.mobileSwipe, { angle: roundedAngle, distance: roundedDist })
        );

        onDragShoot?.({
          start: touchStartPos.current,
          end: endPos,
          angleDeg: swipe.angleDeg,
          angleRad: swipe.angleRad,
          distance: swipe.distance,
          dx: swipe.dx,
          dy: swipe.dy,
          isTouch: true,
        });
      }
    };

    const handleTouchCancel = () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      isLongPressTriggered.current = false;

      if (document.body.style.userSelect === "none") {
        document.body.style.userSelect = "";
        (document.body.style as any).webkitUserSelect = "";
        (document.body.style as any).webkitTouchCallout = "";
      }
      if (shouldPreventSelection) {
        window.getSelection()?.removeAllRanges();
      }
    };

    // Prevent native HTML5 ghost dragging on accidental images/links, while respecting intentionally draggable elements
    const handleDragStart = (e: globalThis.DragEvent) => {
      if (!preventElementDrag) return;

      const target = e.target as HTMLElement | null;
      // If developer explicitly marked element as draggable (e.g. Kanban card, custom DND), let it drag!
      if (
        target?.closest?.('[draggable="true"]') ||
        target?.closest?.("[data-draggable]")
      ) {
        return;
      }

      // Otherwise prevent default browser ghost dragging on plain <img>, <a>, and unconfigured elements
      e.preventDefault();
    };

    // Handle dragend: if user was dragging an intentionally draggable element, clean up without firing dragShoot
    const handleDragEnd = (e: globalThis.DragEvent) => {
      const target = e.target as HTMLElement | null;
      const isExplicitDraggable =
        Boolean(target?.closest?.('[draggable="true"]') || target?.closest?.("[data-draggable]"));

      if (isMouseDown.current) {
        isMouseDown.current = false;
        if (document.body.style.userSelect === "none") {
          document.body.style.userSelect = "";
        }
        // Skip projectile animation if this was an intentional native DND action
        if (isExplicitDraggable) {
          return;
        }
        handleMouseUp(e as unknown as globalThis.MouseEvent);
      }
    };

    // Window blur safety: reset mouse state if focus is lost mid-drag
    const handleBlur = () => {
      isMouseDown.current = false;
      if (document.body.style.userSelect === "none") {
        document.body.style.userSelect = "";
      }
    };

    // Attach passive: false only when wheel preventDefault is requested
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("wheel", handleWheel, { passive: !scrollOptions.preventDefault });
    window.addEventListener("dragstart", handleDragStart);
    window.addEventListener("dragend", handleDragEnd);
    window.addEventListener("blur", handleBlur);

    if (enableMobile) {
      window.addEventListener("touchstart", handleTouchStart, { passive: true });
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleTouchEnd, { passive: true });
      window.addEventListener("touchcancel", handleTouchCancel, { passive: true });
    }

    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("dragstart", handleDragStart);
      window.removeEventListener("dragend", handleDragEnd);
      window.removeEventListener("blur", handleBlur);

      if (enableMobile) {
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener("touchcancel", handleTouchCancel);
      }
    };
  }, [
    onLeftClick,
    onRightClick,
    onDragShoot,
    onScroll,
    scrollThrottleMs,
    enableMobile,
    preventTextSelection,
    preventElementDrag,
    longPressMs,
    clickThreshold,
    leftClickOptions,
    rightClickOptions,
    dragShootOptions,
    scrollOptions,
    t,
  ]);

  return { lastGesture };
}
