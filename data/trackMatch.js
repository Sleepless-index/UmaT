// ─── Track text matching ────────────────────────────────────────────────────
// Resolves a free-text track description (as typed by a person, e.g.
// "Chukyo 1800m Dirt" or "chukyo dirt 1800") against the real track list in
// TRACK_BY_ID. Used by the batch/paste import header parser.
//
// Returns { track, confidence } where confidence is "exact" | "fuzzy", or
// null if nothing matched well enough to be trusted automatically — in
// which case the caller should ask the person to pick manually rather than
// guess.

// A couple of venues have alternate spellings worth tolerating without
// going as far as a generic typo-correcting algorithm.
const VENUE_ALIASES = {
  "chuukyo": "Chukyo",
  "santa anita": "Santa Anita Park",
  "santaanita": "Santa Anita Park"
};

function normalizeVenueToken(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// All known venues, longest-name-first so "Santa Anita Park" is tried
// before any shorter accidental substring match.
function allVenues() {
  const set = new Set();
  Object.values(TRACK_BY_ID).forEach(t => set.add(t.venue));
  return [...set].sort((a, b) => b.length - a.length);
}

function findVenueInText(text) {
  const normalized = normalizeVenueToken(text);
  // Try real venue names first.
  for (const venue of allVenues()) {
    if (normalized.includes(normalizeVenueToken(venue))) return venue;
  }
  // Then known aliases/typos.
  for (const [alias, venue] of Object.entries(VENUE_ALIASES)) {
    if (normalized.includes(normalizeVenueToken(alias))) return venue;
  }
  return null;
}

function findDistanceInText(text) {
  const m = text.match(/(\d{3,4})\s*m\b/i) || text.match(/(\d{3,4})/);
  return m ? parseInt(m[1]) : null;
}

function findSurfaceInText(text) {
  if (/\bdirt\b/i.test(text)) return "Dirt";
  if (/\bturf\b/i.test(text)) return "Turf";
  return null;
}

// Resolves free text to a single track. Strategy:
// 1. Extract venue, distance, surface from the text independently.
// 2. If venue + distance both found, filter candidates by those; surface
//    (if present) narrows further, otherwise picks the unique match if
//    there's only one distance/venue combo, or the Turf one if it's the
//    only ambiguity (Turf is far more common, and Dirt is explicit when
//    intended — "Chukyo 1800m" with no surface word defaults to Turf).
// 3. If exactly one candidate remains, return it as "exact". If venue
//    matched but distance/surface left multiple candidates, return null
//    (ambiguous) rather than guess.
function matchTrackText(text) {
  if (!text || !text.trim()) return null;
  const venue = findVenueInText(text);
  const distance = findDistanceInText(text);
  const surface = findSurfaceInText(text);
  if (!venue) return null;

  let candidates = Object.values(TRACK_BY_ID).filter(t => t.venue === venue);
  if (candidates.length === 0) return null;

  if (distance !== null) {
    const byDistance = candidates.filter(t => t.distance === distance);
    // If a distance was given but nothing at this venue matches it, the
    // match has genuinely failed — don't silently fall back to a
    // different distance, since that would record the wrong track.
    if (byDistance.length === 0) return null;
    candidates = byDistance;
  }
  if (surface) {
    const bySurface = candidates.filter(t => t.surface === surface);
    if (bySurface.length === 0) return null;
    candidates = bySurface;
  }

  if (candidates.length === 1) {
    return { track: candidates[0], confidence: "exact" };
  }
  if (candidates.length > 1 && !surface) {
    // Same venue+distance exists on both surfaces (e.g. some venues have
    // a Turf and Dirt course at the same length) and no surface was
    // specified — default to Turf since it's the common case, but mark
    // it fuzzy since this is a guess, not a certain match.
    const turfOnly = candidates.filter(t => t.surface === "Turf");
    if (turfOnly.length === 1) return { track: turfOnly[0], confidence: "fuzzy" };
  }
  if (candidates.length > 1 && distance === null) {
    // Venue matched but no distance given and multiple tracks at this
    // venue — too ambiguous to guess a specific one.
    return null;
  }
  return null;
}
