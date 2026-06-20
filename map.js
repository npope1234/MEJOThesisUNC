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
  territorySelect: document.getElementById('territorySelect'),
  yearSlider: document.getElementById('yearSlider'),
  yearLabel: document.getElementById('yearLabel'),
  timelineCaption: document.getElementById('timelineCaption'),
  selectedSpeciesName: document.getElementById('selectedSpeciesName'),
  selectedSpeciesCount: document.getElementById('selectedSpeciesCount'),
  visibleOccurrences: document.getElementById('visibleOccurrences'),
  totalSpecies: document.getElementById('totalSpecies'),
  detailsContent: document.getElementById('detailsContent'),
  toggleInvasive: document.getElementById('toggleInvasive'),
  //toggleTerritories: document.getElementById('toggleTerritories'),
};

const layerState = {
  invasiveData: null,
  territoriesData: null,
  indigenousContext: null,
  filteredFeatures: [],
  currentSpecies: 'Kudzu',
  currentYear: 2000,
  territoryLayer: null,
  invasiveLayer: null,
  selectedTerritoryLayer: null,
  animationTimer: null,
  isAnimating: false,
};

const plantPhotosBySpecies = {
  'Kudzu': [
    {
      src: './assets/kudzu.jpg',
      },
    {
      src: './assets/kudzu3.jpg',
     },
    {
      src: './assets/kudzu5.jpg',
      }
  ],

  'Tree-of-Heaven': [
    {
      src: './assets/treeofheaven.jpeg',
      },
    {
      src: './assets/treeofheaven2.jpeg',
      },
      {
      src: './assets/treeofheaven3.jpeg',
      }
  ],

  'Garlic Mustard': [
    {
      src: './assets/garlic_mustard.jpg',
      },
    {
      src: './assets/garlic_mustard_.jpg',
      },
    {
      src: './assets/garlicmustard.jpg',
      }
  ],

  'Autumn Olive': [
    {
      src: './assets/autumnolive.jpg',
     },
    {
      src: './assets/autumnolive2.jpg',
    },
    {
      src: './assets/autumnolive3.jpg'
    }
  ],

  'Hydrilla': [
    {
      src: './assets/hydrilla.jpeg',
    },
    {
      src: './assets/hydrilla2.jpeg',
      }
  ],

  'Japanese Honeysuckle': [
    {
      src: './assets/honeysuckle.jpeg',
     },
     {
      src: './assets/honeysuckle2.jpeg',
     }
  ],

  'Chinese Wisteria': [
    {
      src: './assets/wisteria.jpg',
     },
    {
      src: './assets/wisteria2.jpg',
      },
      {
      src: './assets/wisteria3.jpeg',
     }
  ],

  'Common Reed': [
    {
      src: './assets/common_reed.jpeg',
     },
     {
      src: './assets/commonreed.jpeg',
     }
  ],

  'Japanese Stiltgrass': [
    {
      src: './assets/japstiltgrass.jpeg',
      },
      {
      src: './assets/japstiltgrass2.jpg',
     },
     {
      src: './assets/japstiltgrass3.jpg',
     }
  ],

  'Purple Loosestrife': [
    {
      src: './assets/purpleloosestrife.jpeg',
     },
    {
      src: './assets/purpleloosestrife2.jpg',
      }
  ],

  'Multiflora Rose': [
    {
      src: './assets/multiflorarose.jpeg'},
    {
      src: './assets/multiflorarose2.jpeg'},
    {
      src: './assets/multiflorarose3.jpeg'}   
  ],

  'Chinese Tallow Tree': [
    {
      src: './assets/chinese_tallow_tree2.jpeg',
    },
    {
      src: './assets/chinese_tallow_tree.jpeg',
    },
    {
      src: './assets/chinesetallowtree.jpeg',
    }
  ],

  'Chinese Privet': [
    {
      src: './assets/chineseprivet.jpeg',
    },
    {
      src: './assets/chineseprivet2.jpeg',
    }
  ]
};

