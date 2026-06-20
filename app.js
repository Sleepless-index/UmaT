const {
  useState,
  useEffect,
  useMemo
} = React;

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
const TYPE_COLOR = {
  Sprint: "#f472b6",
  // pink
  Mile: "#818cf8",
  // indigo
  Medium: "#34d399",
  // emerald
  Long: "#38bdf8",
  // sky
  Dirt: "#fbbf24" // amber
};
const TYPE_GLOW = {
  Sprint: "#f472b622",
  Mile: "#818cf822",
  Medium: "#34d39922",
  Long: "#38bdf822",
  Dirt: "#fbbf2422"
};
const TYPES = ["Sprint", "Mile", "Medium", "Long", "Dirt"];

// ─── Icon set (inline SVG, no emoji) ───────────────────────────────────────
const ICONS = {
  trophy: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 22h16"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 2H6v7a6 6 0 0 0 12 0V2Z"
  })),
  skull: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "12",
    r: "1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "15",
    cy: "12",
    r: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 20v2h8v-2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12.5 17h-1a6.97 6.97 0 0 1-5.16-2.6A6.97 6.97 0 0 1 5 10a7 7 0 0 1 14 0 6.97 6.97 0 0 1-2.34 5.4A6.97 6.97 0 0 1 13.5 17Z"
  })),
  "trending-up": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polyline", {
    points: "22 7 13.5 15.5 8.5 10.5 2 17"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "16 7 22 7 22 13"
  })),
  flag: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "4",
    y1: "22",
    x2: "4",
    y2: "15"
  })),
  user: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "7",
    r: "4"
  })),
  settings: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  })),
  plus: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14"
  })),
  x: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m6 6 12 12"
  })),
  pencil: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .622.622l4.353-1.321a2 2 0 0 0 .83-.497z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m15 5 4 4"
  })),
  trash: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M3 6h18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "10",
    y1: "11",
    x2: "10",
    y2: "17"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "14",
    y1: "11",
    x2: "14",
    y2: "17"
  })),
  download: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "7 10 12 15 17 10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "15",
    x2: "12",
    y2: "3"
  })),
  upload: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "17 8 12 3 7 8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "3",
    x2: "12",
    y2: "15"
  })),
  chevronDown: /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }),
  chevronUp: /*#__PURE__*/React.createElement("path", {
    d: "m18 15-6-6-6 6"
  }),
  arrowUp: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "m5 12 7-7 7 7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 19V5"
  })),
  arrowDown: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m19 12-7 7-7-7"
  })),
  target: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "2"
  })),
  zap: /*#__PURE__*/React.createElement("path", {
    d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
  }),
  award: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "8",
    r: "6"
  })),
  alertTriangle: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 9v4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 17h.01"
  })),
  checkCircle: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M21.801 10A10 10 0 1 1 17 3.335"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m9 11 3 3L22 4"
  })),
  barChart: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M3 3v18h18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 17V9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13 17V5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 17v-3"
  })),
  loader: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 2v4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m16.2 7.8 2.9-2.9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 12h4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m16.2 16.2 2.9 2.9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 18v4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m4.9 19.1 2.9-2.9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2 12h4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m4.9 4.9 2.9 2.9"
  })),
  eye: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }))
};
function Icon({
  name,
  size = 16,
  color = "currentColor",
  strokeWidth = 2,
  style,
  className
}) {
  const path = ICONS[name];
  if (!path) return null;
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      display: "block",
      flexShrink: 0,
      ...style
    },
    className: className
  }, path);
}


// ─── Uma Avatar ──────────────────────────────────────────────────────────────
// Name format: "T.M. Opera O" (base) or "T.M. Opera O [New Year, Same Radiance!]" (alt)
// Slug: strip punctuation except spaces/brackets, split on bracket, join with "_".
// T.M. Opera O                        → TM_Opera_O.webp
// T.M. Opera O [New Year, Same Radiance!] → TM_Opera_O_New_Year_Same_Radiance.webp
function umaSlug(name) {
  const bracketMatch = name.match(/^([^\[]+)\[([^\]]+)\]/);
  function sanitizePart(str) {
    return str
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, '') // strip punctuation (dots, commas, !, apostrophes…)
      .trim()
      .replace(/\s+/g, '_');
  }
  if (bracketMatch) {
    const base = sanitizePart(bracketMatch[1]);
    const sub  = sanitizePart(bracketMatch[2]);
    return `${base}_${sub}`;
  }
  return sanitizePart(name);
}

function UmaAvatar({ name, type, size = 28 }) {
  const [err, setErr] = useState(false);
  const slug = umaSlug(name);
  const tc = TYPE_COLOR[type] || C.accent;
  const initial = name.trim()[0]?.toUpperCase() || '?';
  const borderRadius = Math.round(size * 0.28);

  if (!err) {
    return /*#__PURE__*/React.createElement("img", {
      src: `icons/${slug}.webp`,
      alt: name,
      onError: () => setErr(true),
      style: {
        width: size,
        height: size,
        borderRadius,
        objectFit: "cover",
        objectPosition: "center",
        flexShrink: 0,
        background: C.faint,
        display: "block"
      }
    });
  }
  // Letter fallback
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius,
      flexShrink: 0,
      background: tc + "22",
      border: `1.5px solid ${tc}55`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: Math.round(size * 0.44),
      fontWeight: 800,
      color: tc,
      letterSpacing: "-0.01em",
      userSelect: "none"
    }
  }, initial);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 9);
}
function stddev(vals) {
  const m = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.sqrt(vals.reduce((s, v) => s + (v - m) ** 2, 0) / vals.length);
}
function computeStats(races) {
  const map = {};
  races.forEach(race => {
    const leaderPts = race.results[0]?.pts || 1;
    race.results.forEach(({
      name,
      pts,
      type
    }, i) => {
      if (!map[name]) map[name] = {
        name,
        type,
        scores: [],
        places: [],
        wins: 0,
        podiums: 0,
        top5: 0,
        last: 0,
        gaps: []
      };
      const m = map[name];
      m.scores.push(pts);
      m.places.push(i + 1);
      m.gaps.push(leaderPts > 0 ? (leaderPts - pts) / leaderPts * 100 : 0);
      if (i === 0) m.wins++;
      if (i < 3) m.podiums++;
      if (i < 5) m.top5++;
      if (i === race.results.length - 1) m.last++;
    });
  });
  return Object.values(map).map(m => ({
    ...m,
    total: m.scores.reduce((a, b) => a + b, 0),
    avg: m.scores.reduce((a, b) => a + b, 0) / m.scores.length,
    best: Math.max(...m.scores),
    worst: Math.min(...m.scores),
    range: Math.max(...m.scores) - Math.min(...m.scores),
    sigma: m.scores.length > 1 ? stddev(m.places) : 0,
    avgPlace: m.places.reduce((a, b) => a + b, 0) / m.places.length,
    raceCount: m.scores.length,
    winRate: m.wins / m.scores.length,
    avgGap: m.gaps.reduce((a, b) => a + b, 0) / m.gaps.length,
    bestGap: Math.min(...m.gaps)
  }));
}

// ─── Atoms ───────────────────────────────────────────────────────────────────
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

// ─── Sort dropdown ────────────────────────────────────────────────────────────
const SORT_OPTS = [{
  k: "total",
  label: "Total Points"
}, {
  k: "winRate",
  label: "Win Rate"
}, {
  k: "avgGap",
  label: "Gap to Leader",
  asc: true
}, {
  k: "sigma",
  label: "Consistency",
  asc: true
}];
function SortDropdown({
  sort,
  dir,
  onSort
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: sort,
    onChange: e => {
      const opt = SORT_OPTS.find(o => o.k === e.target.value);
      onSort(opt.k, opt.asc ? 1 : -1);
    },
    style: {
      width: "100%",
      appearance: "none",
      WebkitAppearance: "none",
      background: C.faint,
      border: `1px solid ${C.border2}`,
      borderRadius: 10,
      color: C.text,
      padding: "9px 30px 9px 13px",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      outline: "none",
      letterSpacing: "0.02em"
    }
  }, SORT_OPTS.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.k,
    value: o.k
  }, "Sort: ", o.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 11,
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      color: C.muted
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronDown",
    size: 13
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => onSort(sort, -dir),
    title: "Reverse order",
    className: "tap",
    style: {
      flexShrink: 0,
      width: 38,
      height: 38,
      borderRadius: 10,
      background: C.faint,
      border: `1px solid ${C.border2}`,
      color: C.accent,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: dir === 1 ? "arrowUp" : "arrowDown",
    size: 15,
    strokeWidth: 2.4
  })));
}

// ─── Type filter dropdown ──────────────────────────────────────────────────────
function TypeFilterDropdown({
  active,
  onChange
}) {
  const opts = ["All", ...TYPES];
  const tc = active === "All" ? C.accent : TYPE_COLOR[active] || C.accent;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: active,
    onChange: e => onChange(e.target.value),
    style: {
      width: "100%",
      appearance: "none",
      WebkitAppearance: "none",
      background: C.faint,
      border: `1px solid ${active === "All" ? C.border2 : tc + "66"}`,
      borderRadius: 10,
      color: active === "All" ? C.text : tc,
      padding: "9px 30px 9px 13px",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      outline: "none",
      letterSpacing: "0.02em"
    }
  }, opts.map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, t === "All" ? "All Types" : t))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 11,
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      color: active === "All" ? C.muted : tc
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronDown",
    size: 13
  })));
}

