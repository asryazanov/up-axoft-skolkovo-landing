import fs from "node:fs/promises";
import sharp from "sharp";

const width = 1200;
const height = 630;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e2849"/>
      <stop offset="100%" stop-color="#25325d"/>
    </linearGradient>
    <radialGradient id="glow1" cx="80%" cy="18%" r="46%">
      <stop offset="0%" stop-color="#00adef" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#00adef" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="12%" cy="92%" r="46%">
      <stop offset="0%" stop-color="#B1EC52" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#B1EC52" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>
  <rect x="72" y="72" width="1056" height="486" rx="34" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
  <text x="102" y="135" font-family="Manrope, Arial, sans-serif" font-size="30" font-weight="800" fill="#B1EC52">UP: Axoft &amp; Сколково</text>
  <text x="102" y="245" font-family="Manrope, Arial, sans-serif" font-size="78" font-weight="800" fill="#ffffff">Выведите</text>
  <text x="102" y="335" font-family="Manrope, Arial, sans-serif" font-size="78" font-weight="800" fill="#ffffff">технологический продукт</text>
  <text x="102" y="425" font-family="Manrope, Arial, sans-serif" font-size="78" font-weight="800" fill="#ffffff">на корпоративный рынок</text>
  <rect x="102" y="482" width="326" height="62" rx="12" fill="#B1EC52"/>
  <text x="132" y="523" font-family="Manrope, Arial, sans-serif" font-size="24" font-weight="800" fill="#1e2849">Первый цикл — II квартал</text>
  <text x="760" y="522" font-family="Manrope, Arial, sans-serif" font-size="24" font-weight="700" fill="rgba(255,255,255,0.72)">Axoft × Фонд «Сколково»</text>
</svg>`;

await fs.mkdir("public", { recursive: true });
await sharp(Buffer.from(svg)).png().toFile("public/og-up-landing.png");
