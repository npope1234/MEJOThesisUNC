const map = L.map('map', { zoomControl: true, preferCanvas: true, minZoom: 5 }).setView([34.7, -82.5], 6);

const lightBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri' });
const darkBasemap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { subdomains: 'abcd', maxZoom: 20, attribution: '&copy; OpenStreetMap contributors &copy; CARTO' });
lightBasemap.addTo(map);

const coordsControl = document.createElement('div');
coordsControl.className = 'coords-chip';
coordsControl.innerHTML = 'Hover over the map<br>to see coordinates';
document.querySelector('.map-stage').appendChild(coordsControl);
map.on('mousemove', (e) => {
  const { lat, lng } = e.latlng;
  coordsControl.innerHTML = `Latitude: ${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}<br>Longitude: ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
});
map.on('mouseout', () => { coordsControl.innerHTML = 'Hover over the map<br>to see coordinates'; });

const elements = {
  speciesSelect: document.getElementById('speciesSelect'),
  yearSlider: document.getElementById('yearSlider'),
  yearLabel: document.getElementById('yearLabel'),
  timelineCaption: document.getElementById('timelineCaption'),
  selectedSpeciesName: document.getElementById('selectedSpeciesName'),
  selectedSpeciesCount: document.getElementById('selectedSpeciesCount'),
  visibleOccurrences: document.getElementById('visibleOccurrences'),
  totalSpecies: document.getElementById('totalSpecies'),
  detailsContent: document.getElementById('detailsContent'),
  toggleInvasive: document.getElementById('toggleInvasive'),
  toggleTerritories: document.getElementById('toggleTerritories'),
};

const layerState = {
  invasiveData: null,
  territoriesData: null,
  filteredFeatures: [],
  currentSpecies: 'Kudzu',
  currentYear: 2025,
  territoryLayer: null,
  invasiveLayer: null,
};

const regionImpactBySpecies = {
  'Kudzu': 'Fast-growing vine that can smother trees and edge habitat, reducing native plant cover and reshaping forest structure.',
  'Chinese Privet': 'Dense thickets can displace native understory plants and reduce habitat quality for birds and pollinators.',
  'Chinese Tallowtree': 'Can spread through floodplains and disturbed sites, changing forest composition and limiting native regeneration.',
  'Chinese Wisteria': 'Woody vine that can blanket shrubs and trees, suppressing native growth and changing light availability.',
  'Common Reed': 'Can dominate wetlands, alter hydrology, and reduce habitat diversity for marsh-dependent species.',
  'Garlic Mustard': 'Can suppress native woodland plants and interfere with soil relationships that support forest biodiversity.',
  'Hydrilla': 'Aggressive aquatic invader that can choke waterways, reduce oxygen, and alter freshwater habitat structure.',
  'Japanese Honeysuckle': 'Sprawling vine that can overtake native vegetation and shift wildlife habitat at forest edges.',
  'Japanese Stiltgrass': 'Can spread across forest floors and disturbed ground, reducing native herb diversity and changing fire behavior.',
  'Multiflora Rose': 'Thorny, dense shrub that can crowd out native plants and make habitat less usable for some species.',
  'Autumn Olive': 'Can spread quickly into fields and forest edges, changing soil chemistry and crowding native vegetation.',
  'Purple Loosestrife': 'Can dominate wetlands and reduce the native plant variety needed by many insects and birds.',
  'Tree-of-Heaven': 'Rapid colonizer of roadsides and disturbed land that competes strongly with native plants and can promote monocultures.'
};

function syncBasemap() {
  const isDark = document.body.classList.contains('dark-mode');
  if (isDark) { if (map.hasLayer(lightBasemap)) map.removeLayer(lightBasemap); if (!map.hasLayer(darkBasemap)) darkBasemap.addTo(map); }
  else { if (map.hasLayer(darkBasemap)) map.removeLayer(darkBasemap); if (!map.hasLayer(lightBasemap)) lightBasemap.addTo(map); }
}
setInterval(syncBasemap, 500);

async function loadData() {
  const [invasive, territories] = await Promise.all([
    fetch('./data/invasive_species.geojson').then((r) => r.json()),
    fetch('./data/indigenous_territories_FINAL.geojson').then((r) => r.json())
  ]);
  layerState.invasiveData = invasive;
  layerState.territoriesData = territories;
  initializeControls();
  buildTerritoriesLayer();
  updateMap();
}

function initializeControls() {
  const speciesList = [...new Set(layerState.invasiveData.features.map((f) => f.properties.species))].filter(Boolean).sort((a,b) => a.localeCompare(b));
  if (!speciesList.includes(layerState.currentSpecies)) layerState.currentSpecies = speciesList[0];
  elements.totalSpecies.textContent = speciesList.length.toString();
  elements.speciesSelect.innerHTML = speciesList.map((species) => `<option value="${species}" ${species === layerState.currentSpecies ? 'selected' : ''}>${species}</option>`).join('');
  elements.speciesSelect.addEventListener('change', () => { layerState.currentSpecies = elements.speciesSelect.value; updateMap(); });
  elements.yearSlider.addEventListener('input', () => {
    layerState.currentYear = Number(elements.yearSlider.value);
    elements.yearLabel.textContent = layerState.currentYear;
    elements.timelineCaption.textContent = `Showing occurrences from 2000 to ${layerState.currentYear}`;
    updateMap();
  });
  elements.toggleInvasive.addEventListener('change', syncLayerVisibility);
  elements.toggleTerritories.addEventListener('change', syncLayerVisibility);
}

function buildTerritoriesLayer() {
  layerState.territoryLayer = L.geoJSON(layerState.territoriesData, {
    style: () => ({ color:'#556b57', weight:2.4, fillColor:'#bfc8ae', fillOpacity:0.28 }),
    onEachFeature: (feature, layer) => {
      const props = feature.properties || {};
      const name = props.display_name || props.Name || props.name || 'Indigenous territory';
      layer.bindTooltip(name, { permanent:false, direction:'center', className:'territory-tooltip' });
      layer.on('click', () => renderTerritoryDetails(feature));
    }
  });
  syncLayerVisibility();
}

function syncLayerVisibility() {
  toggleLayer(layerState.invasiveLayer, elements.toggleInvasive?.checked);
  toggleLayer(layerState.territoryLayer, elements.toggleTerritories?.checked);
}
function toggleLayer(layer, shouldShow) {
  if (!layer) return;
  if (shouldShow && !map.hasLayer(layer)) layer.addTo(map);
  if (!shouldShow && map.hasLayer(layer)) map.removeLayer(layer);
}

function updateMap() {
  if (layerState.invasiveLayer && map.hasLayer(layerState.invasiveLayer)) map.removeLayer(layerState.invasiveLayer);
  const species = layerState.currentSpecies;
  const year = layerState.currentYear;
  const filtered = layerState.invasiveData.features.filter((feature) => {
    const props = feature.properties || {};
    const featureYear = Number(props.year);
    return props.species === species && Number.isFinite(featureYear) && featureYear >= 2000 && featureYear <= year;
  });
  layerState.filteredFeatures = filtered;
  elements.selectedSpeciesName.textContent = species;
  elements.selectedSpeciesCount.textContent = `${filtered.length.toLocaleString()} occurrences`;
  elements.visibleOccurrences.textContent = filtered.length.toLocaleString();
  layerState.invasiveLayer = L.geoJSON({ type:'FeatureCollection', features: filtered }, {
    renderer: L.canvas({ padding: 0.5 }),
    pointToLayer: (_feature, latlng) => L.circleMarker(latlng, { radius: 2.6, color:'#c46056', weight:0, fillColor:'#c46056', fillOpacity:0.72 }),
    onEachFeature: (feature, layer) => layer.on('click', () => renderOccurrenceDetails(feature))
  });
  syncLayerVisibility();
  const layersToFit = [];
  if (elements.toggleInvasive.checked && layerState.invasiveLayer.getLayers().length) layersToFit.push(layerState.invasiveLayer);
  if (elements.toggleTerritories.checked && layerState.territoryLayer) layersToFit.push(layerState.territoryLayer);
  if (layersToFit.length) {
    const bounds = L.featureGroup(layersToFit).getBounds();
    if (bounds.isValid()) map.fitBounds(bounds.pad(0.04), { animate:false });
  }
}

function renderOccurrenceDetails(feature) {
  const props = feature.properties || {};
  const point = turf.point(feature.geometry.coordinates);
  const relatedTerritory = findRelevantTerritory(point);
  const relatedProps = relatedTerritory?.properties || {};
  const territoryName = relatedProps.display_name || relatedProps.Name || relatedProps.name || 'Regional context';
  const culturalContext = relatedProps.cultural_context || 'This occurrence is outside the highlighted territory polygons, but it still contributes to broader regional ecological pressure across the Southeast.';
  const environmentalContext = relatedProps.environmental_context || 'Invasive spread can contribute to biodiversity loss, habitat simplification, and additional stress in ecosystems affected by changing climate conditions.';
  const speciesImpact = regionImpactBySpecies[props.species] || 'This invasive species can alter habitat structure and increase ecological stress where it spreads.';
  elements.detailsContent.innerHTML = `
    <div class="badge">Occurrence point selected</div>
    <div class="info-block"><h3>Basic occurrence data</h3><div class="info-grid">
      <div><span class="label">Scientific name</span><span>${escapeHTML(props.scientificName || props.species || 'Not available')}</span></div>
      <div><span class="label">Date</span><span>${escapeHTML(formatDate(props.eventDate, props.year, props.month, props.day))}</span></div>
      <div><span class="label">Location</span><span>${escapeHTML(props.stateProvince || props.country || 'Unknown location')}</span></div>
      <div><span class="label">Coordinates</span><span>${formatCoordinates(feature.geometry.coordinates)}</span></div>
    </div></div>
    <div class="info-block"><h3>Regional cultural context</h3><p><strong>${escapeHTML(territoryName)}:</strong> ${escapeHTML(culturalContext)}</p><p>${escapeHTML(props.species)} may affect traditional practices by changing access to native plant communities, altering waterways or forest edges, and reducing ecological stability.</p></div>
    <div class="info-block"><h3>Environmental impact</h3><p>${escapeHTML(speciesImpact)}</p><p>${escapeHTML(environmentalContext)}</p><p>Climate stressors can amplify spread by extending growing seasons, increasing disturbance, and weakening native habitat resilience.</p></div>`;
}

function renderTerritoryDetails(feature) {
  const props = feature.properties || {};
  const territoryName = props.display_name || props.Name || props.name || 'Indigenous territory';
  const intersectingCount = layerState.filteredFeatures.filter((occurrence) => {
    try { return turf.booleanPointInPolygon(turf.point(occurrence.geometry.coordinates), feature); } catch { return false; }
  }).length;
  elements.detailsContent.innerHTML = `<div class="badge">Indigenous territory selected</div><div class="info-block"><h3>${escapeHTML(territoryName)}</h3><p><strong>Included states:</strong> ${escapeHTML(props.included_states || 'Specified Southeast states')}</p><p>${escapeHTML(props.cultural_context || 'Cultural context not available.')}</p></div><div class="info-block"><h3>Environmental context</h3><p>${escapeHTML(props.environmental_context || 'Environmental context not available.')}</p><p><strong>Visible ${escapeHTML(layerState.currentSpecies)} occurrences inside this territory:</strong> ${intersectingCount.toLocaleString()}</p></div>`;
}

function findRelevantTerritory(point) {
  for (const feature of layerState.territoriesData.features) {
    try { if (turf.booleanPointInPolygon(point, feature)) return feature; } catch {}
  }
  let nearest = null, nearestDistance = Infinity;
  for (const feature of layerState.territoriesData.features) {
    try {
      const distance = turf.distance(point, turf.centerOfMass(feature), { units:'miles' });
      if (distance < nearestDistance) { nearestDistance = distance; nearest = feature; }
    } catch {}
  }
  return nearest;
}
function formatDate(eventDate, year, month, day) {
  if (eventDate) { const asDate = new Date(eventDate); if (!Number.isNaN(asDate.getTime())) return asDate.toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' }); return String(eventDate); }
  const parts = [year, month, day].filter(Boolean); return parts.length ? parts.join('-') : 'Not available';
}
function formatCoordinates(coords) { return Array.isArray(coords) && coords.length >= 2 ? `${Number(coords[1]).toFixed(4)}, ${Number(coords[0]).toFixed(4)}` : 'Not available'; }
function escapeHTML(value) { return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }

loadData().catch((error) => {
  console.error(error);
  elements.detailsContent.innerHTML = `<div class="info-block"><h3>Could not load map data</h3><p>Run this project from a local server in VS Code, not by opening the HTML file directly.</p><p>Error: ${escapeHTML(error.message)}</p></div>`;
});
