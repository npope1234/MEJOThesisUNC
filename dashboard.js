const state = { invasive: null, territories: null, charts: {} };
const els = {
  metricOccurrences: document.getElementById('metricOccurrences'),
  metricSpecies: document.getElementById('metricSpecies'),
  metricStates: document.getElementById('metricStates'),
  metricTerritories: document.getElementById('metricTerritories'),
  speciesFilter: document.getElementById('speciesFilter'),
  stateFilter: document.getElementById('stateFilter')
};

async function initDashboard() {
  const [invasive, territories] = await Promise.all([
    fetch('./data/invasive_species.geojson').then((r) => r.json()),
    fetch('./data/indigenous_territories_FINAL.geojson').then((r) => r.json())
  ]);
  state.invasive = invasive;
  state.territories = territories;
  populateMetrics();
  populateFilters();
  renderCharts();
  els.speciesFilter.addEventListener('change', renderCharts);
  els.stateFilter.addEventListener('change', renderCharts);
}

function populateMetrics() {
  const features = state.invasive.features;
  const species = new Set(features.map((f) => f.properties.species).filter(Boolean));
  const states = new Set(features.map((f) => f.properties.stateProvince).filter(Boolean));
  els.metricOccurrences.textContent = features.length.toLocaleString();
  els.metricSpecies.textContent = species.size.toLocaleString();
  els.metricStates.textContent = states.size.toLocaleString();
  els.metricTerritories.textContent = state.territories.features.length.toLocaleString();
}

function populateFilters() {
  const features = state.invasive.features;
  const species = [...new Set(features.map((f) => f.properties.species).filter(Boolean))].sort();
  const states = [...new Set(features.map((f) => f.properties.stateProvince).filter(Boolean))].sort();
  els.speciesFilter.innerHTML = '<option value="all">All species</option>' + species.map((s) => `<option value="${escapeHTML(s)}">${escapeHTML(s)}</option>`).join('');
  els.stateFilter.innerHTML = '<option value="all">All states</option>' + states.map((s) => `<option value="${escapeHTML(s)}">${escapeHTML(s)}</option>`).join('');
}

function getFilteredFeatures() {
  const species = els.speciesFilter.value;
  const selectedState = els.stateFilter.value;
  return state.invasive.features.filter((feature) => {
    const props = feature.properties || {};
    return (species === 'all' || props.species === species) && (selectedState === 'all' || props.stateProvince === selectedState);
  });
}

function renderCharts() {
  const features = getFilteredFeatures();
  renderTimeline(features);
  renderStateBars(features);
  renderSpeciesBars();
}

function renderTimeline(features) {
  const years = Array.from({ length: 26 }, (_, i) => 2000 + i);
  const counts = years.map((year) => features.filter((f) => Number(f.properties.year) === year).length);
  replaceChart('timelineChart', {
    type: 'line',
    data: { labels: years, datasets: [{ label: 'Occurrence records', data: counts, tension: 0.28, fill: false }] },
    options: { responsive: true, plugins: { tooltip: { enabled: true }, legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
}

function renderStateBars(features) {
  const counts = countBy(features, (f) => f.properties.stateProvince || 'Unknown');
  const top = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0, 8);
  replaceChart('stateChart', {
    type: 'bar',
    data: { labels: top.map((d) => d[0]), datasets: [{ label: 'Records', data: top.map((d) => d[1]) }] },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
}

function renderSpeciesBars() {
  const counts = countBy(state.invasive.features, (f) => f.properties.species || 'Unknown');
  const top = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0, 13);
  replaceChart('speciesChart', {
    type: 'bar',
    data: { labels: top.map((d) => d[0]), datasets: [{ label: 'Records', data: top.map((d) => d[1]) }] },
    options: { indexAxis: 'y', responsive: true, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true } } }
  });
}

function replaceChart(canvasId, config) {
  if (state.charts[canvasId]) state.charts[canvasId].destroy();
  state.charts[canvasId] = new Chart(document.getElementById(canvasId), config);
}
function countBy(items, fn) { return items.reduce((acc, item) => { const key = fn(item); acc[key] = (acc[key] || 0) + 1; return acc; }, {}); }
function escapeHTML(value) { return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }

initDashboard().catch((error) => console.error('Dashboard could not load data:', error));
