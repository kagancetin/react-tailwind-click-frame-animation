export interface FrameAnimationItem {
  id: string | number;
  x: number;
  y: number;
  frame: number;
}

export interface ClickFrameEffectProps {
  animations?: FrameAnimationItem[];
  frames?: string[];
  size?: number;
  className?: string;
}

/**
 * 2D presentation layer rendering active frame animation instances.
 */
export default function ClickFrameEffect({
  animations = [],
  frames = [],
  size = 60,
  className,
}: ClickFrameEffectProps) {
  if (!animations || animations.length === 0) return null;

  return (
    <div
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 99999,
        overflow: "hidden",
      }}
    >
      {animations.map((anim) => {
        const src = frames[anim.frame];
        if (!src) return null;

        return (
          <img
            key={anim.id}
            src={src}
            alt=""
            style={{
              position: "absolute",
              left: `${anim.x}px`,
              top: `${anim.y}px`,
              width: `${size}px`,
              height: `${size}px`,
              transform: "translate(-50%, -50%)",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        );
      })}
    </div>
  );
}

// Aliases for backwards compatibility
export type SmokeAnimationItem = FrameAnimationItem;
export type ClickSmokeEffectProps = ClickFrameEffectProps;
export { ClickFrameEffect as ClickSmokeEffect };
