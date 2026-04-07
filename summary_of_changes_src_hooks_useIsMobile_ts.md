# Summary of Changes: `src/hooks/useIsMobile.ts`

*   **Created `useIsMobile` custom hook**: Extracted device detection logic from individual components into a reusable hook.
*   **Centralized Logic**: Checks `window.matchMedia('(pointer: coarse)')`, `window.matchMedia('(hover: hover)')`, and `window.innerWidth <= 768` to accurately capture if the user interface should switch to mobile-friendly layouts (e.g. touch/swipe centric). This reduces duplication and centralizes best-practices for device/touch-capability detection in responsive React applications.