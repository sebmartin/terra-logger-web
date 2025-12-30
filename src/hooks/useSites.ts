/**
 * @deprecated Use useSiteContext() instead
 *
 * This hook is deprecated. All site operations have been moved into SiteContext.
 * Use useSiteContext() directly for site state and operations.
 *
 * This hook now just re-exports the context for backwards compatibility.
 */

import { useSiteContext } from "../context/SiteContext";

export function useSites() {
  return useSiteContext();
}
