---
name: Serene Sanctuary
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3d4947'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#006860'
  on-tertiary: '#ffffff'
  tertiary-container: '#248279'
  on-tertiary-container: '#f3fffc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#9cf2e8'
  tertiary-fixed-dim: '#80d5cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#00504a'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-md: 1.5rem
  gutter-lg: 2rem
  margin: 1rem
  margin-md: 2rem
  margin-lg: 3.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system is tailored specifically for Islamic EdTech, contemplation, and student well-being within Madrasah and Pesantren environments. The design narrative embodies *Sakinah* (tranquility), *Tafakkur* (deep reflection), and approachable academic growth. It avoids visual clutter, loud gamification, and overwhelming notifications to cultivate a digital sanctuary where adolescent students feel safe, centered, and respected.

The aesthetic blends **Soft Minimalist Architecture** with **Warm Spiritual Humanism**:
- **Tranquil Restraint:** Generous negative space balances structured Islamic curriculum modules and private reflective journaling.
- **Organic Softness:** Heavy utilization of generous corner radiuses (`rounded-2xl` and `rounded-3xl`) removes harsh edges, evoking natural slate stones, soft prayer cushions, and open courtyards.
- **Focused Clarity:** High visual ergonomics designed to support late-night study sessions or early-morning introspections without cognitive fatigue.

## Colors

The color palette grounds the student’s focus through deep aquatic botanicals and warm radiant accents, avoiding sterile clinical vibes or sensory overload.

- **Primary (`#0D9488` - Deep Teal) & Tertiary (`#0F766E` - Pine Teal):** Anchors core actions, structural headers, and focused states. Reflects growth, wisdom, and the contemplative presence of traditional Islamic architectural tiles.
- **Secondary (`#F59E0B` - Warm Amber) & Amber Tint (`#FEF3C7`):** Represents dawn, illumination (*Nur*), achievement, and empathetic encouragement. Used for active badges, emotional tracking states, and highlights.
- **Neutral Canvas (`#F8FAFC` - Slate Neutral):** A soft, eye-resting background that prevents the glare of pure digital screens.
- **Surface Elevation (`#FFFFFF` - Pure White):** Clean, elevated card surfaces that sit atop the slate canvas.
- **Text & Core Hierarchy (`#0F172A` - Deep Slate):** Softened dark ink yielding optimal legibility for both Latin and Arabic-derived typography without the harshness of pure black `#000000`.

## Typography

The typography is powered exclusively by **Plus Jakarta Sans**, chosen for its humane geometry, rounded counters, and superb rendering across Indonesian linguistic idioms and multi-script compositions.

- **Headlines:** Set with confident semi-bold and bold weights with subtle negative tracking, creating an anchor of trust and authority without intimidation.
- **Body:** Calibrated at comfortable leading ratios (1.6x) to allow students prolonged, non-fatiguing reading during study marathons and guided journaling.
- **Microcopy & Labels:** Styled in medium-to-semibold weights with slight letter-spacing adjustments to ensure pristine clarity on mobile viewports under low-light dormitory conditions.

## Layout & Spacing

The layout is built upon an 8-point base spacing rhythm within a responsive fluid container system.

- **Breakpoints:**
  - **Mobile (< 640px):** Single-column stack with `margin: 1rem` and compact `space-md` element gutters. Focuses user attention on one entry or lesson at a time.
  - **Tablet (640px - 1024px):** Dual-column layout featuring an adaptive side-rail navigation and a dominant reading canvas.
  - **Desktop (> 1024px):** Max container width capped at `1200px` to maintain optimal line-length thresholds for reading and reflection, framed by `margin-lg`.
- **Rhythm & Structure:** Generous vertical rhythm separates modules using `space-xl` (40px) to deliberately reduce clutter and promote cognitive ease.

## Elevation & Depth

Depth in this system avoids harsh, dark drop shadows. Instead, it relies on soft, diffused ambient light and tonal contrast to establish vertical hierarchy:

