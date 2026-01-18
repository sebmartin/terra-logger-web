# Architecture Overview

**Last Updated**: 2026-01-17

## System Architecture

This is a Next.js 14+ App Router application with:
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Mapping**: Mapbox GL JS + Terra-Draw for editing
- **State**: Zustand stores
- **Database**: Better-sqlite3 (local SQLite)
- **Styling**: Tailwind CSS with shadcn/ui components

## Key Architecture Decisions

### Map Rendering: Hybrid Approach

**See**: [MAP_ARCHITECTURE_RECOMMENDATION.md](../MAP_ARCHITECTURE_RECOMMENDATION.md) for full details.

**Strategy**: Separate rendering systems for display vs editing
- **View Mode**: Mapbox native layers (fast, full styling)
- **Edit Mode**: Terra-Draw (excellent editing UX)
- Features move between systems based on edit state

**Why**: Terra-Draw's styling is limited. This hybrid approach gives us:
- Full Mapbox styling power for display
- Terra-Draw's excellent editing UX when needed
- Better performance (only editing features are "hot")

### File Organization

We follow a **feature-based architecture** (not traditional Next.js structure):

```
app/
├── features/                    # Feature modules (vertical slices)
│   └── map/                     # Map domain
│       ├── display/             # Mapbox rendering
│       ├── editing/             # Terra-Draw editing
│       └── interactions/        # User interactions
├── components/                  # App-specific UI components
├── stores/                      # Zustand state management
├── services/                    # API/data services
└── types/                       # TypeScript types

components/                      # Shared UI (shadcn/ui)
└── ui/                          # Generic, reusable components

lib/                             # Shared utilities
└── db/                          # Database
```

**Key Principle**: Related code lives together (vertical slice), not scattered by type.

### State Management Pattern

**Zustand stores with discriminated unions for complex state:**

```typescript
// ✅ Good: Type-safe state machine
type EditMode =
  | { type: "viewing" }
  | { type: "editing"; featureId: string }
  | { type: "drawing"; geometryType: GeometryType };

// ❌ Avoid: Boolean soup
interface BadState {
  isEditing: boolean;
  isDrawing: boolean;
  editingFeatureId?: string;
  // Can have invalid states!
}
```

### Component Patterns

**Separation of concerns within features:**

```
features/map/display/
├── components/                  # React components (.tsx)
│   └── MapboxFeatureRenderer.tsx
├── featureRenderer.ts           # Pure TypeScript logic
├── layerDefinitions.ts          # Configuration
└── sourceManager.ts             # Pure functions
```

**Why**:
- React components are thin wrappers
- Core logic is pure TypeScript (testable, framework-agnostic)
- Clear separation between UI and business logic

## Important Conventions

### Never Add These Without Explicit Request
- ❌ Emojis in code or comments
- ❌ Documentation files (README, CHANGELOG, etc.)
- ❌ Tests (unless specifically asked)
- ❌ Over-engineering (abstractions for single use)

### Prefer Simple Solutions
- Edit existing files over creating new ones
- Minimal abstractions (YAGNI principle)
- Direct implementations over helper functions
- Three similar lines > premature abstraction

### shadcn/ui Pattern
- UI primitives go in `/components/ui/` (shadcn components)
- App components go in `/app/components/`
- Never mix business logic with shadcn components

## Data Model

### Core Entities

```
Site (sites of interest)
  ├── Layer (feature groups that can be shown/hidden as a whole)
  │    └── Feature (geospatial feature)
  │         ├── type: Marker | Polyline | Polygon | Rectangle | Circle
  │         ├── geometry: GeoJSON
  │         └── style: FeatureStyle (optional)
```

### Database
- SQLite via better-sqlite3
- Location: `data/sites.db`
- Schema in: `lib/db/schema.sql`

## Technology Choices

### Why Mapbox GL JS?
- Industry standard for web mapping
- Excellent performance with vector tiles
- Rich styling capabilities
- Smooth animations and interactions

### Why Terra-Draw?
- Best-in-class editing UX for web maps
- Handles complex geometry editing
- Well-maintained, active development
- Integrates cleanly with Mapbox

### Why Zustand over Redux?
- Simpler API, less boilerplate
- Better TypeScript support
- No context provider wrapper needed
- Smaller bundle size

### Why Better-sqlite3?
- Synchronous API (simpler code)
- Excellent performance for local apps
- No server needed
- Easy backup (single file)

## Common Patterns

### Adding a New Feature

1. Create feature directory: `app/features/domain/feature-name/`
2. Add core logic: `featureName.ts` (pure TypeScript)
3. Add React wrapper: `components/FeatureName.tsx`
4. Add types if needed: `types.ts`
5. Wire up in relevant component

### Adding a New Map Feature Type

1. Update database schema if needed
2. Add type to `app/types/feature.ts`
3. Update Terra-Draw modes in `features/map/editing/editorModes.ts`
4. Update Mapbox layer definitions in `features/map/display/layerDefinitions.ts`
5. Update geometry converter in `features/map/editing/geometryConverter.ts`

### State Updates

```typescript
// ✅ Good: Immer middleware, mutate draft
set((state) => {
  state.features.push(newFeature);
});

// ❌ Bad: Manual immutability
set((state) => ({
  ...state,
  features: [...state.features, newFeature],
}));
```

## Migration In Progress

**Status**: Planning phase for hybrid rendering architecture

**Current State**: All features in Terra-Draw permanently
**Target State**: Features in Mapbox (view) or Terra-Draw (edit)

See [MAP_ARCHITECTURE_RECOMMENDATION.md](../MAP_ARCHITECTURE_RECOMMENDATION.md) for migration plan.

## Performance Considerations

- Keep Terra-Draw instances minimal (only when editing)
- Use Mapbox's native rendering for display (faster)
- Filter features by visible layers before rendering
- Use Mapbox's `cluster` option for many point features

## Security Notes

- This is a local desktop application
- No authentication/authorization needed
- Database is user's local file
- No network requests except map tiles