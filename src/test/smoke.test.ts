import { describe, it, expect } from 'vitest';

describe('Smoke Test', () => {
  it('should run tests correctly', () => {
    expect(true).toBe(true);
  });

  it('should do basic math', () => {
    expect(1 + 1).toBe(2);
  });
});