// ─── Tab: Standings ──────────────────────────────────────────────────────────
function StandingsTab({
  stats
}) {
  const [sort, setSort] = useState("total");
  const [dir, setDir] = useState(-1);
  const [expanded, setExpanded] = useState(null);
  const [typeFilter, setTypeFilter] = useState("All");
  const filtered = useMemo(() => typeFilter === "All" ? stats : stats.filter(s => s.type === typeFilter), [stats, typeFilter]);
  const sorted = useMemo(() => [...filtered].sort((a, b) => dir * (a[sort] - b[sort])), [filtered, sort, dir]);
  const maxTotal = sorted[0]?.total || 1;
  function handleSort(k, defaultDir) {
    if (sort === k) setDir(d => -d);else {
      setSort(k);
      setDir(defaultDir || -1);
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(TypeFilterDropdown, {
    active: typeFilter,
    onChange: setTypeFilter
  }), /*#__PURE__*/React.createElement(SortDropdown, {
    sort: sort,
    dir: dir,
    onSort: handleSort
  })), sorted.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "40px 20px",
      color: C.muted,
      fontSize: 13
    }
  }, "No ", typeFilter.toLowerCase(), " competitors yet"), sorted.map((s, i) => {
    const isOpen = expanded === s.name;
    const tc = TYPE_COLOR[s.type] || C.accent;
    const barPct = s.total / maxTotal * 100;
    return /*#__PURE__*/React.createElement("div", {
      key: s.name,
      onClick: () => setExpanded(isOpen ? null : s.name),
      className: "anim-slide row-hover",
      style: {
        background: C.card,
        border: `1px solid ${isOpen ? C.accent : C.border}`,
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: isOpen ? `0 0 0 1px ${C.accent}33,0 4px 20px #00000044` : "none",
        transition: "border-color 0.15s, box-shadow 0.15s",
        animationDelay: `${Math.min(i, 10) * 30}ms`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "13px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 28,
        flexShrink: 0,
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement(Medal, {
      pos: i + 1
    })), /*#__PURE__*/React.createElement(UmaAvatar, {
      name: s.name,
      type: s.type,
      size: 42
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        marginBottom: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 800,
        fontSize: 14,
        color: C.text,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, s.name), /*#__PURE__*/React.createElement(Pill, {
      type: s.type
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 4,
        background: C.faint,
        borderRadius: 2,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "bar-grow",
      style: {
        width: `${barPct}%`,
        height: "100%",
        borderRadius: 2,
        background: `linear-gradient(90deg,${tc}99,${tc})`
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right",
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 17,
        fontWeight: 900,
        color: tc,
        letterSpacing: "-0.01em"
      }
    }, s.total.toLocaleString()), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: C.muted
      }
    }, s.raceCount, " races")), /*#__PURE__*/React.createElement("div", {
      className: "chev",
      style: {
        color: C.border2,
        flexShrink: 0,
        transform: isOpen ? "rotate(180deg)" : "none"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevronDown",
      size: 15
    }))), isOpen && /*#__PURE__*/React.createElement("div", {
      className: "anim-expand",
      style: {
        borderTop: `1px solid ${C.border}`,
        padding: "12px 14px",
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 7
      }
    }, /*#__PURE__*/React.createElement(StatBox, {
      label: "Wins",
      value: s.wins,
      color: "#fbbf24"
    }), /*#__PURE__*/React.createElement(StatBox, {
      label: "Win Rate",
      value: `${(s.winRate * 100).toFixed(0)}%`,
      color: s.winRate >= 0.3 ? "#34d399" : s.winRate >= 0.1 ? "#38bdf8" : C.muted
    }), /*#__PURE__*/React.createElement(StatBox, {
      label: "Podiums",
      value: `${s.podiums}/${s.raceCount}`,
      color: "#a78bfa"
    }), /*#__PURE__*/React.createElement(StatBox, {
      label: "Top 5",
      value: `${s.top5}/${s.raceCount}`,
      color: "#38bdf8"
    }), /*#__PURE__*/React.createElement(StatBox, {
      label: "Avg Place",
      value: s.avgPlace.toFixed(1),
      color: s.avgPlace <= 4 ? "#34d399" : s.avgPlace >= 10 ? "#f87171" : C.muted
    }), /*#__PURE__*/React.createElement(StatBox, {
      label: "Avg Gap",
      value: `${s.avgGap.toFixed(1)}%`,
      color: s.avgGap <= 2 ? "#34d399" : s.avgGap <= 10 ? "#38bdf8" : s.avgGap <= 20 ? "#fbbf24" : "#f87171"
    }), /*#__PURE__*/React.createElement(StatBox, {
      label: "Peak",
      value: s.best.toLocaleString(),
      color: C.accent
    }), /*#__PURE__*/React.createElement(StatBox, {
      label: "Worst",
      value: s.worst.toLocaleString(),
      color: "#f87171"
    }), /*#__PURE__*/React.createElement(StatBox, {
      label: "Avg Score",
      value: Math.round(s.avg).toLocaleString(),
      color: C.text
    }), /*#__PURE__*/React.createElement(StatBox, {
      label: "Volatility",
      value: s.range.toLocaleString(),
      color: "#fbbf24"
    }), /*#__PURE__*/React.createElement(StatBox, {
      label: "Consistency",
      value: `σ ${s.sigma.toFixed(2)}`,
      color: s.sigma < 2 ? "#34d399" : s.sigma < 3.5 ? "#38bdf8" : s.sigma < 4.5 ? "#fbbf24" : "#f87171"
    })));
  }));
}

// ─── Tab: Trends ─────────────────────────────────────────────────────────────
function TrendsTab({
  stats,
  races
}) {
  const [focus, setFocus] = useState(null);
  const sorted = useMemo(() => [...stats].sort((a, b) => b.total - a.total), [stats]);
  const allNames = sorted.map(s => s.name);
  const display = focus ? [focus] : allNames;
  const maxPts = useMemo(() => Math.max(...races.flatMap(r => r.results.map(e => e.pts)), 1), [races]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: focus || "",
    onChange: e => setFocus(e.target.value || null),
    style: {
      width: "100%",
      appearance: "none",
      WebkitAppearance: "none",
      background: C.faint,
      border: `1px solid ${focus ? (TYPE_COLOR[sorted.find(s => s.name === focus)?.type] || C.accent) + "66" : C.border2}`,
      borderRadius: 10,
      color: focus ? TYPE_COLOR[sorted.find(s => s.name === focus)?.type] || C.accent : C.text,
      padding: "9px 30px 9px 13px",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      outline: "none",
      letterSpacing: "0.02em"
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "All Competitors"), allNames.map(n => /*#__PURE__*/React.createElement("option", {
    key: n,
    value: n
  }, n))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 11,
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      color: focus ? TYPE_COLOR[sorted.find(s => s.name === focus)?.type] || C.accent : C.muted
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronDown",
    size: 13
  })))), display.map((name, idx) => {
    const s = sorted.find(x => x.name === name);
    if (!s) return null;
    const tc = TYPE_COLOR[s.type] || C.accent;
    const scoresByRace = races.map(r => r.results.find(e => e.name === name)?.pts ?? null);
    return /*#__PURE__*/React.createElement("div", {
      key: name,
      className: "anim-slide",
      style: {
        animationDelay: `${Math.min(idx, 12) * 30}ms`,
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "14px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(UmaAvatar, {
      name: name,
      type: s.type,
      size: 40
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 800,
        fontSize: 14,
        color: C.text
      }
    }, name), /*#__PURE__*/React.createElement(Pill, {
      type: s.type
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: C.muted
      }
    }, "avg "), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 800,
        color: tc
      }
    }, Math.round(s.avg).toLocaleString()))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 3,
        alignItems: "flex-end",
        height: 56
      }
    }, scoresByRace.map((pts, i) => {
      if (pts === null) return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          flex: 1,
          height: 5,
          background: C.faint,
          borderRadius: 2,
          alignSelf: "flex-end"
        }
      });
      const h = Math.max(5, Math.round(pts / maxPts * 56));
      const isPeak = pts === s.best;
      const isWorst = pts === s.worst;
      const barColor = isPeak ? tc : isWorst ? "#374151" : tc + "55";
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          flex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          position: "relative"
        }
      }, isPeak && /*#__PURE__*/React.createElement("div", {
        style: {
          position: "absolute",
          top: -2,
          color: tc,
          lineHeight: 1
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "arrowUp",
        size: 9,
        strokeWidth: 3
      })), isWorst && /*#__PURE__*/React.createElement("div", {
        style: {
          position: "absolute",
          top: -2,
          color: "#f87171",
          lineHeight: 1
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "arrowDown",
        size: 9,
        strokeWidth: 3
      })), /*#__PURE__*/React.createElement("div", {
        className: "bar-grow-v",
        style: {
          width: "100%",
          height: h,
          background: barColor,
          borderRadius: "2px 2px 0 0",
          animationDelay: `${i * 15}ms`,
          boxShadow: isPeak ? `0 0 8px ${tc}88` : undefined
        }
      }));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 3,
        marginTop: 4
      }
    }, races.map((_, i) => {
      const skip = races.length > 20 ? 5 : races.length > 10 ? 2 : 1;
      const show = i === 0 || i === races.length - 1 || (i + 1) % skip === 0;
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          flex: 1,
          textAlign: "center",
          fontSize: 8,
          color: show ? C.muted : "transparent",
          overflow: "hidden"
        }
      }, "R", i + 1);
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 10,
        marginTop: 10,
        paddingTop: 10,
        borderTop: `1px solid ${C.border}`
      }
    }, [["Peak", s.best.toLocaleString(), tc], ["Win Rate", `${(s.winRate * 100).toFixed(0)}%`, s.winRate >= 0.3 ? "#34d399" : s.winRate >= 0.1 ? "#38bdf8" : C.muted], ["Avg Gap", `${s.avgGap.toFixed(1)}%`, s.avgGap <= 2 ? "#34d399" : s.avgGap <= 10 ? "#38bdf8" : s.avgGap <= 20 ? "#fbbf24" : "#f87171"], ["Low", s.worst.toLocaleString(), "#f87171"], ["Wins", s.wins, "#fbbf24"], ["Podiums", s.podiums, "#a78bfa"]].map(([l, v, clr]) => /*#__PURE__*/React.createElement("div", {
      key: l
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: C.muted,
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }
    }, l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 800,
        color: clr
      }
    }, v)))));
  }));
}

