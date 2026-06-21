// ─── app.js ───────────────────────────────────────────────────────────────────
// Top-level App component plus the pieces that haven't been split out into
// their own files yet: the icon picker, batch/paste import (deferred to a
// later stage — still uses the pre-round race shape internally), the
// Settings modal, and the Icon Roster section.
//
// Everything else (Icon, UmaAvatar, Pill, the tab components, the track
// picker, the round-based RaceFormModal, and all the data/stat helpers)
// now lives in data/*.js and components/*.js — see index.html for the
// load order.
const {
  useState,
  useEffect,
  useMemo
} = React;

function IconPickerModal({ uma, manifest, manifestError, currentSlug, onSelect, onReset, onClose }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return manifest;
    return manifest.filter(f => f.toLowerCase().includes(q));
  }, [manifest, query]);

  return /*#__PURE__*/React.createElement("div", {
    className: "anim-fade",
    style: {
      position: "fixed", inset: 0, background: "#000b", zIndex: 110,
      display: "flex", flexDirection: "column", justifyContent: "flex-end"
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "anim-sheet",
    style: {
      background: C.surface, borderRadius: "18px 18px 0 0",
      border: `1px solid ${C.border}`,
      maxHeight: "min(88vh, calc(88dvh - env(safe-area-inset-bottom)))",
      display: "flex", flexDirection: "column"
    }
  },
    /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "16px 18px", borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", gap: 12, flexShrink: 0
      }
    },
      /*#__PURE__*/React.createElement(UmaAvatar, { name: uma.name, type: uma.type, size: 38 }),
      /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
        /*#__PURE__*/React.createElement("div", {
          style: { fontWeight: 800, fontSize: 14.5, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
        }, uma.name),
        /*#__PURE__*/React.createElement("div", {
          style: { fontSize: 10.5, color: C.muted, fontFamily: "monospace", marginTop: 1 }
        }, "current: ", currentSlug, ".webp")
      ),
      /*#__PURE__*/React.createElement("button", {
        onClick: onClose, className: "tap",
        style: {
          background: C.faint, border: "none", color: C.muted, borderRadius: 7,
          width: 30, height: 30, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
        }
      }, /*#__PURE__*/React.createElement(Icon, { name: "x", size: 15 }))
    ),
    /*#__PURE__*/React.createElement("div", {
      style: { padding: "12px 18px", flexShrink: 0 }
    },
      /*#__PURE__*/React.createElement("input", {
        value: query,
        onChange: e => setQuery(e.target.value),
        placeholder: "Search icons…",
        style: {
          width: "100%", background: C.faint, border: `1px solid ${C.border2}`,
          borderRadius: 9, padding: "9px 12px", color: C.text,
          fontSize: 13, outline: "none", boxSizing: "border-box"
        }
      })
    ),
    /*#__PURE__*/React.createElement("div", {
      style: { overflow: "auto", padding: "0 18px 18px", flex: 1 }
    },
      manifestError && /*#__PURE__*/React.createElement("div", {
        style: {
          background: "#450a0a33", border: "1px solid #ef444466", borderRadius: 8,
          padding: "10px 12px", color: "#fca5a5", fontSize: 12.5, marginBottom: 12,
          display: "flex", alignItems: "center", gap: 8
        }
      }, /*#__PURE__*/React.createElement(Icon, { name: "alertTriangle", size: 14, style: { flexShrink: 0 } }),
         "Couldn't load icons/manifest.json from the server."),
      !manifestError && manifest.length === 0 && /*#__PURE__*/React.createElement("div", {
        style: { textAlign: "center", padding: "32px 12px", color: C.muted, fontSize: 13 }
      }, "No icons found. Add files to icons/ and run update_icon_manifest.js."),
      filtered.length > 0 && /*#__PURE__*/React.createElement("div", {
        style: {
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
          gap: 10
        }
      }, filtered.map(filename => {
        const slug = filename.replace(/\.[^.]+$/, "");
        const active = slug === currentSlug;
        return /*#__PURE__*/React.createElement("button", {
          key: filename,
          onClick: () => onSelect(filename),
          className: "tap",
          style: {
            display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
            background: active ? C.accent + "1a" : C.faint,
            border: `1.5px solid ${active ? C.accent : C.border2}`,
            borderRadius: 11, padding: "8px 4px 7px", cursor: "pointer"
          }
        },
          /*#__PURE__*/React.createElement("img", {
            src: `icons/${filename}`,
            alt: filename,
            loading: "lazy",
            decoding: "async",
            style: { width: 44, height: 44, borderRadius: 9, objectFit: "cover", background: C.card, display: "block" }
          }),
          /*#__PURE__*/React.createElement("span", {
            style: {
              fontSize: 9, color: active ? C.accent : C.muted, fontWeight: active ? 800 : 600,
              textAlign: "center", overflow: "hidden", textOverflow: "ellipsis",
              whiteSpace: "nowrap", width: "100%"
            }
          }, slug)
        );
      }))
    ),
    /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 18px calc(12px + env(safe-area-inset-bottom))",
        borderTop: `1px solid ${C.border}`, flexShrink: 0
      }
    },
      /*#__PURE__*/React.createElement("button", {
        onClick: onReset, className: "tap",
        style: {
          width: "100%", padding: "11px", borderRadius: 10, cursor: "pointer",
          background: C.faint, border: `1px solid ${C.border2}`,
          color: C.muted, fontWeight: 700, fontSize: 13
        }
      }, "Reset to default (", umaSlug(uma.name), ".webp)")
    )
  ));
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
// ─── Icon Roster (Settings) ─────────────────────────────────────────────────
// Redesigned roster manager, now living inside Settings instead of its own
// card on the Profile tab. Collapsible (closed by default so Settings stays
// short), with a search box since rosters can grow past what fits on screen.
function IconRosterSection({ existingNames, existingTypes, roster, onRosterChange, iconManifest, iconManifestError }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pickerFor, setPickerFor] = useState(null); // uma name currently picking an icon for

  const umas = useMemo(() => existingNames.map(name => ({
    name,
    type: existingTypes[name] || "Mile",
    slug: roster[name] || umaSlug(name),
    customized: !!roster[name]
  })), [existingNames, existingTypes, roster]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return umas;
    return umas.filter(u => u.name.toLowerCase().includes(q));
  }, [umas, query]);

  const customCount = umas.filter(u => u.customized).length;

  return /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }
    }, "Roster"),
    /*#__PURE__*/React.createElement("div", {
      style: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }
    },
      /*#__PURE__*/React.createElement("button", {
        onClick: () => setOpen(o => !o),
        className: "tap row-hover",
        style: {
          width: "100%", padding: "14px", display: "flex", alignItems: "center", gap: 12,
          background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
          font: "inherit", color: "inherit"
        }
      },
        /*#__PURE__*/React.createElement("div", {
          style: {
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: C.accentLo, display: "flex", alignItems: "center", justifyContent: "center"
          }
        }, /*#__PURE__*/React.createElement(Icon, { name: "user", size: 17, color: C.accent })),
        /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
          /*#__PURE__*/React.createElement("div", { style: { fontWeight: 800, fontSize: 14, color: C.text, marginBottom: 2 } }, "Icon Roster"),
          /*#__PURE__*/React.createElement("div", { style: { fontSize: 11.5, color: C.muted } },
            umas.length === 0
              ? "No umas yet"
              : `${umas.length} character${umas.length !== 1 ? "s" : ""}${customCount ? `, ${customCount} customized` : ""}`
          )
        ),
        /*#__PURE__*/React.createElement(Icon, {
          name: "chevronDown", size: 15, color: C.muted, style: { flexShrink: 0, transition: "transform 0.15s", transform: open ? "rotate(180deg)" : "none" }
        })
      ),
      open && /*#__PURE__*/React.createElement("div", {
        className: "anim-expand",
        style: { borderTop: `1px solid ${C.border}`, padding: "12px 14px 14px" }
      },
        iconManifestError && /*#__PURE__*/React.createElement("div", {
          style: {
            background: "#450a0a33", border: "1px solid #ef444466", borderRadius: 8,
            padding: "10px 12px", color: "#fca5a5", fontSize: 12, marginBottom: 12,
            display: "flex", alignItems: "center", gap: 8
          }
        }, /*#__PURE__*/React.createElement(Icon, { name: "alertTriangle", size: 14, style: { flexShrink: 0 } }),
           "Couldn't load icons/manifest.json — icons will fall back to initials until this is fixed."),
        umas.length === 0
          ? /*#__PURE__*/React.createElement("div", { style: { textAlign: "center", padding: "24px 12px" } },
              /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "center", marginBottom: 10, color: C.border2 } },
                /*#__PURE__*/React.createElement(Icon, { name: "user", size: 32, strokeWidth: 1.5 })
              ),
              /*#__PURE__*/React.createElement("div", { style: { fontWeight: 700, color: C.muted, fontSize: 13 } }, "No umas yet"),
              /*#__PURE__*/React.createElement("div", { style: { fontSize: 11, color: C.muted, marginTop: 4 } }, "Add races to see your roster")
            )
          : /*#__PURE__*/React.createElement(React.Fragment, null,
              umas.length > 6 && /*#__PURE__*/React.createElement("input", {
                value: query,
                onChange: e => setQuery(e.target.value),
                placeholder: "Search roster…",
                style: {
                  width: "100%", background: C.faint, border: `1px solid ${C.border2}`,
                  borderRadius: 9, padding: "9px 12px", color: C.text,
                  fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 10
                }
              }),
              filtered.length === 0
                ? /*#__PURE__*/React.createElement("div", {
                    style: { textAlign: "center", padding: "16px 12px", color: C.muted, fontSize: 12.5 }
                  }, "No matches for \"", query, "\"")
                : /*#__PURE__*/React.createElement("div", {
                    style: { display: "flex", flexDirection: "column", gap: 7, maxHeight: 360, overflow: "auto" }
                  }, filtered.map(uma => /*#__PURE__*/React.createElement("button", {
                      key: uma.name,
                      onClick: () => setPickerFor(uma),
                      className: "tap row-hover",
                      style: {
                        background: C.faint, border: `1px solid ${C.border2}`,
                        borderRadius: 10, padding: "9px 10px",
                        display: "flex", alignItems: "center", gap: 10,
                        cursor: "pointer", width: "100%", textAlign: "left",
                        font: "inherit", color: "inherit"
                      }
                    },
                      /*#__PURE__*/React.createElement(UmaAvatar, { name: uma.name, type: uma.type, size: 36 }),
                      /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                        /*#__PURE__*/React.createElement("div", {
                          style: { fontWeight: 800, fontSize: 13, color: C.text,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
                          title: uma.name
                        }, uma.name),
                        /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginTop: 2 } },
                          /*#__PURE__*/React.createElement(Pill, { type: uma.type }),
                          uma.customized && /*#__PURE__*/React.createElement("span", {
                            style: { fontSize: 10, color: C.accent, fontWeight: 700 }
                          }, "custom icon")
                        )
                      ),
                      /*#__PURE__*/React.createElement("span", {
                        style: { fontSize: 11, color: C.muted, fontWeight: 700, flexShrink: 0 }
                      }, "Change"),
                      /*#__PURE__*/React.createElement(Icon, { name: "chevronDown", size: 13, color: C.muted, style: { transform: "rotate(-90deg)", flexShrink: 0 } })
                    ))
                  )
            )
      )
    ),
    pickerFor && /*#__PURE__*/React.createElement(IconPickerModal, {
      uma: pickerFor,
      manifest: iconManifest,
      manifestError: iconManifestError,
      currentSlug: roster[pickerFor.name] || umaSlug(pickerFor.name),
      onSelect: filename => {
        const slug = filename.replace(/\.[^.]+$/, "");
        clearBrokenIconSlug(slug);
        onRosterChange({ ...roster, [pickerFor.name]: slug });
        setPickerFor(null);
      },
      onReset: () => {
        const next = { ...roster };
        delete next[pickerFor.name];
        onRosterChange(next);
        setPickerFor(null);
      },
      onClose: () => setPickerFor(null)
    })
  );
}

