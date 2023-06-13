import { isValidPassword } from './password.helper';

const MOCK_PASSWORDS = {
  valid: '210979412y9h51io2n',
  tooShort: '  123',
};

it('validates a correct password', () => {
  const result = isValidPassword(MOCK_PASSWORDS.valid);
  expect(result).toBe(true);
});

it('validates an incorrect password', () => {
  const result = isValidPassword(MOCK_PASSWORDS.tooShort);
  expect(result).toBe(false);
});