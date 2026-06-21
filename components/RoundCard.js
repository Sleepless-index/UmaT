// ─── Round Card ─────────────────────────────────────────────────────────────
// One round within RaceFormModal: a track (selected via TrackPicker), a
// manual win/loss toggle for that round, and exactly 3 uma rows (your team
// only — the opponent's 3 aren't tracked). Placement shown per row ranks
// only these 3 against each other, not the full 6-runner field.

const ROUND_ROW_COUNT = 3;

function RoundCard({ index, round, onChange, onPickTrack, error }) {
  const track = round.track ? TRACK_BY_ID[round.track] : null;

  function updateRow(i, field, val) {
    const results = round.results.map((r, idx) => idx === i ? { ...r, [field]: val } : r);
    onChange({ ...round, results });
  }
  function setOutcome(outcome) {
    onChange({ ...round, outcome });
  }

  // Rank this round's 3 rows by points (own-team placement only).
  const rankOf = useMemo(() => {
    const valid = round.results
      .map((r, idx) => ({ idx, pts: parseInt(r.pts) }))
      .filter(r => round.results[r.idx].name.trim() && round.results[r.idx].pts !== "" && !isNaN(r.pts));
    valid.sort((a, b) => b.pts - a.pts);
    const map = {};
    valid.forEach((r, i) => { map[r.idx] = i + 1; });
    return map;
  }, [round.results]);

  const inputStyle = {
    background: C.faint, border: `1px solid ${C.border2}`, borderRadius: 7,
    color: C.text, padding: "7px 8px", fontSize: 12, outline: "none",
    width: "100%", boxSizing: "border-box"
  };

  const tc = track ? (TYPE_COLOR[track.type] || C.accent) : C.muted;

  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.card, border: `1px solid ${error ? "#ef444466" : C.border}`,
      borderRadius: 13, padding: "12px", display: "flex", flexDirection: "column", gap: 10
    }
  },
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
      /*#__PURE__*/React.createElement("span", {
        style: {
          width: 22, height: 22, borderRadius: 6, background: tc + "22", color: tc,
          fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center",
          justifyContent: "center", flexShrink: 0
        }
      }, index + 1),
      /*#__PURE__*/React.createElement("span", { style: { fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" } },
        `Round ${index + 1}`
      ),
      /*#__PURE__*/React.createElement("div", { style: { flex: 1 } }),
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 5 } },
        /*#__PURE__*/React.createElement("button", {
          onClick: () => setOutcome("win"), className: "tap",
          style: {
            padding: "5px 10px", borderRadius: 7, cursor: "pointer", fontWeight: 800, fontSize: 11,
            border: `1px solid ${round.outcome === "win" ? "#34d399" : C.border2}`,
            background: round.outcome === "win" ? "#34d39922" : C.faint,
            color: round.outcome === "win" ? "#34d399" : C.muted
          }
        }, "Win"),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => setOutcome("loss"), className: "tap",
          style: {
            padding: "5px 10px", borderRadius: 7, cursor: "pointer", fontWeight: 800, fontSize: 11,
            border: `1px solid ${round.outcome === "loss" ? "#f87171" : C.border2}`,
            background: round.outcome === "loss" ? "#f8717122" : C.faint,
            color: round.outcome === "loss" ? "#f87171" : C.muted
          }
        }, "Loss")
      )
    ),

    /*#__PURE__*/React.createElement(TrackPickerButton, {
      trackId: round.track,
      onClick: () => onPickTrack(index),
      hasError: !!error
    }),

    /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
      round.results.map((row, i) => {
        const rank = rankOf[i];
        return /*#__PURE__*/React.createElement("div", {
          key: i,
          style: { display: "grid", gridTemplateColumns: "22px 30px 1fr 76px", gap: "0 6px", alignItems: "center" }
        },
          /*#__PURE__*/React.createElement(RankBadge, { rank }),
          /*#__PURE__*/React.createElement(UmaAvatar, { name: row.name || `Uma ${i + 1}`, type: track ? track.type : "Mile", size: 30 }),
          /*#__PURE__*/React.createElement("input", {
            value: row.name,
            onChange: e => updateRow(i, "name", e.target.value),
            placeholder: `Uma ${i + 1}`,
            style: inputStyle
          }),
          /*#__PURE__*/React.createElement("input", {
            value: row.pts,
            onChange: e => updateRow(i, "pts", e.target.value),
            placeholder: "0",
            type: "number",
            style: inputStyle
          })
        );
      })
    )
  );
}

function makeEmptyRound() {
  return {
    id: uid(),
    track: null,
    outcome: "win",
    results: Array.from({ length: ROUND_ROW_COUNT }, () => ({ name: "", pts: "" }))
  };
}
