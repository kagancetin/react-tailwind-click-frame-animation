#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const command = process.argv[2];

if (command !== "init") {
  console.log(`
Usage:
  npx react-tailwind-click-frame-animation init

Description:
  Copies default animation frame assets into your project's public/images/click directory.
`);
  process.exit(0);
}

console.log("\x1b[36m%s\x1b[0m", "\n✨ Initializing react-tailwind-click-frame-animation assets...\n");

// Target project root directory (where the user is running the command)
const targetRoot = process.cwd();
const targetPublic = path.join(targetRoot, "public");
const targetDest = path.join(targetPublic, "images", "click");

// Source directory inside the package
const packageRoot = path.resolve(__dirname, "..");
let sourceDir = path.join(packageRoot, "dist", "images", "click");

if (!fs.existsSync(sourceDir)) {
  sourceDir = path.join(packageRoot, "public", "images", "click");
}

if (!fs.existsSync(sourceDir)) {
  console.error("\x1b[31m%s\x1b[0m", "❌ Error: Could not find package source assets.");
  process.exit(1);
}

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const items = fs.readdirSync(source);
  for (const item of items) {
    const srcPath = path.join(source, item);
    const destPath = path.join(target, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyFolderRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  copyFolderRecursiveSync(sourceDir, targetDest);
  console.log("\x1b[32m%s\x1b[0m", "✔ Successfully copied animation assets to:");
  console.log("  " + path.relative(targetRoot, targetDest) + " (public/images/click/)\n");
  console.log("\x1b[36m%s\x1b[0m", "🎉 Ready to go! Import MouseGestureDetector and style.css in your React app:\n");
  console.log('  import { MouseGestureDetector } from "react-tailwind-click-frame-animation";');
  console.log('  import "react-tailwind-click-frame-animation/style.css";\n');
} catch (err) {
  console.error("\x1b[31m%s\x1b[0m", "❌ Failed to copy assets:", err.message);
  process.exit(1);
}
