import { FillLayerSpecification, LayerSpecification, LineLayerSpecification, SymbolLayerSpecification } from "mapbox-gl";

// Start with geometry-based layers, we can expand later to have thematic layers like roads, trails, etc.
export const LAYER_DEFINITIONS: Record<string, Array<LayerSpecification>> = {
  // Example defaults for a symbol layer (fill in id/source at runtime)
  Marker: [
    {
      id: "marker-layer",
      source: "{placeholder}",
      filter: ['==', ['get', 'featureType'], 'Marker'],
      type: "symbol",
      layout: {
        "icon-image": "marker-icon",
        "icon-size": 0.4,
        "icon-allow-overlap": true,
        "text-optional": true,
      },
      paint: {
        // Add any paint defaults here
      },
    } satisfies SymbolLayerSpecification
  ],
  Polygon: [
    {
      id: "polygon-fill-layer",
      source: "{placeholder}",
      filter: ['==', ['get', 'featureType'], 'Polygon'],
      type: "fill",
      paint: {
        "fill-color": "#0000FF",
        "fill-opacity": 0.3,
      },
    } satisfies FillLayerSpecification,
    {
      id: "polygon-line-layer",
      source: "{placeholder}",
      filter: ['==', ['get', 'featureType'], 'Polygon'],
      type: "line",
      paint: {
        "line-color": "#0000FF",
        "line-width": 4,
      },
    } satisfies LineLayerSpecification
  ],
  Polyline: [
    {
      id: "polyline-layer",
      source: "{placeholder}",
      filter: ['==', ['get', 'featureType'], 'Polyline'],
      type: "line",
      paint: {
        "line-color": "#FF0000",
        "line-width": 3,
      },
    } satisfies LineLayerSpecification
  ],
  Rectangle: [
    {
      id: "rectangle-fill-layer",
      source: "{placeholder}",
      filter: ['==', ['get', 'featureType'], 'Rectangle'],
      type: "fill",
      paint: {
        "fill-color": "#0000FF",
        "fill-opacity": 0.3,
      },
    } satisfies FillLayerSpecification,
    {
      id: "rectangle-line-layer",
      source: "{placeholder}",
      filter: ['==', ['get', 'featureType'], 'Rectangle'],
      type: "line",
      paint: {
        "line-color": "#0000FF",
        "line-width": 4,
      },
    } satisfies LineLayerSpecification
  ],
  Circle: [
    {
      id: "circle-fill-layer",
      source: "{placeholder}",
      filter: ['==', ['get', 'featureType'], 'Circle'],
      type: "fill",
      paint: {
        "fill-color": "#0000FF",
        "fill-opacity": 0.3,
      },
    } satisfies FillLayerSpecification,
    {
      id: "circle-line-layer",
      source: "{placeholder}",
      filter: ['==', ['get', 'featureType'], 'Circle'],
      type: "line",
      paint: {
        "line-color": "#0000FF",
        "line-width": 4,
      },
    } satisfies LineLayerSpecification
  ],
};