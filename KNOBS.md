# Knobs UI (fork-local)

This fork adds a host-side slider panel (`apps/web/src/components/KnobsPanel.tsx`) bound via postMessage to an iframe-side script (`apps/web/src/runtime/knobs-bridge.ts`).

The 5 default knobs target these CSS custom properties:
- `--accent-hue` (deg)
- `--accent-sat` (%)
- `--spacing-unit` (px)
- `--font-size-scale` (unitless multiplier)
- `--radius` (px)

Visual-designer-emitted code is expected to bind to these variables for the knobs to take effect. The bridge applies values to `documentElement.style.setProperty`; the rest is the design's responsibility.

Full orchestration spec at `~/projects/ai_system/docs/superpowers/specs/2026-05-13-design2-rebuild-design.md`. Phase 1 of the build adds this knobs mechanism; Phase 4 will add in-place text editing on the same bridge pattern.
