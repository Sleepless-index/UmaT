// ─── Track Reference (Team Trials lanes: JRA + NAR + select overseas) ─────
// Auto-derived from game data: distance categories follow the official
// thresholds (<=1400 Sprint, <=1800 Mile, <=2400 Medium, else Long).
//
// Lanes here match Team Trials' 5 roster categories, not raw distance:
// Sprint/Mile/Medium/Long are Turf races at that distance, and Dirt is
// its own lane that is always Mile-distance, Dirt-surface (confirmed —
// Team Trials never uses Dirt at any other distance). Dirt-surface tracks
// at Sprint/Medium/Long distance exist in the underlying game data but
// are deliberately excluded here since Team Trials never selects them.
//
// 'direction' is the course rotation (Right/Left/Straight), not compass.
// 'inout' marks inner/outer course variants where a venue has both.
// Del Mar is intentionally omitted — no verified course data available
// for it yet; add it here once distances/surfaces are confirmed.
const TRACKS_BY_TYPE = {
  Sprint: [
    {
      venue: "Sapporo",
      options: [
        { id: 10101, distance: 1200, surface: "Turf", direction: "Right" },
      ]
    },
    {
      venue: "Hakodate",
      options: [
        { id: 10201, distance: 1000, surface: "Turf", direction: "Right" },
        { id: 10202, distance: 1200, surface: "Turf", direction: "Right" },
      ]
    },
    {
      venue: "Niigata",
      options: [
        { id: 10301, distance: 1000, surface: "Turf", direction: "Straight" },
        { id: 10302, distance: 1200, surface: "Turf", direction: "Left", inout: "inner" },
        { id: 10303, distance: 1400, surface: "Turf", direction: "Left", inout: "inner" },
      ]
    },
    {
      venue: "Fukushima",
      options: [
        { id: 10401, distance: 1200, surface: "Turf", direction: "Right" },
      ]
    },
    {
      venue: "Nakayama",
      options: [
        { id: 10501, distance: 1200, surface: "Turf", direction: "Right", inout: "outer" },
      ]
    },
    {
      venue: "Tokyo",
      options: [
        { id: 10601, distance: 1400, surface: "Turf", direction: "Left" },
      ]
    },
    {
      venue: "Chukyo",
      options: [
        { id: 10701, distance: 1200, surface: "Turf", direction: "Left" },
        { id: 10702, distance: 1400, surface: "Turf", direction: "Left" },
      ]
    },
    {
      venue: "Kyoto",
      options: [
        { id: 10801, distance: 1200, surface: "Turf", direction: "Right", inout: "inner" },
        { id: 10802, distance: 1400, surface: "Turf", direction: "Right", inout: "inner" },
        { id: 10803, distance: 1400, surface: "Turf", direction: "Right", inout: "outer" },
      ]
    },
    {
      venue: "Hanshin",
      options: [
        { id: 10901, distance: 1200, surface: "Turf", direction: "Right", inout: "inner" },
        { id: 10902, distance: 1400, surface: "Turf", direction: "Right", inout: "inner" },
      ]
    },
    {
      venue: "Kokura",
      options: [
        { id: 11001, distance: 1200, surface: "Turf", direction: "Right" },
      ]
    },
  ],
  Mile: [
    {
      venue: "Sapporo",
      options: [
        { id: 10102, distance: 1500, surface: "Turf", direction: "Right" },
        { id: 10103, distance: 1800, surface: "Turf", direction: "Right" },
      ]
    },
    {
      venue: "Hakodate",
      options: [
        { id: 10203, distance: 1800, surface: "Turf", direction: "Right" },
      ]
    },
    {
      venue: "Niigata",
      options: [
        { id: 10304, distance: 1600, surface: "Turf", direction: "Left", inout: "outer" },
        { id: 10305, distance: 1800, surface: "Turf", direction: "Left", inout: "outer" },
      ]
    },
    {
      venue: "Fukushima",
      options: [
        { id: 10402, distance: 1800, surface: "Turf", direction: "Right" },
      ]
    },
    {
      venue: "Nakayama",
      options: [
        { id: 10502, distance: 1600, surface: "Turf", direction: "Right", inout: "outer" },
        { id: 10503, distance: 1800, surface: "Turf", direction: "Right", inout: "inner" },
      ]
    },
    {
      venue: "Tokyo",
      options: [
        { id: 10602, distance: 1600, surface: "Turf", direction: "Left" },
        { id: 10603, distance: 1800, surface: "Turf", direction: "Left" },
      ]
    },
    {
      venue: "Chukyo",
      options: [
        { id: 10703, distance: 1600, surface: "Turf", direction: "Left" },
      ]
    },
    {
      venue: "Kyoto",
      options: [
        { id: 10804, distance: 1600, surface: "Turf", direction: "Right", inout: "inner" },
        { id: 10805, distance: 1600, surface: "Turf", direction: "Right", inout: "outer" },
        { id: 10806, distance: 1800, surface: "Turf", direction: "Right", inout: "outer" },
      ]
    },
    {
      venue: "Hanshin",
      options: [
        { id: 10903, distance: 1600, surface: "Turf", direction: "Right", inout: "outer" },
        { id: 10904, distance: 1800, surface: "Turf", direction: "Right", inout: "outer" },
      ]
    },
    {
      venue: "Kokura",
      options: [
        { id: 11002, distance: 1800, surface: "Turf", direction: "Right" },
      ]
    },
  ],
  Medium: [
    {
      venue: "Sapporo",
      options: [
        { id: 10104, distance: 2000, surface: "Turf", direction: "Right" },
      ]
    },
    {
      venue: "Hakodate",
      options: [
        { id: 10204, distance: 2000, surface: "Turf", direction: "Right" },
      ]
    },
    {
      venue: "Niigata",
      options: [
        { id: 10306, distance: 2000, surface: "Turf", direction: "Left", inout: "inner" },
        { id: 10307, distance: 2000, surface: "Turf", direction: "Left", inout: "outer" },
        { id: 10308, distance: 2200, surface: "Turf", direction: "Left", inout: "inner" },
        { id: 10309, distance: 2400, surface: "Turf", direction: "Left", inout: "inner" },
      ]
    },
    {
      venue: "Fukushima",
      options: [
        { id: 10403, distance: 2000, surface: "Turf", direction: "Right" },
      ]
    },
    {
      venue: "Nakayama",
      options: [
        { id: 10504, distance: 2000, surface: "Turf", direction: "Right", inout: "inner" },
        { id: 10505, distance: 2200, surface: "Turf", direction: "Right", inout: "outer" },
      ]
    },
    {
      venue: "Tokyo",
      options: [
        { id: 10604, distance: 2000, surface: "Turf", direction: "Left" },
        { id: 10605, distance: 2300, surface: "Turf", direction: "Left" },
        { id: 10606, distance: 2400, surface: "Turf", direction: "Left" },
      ]
    },
    {
      venue: "Chukyo",
      options: [
        { id: 10704, distance: 2000, surface: "Turf", direction: "Left" },
        { id: 10705, distance: 2200, surface: "Turf", direction: "Left" },
      ]
    },
    {
      venue: "Kyoto",
      options: [
        { id: 10807, distance: 2000, surface: "Turf", direction: "Right", inout: "inner" },
        { id: 10808, distance: 2200, surface: "Turf", direction: "Right", inout: "outer" },
        { id: 10809, distance: 2400, surface: "Turf", direction: "Right", inout: "outer" },
      ]
    },
    {
      venue: "Hanshin",
      options: [
        { id: 10905, distance: 2000, surface: "Turf", direction: "Right", inout: "inner" },
        { id: 10906, distance: 2200, surface: "Turf", direction: "Right", inout: "inner" },
        { id: 10907, distance: 2400, surface: "Turf", direction: "Right", inout: "outer" },
      ]
    },
    {
      venue: "Kokura",
      options: [
        { id: 11003, distance: 2000, surface: "Turf", direction: "Right" },
      ]
    },
    {
      venue: "Longchamp",
      options: [
        { id: 11203, distance: 2400, surface: "Turf", direction: "Right" },
      ]
    },
    {
      venue: "Santa Anita Park",
      options: [
        { id: 11605, distance: 2000, surface: "Turf", direction: "Left", variant: 1 },
        { id: 11612, distance: 2000, surface: "Turf", direction: "Left", variant: 2 },
      ]
    },
  ],
  Long: [
    {
      venue: "Sapporo",
      options: [
        { id: 10105, distance: 2600, surface: "Turf", direction: "Right" },
      ]
    },
    {
      venue: "Hakodate",
      options: [
        { id: 10205, distance: 2600, surface: "Turf", direction: "Right" },
      ]
    },
    {
      venue: "Fukushima",
      options: [
        { id: 10404, distance: 2600, surface: "Turf", direction: "Right" },
      ]
    },
    {
      venue: "Nakayama",
      options: [
        { id: 10506, distance: 2500, surface: "Turf", direction: "Right", inout: "inner" },
        { id: 10507, distance: 3600, surface: "Turf", direction: "Right", inout: "inner" },
      ]
    },
    {
      venue: "Tokyo",
      options: [
        { id: 10607, distance: 2500, surface: "Turf", direction: "Left" },
        { id: 10608, distance: 3400, surface: "Turf", direction: "Left" },
      ]
    },
    {
      venue: "Kyoto",
      options: [
        { id: 10810, distance: 3000, surface: "Turf", direction: "Right", inout: "outer" },
        { id: 10811, distance: 3200, surface: "Turf", direction: "Right", inout: "outer" },
      ]
    },
    {
      venue: "Hanshin",
      options: [
        { id: 10908, distance: 2600, surface: "Turf", direction: "Right", inout: "outer" },
        { id: 10909, distance: 3000, surface: "Turf", direction: "Right", inout: "inner" },
        { id: 10914, distance: 3200, surface: "Turf", direction: "Right", inout: "outer to inner" },
      ]
    },
    {
      venue: "Kokura",
      options: [
        { id: 11004, distance: 2600, surface: "Turf", direction: "Right" },
      ]
    },
  ],
  Dirt: [
    {
      venue: "Sapporo",
      options: [
        { id: 10107, distance: 1700, surface: "Dirt", direction: "Right" },
      ]
    },
    {
      venue: "Hakodate",
      options: [
        { id: 10207, distance: 1700, surface: "Dirt", direction: "Right" },
      ]
    },
    {
      venue: "Niigata",
      options: [
        { id: 10311, distance: 1800, surface: "Dirt", direction: "Left" },
      ]
    },
    {
      venue: "Fukushima",
      options: [
        { id: 10406, distance: 1700, surface: "Dirt", direction: "Right" },
      ]
    },
    {
      venue: "Nakayama",
      options: [
        { id: 10509, distance: 1800, surface: "Dirt", direction: "Right" },
      ]
    },
    {
      venue: "Tokyo",
      options: [
        { id: 10611, distance: 1600, surface: "Dirt", direction: "Left" },
      ]
    },
    {
      venue: "Chukyo",
      options: [
        { id: 10708, distance: 1800, surface: "Dirt", direction: "Left" },
      ]
    },
    {
      venue: "Kyoto",
      options: [
        { id: 10814, distance: 1800, surface: "Dirt", direction: "Right" },
      ]
    },
    {
      venue: "Hanshin",
      options: [
        { id: 10912, distance: 1800, surface: "Dirt", direction: "Right" },
      ]
    },
    {
      venue: "Kokura",
      options: [
        { id: 11006, distance: 1700, surface: "Dirt", direction: "Right" },
      ]
    },
    {
      venue: "Ooi",
      options: [
        { id: 11102, distance: 1800, surface: "Dirt", direction: "Right" },
      ]
    },
    {
      venue: "Kawasaki",
      options: [
        { id: 11302, distance: 1600, surface: "Dirt", direction: "Left" },
      ]
    },
    {
      venue: "Funabashi",
      options: [
        { id: 11402, distance: 1600, surface: "Dirt", direction: "Left" },
        { id: 11403, distance: 1800, surface: "Dirt", direction: "Left" },
      ]
    },
    {
      venue: "Morioka",
      options: [
        { id: 11502, distance: 1600, surface: "Dirt", direction: "Left" },
        { id: 11503, distance: 1800, surface: "Dirt", direction: "Left" },
      ]
    },
  ],
};

// Flat lookup by track id — handy once a saved race stores just an id
// rather than the full venue/distance/surface object. Includes `type`
// (Sprint/Mile/Medium/Long/Dirt), which is otherwise only implied by
// which bucket of TRACKS_BY_TYPE an entry lives under.
const TRACK_BY_ID = {};
Object.entries(TRACKS_BY_TYPE).forEach(([type, venues]) => {
  venues.forEach(v => {
    v.options.forEach(o => {
      TRACK_BY_ID[o.id] = { venue: v.venue, type, ...o };
    });
  });
});
