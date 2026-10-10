# Design tokens

`app/globals.css` is the source of truth. Reuse semantic variables before adding repeated colors or spacing values.

## Color

| Token | Value | Use |
|---|---|---|
| `--background` | `#101315` | Main page and WebGL background |
| `--background-soft` | `#151A1C` | Alternate section |
| `--surface` | `#1B2223` | Elevated content |
| `--surface-raised` | `#202827` | Highest DOM surface |
| `--foreground` | `#F0F3EE` | Main text |
| `--foreground-secondary` | `#C0C8C1` | Supporting text |
| `--muted` | `#A3AEA7` | Nonessential annotation |
| `--border` | `rgba(235, 242, 234, .14)` | Structural rules |
| `--border-strong` | `rgba(235, 242, 234, .26)` | Stronger section separators |
| `--accent` | `#C6F36B` | Actions, active section, and material edge |
| `--accent-hover` | `#D7FF83` | Hover and focus emphasis |
| `--accent-ink` | `#182010` | Text on accent surfaces |
| `--success` | `#B6D38F` | Success state where applicable |

WebGL material values are specified in `components/experience/HeroMaterial.ts`. They use related, physically lit green and mist tones rather than direct DOM colors.

## Type and layout

- `--font-display`: native system sans stack for fast, offline-safe rendering.
- `--font-code`: system monospace for short technical labels only.
- Body copy remains 16px or larger; technical annotations are supporting content.
- Spacing uses a 4px base (`--space-1` through `--space-24`).
- Page width is 1520px; gutters use `clamp()` and contract for mobile.

## Shape and motion

- Favor square surfaces, fine borders, and restrained shadows.
- Use `--motion-fast` (160ms), `--motion-normal` (260ms), and `--ease` for small interface transitions.
- Keep scroll animation optional. The reduced-motion media query disables continuous CSS motion and smooth scrolling; the runtime skips WebGL and GSAP under reduced motion.
