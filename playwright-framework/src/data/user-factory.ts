import { randomUUID } from 'crypto';

/**
 * Synthetic customers only. Every run creates fresh accounts on example.com,
 * so no real person's details ever appear in a test, a trace or a report.
 */
export class TestUser {
  readonly firstName = 'Ada';
  readonly lastName = 'Okafor';
  readonly email: string;
  readonly password: string;

  constructor(label: string) {
    const id = randomUUID().slice(0, 8);
    this.email = `qa-${label}-${id}@example.com`;
    // Keep under the sign-in form's length limit. The API accepts longer passwords at
    // registration than the UI accepts at sign-in (found by TS-101).
    this.password = `Pw-${randomUUID().slice(0, 12)}!9`;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  toRegistrationPayload() {
    return {
      first_name: this.firstName,
      last_name: this.lastName,
      dob: '1990-01-01',
      phone: '0123456789',
      email: this.email,
      password: this.password,
      address: { street: '1 Test Street', city: 'Lagos', state: 'Lagos', country: 'NG', postal_code: '100001' },
    };
  }
}
