export interface GestureHUDProps {
  text?: string;
  label?: string;
  className?: string;
}

/**
 * HUD panel showing the last detected gesture in the top-right corner.
 */
export default function GestureHUD({
  text,
  label = "Last Detected Gesture:",
  className,
}: GestureHUDProps) {
  if (!text) return null;

  return (
    <div
      className={
        className ||
        "fixed top-5 right-5 bg-slate-900/90 text-sky-400 py-2.5 px-4 rounded-lg font-mono text-xs sm:text-sm shadow-xl border border-sky-600/60 z-[999999] pointer-events-none select-none backdrop-blur-sm"
      }
    >
      <div className="text-slate-400 text-[11px] mb-1 font-sans">
        {label}
      </div>
      <strong className="font-semibold text-sky-300">{text}</strong>
    </div>
  );
}
