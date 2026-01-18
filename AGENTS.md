# AI Agent Context

> **This file provides navigation for AI coding assistants. All detailed context is in the `.claude/` directory.**

## Essential Reading (in order)

1. **[.claude/ARCHITECTURE.md](.claude/ARCHITECTURE.md)** - System architecture, tech stack, design decisions
2. **[.claude/CODE_STYLE.md](.claude/CODE_STYLE.md)** - Code conventions, patterns, anti-patterns
3. **[MAP_ARCHITECTURE_RECOMMENDATION.md](MAP_ARCHITECTURE_RECOMMENDATION.md)** - Detailed map architecture (read before map work)

## Quick Reference

### Tech Stack
Next.js 14 (App Router) + React 18 + TypeScript + Mapbox GL + Terra-Draw + Zustand + SQLite

### Project Type
Local desktop web app for managing geospatial features on sites of interest (archaeological sites, etc.)

### Key Patterns
- **Organization**: Feature-based (vertical slices), not layer-based
- **State**: Zustand with discriminated unions (type-safe state machines)
- **Components**: Separate React from pure logic (components/ vs root .ts files)
- **Styling**: Tailwind + shadcn/ui (components in `/components/ui/`)

### File Structure at a Glance
```
app/
├── features/map/           # NEW pattern: feature modules
│   ├── display/            # Mapbox rendering
│   ├── editing/            # Terra-Draw editing
│   └── interactions/       # User interactions
├── components/             # App-specific UI
├── stores/                 # Zustand state
└── types/                  # TypeScript types

components/ui/              # shadcn/ui (don't modify)
```

### Most Common User Requests
1. **Add map feature type** → Check .claude/ARCHITECTURE.md "Common Patterns"
2. **Fix map rendering** → Read MAP_ARCHITECTURE_RECOMMENDATION.md first
3. **Add UI component** → Use shadcn/ui or app/components/
4. **Style/convention question** → Check .claude/CODE_STYLE.md

## Critical Rules (Never Break)

### Never Add Without Request
- ❌ Emojis in code/comments
- ❌ Documentation files (README, CHANGELOG, etc.)
- ❌ TODO comments
- ❌ Console.logs in committed code

### Always Follow
- ✅ Simple > clever
- ✅ Edit existing files > create new files
- ✅ Three similar lines > premature abstraction
- ✅ Feature-based organization
- ✅ Separate React from pure logic

## When to Read Detailed Docs

| User Ask | Read This |
|----------|-----------|
| "Add feature to map" | .claude/ARCHITECTURE.md → "Common Patterns" |
| "How is map organized?" | MAP_ARCHITECTURE_RECOMMENDATION.md |
| "What's the code style?" | .claude/CODE_STYLE.md |
| "Why this tech choice?" | .claude/ARCHITECTURE.md → "Technology Choices" |
| "How to organize new feature?" | .claude/ARCHITECTURE.md → "File Organization" |
| "State management pattern?" | .claude/CODE_STYLE.md → "State Management" |

## Architecture Status

**Current State**: All map features in Terra-Draw (limits styling)
**Target State**: Hybrid rendering - Mapbox for display, Terra-Draw for editing
**Status**: Planning phase - see MAP_ARCHITECTURE_RECOMMENDATION.md for full migration plan

## Data Model
```
Site (site of interest)
 └── Layer (feature group, toggleable visibility)
      └── Feature (geospatial shape: Marker, Line, Polygon, etc.)
```

---

**For detailed information, see the `.claude/` directory files listed above.**

**Last Updated**: 2026-01-17