function renderPlantPhotoCarousel(species) {
  const photos = plantPhotosBySpecies[species] || [];

  if (!photos.length) {
    return '';
  }

  const slides = photos.map((photo, index) => `
    <figure class="plant-photo-slide ${index === 0 ? 'active' : ''}" data-slide="${index}">
      <img src="${escapeHTML(photo.src)}" alt="${escapeHTML(species)} plant photo">
      ${photo.caption ? `<figcaption>${escapeHTML(photo.caption)}</figcaption>` : ''}
    </figure>
  `).join('');

  const dots = photos.map((_, index) => `
    <button class="plant-photo-dot ${index === 0 ? 'active' : ''}" type="button" data-slide="${index}" aria-label="Show plant photo ${index + 1}"></button>
  `).join('');

  const controls = photos.length > 1 ? `
    <div class="plant-photo-controls">
      <button class="plant-photo-prev" type="button" aria-label="Previous plant photo">‹</button>
      <div class="plant-photo-dots">${dots}</div>
      <button class="plant-photo-next" type="button" aria-label="Next plant photo">›</button>
    </div>
  ` : '';

  return `
    <div class="plant-photo-carousel" data-species="${escapeHTML(species)}">
      <div class="plant-photo-slides">
        ${slides}
      </div>
      ${controls}
    </div>
  `;
}

const plantDescriptionBySpecies = {
  'Kudzu': 'Climbing, deciduous vine with fleshy tap roots. Leaves are alternate, compound with three, usually lobed, leaflets and is hairy underneath. Flowers are long, purple, and fragrant, hang clusters in the axils of the leaves. Fruits are brown, hairy and flat with wide seed pods.',
  'Chinese Privet': 'Semi-evergreen shrub or small tree with a trunk that usually occurs as multiple stems with many long, leafy branches. Leaves are opposite and oblong. Foliage can be pubescent along the underside of the midvein. Typically from April to June, panicles of white/cream flowers develop in terminal and upper axillary clusters. Fruit begins greens, ripens to dark purple/black. Birds and other wildlife eat the fruit then disperse the seeds. Plant also colonizes by root sprouts.',
  'Chinese Tallow Tree': 'Deciduous tree with alternate, heart-shaped leaves with long, pointed tips. When flowering, flowers are yellowish and occur on long, dangling spikes. Fruit are three-lobed and found in clusters at the end of the branches.',
  'Chinese Wisteria': 'Deciduous woody vine with stems that have smooth, gray-brown bark. When looking down on the vine, it twines in a counter clockwise direction around the host. Alternate, pinnately compound leaves are tapered at the tip with wavy edges. Lavender, purple or white flowers are fragrant, very showy and abundant and occur in long, dangling clusters in the spring. Seeds are contained in flattened, hairy, bean-like pods. Invasions often occur around previous plantings.',
  'Common Reed': 'Tall, perennial grass with broad, pointed leaves that arise from thick, vertical stalks. Leaves are flat and glabrous. The flower heads are dense, fluffy, gray or purple in color. The seeds are brown and light weight. In the fall the plant turns brown, and the inflorescences persist throughout the winter.',
  'Garlic Mustard': 'Herbaceous, biennial forb. First year plants are basal rosettes which bolt and flower in the second year. Plants can be easily recognized by a garlic odor that is present when any part of the plant is crushed. Foliage on first year rosettes is green, heart shaped leaves. Foliage becomes more triangular and strongly toothed as the plant matures. Second year plants produce a tall flowering stalk. Each flower has four small, white petals in the early spring. Mature seeds are shiny black and produced in erect, slender green pods which turn pale brown when mature.',
  'Hydrilla': 'Submersed, rooted aquatic plant. Leaves are whorled in bunches, midribs of the leaves are reddish in color with the undersides having small, raised teeth. Leaves have serrated margins. Only the female flowers have been found in the U.S., which means no viable seed are produced. Turions (stem tubers) are bud-like structures which can drop off the plant and successfully survive freezing or drought. Tubers from the rhizomes are another way these plants reproduce and increase their invasive potential.',
  'Japanese Honeysuckle': 'Woody perennial, evergreen to semi-evergreen vine that can be found either trailing or climbing. Young stems may be pubescent while older stems are glabrous. Leaves are opposite, pubescent, and oval. Margins are usually entire but young leaves may be lobed or toothed. Flowering occurs from April to July, when showy, fragrant, tubular, whitish-pink flowers develop in the axils of the leaves. The flowers turn cream-yellow as they age. The small shiny globular fruits turn from green to black as they ripen. Each fruit contains 2-3 small brown to black ovate seeds.',
  'Japanese Stiltgrass': 'Delicate, sprawling annual grass with stems that root at the nodes. Leaves are pale-green, alternate, lance-shaped, long, asymmetrical with a shiny, off-center midrib. Upper and lower leaf surface is slightly pubescent. A silvery line runs down the center of the blade. Stems usually drop. When flowering, delicate flower stalks develop in the axils of the leaves or at the top of the stems.',
  'Multiflora Rose': 'Multistemmed, thorny, perennial shrub. The stems are green to red arching canes which are round in cross section and have stiff, curved thorns. Leaves are pinnately compound with 7-9 leaflets. Leaflets are oblong and have serrated edges. The fringed petioles usually distinguish it from most other rose species. Small, white to pinkish, 5-petaled flowers occur abundantly in clusters on the plant in the spring. Fruit are small, red rose hips that remain on the plant throughout the winter. Birds and other wildlife eat the fruit and disperse the seeds.',
  'Autumn Olive': 'Deciduous shrub with thorny brances. Easily recognized by the silvery, dotted underside of the leaves. Leaves are alternate. The margins are entire and undulate. Leaves are bright green to gray green above and silver scaly beneath with short petioles. Small, yellowish tubular flowers are abundant and occur in clusters of 5 to 10 near the stems. Fruits are round, red, juicy drupes which are finely dotted with silvery to silvery-brown scales. Each drupe contains one seed.',
  'Purple Loosestrife': 'Tall, multistemmed, perennial forb. The opposite or whorled leaves are dark-green, lance-shaped, sessile, and round or heart-shaped at the base. Flowering occurs in July to October, when pink to purplish flowers develop in spikes at the tops of the stems. Flowers have 5-7 petals and twice as many stamens as petals. Fruits are capsules that are enclosed in the hairy sepals and contain several reddish brown seeds.',
  'Tree-of-Heaven': 'Rapidly growing, typically small tree with large leaf scars on the twigs. Leaves are pinnately compound with 10-41 leaflets. It resembles native sumac and hickory species, but is easily distinguished by the glandular, notched base on each leaflet. When flowering (which happens twice a year), yellow flowers appear in large clusters above the foliage. Fruit is tan to reddish, single winged and can be wind or water dispersed.',
};

