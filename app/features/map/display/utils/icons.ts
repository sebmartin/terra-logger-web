// Helper to load image icons into Mapbox
import { Map as MapboxMap } from 'mapbox-gl';

export async function loadImageIcon(
  map: MapboxMap,
  iconName: string,
  imagePath: string
): Promise<string | undefined> {
  // Check if already loaded
  if (map.hasImage(iconName)) {
    return iconName;
  }

  return new Promise((resolve, reject) => {
    map.loadImage(imagePath, (error, image) => {
      if (error || !image) {
        console.error(`Failed to load icon "${iconName}" from "${imagePath}":`, error);
        reject(error);
        return;
      }
      map.addImage(iconName, image);
      resolve(iconName);
    });
  });
}

// Batch load multiple icons
export async function loadImageIcons(
  map: MapboxMap,
  icons: Array<{ name: string; path: string }>
): Promise<string[]> {
  const promises = icons.map(({ name, path }) =>
    loadImageIcon(map, name, path).catch(() => undefined)
  );
  const results = await Promise.all(promises);
  return results.filter((name): name is string => name !== undefined);
}