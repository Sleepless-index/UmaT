// ─── Import text parsing (round/track aware) ───────────────────────────────
// Replaces the old flat parsePasteText. A pasted block can optionally start
// with a header section mapping short labels to tracks:
//
//   Track A: Chukyo 1800m Dirt
//   Track B: Hanshin 1400m Turf
//
//   Maruzensky
//   1331386 pts
//   Track A
//
//   Mejiro Ardan
//   1224278 pts
//   Track A
//
// The 3rd line of each entry block is the label from the header. If no
// header is present, the 3rd line can instead be a track description
// directly (handy for a single-round paste, where a label adds nothing) —
// e.g. "Chukyo 1800m Dirt" right there in the block.
//
// Header lines are recognized as "<label>: <description>" where label has
// no colon itself; this only kicks in before any blank-line-separated
// entry blocks start, so "Track A:" inside what's clearly entry data won't
// be misread (entry blocks are always exactly name / pts / track-ref).

function parseHeaderLine(line) {
  const m = line.match(/^([^:]{1,20}):\s*(.+)$/);
  if (!m) return null;
  return { label: m[1].trim(), raw: m[2].trim() };
}

function parseImportText(text) {
  const allLines = text.split("\n").map(l => l.trim());
  const trackLabels = {}; // label -> { raw, matched }

  // Consume leading header lines (label: description), skipping blank
  // lines between them, until we hit something that isn't a header line.
  let i = 0;
  while (i < allLines.length) {
    const line = allLines[i];
    if (line === "") { i++; continue; }
    const header = parseHeaderLine(line);
    if (!header) break;
    trackLabels[header.label] = { raw: header.raw, matched: matchTrackText(header.raw) };
    i++;
  }

  // Remaining lines are entry blocks: name / points / track-ref, optionally
  // blank-line separated (same tolerant parsing as the old format).
  const lines = allLines.slice(i).filter(l => l.length > 0);
  const entries = [];
  let j = 0;
  while (j < lines.length) {
    const name = lines[j];
    const ptsLine = lines[j + 1];
    if (ptsLine === undefined) break;
    const ptsMatch = ptsLine.replace(/,/g, "").match(/-?\d+/);
    if (!ptsMatch) { j++; continue; }
    const pts = parseInt(ptsMatch[0]);

    const refLine = lines[j + 2];
    let label = null;
    let consumed = 2;
    if (refLine !== undefined) {
      if (trackLabels[refLine]) {
        // References a header label directly.
        label = refLine;
        consumed = 3;
      } else {
        // No header defined this label — try reading it as an inline
        // track description (the no-header single-round shorthand).
        const inline = matchTrackText(refLine);
        if (inline) {
          // Synthesize a label from the raw text so identical inline
          // descriptions across entries group into the same round.
          label = `__inline__${refLine}`;
          if (!trackLabels[label]) trackLabels[label] = { raw: refLine, matched: inline };
          consumed = 3;
        }
      }
    }
    entries.push({ name, pts, label });
    j += consumed;
  }

  // Group entries into rounds by label, in first-appearance order.
  // Entries with no resolvable label (no header reference, no inline
  // match) go into a final "Unassigned" bucket so nothing is silently
  // dropped — the caller can surface these for manual fixing.
  const order = [];
  const byLabel = {};
  entries.forEach(e => {
    const key = e.label || "__unassigned__";
    if (!byLabel[key]) { byLabel[key] = []; order.push(key); }
    byLabel[key].push({ name: e.name, pts: e.pts });
  });

  const rounds = order.map(key => {
    const info = trackLabels[key];
    return {
      label: key === "__unassigned__" ? null : (info ? (key.startsWith("__inline__") ? info.raw : key) : key),
      rawTrackText: info ? info.raw : null,
      track: info && info.matched ? info.matched.track.id : null,
      matchConfidence: info && info.matched ? info.matched.confidence : null,
      results: byLabel[key]
    };
  });

  return { trackLabels, entries, rounds };
}
