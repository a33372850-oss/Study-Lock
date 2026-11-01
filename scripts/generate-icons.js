import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');

// Base SVG content
const svgPath = path.join(publicDir, 'icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

// Maskable SVG with full-bleed background and 20% safe-padding around the emblem
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0E0A24"/>
      <stop offset="50%" stop-color="#140D36"/>
      <stop offset="100%" stop-color="#090714"/>
    </linearGradient>
    <linearGradient id="shield" x1="120" y1="90" x2="392" y2="420" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1E1742"/>
      <stop offset="100%" stop-color="#0E0A24"/>
    </linearGradient>
  </defs>
  <!-- Full bleed background for adaptive/maskable clipping on Android -->
  <rect width="512" height="512" fill="url(#bg)"/>
  
  <!-- Scaled down to safe zone (central 75%) -->
  <g transform="translate(64, 64) scale(0.75)">
    <!-- Outer accent rounded border -->
    <rect width="512" height="512" rx="128" fill="#7000FF" fill-opacity="0.2" stroke="#7000FF" stroke-width="8"/>
    <rect x="24" y="24" width="464" height="464" rx="104" fill="#0C0820"/>
    <!-- Shield outline -->
    <path d="M256 96L376 148V254C376 332 325 404 256 428C187 404 136 332 136 254V148L256 96Z" fill="url(#shield)" stroke="#7000FF" stroke-width="12"/>
    <!-- Lock body -->
    <rect x="206" y="240" width="100" height="84" rx="18" fill="#00F5D4"/>
    <!-- Lock shackle -->
    <path d="M226 240V208C226 191.431 239.431 178 256 178C272.569 178 286 191.431 286 208V240" stroke="#00F5D4" stroke-width="16" stroke-linecap="round"/>
    <!-- Keyhole -->
    <circle cx="256" cy="274" r="8" fill="#0C0820"/>
    <path d="M253 278L251 298H261L259 278H253Z" fill="#0C0820"/>
  </g>
</svg>`;

async function run() {
  console.log('Generating PNG icons...');

  // 192x192 PNG
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  // 512x512 PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  // 180x180 Apple Touch Icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // 512x512 Maskable PNG
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  // Favicon 32x32 & 48x48
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('Generated favicon-32x32.png');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
