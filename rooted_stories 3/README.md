# Nijah Pope: Invasive Plants & Indigenous Lands in the Southeastern United States

Nijah Pope: Invasive Plants & Indigenous Lands in the Southeastern United States is a multi-page educational data journalism platform prototype for exploring invasive plant species in the Southeastern United States and how their spread intersects with Indigenous lands, environmental justice, climate pressure, and historical narratives.

## Pages

- `index.html` — homepage / landing experience
- `map.html` — Leaflet interactive map using the uploaded GeoJSON datasets
- `dashboard.html` — interactive Chart.js data dashboard
- `stories.html` — multimedia / interview-story prototype

## How to run in VS Code

1. Open the `rooted_stories` folder in VS Code.
2. Install the **Live Server** extension if you do not already have it.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Navigate between pages using the top navigation.

Do not open the HTML files directly from Finder or File Explorer because the map and dashboard load local GeoJSON files with `fetch()`, which needs a local server.

## Data folder

The `data/` folder contains:

- `invasive_species.geojson`
- `indigenous_territories_FINAL.geojson`

Keep these file names the same unless you also update the paths in `map.js` and `dashboard.js`.