const regionImpactBySpecies = {
  'Kudzu': 'Native to Asia, was introduced to the United States in 1876 at the Philadelphia Centennial Exposition. Featured in the Japanese Pavilion, the vine was initially promoted as an ornamental, aromatic plant for covering porches and arbors. Its rapid growth and hardy nature later led to its widespread promotion for erosion control in the 1930s. They prefer open, undisturbed areas like roadsides, right-of-ways, forest edges, and old fields. It grows over, shades out, and kills all other vegetation, including trees.',
  'Chinese Privet': 'Native to Europe and Asia, was introduced in 1852 as an ornamental plant. Commonly used as an ornamental shrub and for hedgerows. Several species occur, and distinguishing between them can be difficult. It can tolerate a wide range of conditions. Forms dense thickets that invade fields, fencerows, roadsides, forest understories, and riparian sites. They can shade out and exclude native understory species, even reducing tree recruitment.',
  'Chinese Tallow Tree': "Native to China, was introduced to South Carolina in 1776 for ornamental purposes and seed oil production. Invades wet areas like stream banks and ditches, can also sometimes invade drier upland sites. It's threat comes from its ability to invade high quality, undisturbed forests. It can displace native vegetation and alter soil conditions due to high amounts of tannis present in the leaf litter.",
  'Chinese Wisteria': 'A native of China, it was first introduced into the United States in 1816 for ornamental purposes. Can displace native vegetation and kill trees and shrubs by girdling them. The vine has the ability to change the structure of a forest by killing trees and altering the light availability to the forest floor.',
  'Common Reed': 'Native to Eurasia and Africa. Native Phragmites do occur in the United States and they are sometimes very difficult to distinguish from the exotics. Usually found in dense thickets growing in or near shallow water. These thickets displace native wetlands plants, alter hydrology and block sunlight to the aquatic community.',
  'Garlic Mustard': 'Native to Europe and was first introduced during the 1800s for medicinal and culinary purposes. An aggressive invader of wooded areas throughout the eastern and middle United States. A high shade tolerance allows this plant to invade high quality, mature woodlands, where it can form dense stands. These stands not only shade out native understory flora but also produce allelopathic compounds that inhibit seed germination of other species.',
  'Hydrilla': 'This plant is believed to be native to Asia or Africa, although it is widely spread across the globe. It was first introduced into North America as an aquarium plant in the 1950s. Forms dense mats at the surface of the water. The dense mats can restrict native vegetation, irrigation practices, recreation, hydroelectric production, and water flow. It can invade most slow-moving or still water systems.',
  'Japanese Honeysuckle': 'Native of eastern Asia, it was first introduced into North America in 1806 in Long Island, NY. Lonicera japonica has been planted widely throughout the United States as an ornamental, for erosion control, and for wildlife habitat. Invades a wide variety of habitats including forest floors, canopies, roadsides, wetlands, and disturbed areas. It can girdle small saplings by twining around them, and can form dense mats in the canopies of trees, shading everything below.',
  'Japanese Stiltgrass': 'Native to Asia and was accidentally introduced to North America around 1920. Previously used as packing material for porcelain, possibly explaining its accidental introduction. Most comonly invades floodplains. Also found in ditches, forest edges, fields, and trails. Very shade tolerant and can completely displace native vegetation.',
  'Multiflora Rose': 'Native to Asia and was first introduced to North America in 1866 as rootstock for ornamental roses. During the mid 1900s it was widely planted as a “living fence” for livestock control. Forms impenetrable thickets in pastures, fields, and forest edges. It restricts human, livestock, and wildlife movement and displaces native vegetation. It tolerates a wide range of conditions allowing it to invade habitats across the United States.',
  'Autumn Olive': 'Native to China and Japan and was introduced into North America in 1830. Since then, it has been widely planted for wildlife habitat, mine reclamation, and shelterbelts. It is a non-leguminous nitrogen fixer. Invades old fields, woodland edges, and other disturbed areas. It can form a dense shrub layer which displaces native species and closes open areas.',
  'Purple Loosestrife': 'Native to Europe and Asia. It was first introduced into North America in the early 1800s for ornamental and medicinal purposes. Serious invader of many types of wetlands, including wet meadows, prairie potholes, river and stream banks, lake shores, tidal and nontidal marshes, and ditches. It can quickly form dense stands that completely dominate the area excluding native vegetation. This plant can spread very rapidly due to its prolific seed production; each plant can produce up to 2.5 million seeds per year. It can also hybridize with native loosestrife species, potentially depleting the native species gene pool.',
  'Tree-of-Heaven': 'It was introduced from China in the late 18th century as an ornamental and was widely planted in cities because of its ability to grow in poor conditions. Forms dense, clonal thickets which displace native species and can rapidly invade fields, meadows, and harvested forests. It is extremely tolerant of poor soil conditions and can even grow in cement cracks. It is not shade tolerant, but easily invades disturbed forests or forest edges causing habitat damage. the management and control efforts for this species cause the United States great economic cost.'
};

