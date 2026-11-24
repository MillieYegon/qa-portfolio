// Shared constants. Specs and page objects read names from here instead of repeating literals.

export const PRODUCTS = {
  combinationPliers: 'Combination Pliers',
  clawHammer: 'Claw Hammer',
  boltCutters: 'Bolt Cutters',
} as const;

export const CATEGORIES = {
  hammer: 'Hammer',
} as const;

export const BANK_TRANSFER = {
  bankName: 'Demo Bank',
  accountName: 'Ada Okafor',
  accountNumber: '0123456789',
} as const;

export const INVALID_CARD = {
  number: '1234',
  expiry: '01/2020',
  cvv: '1',
  holder: 'Ada Okafor',
} as const;

export const MESSAGES = {
  paymentSuccess: 'Payment was successful',
  invalidCardNumber: 'Invalid card number format.',
  expiryInPast: 'Expiration date must be in the future.',
  invalidCvv: 'CVV must be 3 or 4 digits.',
  invalidLogin: 'Invalid email or password',
} as const;
