

# Sales Pitch Page for MDDMA Committee

## What We're Building
A dedicated `/pitch` page -- a polished, presentation-ready sales document that you can show to the MDDMA committee to sell them on this digital transformation. It will be a scrollable, single-page pitch deck rendered as a web page with print-friendly styling.

## Page Structure

### 1. Cover Section
- "MDDMA Digital Platform" title with tagline
- "Prepared for: Mumbai Dry Fruits & Dates Merchants Association"
- Date and version

### 2. The Problem
- Current website is Flash-based, non-functional on modern browsers
- No searchable member directory -- members are invisible online
- Manual membership workflows waste committee time
- No revenue from digital advertising or lead intelligence
- Losing credibility with younger traders and international partners

### 3. The Solution (Platform Overview)
- Visual mockup screenshots pulled from the live demo (linking to actual pages)
- Five core modules listed with icons:
  - Verified Member Directory
  - Product Discovery Catalog
  - Lead Intelligence Portal
  - Advertising Platform
  - Admin Dashboard

### 4. Key Features Showcase
- Interactive cards for each module with "View Demo" buttons linking to the actual built pages (`/directory`, `/products`, `/leads`, `/admin`)
- Highlight the member profile, search filters, product pages

### 5. Revenue Model
- Membership tiers (Silver/Gold/Platinum) with pricing
- Advertising slots (homepage banner, directory sidebar, category pages)
- Lead pack sales (expo databases)
- Affiliate commission on retail links
- Visual table showing projected revenue streams

### 6. Why Now?
- 95-year legacy needs a modern digital wrapper
- Competitors (other associations) are digitizing
- Members expect online access
- Government digitization push (GST, FSSAI integration)

### 7. Implementation Timeline
- Phase 1 (Month 1-2): Public website + directory
- Phase 2 (Month 2-3): Membership system + payments
- Phase 3 (Month 3-4): Admin panel + lead intelligence
- Visual timeline/roadmap graphic

### 8. Investment & ROI
- Development cost placeholder
- Projected membership growth
- Advertising revenue potential
- Break-even timeline

### 9. Call to Action
- "Let's Build This Together"
- Contact details / next steps
- Print button to export as PDF

## Technical Details

### New Files
- `src/pages/SalesPitch.tsx` -- the main pitch page component with all sections
- `src/components/pitch/PitchSection.tsx` -- reusable section wrapper with consistent styling

### Modified Files
- `src/App.tsx` -- add `/pitch` route

### Design Approach
- Clean, presentation-style layout with large typography and generous whitespace
- Navy and gold color scheme matching the platform
- Print-optimized CSS (`@media print`) so they can Ctrl+P to PDF
- Each section fills roughly one viewport height for a "slide deck" feel
- Smooth scroll navigation between sections

