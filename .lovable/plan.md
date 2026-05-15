## Changes

**1. Hero copy** (`src/components/home/HeroSection.tsx`)
- Eyebrow: "Established 1930 · Mumbai's Trade Authority" → "Established 1930 · India's Trade Authority"
- H1: "India's digital trade hub for dry fruits & commodities" → "The home of India's dry fruit trade."

**2. Header logo** (`src/components/layout/Header.tsx` + assets)
- Copy `user-uploads://MDDMA_Royal_Heritage_Logo-2.svg` → `src/assets/brand/MDDMA_Royal_Heritage_Logo.svg` (overwrites existing horizontal variant used by `Logo`)
- Switch header `<Logo>` from `variant="mark"` to `variant="horizontal"` and bump size (~h-12), remove the redundant "MDDMA" text span next to it since the new logo includes the wordmark
- Mobile sheet header: same horizontal variant at a smaller size (~h-8)