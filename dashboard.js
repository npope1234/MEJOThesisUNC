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

function speciesChartOptions(yAxisTitle, horizontal = false) {
  return {
    indexAxis: horizontal ? 'y' : 'x',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#29261f',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 12
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: '#716b60'
        },
        grid: {
          color: '#d7d0c3'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: !horizontal,
          text: yAxisTitle,
          color: '#716b60'
        },
        ticks: {
          color: '#716b60'
        },
        grid: {
          color: '#d7d0c3'
        }
      }
    }
  };
}

function renderTimeline(features) {
  const years = Array.from({ length: 26 }, (_, i) => 2000 + i);
  const counts = years.map((year) =>
    features.filter((f) => Number(f.properties.year) === year).length
  );

  replaceChart('timelineChart', {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Occurrence records',
          data: counts,
          borderColor: '#c46056',
          backgroundColor: 'rgba(196, 96, 86, 0.16)',
          borderWidth: 3,
          pointRadius: 3,
          tension: 0.28,
          fill: true
        }
      ]
    },
    options: speciesChartOptions('Occurrence records')
  });
}

function renderStateBars(features) {
  const counts = countBy(features, (f) => f.properties.stateProvince || 'Unknown');
  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  replaceChart('stateChart', {
    type: 'bar',
    data: {
      labels: top.map((d) => d[0]),
      datasets: [
        {
          label: 'Records',
          data: top.map((d) => d[1]),
          backgroundColor: '#556b57',
          borderColor: '#315c3d',
          borderWidth: 1.5,
          borderRadius: 10
        }
      ]
    },
    options: speciesChartOptions('Occurrence records')
  });
}

function renderSpeciesBars() {
  const counts = countBy(state.invasive.features, (f) => f.properties.species || 'Unknown');
  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 13);

  replaceChart('speciesChart', {
    type: 'bar',
    data: {
      labels: top.map((d) => d[0]),
      datasets: [
        {
          label: 'Records',
          data: top.map((d) => d[1]),
          backgroundColor: '#315c3d',
          borderColor: '#556b57',
          borderWidth: 1.5,
          borderRadius: 10
        }
      ]
    },
    options: speciesChartOptions('Occurrence records', true)
  });
}

function replaceChart(canvasId, config) {
  if (state.charts[canvasId]) state.charts[canvasId].destroy();
  state.charts[canvasId] = new Chart(document.getElementById(canvasId), config);
}
function countBy(items, fn) { return items.reduce((acc, item) => { const key = fn(item); acc[key] = (acc[key] || 0) + 1; return acc; }, {}); }
function escapeHTML(value) { return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }

initDashboard().catch((error) => console.error('Dashboard could not load data:', error));

const climateStateFilter = document.getElementById('climateStateFilter');

const climateData = {
  temperature: [],
  precipitation: [],
  drought: [],
  charts: {}
};

const climateColors = {
  green: '#315c3d',
  green2: '#556b57',
  sage: '#bfc8ae',
  red: '#c46056',
  gold: '#b98644',
  blue: '#5d7988',
  muted: '#716b60',
  grid: '#d7d0c3'
};

async function loadCSV(path) {
  const response = await fetch(path);
  const text = await response.text();

  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(header => header.trim());

  return lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim());
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index];
    });

    return row;
  });
}

function getClimateRowsForState(data, selectedState) {
  return data
    .filter(row => row.State === selectedState)
    .sort((a, b) => Number(a.Year) - Number(b.Year));
}

function destroyClimateChart(chartId) {
  if (climateData.charts[chartId]) {
    climateData.charts[chartId].destroy();
  }
}

function createClimateLineChart(canvasId, labels, datasets, yAxisTitle) {
  const canvas = document.getElementById(canvasId);

  if (!canvas) return;

  destroyClimateChart(canvasId);

  climateData.charts[canvasId] = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          labels: {
            color: climateColors.muted,
            font: {
              family: 'Inter'
            }
          }
        },
        tooltip: {
          backgroundColor: '#29261f',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          padding: 12
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Year',
            color: climateColors.muted
          },
          ticks: {
            color: climateColors.muted
          },
          grid: {
            color: climateColors.grid
          }
        },
        y: {
          title: {
            display: true,
            text: yAxisTitle,
            color: climateColors.muted
          },
          ticks: {
            color: climateColors.muted
          },
          grid: {
            color: climateColors.grid
          },
          beginAtZero: false
        }
      }
    }
  });
}

function renderTemperatureChart(selectedState) {
  const rows = getClimateRowsForState(climateData.temperature, selectedState);

  const labels = rows.map(row => row.Year);
  const values = rows.map(row => Number(row.Value));

  createClimateLineChart(
    'temperatureChart',
    labels,
    [
      {
        label: `${selectedState} average temperature`,
        data: values,
        borderColor: climateColors.red,
        backgroundColor: 'rgba(196, 96, 86, 0.16)',
        borderWidth: 3,
        pointRadius: 3,
        tension: 0.25,
        fill: true
      }
    ],
    'Average temperature'
  );
}

function renderPrecipitationChart(selectedState) {
  const rows = getClimateRowsForState(climateData.precipitation, selectedState);

  const labels = rows.map(row => row.Year);
  const values = rows.map(row => Number(row.Value));

  createClimateLineChart(
    'precipitationChart',
    labels,
    [
      {
        label: `${selectedState} annual precipitation`,
        data: values,
        borderColor: climateColors.green,
        backgroundColor: 'rgba(49, 92, 61, 0.16)',
        borderWidth: 3,
        pointRadius: 3,
        tension: 0.25,
        fill: true
      }
    ],
    'Annual precipitation'
  );
}

function renderDroughtChart(selectedState) {
  const rows = getClimateRowsForState(climateData.drought, selectedState);

  const labels = rows.map(row => row.Year);
  const d1Values = rows.map(row => Number(row['D1 avg % area']));
  const d2Values = rows.map(row => Number(row['D2+ avg % area']));

  createClimateLineChart(
    'droughtChart',
    labels,
    [
      {
        label: 'D1',
        data: d1Values,
        borderColor: climateColors.gold,
        backgroundColor: 'rgba(185, 134, 68, 0.14)',
        borderWidth: 3,
        pointRadius: 3,
        tension: 0.25,
        fill: false
      },
      {
        label: 'D2',
        data: d2Values,
        borderColor: climateColors.red,
        backgroundColor: 'rgba(196, 96, 86, 0.14)',
        borderWidth: 3,
        pointRadius: 3,
        tension: 0.25,
        fill: false
      }
    ],
    'Average percent area'
  );
}

function renderClimateCharts() {
  const selectedState = climateStateFilter.value;

  renderTemperatureChart(selectedState);
  renderPrecipitationChart(selectedState);
  renderDroughtChart(selectedState);
}

async function initClimateCharts() {
  if (!climateStateFilter) return;

  climateData.temperature = await loadCSV('./data/annual_temperature_by_state.csv');
  climateData.precipitation = await loadCSV('./data/annual_precipitation_by_state.csv');
  climateData.drought = await loadCSV('./data/annual_drought_d1_d2plus_by_state_2000_2025.csv');

  renderClimateCharts();

  climateStateFilter.addEventListener('change', renderClimateCharts);
}

initClimateCharts();
