# Summary of Changes: `src/components/Modals/AddSubtaskModal.tsx`

*   **Refactored to use standard HTML `<form>`**: Wrapped the modal inputs in a `<form onSubmit={handleSubmit}>` tag.
*   **Prevented Default Form Behavior**: Updated `handleSubmit` to accept the form event and call `e.preventDefault()`.
*   **Accessibility and Usability**: Allows the user to naturally press 'Enter' inside the input field to trigger the addition of a subtask. Changed button types appropriately (`type="button"` for Cancel, `type="submit"` for Add Subtask).