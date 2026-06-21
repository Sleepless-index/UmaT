// ─── Sort dropdown ────────────────────────────────────────────────────────────
const SORT_OPTS = [
  { k: "total", label: "Total Points" },
  { k: "winRate", label: "Win Rate" },
  { k: "avgOwnPlace", label: "Avg Placement", asc: true },
  { k: "sigma", label: "Consistency", asc: true }
];
function SortDropdown({
  sort,
  dir,
  onSort
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: sort,
    onChange: e => {
      const opt = SORT_OPTS.find(o => o.k === e.target.value);
      onSort(opt.k, opt.asc ? 1 : -1);
    },
    style: {
      width: "100%",
      appearance: "none",
      WebkitAppearance: "none",
      background: C.faint,
      border: `1px solid ${C.border2}`,
      borderRadius: 10,
      color: C.text,
      padding: "9px 30px 9px 13px",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      outline: "none",
      letterSpacing: "0.02em"
    }
  }, SORT_OPTS.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.k,
    value: o.k
  }, "Sort: ", o.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 11,
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      color: C.muted
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronDown",
    size: 13
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => onSort(sort, -dir),
    title: "Reverse order",
    className: "tap",
    style: {
      flexShrink: 0,
      width: 38,
      height: 38,
      borderRadius: 10,
      background: C.faint,
      border: `1px solid ${C.border2}`,
      color: C.accent,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: dir === 1 ? "arrowUp" : "arrowDown",
    size: 15,
    strokeWidth: 2.4
  })));
}

// ─── Type filter dropdown ──────────────────────────────────────────────────────
function TypeFilterDropdown({
  active,
  onChange
}) {
  const opts = ["All", ...TYPES];
  const tc = active === "All" ? C.accent : TYPE_COLOR[active] || C.accent;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: active,
    onChange: e => onChange(e.target.value),
    style: {
      width: "100%",
      appearance: "none",
      WebkitAppearance: "none",
      background: C.faint,
      border: `1px solid ${active === "All" ? C.border2 : tc + "66"}`,
      borderRadius: 10,
      color: active === "All" ? C.text : tc,
      padding: "9px 30px 9px 13px",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      outline: "none",
      letterSpacing: "0.02em"
    }
  }, opts.map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, t === "All" ? "All Types" : t))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 11,
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      color: active === "All" ? C.muted : tc
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronDown",
    size: 13
  })));
}
