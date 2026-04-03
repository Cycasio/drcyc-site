# Website Redesign Specification

## Overview
Redesign the Astro site using the Google Stitch design mockup at `stitch-design.html` (in project root).
The Stitch file contains 4 concatenated HTML pages: Design System/Blog Listing, Homepage, Blog Article, Services.

## Design Tokens (from Stitch)

### Colors (MD3 palette)
```
primary: #022448 (Navy)
secondary: #006a60 (Teal)
primary-container: #1e3a5f
secondary-container: #8cf5e4
on-primary: #ffffff
on-secondary: #ffffff
on-surface: #191c1d
on-surface-variant: #43474e
surface: #f8f9fa
surface-container: #edeeef
surface-container-low: #f3f4f5
surface-container-lowest: #ffffff
surface-container-high: #e7e8e9
outline: #74777f
outline-variant: #c4c6cf
on-primary-container: #8aa4cf
on-secondary-container: #007166
error: #ba1a1a
```

### Fonts
- Headings: `Manrope` (wght 400;700;800)
- Body: `Public Sans` (wght 300;400;500;600;700)
- Chinese fallback: `Noto Sans TC` (add from Google Fonts)
- Font families in Tailwind:
  - `font-headline` → Manrope
  - `font-body` → Public Sans, Noto Sans TC, sans-serif
  - `font-label` → Public Sans

### Border Radius
- DEFAULT: 0.25rem
- lg: 0.5rem
- xl: 0.75rem
- 2xl: 1rem
- 3xl: 1.5rem
- full: 9999px

## Architecture

### 1. Install & Configure Tailwind
The project has `@astrojs/tailwind` and `tailwindcss` in package.json but NO tailwind config file yet and the Astro config doesn't include the tailwind integration.

Steps:
1. Create `tailwind.config.mjs` with the design tokens above
2. Add `@astrojs/tailwind` to `astro.config.mjs` integrations
3. Update `src/layouts/Layout.astro` to import Google Fonts and set base styles

### 2. Shared Components to Create

#### `src/components/Nav.astro`
- Sticky top, glass-blur background (`bg-slate-50/70 backdrop-blur-xl`)
- Brand: "YC Chen, MD" (text-xl font-bold tracking-tighter text-blue-950)
- Desktop links: 首頁, 衛教專欄, 服務項目, 關於我
- CTA button: 預約掛號 (rounded-full, primary gradient)
- Mobile: hamburger menu (simple toggle)
- Active link style: `text-blue-900 border-b-2 border-teal-600 pb-1 font-bold`
- Mark active based on current path (use `Astro.url.pathname`)

#### `src/components/Footer.astro`
- 3-column grid: brand+description, 快速連結, 聯絡資訊
- Match the Stitch footer style (bg-slate-100)
- Real info: 義大醫院 family med, cyc@edfm.org, facebook.com/lazydr, drcyc.io
- Copyright: © 2026 YC Chen, MD

#### `src/components/BlogCard.astro`
- Reusable card for blog listing
- Props: title, description, slug, pubDate, tags, image
- Match Stitch card style: rounded-xl, shadow, hover scale, category badge, date+reading time

### 3. Pages to Redesign

#### Homepage (`src/pages/index.astro`)
Follow the Stitch "首頁" design:
- **Hero**: Large heading "YC Chen, MD: Your Health Partner in Family Medicine" with Chinese subtitle. Photo on right (use existing `/images/portrait.jpg`). Two CTA buttons.
- **Service Highlights (Bento Grid)**: Asymmetric grid with MD3 cards. Map to real services:
  1. 企業臨場健康服務 (large card, col-span-2)
  2. 高階健康檢查 (small dark primary card)
  3. 減重管理門診 (teal secondary-container card)
  4. 社區健康營造 (horizontal card with image, col-span-2)
