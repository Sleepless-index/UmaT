// ─── Batch Import (multi-file drop, round/track aware) ─────────────────────
// Each file represents one race (up to 5 rounds). A file's text can start
// with a header declaring which track each lane runs on, followed by
// 3-line entry blocks (Name / Points / Lane keyword).

function naturalFileSort(a, b) {
  const an = a.name.match(/(\d+)(?!.*\d)/);
  const bn = b.name.match(/(\d+)(?!.*\d)/);
  if (an && bn) return parseInt(an[1]) - parseInt(bn[1]);
  return a.name.localeCompare(b.name);
}

// TSV export: rows = uma names, columns = one per race×lane in lane order.
// Column header format: "Race1·Dirt", "Race1·Mile", etc.
// Each uma appears in exactly one lane per race, so each row has at most
// one non-empty cell per race-column-group.
function buildTsvFromRaces(parsedFiles) {
  const LANE_ORDER = ["Sprint", "Mile", "Medium", "Long", "Dirt"];
  // Collect all column headers in file order, then lane order within each file.
  const cols = []; // [{fileLabel, lane, roundRef}]
  parsedFiles.forEach(f => {
    const byLane = {};
    f.rounds.forEach(r => { if (r.lane) byLane[r.lane] = r; });
    LANE_ORDER.forEach(lane => {
      if (byLane[lane]) cols.push({ fileLabel: f.fileName.replace(/\.[^.]+$/, ""), lane, round: byLane[lane] });
    });
  });
  if (!cols.length) return "";

  // Collect all unique uma names, preserving first-appearance order.
  const nameSet = new Set();
  cols.forEach(c => c.round.results.forEach(e => nameSet.add(e.name)));
  const names = [...nameSet];

  const header = cols.map(c => `${c.fileLabel}\u00b7${c.lane}`).join("\t");
  const rows = names.map(name => {
    const cells = cols.map(c => {
      const hit = c.round.results.find(e => e.name === name);
      return hit ? hit.pts.toLocaleString() : "";
    });
    return `${name}\t${cells.join("\t")}`;
  });
  return [header, ...rows].join("\n");
}