// ─── Tab: Races ───────────────────────────────────────────────────────────────
const RACES_PAGE_SIZE = 20;

// Swipeable race row - swipe left to reveal delete
function SwipeableRaceRow({ race, index, onView, onEdit, onDelete, editMode }) {
  const [swipeX, setSwipeX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const startX = React.useRef(null);
  const DELETE_THRESHOLD = 80;
  const isWin = race.outcome !== "loss";
  const totalPts = race.results.reduce((s, e) => s + e.pts, 0);

  function onTouchStart(e) {
    startX.current = e.touches[0].clientX;
    setSwiping(true);
    setConfirmed(false);
  }
  function onTouchMove(e) {
    if (startX.current === null) return;
    const dx = e.touches[0].clientX - startX.current;
    if (dx > 0) { setSwipeX(0); return; } // block right swipe
    setSwipeX(Math.max(dx, -120));
  }
  function onTouchEnd() {
    setSwiping(false);
    if (swipeX <= -DELETE_THRESHOLD) {
      setSwipeX(-88); // snap open to reveal button
    } else {
      setSwipeX(0);
    }
    startX.current = null;
  }
  function handleDelete() {
    if (confirmed) {
      onDelete(race.id);
    } else {
      setConfirmed(true);
    }
  }
  function closeSwipe() {
    setSwipeX(0);
    setConfirmed(false);
  }

  return /*#__PURE__*/React.createElement("div", {
    style: { position: "relative", borderRadius: 11, overflow: "hidden" }
  },
  // Delete button behind the row
  /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 0, top: 0, bottom: 0,
      width: 88,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: confirmed ? "#ef4444" : "#ef444422",
      borderRadius: 11,
      transition: "background 0.15s"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleDelete,
    style: {
      background: "transparent",
      border: "none",
      color: confirmed ? "#fff" : "#ef4444",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      fontSize: 10,
      fontWeight: 800
    }
  }, /*#__PURE__*/React.createElement(Icon, { name: "trash", size: 18, color: confirmed ? "#fff" : "#ef4444" }),
     confirmed ? "Sure?" : "Delete")),
  // Row itself
  /*#__PURE__*/React.createElement("div", {
    className: "anim-slide",
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    style: {
      animationDelay: `${Math.min(index, 10) * 30}ms`,
      background: C.card,
      border: `1px solid ${swipeX < -20 ? "#ef444444" : C.border}`,
      borderRadius: 11,
      padding: "13px 14px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      transform: `translateX(${swipeX}px)`,
      transition: swiping ? "none" : "transform 0.25s cubic-bezier(.2,.8,.2,1), border-color 0.15s",
      position: "relative",
      zIndex: 1
    }
  },
  // tap-away to close swipe
  swipeX < 0 && /*#__PURE__*/React.createElement("div", {
    onClick: closeSwipe,
    style: { position: "fixed", inset: 0, zIndex: 0 }
  }),
  /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32, height: 32, borderRadius: 8,
      background: C.faint,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 900, fontSize: 13, color: C.accent, flexShrink: 0
    }
  }, index + 1),
  /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
    /*#__PURE__*/React.createElement("div", {
      style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }
    },
      /*#__PURE__*/React.createElement("span", {
        style: { fontWeight: 800, color: C.text, fontSize: 14 }
      }, race.label),
      /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 5,
          letterSpacing: "0.06em", textTransform: "uppercase",
          background: isWin ? "#34d39922" : "#f8717122",
          color: isWin ? "#34d399" : "#f87171",
          border: `1px solid ${isWin ? "#34d39944" : "#f8717144"}`
        }
      }, isWin ? "Win" : "Loss")
    ),
    /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 12, color: C.muted, display: "flex", alignItems: "center", gap: 4 }
    },
      /*#__PURE__*/React.createElement(Icon, { name: "barChart", size: 12, color: C.accent }),
      /*#__PURE__*/React.createElement("span", { style: { color: C.accent, fontWeight: 700 } }, totalPts.toLocaleString()),
      /*#__PURE__*/React.createElement("span", { style: { color: C.muted } }, "total pts")
    )
  ),
  /*#__PURE__*/React.createElement("button", {
    onClick: () => onView(race),
    title: "View",
    className: "tap",
    style: {
      background: C.faint, border: `1px solid ${C.border2}`, color: C.muted,
      width: 32, height: 32, borderRadius: 7, cursor: "pointer",
      flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, { name: "eye", size: 14 })),
  editMode && /*#__PURE__*/React.createElement("button", {
    onClick: () => onEdit(race),
    title: "Edit",
    className: "tap",
    style: {
      background: C.faint, border: `1px solid ${C.border2}`, color: C.accent,
      width: 32, height: 32, borderRadius: 7, cursor: "pointer",
      flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, { name: "pencil", size: 14 }))
  ));
}

