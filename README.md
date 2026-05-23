# Khondokar Tanvin Kayes — Portfolio

## Design Decisions

**Aesthetic: SV-FILM-NOIR × DESERT SUN**
High-contrast noir foundation (#1c1917) with warm desert-sun palette. Venetian blind diagonal shadows on the hero create dramatic light patterns. The blood-red accent (#dc2626) is used sparingly for maximum impact — section dividers, stat numbers, contact background. Amber/gold (#d97706) serves as the single warm accent for interactive states.

**Typography: Satoshi**
Loaded via Fontshare CDN. Weights 400/500/700/900 provide full range from body copy to oversized display type. The geometric-but-humanist character avoids the sterile AI-generated look of Inter/system-ui defaults.

**Layout Philosophy**
Each section uses distinct layout logic:
- Hero: Full-viewport kinetic type with scramble decode effect
- About: Off-grid split-screen with rotated photo frame (print-treated aesthetic)
- Work: Sticky horizontal scroll panels (GSAP ScrollTrigger pin + scrub)
- Leadership: Staggered reveal list with hover-indent interaction
- Stats: Tabular counter grid with GSAP snap animation
- Manifesto: Inverted sand background, brutalist numbered list
- Ticker: Infinite CSS marquee loop
- /Now: Three-column temporal snapshot
- Changelog: Version-controlled self-aware meta section
- Contact: Full-bleed blood-red footer with giant mailto as primary CTA

**Motion System (Intensity 10/10)**
All motion respects `prefers-reduced-motion` and includes a manual toggle:
- Lenis smooth scroll (lerp 0.07) for buttery page movement
- Custom cursor with trail + context morphing (circle → text bar on paragraphs, expanded ring on links)
- Mouse-following amber spotlight (mix-blend-mode: screen)
- Hero scramble decode animation on load
- IntersectionObserver-driven staggered reveals
- GSAP horizontal scroll for work section
- Animated number counters with snap
- Page wipe transition on mailto/tel clicks
- About photo parallax on scroll
- Loading sequence with progress bar

**Accessibility**
- Semantic HTML5 landmarks (main, section, footer, nav)
- Keyboard navigable (all interactive elements are focusable)
- `prefers-reduced-motion` media query kills all animation
- Manual motion toggle persists state within session
- Cursor hidden on mobile (<769px) where touch replaces pointer
- Color contrast ratios meet WCAG AA for body text

**Performance**
- Zero framework overhead — vanilla HTML/CSS/JS only
- GSAP + Lenis loaded via CDN with tree-shaking not applicable (vanilla)
- No images to lazy-load (placeholder typography-based photo treatment)
- CSS animations use transform/opacity only (GPU-composited)
- IntersectionObserver for scroll triggers (no scroll event listeners)

## How to Extend

**Adding a new section:**
1. Add semantic `<section>` in index.html with unique ID
2. Create corresponding CSS block in styles.css following BEM naming
3. Add scroll reveal via `data-reveal` attribute or custom GSAP trigger in main.js
4. Update changelog section to document the addition

**Adding case study imagery:**
Replace `.about__photo-placeholder` or work panel backgrounds with `<img>` tags. Add `loading="lazy"` and consider WebP format. Update the parallax selector if changing the about photo structure.

**Changing the palette:**
Edit CSS custom properties in `:root`. All colors reference variables — no hardcoded values elsewhere. The four-color system (sand/sienna/blood/noir) plus amber accent is intentionally constrained.

**Updating /now page:**
Edit the three `.now__item` blocks monthly. Update `.now__date` timestamp. This section is designed for low-friction maintenance.

**Deploying:**
Static files only. Drop on Netlify/Vercel/GitHub Pages/any static host. No build step required.
# KHONDOKAR-TANVIN-KAYES
