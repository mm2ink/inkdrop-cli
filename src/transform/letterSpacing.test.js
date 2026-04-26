const {
  parseLetterSpacingValue,
  letterSpacingToCss,
  extractLetterSpacingTokens,
  extractAllLetterSpacingTokens,
} = require('./letterSpacing');

describe('parseLetterSpacingValue', () => {
  it('converts PERCENT unit to em', () => {
    expect(parseLetterSpacingValue(5, 'PERCENT')).toBe('0.0500em');
  });

  it('converts negative PERCENT to em', () => {
    expect(parseLetterSpacingValue(-2, 'PERCENT')).toBe('-0.0200em');
  });

  it('converts PIXELS unit to px', () => {
    expect(parseLetterSpacingValue(2, 'PIXELS')).toBe('2px');
  });

  it('returns 0em for null value', () => {
    expect(parseLetterSpacingValue(null, 'PERCENT')).toBe('0em');
  });

  it('returns 0em for undefined value', () => {
    expect(parseLetterSpacingValue(undefined, 'PIXELS')).toBe('0em');
  });

  it('returns 0em for NaN value', () => {
    expect(parseLetterSpacingValue('abc', 'PIXELS')).toBe('0em');
  });

  it('falls back to px for unknown unit', () => {
    expect(parseLetterSpacingValue(3, 'EM')).toBe('3px');
  });
});

describe('letterSpacingToCss', () => {
  it('returns the value as-is', () => {
    expect(letterSpacingToCss('0.05em')).toBe('0.05em');
    expect(letterSpacingToCss('2px')).toBe('2px');
  });
});

describe('extractLetterSpacingTokens', () => {
  it('extracts tokens with letter in name', () => {
    const tokens = {
      'typography.letterSpacing.sm': '0.05em',
      'typography.fontSize.base': '16px',
      'tracking.wide': '0.1em',
    };
    const result = extractLetterSpacingTokens(tokens);
    expect(result).toHaveProperty('typography.letterSpacing.sm', '0.05em');
    expect(result).toHaveProperty('tracking.wide', '0.1em');
    expect(result).not.toHaveProperty('typography.fontSize.base');
  });
});

describe('extractAllLetterSpacingTokens', () => {
  it('extracts from nested styles with value/unit objects', () => {
    const styles = {
      typography: {
        letterSpacing: {
          sm: { value: 2, unit: 'PERCENT' },
          md: { value: 4, unit: 'PERCENT' },
        },
      },
    };
    const result = extractAllLetterSpacingTokens(styles);
    expect(result['typography.letterSpacing.sm']).toBe('0.0200em');
    expect(result['typography.letterSpacing.md']).toBe('0.0400em');
  });

  it('extracts from nested styles with raw numeric values', () => {
    const styles = {
      tracking: {
        tight: 1,
        wide: 3,
      },
    };
    const result = extractAllLetterSpacingTokens(styles);
    expect(result['tracking.tight']).toBe('1px');
    expect(result['tracking.wide']).toBe('3px');
  });

  it('ignores unrelated tokens', () => {
    const styles = {
      color: { primary: '#ff0000' },
    };
    const result = extractAllLetterSpacingTokens(styles);
    expect(Object.keys(result)).toHaveLength(0);
  });
});
