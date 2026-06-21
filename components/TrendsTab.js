// ─── Tab: Trends ─────────────────────────────────────────────────────────────
function TrendsTab({ stats, races }) {
  const [focus, setFocus] = useState(null);
  const sorted = useMemo(() => [...stats].sort((a, b) => b.total - a.total), [stats]);
  const allNames = sorted.map(s => s.name);
  const display = focus ? [focus] : allNames;

  // Chronological list of every round across every race, in save order.
  // The chart's unit is now a round (one 3-uma run on one track), not a
  // whole race/match.
  const rounds = useMemo(() => flattenRounds(races), [races]);
  const maxPts = useMemo(() => Math.max(...rounds.flatMap(r => r.results.map(e => e.pts)), 1), [rounds]);

  return /*#__PURE__*/React.createElement("div", {
    style: { display: "flex", flexDirection: "column", gap: 12 }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: { position: "relative" }
  }, /*#__PURE__*/React.createElement("select", {
    value: focus || "",
    onChange: e => setFocus(e.target.value || null),
    style: {
      width: "100%", appearance: "none", WebkitAppearance: "none", background: C.faint,
      border: `1px solid ${focus ? (TYPE_COLOR[sorted.find(s => s.name === focus)?.primaryType] || C.accent) + "66" : C.border2}`,
      borderRadius: 10,
      color: focus ? TYPE_COLOR[sorted.find(s => s.name === focus)?.primaryType] || C.accent : C.text,
      padding: "9px 30px 9px 13px", fontSize: 13, fontWeight: 700, cursor: "pointer", outline: "none", letterSpacing: "0.02em"
    }
  }, /*#__PURE__*/React.createElement("option", { value: "" }, "All Competitors"),
     allNames.map(n => /*#__PURE__*/React.createElement("option", { key: n, value: n }, n))
  ), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none",
      color: focus ? TYPE_COLOR[sorted.find(s => s.name === focus)?.primaryType] || C.accent : C.muted
    }
  }, /*#__PURE__*/React.createElement(Icon, { name: "chevronDown", size: 13 })))),

  /*#__PURE__*/React.createElement("div", {
    style: { display: "flex", alignItems: "center", gap: 10, fontSize: 10.5, color: C.muted, flexWrap: "wrap" }
  },
    /*#__PURE__*/React.createElement("span", { style: { fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" } }, "Momentum"),
    /*#__PURE__*/React.createElement(MomentumBadge, { momentum: { pctPerRace: 5, racesUsed: 0 } }),
    /*#__PURE__*/React.createElement(MomentumBadge, { momentum: { pctPerRace: 0, racesUsed: 0 } }),
    /*#__PURE__*/React.createElement(MomentumBadge, { momentum: { pctPerRace: -5, racesUsed: 0 } }),
    /*#__PURE__*/React.createElement("span", null, `over last ${MOMENTUM_WINDOW} rounds, min ${MOMENTUM_MIN_RACES}`)
  ),

  display.map((name, idx) => {
    const s = sorted.find(x => x.name === name);
    if (!s) return null;
    const tc = TYPE_COLOR[s.primaryType] || C.accent;
    const scoresByRound = rounds.map(r => r.results.find(e => e.name === name)?.pts ?? null);
    const chronological = scoresByRound.filter(v => v !== null);
    const momentum = computeMomentum(chronological);
    return /*#__PURE__*/React.createElement("div", {
      key: name, className: "anim-slide",
      style: { animationDelay: `${Math.min(idx, 12) * 30}ms`, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px" }
    },
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } },
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", minWidth: 0, rowGap: 4 } },
          /*#__PURE__*/React.createElement(UmaAvatar, { name, type: s.primaryType, size: 40 }),
          /*#__PURE__*/React.createElement("span", {
            style: { fontWeight: 800, fontSize: 14, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 150 }
          }, name),
          /*#__PURE__*/React.createElement(Pill, { type: s.primaryType }),
          /*#__PURE__*/React.createElement(MomentumBadge, { momentum })
        ),
        /*#__PURE__*/React.createElement("div", { style: { textAlign: "right" } },
          /*#__PURE__*/React.createElement("span", { style: { fontSize: 11, color: C.muted } }, "avg "),
          /*#__PURE__*/React.createElement("span", { style: { fontSize: 12, fontWeight: 800, color: tc } }, Math.round(s.avg).toLocaleString())
        )
      ),

      /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 3, alignItems: "flex-end", height: 56 } },
        scoresByRound.map((pts, i) => {
          if (pts === null) return /*#__PURE__*/React.createElement("div", {
            key: i, style: { flex: 1, height: 5, background: C.faint, borderRadius: 2, alignSelf: "flex-end" }
          });
          const h = Math.max(5, Math.round(pts / maxPts * 56));
          const isPeak = pts === s.best;
          const isWorst = pts === s.worst;
          const barColor = isPeak ? tc : isWorst ? "#374151" : tc + "55";
          return /*#__PURE__*/React.createElement("div", {
            key: i, style: { flex: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", position: "relative" }
          },
            isPeak && /*#__PURE__*/React.createElement("div", { style: { position: "absolute", top: -2, color: tc, lineHeight: 1 } },
              /*#__PURE__*/React.createElement(Icon, { name: "arrowUp", size: 9, strokeWidth: 3 })),
            isWorst && /*#__PURE__*/React.createElement("div", { style: { position: "absolute", top: -2, color: "#f87171", lineHeight: 1 } },
              /*#__PURE__*/React.createElement(Icon, { name: "arrowDown", size: 9, strokeWidth: 3 })),
            /*#__PURE__*/React.createElement("div", {
              className: "bar-grow-v",
              style: { width: "100%", height: h, background: barColor, borderRadius: "2px 2px 0 0", animationDelay: `${i * 15}ms`, boxShadow: isPeak ? `0 0 8px ${tc}88` : undefined }
            })
          );
        })
      ),

      /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 3, marginTop: 4 } },
        rounds.map((_, i) => {
          const n = rounds.length;
          const skip = n > 20 ? 5 : n > 10 ? 2 : 1;
          const show = i === 0 || i === n - 1 || (i + 1) % skip === 0;
          return /*#__PURE__*/React.createElement("div", { key: i, style: { flex: 1, position: "relative", height: 10 } },
            show && /*#__PURE__*/React.createElement("div", {
              style: { position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)", textAlign: "center", fontSize: 8, color: C.muted, whiteSpace: "nowrap" }
            }, `${i + 1}`)
          );
        })
      ),

      /*#__PURE__*/React.createElement("div", {
        style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }
      }, [
        ["Peak", s.best.toLocaleString(), tc],
        ["Win Rate", `${(s.winRate * 100).toFixed(0)}%`, s.winRate >= 0.3 ? "#34d399" : s.winRate >= 0.1 ? "#38bdf8" : C.muted],
        ["Low", s.worst.toLocaleString(), "#f87171"],
        ["Wins", s.wins, "#fbbf24"],
        ["Losses", s.losses, "#f87171"],
        ["Best Track", s.bestTrack ? s.bestTrack.venue : "\u2013", "#34d399"]
      ].map(([l, v, clr]) => /*#__PURE__*/React.createElement("div", { key: l },
        /*#__PURE__*/React.createElement("div", { style: { fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" } }, l),
        /*#__PURE__*/React.createElement("div", { style: { fontSize: 13, fontWeight: 800, color: clr } }, v)
      )))
    );
  }));
}