- **Philosophy Quote**: Blockquote section with teal left border. Real quote from YC.
- **Featured Blog Posts**: 3-column grid showing latest 3 posts from content collection
- **CTA Section**: Dark primary-container background, 預約掛號 button
- Keep ALL existing JSON-LD schemas (Person, MedicalBusiness, FAQPage)
- Keep existing FAQ section (styled with new design)

#### Blog Listing (`src/pages/blog/index.astro`)
Follow the Stitch "衛教專欄" design:
- Page header: "衛教專欄" (text-5xl font-extrabold)
- Featured post: First post displayed large (editorial style, image left, content right)
- Category filter buttons (pull unique tags from posts)
- 3-column card grid for remaining posts
- Use BlogCard component
- Pull from Astro content collection (already set up)

#### Blog Article (`src/pages/blog/[...slug].astro`)
**This file doesn't exist yet — CREATE IT.**
Follow the Stitch "衛教專欄文章" design:
- Article layout with max-width ~720px
- Category label + date at top
- Large heading
- Featured image (from frontmatter)
- Article content with `chinese-line-height` (line-height: 1.8)
- Styled blockquotes (teal left border)
- h2 styling (text-2xl font-bold text-primary)
- **Sticky TOC sidebar** (right side, hidden on mobile, `lg:block w-64`)
  - Auto-generate from h2 headings in the content
  - Active state highlighting
- Author bio card in sidebar
- Bottom CTA card (gradient, 預約掛號)

#### Services (`src/pages/services.astro`)
**NEW PAGE** — replaces the 3 separate service pages.
Follow the Stitch "服務項目" design:
- Hero with "全面且細緻的家庭醫學照顧" heading
- **Bento grid** with real services:
  1. 企業臨場健康服務 (large, col-span-8) — workplace health visits, legal compliance, employee wellness
  2. 高階健康檢查 (col-span-4) — behavioral science integrated checkups
  3. 減重管理門診 (col-span-4) — COM-B model, evidence-based weight management
  4. 社區健康營造 (horizontal, col-span-8) — community health building (籌備中)
  5. 骨質疏鬆門診 — bone density, treatment
  6. 運動醫學諮詢 — exercise prescription
- Philosophy quote section
- CTA section (dark primary background)
- Add JSON-LD Service schemas

### 4. Layout Updates (`src/layouts/Layout.astro`)

- Add Google Fonts link: Manrope, Public Sans, Noto Sans TC, Material Symbols Outlined
- Set base font-family to `Public Sans, Noto Sans TC, sans-serif`
- Headings font-family to `Manrope, sans-serif`
- Keep ALL existing JSON-LD schemas
- Remove old CSS variables (--primary, --text, etc.) and old component styles
- Add Tailwind `@tailwind base; @tailwind components; @tailwind utilities;`
- Include Nav and Footer components

### 5. Redirects
The old pages (`/workplace-health`, `/health-checkup`, `/community-health`) should redirect to `/services`.
Create a simple redirect in each file or use Astro redirects.

### 6. Content
- Keep existing blog markdown files in `src/content/blog/`
- Add `category` field to blog schema (optional, string)
- Update blog frontmatter to include categories matching the tags

## DO NOT
- Remove or modify JSON-LD schemas (keep all existing ones, can enhance)
- Remove or modify `public/llms.txt` or `public/robots.txt`
- Change the site URL or Astro config site setting
- Use any external UI libraries (no daisyUI, no shadcn — just Tailwind)
- Remove the portrait image reference

## IMPORTANT
- Chinese text should use `leading-relaxed` or custom `chinese-line-height` class (line-height: 1.8)
- All real content — no lorem ipsum, no fake clinic addresses
- Real services: 義大醫院家庭暨社區醫學部, 義大減重中心
- Real contact: cyc@edfm.org, facebook.com/lazydr, drcyc.io
- Keep responsive design (mobile-first)
- The `category` in blog content collection schema should be optional string field

## Testing
After all changes, run `npm run build` to verify no build errors.
