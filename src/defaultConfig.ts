import type { LocaleData, DeepPartial } from "./locales";

// 3D rotation coordinates in degrees
export interface Rotation3D {
  x: number;
  y: number;
  z: number;
}

// Flags indicating which 3D axes should continuously spin during animation
export interface Axes3D {
  x?: boolean;
  y?: boolean;
  z?: boolean;
}

// Base configuration shared across all gestures
export interface BaseGestureConfig {
  /** Whether the gesture is enabled on desktop */
  enabled: boolean;
  /** Whether the gesture is enabled on touch/mobile devices */
  enabledMobile: boolean;
  /** Alias for enabledMobile for consistent naming with general.enableMobile */
  enableMobile?: boolean;
  /**
   * Folder name (e.g. "Smoke") to use built-in base64 frames,
   * or a custom path (e.g. "/images/click/Smoke") in the consumer's public directory.
   */
  folder: string;
  /** Total number of sequential frames to play */
  frameCount: number;
  /** Render width in pixels */
  width: number;
  /** Render height in pixels */
  height: number;
  /** Duration each frame stays visible before switching to next (in milliseconds) */
  frameDuration: number;
  /** File extension when loading numbered files from public folder (default: "png") */
  extension?: string;
  /** Whether frame file names use zero-padding like 01.png vs 1.png */
  padZero?: boolean;
  /** Direct frame URL list overriding folder loading */
  frames?: string[];
  /** Prevent native browser default behavior (e.g. contextmenu popup, wheel scroll) */
  preventDefault?: boolean;
}

export interface LeftClickConfig extends BaseGestureConfig { }

export interface RightClickConfig extends BaseGestureConfig {
  /** Duration in milliseconds required to trigger long-press on mobile devices */
  longPressMs: number;
}

export interface DragShootConfig extends BaseGestureConfig {
  /** Projectile travel speed per frame in pixels */
  speed: number;
  /** Maximum distance the projectile travels before fading out */
  maxDistance: number;
  /** Rotate visual towards the swipe trajectory angle */
  rotateToAngle: boolean;
  /** Fixed rotation offset in degrees added to the trajectory angle */
  rotationOffset: number;
}

export interface ScrollConfig extends BaseGestureConfig {
  /** Active rotation axes during continuous scroll animation */
  axes: Axes3D;
  /** Initial 3D rotation angles when spawned */
  initialRotation: Rotation3D;
  /** Continuous rotation speed multiplier per frame */
  spinSpeed: number;
  /** Throttle interval in milliseconds to prevent over-triggering on high-rate wheel events */
  throttleMs: number;
}

export interface GeneralConfig {
  /** Global toggle to enable touch listeners on mobile devices */
  enableMobile: boolean;
  /** Show top-right HUD widget displaying the last detected gesture */
  showHUD: boolean;
  /** Minimum pixel movement threshold to distinguish a drag/swipe from a click */
  clickThreshold: number;
  /**
   * Master switch to prevent DOM text selection across all gestures.
   * - If true (default): Text selection is disabled during all gestures.
   * - If false: Text selection is allowed across all gestures.
   */
  preventTextSelection?: boolean;
  /**
   * Prevent native HTML5 drag-and-drop ghost image and cursor change on images/links
   * so drag gestures work smoothly across elements. (default: true)
   */
  preventElementDrag?: boolean;
  /** Optional custom locale translations */
  locale?: DeepPartial<LocaleData>;
  /** Optional base path prefix for public assets (e.g. for GitHub Pages or sub-path routing) */
  publicPath?: string;
}

export interface MouseGesturesConfig {
  leftClick: LeftClickConfig;
  rightClick: RightClickConfig;
  dragShoot: DragShootConfig;
  scroll: ScrollConfig;
  general: GeneralConfig;
}

export type PartialMouseGesturesConfig = {
  leftClick?: Partial<LeftClickConfig>;
  rightClick?: Partial<RightClickConfig>;
  dragShoot?: Partial<DragShootConfig>;
  scroll?: Partial<Omit<ScrollConfig, "axes" | "initialRotation">> & {
    axes?: Partial<Axes3D>;
    initialRotation?: Partial<Rotation3D>;
  };
  general?: Partial<GeneralConfig>;
};

export const DEFAULT_CONFIG: MouseGesturesConfig = {
  // 1. Left Click / Tap (Default: Quick smoke puff)
  leftClick: {
    enabled: true,
    enabledMobile: true,
    folder: "Smoke",
    frameCount: 10,
    width: 75,
    height: 75,
    frameDuration: 45,
    extension: "png",
    padZero: true,
    preventDefault: true
  },

  // 2. Right Click / Long Press (Default: Explosion effect)
  rightClick: {
    enabled: true,
    enabledMobile: true,
    longPressMs: 500,
    folder: "SmokeExplosion",
    frameCount: 16,
    width: 90,
    height: 90,
    frameDuration: 35,
    extension: "png",
    padZero: true,
    preventDefault: true
  },

  // 3. Drag & Shoot / Swipe (Default: Directional projectile spell)
  dragShoot: {
    enabled: true,
    enabledMobile: true,
    folder: "SmokeSpell",
    frameCount: 10,
    width: 80,
    height: 50,
    frameDuration: 10,
    speed: 8,
    maxDistance: 450,
    rotateToAngle: true,
    rotationOffset: 180,
    extension: "png",
    padZero: true,
    preventDefault: true
  },

  // 4. Scroll / Wheel (Default: Continuous spinning 3D vortex)
  scroll: {
    enabled: true,
    enabledMobile: false,
    folder: "PoisonousSmoke",
    frameCount: 12,
    width: 60,
    height: 70,
    frameDuration: 40,
    axes: {
      x: false,
      y: false,
      z: true
    },
    initialRotation: { x: 30, y: 0, z: 0 },
    spinSpeed: 8,
    throttleMs: 140,
    extension: "png",
    padZero: true,
    preventDefault: false
  },

  // General runtime configuration
  general: {
    enableMobile: true,
    showHUD: true,
    clickThreshold: 15,
    preventTextSelection: false,
    preventElementDrag: true,
    publicPath: "",
  }
};
