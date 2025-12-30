/**
 * @deprecated Use useFeatureContext() instead
 *
 * This hook is deprecated. All feature operations have been moved into FeatureContext.
 * Use useFeatureContext() directly for feature state and operations.
 *
 * This hook now just re-exports the context for backwards compatibility.
 */

import { useFeatureContext } from "../context/FeatureContext";

export function useFeatures() {
  return useFeatureContext();
}
