# PAY-101: generated cases (draft)

*Output of `/generate-test-cases` on the synthetic ticket. All data is invented.*

**Coverage check:** 1 existing case found, "Send money: recipient list shows recent recipients". It now needs an update (saved recipients appear newest first). No duplicates.

**Skipped:** none.

---

### 1. Recipients: account name shows after a valid account lookup
**Priority:** High · **Tags:** PAY-101, recipients
**Preconditions:** Signed in as a verified customer. Test bank "Demo Bank" has account 0123456789 named "Ada Okafor".

| Step | Expected |
|---|---|
| 1. Open Send money, tap Add recipient | Add recipient screen opens with Bank and Account number empty, Save disabled |
| 2. Select "Demo Bank", enter 0123456789 | A loading indicator shows while the account is looked up |
| 3. Wait for the lookup | "Ada Okafor" is shown under the account number and Save is enabled |

### 2. Recipients: saving is blocked when the account lookup fails
**Priority:** High · **Tags:** PAY-101, recipients
**Preconditions:** Signed in as a verified customer. Account 9999999999 does not exist at "Demo Bank".

| Step | Expected |
|---|---|
| 1. Select "Demo Bank", enter 9999999999 | Lookup runs |
| 2. Wait for the lookup | "We couldn't verify this account" is shown; no account name; Save stays disabled |

### 3. Recipients: account number with fewer than 10 digits is not looked up
**Priority:** Medium · **Tags:** PAY-101, recipients, validation

| Step | Expected |
|---|---|
| 1. Select "Demo Bank", enter 012345678 (9 digits) | No lookup runs; Save stays disabled |
| 2. Enter a 10th digit, 9 | Lookup runs |

### 4. Recipients: nickname is limited to 30 characters
**Priority:** Low · **Tags:** PAY-101, recipients, validation
**Preconditions:** A verified account has been looked up (case 1).

| Step | Expected |
|---|---|
| 1. Type "Ada from the Lagos office team!!" (32 characters) in Nickname | Field stops accepting input at 30 characters |
| 2. Tap Save | Recipient saves with the 30-character nickname |

### 5. Recipients: saved recipient appears first on Send money
**Priority:** High · **Tags:** PAY-101, recipients

| Step | Expected |
|---|---|
| 1. Save "Ada Okafor" with nickname "Ada" | Confirmation shows; app returns to Send money |
| 2. Look at the recipient list | "Ada" (Ada Okafor, Demo Bank ••6789) is first in the list |
| 3. Close and reopen the app, open Send money | "Ada" is still first |

### 6. Recipients: saving a duplicate recipient is refused
**Priority:** Medium · **Tags:** PAY-101, recipients
**Preconditions:** "Ada Okafor", Demo Bank 0123456789 is already saved.

| Step | Expected |
|---|---|
| 1. Add recipient with Demo Bank and 0123456789, tap Save | "This recipient is already saved" is shown; the list still has one entry for this account |

### 7. Recipients: unverified customer is asked to verify instead of saving
**Priority:** High · **Tags:** PAY-101, recipients, permissions
**Preconditions:** Signed in as a customer whose identity is not verified.

| Step | Expected |
|---|---|
| 1. Open Send money, tap Add recipient | A prompt to verify identity is shown with a Verify now button; the Add recipient form does not open |

---

## Proposed update to an existing case

**"Send money: recipient list shows recent recipients"**
- Before: Expected "Recipients are listed alphabetically"
- After: Expected "Saved recipients are listed newest first"

## Open questions

- Is the duplicate check per customer, or across shared business accounts?
- What does the app show if the lookup times out rather than failing?