function syncBasemap() {
  const isDark = document.body.classList.contains('dark-mode');
  if (isDark) { if (map.hasLayer(lightBasemap)) map.removeLayer(lightBasemap); if (!map.hasLayer(darkBasemap)) darkBasemap.addTo(map); }
  else { if (map.hasLayer(darkBasemap)) map.removeLayer(darkBasemap); if (!map.hasLayer(lightBasemap)) lightBasemap.addTo(map); }
}
setInterval(syncBasemap, 500);

async function loadData() {
  const [invasive, territories, indigenousContext] = await Promise.all([
    fetch('./data/invasive_species.geojson').then((r) => r.json()),
    fetch('./data/indigenous_territories_FINAL.geojson').then((r) => r.json()),
    fetch('./data/indigenous_context.json').then((r) => r.json())
  ]);

  layerState.invasiveData = invasive;
  layerState.territoriesData = territories;
  layerState.indigenousContext = indigenousContext;

  initializeControls();
  buildTerritoriesLayer();
  updateMap({ fitBounds: true });
  startSpreadAnimation();
}

map.on('click', (event) => {
  if (!layerState.territoriesData) return;

  const overlappingTerritories = getTerritoriesAtPoint(event.latlng);

  if (!overlappingTerritories.length) {
    elements.detailsContent.innerHTML = `
      <div class="empty-state">
        <strong>No Indigenous territory selected</strong>
        <p>No highlighted Indigenous territory polygon contains this clicked location. Try clicking another area or use the territory dropdown.</p>
      </div>
    `;
    return;
  }

  elements.detailsContent.innerHTML = `
    <div class="badge">Map location selected</div>

    <div class="info-block">
      <h3>Indigenous territories at this location</h3>
      <p class="subtle">
        Several Indigenous territory polygons may overlap here. Choose one to read its regional context.
      </p>

      <div class="territory-choice-list">
        ${overlappingTerritories.map((territory) => {
          const territoryIndex = layerState.territoriesData.features.indexOf(territory);

          return `
            <button class="territory-choice-btn" type="button" data-territory-index="${territoryIndex}">
              ${escapeHTML(getTerritoryName(territory))}
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;

  document.querySelectorAll('.territory-choice-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const territoryIndex = Number(button.dataset.territoryIndex);
      const territory = layerState.territoriesData.features[territoryIndex];

      selectTerritoryFromList(territory);

      if (elements.territorySelect) {
        elements.territorySelect.value = territoryIndex;
      }
    });
  });
});

