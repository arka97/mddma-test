## Header horizontal padding fix

### Problem
On mobile viewports the MDDMA logo and the login/user button sit too close to the left and right viewport edges, making the header feel cramped.

### Root cause
The header container currently uses `px-3` (12 px) horizontal padding on small screens, which is too tight for touch-friendly spacing.

### Change
In `src/components/layout/Header.tsx`, update the container div's padding classes:
- Change `px-3` → `px-4` (16 px on mobile)
- Keep existing `sm:px-6 lg:px-8` breakpoints unchanged

This gives the logo and login button a bit more breathing room from the viewport edges without affecting the desktop layout.