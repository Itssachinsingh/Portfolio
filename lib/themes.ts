// Colour palettes for the whole site. Tailwind reads them through CSS variables
// (see tailwind.config.ts); the WebGL background and the canvases read `palette.current`.

type RGB = [number, number, number];

export type Theme = {
  id: string;
  name: string;
  // background, then three lifted surfaces
  ink: [RGB, RGB, RGB, RGB];
  // the accent and its lighter hover tone
  signal: RGB;
  signalSoft: RGB;
  // body text, then two dimmer steps
  mist: [RGB, RGB, RGB];
};

export const THEMES: Theme[] = [
  {
    id: "gold",
    name: "Gold",
    ink: [[12, 10, 8], [20, 17, 13], [27, 23, 18], [39, 33, 26]],
    signal: [242, 181, 68],
    signalSoft: [248, 213, 138],
    mist: [[243, 236, 224], [196, 187, 173], [140, 131, 118]],
  },
  {
    id: "cobalt",
    name: "Cobalt",
    ink: [[7, 9, 14], [12, 15, 23], [17, 21, 31], [27, 33, 46]],
    signal: [92, 145, 255],
    signalSoft: [156, 189, 255],
    mist: [[232, 238, 247], [176, 186, 202], [118, 129, 147]],
  },
  {
    id: "emerald",
    name: "Emerald",
    ink: [[6, 11, 9], [11, 18, 15], [16, 25, 21], [25, 37, 31]],
    signal: [52, 211, 153],
    signalSoft: [134, 239, 196],
    mist: [[230, 242, 236], [172, 191, 182], [116, 135, 126]],
  },
  {
    id: "violet",
    name: "Violet",
    ink: [[10, 8, 15], [16, 13, 24], [22, 18, 33], [34, 28, 48]],
    signal: [167, 139, 250],
    signalSoft: [203, 186, 253],
    mist: [[238, 234, 248], [186, 180, 204], [130, 123, 150]],
  },
  {
    id: "coral",
    name: "Coral",
    ink: [[13, 8, 8], [21, 13, 13], [29, 18, 18], [43, 27, 27]],
    signal: [255, 112, 92],
    signalSoft: [255, 168, 154],
    mist: [[245, 234, 231], [199, 182, 178], [143, 125, 121]],
  },
  {
    id: "aqua",
    name: "Aqua",
    ink: [[6, 11, 13], [10, 18, 21], [15, 25, 29], [23, 37, 42]],
    signal: [34, 211, 238],
    signalSoft: [125, 232, 248],
    mist: [[230, 244, 247], [170, 192, 197], [113, 136, 141]],
  },
  {
    id: "lime",
    name: "Lime",
    ink: [[9, 10, 8], [15, 17, 13], [21, 23, 18], [32, 35, 27]],
    signal: [190, 242, 100],
    signalSoft: [217, 249, 157],
    mist: [[238, 242, 230], [186, 192, 175], [130, 136, 119]],
  },
  {
    id: "silver",
    name: "Silver",
    ink: [[9, 9, 10], [15, 15, 17], [21, 21, 24], [33, 33, 37]],
    signal: [226, 228, 234],
    signalSoft: [255, 255, 255],
    mist: [[240, 240, 242], [184, 184, 190], [128, 128, 136]],
  },
];

// what the canvases draw with; kept in step with the CSS variables by applyTheme
export const palette = { current: THEMES[0] };

// where a visitor's choice is remembered
export const STORAGE_KEY = "theme";

// the CSS variables a theme sets, as "r g b" channels
export const themeVars = (theme: Theme): Record<string, string> => {
  const vars: Record<string, RGB> = {
    "--ink": theme.ink[0],
    "--ink-100": theme.ink[1],
    "--ink-200": theme.ink[2],
    "--ink-300": theme.ink[3],
    "--signal": theme.signal,
    "--signal-soft": theme.signalSoft,
    "--mist": theme.mist[0],
    "--mist-100": theme.mist[1],
    "--mist-200": theme.mist[2],
  };
  return Object.fromEntries(Object.entries(vars).map(([k, c]) => [k, c.join(" ")]));
};

// Runs in <head> before the page paints, so a saved theme never flashes gold first.
export const themeBootScript = `try{var t=${JSON.stringify(
  Object.fromEntries(THEMES.map((theme) => [theme.id, themeVars(theme)]))
)}[localStorage.getItem(${JSON.stringify(STORAGE_KEY)})];if(t)for(var k in t)document.documentElement.style.setProperty(k,t[k])}catch(e){}`;

export const applyTheme = (theme: Theme) => {
  palette.current = theme;
  const root = document.documentElement.style;
  for (const [name, value] of Object.entries(themeVars(theme))) root.setProperty(name, value);
  window.dispatchEvent(new Event("themechange"));
};