map.on('zoomend', () => {
  if (!layerState.invasiveLayer) return;

  const radius = getOccurrenceRadius();

  layerState.invasiveLayer.eachLayer((layer) => {
    if (layer.setRadius) {
      layer.setRadius(radius);
    }
  });
});

function initializeControls() {
  const speciesList = [...new Set(layerState.invasiveData.features.map((f) => f.properties.species))].filter(Boolean).sort((a,b) => a.localeCompare(b));
  if (!speciesList.includes(layerState.currentSpecies)) layerState.currentSpecies = speciesList[0];
  elements.totalSpecies.textContent = speciesList.length.toString();
  elements.speciesSelect.innerHTML = speciesList
  .map(
    (species) =>
      `<option value="${species}" ${
        species === layerState.currentSpecies ? 'selected' : ''
      }>${species}</option>`
  )
  .join('');

renderSelectedSpeciesPhoto(layerState.currentSpecies);

elements.speciesSelect.addEventListener('change', () => {
  stopSpreadAnimation();

  layerState.currentSpecies = elements.speciesSelect.value;

  renderSelectedSpeciesPhoto(layerState.currentSpecies);

  startSpreadAnimation();
});
  elements.yearSlider.addEventListener('input', () => {
  stopSpreadAnimation();
  setTimelineYear(Number(elements.yearSlider.value));
  updateMap({ fitBounds: false });
});
  elements.toggleInvasive.addEventListener('change', syncLayerVisibility);
  populateTerritorySelect();
}

function setTimelineYear(year) {
  layerState.currentYear = year;
  elements.yearSlider.value = year;
  elements.yearLabel.textContent = year;
  elements.timelineCaption.textContent = `Showing occurrences from 2000 to ${year}`;
}

function stopSpreadAnimation() {
  if (layerState.animationTimer) {
    clearInterval(layerState.animationTimer);
    layerState.animationTimer = null;
  }

  layerState.isAnimating = false;
}

function startSpreadAnimation() {
  stopSpreadAnimation();

  layerState.isAnimating = true;
  setTimelineYear(2000);
  updateMap({ fitBounds: true });

  layerState.animationTimer = setInterval(() => {
    const nextYear = layerState.currentYear + 1;

    if (nextYear > 2025) {
      stopSpreadAnimation();
      setTimelineYear(2025);
      updateMap({ fitBounds: false });
      return;
    }

    setTimelineYear(nextYear);
    updateMap({ fitBounds: false });
  }, 350);
}

function getOccurrenceRadius() {
  const zoom = map.getZoom();

  if (zoom <= 6) return 2.6;
  if (zoom <= 7) return 3.2;
  if (zoom <= 8) return 4;
  if (zoom <= 9) return 5;
  if (zoom <= 10) return 6;
  return 7;
}

