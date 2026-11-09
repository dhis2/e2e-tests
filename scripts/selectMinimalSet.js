// Picks the minimal set of objects the smoke specs need to open.
// See "Minimal vs full run" in README.md for the reasoning behind each signature.

const byName = (a, b) =>
  (a.displayName || "").localeCompare(b.displayName || "") ||
  a.id.localeCompare(b.id);

// Keeps the first object (by name) of every distinct signature.
const onePerSignature = (items, signature) => {
  const seen = new Set();
  return [...items].sort(byName).filter((item) => {
    const key = JSON.stringify(signature(item));
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const sorted = (list = []) =>
  [...new Set(list)].sort((a, b) => String(a).localeCompare(String(b)));

const SIGNATURES = {
  // Chart type, legend set, kinds of data items (indicator, data element, PI, ...), program-based
  visualizations: (v) => [
    v.type,
    !!v.legend?.set,
    sorted((v.dataDimensionItems || []).map((d) => d.dataDimensionItemType)),
    !!(v.program || v.programStage),
  ],
  // Combination of layer types, plus the basemap (each basemap is a different tile provider)
  maps: (m) => [
    sorted((m.mapViews || []).map((l) => l.layer)),
    m.basemap || null,
  ],
  // Aggregated vs event table, tracker vs event program
  eventReports: (r) => [r.dataType, r.program?.programType],
  // Chart type, tracker vs event program
  eventCharts: (c) => [c.type, c.program?.programType],
  // Event vs enrollment output, tracker vs event program
  eventVisualizations: (e) => [e.outputType, e.program?.programType],
};

// What a dashboard test exercises is the kinds of items it renders
const dashboardTokens = (dashboard) => {
  const tokens = new Set();
  for (const item of dashboard.dashboardItems || []) {
    switch (item.type) {
      case "VISUALIZATION":
        tokens.add(`VISUALIZATION:${item.visualization?.type}`);
        break;
      case "MAP":
        (item.map?.mapViews || []).forEach((l) => tokens.add(`MAP:${l.layer}`));
        tokens.add("MAP");
        break;
      case "EVENT_CHART":
        tokens.add(`EVENT_CHART:${item.eventChart?.type}`);
        break;
      case "EVENT_REPORT":
        tokens.add(`EVENT_REPORT:${item.eventReport?.dataType}`);
        break;
      case "EVENT_VISUALIZATION":
        tokens.add(`EVENT_VISUALIZATION:${item.eventVisualization?.type}`);
        break;
      default:
        // TEXT, MESSAGES, RESOURCES, REPORTS, USERS, APP, ...
        if (item.type) tokens.add(item.type);
    }
  }
  return tokens;
};

// Greedy set cover: repeatedly take the dashboard that adds the most item kinds
// not yet covered (the one with fewer items wins ties, since it is cheaper to open).
const pickDashboards = (dashboards) => {
  const candidates = [...dashboards]
    .sort(byName)
    .map((d) => ({ d, tokens: dashboardTokens(d) }));
  const covered = new Set();
  const picked = [];

  for (;;) {
    let best;
    let bestGain = 0;
    for (const c of candidates) {
      const gain = [...c.tokens].filter((t) => !covered.has(t)).length;
      const smaller =
        best &&
        gain === bestGain &&
        (c.d.dashboardItems || []).length <
          (best.d.dashboardItems || []).length;
      if (gain > bestGain || smaller) {
        best = c;
        bestGain = gain;
      }
    }
    if (!best) return picked.map((c) => c.d);
    best.tokens.forEach((t) => covered.add(t));
    picked.push(best);
    candidates.splice(candidates.indexOf(best), 1);
  }
};

const select = (key, items) => {
  if (key === "dashboards") {
    return pickDashboards(items);
  }
  return SIGNATURES[key] ? onePerSignature(items, SIGNATURES[key]) : items;
};

module.exports = { select };
