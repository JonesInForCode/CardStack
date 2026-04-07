# Summary of Changes: `src/context/ThemeContextCore.ts`

*   **Created New File**: Introduced a dedicated file to hold the `ThemeContext`, `ThemeContextType`, `ThemeMode` definitions and the `useTheme` hook.
*   **Best Practice Reasoning**: Separating context creation and hook definition from the provider component is a modern React best practice. It ensures clean separation of concerns and avoids ESLint "Fast Refresh" warnings (`react-refresh/only-export-components`), which occur when a file exports both a React component and standard functions/constants.