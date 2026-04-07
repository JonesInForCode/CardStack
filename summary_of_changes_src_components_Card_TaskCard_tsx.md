# Summary of Changes: `src/components/Card/TaskCard.tsx`

*   **Replaced custom mobile detection logic with `useIsMobile` hook**: Imported and used `useIsMobile` hook to remove duplicate and slightly differing mobile device detection logic (the `useEffect` hook handling window resize and coarse pointers). This makes the application behavior more consistent across different components.