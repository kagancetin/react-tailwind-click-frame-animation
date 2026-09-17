const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '../public/images/click');
const folders = ['Smoke', 'SmokeExplosion', 'SmokeSpell', 'PoisonousSmoke'];
const result = {};

for (const f of folders) {
  const dir = path.join(baseDir, f);
  const files = fs.readdirSync(dir).filter(x => x.endsWith('.png')).sort();
  result[f] = files.map(file => {
    const filePath = path.join(dir, file);
    const data = fs.readFileSync(filePath);
    return 'data:image/png;base64,' + data.toString('base64');
  });
  console.log(`${f}: ${result[f].length} frames loaded.`);
}

const content = `/**
 * Built-in default frames encoded as Base64 Data URLs.
 * This guarantees zero-configuration plug-and-play in any project (Vite, Next.js, CRA, etc.)
 * without requiring the consumer to copy any image files to their public directory!
 */
export const DEFAULT_FRAMES: Record<"Smoke" | "SmokeExplosion" | "SmokeSpell" | "PoisonousSmoke", string[]> = ${JSON.stringify(result, null, 2)};
`;

fs.writeFileSync(path.resolve(__dirname, '../src/defaultFrames.ts'), content, 'utf8');
console.log('src/defaultFrames.ts successfully generated!');
