const RACES_PAGE_SIZE = 20;

// Swipeable race row - swipe left to reveal delete.
// A race no longer has a single outcome (each of its rounds is win/loss
// independently), so the row shows a W/L breakdown across its rounds
// instead of one win/loss tag, and totals points across every round.
function SwipeableRaceRow({ race, index, onView, onEdit, onDelete, editMode }) {
  const [swipeX, setSwipeX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startX = React.useRef(null);
  const startY = React.useRef(null);
  const locked = React.useRef(null); // "h" | "v" | null
  const SNAP_THRESHOLD = 60;
  const rounds = race.rounds || [];
  const roundWins = rounds.filter(r => r.outcome === "win").length;
  const roundLosses = rounds.filter(r => r.outcome === "loss").length;
  const totalPts = rounds.reduce((s, r) => s + r.results.reduce((a, e) => a + e.pts, 0), 0);
  const swiped = swipeX < -SNAP_THRESHOLD;

  function onTouchStart(e) {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    locked.current = null;
  }
  function onTouchMove(e) {
    if (startX.current === null) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;
    if (!locked.current) {
      if (Math.abs(dx) > Math.abs(dy) + 4) locked.current = "h";
      else if (Math.abs(dy) > Math.abs(dx) + 4) locked.current = "v";
      else return;
    }
    if (locked.current === "v") return;
    if (dx > 0) { setSwipeX(0); return; }
    e.preventDefault();
    setSwiping(true);
    setSwipeX(Math.max(dx, -110));
  }
  function onTouchEnd() {
    setSwiping(false);
    if (swipeX <= -SNAP_THRESHOLD) setSwipeX(-88);
    else setSwipeX(0);
    startX.current = null;
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "anim-slide",
    style: { position: "relative", borderRadius: 11, animationDelay: `${Math.min(index, 10) * 30}ms` }
  },
    swipeX < -20 && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute", right: 0, top: 0, bottom: 0, width: 88,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#ef444433", borderRadius: 11, border: "1px solid #ef444466"
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onDelete(race.id),
      style: { background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 800 }
    }, /*#__PURE__*/React.createElement(Icon, { name: "trash", size: 18, color: "#ef4444" }), "Delete")),

    /*#__PURE__*/React.createElement("div", {
      onTouchStart, onTouchMove, onTouchEnd,
      style: {
        background: C.card,
        border: `1px solid ${swiped ? "#ef4444aa" : swipeX < -20 ? "#ef444455" : C.border}`,
        borderRadius: 11, padding: "13px 14px", display: "flex", alignItems: "center", gap: 10,
        transform: `translateX(${swipeX}px)`,
        transition: swiping ? "none" : "transform 0.25s cubic-bezier(.2,.8,.2,1), border-color 0.15s",
        position: "relative", zIndex: 1, touchAction: "pan-y"
      }
    },
      swipeX < 0 && /*#__PURE__*/React.createElement("div", { onClick: () => setSwipeX(0), style: { position: "fixed", inset: 0, zIndex: 0 } }),
      /*#__PURE__*/React.createElement("div", {
        style: { width: 32, height: 32, borderRadius: 8, background: C.faint, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: C.accent, flexShrink: 0 }
      }, index + 1),
      /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 2, flexWrap: "wrap" } },
          /*#__PURE__*/React.createElement("span", { style: { fontWeight: 800, color: C.text, fontSize: 14 } }, race.label),
          roundWins > 0 && /*#__PURE__*/React.createElement("span", {
            style: { fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 5, letterSpacing: "0.06em", background: "#34d39922", color: "#34d399", border: "1px solid #34d39944" }
          }, roundWins, "W"),
          roundLosses > 0 && /*#__PURE__*/React.createElement("span", {
            style: { fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 5, letterSpacing: "0.06em", background: "#f8717122", color: "#f87171", border: "1px solid #f8717144" }
          }, roundLosses, "L")
        ),
        /*#__PURE__*/React.createElement("div", { style: { fontSize: 12, color: C.muted, display: "flex", alignItems: "center", gap: 4 } },
          /*#__PURE__*/React.createElement(Icon, { name: "barChart", size: 12, color: C.accent }),
          /*#__PURE__*/React.createElement("span", { style: { color: C.accent, fontWeight: 700 } }, totalPts.toLocaleString()),
          /*#__PURE__*/React.createElement("span", { style: { color: C.muted } }, "total pts \u00b7 ", rounds.length, " round", rounds.length !== 1 ? "s" : "")
        )
      ),
      /*#__PURE__*/React.createElement("button", {
        onClick: () => onView(race), title: "View", className: "tap",
        style: { background: C.faint, border: `1px solid ${C.border2}`, color: C.muted, width: 32, height: 32, borderRadius: 7, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }
      }, /*#__PURE__*/React.createElement(Icon, { name: "eye", size: 14 })),
      editMode && /*#__PURE__*/React.createElement("button", {
        onClick: () => onEdit(race), title: "Edit", className: "tap",
        style: { background: C.faint, border: `1px solid ${C.border2}`, color: C.accent, width: 32, height: 32, borderRadius: 7, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }
      }, /*#__PURE__*/React.createElement(Icon, { name: "pencil", size: 14 }))
    )
  );
}

