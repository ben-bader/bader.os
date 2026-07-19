# Design Tokens

Source of truth for spacing, radius, color, motion, and type.
Never invent values outside this scale.

## Spacing

| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 40px |
| `--space-8` | 48px |
| `--space-9` | 64px |
| `--space-10` | 80px |
| `--space-11` | 96px |
| `--space-12` | 128px |

Tailwind: `p-1` … `p-12` map 1:1 to these tokens.

## Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius-button` | 14px | Buttons |
| `--radius-card` | 24px | Cards / glass surfaces |
| `--radius-image` | 28px | Images / media |
| `--radius-dialog` | 32px | Dialogs / large panels |
| `--radius-pill` | 999px | Pills / chips / nav |

Aliases: `--radius-sm` → button, `--radius-md` → card, `--radius-lg` → image, `--radius-xl` → dialog.

## Color

| Token | Value |
|-------|-------|
| `--color-bg-base` | `#060B16` |
| `--color-bg-elevated` | `#0C1526` |
| `--color-text-primary` | `#F3F6FC` |
| `--color-text-secondary` | `rgba(243, 246, 252, 0.62)` |
| `--color-text-muted` | `rgba(243, 246, 252, 0.42)` |
| `--color-accent` | `#3B82F6` |
| `--color-accent-bright` | `#60A5FA` |
| `--color-accent-glow` | `rgba(59, 130, 246, 0.35)` |
| `--color-border` | `rgba(255, 255, 255, 0.08)` |
| `--color-border-hover` | `rgba(255, 255, 255, 0.20)` |
| `--color-glass-surface` | `rgba(255, 255, 255, 0.06)` |
| `--color-glass-hover` | `rgba(255, 255, 255, 0.10)` |

One accent dominates (electric blue). Emerald / purple reserved for rare emphasis only.

## Glass

- Backdrop blur: **16px**
- Border: 1px `var(--color-border)`
- Soft shadow only — large blur, low opacity

## Motion Timing

| Name | Duration |
|------|----------|
| Fast | 200ms |
| Normal | 400ms |
| Large | 700ms |
| Story | 1200ms |

## Easings

- `power4.out` / `power3.out`
- `expo.out`
- `circ.out`
- Never linear for UI motion

## Typography

| Token | Role |
|-------|------|
| `--fs-hero` | Hero display |
| `--fs-h1` | Page titles |
| `--fs-h2` | Section headings |
| `--fs-h3` | Card / subsection titles |
| `--fs-body-lg` | Lead copy |
| `--fs-body` | Body |
| `--fs-caption` | Labels / meta |

## Layout

- Content max width: **1280px**
- Outer container reference: **1440px**
- Grid: 12 / 8 / 4 columns (desktop / tablet / mobile)
