# Terra Logger

Local desktop web app for managing geospatial features on sites of interest.

## Tech Stack

Next.js 16 (App Router) + React 19 + TypeScript 5 + Mapbox GL JS + Terra-Draw + Zustand + SQLite (better-sqlite3) + Tailwind CSS + shadcn/ui

## Commands

- `npm run dev` -- start dev server
- `npm run build` -- production build
- `npm run lint` -- lint (ESLint flat config)
- `npx tsc --noEmit` -- type check
- `npm run test` -- component tests (Vitest, watch)
- `npm run test:run` -- component tests (single run, CI-friendly)
- `npm run test:e2e` -- E2E tests (Playwright; starts dev server if not running)
- `npm run test:e2e:ui` -- E2E tests with Playwright UI

## Data Model

```
Site (site of interest)
  └── Layer (feature group, toggleable visibility)
       └── Feature (geospatial shape: Marker, Polyline, Polygon, Rectangle, Circle)
            ├── geometry: GeoJSON
            └── properties: measurements, style, mode
```

Database: SQLite via better-sqlite3 at `data/sites.db`, schema in `lib/db/schema.sql`.

## Architecture

### File Structure

```
app/
├── features/map/          # Feature modules (vertical slices)
│   ├── display/           # Mapbox native rendering (view mode)
│   ├── edit/              # Terra-Draw editing (edit mode)
│   └── interactions/      # User interactions (clicks, hover)
├── components/            # App-specific UI components
│   ├── Map/               # MapProvider (context), MapCanvas, MapContainer
│   ├── AppSidebar/        # Sidebar sections (sites, layers, features)
│   └── BoundsSelector/    # Site bounds capture overlay
├── hooks/                 # Custom hooks (useTerraDrawSetup, useFeatureClick, etc.)
├── stores/                # Zustand stores (siteStore, layerStore, featureStore, mapStore)
├── services/              # API client services (SiteService, LayerService, FeatureService)
├── types/                 # Shared TypeScript types
└── utils/                 # Utility functions

components/ui/             # shadcn/ui primitives (do not add business logic here)
lib/db/                    # Database setup and queries
```

### Map Rendering: Hybrid Approach

Two rendering systems for display vs editing:
- **View mode**: Mapbox native layers via `featureRenderer.ts` (fast, full styling)
- **Edit mode**: Terra-Draw via `useTerraDrawSetup` hook (excellent editing UX)

Features move between systems based on edit state. See [MAP_ARCHITECTURE_RECOMMENDATION.md](MAP_ARCHITECTURE_RECOMMENDATION.md) for the full migration plan.

### State Management

**Map instance state** lives in `MapProvider` (React context) -- map, draw, viewport, mode, style.

**Domain state** lives in Zustand stores -- sites, layers, features, selections.

All Zustand stores use `immer` middleware for draft mutations:
```typescript
set((state) => {
  state.features.push(newFeature);
});
```

Use discriminated unions for complex state:
```typescript
type MapViewMode =
  | { type: 'viewing' }
  | { type: 'editing', featureId: string }
  | { type: 'drawing', geometryType: GeometryType };
```

### Service Layer

Services in `app/services/` encapsulate all API calls. Each service class is exported as a singleton instance. Shared `getBaseUrl()` helper lives in `app/services/baseUrl.ts`.

### Component Patterns

Within feature modules, separate React from pure logic:
```
features/map/display/
├── components/             # React components (.tsx) -- thin wrappers
├── featureRenderer.ts      # Pure TypeScript logic (factory pattern)
├── layerDefinitions.ts     # Configuration objects
└── utils/                  # Pure helper functions
```

## Code Style

### Rules

- No `console.log` in committed code (use `console.error` in catch blocks only)
- No emojis in code or comments
- No TODO comments unless marking genuinely unfinished work-in-progress
- No commented-out code (use git history)
- Always use shadcn `<Button>` component, never raw `<button>` elements
- Use `useMapContext()` for map instance access, not `useMapStore`
- Simple > clever. Three similar lines > premature abstraction
- Edit existing files > create new files
- Trust TypeScript types -- no defensive checks for type-guaranteed invariants

### TypeScript

- `interface` for objects, `type` for unions
- Explicit prop types (no implicit `any`)
- Type guards over type assertions
- `camelCase` variables/functions, `PascalCase` components/types, `SCREAMING_SNAKE_CASE` constants
- Prefix booleans: `is`, `has`, `should`

### Files

- React components: `PascalCase.tsx`
- Logic/utilities: `camelCase.ts`

### Imports

```typescript
// 1. External dependencies
import { useEffect } from "react";
// 2. Internal absolute imports (@/ paths)
import { useFeatureStore } from "@/app/stores/featureStore";
// 3. Relative imports
import { createRenderer } from "./renderer";
```

### Zustand Stores

- Always use `immer` middleware
- Use `subscribeWithSelector` when cross-store subscriptions are needed
- Mutate draft state directly, never spread

### React

- Custom hooks for behavior, not state wrappers
- Components are thin wrappers around pure logic
- Early returns over nested conditionals
- `try/catch` for I/O only, not control flow

### Error Handling

- `console.error` in catch blocks
- Early returns for guard clauses
- No error handling for impossible cases

## Common Tasks

### Add a new map feature type

1. Add type to `app/types/feature.ts`
2. Add layer definitions in `app/features/map/display/layerDefinitions.ts`
3. Update Terra-Draw modes in hooks
4. Update geometry mapping in `useTerraDrawEvents.ts`

### Testing

- **Component tests**: Vitest + React Testing Library. Tests live under `app/**/*.test.{ts,tsx}`. Use `renderWithProviders` and `MockMapProvider` from `app/test/test-utils.tsx` for components that use `useMapContext()`. Stores are reset between tests in setup; services are mocked so no real API is called.
- **E2E**: Playwright in `e2e/`. Use `data-testid` on key elements (e.g. `app-sidebar`, `sidebar-add-site`, `bounds-selector`) for stable selectors.
- No `console.log` in tests; use `console.error` only for real errors.

### Add a UI component

- shadcn primitive: `components/ui/`
- App-specific: `app/components/`
- Never mix business logic with shadcn components

### Add a feature module

1. Create directory: `app/features/domain/feature-name/`
2. Add core logic: `featureName.ts` (pure TypeScript)
3. Add React wrapper: `components/FeatureName.tsx`
4. Wire up in parent component

## Tech Choices

| Choice | Rationale |
|--------|-----------|
| Mapbox GL JS | Industry standard, vector tiles, rich styling |
| Terra-Draw | Best editing UX for web maps, clean Mapbox integration |
| Zustand | Simple API, great TypeScript, no provider wrapper |
| better-sqlite3 | Synchronous API, local-first, single file backup |
| shadcn/ui | Composable primitives, Tailwind-native, copy-paste ownership |
| Zod | Runtime validation for API responses (`types/schemas.ts`) |
| immer | Ergonomic immutable updates in all stores |
