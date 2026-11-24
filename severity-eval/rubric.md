# Bug severity rubric

Severity describes **impact on the people using the product**, judged from the bug report as written. It is not about how hard the fix is, or how loudly the reporter asks.

## The key question

**Can the affected person still complete what they were trying to do?**

Decide Major versus Medium with this question, not with whether the reporter mentions a workaround.

| Severity | Use when |
|---|---|
| **Critical** | The product is down, or a core flow is broken, **for its users in general**: nobody can sign in, nobody can check out, every payment fails. |
| **Major** | A workflow **cannot be completed** for the people affected, even if that is one customer, one country or one configuration. Also: wrong money (double charges, discounts applied twice, wrong totals), unrecoverable data loss, overselling stock, and any security or access-control flaw. |
| **Medium** | The workflow **can still be completed**, but something is wrong: a confirmed workaround exists, data is wrong but correctable, a notification or report is missing, a non-core query errors, or performance is degraded. |
| **Minor** | Cosmetic issues, wording, developer-only hygiene with no effect on users. |
| **Not a bug** | A support question, a feature request, or a configuration problem on the reporter's side. |

## Rules

1. **One user blocked is Major,** not Critical. Critical means it is down for users in general.
2. **Security is Major,** even when no one is blocked (for example, a deactivated account can reactivate itself).
3. **Money is Major.** If customers can be charged wrongly, or the merchant loses revenue through a calculation error, it is Major.
4. **A confirmed workaround supports Medium.** An unconfirmed or unrealistic one does not: blocked with no realistic workaround stays Major.
5. **Recoverable is Medium, unrecoverable is Major.** Data that can be corrected later is Medium; data that is lost or silently wrong in ways that cause harm (stock, money) is Major.
6. **Silent failures count.** An action that appears to work but doesn't do its job is judged by the job it failed to do.
7. **Judge the report, not the title.** A reporter writing "Critical" in the title doesn't make it Critical.
8. **Grade from the words.** If the impact depends on a screenshot or video the grader can't see, grade what the text supports and note it.
