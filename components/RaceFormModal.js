// ─── Race Form Modal (Add / Edit) ──────────────────────────────────────────
// A race ("match") is always exactly 5 rounds, each with its own track and
// exactly 3 of your umas (the opponent's 3 aren't tracked — see RoundCard).
// Paste/batch import is handled separately and isn't wired in here.

const ROUNDS_PER_RACE = 5;

function RaceFormModal({ onSave, onClose, nextLabel, editingRace }) {
  const isEdit = !!editingRace;
  const [label, setLabel] = useState(editingRace?.label || nextLabel);
  const [error, setError] = useState("");
  const [pickerForRound, setPickerForRound] = useState(null); // round index currently picking a track

  const makeRounds = () => {
    if (editingRace) {
      const fromRace = editingRace.rounds.map(r => ({
        id: r.id || uid(),
        track: r.track ?? null,
        outcome: r.outcome || "win",
        results: (r.results && r.results.length ? r.results : Array.from({ length: ROUND_ROW_COUNT }, () => ({ name: "", pts: "" })))
          .map(e => ({ name: e.name || "", pts: e.pts != null ? String(e.pts) : "" }))
      }));
      while (fromRace.length < ROUNDS_PER_RACE) fromRace.push(makeEmptyRound());
      return fromRace;
    }
    return Array.from({ length: ROUNDS_PER_RACE }, () => makeEmptyRound());
  };
  const [rounds, setRounds] = useState(makeRounds);

  function updateRound(i, next) {
    setRounds(rs => rs.map((r, idx) => idx === i ? next : r));
  }
  function selectTrack(roundIndex, trackId) {
    setRounds(rs => rs.map((r, idx) => idx === roundIndex ? { ...r, track: trackId } : r));
    setPickerForRound(null);
  }

  function save() {
    if (!label.trim()) {
      setError("Race name is required");
      return;
    }
    // A round only counts if it has a track selected and at least one
    // uma entry filled in — fully empty rounds are skipped silently
    // (lets the form be saved even if not every round happened yet).
    // Check the more specific "has data but no track" case FIRST, since
    // a round in that state would otherwise just look like an empty
    // round once usableRounds filters it out below.
    const missingTrack = rounds.findIndex(r => !r.track && r.results.some(e => e.name.trim() || e.pts !== ""));
    if (missingTrack !== -1) {
      setError(`Round ${missingTrack + 1} has entries but no track selected`);
      return;
    }
    const usableRounds = rounds.filter(r => r.track && r.results.some(e => e.name.trim() && e.pts !== ""));
    if (usableRounds.length === 0) {
      setError("Add at least one round with a track and results");
      return;
    }
    const badPts = usableRounds.some(r => r.results.some(e => e.name.trim() && e.pts !== "" && isNaN(parseInt(e.pts))));
    if (badPts) {
      setError("Some points values look invalid");
      return;
    }

    const cleanedRounds = usableRounds.map(r => ({
      id: r.id,
      track: r.track,
      outcome: r.outcome,
      results: r.results
        .filter(e => e.name.trim() && e.pts !== "")
        .map(e => ({ name: e.name.trim(), pts: parseInt(e.pts) }))
        .sort((a, b) => b.pts - a.pts)
    }));

    onSave({
      id: editingRace ? editingRace.id : uid(),
      label: label.trim(),
      rounds: cleanedRounds
    });
  }

  const inputStyle = {
    background: C.faint, border: `1px solid ${C.border2}`, borderRadius: 7,
    color: C.text, padding: "8px 9px", fontSize: 13, outline: "none",
    width: "100%", boxSizing: "border-box", transition: "border-color 0.15s"
  };

  const missingTrackIdx = (() => {
    if (!error) return -1;
    return rounds.findIndex(r => !r.track && r.results.some(e => e.name.trim() || e.pts !== ""));
  })();

  return /*#__PURE__*/React.createElement("div", {
    className: "anim-fade",
    style: { position: "fixed", inset: 0, background: "#000b", zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "flex-end" },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "anim-sheet",
    style: {
      background: C.surface, borderRadius: "18px 18px 0 0", border: `1px solid ${C.border}`,
      maxHeight: "min(92vh, calc(92dvh - env(safe-area-inset-bottom)))",
      display: "flex", flexDirection: "column"
    }
  },
    /*#__PURE__*/React.createElement("div", {
      style: { padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }
    },
      /*#__PURE__*/React.createElement("span", { style: { fontWeight: 800, fontSize: 16, color: C.text, display: "flex", alignItems: "center", gap: 8 } },
        /*#__PURE__*/React.createElement(Icon, { name: isEdit ? "pencil" : "plus", size: 16, color: C.accent }),
        isEdit ? "Edit Race" : "Add Race"
      ),
      /*#__PURE__*/React.createElement("button", {
        onClick: onClose, className: "tap",
        style: { background: C.faint, border: "none", color: C.muted, borderRadius: 7, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }
      }, /*#__PURE__*/React.createElement(Icon, { name: "x", size: 15 }))
    ),

    /*#__PURE__*/React.createElement("div", {
      style: { overflow: "auto", padding: "14px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }
    },
      /*#__PURE__*/React.createElement("div", null,
        /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 } }, "Race Name"),
        /*#__PURE__*/React.createElement("input", {
          value: label, onChange: e => setLabel(e.target.value), placeholder: "e.g. Race 11", style: inputStyle
        })
      ),

      rounds.map((round, i) => /*#__PURE__*/React.createElement(RoundCard, {
        key: round.id,
        index: i,
        round,
        onChange: next => updateRound(i, next),
        onPickTrack: () => setPickerForRound(i),
        error: i === missingTrackIdx
      })),

      error && /*#__PURE__*/React.createElement("div", {
        className: "anim-fade",
        style: { background: "#450a0a33", border: "1px solid #ef444466", borderRadius: 8, padding: "10px 12px", color: "#fca5a5", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }
      }, /*#__PURE__*/React.createElement(Icon, { name: "alertTriangle", size: 15, style: { flexShrink: 0 } }), error)
    ),

    /*#__PURE__*/React.createElement("div", {
      style: { padding: "14px 18px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: save, className: "tap",
      style: {
        width: "100%", padding: "13px", borderRadius: 11,
        background: `linear-gradient(135deg,${C.accent},#8b5cf6)`, border: "none", color: "#fff",
        fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: `0 4px 20px ${C.accent}44`, letterSpacing: "0.02em"
      }
    }, isEdit ? "Save Changes" : "Save Race"))
  ),
    pickerForRound !== null && /*#__PURE__*/React.createElement(TrackPickerModal, {
      value: rounds[pickerForRound].track,
      onSelect: trackId => selectTrack(pickerForRound, trackId),
      onClose: () => setPickerForRound(null)
    })
  );
}