// ─── Tab: Races ───────────────────────────────────────────────────────────────
function RacesTab({ races, onDelete, onView, onEdit }) {
  const [editMode, setEditMode] = useState(false);
  const [page, setPage] = useState(0);

  // Win/loss summary now counts rounds across all races, since a race
  // itself doesn't have one outcome anymore.
  const allRounds = useMemo(() => races.flatMap(r => r.rounds || []), [races]);
  const winCount = allRounds.filter(r => r.outcome === "win").length;
  const lossCount = allRounds.filter(r => r.outcome === "loss").length;

  const pageCount = Math.max(1, Math.ceil(races.length / RACES_PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageStart = safePage * RACES_PAGE_SIZE;
  const pageRaces = races.slice(pageStart, pageStart + RACES_PAGE_SIZE);
  function goPage(p) {
    setPage(Math.max(0, Math.min(pageCount - 1, p)));
  }
  return /*#__PURE__*/React.createElement("div", null,
    races.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }
    },
      /*#__PURE__*/React.createElement("div", {
        className: "anim-pop",
        style: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }
      },
        /*#__PURE__*/React.createElement("div", { style: { width: 34, height: 34, borderRadius: 9, background: "#34d39922", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
          /*#__PURE__*/React.createElement(Icon, { name: "trophy", size: 17, color: "#34d399" })
        ),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("div", { style: { fontSize: 18, fontWeight: 900, color: "#34d399", lineHeight: 1 } }, winCount),
          /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" } }, "Rounds Won")
        )
      ),
      /*#__PURE__*/React.createElement("div", {
        className: "anim-pop",
        style: { animationDelay: "40ms", background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }
      },
        /*#__PURE__*/React.createElement("div", { style: { width: 34, height: 34, borderRadius: 9, background: "#f8717122", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
          /*#__PURE__*/React.createElement(Icon, { name: "skull", size: 17, color: "#f87171" })
        ),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("div", { style: { fontSize: 18, fontWeight: 900, color: "#f87171", lineHeight: 1 } }, lossCount),
          /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" } }, "Rounds Lost")
        )
      )
    ),
    /*#__PURE__*/React.createElement("div", {
      style: { marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }
    },
      /*#__PURE__*/React.createElement("span", { style: { fontSize: 13, color: C.muted } },
        races.length, " race", races.length !== 1 ? "s" : "", " recorded"
      ),
      races.length > 0 && /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
        /*#__PURE__*/React.createElement("span", { style: { fontSize: 11, color: C.muted } }, "\u2190 swipe to delete"),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => setEditMode(e => !e), className: "tap",
          style: {
            background: editMode ? C.accent + "22" : C.faint, border: `1px solid ${editMode ? C.accent + "66" : C.border2}`,
            color: editMode ? C.accent : C.muted, borderRadius: 8, padding: "6px 12px", cursor: "pointer",
            fontSize: 11.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 6
          }
        }, /*#__PURE__*/React.createElement(Icon, { name: "pencil", size: 13 }), " ", editMode ? "Done" : "Edit")
      )
    ),
    races.length === 0 && /*#__PURE__*/React.createElement("div", {
      className: "anim-fade", style: { textAlign: "center", padding: "48px 20px" }
    },
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "center", marginBottom: 10, color: C.border2 } },
        /*#__PURE__*/React.createElement(Icon, { name: "flag", size: 40, strokeWidth: 1.6 })
      ),
      /*#__PURE__*/React.createElement("div", { style: { fontWeight: 700, color: C.muted, fontSize: 15 } }, "No races yet"),
      /*#__PURE__*/React.createElement("div", { style: { fontSize: 12, color: C.muted, marginTop: 4 } }, "Tap + to add your first race")
    ),
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
      pageRaces.map((race, pi) => /*#__PURE__*/React.createElement(SwipeableRaceRow, {
        key: race.id, race, index: pageStart + pi, onView, onEdit, onDelete, editMode
      }))
    ),
    pageCount > 1 && /*#__PURE__*/React.createElement("div", {
      style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16 }
    },
      /*#__PURE__*/React.createElement("button", {
        onClick: () => goPage(safePage - 1), disabled: safePage === 0, className: "tap",
        style: { width: 32, height: 32, borderRadius: 8, background: C.faint, border: `1px solid ${C.border2}`, color: safePage === 0 ? C.border2 : C.muted, cursor: safePage === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }
      }, /*#__PURE__*/React.createElement(Icon, { name: "chevronUp", size: 14, style: { transform: "rotate(-90deg)" } })),
      Array.from({ length: pageCount }, (_, p) => p).map(p => /*#__PURE__*/React.createElement("button", {
        key: p, onClick: () => goPage(p), className: "tap",
        style: { minWidth: 32, height: 32, padding: "0 8px", borderRadius: 8, background: p === safePage ? C.accent : C.faint, border: `1px solid ${p === safePage ? C.accent : C.border2}`, color: p === safePage ? "#fff" : C.muted, fontWeight: 700, fontSize: 12, cursor: "pointer" }
      }, p + 1)),
      /*#__PURE__*/React.createElement("button", {
        onClick: () => goPage(safePage + 1), disabled: safePage === pageCount - 1, className: "tap",
        style: { width: 32, height: 32, borderRadius: 8, background: C.faint, border: `1px solid ${C.border2}`, color: safePage === pageCount - 1 ? C.border2 : C.muted, cursor: safePage === pageCount - 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }
      }, /*#__PURE__*/React.createElement(Icon, { name: "chevronUp", size: 14, style: { transform: "rotate(90deg)" } }))
    )
  );
}
