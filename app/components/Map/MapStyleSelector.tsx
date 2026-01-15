"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { MapIcon } from "lucide-react";

export const MAP_STYLES = {
  topology: "mapbox://styles/sebmartin/cl0daly1b002j15ldl6d0xcmh",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  outdoors: "mapbox://styles/mapbox/outdoors-v12",
  streets: "mapbox://styles/mapbox/streets-v12",
} as const;

interface MapStyleSelectorProps {
  currentStyle: string;
  onStyleChange: (style: string) => void;
}

export function MapStyleSelector({ currentStyle, onStyleChange }: MapStyleSelectorProps) {
  return (
    <span className="mapboxgl-ctrl absolute flex top-46 right-2.5 z-10">
      {/* border-border bg-background rounded-sm w-7 h-7 justify-center items-center */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <span className="mapboxgl-ctrl-icon">
            <MapIcon size={20} />
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Base Map</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={currentStyle === MAP_STYLES.topology}
            onCheckedChange={(checked) =>
              onStyleChange(checked ? MAP_STYLES.topology : currentStyle)
            }
          >
            Topology (Custom)
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={currentStyle === MAP_STYLES.satellite}
            onCheckedChange={(checked) =>
              onStyleChange(checked ? MAP_STYLES.satellite : currentStyle)
            }
          >
            Satellite
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={currentStyle === MAP_STYLES.outdoors}
            onCheckedChange={(checked) =>
              onStyleChange(checked ? MAP_STYLES.outdoors : currentStyle)
            }
          >
            Outdoors
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={currentStyle === MAP_STYLES.streets}
            onCheckedChange={(checked) =>
              onStyleChange(checked ? MAP_STYLES.streets : currentStyle)
            }
          >
            Streets
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  );
}
