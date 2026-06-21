// ─── Stats helpers ──────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 9);
}
function stddev(vals) {
  const m = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.sqrt(vals.reduce((s, v) => s + (v - m) ** 2, 0) / vals.length);
}

// Momentum: ordinary-least-squares slope of points-per-round over a
// character's most recent rounds (chronological order, oldest→newest as
// passed in). Returns null if there's not enough data for a meaningful
// trend (fewer than 3 rounds). The slope is also expressed as a % of the
// character's average score, so characters on very different point scales
// (e.g. Sprint vs Long) are comparable on the same badge scale.
const MOMENTUM_WINDOW = 8;
const MOMENTUM_MIN_RACES = 3;
function computeMomentum(scoresChronological) {
  const window = scoresChronological.slice(-MOMENTUM_WINDOW);
  const n = window.length;
  if (n < MOMENTUM_MIN_RACES) return null;

  const xs = window.map((_, i) => i);
  const xMean = xs.reduce((a, b) => a + b, 0) / n;
  const yMean = window.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - xMean) * (window[i] - yMean);
    den += (xs[i] - xMean) ** 2;
  }
  const slope = den === 0 ? 0 : num / den; // pts change per round
  const pctPerRace = yMean > 0 ? (slope / yMean) * 100 : 0;
  return { slope, pctPerRace, racesUsed: n };
}

// Flatten every race into its rounds, tagging each with the track info
// (venue/type/surface/distance) looked up from TRACK_BY_ID. Rounds with an
// unrecognized track id are skipped defensively (e.g. data from a track
// reference that's since changed) rather than crashing stats.
function flattenRounds(races) {
  const out = [];
  races.forEach(race => {
    (race.rounds || []).forEach(round => {
      const trackInfo = TRACK_BY_ID[round.track];
      if (!trackInfo) return;
      out.push({
        raceId: race.id,
        raceLabel: race.label,
        roundId: round.id,
        outcome: round.outcome,
        track: trackInfo,
        results: round.results || []
      });
    });
  });
  return out;
}

// Per-uma stats, now built from rounds instead of flat race results.
// "Wins"/"losses" come directly from each round's manual outcome toggle.
// Place (1st/2nd/3rd) ranks only the uma's own team within that round —
// the opponent's 3 results aren't tracked, so this is "best/worst of your
// own 3", not a full 6-runner field placement.
function computeStats(races) {
  const rounds = flattenRounds(races);
  const map = {};

  rounds.forEach(round => {
    const sorted = [...round.results].sort((a, b) => b.pts - a.pts);
    const ownLeaderPts = sorted[0]?.pts || 1;

    round.results.forEach(({ name, pts }) => {
      if (!map[name]) map[name] = {
        name,
        scores: [],
        ownPlaces: [],   // 1-3, rank within this uma's own team for that round
        wins: 0,
        losses: 0,
        byTrack: {},     // trackId -> { scores: [], venue, type, surface, distance }
        byType: {}       // Sprint/Mile/Medium/Long -> { scores: [] }
      };
      const m = map[name];
      const ownPlace = sorted.findIndex(r => r.name === name && r.pts === pts) + 1;

      m.scores.push(pts);
      m.ownPlaces.push(ownPlace);
      if (round.outcome === "win") m.wins++;
      else if (round.outcome === "loss") m.losses++;

      const t = round.track;
      if (!m.byTrack[t.id]) m.byTrack[t.id] = {
        scores: [], venue: t.venue, type: t.type, surface: t.surface, distance: t.distance
      };
      m.byTrack[t.id].scores.push(pts);

      if (!m.byType[t.type]) m.byType[t.type] = { scores: [] };
      m.byType[t.type].scores.push(pts);
    });
  });

  return Object.values(map).map(m => {
    const roundCount = m.scores.length;
    const decided = m.wins + m.losses;

    // Best/worst track by average score, requiring at least 2 rounds on
    // a track so a single lucky/unlucky run doesn't crown a "best track".
    // If fewer than 2 *distinct* tracks qualify, there's not enough spread
    // to meaningfully say "best" vs "worst" — both come back null rather
    // than showing the same lone qualifying track for both (which reads
    // as a bug even though the underlying number is technically correct).
    const trackEntries = Object.entries(m.byTrack)
      .map(([id, t]) => ({
        id: Number(id),
        venue: t.venue,
        type: t.type,
        surface: t.surface,
        distance: t.distance,
        roundCount: t.scores.length,
        avg: t.scores.reduce((a, b) => a + b, 0) / t.scores.length
      }));
    const qualifyingTracks = trackEntries.filter(t => t.roundCount >= 2);
    const hasEnoughSpread = qualifyingTracks.length >= 2;
    const bestTrack = hasEnoughSpread ? [...qualifyingTracks].sort((a, b) => b.avg - a.avg)[0] : null;
    const worstTrack = hasEnoughSpread ? [...qualifyingTracks].sort((a, b) => a.avg - b.avg)[0] : null;

    const typeBreakdown = Object.entries(m.byType).map(([type, t]) => ({
      type,
      roundCount: t.scores.length,
      avg: t.scores.reduce((a, b) => a + b, 0) / t.scores.length
    }));

    const sortedTypeBreakdown = typeBreakdown.sort((a, b) => b.roundCount - a.roundCount);
    const primaryType = sortedTypeBreakdown[0]?.type || null;

    return {
      name: m.name,
      scores: m.scores,
      total: m.scores.reduce((a, b) => a + b, 0),
      avg: m.scores.reduce((a, b) => a + b, 0) / roundCount,
      best: Math.max(...m.scores),
      worst: Math.min(...m.scores),
      range: Math.max(...m.scores) - Math.min(...m.scores),
      sigma: roundCount > 1 ? stddev(m.scores) : 0,
      avgOwnPlace: m.ownPlaces.reduce((a, b) => a + b, 0) / roundCount,
      roundCount,
      wins: m.wins,
      losses: m.losses,
      decided,
      winRate: decided > 0 ? m.wins / decided : 0,
      bestTrack,
      worstTrack,
      // primaryType: the distance category this uma has run most often,
      // used wherever a single type-color is needed (avatar fallback,
      // pill) now that an uma's rounds can span multiple types.
      primaryType,
      trackBreakdown: trackEntries.sort((a, b) => b.roundCount - a.roundCount),
      typeBreakdown: sortedTypeBreakdown
    };
  });
}