- **Base Ground:** The foundational canvas rests on `#F8FAFC`.
- **Card Surfaces (Elevation Level 1):** Built on `#FFFFFF` elevated with an ultra-soft teal-tinted shadow (`0 4px 24px -2px rgba(13, 148, 136, 0.04), 0 2px 8px -1px rgba(15, 23, 42, 0.03)`). Cards are reinforced by a subtle `1px` inner or outer border of `rgba(15, 23, 42, 0.04)`.
- **Interactive & Floating Panels (Elevation Level 2):** Modals, daily reflection prompts, and bottom sheets leverage an expanded dispersion blur (`0 12px 36px -4px rgba(15, 23, 42, 0.08)`) with zero hard edge offsets.
- **Overlays:** Backdrops utilize a muted slate blur (`backdrop-blur-sm bg-slate-900/20`) to create a calm isolation layer behind active modals.

## Shapes

The design system embraces an intentional **`rounded-2xl` (1rem / 16px)** standard as the signature baseline for structural elements, evoking soft pebble-like balance and warmth.

- **Standard Containers & Cards:** Strictly `rounded-2xl` (16px) to maintain a cohesive tactile softness.
- **Large Hero Banners & Modals:** Scaled up to `rounded-3xl` (24px) for prominent focal points.
- **Interactive Controls (Inputs, Buttons):** Configured with `rounded-xl` (12px) to provide balanced affordance without feeling cartoonish.
- **Badges, Tags, and Audio Scrubbers:** Pill-shaped (`rounded-full`) to differentiate metadata from actionable structural cards.

## Components

### Buttons
- **Primary:** Background `#0D9488`, text `#FFFFFF`, radius `rounded-xl`, padding `12px 24px`. Hover transitions to `#0F766E` with subtle micro-scale easing (`scale-[0.99]`). Focus state displays a `2px` ring in `#0D9488/30`.
- **Secondary / Warm Focus:** Background `#FEF3C7`, text `#F59E0B` (darkened to `#B45309` for AA accessibility), radius `rounded-xl`. Ideal for encouraging emotional check-ins.
- **Ghost:** Borderless, deep slate text (`#0F172A`) with `#F8FAFC` hover background, maintaining calm neutrality.

### Cards & Reflection Containers
- **Default Card:** Pure white `#FFFFFF` surface, `rounded-2xl`, padded with `1.5rem` (`p-6`), framed by an ultra-light border (`border border-slate-100`).
- **Featured Reflection Card:** Deep Teal gradient tint (`bg-gradient-to-br from-teal-900 to-teal-800`), crisp white text, ambient glowing amber accents for daily Hadith or contemplative quotes.

### Input Fields
- Form controls feature `#FFFFFF` fill with a `1.5px` border in `#E2E8F0`.
- Inner padding of `14px 16px` with `rounded-xl`.
- Active focus smoothly transitions to `border-teal-600` with an outer ring of `ring-4 ring-teal-500/10`. Placeholder text is calm `#94A3B8`.

### Chips & Mood Trackers
- Pill-shaped (`rounded-full`), padding `6px 14px`.
- Inactive state: `#F1F5F9` text `#475569`.
- Active state: `#0D9488` with `#FFFFFF` text or `#FEF3C7` with `#92400E` text for affective mood ratings (e.g., *Tenang*, *Syukur*, *Gelisah*).

### Checkboxes & Radios
- Size `20px x 20px` with `rounded-lg` (checkbox) or `rounded-full` (radio).
- Unchecked: `#FFFFFF` with `1.5px` border `#CBD5E1`.
- Checked: Solid `#0D9488` fill displaying an off-white icon mark, designed to feel satisfying and mindful rather than rushed.

### Specialized Well-being Elements
- **Daily Reflection Journal Drawer:** An edge-to-edge mobile bottom-sheet or centered desktop card with `rounded-3xl` corners, soft Amber `#FEF3C7` header tabs, and distraction-free textarea styling.
- **Dhikr / Breath Counter:** Concentric circular visualizers encased in `#F8FAFC` rings that pulse gently using Teal (`#0D9488`) opacity transitions.