function RacesTab({
  races,
  onDelete,
  onView,
  onEdit
}) {
  const [editMode, setEditMode] = useState(false);
  const [page, setPage] = useState(0);
  const winCount = races.filter(r => r.outcome === "win").length;
  const lossCount = races.filter(r => r.outcome === "loss").length;
  const pageCount = Math.max(1, Math.ceil(races.length / RACES_PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageStart = safePage * RACES_PAGE_SIZE;
  const pageRaces = races.slice(pageStart, pageStart + RACES_PAGE_SIZE);
  function goPage(p) {
    setPage(Math.max(0, Math.min(pageCount - 1, p)));
  }
  return /*#__PURE__*/React.createElement("div", null,
    races.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }
    },
      /*#__PURE__*/React.createElement("div", {
        className: "anim-pop",
        style: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }
      },
        /*#__PURE__*/React.createElement("div", { style: { width: 34, height: 34, borderRadius: 9, background: "#34d39922", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
          /*#__PURE__*/React.createElement(Icon, { name: "trophy", size: 17, color: "#34d399" })
        ),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("div", { style: { fontSize: 18, fontWeight: 900, color: "#34d399", lineHeight: 1 } }, winCount),
          /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" } }, "Wins")
        )
      ),
      /*#__PURE__*/React.createElement("div", {
        className: "anim-pop",
        style: { animationDelay: "40ms", background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }
      },
        /*#__PURE__*/React.createElement("div", { style: { width: 34, height: 34, borderRadius: 9, background: "#f8717122", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
          /*#__PURE__*/React.createElement(Icon, { name: "skull", size: 17, color: "#f87171" })
        ),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("div", { style: { fontSize: 18, fontWeight: 900, color: "#f87171", lineHeight: 1 } }, lossCount),
          /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" } }, "Losses")
        )
      )
    ),
    /*#__PURE__*/React.createElement("div", {
      style: { marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }
    },
      /*#__PURE__*/React.createElement("span", { style: { fontSize: 13, color: C.muted } },
        races.length, " race", races.length !== 1 ? "s" : "", " recorded"
      ),
      races.length > 0 && /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
        /*#__PURE__*/React.createElement("span", { style: { fontSize: 11, color: C.muted } }, "\u2190 swipe to delete"),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => setEditMode(e => !e),
          className: "tap",
          style: {
            background: editMode ? C.accent + "22" : C.faint,
            border: `1px solid ${editMode ? C.accent + "66" : C.border2}`,
            color: editMode ? C.accent : C.muted,
            borderRadius: 8, padding: "6px 12px", cursor: "pointer",
            fontSize: 11.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 6
          }
        }, /*#__PURE__*/React.createElement(Icon, { name: "pencil", size: 13 }), " ", editMode ? "Done" : "Edit")
      )
    ),
    races.length === 0 && /*#__PURE__*/React.createElement("div", {
      className: "anim-fade",
      style: { textAlign: "center", padding: "48px 20px" }
    },
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "center", marginBottom: 10, color: C.border2 } },
        /*#__PURE__*/React.createElement(Icon, { name: "flag", size: 40, strokeWidth: 1.6 })
      ),
      /*#__PURE__*/React.createElement("div", { style: { fontWeight: 700, color: C.muted, fontSize: 15 } }, "No races yet"),
      /*#__PURE__*/React.createElement("div", { style: { fontSize: 12, color: C.muted, marginTop: 4 } }, "Tap + to add your first race")
    ),
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
      pageRaces.map((race, pi) => /*#__PURE__*/React.createElement(SwipeableRaceRow, {
        key: race.id,
        race,
        index: pageStart + pi,
        onView,
        onEdit,
        onDelete,
        editMode
      }))
    ),
    pageCount > 1 && /*#__PURE__*/React.createElement("div", {
      style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16 }
    },
      /*#__PURE__*/React.createElement("button", {
        onClick: () => goPage(safePage - 1), disabled: safePage === 0, className: "tap",
        style: { width: 32, height: 32, borderRadius: 8, background: C.faint, border: `1px solid ${C.border2}`, color: safePage === 0 ? C.border2 : C.muted, cursor: safePage === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }
      }, /*#__PURE__*/React.createElement(Icon, { name: "chevronUp", size: 14, style: { transform: "rotate(-90deg)" } })),
      Array.from({ length: pageCount }, (_, p) => p).map(p => /*#__PURE__*/React.createElement("button", {
        key: p, onClick: () => goPage(p), className: "tap",
        style: { minWidth: 32, height: 32, padding: "0 8px", borderRadius: 8, background: p === safePage ? C.accent : C.faint, border: `1px solid ${p === safePage ? C.accent : C.border2}`, color: p === safePage ? "#fff" : C.muted, fontWeight: 700, fontSize: 12, cursor: "pointer" }
      }, p + 1)),
      /*#__PURE__*/React.createElement("button", {
        onClick: () => goPage(safePage + 1), disabled: safePage === pageCount - 1, className: "tap",
        style: { width: 32, height: 32, borderRadius: 8, background: C.faint, border: `1px solid ${C.border2}`, color: safePage === pageCount - 1 ? C.border2 : C.muted, cursor: safePage === pageCount - 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }
      }, /*#__PURE__*/React.createElement(Icon, { name: "chevronUp", size: 14, style: { transform: "rotate(90deg)" } }))
    )
  );
}
const CLASS_INFO = {
  1: {
    label: "Class 1",
    color: "#f87171"
  },
  2: {
    label: "Class 2",
    color: "#fb923c"
  },
  3: {
    label: "Class 3",
    color: "#fbbf24"
  },
  4: {
    label: "Class 4",
    color: "#a3e635"
  },
  5: {
    label: "Class 5",
    color: "#38bdf8"
  },
  6: {
    label: "Class 6",
    color: "#a78bfa"
  }
};
function ProfileTab({
  races,
  stats,
  trialClass,
  setTrialClass
}) {
  const wins = races.filter(r => r.outcome === "win").length;
  const losses = races.filter(r => r.outcome === "loss").length;
  const winRate = races.length ? wins / races.length : 0;
  const totalPoints = races.reduce((sum, r) => sum + r.results.reduce((s, e) => s + e.pts, 0), 0);
  const avgFieldTotal = races.length ? totalPoints / races.length : 0;

  // Average winning margin: leader pts minus 2nd place pts, as %
  const margins = races.map(r => {
    const a = r.results[0]?.pts,
      b = r.results[1]?.pts;
    return a && b ? (a - b) / a * 100 : null;
  }).filter(v => v !== null);
  const avgMargin = margins.length ? margins.reduce((a, b) => a + b, 0) / margins.length : 0;

  // Top performer & most consistent
  const topPerformer = [...stats].sort((a, b) => b.total - a.total)[0];
  const mostConsistent = stats.filter(s => s.raceCount > 1).sort((a, b) => a.sigma - b.sigma)[0];
  const bestWinRate = [...stats].sort((a, b) => b.winRate - a.winRate)[0];
  const cls = CLASS_INFO[trialClass];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 13,
      padding: "14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.muted,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      marginBottom: 10
    }
  }, "Team Trial Class"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, [1, 2, 3, 4, 5, 6].map(n => {
    const active = trialClass === n;
    const c = CLASS_INFO[n].color;
    return /*#__PURE__*/React.createElement("button", {
      key: n,
      onClick: () => setTrialClass(n),
      style: {
        flex: 1,
        padding: "12px 0",
        borderRadius: 10,
        border: `1px solid ${active ? c : C.border2}`,
        background: active ? c + "22" : C.faint,
        color: active ? c : C.muted,
        fontWeight: 900,
        fontSize: 15,
        cursor: "pointer",
        transition: "all 0.15s",
        boxShadow: active ? `0 0 12px ${c}44` : "none"
      }
    }, n);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 12,
      color: C.muted
    }
  }, "Currently in ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: cls.color,
      fontWeight: 800
    }
  }, cls.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 11,
      padding: "12px 10px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      color: "#34d399",
      lineHeight: 1
    }
  }, wins), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.muted,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      marginTop: 4
    }
  }, "Wins")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 11,
      padding: "12px 10px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      color: "#f87171",
      lineHeight: 1
    }
  }, losses), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.muted,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      marginTop: 4
    }
  }, "Losses")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 11,
      padding: "12px 10px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      color: C.accent,
      lineHeight: 1
    }
  }, (winRate * 100).toFixed(0), "%"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.muted,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      marginTop: 4
    }
  }, "Win Rate"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 13,
      padding: "14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.muted,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      marginBottom: 10
    }
  }, "Season Totals"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(StatBox, {
    label: "Races Recorded",
    value: races.length,
    color: C.text
  }), /*#__PURE__*/React.createElement(StatBox, {
    label: "Total Field Points",
    value: totalPoints.toLocaleString(),
    color: C.accent
  }), /*#__PURE__*/React.createElement(StatBox, {
    label: "Avg Field Total",
    value: Math.round(avgFieldTotal).toLocaleString(),
    color: "#38bdf8"
  }), /*#__PURE__*/React.createElement(StatBox, {
    label: "Avg Win Margin",
    value: `${avgMargin.toFixed(1)}%`,
    color: avgMargin >= 20 ? "#34d399" : avgMargin >= 8 ? "#fbbf24" : "#f87171"
  }))), stats.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 13,
      padding: "14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.muted,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      marginBottom: 10
    }
  }, "Highlights"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, topPerformer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: "#fbbf2422",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trophy",
    size: 14,
    color: "#fbbf24"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: C.text
    }
  }, topPerformer.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.muted
    }
  }, "Top scorer overall"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      color: C.accent
    }
  }, topPerformer.total.toLocaleString())), mostConsistent && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: "#38bdf822",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "target",
    size: 14,
    color: "#38bdf8"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: C.text
    }
  }, mostConsistent.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.muted
    }
  }, "Most consistent placing"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      color: "#38bdf8"
    }
  }, "σ ", mostConsistent.sigma.toFixed(2))), bestWinRate && bestWinRate.wins > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: "#34d39922",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "zap",
    size: 14,
    color: "#34d399"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: C.text
    }
  }, bestWinRate.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.muted
    }
  }, "Highest win rate"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      color: "#34d399"
    }
  }, (bestWinRate.winRate * 100).toFixed(0), "%")))));
}

// ─── Race View Modal ──────────────────────────────────────────────────────────
function RaceViewModal({
  race,
  onClose
}) {
  if (!race) return null;
  const max = race.results[0]?.pts || 1;
  return /*#__PURE__*/React.createElement("div", {
    className: "anim-fade",
    style: {
      position: "fixed",
      inset: 0,
      background: "#000b",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end"
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "anim-sheet",
    style: {
      background: C.surface,
      borderRadius: "18px 18px 0 0",
      border: `1px solid ${C.border}`,
      maxHeight: "min(88vh, calc(88dvh - env(safe-area-inset-bottom)))",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 18px",
      borderBottom: `1px solid ${C.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 16,
      color: C.text
    }
  }, race.label), race.outcome && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      padding: "3px 8px",
      borderRadius: 6,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      background: race.outcome === "loss" ? "#f8717122" : "#34d39922",
      color: race.outcome === "loss" ? "#f87171" : "#34d399",
      border: `1px solid ${race.outcome === "loss" ? "#f8717144" : "#34d39944"}`
    }
  }, race.outcome === "loss" ? "Loss" : "Win")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "tap",
    style: {
      background: C.faint,
      border: "none",
      color: C.muted,
      borderRadius: 7,
      width: 30,
      height: 30,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 15
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "auto",
      padding: "10px 18px",
      flex: 1
    }
  }, race.results.map((e, i) => {
    const tc = TYPE_COLOR[e.type] || C.accent;
    return /*#__PURE__*/React.createElement("div", {
      key: e.name,
      className: "anim-slide",
      style: {
        animationDelay: `${Math.min(i, 12) * 25}ms`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 0",
        borderBottom: `1px solid ${C.border}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 28,
        flexShrink: 0,
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement(Medal, {
      pos: i + 1
    })), /*#__PURE__*/React.createElement(UmaAvatar, {
      name: e.name,
      type: e.type,
      size: 40
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700,
        fontSize: 13,
        color: C.text,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, e.name), /*#__PURE__*/React.createElement(Pill, {
      type: e.type
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 3,
        background: C.faint,
        borderRadius: 2,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "bar-grow",
      style: {
        width: `${e.pts / max * 100}%`,
        height: "100%",
        background: `linear-gradient(90deg,${tc}88,${tc})`,
        borderRadius: 2
      }
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 800,
        fontSize: 13,
        color: tc,
        flexShrink: 0
      }
    }, e.pts.toLocaleString()));
  }))));
}

