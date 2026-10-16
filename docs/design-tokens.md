# Design tokens

`app/globals.css` remains the single source of truth. Tailwind CSS 4's `@theme inline` block maps its CSS custom properties into utility namespaces without copying their values into a second token file.

## Color

| CSS variable | Value | Purpose |
|---|---|---|
| `--background` | `#101315` | Main page and WebGL background |
| `--background-soft` | `#151a1c` | Alternate surface |
| `--surface` | `#1b2223` | Elevated content |
| `--surface-raised` | `#202827` | Highest DOM surface |
| `--surface-catalog` | `rgba(16, 19, 21, .94)` | Project archive card surface |
| `--foreground` | `#f0f3ee` | Primary text |
| `--foreground-secondary` | `#c0c8c1` | Supporting text |
| `--muted` | `#a3aea7` | Supporting annotation |
| `--border` | `rgba(235, 242, 234, .14)` | Fine borders |
| `--border-strong` | `rgba(235, 242, 234, .26)` | Emphasized separators |
| `--accent` | `#c6f36b` | Actions and active emphasis |
| `--accent-hover` | `#d7ff83` | Interactive hover state |
| `--accent-ink` | `#182010` | Text on accent surfaces |
| `--success` | `#b6d38f` | Success state |

Utilities use aliases such as `bg-background`, `text-copy-secondary`, `border-border-strong`, and `text-accent`.

## Typography and layout

- `--font-display` resolves to the existing Manrope `next/font` variable.
- `--font-body` resolves to the existing Poppins `next/font` variable.
- `--font-code` is the system monospace stack for technical annotations.
- Tailwind aliases use distinct `font-portfolio-*` names to avoid redefining the source variables.
- The spacing scale maps the existing `.25rem` through `6rem` values. `--page-width` is 1520px and `--page-gutter` uses the existing clamp expression.

## Shape, layering, and motion

- Sharp control and panel radius aliases are 3px and 4px, drawn from existing interface rules.
- Canvas/content/header/navigation/skip-link z-index aliases preserve the current values 0, 1, 40, 45, and 1000.
- `--shadow`, `--ease`, `--motion-fast` (160ms), and `--motion-normal` (260ms) remain canonical CSS variables.
- Focus outlines and reduced-motion rules stay in global CSS because they are cross-route behaviors.
