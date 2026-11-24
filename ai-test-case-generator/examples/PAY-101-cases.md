# PAY-101: generated cases (drafts)

*Output of `/generate-test-cases PAY-101` on the synthetic ticket. All data is invented.*

**Project:** PAYQ · **Suite:** Recipients / Saving (new, under Recipients) · **Tags:** `PAY-101`, `ai-generated`

---

## Created

### PAYQ-412 · Verify that a recipient's account name appears after entering a valid bank and 10-digit account number
**Priority:** High
**Preconditions:**
Customer has a verified identity
Customer is signed in to the mobile app

| # | Step | Expected result |
|---|---|---|
| 1 | Open **Send money** | |
| 2 | Tap `Add recipient` | **Add recipient** opens with `Save` disabled |
| 3 | Select Demo Bank in `Bank` | |
| 4 | Enter 0123456789 in `Account number` | A **loading indicator** shows while the account is checked |
| 5 | Wait for the check to finish | **Ada Okafor** appears under the account number and `Save` is enabled |

### PAYQ-413 · Verify that a recipient can't be saved when the account check fails, and the account name stays empty
**Priority:** High
**Preconditions:**
Customer has a verified identity
Customer is signed in to the mobile app

| # | Step | Expected result |
|---|---|---|
| 1 | Open **Send money** and tap `Add recipient` | |
| 2 | Select Demo Bank and enter 9999999999 | |
| 3 | Wait for the check to finish | **Couldn't verify** message shows, no name appears, and `Save` **stays disabled** |

### PAYQ-414 · Verify that the account check only starts once the account number reaches all 10 digits
**Priority:** Medium
**Preconditions:**
Customer has a verified identity
Customer is signed in to the mobile app

| # | Step | Expected result |
|---|---|---|
| 1 | Open **Add recipient** and select Demo Bank | |
| 2 | Enter 012345678 in `Account number` | **No check runs** and `Save` stays disabled |
| 3 | Add a final 9 | The **account check starts** |

### PAYQ-415 · Verify that a newly saved recipient appears first on Send money and is still there after reopening the app
**Priority:** High
**Preconditions:**
Customer has a verified identity
Customer is signed in to the mobile app

| # | Step | Expected result |
|---|---|---|
| 1 | Open **Add recipient**, select Demo Bank and enter 0123456789 | Ada Okafor appears |
| 2 | Enter Ada in `Nickname` | |
| 3 | Tap `Save` | The app returns to **Send money** |
| 4 | Look at the recipient list | **Ada** (Demo Bank ••6789) is **first in the list** |
| 5 | Force-close the app and reopen it | |
| 6 | Open **Send money** | **Ada is still first** |

### PAYQ-416 · Verify that saving the same bank and account number a second time is refused with a duplicate warning
**Priority:** Medium
**Preconditions:**
Customer has a verified identity
Customer is signed in to the mobile app

| # | Step | Expected result |
|---|---|---|
| 1 | Save Demo Bank 0123456789 as a recipient | |
| 2 | Tap `Add recipient` again and enter the same bank and number | |
| 3 | Tap `Save` | **Duplicate warning** appears and the list keeps **one entry** for this account |

### PAYQ-417 · Verify that the nickname field stops accepting characters after 30 and saves the trimmed nickname
**Priority:** Low
**Preconditions:**
Customer has a verified identity
Customer is signed in to the mobile app

| # | Step | Expected result |
|---|---|---|
| 1 | Open **Add recipient**, select Demo Bank and enter 0123456789 | |
| 2 | Type Ada from the Lagos office team!! in `Nickname` | The field **stops at 30 characters** |
| 3 | Tap `Save` | The recipient saves with the **30-character nickname** |

### PAYQ-418 · Verify that a customer without a verified identity is asked to verify instead of seeing the recipient form
**Priority:** High
**Preconditions:**
Customer has not verified their identity
Customer is signed in to the mobile app

| # | Step | Expected result |
|---|---|---|
| 1 | Open **Send money** | |
| 2 | Tap `Add recipient` | A **verify identity prompt** shows and the recipient form **does not open** |

---

## Skipped (already covered)

- Recipient list loads on **Send money**: covered by PAYQ-120.

## Suggested updates

- **PAYQ-121** · Verify that the recipient list on Send money shows saved recipients in order
  Expected result for step 2: change "listed alphabetically" to **"listed newest first"**.

## Suggested deprecations

- None.

## Notes

- Open question: is the duplicate check per customer, or shared across a business account?
- Open question: what should show when the account check times out rather than fails?