// ─── Paste parsing ──────────────────────────────────────────────────────────
// Accepts blocks like:
//   Maruzensky
//   727829 pts
//   Mile
//
//   Grass Wonder
//   827382 pts
//   Long
// Blocks may be separated by blank lines, or just run line-by-line in groups of 3.
// "pts"/"points" suffix on the number line is optional.
function parsePasteText(text, existingTypes) {
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  const entries = [];
  let i = 0;
  while (i < lines.length) {
    const name = lines[i];
    const ptsLine = lines[i + 1];
    if (ptsLine === undefined) break;
    const ptsMatch = ptsLine.replace(/,/g, "").match(/-?\d+/);
    if (!ptsMatch) {
      i++;
      continue;
    } // not a recognizable block, skip this line
    const pts = parseInt(ptsMatch[0]);
    let type = "";
    let consumed = 2;
    const typeLine = lines[i + 2];
    if (typeLine && TYPES.some(t => t.toLowerCase() === typeLine.toLowerCase())) {
      type = TYPES.find(t => t.toLowerCase() === typeLine.toLowerCase());
      consumed = 3;
    }
    if (!type) type = existingTypes[name] || "Mile";
    entries.push({
      name,
      pts,
      type
    });
    i += consumed;
  }
  return entries;
}

// ─── Batch Import (multi-file drop) ────────────────────────────────────────
// Accepts several .md/.txt files at once — one race per file, same
// "Name / NNN pts / Type" block format as the single Paste flow above.
// Each file becomes one race entry (sorted by points, highest first),
// and a TSV table (rows = character, columns = one per file in filename
// order) is built for pasting straight into a spreadsheet.

function naturalFileSort(a, b) {
  // Sorts "RACE__9.md" before "RACE__21.md" by pulling out trailing numbers.
  const an = a.name.match(/(\d+)(?!.*\d)/);
  const bn = b.name.match(/(\d+)(?!.*\d)/);
  if (an && bn) return parseInt(an[1]) - parseInt(bn[1]);
  return a.name.localeCompare(b.name);
}

function buildTsvFromRaces(races, order) {
  // order: array of character names, in the row order the user wants.
  // If order is omitted, uses the name order from the first race (by rank).
  const names = order && order.length ? order : races[0] ? races[0].results.map(r => r.name) : [];
  const lines = names.map(name => {
    const cells = races.map(race => {
      const hit = race.results.find(r => r.name === name);
      return hit ? hit.pts.toLocaleString() : "";
    });
    return cells.join("\t");
  });
  return lines.join("\n");
}

function BatchImportModal({
  existingTypes,
  existingNames,
  onApplyAll,
  onClose
}) {
  const [files, setFiles] = useState([]); // [{name, text}]
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy TSV");

  const parsed = useMemo(() => {
    return [...files].sort(naturalFileSort).map(f => ({
      fileName: f.name,
      entries: parsePasteText(f.text, existingTypes)
    })).filter(f => f.entries.length > 0);
  }, [files, existingTypes]);

  const races = useMemo(() => {
    return parsed.map((f, i) => ({
      id: uid(),
      label: f.fileName.replace(/\.[^.]+$/, ""),
      outcome: "win",
      results: [...f.entries].sort((a, b) => b.pts - a.pts)
    }));
  }, [parsed]);

  // Row order for the TSV: prefer the existing roster order (names already
  // known to the tracker), then any new names found, in first-appearance order.
  const rowOrder = useMemo(() => {
    if (!races.length) return [];
    const seen = new Set();
    const ordered = [];
    const known = existingNames || [];
    known.forEach(n => {
      if (races.some(r => r.results.some(e => e.name === n))) {
        ordered.push(n);
        seen.add(n);
      }
    });
    races.forEach(r => r.results.forEach(e => {
      if (!seen.has(e.name)) {
        seen.add(e.name);
        ordered.push(e.name);
      }
    }));
    return ordered;
  }, [races, existingNames]);

  const tsv = useMemo(() => races.length ? buildTsvFromRaces(races, rowOrder) : "", [races, rowOrder]);

  function handleFiles(fileList) {
    const incoming = Array.from(fileList).filter(f => /\.(md|txt)$/i.test(f.name));
    if (!incoming.length) {
      setError("No .md or .txt files found in your selection");
      return;
    }
    setError("");
    Promise.all(incoming.map(f => f.text().then(text => ({
      name: f.name,
      text
    })))).then(results => {
      setFiles(prev => {
        const byName = new Map(prev.map(p => [p.name, p]));
        results.forEach(r => byName.set(r.name, r));
        return Array.from(byName.values());
      });
    });
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files);
  }

  function removeFile(name) {
    setFiles(prev => prev.filter(f => f.name !== name));
  }

  function handleApply() {
    if (!races.length) {
      setError("Drop or select some race files first");
      return;
    }
    onApplyAll(races);
  }

  function copyTsv() {
    if (!tsv) return;
    navigator.clipboard?.writeText(tsv).then(() => {
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy TSV"), 1500);
    }).catch(() => {
      setCopyLabel("Copy failed");
      setTimeout(() => setCopyLabel("Copy TSV"), 1500);
    });
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "anim-fade",
    style: {
      position: "fixed",
      inset: 0,
      background: "#000b",
      zIndex: 110,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end"
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "anim-sheet",
    style: {
      background: C.surface,
      borderRadius: "18px 18px 0 0",
      border: `1px solid ${C.border}`,
      maxHeight: "min(92vh, calc(92dvh - env(safe-area-inset-bottom)))",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 18px",
      borderBottom: `1px solid ${C.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 16,
      color: C.text,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 16,
    color: C.accent
  }), "Batch Import Races"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "tap",
    style: {
      background: C.faint,
      border: "none",
      color: C.muted,
      borderRadius: 7,
      width: 30,
      height: 30,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 15
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "auto",
      padding: "14px 18px",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  },
  /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.faint,
      border: `1px solid ${C.border2}`,
      borderRadius: 10,
      padding: "9px 12px",
      fontSize: 11.5,
      color: C.muted,
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.text,
      fontWeight: 700,
      marginBottom: 4
    }
  }, "Drop one file per race (.md or .txt)"), "Each file is parsed the same as Paste Results — \"Name / NNN pts / Type\" blocks. One race is created per file, and a TSV table (one column per file, sorted by filename) is built below for pasting into a spreadsheet."),
  /*#__PURE__*/React.createElement("div", {
    onDragOver: e => {
      e.preventDefault();
      setDragOver(true);
    },
    onDragLeave: () => setDragOver(false),
    onDrop: handleDrop,
    style: {
      border: `2px dashed ${dragOver ? C.accent : C.border2}`,
      borderRadius: 12,
      padding: "26px 14px",
      textAlign: "center",
      background: dragOver ? C.accentLo : C.faint,
      transition: "all 0.15s"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 26,
    color: dragOver ? C.accent : C.muted,
    style: {
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.text,
      fontWeight: 700,
      fontSize: 13,
      marginBottom: 4
    }
  }, "Drag & drop race files here"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 12,
      marginBottom: 12
    }
  }, "or"), /*#__PURE__*/React.createElement("label", {
    className: "tap",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      padding: "9px 16px",
      borderRadius: 9,
      background: C.accent,
      color: "#fff",
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Choose Files", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".md,.txt,text/markdown,text/plain",
    multiple: true,
    onChange: e => {
      if (e.target.files?.length) handleFiles(e.target.files);
      e.target.value = "";
    },
    style: {
      display: "none"
    }
  }))),
  files.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "anim-fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.muted,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      marginBottom: 6
    }
  }, files.length, " file", files.length !== 1 ? "s" : "", " \u2022 ", races.length, " race", races.length !== 1 ? "s" : "", " detected"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      maxHeight: 180,
      overflow: "auto"
    }
  }, [...files].sort(naturalFileSort).map(f => {
    const match = parsed.find(p => p.fileName === f.name);
    const count = match ? match.entries.length : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: f.name,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "7px 10px"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 12.5,
        fontWeight: 700,
        color: C.text,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontFamily: "monospace"
      }
    }, f.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: count > 0 ? "#6ee7b7" : "#fca5a5"
      }
    }, count > 0 ? `${count} entries` : "unrecognized"), /*#__PURE__*/React.createElement("button", {
      onClick: () => removeFile(f.name),
      className: "tap",
      style: {
        background: "transparent",
        border: "none",
        color: C.muted,
        cursor: "pointer",
        padding: 2,
        display: "flex"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "x",
      size: 13
    })));
  }))),
  tsv && /*#__PURE__*/React.createElement("div", {
    className: "anim-fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.muted,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.07em"
    }
  }, "TSV Preview (paste into Sheets)"), /*#__PURE__*/React.createElement("button", {
    onClick: copyTsv,
    className: "tap",
    style: {
      padding: "6px 12px",
      borderRadius: 7,
      background: C.faint,
      border: `1px solid ${C.border2}`,
      color: C.text,
      fontWeight: 700,
      fontSize: 11.5,
      cursor: "pointer"
    }
  }, copyLabel)), /*#__PURE__*/React.createElement("textarea", {
    readOnly: true,
    value: tsv,
    rows: 8,
    onFocus: e => e.target.select(),
    style: {
      background: C.faint,
      border: `1px solid ${C.border2}`,
      borderRadius: 9,
      color: C.text,
      padding: "10px 12px",
      fontSize: 11.5,
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
      resize: "vertical",
      fontFamily: "monospace",
      lineHeight: 1.5
    }
  })),
  error && /*#__PURE__*/React.createElement("div", {
    className: "anim-fade",
    style: {
      background: "#450a0a33",
      border: "1px solid #ef444466",
      borderRadius: 8,
      padding: "10px 12px",
      color: "#fca5a5",
      fontSize: 13,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alertTriangle",
    size: 15,
    style: {
      flexShrink: 0
    }
  }), error)
  ), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 18px",
      borderTop: `1px solid ${C.border}`,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleApply,
    disabled: races.length === 0,
    className: "tap",
    style: {
      width: "100%",
      padding: "13px",
      borderRadius: 11,
      background: races.length === 0 ? C.border2 : `linear-gradient(135deg,${C.accent},#8b5cf6)`,
      border: "none",
      color: races.length === 0 ? C.muted : "#fff",
      fontWeight: 800,
      fontSize: 15,
      cursor: races.length === 0 ? "default" : "pointer",
      boxShadow: races.length === 0 ? "none" : `0 4px 20px ${C.accent}44`,
      letterSpacing: "0.02em"
    }
  }, races.length > 0 ? `Add ${races.length} Race${races.length !== 1 ? "s" : ""} to Tracker` : "Add Races to Tracker"))));
}

