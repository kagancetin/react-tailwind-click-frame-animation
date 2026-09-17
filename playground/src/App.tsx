import { useState } from "react";
import {
  MouseGestureDetector,
  DEFAULT_CONFIG,
} from "react-tailwind-click-frame-animation";
import {
  Sparkles,
  MousePointer,
  Terminal,
  Copy,
  Check,
  Zap,
  Layers,
  Settings2,
  Code2,
  ExternalLink,
  ShieldCheck,
  Flame,
  Wand2,
  Globe,
  Sliders,
} from "lucide-react";

export default function App() {
  const [lastAction, setLastAction] = useState<string>("Ready! Click or drag anywhere.");
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Gesture stats for interactive feedback
  const [stats, setStats] = useState({
    leftClicks: 0,
    rightClicks: 0,
    drags: 0,
    scrolls: 0,
  });

  // Example 2: RPG Spell Log & Mana State
  const [mana, setMana] = useState(100);
  const [spellLogs, setSpellLogs] = useState<
    { id: number; title: string; type: "water" | "explosion" | "projectile"; time: string }[]
  >([
    { id: 1, title: "Ready for combat! Perform gestures to cast spells.", type: "water", time: "00:00" },
  ]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const addSpellLog = (title: string, type: "water" | "explosion" | "projectile", manaCost: number) => {
    setMana((prev) => Math.max(0, prev - manaCost));
    const now = new Date();
    const timeStr = `${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    setSpellLogs((prev) => [{ id: Date.now(), title, type, time: timeStr }, ...prev.slice(0, 4)]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center selection:bg-sky-500 selection:text-white">
      {/* Global Smoke & Particle Engine */}
      <MouseGestureDetector
        config={{
          general: {
            publicPath: import.meta.env.BASE_URL,
          },
        }}
        onLeftClick={(d) => {
          setStats((prev) => ({ ...prev, leftClicks: prev.leftClicks + 1 }));
          setLastAction(
            `Left Click (${d.isTouch ? "Touch" : "Mouse"}) - X: ${Math.round(d.x)}, Y: ${Math.round(d.y)}`
          );
          addSpellLog(`Puff Burst cast at (${Math.round(d.x)}, ${Math.round(d.y)})`, "water", 5);
        }}
        onRightClick={(d) => {
          setStats((prev) => ({ ...prev, rightClicks: prev.rightClicks + 1 }));
          setLastAction(
            `Right Click (${d.isTouch ? "Long Press" : "Mouse"}) - X: ${Math.round(d.x)}, Y: ${Math.round(d.y)}`
          );
          addSpellLog(`Explosion Shockwave detonated at (${Math.round(d.x)}, ${Math.round(d.y)})!`, "explosion", 20);
        }}
        onDragShoot={(d) => {
          setStats((prev) => ({ ...prev, drags: prev.drags + 1 }));
          setLastAction(
            `Drag & Shoot - Angle: ${Math.round(d.angleDeg)}°, Distance: ${Math.round(d.distance)}px`
          );
          addSpellLog(
            `Fired projectile! Angle: ${Math.round(d.angleDeg)}°, Velocity: ${Math.round(d.distance)}px`,
            "projectile",
            15
          );
        }}
        onScroll={(d) => {
          setStats((prev) => ({ ...prev, scrolls: prev.scrolls + 1 }));
          setLastAction(`Scroll - Direction: ${d.direction}`);
        }}
      />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                react-tailwind-click-frame-animation
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono border border-sky-500/30">
                  v0.1.0
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick links */}
            <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-400">
              <a href="#features" className="hover:text-sky-400 transition-colors">Features</a>
              <a href="#quickstart" className="hover:text-sky-400 transition-colors">Quick Start</a>
              <a href="#config" className="hover:text-sky-400 transition-colors">Config</a>
              <a href="#examples" className="hover:text-sky-400 transition-colors">Examples</a>
            </div>

            {/* External Links */}
            <a
              href="https://github.com/kagancetin/react-tailwind-click-frame-animation"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              GitHub
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full px-4 py-10 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            60 FPS Frame-by-Frame Mouse & Touch Animations
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Bring Your React Apps to Life with Fluid Click Gestures
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Lightweight, zero-bloat frame animations with 3D perspective transforms, one-command CLI asset setup, and deep customization.
          </p>

          {/* Quick Install Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 font-mono text-xs sm:text-sm text-sky-300 shadow-inner">
              <span className="text-slate-500 select-none mr-2">$</span>
              <span>npm i react-tailwind-click-frame-animation</span>
              <button
                type="button"
                onClick={() => copyToClipboard("npm i react-tailwind-click-frame-animation", "hero-npm")}
                className="ml-3 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                title="Copy command"
              >
                {copiedIndex === "hero-npm" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 font-mono text-xs sm:text-sm text-purple-300 shadow-inner">
              <span className="text-slate-500 select-none mr-2">$</span>
              <span>npx react-tailwind-click-frame-animation init</span>
              <button
                type="button"
                onClick={() => copyToClipboard("npx react-tailwind-click-frame-animation init", "hero-cli")}
                className="ml-3 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                title="Copy command"
              >
                {copiedIndex === "hero-cli" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </section>

        {/* Live Interactive Testing Canvas */}
        <section className="relative rounded-2xl border-2 border-dashed border-sky-500/40 bg-gradient-to-b from-slate-900/70 to-slate-950/70 p-8 text-center shadow-2xl backdrop-blur-md overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 shadow-lg">
              <MousePointer className="w-7 h-7 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Live Interactive Playground Canvas
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                Test all gestures anywhere inside this box or across the whole screen:
                <br />
                <strong className="text-slate-200">Left Click</strong> (puff),{" "}
                <strong className="text-purple-300">Right Click</strong> (explosion),{" "}
                <strong className="text-amber-300">Drag & Shoot</strong> (swipe), or{" "}
                <strong className="text-emerald-300">Scroll Wheel</strong> (3D vortex).
              </p>
            </div>

            {/* Status Feedback pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-700/80 font-mono text-xs text-sky-400 shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>
                <strong className="text-slate-400">Live Status:</strong> {lastAction}
              </span>
            </div>

            {/* Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-center">
                <div className="text-xs text-slate-400 font-medium">Left Clicks</div>
                <div className="text-lg font-bold text-sky-400 font-mono">{stats.leftClicks}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-center">
                <div className="text-xs text-slate-400 font-medium">Right Clicks</div>
                <div className="text-lg font-bold text-purple-400 font-mono">{stats.rightClicks}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-center">
                <div className="text-xs text-slate-400 font-medium">Drag & Shoots</div>
                <div className="text-lg font-bold text-amber-400 font-mono">{stats.drags}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-center">
                <div className="text-xs text-slate-400 font-medium">Scroll Vortex</div>
                <div className="text-lg font-bold text-emerald-400 font-mono">{stats.scrolls}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Built for Modern Web Applications
            </h2>
            <p className="text-sm text-slate-400">
              Everything you need for reactive click feedback without performance compromises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <MousePointer className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white text-base">Full Gesture Detection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Left click bursts, right-click explosions with native context-menu blocking, drag & shoot angle projectiles, and continuous 3D scroll vortices.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white text-base">One-Command CLI Setup</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Run <code className="text-sky-300 font-mono">npx react-tailwind-click-frame-animation init</code> to instantly copy all animation frames to your <code className="font-mono">public/images/click</code> directory.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white text-base">Ultra-Lightweight (~31 KB)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero base64 bloat! Images are loaded sequentially and cached by the browser, avoiding massive JS bundles and memory leaks.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white text-base">Granular Control Toggles</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Toggle mobile touch support, disable browser defaults, control text selection smoothly, and eliminate HTML5 ghost drag artifacts.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white text-base">Flexible Assets & Formats</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Supports custom public paths, webp/png/svg formats, padded zero filenames (<code className="font-mono">01.png</code> vs <code className="font-mono">1.png</code>), or direct URL arrays.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white text-base">Zero-Bloat i18n</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Built-in English defaults with full TypeScript typing. Easily supply any custom translation JSON object via the <code className="font-mono">locale</code> prop.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Start & Installation Section */}
        <section id="quickstart" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Installation & Quick Start
            </h2>
            <p className="text-sm text-slate-400">
              Get up and running in under 60 seconds with 3 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Step 1</span>
                <h4 className="font-semibold text-white text-sm">Install Package</h4>
                <p className="text-xs text-slate-400">Add the library to your React project.</p>
              </div>
              <div className="relative bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300">
                <code>npm i react-tailwind-click-frame-animation</code>
                <button
                  type="button"
                  onClick={() => copyToClipboard("npm i react-tailwind-click-frame-animation", "step-1")}
                  className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white"
                >
                  {copiedIndex === "step-1" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Step 2</span>
                <h4 className="font-semibold text-white text-sm">Initialize Assets</h4>
                <p className="text-xs text-slate-400">Copies default frame images to your public folder.</p>
              </div>
              <div className="relative bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300">
                <code>npx react-tailwind-click-frame-animation init</code>
                <button
                  type="button"
                  onClick={() => copyToClipboard("npx react-tailwind-click-frame-animation init", "step-2")}
                  className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white"
                >
                  {copiedIndex === "step-2" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 3</span>
                <h4 className="font-semibold text-white text-sm">Import Styles & Component</h4>
                <p className="text-xs text-slate-400">Place anywhere in your component tree.</p>
              </div>
              <div className="relative bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300">
                <code>import "react-tailwind-click-frame-animation/style.css";</code>
                <button
                  type="button"
                  onClick={() => copyToClipboard('import "react-tailwind-click-frame-animation/style.css";', "step-3")}
                  className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white"
                >
                  {copiedIndex === "step-3" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Start Code Block */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-sky-400" />
                src/App.tsx
              </span>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    `import { MouseGestureDetector } from "react-tailwind-click-frame-animation";\nimport "react-tailwind-click-frame-animation/style.css";\n\nexport default function App() {\n  return (\n    <div>\n      <MouseGestureDetector />\n      <main>\n        <h1>Welcome to My App</h1>\n      </main>\n    </div>\n  );\n}`,
                    "quickstart-code"
                  )
                }
                className="flex items-center gap-1 hover:text-white transition"
              >
                {copiedIndex === "quickstart-code" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Code</span>
              </button>
            </div>
            <pre className="p-5 font-mono text-xs sm:text-sm text-slate-300 overflow-x-auto leading-relaxed">
{`import { MouseGestureDetector } from "react-tailwind-click-frame-animation";
import "react-tailwind-click-frame-animation/style.css";

export default function App() {
  return (
    <div>
      {/* Captures gestures and renders animations across the entire viewport */}
      <MouseGestureDetector />

      <main className="p-8">
        <h1>Welcome to My App</h1>
      </main>
    </div>
  );
}`}
            </pre>
          </div>
        </section>

        {/* Configuration Reference Table */}
        <section id="config" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Settings2 className="w-6 h-6 text-sky-400" />
                Configuration Reference (DEFAULT_CONFIG)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                All fields are optional. Any missing property smoothly falls back to these tuned defaults:
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Gesture Event</th>
                  <th className="px-5 py-3.5">Asset Folder</th>
                  <th className="px-5 py-3.5">Frames</th>
                  <th className="px-5 py-3.5">Naming Format</th>
                  <th className="px-5 py-3.5">Dimensions</th>
                  <th className="px-5 py-3.5">Frame Duration</th>
                  <th className="px-5 py-3.5">Extra Properties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3.5 font-sans font-medium text-white flex items-center gap-2">
                    <span className="text-base">👆</span> Left Click / Tap
                  </td>
                  <td className="px-5 py-3.5 text-sky-400">{DEFAULT_CONFIG.leftClick.folder}</td>
                  <td className="px-5 py-3.5">{DEFAULT_CONFIG.leftClick.frameCount} frames</td>
                  <td className="px-5 py-3.5 text-slate-400">01.png ... 10.png</td>
                  <td className="px-5 py-3.5 text-amber-300">{DEFAULT_CONFIG.leftClick.width}x{DEFAULT_CONFIG.leftClick.height}px</td>
                  <td className="px-5 py-3.5">{DEFAULT_CONFIG.leftClick.frameDuration}ms</td>
                  <td className="px-5 py-3.5 text-slate-400 font-sans">Standard puff burst</td>
                </tr>

                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3.5 font-sans font-medium text-white flex items-center gap-2">
                    <span className="text-base">👉</span> Right Click / Long Press
                  </td>
                  <td className="px-5 py-3.5 text-purple-400">{DEFAULT_CONFIG.rightClick.folder}</td>
                  <td className="px-5 py-3.5">{DEFAULT_CONFIG.rightClick.frameCount} frames</td>
                  <td className="px-5 py-3.5 text-slate-400">01.png ... 16.png</td>
                  <td className="px-5 py-3.5 text-amber-300">{DEFAULT_CONFIG.rightClick.width}x{DEFAULT_CONFIG.rightClick.height}px</td>
                  <td className="px-5 py-3.5">{DEFAULT_CONFIG.rightClick.frameDuration}ms</td>
                  <td className="px-5 py-3.5 text-slate-400 font-sans">500ms long-press on mobile</td>
                </tr>

                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3.5 font-sans font-medium text-white flex items-center gap-2">
                    <span className="text-base">🎯</span> Drag & Shoot (Swipe)
                  </td>
                  <td className="px-5 py-3.5 text-amber-400">{DEFAULT_CONFIG.dragShoot.folder}</td>
                  <td className="px-5 py-3.5">{DEFAULT_CONFIG.dragShoot.frameCount} frames</td>
                  <td className="px-5 py-3.5 text-slate-400">01.png ... 10.png</td>
                  <td className="px-5 py-3.5 text-amber-300">{DEFAULT_CONFIG.dragShoot.width}x{DEFAULT_CONFIG.dragShoot.height}px</td>
                  <td className="px-5 py-3.5">{DEFAULT_CONFIG.dragShoot.frameDuration}ms</td>
                  <td className="px-5 py-3.5 text-slate-400 font-sans">Speed: {DEFAULT_CONFIG.dragShoot.speed}, Max: {DEFAULT_CONFIG.dragShoot.maxDistance}px</td>
                </tr>

                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3.5 font-sans font-medium text-white flex items-center gap-2">
                    <span className="text-base">🌀</span> Scroll / Wheel
                  </td>
                  <td className="px-5 py-3.5 text-emerald-400">{DEFAULT_CONFIG.scroll.folder}</td>
                  <td className="px-5 py-3.5">{DEFAULT_CONFIG.scroll.frameCount} frames</td>
                  <td className="px-5 py-3.5 text-slate-400">01.png ... 12.png</td>
                  <td className="px-5 py-3.5 text-amber-300">{DEFAULT_CONFIG.scroll.width}x{DEFAULT_CONFIG.scroll.height}px</td>
                  <td className="px-5 py-3.5">{DEFAULT_CONFIG.scroll.frameDuration}ms</td>
                  <td className="px-5 py-3.5 text-slate-400 font-sans">RotX: 30°, SpinSpeed: {DEFAULT_CONFIG.scroll.spinSpeed}</td>
                </tr>

                <tr className="hover:bg-slate-800/30 transition-colors bg-slate-950/40">
                  <td className="px-5 py-3.5 font-sans font-medium text-white flex items-center gap-2">
                    <span className="text-base">⚙️</span> General Controls
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">-</td>
                  <td className="px-5 py-3.5 text-slate-400">-</td>
                  <td className="px-5 py-3.5 text-slate-400">-</td>
                  <td className="px-5 py-3.5 text-slate-400">-</td>
                  <td className="px-5 py-3.5 text-slate-400">-</td>
                  <td className="px-5 py-3.5 text-slate-400 font-sans">
                    preventTextSelection: false | preventElementDrag: true | clickThreshold: 15
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Practical Ready-to-Use Examples Section */}
        <section id="examples" className="space-y-8 pt-4">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Real-World Implementation Recipes
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Practical Production Examples
            </h2>
            <p className="text-sm text-slate-400">
              Copy-paste these battle-tested patterns directly into your project.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Example 1: Minimal Clean UI Sparks */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 flex flex-col justify-between shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
                    <Flame className="w-4 h-4" />
                    Example 1: Subtle & Clean UI Feedback
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30 font-mono">
                    Minimalist UI
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ideal for SaaS apps, landing pages, and clean portfolios. Smaller animation dimensions, faster playback speed, and non-blocking native text selection.
                </p>

                <div className="relative bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300">
                  <pre className="overflow-x-auto leading-relaxed">
{`<MouseGestureDetector
  config={{
    general: {
      showHUD: false, // Clean look without HUD
      preventTextSelection: false, // Normal text selection
    },
    leftClick: {
      width: 45,      // Compact subtle puff
      height: 45,
      frameDuration: 25, // Snappy fast animation
    },
    rightClick: {
      enabled: false, // Keep browser right-click menu
    },
    scroll: {
      enabled: false, // Disable scroll vortex
    }
  }}
/>`}
                  </pre>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        `<MouseGestureDetector\n  config={{\n    general: {\n      showHUD: false,\n      preventTextSelection: false,\n    },\n    leftClick: {\n      width: 45,\n      height: 45,\n      frameDuration: 25,\n    },\n    rightClick: {\n      enabled: false,\n    },\n    scroll: {\n      enabled: false,\n    }\n  }}\n/>`,
                        "ex-1"
                      )
                    }
                    className="absolute right-3 top-3 p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  >
                    {copiedIndex === "ex-1" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <span className="text-base">💡</span>
                <span>
                  <strong>Tip:</strong> Setting <code className="text-sky-300">showHUD: false</code> removes the detection badge completely for a seamless user experience.
                </span>
              </div>
            </div>

            {/* Example 2: Interactive Gaming / Combat Magic Spells with Callbacks */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 flex flex-col justify-between shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                    <Wand2 className="w-4 h-4" />
                    Example 2: Gaming & RPG Spell Casting Callbacks
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 font-mono">
                    Interactive State
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Hook directly into gesture events to trigger state changes, sound effects, floating damage numbers, or energy meters:
                </p>

                <div className="relative bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300">
                  <pre className="overflow-x-auto leading-relaxed">
{`<MouseGestureDetector
  onLeftClick={({ x, y }) => {
    playSound("puff.mp3");
    spawnFloatingDamage(x, y, 10);
  }}
  onRightClick={({ x, y }) => {
    playSound("explosion.mp3");
    triggerScreenShake();
  }}
  onDragShoot={({ angleDeg, distance }) => {
    fireSpellProjectile(angleDeg, distance);
  }}
/>`}
                  </pre>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        `<MouseGestureDetector\n  onLeftClick={({ x, y }) => {\n    playSound("puff.mp3");\n    spawnFloatingDamage(x, y, 10);\n  }}\n  onRightClick={({ x, y }) => {\n    playSound("explosion.mp3");\n    triggerScreenShake();\n  }}\n  onDragShoot={({ angleDeg, distance }) => {\n    fireSpellProjectile(angleDeg, distance);\n  }}\n/>`,
                        "ex-2"
                      )
                    }
                    className="absolute right-3 top-3 p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  >
                    {copiedIndex === "ex-2" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Live Interactive Spell Log Widget */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Live Callback Action Feed:
                  </span>
                  <span className="font-mono text-[11px] text-sky-400">
                    Mana: {mana} / 100
                  </span>
                </div>

                <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                  {spellLogs.map((log) => (
                    <div
                      key={log.id}
                      className="text-[11px] font-mono flex items-center justify-between py-1 px-2 rounded bg-slate-900/80 border border-slate-800/60"
                    >
                      <span className="text-slate-300 truncate mr-2">
                        {log.title}
                      </span>
                      <span className="text-slate-500 text-[10px] shrink-0">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer matching README */}
      <footer className="w-full border-t border-slate-800/80 py-8 px-4 text-center mt-12 bg-slate-950/90 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto space-y-2">
          <p>
            Released under the{" "}
            <a
              href="https://github.com/kagancetin/react-tailwind-click-frame-animation/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-white underline underline-offset-4"
            >
              MIT License
            </a>{" "}
            • Copyright © ismetcetin
          </p>
          <p className="text-[11px] text-slate-600">
            Engineered with React, Tailwind CSS, and TypeScript for high-performance interactive web experiences.
          </p>
        </div>
      </footer>
    </div>
  );
}
