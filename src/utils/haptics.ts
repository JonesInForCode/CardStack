import { HAPTIC_DURATION } from '../constants';

/**
 * Triggers haptic feedback based on action type
 * @param type The type of action being performed
 */
export const triggerHapticFeedback = (type: 'complete' | 'dismiss' | 'snooze' | 'shuffle'): void => {
  if (!navigator.vibrate) return;
  
  switch (type) {
    case 'complete':
      navigator.vibrate(HAPTIC_DURATION.COMPLETE);
      break;
    case 'dismiss':
      navigator.vibrate(HAPTIC_DURATION.DISMISS);
      break;
    case 'snooze':
      navigator.vibrate(HAPTIC_DURATION.SNOOZE);
      break;
    case 'shuffle':
      // Create a more distinct pattern for shuffle - a quick double vibration
      navigator.vibrate([HAPTIC_DURATION.SHUFFLE, 50, HAPTIC_DURATION.SHUFFLE]);
      break;
    default:
      navigator.vibrate(30); // Default light feedback
  }
};

/**
 * Checks if haptic feedback is available on the device
 * @returns boolean indicating if vibration is supported
 */
export const isHapticFeedbackAvailable = (): boolean => {
  return !!navigator.vibrate;
};