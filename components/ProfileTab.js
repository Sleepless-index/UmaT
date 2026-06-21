// ─── Tab: Profile ───────────────────────────────────────────────────────────
function ProfileTab({ races, stats, trialClass, setTrialClass }) {
  // Wins/losses are now counted at the round level — a race (match) doesn't
  // have one outcome since each of its rounds is independently won or lost.
  const allRounds = races.flatMap(r => r.rounds || []);
  const wins = allRounds.filter(r => r.outcome === "win").length;
  const losses = allRounds.filter(r => r.outcome === "loss").length;
  const decided = wins + losses;
  const winRate = decided ? wins / decided : 0;
  const totalPoints = allRounds.reduce((sum, r) => sum + r.results.reduce((s, e) => s + e.pts, 0), 0);
  const avgRoundTotal = allRounds.length ? totalPoints / allRounds.length : 0;

  // Avg margin: gap between your own 1st and 2nd within a round, as a %.
  // The opponent's results aren't tracked, so this reflects internal team
  // spread rather than your margin over the actual field.
  const margins = allRounds.map(r => {
    const sorted = [...r.results].sort((a, b) => b.pts - a.pts);
    const a = sorted[0]?.pts, b = sorted[1]?.pts;
    return a && b ? (a - b) / a * 100 : null;
  }).filter(v => v !== null);
  const avgMargin = margins.length ? margins.reduce((a, b) => a + b, 0) / margins.length : 0;

  // Top performer & most consistent
  const topPerformer = [...stats].sort((a, b) => b.total - a.total)[0];
  const mostConsistent = stats.filter(s => s.roundCount > 1).sort((a, b) => a.sigma - b.sigma)[0];
  const bestWinRate = [...stats].sort((a, b) => b.winRate - a.winRate)[0];
  const cls = CLASS_INFO[trialClass];

  return /*#__PURE__*/React.createElement("div", {
    style: { display: "flex", flexDirection: "column", gap: 12 }
  },
    /*#__PURE__*/React.createElement("div", {
      style: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 13, padding: "14px" }
    },
      /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 } }, "Team Trial Class"),
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 6 } },
        [1, 2, 3, 4, 5, 6].map(n => {
          const active = trialClass === n;
          const c = CLASS_INFO[n].color;
          return /*#__PURE__*/React.createElement("button", {
            key: n, onClick: () => setTrialClass(n),
            style: {
              flex: 1, padding: "12px 0", borderRadius: 10, border: `1px solid ${active ? c : C.border2}`,
              background: active ? c + "22" : C.faint, color: active ? c : C.muted,
              fontWeight: 900, fontSize: 15, cursor: "pointer", transition: "all 0.15s",
              boxShadow: active ? `0 0 12px ${c}44` : "none"
            }
          }, n);
        })
      ),
      /*#__PURE__*/React.createElement("div", { style: { marginTop: 8, fontSize: 12, color: C.muted } },
        "Currently in ", /*#__PURE__*/React.createElement("span", { style: { color: cls.color, fontWeight: 800 } }, cls.label)
      )
    ),

    /*#__PURE__*/React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 } },
      /*#__PURE__*/React.createElement("div", { style: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, padding: "12px 10px", textAlign: "center" } },
        /*#__PURE__*/React.createElement("div", { style: { fontSize: 20, fontWeight: 900, color: "#34d399", lineHeight: 1 } }, wins),
        /*#__PURE__*/React.createElement("div", { style: { fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 } }, "Round Wins")
      ),
      /*#__PURE__*/React.createElement("div", { style: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, padding: "12px 10px", textAlign: "center" } },
        /*#__PURE__*/React.createElement("div", { style: { fontSize: 20, fontWeight: 900, color: "#f87171", lineHeight: 1 } }, losses),
        /*#__PURE__*/React.createElement("div", { style: { fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 } }, "Round Losses")
      ),
      /*#__PURE__*/React.createElement("div", { style: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, padding: "12px 10px", textAlign: "center" } },
        /*#__PURE__*/React.createElement("div", { style: { fontSize: 20, fontWeight: 900, color: C.accent, lineHeight: 1 } }, (winRate * 100).toFixed(0), "%"),
        /*#__PURE__*/React.createElement("div", { style: { fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 } }, "Win Rate")
      )
    ),

    /*#__PURE__*/React.createElement("div", { style: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 13, padding: "14px" } },
      /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 } }, "Season Totals"),
      /*#__PURE__*/React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } },
        /*#__PURE__*/React.createElement(StatBox, { label: "Races Recorded", value: races.length, color: C.text }),
        /*#__PURE__*/React.createElement(StatBox, { label: "Rounds Recorded", value: allRounds.length, color: C.text }),
        /*#__PURE__*/React.createElement(StatBox, { label: "Total Points", value: totalPoints.toLocaleString(), color: C.accent }),
        /*#__PURE__*/React.createElement(StatBox, { label: "Avg Round Total", value: Math.round(avgRoundTotal).toLocaleString(), color: "#38bdf8" }),
        /*#__PURE__*/React.createElement(StatBox, {
          label: "Avg Team Spread", value: `${avgMargin.toFixed(1)}%`,
          color: avgMargin >= 20 ? "#34d399" : avgMargin >= 8 ? "#fbbf24" : "#f87171"
        })
      )
    ),

    stats.length > 0 && /*#__PURE__*/React.createElement("div", { style: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 13, padding: "14px" } },
      /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 } }, "Highlights"),
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
        topPerformer && /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
          /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
            /*#__PURE__*/React.createElement("div", { style: { width: 28, height: 28, borderRadius: 8, background: C.accentLo, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
              /*#__PURE__*/React.createElement(Icon, { name: "trophy", size: 14, color: C.accent })),
            /*#__PURE__*/React.createElement("div", null,
              /*#__PURE__*/React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: C.text } }, topPerformer.name),
              /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, color: C.muted } }, "Top scorer overall"))
          ),
          /*#__PURE__*/React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: C.accent } }, topPerformer.total.toLocaleString())
        ),
        mostConsistent && /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
          /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
            /*#__PURE__*/React.createElement("div", { style: { width: 28, height: 28, borderRadius: 8, background: "#38bdf822", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
              /*#__PURE__*/React.createElement(Icon, { name: "target", size: 14, color: "#38bdf8" })),
            /*#__PURE__*/React.createElement("div", null,
              /*#__PURE__*/React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: C.text } }, mostConsistent.name),
              /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, color: C.muted } }, "Most consistent placing"))
          ),
          /*#__PURE__*/React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: "#38bdf8" } }, "\u03c3 ", mostConsistent.sigma.toFixed(2))
        ),
        bestWinRate && bestWinRate.wins > 0 && /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
          /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
            /*#__PURE__*/React.createElement("div", { style: { width: 28, height: 28, borderRadius: 8, background: "#34d39922", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
              /*#__PURE__*/React.createElement(Icon, { name: "zap", size: 14, color: "#34d399" })),
            /*#__PURE__*/React.createElement("div", null,
              /*#__PURE__*/React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: C.text } }, bestWinRate.name),
              /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, color: C.muted } }, "Highest win rate"))
          ),
          /*#__PURE__*/React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: "#34d399" } }, (bestWinRate.winRate * 100).toFixed(0), "%")
        )
      )
    )
  );
}
