// ─── Track Picker ───────────────────────────────────────────────────────────
// Used inside each round of RaceFormModal. TrackPickerButton shows the
// currently selected track (or a placeholder) and opens TrackPickerModal,
// a bottom sheet that goes type -> venue -> specific distance/surface.

function formatTrackLabel(track) {
  if (!track) return "";
  const bits = [`${track.venue}`, `${track.distance}m`, track.surface];
  if (track.direction && track.direction !== "Straight") bits.push(track.direction);
  if (track.inout) bits.push(track.inout[0].toUpperCase() + track.inout.slice(1));
  return bits.join(" \u00b7 ");
}

function TrackPickerButton({ trackId, onClick, hasError }) {
  const track = trackId ? TRACK_BY_ID[trackId] : null;
  const tc = track ? (TYPE_COLOR[track.type] || C.accent) : C.muted;
  return /*#__PURE__*/React.createElement("button", {
    onClick,
    className: "tap row-hover",
    style: {
      width: "100%", textAlign: "left", cursor: "pointer", font: "inherit",
      background: C.faint, border: `1px solid ${hasError ? "#ef4444" : C.border2}`,
      borderRadius: 9, padding: "9px 11px",
      display: "flex", alignItems: "center", gap: 8, color: "inherit"
    }
  },
    /*#__PURE__*/React.createElement(Icon, { name: "flag", size: 14, color: tc, style: { flexShrink: 0 } }),
    /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
      track
        ? /*#__PURE__*/React.createElement(React.Fragment, null,
            /*#__PURE__*/React.createElement("div", {
              style: { fontWeight: 800, fontSize: 13, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
            }, formatTrackLabel(track)),
            /*#__PURE__*/React.createElement("div", { style: { fontSize: 10.5, color: tc, fontWeight: 700, marginTop: 1 } }, track.type)
          )
        : /*#__PURE__*/React.createElement("div", { style: { fontSize: 13, color: C.muted, fontWeight: 600 } }, "Select track\u2026")
    ),
    /*#__PURE__*/React.createElement(Icon, { name: "chevronDown", size: 13, color: C.muted, style: { transform: "rotate(-90deg)", flexShrink: 0 } })
  );
}

function TrackPickerModal({ value, onSelect, onClose }) {
  const initialType = value && TRACK_BY_ID[value] ? TRACK_BY_ID[value].type : "Sprint";
  const [type, setType] = useState(initialType);
  const venues = TRACKS_BY_TYPE[type] || [];

  return /*#__PURE__*/React.createElement("div", {
    className: "anim-fade",
    style: {
      position: "fixed", inset: 0, background: "#000b", zIndex: 120,
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
      style: { padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }
    },
      /*#__PURE__*/React.createElement("span", { style: { fontWeight: 800, fontSize: 16, color: C.text } }, "Select Track"),
      /*#__PURE__*/React.createElement("button", {
        onClick: onClose, className: "tap",
        style: { background: C.faint, border: "none", color: C.muted, borderRadius: 7, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }
      }, /*#__PURE__*/React.createElement(Icon, { name: "x", size: 15 }))
    ),
    /*#__PURE__*/React.createElement("div", {
      style: { display: "flex", gap: 6, padding: "12px 18px 0", flexShrink: 0 }
    }, TYPES.map(t => {
      const active = t === type;
      const tc = TYPE_COLOR[t];
      return /*#__PURE__*/React.createElement("button", {
        key: t, onClick: () => setType(t), className: "tap",
        style: {
          flex: 1, padding: "8px 4px", borderRadius: 8, cursor: "pointer",
          background: active ? tc + "22" : C.faint,
          border: `1px solid ${active ? tc : C.border2}`,
          color: active ? tc : C.muted, fontWeight: 800, fontSize: 12
        }
      }, t);
    })),
    /*#__PURE__*/React.createElement("div", {
      style: { overflow: "auto", padding: "14px 18px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }
    }, venues.map(v => /*#__PURE__*/React.createElement("div", { key: v.venue },
      /*#__PURE__*/React.createElement("div", {
        style: { fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }
      }, v.venue),
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
        v.options.map(o => {
          const active = o.id === value;
          const sc = SURFACE_COLOR[o.surface] || C.muted;
          return /*#__PURE__*/React.createElement("button", {
            key: o.id,
            onClick: () => onSelect(o.id),
            className: "tap row-hover",
            style: {
              display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
              cursor: "pointer", font: "inherit", color: "inherit",
              background: active ? C.accentLo : C.faint,
              border: `1.5px solid ${active ? C.accent : C.border2}`,
              borderRadius: 9, padding: "9px 11px"
            }
          },
            /*#__PURE__*/React.createElement("span", {
              style: { width: 7, height: 7, borderRadius: 4, background: sc, flexShrink: 0 }
            }),
            /*#__PURE__*/React.createElement("span", { style: { flex: 1, fontSize: 13, fontWeight: 700, color: active ? C.accent : C.text } },
              `${o.distance}m \u00b7 ${o.surface}`
            ),
            /*#__PURE__*/React.createElement("span", { style: { fontSize: 11, color: C.muted } },
              [o.direction !== "Straight" ? o.direction : null, o.inout ? (o.inout[0].toUpperCase() + o.inout.slice(1)) : null].filter(Boolean).join(" \u00b7 ")
            ),
            active && /*#__PURE__*/React.createElement(Icon, { name: "checkCircle", size: 15, color: C.accent, style: { flexShrink: 0 } })
          );
        })
      )
    )))
  ));
}