// ─── Paste Modal ────────────────────────────────────────────────────────────
function PasteModal({
  existingTypes,
  onApply,
  onClose
}) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const preview = useMemo(() => {
    if (!text.trim()) return [];
    try {
      return parsePasteText(text, existingTypes);
    } catch {
      return [];
    }
  }, [text, existingTypes]);
  function handleApply() {
    if (preview.length < 1) {
      setError("Couldn't find any entries — check the format below");
      return;
    }
    onApply(preview);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "anim-fade",
    style: {
      position: "fixed",
      inset: 0,
      background: "#000b",
      zIndex: 110,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end"
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "anim-sheet",
    style: {
      background: C.surface,
      borderRadius: "18px 18px 0 0",
      border: `1px solid ${C.border}`,
      maxHeight: "min(92vh, calc(92dvh - env(safe-area-inset-bottom)))",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 18px",
      borderBottom: `1px solid ${C.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 16,
      color: C.text,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 16,
    color: C.accent
  }), "Paste Results"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "tap",
    style: {
      background: C.faint,
      border: "none",
      color: C.muted,
      borderRadius: 7,
      width: 30,
      height: 30,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 15
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "auto",
      padding: "14px 18px",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.faint,
      border: `1px solid ${C.border2}`,
      borderRadius: 10,
      padding: "9px 12px",
      fontSize: 11.5,
      color: C.muted,
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.text,
      fontWeight: 700,
      marginBottom: 4
    }
  }, "Expected format (one entry per 3 lines):"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "monospace",
      fontSize: 11,
      whiteSpace: "pre-wrap",
      color: C.muted
    }
  }, `Maruzensky
727829 pts
Mile

Grass Wonder
827382 pts
Long`), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, "The type line is optional — types will be guessed from past races if left out.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.muted,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      marginBottom: 5
    }
  }, "Paste here"), /*#__PURE__*/React.createElement("textarea", {
    value: text,
    onChange: e => {
      setText(e.target.value);
      setError("");
    },
    placeholder: "Maruzensky\n727829 pts\nMile\n\nGrass Wonder\n827382 pts\nLong",
    rows: 10,
    style: {
      background: C.faint,
      border: `1px solid ${C.border2}`,
      borderRadius: 9,
      color: C.text,
      padding: "10px 12px",
      fontSize: 13,
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
      resize: "vertical",
      fontFamily: "monospace",
      lineHeight: 1.5
    }
  })), preview.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "anim-fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.muted,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      marginBottom: 6
    }
  }, "Preview (", preview.length, " entries)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      maxHeight: 220,
      overflow: "auto"
    }
  }, [...preview].sort((a, b) => b.pts - a.pts).map((e, i) => {
    const tc = TYPE_COLOR[e.type] || C.muted;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "7px 10px"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 20,
        textAlign: "center",
        fontSize: 11,
        fontWeight: 800,
        color: C.muted
      }
    }, i + 1), /*#__PURE__*/React.createElement(UmaAvatar, {
      name: e.name,
      type: e.type,
      size: 34
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 13,
        fontWeight: 700,
        color: C.text,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, e.name), /*#__PURE__*/React.createElement(Pill, {
      type: e.type
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 800,
        color: tc
      }
    }, e.pts.toLocaleString()));
  }))), error && /*#__PURE__*/React.createElement("div", {
    className: "anim-fade",
    style: {
      background: "#450a0a33",
      border: "1px solid #ef444466",
      borderRadius: 8,
      padding: "10px 12px",
      color: "#fca5a5",
      fontSize: 13,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alertTriangle",
    size: 15,
    style: {
      flexShrink: 0
    }
  }), error)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 18px",
      borderTop: `1px solid ${C.border}`,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleApply,
    className: "tap",
    style: {
      width: "100%",
      padding: "13px",
      borderRadius: 11,
      background: `linear-gradient(135deg,${C.accent},#8b5cf6)`,
      border: "none",
      color: "#fff",
      fontWeight: 800,
      fontSize: 15,
      cursor: "pointer",
      boxShadow: `0 4px 20px ${C.accent}44`,
      letterSpacing: "0.02em"
    }
  }, "Use These Entries"))));
}

// ─── Race Form Modal (Add / Edit) ──────────────────────────────────────────
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
function RaceFormModal({
  existingNames,
  existingTypes,
  onSave,
  onClose,
  nextLabel,
  editingRace
}) {
  const isEdit = !!editingRace;
  const [label, setLabel] = useState(editingRace?.label || nextLabel);
  const [outcome, setOutcome] = useState(editingRace?.outcome || "win");
  const [error, setError] = useState("");

  // Build the 15 working rows. Editing pre-fills from the race's saved results;
  // adding pre-fills names/types from the known roster so they're quick to fill in.
  const makeRows = () => {
    if (editingRace) {
      const fromRace = editingRace.results.map(r => ({
        name: r.name,
        pts: String(r.pts),
        type: r.type
      }));
      const padded = [...fromRace];
      while (padded.length < 15) padded.push({
        name: "",
        pts: "",
        type: "Mile"
      });
      return padded;
    }
    return Array.from({
      length: 15
    }, (_, i) => {
      const n = existingNames[i] || "";
      return {
        name: n,
        pts: "",
        type: existingTypes[n] || "Mile"
      };
    });
  };
  const [rows, setRows] = useState(makeRows);
  const [showPaste, setShowPaste] = useState(false);

  // Apply pasted entries: they represent the actual race data, so they
  // replace the working rows from the top. Any leftover pre-filled rows
  // (e.g. roster names with no points) are dropped to avoid stray "0" rows;
  // the grid is padded back out to at least 15 rows for further manual entry.
  function applyPasted(entries) {
    setRows(() => {
      const filled = entries.map(e => ({
        name: e.name,
        pts: String(e.pts),
        type: e.type
      }));
      while (filled.length < 15) filled.push({
        name: "",
        pts: "",
        type: "Mile"
      });
      return filled;
    });
    setShowPaste(false);
    setError("");
  }
  function updateRow(i, field, val) {
    setRows(r => r.map((row, idx) => {
      if (idx !== i) return row;
      if (field === "name") {
        const knownType = existingTypes[val];
        return {
          ...row,
          name: val,
          type: knownType || row.type
        };
      }
      return {
        ...row,
        [field]: val
      };
    }));
  }

  // Live placement preview: rank rows with a name + numeric points by points
  // descending, so the standings order updates automatically as you type.
  const rankOf = useMemo(() => {
    const valid = rows.map((r, idx) => ({
      idx,
      pts: parseInt(r.pts)
    })).filter(r => rows[r.idx].name.trim() && rows[r.idx].pts !== "" && !isNaN(r.pts));
    valid.sort((a, b) => b.pts - a.pts);
    const map = {};
    valid.forEach((r, i) => {
      map[r.idx] = i + 1;
    });
    return map;
  }, [rows]);
  function save() {
    if (!label.trim()) {
      setError("Race name is required");
      return;
    }
    const valid = rows.filter(r => r.name.trim() && r.pts !== "");
    if (valid.length < 2) {
      setError("At least 2 entries needed");
      return;
    }
    if (valid.find(r => isNaN(parseInt(r.pts)))) {
      setError("Some points values look invalid");
      return;
    }
    // Always save in placement order — highest points first — regardless of
    // which row the entry was typed into.
    const results = valid.map(r => ({
      name: r.name.trim(),
      pts: parseInt(r.pts),
      type: r.type
    })).sort((a, b) => b.pts - a.pts);
    onSave({
      id: editingRace ? editingRace.id : uid(),
      label: label.trim(),
      outcome,
      results
    });
  }
  const inputStyle = {
    background: C.faint,
    border: `1px solid ${C.border2}`,
    borderRadius: 7,
    color: C.text,
    padding: "8px 9px",
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.15s"
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "anim-fade",
    style: {
      position: "fixed",
      inset: 0,
      background: "#000b",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end"
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "anim-sheet",
    style: {
      background: C.surface,
      borderRadius: "18px 18px 0 0",
      border: `1px solid ${C.border}`,
      maxHeight: "min(92vh, calc(92dvh - env(safe-area-inset-bottom)))",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 18px",
      borderBottom: `1px solid ${C.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 16,
      color: C.text,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: isEdit ? "pencil" : "plus",
    size: 16,
    color: C.accent
  }), isEdit ? "Edit Race" : "Add Race"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowPaste(true),
    className: "tap",
    style: {
      background: C.faint,
      border: `1px solid ${C.border2}`,
      color: C.accent,
      borderRadius: 7,
      padding: "7px 11px",
      cursor: "pointer",
      fontSize: 12,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 14
  }), " Paste"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "tap",
    style: {
      background: C.faint,
      border: "none",
      color: C.muted,
      borderRadius: 7,
      width: 30,
      height: 30,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 15
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "auto",
      padding: "14px 18px",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.muted,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      marginBottom: 5
    }
  }, "Race Name"), /*#__PURE__*/React.createElement("input", {
    value: label,
    onChange: e => setLabel(e.target.value),
    placeholder: "e.g. Race 11",
    style: inputStyle
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 148
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.muted,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      marginBottom: 5
    }
  }, "Result"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      height: 38
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOutcome("win"),
    className: "tap",
    style: {
      flex: 1,
      borderRadius: 7,
      border: `1px solid ${outcome === "win" ? "#34d399" : C.border2}`,
      background: outcome === "win" ? "#34d39922" : C.faint,
      color: outcome === "win" ? "#34d399" : C.muted,
      fontWeight: 800,
      fontSize: 12,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trophy",
    size: 13
  }), " Win"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOutcome("loss"),
    className: "tap",
    style: {
      flex: 1,
      borderRadius: 7,
      border: `1px solid ${outcome === "loss" ? "#f87171" : C.border2}`,
      background: outcome === "loss" ? "#f8717122" : C.faint,
      color: outcome === "loss" ? "#f87171" : C.muted,
      fontWeight: 800,
      fontSize: 12,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "skull",
    size: 13
  }), " Loss")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "26px 34px 1fr 92px 66px",
      gap: "4px 6px",
      fontSize: 9,
      color: C.muted,
      fontWeight: 700,
      textTransform: "uppercase",
      padding: "0 2px",
      marginBottom: 4,
      letterSpacing: "0.05em"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: "center"
    }
  }, "#"), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null, "Name"), /*#__PURE__*/React.createElement("span", null, "Points"), /*#__PURE__*/React.createElement("span", null, "Type")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, rows.map((row, i) => {
    const tc = TYPE_COLOR[row.type] || C.muted;
    const rank = rankOf[i];
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "grid",
        gridTemplateColumns: "26px 34px 1fr 92px 66px",
        gap: "0 6px",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement(RankBadge, {
      rank: rank
    }), /*#__PURE__*/React.createElement(UmaAvatar, {
      name: row.name || `Uma ${i + 1}`,
      type: row.type,
      size: 34
    }), /*#__PURE__*/React.createElement("input", {
      value: row.name,
      onChange: e => updateRow(i, "name", e.target.value),
      placeholder: `Uma ${i + 1}`,
      style: {
        ...inputStyle,
        padding: "7px 8px",
        fontSize: 12
      }
    }), /*#__PURE__*/React.createElement("input", {
      value: row.pts,
      onChange: e => updateRow(i, "pts", e.target.value),
      placeholder: "0",
      type: "number",
      style: {
        ...inputStyle,
        padding: "7px 8px",
        fontSize: 12
      }
    }), /*#__PURE__*/React.createElement("select", {
      value: row.type,
      onChange: e => updateRow(i, "type", e.target.value),
      style: {
        ...inputStyle,
        padding: "7px 5px",
        fontSize: 11,
        color: tc,
        cursor: "pointer"
      }
    }, TYPES.map(t => /*#__PURE__*/React.createElement("option", {
      key: t,
      value: t
    }, t))));
  }))), error && /*#__PURE__*/React.createElement("div", {
    className: "anim-fade",
    style: {
      background: "#450a0a33",
      border: "1px solid #ef444466",
      borderRadius: 8,
      padding: "10px 12px",
      color: "#fca5a5",
      fontSize: 13,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alertTriangle",
    size: 15,
    style: {
      flexShrink: 0
    }
  }), error)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 18px",
      borderTop: `1px solid ${C.border}`,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: save,
    className: "tap",
    style: {
      width: "100%",
      padding: "13px",
      borderRadius: 11,
      background: `linear-gradient(135deg,${C.accent},#8b5cf6)`,
      border: "none",
      color: "#fff",
      fontWeight: 800,
      fontSize: 15,
      cursor: "pointer",
      boxShadow: `0 4px 20px ${C.accent}44`,
      letterSpacing: "0.02em"
    }
  }, isEdit ? "Save Changes" : "Save Race"))), showPaste && /*#__PURE__*/React.createElement(PasteModal, {
    existingTypes: existingTypes,
    onApply: applyPasted,
    onClose: () => setShowPaste(false)
  }));
}

