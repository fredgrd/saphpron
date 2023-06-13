import { isValidName } from './name.helper';

const MOCK_NAMES = {
  valid: 'Federico',
  invalidWithSpacesFront: '  Federico',
  invalidWithSpacesEnd: 'Federico    ',
  invalidWithSymbols: 'Federico@!_',
  invalidWithNumbers: 'Federico21292',
};

it('validates a correct name', () => {
  const result = isValidName(MOCK_NAMES.valid);
  expect(result).toBe(true);
});

it('validates a name with spaces at the start', () => {
  const result = isValidName(MOCK_NAMES.invalidWithSpacesFront);
  expect(result).toBe(false);
});

it('validates a name with spaces at the end', () => {
  const result = isValidName(MOCK_NAMES.invalidWithSpacesEnd);
  expect(result).toBe(false);
});

it('validates a name with symbol', () => {
  const result = isValidName(MOCK_NAMES.invalidWithSymbols);
  expect(result).toBe(false);
});

it('validates a name with numbers', () => {
  const result = isValidName(MOCK_NAMES.invalidWithNumbers);
  expect(result).toBe(false);
});
