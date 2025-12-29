import { useEffect } from 'react';
import { useMap as useLeafletMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';
import { useMap } from '../../context/MapContext';
import { useFeatures } from '../../hooks/useFeatures';
import type { FeatureType } from '../../types/feature';
import type L from 'leaflet';

export default function DrawingTools() {
  const leafletMap = useLeafletMap();
  const { drawMode } = useMap();
  const { createFeature } = useFeatures();

  useEffect(() => {
    if (!leafletMap) return;

    // Add Leaflet.PM controls
    leafletMap.pm.addControls({
      position: 'topleft',
      drawMarker: true,
      drawPolyline: true,
      drawPolygon: true,
      drawRectangle: true,
      drawCircle: false,
      drawCircleMarker: false,
      editMode: true,
      dragMode: false,
      cutPolygon: false,
      removalMode: true,
    });

    // Configure global options
    leafletMap.pm.setGlobalOptions({
      pmIgnore: false,
      snappable: true,
      snapDistance: 20,
      allowSelfIntersection: false,
      templineStyle: {
        color: '#3388ff',
        weight: 4,
      },
      hintlineStyle: {
        color: '#3388ff',
        dashArray: '5,5',
        weight: 2,
      },
      pathOptions: {
        color: '#3388ff',
        weight: 4,
        opacity: 0.8,
        fillColor: '#3388ff',
        fillOpacity: 0.3,
      },
    });

    // Handle shape creation
    const handleCreate = async (e: any) => {
      const layer = e.layer;
      const shape = e.shape;

      try {
        // Convert layer to GeoJSON
        const geoJSON = layer.toGeoJSON();

        // Determine feature type
        let featureType: FeatureType;
        switch (shape) {
          case 'Marker':
            featureType = 'Marker';
            break;
          case 'Line':
            featureType = 'Polyline';
            break;
          case 'Polygon':
            featureType = 'Polygon';
            break;
          case 'Rectangle':
            featureType = 'Rectangle';
            break;
          default:
            featureType = 'Polygon';
        }

        // Get layer style
        const style = {
          color: (layer.options as any).color || '#3388ff',
          weight: (layer.options as any).weight || 4,
          opacity: (layer.options as any).opacity || 0.8,
          fillColor: (layer.options as any).fillColor || '#3388ff',
          fillOpacity: (layer.options as any).fillOpacity || 0.3,
        };

        // Save feature to database
        await createFeature({
          type: featureType,
          name: `${featureType} ${new Date().toLocaleTimeString()}`,
          geometry: geoJSON.geometry,
          style,
        });

        console.log('Feature created:', featureType);
      } catch (error) {
        console.error('Failed to create feature:', error);
        // Remove layer on error
        leafletMap.removeLayer(layer);
      }
    };

    // Handle shape editing
    const handleEdit = (e: any) => {
      console.log('Shape edited:', e);
      // TODO: Update feature in database
    };

    // Handle shape removal
    const handleRemove = (e: any) => {
      console.log('Shape removed:', e);
      // TODO: Remove feature from database
    };

    // Register event listeners
    leafletMap.on('pm:create', handleCreate);
    leafletMap.on('pm:edit', handleEdit);
    leafletMap.on('pm:remove', handleRemove);

    // Cleanup
    return () => {
      leafletMap.pm.removeControls();
      leafletMap.off('pm:create', handleCreate);
      leafletMap.off('pm:edit', handleEdit);
      leafletMap.off('pm:remove', handleRemove);
    };
  }, [leafletMap, createFeature]);

  return null;
}
