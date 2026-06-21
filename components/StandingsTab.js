// ─── Tab: Standings ──────────────────────────────────────────────────────────
function StandingsTab({ stats }) {
  const [sort, setSort] = useState("total");
  const [dir, setDir] = useState(-1);
  const [expanded, setExpanded] = useState(null);
  const [typeFilter, setTypeFilter] = useState("All");
  const filtered = useMemo(() => typeFilter === "All" ? stats : stats.filter(s => s.primaryType === typeFilter), [stats, typeFilter]);
  const sorted = useMemo(() => [...filtered].sort((a, b) => dir * (a[sort] - b[sort])), [filtered, sort, dir]);
  const maxTotal = sorted[0]?.total || 1;
  function handleSort(k, defaultDir) {
    if (sort === k) setDir(d => -d); else {
      setSort(k);
      setDir(defaultDir || -1);
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    style: { display: "flex", flexDirection: "column", gap: 10 }
  }, /*#__PURE__*/React.createElement("div", {
    style: { display: "flex", gap: 8 }
  }, /*#__PURE__*/React.createElement(TypeFilterDropdown, {
    active: typeFilter, onChange: setTypeFilter
  }), /*#__PURE__*/React.createElement(SortDropdown, {
    sort, dir, onSort: handleSort
  })), sorted.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: { textAlign: "center", padding: "40px 20px", color: C.muted, fontSize: 13 }
  }, "No ", typeFilter.toLowerCase(), " competitors yet"), sorted.map((s, i) => {
    const isOpen = expanded === s.name;
    const tc = TYPE_COLOR[s.primaryType] || C.accent;
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
      style: { padding: "13px 14px", display: "flex", alignItems: "center", gap: 10 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { width: 28, flexShrink: 0, textAlign: "center" }
    }, /*#__PURE__*/React.createElement(Medal, { pos: i + 1 })),
      /*#__PURE__*/React.createElement(UmaAvatar, { name: s.name, type: s.primaryType, size: 42 }),
      /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
        /*#__PURE__*/React.createElement("div", {
          style: {
            fontWeight: 800, fontSize: 14, color: C.text,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            marginBottom: 4
          },
          title: s.name
        }, s.name),
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 7 } },
          /*#__PURE__*/React.createElement(Pill, { type: s.primaryType }),
          /*#__PURE__*/React.createElement("div", {
            style: { flex: 1, height: 4, background: C.faint, borderRadius: 2, overflow: "hidden", minWidth: 24 }
          }, /*#__PURE__*/React.createElement("div", {
            className: "bar-grow",
            style: { width: `${barPct}%`, height: "100%", borderRadius: 2, background: `linear-gradient(90deg,${tc}99,${tc})` }
          }))
        )
      ),
      /*#__PURE__*/React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } },
        /*#__PURE__*/React.createElement("div", { style: { fontSize: 17, fontWeight: 900, color: tc, letterSpacing: "-0.01em" } }, s.total.toLocaleString()),
        /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, color: C.muted } }, s.roundCount, " round", s.roundCount !== 1 ? "s" : "")
      ),
      /*#__PURE__*/React.createElement("div", {
        className: "chev", style: { color: C.border2, flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none" }
      }, /*#__PURE__*/React.createElement(Icon, { name: "chevronDown", size: 15 }))
    ), isOpen && /*#__PURE__*/React.createElement("div", {
      className: "anim-expand",
      style: { borderTop: `1px solid ${C.border}`, padding: "12px 14px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7 }
    },
      /*#__PURE__*/React.createElement(StatBox, { label: "Wins", value: s.wins, color: "#fbbf24" }),
      /*#__PURE__*/React.createElement(StatBox, {
        label: "Win Rate", value: `${(s.winRate * 100).toFixed(0)}%`,
        color: s.winRate >= 0.3 ? "#34d399" : s.winRate >= 0.1 ? "#38bdf8" : C.muted
      }),
      /*#__PURE__*/React.createElement(StatBox, { label: "Losses", value: s.losses, color: "#f87171" }),
      /*#__PURE__*/React.createElement(StatBox, { label: "Peak", value: s.best.toLocaleString(), color: C.accent }),
      /*#__PURE__*/React.createElement(StatBox, { label: "Worst", value: s.worst.toLocaleString(), color: "#f87171" }),
      /*#__PURE__*/React.createElement(StatBox, { label: "Avg Score", value: Math.round(s.avg).toLocaleString(), color: C.text }),
      /*#__PURE__*/React.createElement(StatBox, { label: "Volatility", value: s.range.toLocaleString(), color: "#fbbf24" }),
      /*#__PURE__*/React.createElement(StatBox, {
        label: "Consistency", value: `\u03c3 ${s.sigma.toFixed(2)}`,
        color: s.sigma < 2 ? "#34d399" : s.sigma < 3.5 ? "#38bdf8" : s.sigma < 4.5 ? "#fbbf24" : "#f87171"
      }),
      /*#__PURE__*/React.createElement(StatBox, {
        label: "Best Track",
        value: s.bestTrack ? `${s.bestTrack.venue} ${s.bestTrack.distance}m` : "\u2013",
        color: "#34d399"
      }),
      /*#__PURE__*/React.createElement(StatBox, {
        label: "Worst Track",
        value: s.worstTrack ? `${s.worstTrack.venue} ${s.worstTrack.distance}m` : "\u2013",
        color: "#f87171"
      })
    ));
  }));
}