function SettingsModal({
  races,
  onClose,
  onExport,
  onImport,
  onClear,
  onOpenBatchImport,
  existingNames,
  existingTypes,
  roster,
  onRosterChange,
  iconManifest,
  iconManifestError
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
  }), " Batch Import Races"))), /*#__PURE__*/React.createElement(IconRosterSection, {
    existingNames: existingNames,
    existingTypes: existingTypes,
    roster: roster,
    onRosterChange: onRosterChange,
    iconManifest: iconManifest,
    iconManifestError: iconManifestError
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
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
const ROSTER_KEY = "uma_roster_v1";
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
  const [roster, setRosterState] = useState({});
  const [iconManifest, setIconManifest] = useState([]);
  const [iconManifestError, setIconManifestError] = useState(false);

  // Fetch the list of available icon files once on mount (static JSON,
  // regenerated via update_icon_manifest.js whenever icons/ changes).
  useEffect(() => {
    fetch("icons/manifest.json")
      .then(r => {
        if (!r.ok) throw new Error("manifest fetch failed");
        return r.json();
      })
      .then(list => {
        if (Array.isArray(list)) setIconManifest(list);
      })
      .catch(() => setIconManifestError(true));
  }, []);

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
    try {
      const raw = localStorage.getItem(ROSTER_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setRosterState(parsed);
          setGlobalRoster(parsed);
        }
      }
    } catch {}
    setLoaded(true);
  }, []);
  function setTrialClass(n) {
    setTrialClassState(n);
    try { localStorage.setItem(CLASS_KEY, String(n)); } catch {}
  }
  function setRoster(r) {
    setRosterState(r);
    setGlobalRoster(r);
    try { localStorage.setItem(ROSTER_KEY, JSON.stringify(r)); } catch {}
  }

  // Persist on change (skip the very first render before load completes)
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(races));
    } catch {}
  }, [races, loaded]);
  const stats = useMemo(() => computeStats(races), [races]);
  // Every uma that's appeared in at least one round, with their most
  // common distance type — used by IconRosterSection for avatar/pill
  // coloring. Derived from stats rather than races directly, since an
  // uma's "type" isn't a single static value anymore (their rounds can
  // span several distance categories).
  const existingNames = useMemo(() => stats.map(s => s.name), [stats]);
  const existingTypes = useMemo(() => {
    const m = {};
    stats.forEach(s => { m[s.name] = s.primaryType || "Mile"; });
    return m;
  }, [stats]);
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
    icon: "settings"
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
    onOpenBatchImport: () => setShowBatchImport(true),
    existingNames: existingNames,
    existingTypes: existingTypes,
    roster: roster,
    onRosterChange: setRoster,
    iconManifest: iconManifest,
    iconManifestError: iconManifestError
  }), showBatchImport && /*#__PURE__*/React.createElement(BatchImportModal, {
    existingNames: existingNames,
    existingTypes: existingTypes,
    onApplyAll: addRacesBatch,
    onClose: () => setShowBatchImport(false)
  }));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/*#__PURE__*/React.createElement(App, null));
