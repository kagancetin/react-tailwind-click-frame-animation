import type { ActiveAnimation } from "./useMultiFrameAnimation";

export interface AnimationRendererProps {
  animations?: ActiveAnimation[];
  className?: string;
}

/**
 * Fullscreen overlay layer rendering active frame animations with CSS 3D perspective transforms.
 */
export default function AnimationRenderer({
  animations = [],
  className,
}: AnimationRendererProps) {
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
        perspective: "1000px", // 3D depth perspective
        perspectiveOrigin: "center center",
      }}
    >
      {animations.map((anim) => {
        const currentSrc = anim.frames[anim.frame];
        if (!currentSrc) return null;

        // Compose 3D Euler angles into CSS transform
        const rx = anim.rotX || 0;
        const ry = anim.rotY || 0;
        const rz = anim.rotZ || 0;
        const transform3d = `translate(-50%, -50%) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;

        return (
          <img
            key={anim.id}
            src={currentSrc}
            alt=""
            style={{
              position: "absolute",
              left: `${anim.x}px`,
              top: `${anim.y}px`,
              width: `${anim.width}px`,
              height: `${anim.height}px`,
              transform: transform3d,
              transformStyle: "preserve-3d",
              opacity: anim.opacity ?? 1,
              userSelect: "none",
              pointerEvents: "none",
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </div>
  );
}
