# react-tailwind-click-frame-animation

[![npm version](https://img.shields.io/npm/v/react-tailwind-click-frame-animation.svg?style=flat-square)](https://www.npmjs.com/package/react-tailwind-click-frame-animation)
[![npm downloads](https://img.shields.io/npm/dm/react-tailwind-click-frame-animation.svg?style=flat-square)](https://www.npmjs.com/package/react-tailwind-click-frame-animation)

A lightweight, customizable React frame-by-frame mouse & touch animation package with 3D perspective transforms, one-command CLI asset initialization, and Tailwind CSS support.

🔗 **NPM Package**: [https://www.npmjs.com/package/react-tailwind-click-frame-animation](https://www.npmjs.com/package/react-tailwind-click-frame-animation)  
🐙 **GitHub Repository**: [https://github.com/kagancetin/react-tailwind-click-frame-animation](https://github.com/kagancetin/react-tailwind-click-frame-animation)

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://kagancetin.github.io/react-tailwind-click-frame-animation/)

---

## ✨ Features

- 🖱️ **Full Gesture Detection (Desktop & Mobile)**:
  - **Left Click / Tap**: Static puff animation (`Smoke`).
  - **Right Click / Long Press**: Explosion animation (`SmokeExplosion`) with native context-menu blocking.
  - **Drag & Shoot / Swipe**: Directional projectile with angle calculation (`SmokeSpell`).
  - **Scroll / Wheel**: Continuous 3D Euler-spinning vortex (`PoisonousSmoke`).
- ⚡ **One-Command Asset Setup (`npx react-tailwind-click-frame-animation init`)**:
  - Automatically copies all default animation assets into your project's `public/images/click/` directory with a single command.
- 🪶 **Ultra-Lightweight (~31 KB Bundle)**:
  - Zero base64 bloat! No Babel 500KB bundle threshold warnings and lightning-fast load times.
- 🎛️ **Granular Controls & Master Toggles**:
  - `enableMobile`: Toggle touch interaction per individual gesture (`leftClick`, `rightClick`, `dragShoot`, `scroll`) or globally via `general.enableMobile`.
  - `preventDefault`: Toggle native browser actions per gesture (e.g. disable right-click context menu, disable scroll propagation).
  - `preventTextSelection`: Global master switch via `general.preventTextSelection` (`false` allows selecting text across the page, `true` disables text selection during gestures).
  - `preventElementDrag`: Prevents native HTML5 ghost element dragging and cursor changes on images/links during swipe/drag gestures (defaults to `true`).
- 🎞️ **Custom Frame Support**:
  - Use custom public folder paths (e.g. `folder: "/images/custom-fire"`).
  - Custom file extensions (`png`, `webp`, `svg`, `jpg`).
  - Zero-padding toggle (`01.png` vs `1.png`).
  - Direct frame URLs override (`frames: ["url1", "url2", ...]`).
- 🌐 **Zero-Bloat Localization**:
  - Built-in English default with full TypeScript typing.
  - Easily override with custom language JSON objects (`locale`).
- 📐 **Smooth 60 FPS CSS 3D Transforms**: High-performance `requestAnimationFrame` render loop with CSS perspective transforms.

---

## 📦 Installation

```bash
npm install react-tailwind-click-frame-animation
# or
pnpm add react-tailwind-click-frame-animation
# or
yarn add react-tailwind-click-frame-animation
```

### Initialize Default Assets (Recommended)

Run the CLI command in your project root to automatically copy the default animation frames into your `public/` directory:

```bash
npx react-tailwind-click-frame-animation init
```

> 💡 This command creates `public/images/click/` containing `Smoke`, `SmokeExplosion`, `SmokeSpell`, and `PoisonousSmoke` assets so they are immediately available.

Include package styles in your project (e.g., `main.tsx`, `index.tsx`, or `App.tsx`):

```tsx
import "react-tailwind-click-frame-animation/style.css";
```

---

## 🚀 Quick Start

### 1. Plug & Play

Once you've run the `init` command, drop the detector anywhere in your React tree:

```tsx
import { MouseGestureDetector } from "react-tailwind-click-frame-animation";
import "react-tailwind-click-frame-animation/style.css";

export default function App() {
  return (
    <div>
      {/* Captures gestures and renders animations across the viewport */}
      <MouseGestureDetector />

      <main className="p-8">
        <h1>Welcome to My App</h1>
      </main>
    </div>
  );
}
```

---

## ⚙️ Complete Default Config (Ready to Copy & Paste)

You can customize any gesture or global option using the `config` prop. Every field is optional; any missing field automatically falls back to these defaults:

```json
{
  "leftClick": {
    "enabled": true,
    "enabledMobile": true,
    "folder": "Smoke",
    "frameCount": 10,
    "width": 75,
    "height": 75,
    "frameDuration": 45,
    "extension": "png",
    "padZero": true,
    "preventDefault": true
  },
  "rightClick": {
    "enabled": true,
    "enabledMobile": true,
    "longPressMs": 500,
    "folder": "SmokeExplosion",
    "frameCount": 16,
    "width": 90,
    "height": 90,
    "frameDuration": 35,
    "extension": "png",
    "padZero": true,
    "preventDefault": true
  },
  "dragShoot": {
    "enabled": true,
    "enabledMobile": true,
    "folder": "SmokeSpell",
    "frameCount": 10,
    "width": 80,
    "height": 50,
    "frameDuration": 10,
    "speed": 8,
    "maxDistance": 450,
    "rotateToAngle": true,
    "rotationOffset": 180,
    "extension": "png",
    "padZero": true,
    "preventDefault": true
  },
  "scroll": {
    "enabled": true,
    "enabledMobile": false,
    "folder": "PoisonousSmoke",
    "frameCount": 12,
    "width": 60,
    "height": 70,
    "frameDuration": 40,
    "axes": {
      "x": false,
      "y": false,
      "z": true
    },
    "initialRotation": {
      "x": 30,
      "y": 0,
      "z": 0
    },
    "spinSpeed": 8,
    "throttleMs": 140,
    "extension": "png",
    "padZero": true,
    "preventDefault": false
  },
  "general": {
    "enableMobile": true,
    "showHUD": true,
    "clickThreshold": 15,
    "preventTextSelection": false,
    "preventElementDrag": true
  }
}
```

---

## 🎨 Customizing Config via React Props

Pass only the settings you wish to change:

```tsx
<MouseGestureDetector
  config={{
    general: {
      preventTextSelection: false, // Enable normal text selection across all gestures
      enableMobile: true,         // Master switch for mobile touch listeners
      showHUD: false,             // Hide the top-right gesture badge
    },
    leftClick: {
      width: 80,
      height: 80,
    },
    rightClick: {
      enableMobile: false,         // Disable long-press explosion on mobile
      preventDefault: false,       // Let native browser right-click menu show
    },
    dragShoot: {
      speed: 20,                  // Faster projectile speed
      maxDistance: 600,           // Longer flight path
    },
    scroll: {
      enableMobile: false,        // Disable mobile touch scroll vortex
      preventDefault: true,        // Prevent webpage scroll while spinning
    },
  }}
/>
```

---

## 📁 Folder Structure & Sequential File Naming

### Default Animation Assets (`npx react-tailwind-click-frame-animation init`)

Running the `init` command generates the standard folder structure inside your project's `public/images/click/` directory:

```text
my-react-app/
├── public/
│   └── images/
│       └── click/
│           ├── Smoke/              <-- Default for Left Click / Tap (10 frames)
│           │   ├── 01.png
│           │   ├── ...
│           │   └── 10.png
│           ├── SmokeExplosion/     <-- Default for Right Click / Long Press (16 frames)
│           │   ├── 01.png
│           │   └── ...
│           ├── SmokeSpell/         <-- Default for Drag & Shoot / Swipe (10 frames)
│           │   ├── 01.png
│           │   └── ...
│           └── PoisonousSmoke/     <-- Default for Scroll / Wheel (12 frames)
│               ├── 01.png
│               └── ...
├── src/
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── ...
```

### Custom Animations

When using your own custom animations, place your sequential frame images inside your project's `public/` directory (e.g. `public/assets/fire/`):

```text
my-react-app/
├── public/
│   └── assets/
│       └── fire/
│           ├── 01.webp     <-- Frame 1 (padZero: true)
│           ├── 02.webp     <-- Frame 2
│           ├── 03.webp     <-- Frame 3
│           ├── ...
│           └── 15.webp     <-- Frame 15 (frameCount: 15)
```

### 🔢 Naming Formats & Options

| Option | Setting | Expected Filename Sequence | Example |
| :--- | :--- | :--- | :--- |
| **`padZero: true`** *(Default)* | 2-digit zero-padding | `01.ext`, `02.ext`, ... `09.ext`, `10.ext`, `11.ext` | `01.png` ... `16.png` |
| **`padZero: false`** | Plain sequential integer | `1.ext`, `2.ext`, ... `9.ext`, `10.ext`, `11.ext` | `1.webp` ... `15.webp` |
| **`extension`** | Any image extension | `png` *(default)*, `webp`, `svg`, `jpg`, `gif` | `extension: "webp"` |
| **`folder`** | Relative to `public/` | Starts with `/` pointing inside `public/` | `folder: "/assets/fire"` |
| **`frameCount`** | Total number of frames | How many numbered files to generate & cycle through | `frameCount: 15` |

---

## 🖼️ Using Custom Frames & Folders

### Example 1: Loading from `public/assets/fire/`

```tsx
<MouseGestureDetector
  config={{
    leftClick: {
      folder: "/assets/fire", // Points to public/assets/fire/
      frameCount: 15,         // Looks for 01.webp through 15.webp
      extension: "webp",      // File extension
      padZero: true,          // true: 01, 02... | false: 1, 2...
      width: 100,
      height: 100,
    },
  }}
/>
```

Or pass a direct array of frame URLs:

```tsx
<MouseGestureDetector
  config={{
    leftClick: {
      frames: [
        "https://example.com/frame1.png",
        "https://example.com/frame2.png",
        "https://example.com/frame3.png",
      ],
      width: 70,
      height: 70,
    },
  }}
/>
```

---

## 🌐 Custom Language JSON (Localization)

You can pass a custom translation object to the `locale` prop:

```json
// my-tr.json
{
  "hud": {
    "lastDetected": "Algılanan Son Hareket:"
  },
  "gestures": {
    "none": "Henüz bir hareket yapılmadı",
    "leftClick": "Sol Tık",
    "rightClick": "Sağ Tık (Patlama)",
    "dragShoot": "Sürükle & Fırlat: Açı: {angle}°, Mesafe: {distance}px",
    "scrollDown": "Aşağı Scroll",
    "scrollUp": "Yukarı Scroll",
    "mobileLongPress": "Mobil Uzun Basma",
    "mobileTap": "Mobil Dokunma",
    "mobileSwipe": "Mobil Fırlatma: Açı: {angle}°, Mesafe: {distance}px"
  }
}
```

```tsx
import myLocale from "./my-tr.json";

<MouseGestureDetector locale={myLocale} />
```

---

## 🛠️ Development & Contributing

Clone and run the interactive playground locally:

```bash
# Install dependencies
npm install

# Start development playground
npm run dev

# Run TypeScript check
npm run typecheck

# Build npm library package (dist/)
npm run build

# Build playground demo (dist-demo/)
npm run build:demo
```

---

<p align="center">
  <sub>Released under the <a href="LICENSE">MIT License</a> • Copyright © ismetcetin</sub>
</p>
