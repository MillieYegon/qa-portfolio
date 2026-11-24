// Every wait and pause in one place. Specs and page objects never hard-code a number.

export const TIMEOUTS = {
  SHORT: 5_000,
  MEDIUM: 10_000,
  LONG: 20_000,
} as const;

// Deliberate pacing only, never a way to wait for state.
export const PACING = {
  TAP_HOLD_MS: 80,
  SWIPE_MS: 400,
  SETTLE_MS: 300,
} as const;
