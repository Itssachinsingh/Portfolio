// Beats of the scroll story, as fractions of the story section's scroll progress (0 to 1).
// The map and the stack cards both read from here so they stay in step.
export const TIMELINE = {
  // the camera moves from the whole world to the Gulf and India
  zoomIn: [0.06, 0.3],
  // one request travels from Dubai to Dehradun
  route: [0.3, 0.5],
  // the landing ring pulses at Dehradun
  landing: [0.5, 0.58],
  // the camera dives into Dehradun while the map fades away
  dive: [0.5, 0.64],
  mapFade: [0.55, 0.64],
  // the database, API and interface cards fly in, one after another
  layers: [0.6, 0.68, 0.76],
  // the cards connect and the response comes back
  settle: [0.86, 0.92],
} as const;

// map interactions only make sense while the whole world is on screen
export const INTERACTIVE_UNTIL = 0.12;

// where the stack cards sit in the stage, as a share of its height
export const STAGE_CENTER_Y = 0.42;

export const smoothstep = (from: number, to: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
};