function getIndigenousContext(feature) {
  const props = feature.properties || {};

  const possibleNames = [
    props.display_name,
    props.Name,
    props.name
  ].filter(Boolean);

  for (const name of possibleNames) {
    if (layerState.indigenousContext?.[name]) {
      return layerState.indigenousContext[name];
    }
  }

  return {
    description: 'Description information is not available for this Indigenous territory.',
    language: 'Language information is not available for this Indigenous territory.',
    culture: 'Culture information is not available for this Indigenous territory.'
  };
}

function getTerritoryName(feature) {
  const props = feature.properties || {};
  return props.display_name || props.Name || props.name || 'Indigenous territory';
}

function normalTerritoryStyle() {
  return {
    color: '#556b57',
    weight: 2.2,
    fillColor: '#bfc8ae',
    fillOpacity: 0.08
  };
}

function selectedTerritoryStyle() {
  return {
    color: '#c46056',
    weight: 4,
    fillColor: '#bfc8ae',
    fillOpacity: 0.32
  };
}

function selectTerritoryFromList(feature) {
  renderTerritoryDetails(feature);

  layerState.territoryLayer.eachLayer((layer) => {
    if (layer.feature === feature) {
  layer.setStyle(selectedTerritoryStyle());
  layer.bringToBack();
  layerState.selectedTerritoryLayer = layer;

  if (layerState.invasiveLayer && map.hasLayer(layerState.invasiveLayer)) {
    layerState.invasiveLayer.bringToFront();
  }

  const bounds = layer.getBounds();
  if (bounds.isValid()) {
    map.fitBounds(bounds.pad(0.08), { animate: true });
  }
} else {
      layer.setStyle(normalTerritoryStyle());
    }
  });
}

function getTerritoriesAtPoint(latlng) {
  const clickedPoint = turf.point([latlng.lng, latlng.lat]);

  return layerState.territoriesData.features.filter((territory) => {
    try {
      return turf.booleanPointInPolygon(clickedPoint, territory);
    } catch {
      return false;
    }
  });
}

