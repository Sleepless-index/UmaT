// ─── Import Round Preview ───────────────────────────────────────────────────
// One round's preview row inside the batch import flow: shows the matched
// track (or a "needs track" state with a picker fallback), a manual
// win/loss toggle (pasted text never carries outcome), and the parsed
// uma/points entries for that round.
function ImportRoundPreview({ round, onTrackChange, onOutcomeChange, onPickTrack }) {
  const track = round.track ? TRACK_BY_ID[round.track] : null;
  const tc = track ? (TYPE_COLOR[track.type] || C.accent) : "#f87171";
  const needsTrack = !round.track;

  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.card, border: `1px solid ${needsTrack ? "#ef444466" : C.border}`,
      borderRadius: 11, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8
    }
  },
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
      needsTrack
        ? /*#__PURE__*/React.createElement(Icon, { name: "alertTriangle", size: 14, color: "#f87171", style: { flexShrink: 0 } })
        : /*#__PURE__*/React.createElement(Icon, { name: "flag", size: 14, color: tc, style: { flexShrink: 0 } }),
      /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
        track
          ? /*#__PURE__*/React.createElement(React.Fragment, null,
              /*#__PURE__*/React.createElement("span", { style: { fontWeight: 800, fontSize: 12.5, color: C.text } },
                `${track.venue} \u00b7 ${track.distance}m \u00b7 ${track.surface}`),
              round.matchConfidence === "fuzzy" && /*#__PURE__*/React.createElement("span", {
                style: { fontSize: 10, color: "#fbbf24", fontWeight: 700, marginLeft: 6 }
              }, "(best guess)")
            )
          : /*#__PURE__*/React.createElement("span", { style: { fontSize: 12.5, color: "#f87171", fontWeight: 700 } },
              round.rawTrackText ? `"${round.rawTrackText}" not recognized` : "No track specified"
            )
      ),
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 5, flexShrink: 0 } },
        /*#__PURE__*/React.createElement("button", {
          onClick: () => onOutcomeChange("win"), className: "tap",
          style: {
            padding: "4px 9px", borderRadius: 6, cursor: "pointer", fontWeight: 800, fontSize: 10,
            border: `1px solid ${round.outcome === "win" ? "#34d399" : C.border2}`,
            background: round.outcome === "win" ? "#34d39922" : C.faint,
            color: round.outcome === "win" ? "#34d399" : C.muted
          }
        }, "Win"),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => onOutcomeChange("loss"), className: "tap",
          style: {
            padding: "4px 9px", borderRadius: 6, cursor: "pointer", fontWeight: 800, fontSize: 10,
            border: `1px solid ${round.outcome === "loss" ? "#f87171" : C.border2}`,
            background: round.outcome === "loss" ? "#f8717122" : C.faint,
            color: round.outcome === "loss" ? "#f87171" : C.muted
          }
        }, "Loss")
      )
    ),
    needsTrack && /*#__PURE__*/React.createElement("button", {
      onClick: onPickTrack, className: "tap row-hover",
      style: {
        background: C.faint, border: `1px solid #ef444466`, borderRadius: 8, padding: "7px 10px",
        display: "flex", alignItems: "center", gap: 6, cursor: "pointer", width: "100%",
        textAlign: "left", font: "inherit", color: "#fca5a5", fontSize: 11.5, fontWeight: 700
      }
    }, /*#__PURE__*/React.createElement(Icon, { name: "flag", size: 12 }), "Pick track manually"),
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4 } },
      round.results.map((e, i) => /*#__PURE__*/React.createElement("div", {
        key: i, style: { display: "flex", alignItems: "center", gap: 8 }
      },
        /*#__PURE__*/React.createElement("span", { style: { width: 16, textAlign: "center", fontSize: 10, fontWeight: 800, color: C.muted } }, i + 1),
        /*#__PURE__*/React.createElement(UmaAvatar, { name: e.name, type: track ? track.type : "Mile", size: 26 }),
        /*#__PURE__*/React.createElement("span", {
          style: { flex: 1, fontSize: 12, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
        }, e.name),
        /*#__PURE__*/React.createElement("span", { style: { fontSize: 12, fontWeight: 800, color: tc } }, e.pts.toLocaleString())
      ))
    )
  );
}
