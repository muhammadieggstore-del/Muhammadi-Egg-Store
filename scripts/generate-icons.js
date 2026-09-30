import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Crisp, beautiful SVG icon for Muhammadi Egg Store
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b" />
      <stop offset="100%" stop-color="#022c22" />
    </linearGradient>
    <linearGradient id="eggGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF7" />
      <stop offset="50%" stop-color="#FEF3C7" />
      <stop offset="100%" stop-color="#FDE68A" />
    </linearGradient>
    <linearGradient id="yolkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Background with slight rounding for any -->
  <rect width="512" height="512" rx="100" fill="url(#bgGrad)"/>
  
  <!-- Outer subtle glowing crest ring -->
  <circle cx="256" cy="256" r="210" fill="none" stroke="#10b981" stroke-opacity="0.25" stroke-width="6" stroke-dasharray="12 12" />

  <!-- Egg Shape with shadow -->
  <g filter="url(#shadow)">
    <!-- Natural Egg Silhouette: narrower at top, wider at bottom -->
    <path d="M 256,90 
             C 170,90 120,200 120,310 
             C 120,410 180,450 256,450 
             C 332,450 392,410 392,310 
             C 392,200 342,90 256,90 Z" 
          fill="url(#eggGrad)" />
  </g>

  <!-- Golden Yolk / Sun in lower center -->
  <ellipse cx="256" cy="330" rx="72" ry="70" fill="url(#yolkGrad)" />
  <ellipse cx="240" cy="315" rx="20" ry="12" fill="#FEF3C7" opacity="0.6" />

  <!-- Fresh Sprout / Leaf motif on top corner symbolizing fresh poultry produce -->
  <path d="M 256,120 C 265,80 305,65 330,70 C 330,105 300,135 256,120 Z" fill="#10b981" />
  <path d="M 260,110 C 275,90 295,85 315,88" stroke="#34d399" stroke-width="3" fill="none" stroke-linecap="round" />

  <!-- Business Initials badge -->
  <text x="256" y="240" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="44" 
        font-weight="900" 
        text-anchor="middle" 
        fill="#064e3b" 
        letter-spacing="2">MES</text>
  <text x="256" y="268" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="14" 
        font-weight="700" 
        text-anchor="middle" 
        fill="#047857" 
        letter-spacing="3">LONI • FRESH EGGS</text>
</svg>`;

// Maskable icon with safe zone padding (central 80% circle safe zone)
const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b" />
      <stop offset="100%" stop-color="#022c22" />
    </linearGradient>
    <linearGradient id="eggGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF7" />
      <stop offset="50%" stop-color="#FEF3C7" />
      <stop offset="100%" stop-color="#FDE68A" />
    </linearGradient>
    <linearGradient id="yolkGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
  </defs>
  
  <!-- Solid background for full-bleed maskable -->
  <rect width="512" height="512" fill="url(#bgGrad2)"/>
  
  <!-- Centered & scaled within safe zone (80% box: 51px to 461px) -->
  <g transform="translate(51, 51) scale(0.8)">
    <path d="M 256,90 
             C 170,90 120,200 120,310 
             C 120,410 180,450 256,450 
             C 332,450 392,410 392,310 
             C 392,200 342,90 256,90 Z" 
          fill="url(#eggGrad2)" />
    
    <ellipse cx="256" cy="330" rx="72" ry="70" fill="url(#yolkGrad2)" />
    <ellipse cx="240" cy="315" rx="20" ry="12" fill="#FEF3C7" opacity="0.6" />
    
    <path d="M 256,120 C 265,80 305,65 330,70 C 330,105 300,135 256,120 Z" fill="#10b981" />
    <text x="256" y="240" 
          font-family="system-ui, -apple-system, sans-serif" 
          font-size="44" 
          font-weight="900" 
          text-anchor="middle" 
          fill="#064e3b" 
          letter-spacing="2">MES</text>
    <text x="256" y="268" 
          font-family="system-ui, -apple-system, sans-serif" 
          font-size="14" 
          font-weight="700" 
          text-anchor="middle" 
          fill="#047857" 
          letter-spacing="3">LONI • FRESH EGGS</text>
  </g>
</svg>`;

async function generate() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);
  fs.writeFileSync(path.join(publicDir, 'icon-maskable.svg'), svgMaskable);

  const svgBuffer = Buffer.from(svgIcon);
  const maskableBuffer = Buffer.from(svgMaskable);

  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(svgBuffer).resize(64, 64).png().toFile(path.join(publicDir, 'favicon.png'));
  await sharp(maskableBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  console.log('PWA icons successfully generated in /public');
}

generate().catch(console.error);
