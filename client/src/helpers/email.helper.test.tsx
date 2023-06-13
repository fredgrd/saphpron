import { isValidEmail } from './email.helper';

const MOCK_EMAILS = {
  valid: 'federico@gmail.com',
  invalidNoAt: 'federico.com',
  invalidNoDot: 'federico@com',
};

it('validates a correct email', () => {
  const result = isValidEmail(MOCK_EMAILS.valid);
  expect(result).toBe(true);
});

it('validates an email missing the @ sign', () => {
  const result = isValidEmail(MOCK_EMAILS.invalidNoAt);
  expect(result).toBe(false);
});

it('validates an email missing the . sign', () => {
  const result = isValidEmail(MOCK_EMAILS.invalidNoDot);
  expect(result).toBe(false);
});