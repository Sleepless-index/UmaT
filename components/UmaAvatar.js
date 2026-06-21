// ─── Uma Avatar ──────────────────────────────────────────────────────────────
// Global roster override map — set by App, read by UmaAvatar without prop drilling
const _rosterRef = { current: {} };
function setGlobalRoster(r) { _rosterRef.current = r; }
// Name format: "T.M. Opera O" (base) or "T.M. Opera O [New Year, Same Radiance!]" (alt)
// Slug: strip punctuation except spaces/brackets, split on bracket, join with "_".
// T.M. Opera O                        → TM_Opera_O.webp
// T.M. Opera O [New Year, Same Radiance!] → TM_Opera_O_New_Year_Same_Radiance.webp
function umaSlug(name) {
  const bracketMatch = name.match(/^([^\[]+)\[([^\]]+)\]/);
  function sanitizePart(str) {
    return str
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, '') // strip punctuation (dots, commas, !, apostrophes…)
      .trim()
      .replace(/\s+/g, '_');
  }
  if (bracketMatch) {
    const base = sanitizePart(bracketMatch[1]);
    const sub  = sanitizePart(bracketMatch[2]);
    return `${base}_${sub}`;
  }
  return sanitizePart(name);
}

// Cache of slugs whose icon file is known to 404, so we don't re-issue the
// same failing request every time an UmaAvatar for that name remounts
// (e.g. switching tabs, paginating, re-sorting standings).
const _brokenIconSlugs = new Set();
function clearBrokenIconSlug(slug) {
  _brokenIconSlugs.delete(slug);
}

function UmaAvatar({ name, type, size = 28 }) {
  const slug = _rosterRef.current[name] || umaSlug(name);
  const [err, setErr] = useState(() => _brokenIconSlugs.has(slug));
  const tc = TYPE_COLOR[type] || C.accent;
  const initial = name.trim()[0]?.toUpperCase() || '?';
  const borderRadius = Math.round(size * 0.28);

  // If the slug changes (e.g. user picks a different icon), re-check
  // against the broken cache instead of trusting stale `err` state.
  useEffect(() => {
    setErr(_brokenIconSlugs.has(slug));
  }, [slug]);

  if (!err) {
    return /*#__PURE__*/React.createElement("img", {
      src: `icons/${slug}.webp`,
      alt: name,
      loading: "lazy",
      decoding: "async",
      onError: () => {
        _brokenIconSlugs.add(slug);
        setErr(true);
      },
      style: {
        width: size,
        height: size,
        borderRadius,
        objectFit: "cover",
        objectPosition: "center",
        flexShrink: 0,
        background: C.faint,
        display: "block"
      }
    });
  }
  // Letter fallback
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius,
      flexShrink: 0,
      background: tc + "22",
      border: `1.5px solid ${tc}55`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: Math.round(size * 0.44),
      fontWeight: 800,
      color: tc,
      letterSpacing: "-0.01em",
      userSelect: "none"
    }
  }, initial);
}
