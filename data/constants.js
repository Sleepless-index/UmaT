// ─── Palette ──────────────────────────────────────────────────────────────────
// Dark graphite base, azure accent, soft per-type gem colors
const C = {
  bg: "#0c0c0f",
  surface: "#15151a",
  card: "#1d1d23",
  border: "#28282f",
  border2: "#38383f",
  accent: "#5b8def",
  // cool azure blue
  accentLo: "#5b8def22",
  text: "#f1f1f4",
  muted: "#86868f",
  faint: "#1b1b21"
};

// Distance categories (Sprint/Mile/Medium/Long) — these come from the track
// a round is run on, via TRACK_BY_ID / TRACKS_BY_TYPE in data/tracks.js.
// "Dirt" used to live in this list as a leftover from when type conflated
// distance category with surface; surface (Turf/Dirt) is now its own field
// on the track itself, so it's been removed here.
const TYPE_COLOR = {
  Sprint: "#f472b6",
  // pink
  Mile: "#818cf8",
  // indigo
  Medium: "#34d399",
  // emerald
  Long: "#38bdf8" // sky
};
const TYPE_GLOW = {
  Sprint: "#f472b622",
  Mile: "#818cf822",
  Medium: "#34d39922",
  Long: "#38bdf822"
};
const TYPES = ["Sprint", "Mile", "Medium", "Long"];

// Surface colors, used wherever a track's surface (not distance type) needs
// a visual treatment — e.g. the track picker, round summaries.
const SURFACE_COLOR = {
  Turf: "#4ade80",
  Dirt: "#d97706"
};

// Team Trial class tiers, used on the Profile tab.
const CLASS_INFO = {
  1: { label: "Class 1", color: "#f87171" },
  2: { label: "Class 2", color: "#fb923c" },
  3: { label: "Class 3", color: "#fbbf24" },
  4: { label: "Class 4", color: "#a3e635" },
  5: { label: "Class 5", color: "#38bdf8" },
  6: { label: "Class 6", color: "#a78bfa" }
};

