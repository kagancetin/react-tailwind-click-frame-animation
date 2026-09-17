import "./index.css";

// Components
export { default as MouseGestureDetector } from "./MouseGestureDetector";
export type { MouseGestureDetectorProps } from "./MouseGestureDetector";

export { default as ClickFrameEffect } from "./ClickFrameEffect";
export type { ClickFrameEffectProps, FrameAnimationItem } from "./ClickFrameEffect";

// Backwards compatibility alias
export { ClickSmokeEffect } from "./ClickFrameEffect";
export type { ClickSmokeEffectProps, SmokeAnimationItem } from "./ClickFrameEffect";

export { default as AnimationRenderer } from "./AnimationRenderer";
export type { AnimationRendererProps } from "./AnimationRenderer";

export { default as GestureHUD } from "./GestureHUD";
export type { GestureHUDProps } from "./GestureHUD";

// Hooks
export * from "./useMouseGestures";
export * from "./useMultiFrameAnimation";
export * from "./useFrameAnimation";

// Helpers, Config & Locales
export * from "./defaultConfig";
export * from "./frameLoader";
export * from "./gestureMath";
export * from "./locales";
