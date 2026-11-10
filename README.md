# Sachin Singh · Portfolio

Personal portfolio built with Next.js 14, TypeScript, Tailwind CSS and Framer Motion.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

- Content (projects, experience, stack, contact details) lives in `data/index.ts`.
- The liquid-gold background is a WebGL shader in `components/LiquidGold.tsx`.
- The scroll story's world map is drawn on a canvas in `components/RequestMap.tsx`. Its land dots in `data/worldDots.ts` are generated from `data/globe.json` with `node scripts/generate-world-dots.mjs`.
