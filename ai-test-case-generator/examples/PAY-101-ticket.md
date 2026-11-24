# PAY-101: Save a transfer recipient

*Synthetic example ticket for a fictional payments app.*

**As a** customer sending money
**I want to** save a recipient after verifying their account
**So that** I don't re-enter their details for every transfer

## Acceptance criteria

1. On **Add recipient**, the customer enters a bank and a 10-digit account number.
2. The app looks up the account name and shows it before saving.
3. If the lookup fails, the app shows "We couldn't verify this account" and does not allow saving.
4. The customer can add an optional nickname (max 30 characters).
5. Saving the same bank and account number twice shows "This recipient is already saved".
6. Saved recipients appear on the **Send money** screen, newest first.
7. Customers with an unverified identity can't save recipients; they see a prompt to verify.

**Design:** Add recipient screen with states: empty, looking up, verified, failed, saving.