function populateTerritorySelect() {
  const territories = layerState.territoriesData.features
    .map((feature, index) => ({
      index,
      name: getTerritoryName(feature)
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  elements.territorySelect.innerHTML =
    '<option value="">Choose a territory…</option>' +
    territories
      .map((territory) => `<option value="${territory.index}">${escapeHTML(territory.name)}</option>`)
      .join('');

  elements.territorySelect.addEventListener('change', () => {
    const selectedIndex = elements.territorySelect.value;

    if (selectedIndex === '') return;

    const feature = layerState.territoriesData.features[Number(selectedIndex)];
    selectTerritoryFromList(feature);
  });
}

function buildTerritoriesLayer() {
  layerState.territoryLayer = L.geoJSON(layerState.territoriesData, {
    style: normalTerritoryStyle,

    onEachFeature: (feature, layer) => {
      const name = getTerritoryName(feature);

      layer.bindTooltip(name, {
        permanent: false,
        direction: 'center',
        className: 'territory-tooltip'
      });
    }
  });

  syncLayerVisibility();
}

function syncLayerVisibility() {
  toggleLayer(layerState.territoryLayer, true);
  toggleLayer(layerState.invasiveLayer, elements.toggleInvasive?.checked);

  if (layerState.territoryLayer && map.hasLayer(layerState.territoryLayer)) {
    layerState.territoryLayer.bringToBack();
  }

  if (layerState.invasiveLayer && map.hasLayer(layerState.invasiveLayer)) {
    layerState.invasiveLayer.bringToFront();
  }
}

function toggleLayer(layer, shouldShow) {
  if (!layer) return;
  if (shouldShow && !map.hasLayer(layer)) layer.addTo(map);
  if (!shouldShow && map.hasLayer(layer)) map.removeLayer(layer);
}

function updateMap(options = {}) {
  const { fitBounds = false } = options;
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
    pointToLayer: (_feature, latlng) => L.circleMarker(latlng, {
  radius: getOccurrenceRadius(),
  color: '#c46056',
  weight: 0,
  fillColor: '#c46056',
  fillOpacity: 0.72
}),
    onEachFeature: (feature, layer) => {
  layer.on('click', (event) => {
    L.DomEvent.stopPropagation(event);
    renderOccurrenceDetails(feature);
  });
}
  });
  syncLayerVisibility();
  const layersToFit = [];
  if (elements.toggleInvasive.checked && layerState.invasiveLayer.getLayers().length) layersToFit.push(layerState.invasiveLayer);
  if (layerState.territoryLayer) layersToFit.push(layerState.territoryLayer);
  if (fitBounds && layersToFit.length) {
  const bounds = L.featureGroup(layersToFit).getBounds();
  if (bounds.isValid()) map.fitBounds(bounds.pad(0.04), { animate:false });
}
}

function renderSelectedSpeciesPhoto(species) {
  elements.detailsContent.innerHTML = `
    <div class="badge">Species selected</div>

    ${renderPlantPhotoCarousel(species)}

    <p class="subtle">
      Click an occurrence point to view the description,
      environmental context and location details.
    </p>
  `;

  initializePlantPhotoCarousel();
}

function renderOccurrenceDetails(feature) {
  const props = feature.properties || {};

 const speciesImpact =
    regionImpactBySpecies[props.species] ||
    'Environmental impact information is not available for this species.';

  const plantDescription =
    plantDescriptionBySpecies?.[props.species] ||
    'Plant description is not available for this species.';

  elements.detailsContent.innerHTML = `
  <div class="badge">Occurrence point selected</div>

  ${renderPlantPhotoCarousel(props.species)}

  <div class="info-block">
    <h3>Basic occurrence data</h3>
      <div class="info-grid">
        <div>
          <span class="label">Scientific name</span>
          <span>${escapeHTML(props.scientificName || props.species || 'Not available')}</span>
        </div>
        <div>
          <span class="label">Date</span>
          <span>${escapeHTML(formatDate(props.eventDate, props.year, props.month, props.day))}</span>
        </div>
        <div>
          <span class="label">Location</span>
          <span>${escapeHTML(props.stateProvince || props.country || 'Unknown location')}</span>
        </div>
        <div>
          <span class="label">Coordinates</span>
          <span>${formatCoordinates(feature.geometry.coordinates)}</span>
        </div>
      </div>
    </div>

    <div class="info-block">
      <h3>Description</h3>
      <p>${escapeHTML(plantDescription)}</p>
    </div>

    <div class="info-block">
      <h3>Environmental context</h3>
      <p>${escapeHTML(speciesImpact)}</p>
    </div>
  `;

  initializePlantPhotoCarousel();
}

function initializePlantPhotoCarousel() {
  const carousel = elements.detailsContent.querySelector('.plant-photo-carousel');

  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.plant-photo-slide'));
  const dots = Array.from(carousel.querySelectorAll('.plant-photo-dot'));
  const prevButton = carousel.querySelector('.plant-photo-prev');
  const nextButton = carousel.querySelector('.plant-photo-next');

  let currentSlide = 0;

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      showSlide(currentSlide - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      showSlide(currentSlide + 1);
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      showSlide(Number(dot.dataset.slide));
    });
  });
}

function renderTerritoryDetails(feature) {
  const props = feature.properties || {};
  const territoryName = getTerritoryName(feature);
  const context = getIndigenousContext(feature);

  const intersectingCount = layerState.filteredFeatures.filter((occurrence) => {
    try {
      return turf.booleanPointInPolygon(turf.point(occurrence.geometry.coordinates), feature);
    } catch {
      return false;
    }
  }).length;

  elements.detailsContent.innerHTML = `
    <div class="badge">Indigenous territory selected</div>

    <div class="info-block">
      <h3>${escapeHTML(territoryName)}</h3>
      <p><strong>Included states:</strong> ${escapeHTML(props.included_states || 'Specified Southeast states')}</p>
      <p><strong>Visible ${escapeHTML(layerState.currentSpecies)} occurrences inside this territory:</strong> ${intersectingCount.toLocaleString()}</p>
    </div>

    <div class="info-block">
      <h3>Description</h3>
      <p>${escapeHTML(context.description || 'Description information is not available for this Indigenous territory.')}</p>
    </div>

    <div class="info-block">
      <h3>Language</h3>
      <p>${escapeHTML(context.language || 'Language information is not available for this Indigenous territory.')}</p>
    </div>

    <div class="info-block">
      <h3>Culture</h3>
      <p>${escapeHTML(context.culture || 'Culture information is not available for this Indigenous territory.')}</p>
    </div>
  `;
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