function BatchImportModal({ onApplyAll, onClose }) {
  const [files, setFiles] = useState([]); // [{name, text}]
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy TSV");
  // Per-file, per-round overrides (track fix / outcome), keyed by
  // `${fileName}__${roundIndex}`.
  const [overrides, setOverrides] = useState({});
  const [pickerFor, setPickerFor] = useState(null); // {fileName, roundIndex} | null

  const parsedFiles = useMemo(() => {
    return [...files].sort(naturalFileSort).map(f => {
      const parsed = parseImportText(f.text);
      const rounds = parsed.rounds.map((r, i) => {
        const key = `${f.name}__${i}`;
        const ov = overrides[key] || {};
        return {
          ...r,
          track: ov.track !== undefined ? ov.track : r.track,
          outcome: ov.outcome || "win"
        };
      });
      return { fileName: f.name, rounds };
    });
  }, [files, overrides]);

  const races = useMemo(() => {
    return parsedFiles
      .filter(f => f.rounds.length > 0)
      .map(f => ({
        id: uid(),
        label: f.fileName.replace(/\.[^.]+$/, ""),
        rounds: f.rounds
          .filter(r => r.track && r.results.length > 0)
          .map(r => ({
            id: uid(),
            track: r.track,
            outcome: r.outcome,
            results: [...r.results].sort((a, b) => b.pts - a.pts)
          }))
      }))
      .filter(r => r.rounds.length > 0);
  }, [parsedFiles]);

  const tsv = useMemo(() => parsedFiles.length ? buildTsvFromRaces(parsedFiles) : "", [parsedFiles]);

  const totalRounds = parsedFiles.reduce((s, f) => s + f.rounds.length, 0);
  const unmatchedCount = parsedFiles.reduce((s, f) => s + f.rounds.filter(r => !r.track).length, 0);

  function handleFiles(fileList) {
    const incoming = Array.from(fileList).filter(f => /\.(md|txt)$/i.test(f.name));
    if (!incoming.length) {
      setError("No .md or .txt files found in your selection");
      return;
    }
    setError("");
    Promise.all(incoming.map(f => f.text().then(text => ({ name: f.name, text })))).then(results => {
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
  function setRoundOverride(fileName, roundIndex, patch) {
    const key = `${fileName}__${roundIndex}`;
    setOverrides(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));
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
  function handleApply() {
    if (races.length === 0) {
      setError(unmatchedCount > 0
        ? "Some rounds still need a track — fix them or remove the file"
        : "Drop or select some race files first");
      return;
    }
    onApplyAll(races);
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "anim-fade",
    style: { position: "fixed", inset: 0, background: "#000b", zIndex: 110, display: "flex", flexDirection: "column", justifyContent: "flex-end" },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "anim-sheet",
    style: { background: C.surface, borderRadius: "18px 18px 0 0", border: `1px solid ${C.border}`, maxHeight: "min(92vh, calc(92dvh - env(safe-area-inset-bottom)))", display: "flex", flexDirection: "column" }
  },
    /*#__PURE__*/React.createElement("div", {
      style: { padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }
    },
      /*#__PURE__*/React.createElement("span", { style: { fontWeight: 800, fontSize: 16, color: C.text, display: "flex", alignItems: "center", gap: 8 } },
        /*#__PURE__*/React.createElement(Icon, { name: "upload", size: 16, color: C.accent }), "Batch Import Races"),
      /*#__PURE__*/React.createElement("button", {
        onClick: onClose, className: "tap",
        style: { background: C.faint, border: "none", color: C.muted, borderRadius: 7, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }
      }, /*#__PURE__*/React.createElement(Icon, { name: "x", size: 15 }))
    ),

    /*#__PURE__*/React.createElement("div", {
      style: { overflow: "auto", padding: "14px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }
    },
      /*#__PURE__*/React.createElement("div", {
        style: { background: C.faint, border: `1px solid ${C.border2}`, borderRadius: 10, padding: "9px 12px", fontSize: 11.5, color: C.muted, lineHeight: 1.5 }
      },
        /*#__PURE__*/React.createElement("div", { style: { color: C.text, fontWeight: 700, marginBottom: 4 } }, "Drop one file per race (.md or .txt)"),
        "Header: one line per round as ",
        /*#__PURE__*/React.createElement("code", { style: { fontFamily: "monospace" } }, "Lane - Track"),
        " (e.g. ",
        /*#__PURE__*/React.createElement("code", { style: { fontFamily: "monospace" } }, "Dirt - Chukyo Dirt 1800m"),
        "). Then 3-line blocks: Name / Points / Lane keyword (Sprint, Mile, Medium, Long, Dirt)."
      ),

      /*#__PURE__*/React.createElement("div", {
        onDragOver: e => { e.preventDefault(); setDragOver(true); },
        onDragLeave: () => setDragOver(false),
        onDrop: handleDrop,
        style: { border: `2px dashed ${dragOver ? C.accent : C.border2}`, borderRadius: 12, padding: "26px 14px", textAlign: "center", background: dragOver ? C.accentLo : C.faint, transition: "all 0.15s" }
      },
        /*#__PURE__*/React.createElement(Icon, { name: "upload", size: 26, color: dragOver ? C.accent : C.muted, style: { marginBottom: 8 } }),
        /*#__PURE__*/React.createElement("div", { style: { color: C.text, fontWeight: 700, fontSize: 13, marginBottom: 4 } }, "Drag & drop race files here"),
        /*#__PURE__*/React.createElement("div", { style: { color: C.muted, fontSize: 12, marginBottom: 12 } }, "or"),
        /*#__PURE__*/React.createElement("label", {
          className: "tap",
          style: { display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, background: C.accent, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }
        }, "Choose Files", /*#__PURE__*/React.createElement("input", {
          type: "file", accept: ".md,.txt,text/markdown,text/plain", multiple: true,
          onChange: e => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ""; },
          style: { display: "none" }
        }))
      ),

      files.length > 0 && /*#__PURE__*/React.createElement("div", { className: "anim-fade" },
        /*#__PURE__*/React.createElement("div", {
          style: { fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }
        },
          files.length, " file", files.length !== 1 ? "s" : "", " \u2022 ", totalRounds, " round", totalRounds !== 1 ? "s" : "", " detected",
          unmatchedCount > 0 && /*#__PURE__*/React.createElement("span", { style: { color: "#f87171" } }, ` \u2022 ${unmatchedCount} need${unmatchedCount === 1 ? "s" : ""} a track`)
        ),
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } },
          parsedFiles.map(f => /*#__PURE__*/React.createElement("div", {
            key: f.fileName,
            style: { border: `1px solid ${C.border}`, borderRadius: 11, padding: "10px", background: C.surface }
          },
            /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 } },
              /*#__PURE__*/React.createElement("span", {
                style: { flex: 1, fontSize: 12.5, fontWeight: 800, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "monospace" }
              }, f.fileName),
              /*#__PURE__*/React.createElement("span", {
                style: { fontSize: 10.5, fontWeight: 700, color: f.rounds.length > 0 ? "#6ee7b7" : "#fca5a5" }
              }, f.rounds.length > 0 ? `${f.rounds.length} round${f.rounds.length !== 1 ? "s" : ""}` : "unrecognized"),
              /*#__PURE__*/React.createElement("button", {
                onClick: () => removeFile(f.fileName), className: "tap",
                style: { background: "transparent", border: "none", color: C.muted, cursor: "pointer", padding: 2, display: "flex" }
              }, /*#__PURE__*/React.createElement(Icon, { name: "x", size: 13 }))
            ),
            /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 7 } },
              f.rounds.map((round, ri) => /*#__PURE__*/React.createElement(ImportRoundPreview, {
                key: ri,
                round,
                onTrackChange: () => {},
                onOutcomeChange: outcome => setRoundOverride(f.fileName, ri, { outcome }),
                onPickTrack: () => setPickerFor({ fileName: f.fileName, roundIndex: ri })
              }))
            )
          ))
        )
      ),

      tsv && /*#__PURE__*/React.createElement("div", { className: "anim-fade" },
        /*#__PURE__*/React.createElement("div", {
          style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }
        },
          /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" } }, "TSV \u2014 paste into Sheets"),
          /*#__PURE__*/React.createElement("button", {
            onClick: copyTsv, className: "tap",
            style: { padding: "6px 12px", borderRadius: 7, background: C.faint, border: `1px solid ${C.border2}`, color: C.text, fontWeight: 700, fontSize: 11.5, cursor: "pointer" }
          }, copyLabel)
        ),
        /*#__PURE__*/React.createElement("textarea", {
          readOnly: true,
          value: tsv,
          rows: 6,
          onFocus: e => e.target.select(),
          style: {
            background: C.faint, border: `1px solid ${C.border2}`, borderRadius: 9,
            color: C.text, padding: "10px 12px", fontSize: 11, outline: "none",
            width: "100%", boxSizing: "border-box", resize: "vertical",
            fontFamily: "monospace", lineHeight: 1.5
          }
        })
      ),

      error && /*#__PURE__*/React.createElement("div", {
        className: "anim-fade",
        style: { background: "#450a0a33", border: "1px solid #ef444466", borderRadius: 8, padding: "10px 12px", color: "#fca5a5", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }
      }, /*#__PURE__*/React.createElement(Icon, { name: "alertTriangle", size: 15, style: { flexShrink: 0 } }), error)
    ),

    /*#__PURE__*/React.createElement("div", { style: { padding: "14px 18px", borderTop: `1px solid ${C.border}`, flexShrink: 0 } },
      /*#__PURE__*/React.createElement("button", {
        onClick: handleApply, disabled: races.length === 0, className: "tap",
        style: {
          width: "100%", padding: "13px", borderRadius: 11,
          background: races.length === 0 ? C.border2 : `linear-gradient(135deg,${C.accent},#8b5cf6)`,
          border: "none", color: races.length === 0 ? C.muted : "#fff", fontWeight: 800, fontSize: 15,
          cursor: races.length === 0 ? "default" : "pointer", boxShadow: races.length === 0 ? "none" : `0 4px 20px ${C.accent}44`, letterSpacing: "0.02em"
        }
      }, races.length > 0 ? `Add ${races.length} Race${races.length !== 1 ? "s" : ""} to Tracker` : "Add Races to Tracker")
    )
  ),
    pickerFor && /*#__PURE__*/React.createElement(TrackPickerModal, {
      value: null,
      onSelect: trackId => {
        setRoundOverride(pickerFor.fileName, pickerFor.roundIndex, { track: trackId });
        setPickerFor(null);
      },
      onClose: () => setPickerFor(null)
    })
  );
}
