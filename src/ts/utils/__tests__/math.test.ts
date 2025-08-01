import { multiply, divide } from '../math';

describe('math', () => {
  it('multiply', () => {
    expect(multiply(2, 2)).toBe(4);
  });

  it('divide', () => {
    expect(divide(2, 2)).toBe(1);
  });
});