// ─── Settings Modal ─────────────────────────────────────────────────────────
function SettingsModal({
  races,
  onClose,
  onExport,
  onImport,
  onClear,
  onOpenBatchImport
}) {
  const [status, setStatus] = useState(null); // {ok:bool, msg:string} | null
  const [confirmClear, setConfirmClear] = useState(false);
  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    onImport(file, (ok, count) => {
      if (ok) setStatus({
        ok: true,
        msg: `Restored ${count} race${count !== 1 ? "s" : ""} from backup`
      });else setStatus({
        ok: false,
        msg: "Couldn't read that file — make sure it's a valid backup JSON"
      });
    });
    e.target.value = "";
  }
  function handleClear() {
    if (confirmClear) {
      onClear();
      setConfirmClear(false);
      setStatus({
        ok: true,
        msg: "All race data cleared"
      });
    } else setConfirmClear(true);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "anim-fade",
    style: {
      position: "fixed",
      inset: 0,
      background: "#000b",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end"
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "anim-sheet",
    style: {
      background: C.surface,
      borderRadius: "18px 18px 0 0",
      border: `1px solid ${C.border}`,
      maxHeight: "min(88vh, calc(88dvh - env(safe-area-inset-bottom)))",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 18px",
      borderBottom: `1px solid ${C.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 16,
      color: C.text
    }
  }, "Settings"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "tap",
    style: {
      background: C.faint,
      border: "none",
      color: C.muted,
      borderRadius: 7,
      width: 30,
      height: 30,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 15
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "auto",
      padding: "16px 18px 28px",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.muted,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      marginBottom: 8
    }
  }, "Race Files"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: "14px",
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 14,
      color: C.text,
      marginBottom: 2
    }
  }, "Batch Import"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.muted,
      lineHeight: 1.5
    }
  }, "Drop multiple race result files at once. Each becomes a race, and a TSV table is generated for pasting into a spreadsheet.")), /*#__PURE__*/React.createElement("button", {
    onClick: onOpenBatchImport,
    className: "tap",
    style: {
      padding: "11px",
      borderRadius: 9,
      background: `linear-gradient(135deg,${C.accent},#8b5cf6)`,
      border: "none",
      color: "#fff",
      fontWeight: 800,
      fontSize: 13,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 15
  }), " Batch Import Races"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.muted,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      marginBottom: 8
    }
  }, "Data"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: "14px",
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 14,
      color: C.text,
      marginBottom: 2
    }
  }, "Backup"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.muted,
      lineHeight: 1.5
    }
  }, "Save all ", races.length, " race", races.length !== 1 ? "s" : "", " to a JSON file you can keep or transfer to another device.")), /*#__PURE__*/React.createElement("button", {
    onClick: onExport,
    disabled: races.length === 0,
    className: "tap",
    style: {
      padding: "11px",
      borderRadius: 9,
      background: races.length === 0 ? C.border2 : C.accent,
      border: "none",
      color: races.length === 0 ? C.muted : "#fff",
      fontWeight: 800,
      fontSize: 13,
      cursor: races.length === 0 ? "default" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 15
  }), " Export Backup")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: "14px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 14,
      color: C.text,
      marginBottom: 2
    }
  }, "Restore"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.muted,
      lineHeight: 1.5
    }
  }, "Load a previously exported backup file. This replaces your current race data.")), /*#__PURE__*/React.createElement("label", {
    className: "tap",
    style: {
      padding: "11px",
      borderRadius: 9,
      background: C.faint,
      border: `1px solid ${C.border2}`,
      color: C.text,
      fontWeight: 800,
      fontSize: 13,
      cursor: "pointer",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 15
  }), " Choose Backup File", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "application/json,.json",
    onChange: handleFile,
    style: {
      display: "none"
    }
  }))), status && /*#__PURE__*/React.createElement("div", {
    className: "anim-slide",
    style: {
      marginTop: 10,
      background: status.ok ? "#0f3a2433" : "#450a0a33",
      border: `1px solid ${status.ok ? "#34d39966" : "#ef444466"}`,
      borderRadius: 8,
      padding: "10px 12px",
      color: status.ok ? "#6ee7b7" : "#fca5a5",
      fontSize: 12,
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: status.ok ? "checkCircle" : "alertTriangle",
    size: 14,
    style: {
      flexShrink: 0
    }
  }), status.msg)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.muted,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      marginBottom: 8
    }
  }, "Danger Zone"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: "14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 14,
      color: C.text,
      marginBottom: 2
    }
  }, "Clear All Data"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.muted,
      lineHeight: 1.5,
      marginBottom: 10
    }
  }, "Permanently delete all race records. Export a backup first if you might need this data later."), /*#__PURE__*/React.createElement("button", {
    onClick: handleClear,
    className: "tap",
    style: {
      width: "100%",
      padding: "11px",
      borderRadius: 9,
      border: "1px solid",
      fontWeight: 800,
      fontSize: 13,
      cursor: "pointer",
      transition: "all 0.15s",
      background: confirmClear ? "#ef4444" : "transparent",
      borderColor: confirmClear ? "#ef4444" : "#ef444466",
      color: confirmClear ? "#fff" : "#ef4444",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 7
    }
  }, confirmClear ? "Tap again to confirm" : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "trash",
    size: 15
  }), " Clear All Data")))))));
}

