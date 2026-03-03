import { DrawMode } from "@/app/stores/mapStore";
import { Feature } from "@/app/types/feature";
import { Map as MapboxMap } from "mapbox-gl";
import { TerraDraw, TerraDrawCircleMode, TerraDrawLineStringMode, TerraDrawPointMode, TerraDrawPolygonMode, TerraDrawRectangleMode, TerraDrawSelectMode } from "terra-draw";
import { TerraDrawMapboxGLAdapter } from "terra-draw-mapbox-gl-adapter";

export function createMapEditor(map: MapboxMap) {
  const draw = new TerraDraw({
    tracked: true,
    adapter: new TerraDrawMapboxGLAdapter({
      map,
      coordinatePrecision: 9,
    }),
    modes: [
      new TerraDrawSelectMode({
        flags: {
          polygon: {
            feature: {
              scaleable: true,
              rotateable: true,
              draggable: true,
              coordinates: {
                midpoints: true,
                draggable: true,
                deletable: true,
              },
            },
          },
          linestring: {
            feature: {
              draggable: true,
              coordinates: {
                midpoints: true,
                draggable: true,
                deletable: true,
              },
            },
          },
          point: {
            feature: {
              draggable: true,
            },
          },
          circle: {
            feature: {
              draggable: true,
            },
          },
          rectangle: {
            feature: {
              draggable: true,
              coordinates: {
                resizable: "opposite",
              },
            },
          },
        },
      }),
      new TerraDrawPointMode(),
      new TerraDrawLineStringMode({
        pointerDistance: 10,
      }),
      new TerraDrawPolygonMode({
        pointerDistance: 10,
      }),
      new TerraDrawRectangleMode(),
      new TerraDrawCircleMode(),
    ],
  });

  return {
    drawNewFeature(mode: DrawMode) {
      draw.setMode(mode);
    },
    editFeature(_feature: Feature) {

    },
    destroy() {
    }
  }
}

export type MapEditor = ReturnType<typeof createMapEditor>;