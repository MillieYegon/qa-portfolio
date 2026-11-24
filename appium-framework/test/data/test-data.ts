// Synthetic data only.

export const VALID_USER = { email: 'ada.okafor@example.com', password: 'Passw0rd!' } as const;

export const MESSAGES = {
  invalidEmail: 'Please enter a valid email address',
  shortPassword: 'Please enter at least 8 characters',
  loggedIn: 'You are logged in!',
  signedUp: 'You successfully signed up!',
  activeButton: 'This button is active',
} as const;

export const DROPDOWN_OPTIONS = {
  appium: 'Appium is awesome',
} as const;
