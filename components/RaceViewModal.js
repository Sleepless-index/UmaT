// ─── Race View Modal ──────────────────────────────────────────────────────────
// A saved race is now a set of rounds, each on its own track with its own
// outcome and exactly 3 (of your) umas. Shown as stacked round sections
// rather than one flat ranked list.
function RaceViewModal({ race, onClose }) {
  if (!race) return null;
  const rounds = race.rounds || [];

  return /*#__PURE__*/React.createElement("div", {
    className: "anim-fade",
    style: { position: "fixed", inset: 0, background: "#000b", zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "flex-end" },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "anim-sheet",
    style: { background: C.surface, borderRadius: "18px 18px 0 0", border: `1px solid ${C.border}`, maxHeight: "min(88vh, calc(88dvh - env(safe-area-inset-bottom)))", display: "flex", flexDirection: "column" }
  },
    /*#__PURE__*/React.createElement("div", {
      style: { padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }
    },
      /*#__PURE__*/React.createElement("span", { style: { fontWeight: 800, fontSize: 16, color: C.text } }, race.label),
      /*#__PURE__*/React.createElement("button", {
        onClick: onClose, className: "tap",
        style: { background: C.faint, border: "none", color: C.muted, borderRadius: 7, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }
      }, /*#__PURE__*/React.createElement(Icon, { name: "x", size: 15 }))
    ),

    /*#__PURE__*/React.createElement("div", {
      style: { overflow: "auto", padding: "14px 18px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }
    },
      rounds.length === 0 && /*#__PURE__*/React.createElement("div", {
        style: { textAlign: "center", padding: "32px 12px", color: C.muted, fontSize: 13 }
      }, "No rounds recorded for this race"),

      rounds.map((round, ri) => {
        const track = TRACK_BY_ID[round.track];
        const tc = track ? (TYPE_COLOR[track.type] || C.accent) : C.muted;
        const max = round.results[0]?.pts || 1;
        const isWin = round.outcome !== "loss";
        return /*#__PURE__*/React.createElement("div", {
          key: round.id || ri,
          className: "anim-slide",
          style: { animationDelay: `${Math.min(ri, 8) * 30}ms`, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px" }
        },
          /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 } },
            /*#__PURE__*/React.createElement("span", {
              style: { width: 22, height: 22, borderRadius: 6, background: tc + "22", color: tc, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }
            }, ri + 1),
            /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
              /*#__PURE__*/React.createElement("div", { style: { fontSize: 13, fontWeight: 800, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } },
                track ? `${track.venue} \u00b7 ${track.distance}m \u00b7 ${track.surface}` : "Unknown track"
              ),
              track && /*#__PURE__*/React.createElement("div", { style: { fontSize: 10.5, color: tc, fontWeight: 700 } }, track.type)
            ),
            /*#__PURE__*/React.createElement("span", {
              style: {
                fontSize: 9.5, fontWeight: 800, padding: "3px 8px", borderRadius: 6, letterSpacing: "0.06em", textTransform: "uppercase",
                background: isWin ? "#34d39922" : "#f8717122", color: isWin ? "#34d399" : "#f87171",
                border: `1px solid ${isWin ? "#34d39944" : "#f8717144"}`
              }
            }, isWin ? "Win" : "Loss")
          ),
          /*#__PURE__*/React.createElement("div", null,
            round.results.map((e, i) => /*#__PURE__*/React.createElement("div", {
              key: e.name,
              style: { display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < round.results.length - 1 ? `1px solid ${C.border}` : "none" }
            },
              /*#__PURE__*/React.createElement("div", { style: { width: 22, flexShrink: 0, textAlign: "center" } }, /*#__PURE__*/React.createElement(Medal, { pos: i + 1 })),
              /*#__PURE__*/React.createElement(UmaAvatar, { name: e.name, type: track ? track.type : "Mile", size: 34 }),
              /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                /*#__PURE__*/React.createElement("div", { style: { fontWeight: 700, fontSize: 12.5, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 3 } }, e.name),
                /*#__PURE__*/React.createElement("div", { style: { height: 3, background: C.faint, borderRadius: 2, overflow: "hidden" } },
                  /*#__PURE__*/React.createElement("div", {
                    className: "bar-grow",
                    style: { width: `${e.pts / max * 100}%`, height: "100%", background: `linear-gradient(90deg,${tc}88,${tc})`, borderRadius: 2 }
                  })
                )
              ),
              /*#__PURE__*/React.createElement("span", { style: { fontWeight: 800, fontSize: 12.5, color: tc, flexShrink: 0 } }, e.pts.toLocaleString())
            ))
          )
        );
      })
    )
  ));
}
