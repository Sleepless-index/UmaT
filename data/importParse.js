// ─── Import text parsing (round/track aware) ───────────────────────────────
// Format: a header section declaring which track each lane runs, followed
// by 3-line entry blocks. Lane keywords are the same 5 Team Trial lanes:
// Sprint, Mile, Medium, Long, Dirt.
//
// Header (one line per round present in this race):
//   Dirt - Chukyo Dirt 1800m
//   Mile - Tokyo Turf 1800m
//   Sprint - Hanshin Turf 1400m
//   Medium - Hanshin Turf 2000m
//   Long - Fukushima Turf 2600m
//
// Entries (Name / Points / Lane, blank lines optional):
//   Oguri Cap
//   46,040 pts
//   Dirt
//
//   Fuji Kiseki
//   35,031 pts
//   Mile
//
// Output: one round per lane keyword found, with entries grouped under it.
// Lane keywords are unique per file — each of the 5 lanes appears at most
// once, so there's never ambiguity about which round an entry belongs to.
// Unrecognised track descriptions get track: null so the UI can surface a
// manual picker rather than silently dropping the round.

const LANE_KEYWORDS = ["Sprint", "Mile", "Medium", "Long", "Dirt"];

function laneFromLine(line) {
  return LANE_KEYWORDS.find(k => k.toLowerCase() === line.trim().toLowerCase()) || null;
}

function parseHeaderLine(line) {
  // Matches "Lane - track description", e.g. "Dirt - Chukyo Dirt 1800m"
  const m = line.match(/^(Sprint|Mile|Medium|Long|Dirt)\s*[-–]\s*(.+)$/i);
  if (!m) return null;
  const lane = LANE_KEYWORDS.find(k => k.toLowerCase() === m[1].toLowerCase());
  return { lane, raw: m[2].trim() };
}

function parseImportText(text) {
  const allLines = text.split("\n").map(l => l.trim());

  // ── 1. Parse header ────────────────────────────────────────────────────
  // Consume lines matching "Lane - description" at the top, skipping
  // blanks, until we hit something that isn't a header line.
  const laneMap = {}; // lane -> { raw, matched }
  let i = 0;
  while (i < allLines.length) {
    const line = allLines[i];
    if (line === "") { i++; continue; }
    const h = parseHeaderLine(line);
    if (!h) break;
    laneMap[h.lane] = { raw: h.raw, matched: matchTrackText(h.raw) };
    i++;
  }

  // ── 2. Parse entry blocks ──────────────────────────────────────────────
  // Each block is: name line / points line / lane keyword, optionally
  // blank-line separated. We consume 3 lines per block; if the 3rd line
  // isn't a lane keyword we skip forward by 1 to stay tolerant of extra
  // blank lines or stray text.
  const lines = allLines.slice(i).filter(l => l.length > 0);
  const entries = []; // { name, pts, lane }
  let j = 0;
  while (j < lines.length) {
    const name = lines[j];
    const ptsLine = lines[j + 1];
    if (ptsLine === undefined) break;
    const ptsMatch = ptsLine.replace(/,/g, "").match(/-?\d+/);
    if (!ptsMatch) { j++; continue; }
    const pts = parseInt(ptsMatch[0]);

    const laneLine = lines[j + 2];
    const lane = laneLine ? laneFromLine(laneLine) : null;
    entries.push({ name, pts, lane });
    j += lane ? 3 : 2;
  }

  // ── 3. Group into rounds ───────────────────────────────────────────────
  // Maintain first-appearance order of lanes across entries so the round
  // list mirrors the natural writing order. Entries with no recognised
  // lane go into a null bucket (shown as "unassigned" in the UI).
  const order = [];
  const byLane = {};
  entries.forEach(e => {
    const key = e.lane || "__unassigned__";
    if (!byLane[key]) { byLane[key] = []; order.push(key); }
    byLane[key].push({ name: e.name, pts: e.pts });
  });

  // Also include lanes declared in the header but with no entries yet
  // (edge case: typo'd all entry lane refs). Append them at the end so
  // the header declarations are always visible in the preview.
  LANE_KEYWORDS.forEach(lane => {
    if (laneMap[lane] && !byLane[lane]) {
      byLane[lane] = [];
      order.push(lane);
    }
  });

  const rounds = order.map(key => {
    const info = laneMap[key] || null;
    return {
      lane: key === "__unassigned__" ? null : key,
      rawTrackText: info ? info.raw : null,
      track: info && info.matched ? info.matched.track.id : null,
      matchConfidence: info && info.matched ? info.matched.confidence : null,
      results: byLane[key] || []
    };
  });

  return { laneMap, entries, rounds };
}
