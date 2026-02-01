# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Start development server at localhost:3000
pnpm build    # Production build
pnpm lint     # Run ESLint
```

## Architecture

This is a Bridgerton-themed interactive Valentine's Day invitation built with Next.js 16 (App Router), React 19, and Framer Motion.

### Key Files

- `app/page.tsx` - Entry point, renders the main Valentine component
- `app/layout.tsx` - Root layout with Playfair Display and Cormorant Garamond fonts
- `components/BridgertonValentine.tsx` - Main interactive component with all UI logic

### Component Structure (BridgertonValentine.tsx)

The component manages a two-state flow:
- **initial** - Invitation with "I Burn For You" (yes) and "I Cannot" (no) buttons
- **success** - Celebratory message with floating hearts/petals

Key sub-components:
- `FleeingButton` - The "no" button that runs away from the cursor using Framer Motion springs
- `FloatingElement` - Animated hearts/petals for the success celebration
- `PamphletBorder` - Decorative Regency-era border styling

### Styling

- Tailwind CSS 4 with custom colors defined in the config (`wisteria`, `parchment`, `rose`, `ink`)
- CSS variables for fonts: `--font-playfair` (headings), `--font-cormorant` (body)
- Respects `prefers-reduced-motion` for accessibility