// ─── App ──────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "uma_race_v2";
const CLASS_KEY = "uma_trial_class_v1";
function App() {
  const [races, setRaces] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("standings");
  const [showAdd, setShowAdd] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBatchImport, setShowBatchImport] = useState(false);
  const [viewRace, setViewRace] = useState(null);
  const [editingRace, setEditingRace] = useState(null);
  const [trialClass, setTrialClassState] = useState(3);

  // Load persisted data once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setRaces(parsed);
      }
    } catch {}
    try {
      const cls = localStorage.getItem(CLASS_KEY);
      if (cls) {
        const n = parseInt(cls);
        if (n >= 1 && n <= 6) setTrialClassState(n);
      }
    } catch {}
    setLoaded(true);
  }, []);
  function setTrialClass(n) {
    setTrialClassState(n);
    try {
      localStorage.setItem(CLASS_KEY, String(n));
    } catch {}
  }

  // Persist on change (skip the very first render before load completes)
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(races));
    } catch {}
  }, [races, loaded]);
  const stats = useMemo(() => computeStats(races), [races]);
  const existingNames = useMemo(() => [...new Set(races.flatMap(r => r.results.map(e => e.name)))], [races]);
  const existingTypes = useMemo(() => {
    const m = {};
    races.forEach(r => r.results.forEach(e => {
      m[e.name] = e.type;
    }));
    return m;
  }, [races]);
  const nextLabel = `Race ${races.length + 1}`;
  function saveRace(race) {
    setRaces(r => {
      const idx = r.findIndex(x => x.id === race.id);
      if (idx >= 0) {
        const copy = [...r];
        copy[idx] = race;
        return copy;
      }
      return [...r, race];
    });
    setShowAdd(false);
    setEditingRace(null);
  }
  function openAdd() {
    setEditingRace(null);
    setShowAdd(true);
  }
  function openEdit(race) {
    setEditingRace(race);
    setShowAdd(true);
  }
  function closeForm() {
    setShowAdd(false);
    setEditingRace(null);
  }
  function deleteRace(id) {
    setRaces(r => r.filter(x => x.id !== id));
  }
  function clearRaces() {
    setRaces([]);
  }
  function addRacesBatch(newRaces) {
    setRaces(r => [...r, ...newRaces]);
    setShowBatchImport(false);
    setShowSettings(false);
  }
  function exportData() {
    const payload = JSON.stringify({
      version: 2,
      exportedAt: new Date().toISOString(),
      races
    }, null, 2);
    const blob = new Blob([payload], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uma-race-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  function importData(file, onDone) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const incoming = Array.isArray(parsed) ? parsed : parsed.races;
        if (!Array.isArray(incoming)) throw new Error("bad format");
        setRaces(incoming);
        onDone(true, incoming.length);
      } catch {
        onDone(false);
      }
    };
    reader.onerror = () => onDone(false);
    reader.readAsText(file);
  }
  const TABS = [{
    id: "standings",
    label: "Standings",
    icon: "trophy"
  }, {
    id: "trends",
    label: "Trends",
    icon: "trending-up"
  }, {
    id: "races",
    label: "Races",
    icon: "flag"
  }, {
    id: "profile",
    label: "Profile",
    icon: "user"
  }];
  const mid = Math.ceil(TABS.length / 2);
  const leftTabs = TABS.slice(0, mid);
  const rightTabs = TABS.slice(mid);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.bg,
      minHeight: "100vh",
      color: C.text,
      fontFamily: "'Inter',system-ui,sans-serif",
      maxWidth: 520,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "anim-fade",
    style: {
      background: C.surface,
      borderBottom: `1px solid ${C.border}`,
      padding: "16px 18px",
      flexShrink: 0,
      boxShadow: "0 2px 24px #00000055",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.accent,
      fontWeight: 700,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      marginBottom: 3
    }
  }, "Uma Musume"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 21,
      fontWeight: 900,
      color: C.text,
      letterSpacing: "-0.02em",
      lineHeight: 1.1
    }
  }, "Race Tracker")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      background: C.card,
      borderRadius: 10,
      padding: "6px 12px",
      border: `1px solid ${C.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 900,
      color: C.accent,
      lineHeight: 1
    }
  }, races.length), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.muted,
      letterSpacing: "0.05em"
    }
  }, "RACES")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowSettings(true),
    "aria-label": "Settings",
    className: "tap",
    style: {
      width: 38,
      height: 38,
      borderRadius: 10,
      background: C.card,
      border: `1px solid ${C.border}`,
      color: C.muted,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings",
    size: 17
  })))), /*#__PURE__*/React.createElement("div", {
    key: tab,
    className: "anim-fade",
    style: {
      flex: 1,
      overflow: "auto",
      padding: "16px 16px 100px",
      WebkitOverflowScrolling: "touch"
    }
  }, races.length === 0 && tab !== "races" && tab !== "profile" ? /*#__PURE__*/React.createElement("div", {
    className: "anim-slide",
    style: {
      textAlign: "center",
      padding: "64px 20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 14,
      color: C.border2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "barChart",
    size: 48,
    strokeWidth: 1.6
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      color: C.text,
      fontSize: 17,
      marginBottom: 6
    }
  }, "No race data"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.muted,
      marginBottom: 24
    }
  }, "Add your first race to see stats"), /*#__PURE__*/React.createElement("button", {
    onClick: openAdd,
    className: "tap",
    style: {
      padding: "12px 28px",
      borderRadius: 12,
      background: C.accent,
      border: "none",
      color: "#fff",
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
      boxShadow: `0 4px 18px ${C.accent}55`,
      display: "inline-flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 15
  }), " Add Race")) : /*#__PURE__*/React.createElement(React.Fragment, null, tab === "standings" && /*#__PURE__*/React.createElement(StandingsTab, {
    stats: stats
  }), tab === "trends" && /*#__PURE__*/React.createElement(TrendsTab, {
    stats: stats,
    races: races
  }), tab === "races" && /*#__PURE__*/React.createElement(RacesTab, {
    races: races,
    onDelete: deleteRace,
    onView: setViewRace,
    onEdit: openEdit
  }), tab === "profile" && /*#__PURE__*/React.createElement(ProfileTab, {
    races: races,
    stats: stats,
    trialClass: trialClass,
    setTrialClass: setTrialClass
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: 520,
      background: C.surface,
      borderTop: `1px solid ${C.border}`,
      boxShadow: "0 -2px 24px #00000066",
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      padding: "8px 8px calc(8px + env(safe-area-inset-bottom))"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      justifyContent: "space-around"
    }
  }, leftTabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setTab(t.id),
    className: "tap",
    style: {
      flex: 1,
      padding: "8px 4px",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      color: tab === t.id ? C.accent : C.muted,
      fontWeight: 700,
      fontSize: 11,
      transition: "color 0.15s",
      letterSpacing: "0.01em"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: t.icon,
    size: 19,
    strokeWidth: tab === t.id ? 2.3 : 2
  }), /*#__PURE__*/React.createElement("span", null, t.label), /*#__PURE__*/React.createElement("span", {
    key: tab === t.id ? "on" : "off",
    className: tab === t.id ? "anim-pop" : "",
    style: {
      width: tab === t.id ? 14 : 0,
      height: 3,
      borderRadius: 2,
      background: C.accent,
      transition: "width 0.2s"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      justifyContent: "space-around"
    }
  }, rightTabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setTab(t.id),
    className: "tap",
    style: {
      flex: 1,
      padding: "8px 4px",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      color: tab === t.id ? C.accent : C.muted,
      fontWeight: 700,
      fontSize: 11,
      transition: "color 0.15s",
      letterSpacing: "0.01em"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: t.icon,
    size: 19,
    strokeWidth: tab === t.id ? 2.3 : 2
  }), /*#__PURE__*/React.createElement("span", null, t.label), /*#__PURE__*/React.createElement("span", {
    key: tab === t.id ? "on" : "off",
    className: tab === t.id ? "anim-pop" : "",
    style: {
      width: tab === t.id ? 14 : 0,
      height: 3,
      borderRadius: 2,
      background: C.accent,
      transition: "width 0.2s"
    }
  })))), /*#__PURE__*/React.createElement("button", {
    onClick: openAdd,
    className: "tap",
    style: {
      position: "absolute",
      left: "50%",
      bottom: "14px",
      transform: "translateX(-50%)",
      background: `linear-gradient(135deg,${C.accent},#8b5cf6)`,
      border: `4px solid ${C.surface}`,
      color: "#fff",
      width: 56,
      height: 56,
      borderRadius: 18,
      cursor: "pointer",
      fontWeight: 900,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxShadow: `0 4px 18px ${C.accent}66`
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 26,
    strokeWidth: 2.6
  }))), showAdd && /*#__PURE__*/React.createElement(RaceFormModal, {
    existingNames: existingNames,
    existingTypes: existingTypes,
    onSave: saveRace,
    onClose: closeForm,
    nextLabel: nextLabel,
    editingRace: editingRace
  }), viewRace && /*#__PURE__*/React.createElement(RaceViewModal, {
    race: viewRace,
    onClose: () => setViewRace(null)
  }), showSettings && /*#__PURE__*/React.createElement(SettingsModal, {
    races: races,
    onClose: () => setShowSettings(false),
    onExport: exportData,
    onImport: importData,
    onClear: clearRaces,
    onOpenBatchImport: () => setShowBatchImport(true)
  }), showBatchImport && /*#__PURE__*/React.createElement(BatchImportModal, {
    existingNames: existingNames,
    existingTypes: existingTypes,
    onApplyAll: addRacesBatch,
    onClose: () => setShowBatchImport(false)
  }));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/*#__PURE__*/React.createElement(App, null));
