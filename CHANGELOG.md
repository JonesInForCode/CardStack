# Changelog

## [1.5.9] - 2025-06-10

### Fixed
- **Task Completion Logic** - Tasks with active subtasks can no longer be completed
  - Complete button is disabled and shows "Complete Subtasks First" when subtasks remain
  - Swipe-to-complete gesture also blocked with visual feedback
  - Future-proofed for nested subtask support

## [1.5.8] - 2025-06-07

### Fixed
- Gesture navigation refinements and bug fixes

## [1.5.7] - 2025-06-07

### Fixed
- Additional gesture navigation improvements

## [1.5.6] - 2025-06-07

### Fixed
- Gesture navigation touch sensitivity adjustments

## [1.5.5] - 2025-06-06

### Fixed
- Gesture navigation swipe direction corrections

## [1.5.4] - 2025-06-06

### Fixed
- Gesture navigation performance optimizations

## [1.5.3] - 2025-06-06

### Fixed
- Gesture navigation edge case handling

## [1.5.2] - 2025-06-06

### Fixed
- Gesture navigation visual feedback improvements

## [1.5.1] - 2025-06-06

### Fixed
- Initial gesture navigation bug fixes

## [1.5.0] - 2025-06-06

### Added
- **Gesture Navigation Feature Launch** - Swipe gestures for mobile navigation
  - Swipe right to complete tasks
  - Swipe left to view/add subtasks
  - Swipe up/down to navigate between tasks
  - Visual indicators show available actions during swipe

## [1.4.0] - 2025-06-03

### Added
- **Subtasks/Card Chaining** - Break down complex tasks into smaller subtasks
  - Add subtasks to any main task via the 🔗 button
  - View subtasks in a dedicated side-by-side interface
  - Complete, cancel, or upgrade subtasks to main tasks
  - Visual indicators show tasks with subtasks
  - Subtasks persist with their parent tasks

### Changed
- Task data structure now includes subtask support (non-breaking for existing tasks)

## [1.2.0] - 2025-05-15

### Added
- Improved styling of button components and disabled default browser text selection

## [1.1.4] - 2025-05-15

### Added
- Info modal in the header to provide contact info to the creator

## [1.1.3] - 2025-05-15

### Fixed
- Improved Pomodoro timer to work correctly when the app is in the background or the device is locked
- Timer now accurately tracks time using absolute timestamps instead of counting seconds
- Added automatic time recalculation when the app regains focus

## [1.1.0] - 2025-05-15

### Added
- **Pomodoro Timer Feature**
  - 25-minute focus timer on task cards
  - 5-minute break timer with reminder modal
  - Toggle button in the application header

## [1.0.0] - Initial Release

### Features
- Card-based task interface
- Task priority system
- Snooze functionality
- Dark/light mode
- Task categories