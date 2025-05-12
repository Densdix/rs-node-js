// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 5, b: 3, action: Action.Subtract, expected: 2 },
  { a: 4, b: 5, action: Action.Multiply, expected: 20 },
  { a: 10, b: 2, action: Action.Divide, expected: 5 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 0, b: 5, action: Action.Add, expected: 5 },
  { a: 0, b: 0, action: Action.Add, expected: 0 },
  { a: -1, b: -2, action: Action.Add, expected: -3 },
  { a: 10, b: 0, action: Action.Multiply, expected: 0 },
  { a: 2, b: 0, action: Action.Exponentiate, expected: 1 },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should return $expected when calculating $a $action $b',
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );

  test('should return null for invalid input', () => {
    expect(
      simpleCalculator({ a: 'invalid', b: 2, action: Action.Add }),
    ).toBeNull();
    expect(
      simpleCalculator({ a: 1, b: 'invalid', action: Action.Add }),
    ).toBeNull();
    expect(simpleCalculator({ a: 1, b: 2, action: 'invalid' })).toBeNull();
  });
});
