# Code Style Guidelines

## General Principles

### Simplicity Over Cleverness
- Write obvious code, not clever code
- Prefer explicit over implicit
- Three similar lines > premature abstraction
- YAGNI (You Aren't Gonna Need It)

### React/TypeScript

```typescript
// ✅ Good: Explicit, typed
interface Props {
  featureId: string;
  onSave: (feature: Feature) => void;
}

export function FeatureEditor({ featureId, onSave }: Props) {
  // ...
}

// ❌ Avoid: Implicit any, unclear types
export function FeatureEditor({ featureId, onSave }) {
  // ...
}
```

### State Management (Zustand)

```typescript
// ✅ Good: Discriminated unions for complex state
type EditMode =
  | { type: "viewing" }
  | { type: "editing"; featureId: string }
  | { type: "drawing"; geometryType: GeometryType };

// ✅ Good: Immer middleware for mutations
set((state) => {
  state.count += 1;
});

// ❌ Avoid: Boolean soup
interface State {
  isEditing: boolean;
  isDrawing: boolean;
  editingId?: string;  // Invalid states possible!
}
```

### Component Organization

```typescript
// ✅ Good: Component, types, constants in one file
interface Props { /* ... */ }

const DEFAULT_CONFIG = { /* ... */ };

export function MyComponent({ /* ... */ }: Props) {
  // ...
}

// ❌ Avoid: Separate files for simple types
// types.ts, constants.ts, component.tsx for one component
```

## Naming Conventions

### Files
- React components: `PascalCase.tsx`
- Utilities/logic: `camelCase.ts`
- Types-only: `types.ts`
- Constants: `constants.ts`

### Variables
- `camelCase` for variables and functions
- `PascalCase` for components and types
- `SCREAMING_SNAKE_CASE` for constants
- Prefix booleans with `is`, `has`, `should`

```typescript
// ✅ Good
const featureId = "abc";
const isVisible = true;
const hasError = false;
const ZOOM_LEVEL = 12;

// ❌ Avoid
const feature_id = "abc";  // snake_case
const visible = true;      // unclear boolean
const ZoomLevel = 12;      // PascalCase for value
```

## Import Organization

```typescript
// 1. External dependencies
import { useEffect, useRef } from "react";
import { MapRef } from "react-map-gl/mapbox";

// 2. Internal absolute imports (sorted by domain)
import { useFeatureStore } from "@/app/stores/featureStore";
import { useMapStore } from "@/app/stores/mapStore";
import { Feature } from "@/app/types/feature";

// 3. Relative imports
import { createRenderer } from "./renderer";
import { LAYER_DEFS } from "./layerDefinitions";
```

## React Patterns

### Hooks

```typescript
// ✅ Good: Custom hooks for behavior, not just state wrappers
export function useFeatureClick(mapRef: RefObject<MapRef>) {
  const enterEditMode = useEditModeStore((s) => s.enterEditMode);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const handleClick = (e: MapMouseEvent) => {
      // Handle click
    };

    map.on("click", handleClick);
    return () => map.off("click", handleClick);
  }, [mapRef, enterEditMode]);
}

// ❌ Avoid: Hooks that just wrap store access
export function useFeatures() {
  return useFeatureStore((s) => s.features);
}
```

### Components

```typescript
// ✅ Good: Thin component, heavy logic elsewhere
export function MapboxFeatureRenderer({ mapRef }: Props) {
  const rendererRef = useRef(createFeatureRenderer());  // Logic in factory
  const features = useFeatureStore((s) => s.features);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    rendererRef.current.initialize(map);
    return () => rendererRef.current.destroy();
  }, [mapRef]);

  return null;  // No UI, just effects
}

// ❌ Avoid: Heavy logic in component
export function FeatureRenderer() {
  const [renderer, setRenderer] = useState(null);
  // 100 lines of complex logic here...
}
```

## TypeScript Patterns

### Type Definitions

```typescript
// ✅ Good: Interface for objects, type for unions
interface Feature {
  id: string;
  geometry: Geometry;
}

type FeatureType = "Marker" | "Polyline" | "Polygon";

// ✅ Good: Discriminated unions
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ❌ Avoid: Type for simple objects
type Feature = {
  id: string;
  geometry: Geometry;
};
```

### Avoid Type Assertions

```typescript
// ✅ Good: Type guards
function isPolygon(feature: Feature): feature is PolygonFeature {
  return feature.geometry.type === "Polygon";
}

if (isPolygon(feature)) {
  // TypeScript knows feature is PolygonFeature
}

// ❌ Avoid: Type assertions (unless unavoidable)
const polygon = feature as PolygonFeature;
```

## Error Handling

```typescript
// ✅ Good: Early returns
function processFeature(feature: Feature | null) {
  if (!feature) return;
  if (!feature.geometry) return;

  // Process...
}

// ❌ Avoid: Nested ifs
function processFeature(feature: Feature | null) {
  if (feature) {
    if (feature.geometry) {
      // Process...
    }
  }
}

// ✅ Good: Try-catch for I/O, not control flow
try {
  const data = await fetchFeatures();
  processFeatures(data);
} catch (error) {
  console.error("Failed to fetch:", error);
  showError("Could not load features");
}

// ❌ Avoid: Try-catch for control flow
try {
  const feature = findFeature(id);
  // ...
} catch {
  // Feature not found
}
```

## Comments

```typescript
// ✅ Good: Explain WHY, not WHAT
// Terra-Draw doesn't support direct feature selection,
// so we work around it by switching modes
terraDraw.setMode("static");
terraDraw.setMode("select");

// ❌ Avoid: Obvious comments
// Set mode to static
terraDraw.setMode("static");

// ✅ Good: Document complex business logic
/**
 * Converts Terra-Draw circles to our internal format.
 * Terra-Draw circles are polygons with a special mode property,
 * but we store them as true circles with center + radius.
 */
function convertCircle(tdFeature: TDFeature): Circle {
  // ...
}

// ❌ Avoid: Documentation for self-evident code
/**
 * Gets the feature ID
 * @param feature The feature
 * @returns The ID
 */
function getFeatureId(feature: Feature): string {
  return feature.id;
}
```

## What NOT to Do

### Never Add Without Request
- ❌ Emojis in code or comments
- ❌ ASCII art or decorative comments
- ❌ TODO comments (fix it now or file an issue)
- ❌ Commented-out code (use git)
- ❌ Console.logs in committed code

### Don't Over-Engineer
- ❌ Abstractions for single use
- ❌ Helper functions for one-liners
- ❌ Complex inheritance hierarchies
- ❌ Design patterns for simple problems
- ❌ Premature optimization

### Don't Add Defensive Code
- ❌ Error handling for impossible cases
- ❌ Validation for trusted internal data
- ❌ Null checks after type guards
- ❌ Try-catch around pure functions

```typescript
// ❌ Bad: Defensive programming
function getFeatureName(feature: Feature): string {
  if (!feature) return "";  // TypeScript already ensures non-null
  if (typeof feature.name !== "string") return "";  // Type is already string
  return feature.name;
}

// ✅ Good: Trust the types
function getFeatureName(feature: Feature): string {
  return feature.name;
}
```

## Preferred Libraries & APIs

- **State**: Zustand (not Redux, Context API)
- **Styling**: Tailwind + shadcn/ui (not CSS modules, styled-components)
- **Forms**: React Hook Form (if needed)
- **Dates**: Native Date (not moment, date-fns unless complex)
- **HTTP**: Native fetch (not axios unless features needed)
- **Testing**: Vitest (if tests added)

## File Structure Within Features

```
features/map/display/
├── components/              # React components
│   └── MapboxFeatureRenderer.tsx
├── featureRenderer.ts       # Pure logic (factory pattern)
├── layerDefinitions.ts      # Configuration
├── sourceManager.ts         # Pure functions
└── types.ts                 # Feature-specific types (if needed)
```

**Rationale**:
- React components in `components/` subdirectory
- Pure logic at feature root (no React dependencies)
- Clear separation: UI vs logic
- Types colocated (not in global types/ unless shared)

## Testing Philosophy (if tests are added)

- Test behavior, not implementation
- No tests for pure TypeScript types
- No tests for simple getters/setters
- Mock external dependencies (map, database)
- Test business logic, not UI rendering

```typescript
// ✅ Good: Test behavior
test("renderer adds layers to map", () => {
  const mockMap = createMockMap();
  const renderer = createFeatureRenderer();

  renderer.initialize(mockMap);

  expect(mockMap.addLayer).toHaveBeenCalledTimes(3);
});

// ❌ Avoid: Testing implementation details
test("renderer stores map reference", () => {
  const renderer = createFeatureRenderer();
  expect(renderer.map).toBeNull();  // Don't test private state
});
```

## Summary

**Do**:
- Write simple, obvious code
- Use discriminated unions for complex state
- Separate React (components/) from pure logic (root)
- Trust TypeScript types
- Extract logic from components

**Don't**:
- Add emojis, TODOs, or console.logs
- Over-engineer or prematurely abstract
- Add defensive checks for TypeScript-guaranteed invariants
- Create files unless necessary
- Complicate simple problems