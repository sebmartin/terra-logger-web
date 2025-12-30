/**
 * @deprecated Use useLayerContext() instead
 *
 * This hook is deprecated. All layer operations have been moved into LayerContext.
 * Use useLayerContext() directly for layer state and operations.
 *
 * This hook now just re-exports the context for backwards compatibility.
 */

import { useLayerContext } from "../context/LayerContext";

export function useLayers() {
  return useLayerContext();
}
