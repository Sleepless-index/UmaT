// ─── Atoms: Pill, MomentumBadge, Medal, StatBox ────────────────────────────
function Pill({
  type
}) {
  const c = TYPE_COLOR[type] || "#888";
  return /*#__PURE__*/React.createElement("span", {
    style: {
      background: TYPE_GLOW[type] || "#ffffff11",
      color: c,
      border: `1px solid ${c}44`,
      borderRadius: 5,
      padding: "2px 7px",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.05em",
      whiteSpace: "nowrap"
    }
  }, type);
}
// Momentum badge: shows whether a character's recent scores are trending
// up, down, or flat, based on the linear-regression slope from
// computeMomentum(). Renders nothing if there isn't enough race history
// yet for a meaningful trend.
const MOMENTUM_FLAT_THRESHOLD = 2; // % per race; below this magnitude counts as flat
function MomentumBadge({ momentum }) {
  if (!momentum) return null;
  const { pctPerRace } = momentum;
  let dir, color, label;
  if (pctPerRace > MOMENTUM_FLAT_THRESHOLD) {
    dir = "arrowUp"; color = "#34d399"; label = "Rising";
  } else if (pctPerRace < -MOMENTUM_FLAT_THRESHOLD) {
    dir = "arrowDown"; color = "#f87171"; label = "Falling";
  } else {
    dir = "minus"; color = C.muted; label = "Flat";
  }
  const sign = pctPerRace > 0 ? "+" : "";
  return /*#__PURE__*/React.createElement("span", {
    title: `${label}: ${sign}${pctPerRace.toFixed(1)}% per race over last ${momentum.racesUsed} races`,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 3,
      background: color + "1a",
      color,
      border: `1px solid ${color}44`,
      borderRadius: 5,
      padding: "2px 6px 2px 5px",
      fontSize: 9.5,
      fontWeight: 800,
      letterSpacing: "0.02em",
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement(Icon, { name: dir, size: 10, strokeWidth: 3 }),
     `${sign}${pctPerRace.toFixed(1)}%`);
}
const MEDAL_COLOR = {
  1: "#fbbf24",
  2: "#cbd5e1",
  3: "#d97706"
};
function Medal({
  pos
}) {
  if (pos <= 3) return /*#__PURE__*/React.createElement("span", {
    key: pos,
    className: "anim-pop",
    style: {
      display: "inline-flex",
      filter: `drop-shadow(0 0 4px ${MEDAL_COLOR[pos]}66)`
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "award",
    size: 17,
    color: MEDAL_COLOR[pos],
    strokeWidth: 2.2
  }));
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: C.muted,
      fontWeight: 700,
      minWidth: 18,
      display: "inline-block",
      textAlign: "center"
    }
  }, "#", pos);
}
function StatBox({
  label,
  value,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.faint,
      borderRadius: 8,
      padding: "9px 10px",
      border: `1px solid ${C.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.muted,
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      fontWeight: 700,
      marginBottom: 3
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      color: color || C.text
    }
  }, value));
}
function RankBadge({
  rank
}) {
  if (!rank) return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      textAlign: "center",
      color: C.border2,
      fontSize: 11,
      fontWeight: 700
    }
  }, "–");
  if (rank <= 3) return /*#__PURE__*/React.createElement("span", {
    key: rank,
    className: "anim-pop",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "award",
    size: 16,
    color: MEDAL_COLOR[rank],
    strokeWidth: 2.2
  }));
  return /*#__PURE__*/React.createElement("span", {
    key: rank,
    className: "anim-pop",
    style: {
      display: "block",
      textAlign: "center",
      color: C.muted,
      fontSize: 11,
      fontWeight: 800
    }
  }, "#", rank);
}
