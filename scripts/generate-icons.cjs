// Generiert alle Icons aus public/icon-source.svg
// Aufruf: node scripts/generate-icons.cjs
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'public', 'icon-source.svg');
const OUT_DIR = path.join(__dirname, '..', 'public');

const SIZES = [
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'pwa-192.png', size: 192 },
  { name: 'pwa-512.png', size: 512 },
  { name: 'pwa-maskable-512.png', size: 512, padding: 0.1 }, // Safe-Area für iOS-Home-Screen-Masken
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-16.png', size: 16 }
];

(async () => {
  if (!fs.existsSync(SRC)) { console.error('Quell-SVG fehlt:', SRC); process.exit(1); }
  const svg = fs.readFileSync(SRC);
  for (const { name, size, padding = 0 } of SIZES) {
    const inner = Math.round(size * (1 - padding * 2));
    let pipeline = sharp(svg).resize(inner, inner);
    if (padding > 0) {
      pipeline = pipeline.extend({
        top: Math.round(size * padding),
        bottom: Math.round(size * padding),
        left: Math.round(size * padding),
        right: Math.round(size * padding),
        background: { r: 15, g: 23, b: 42, alpha: 1 }
      });
    }
    await pipeline.png().toFile(path.join(OUT_DIR, name));
    console.log('✓', name);
  }
})();
