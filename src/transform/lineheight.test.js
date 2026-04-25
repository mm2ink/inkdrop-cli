const {
  parseLineHeightValue,
  lineHeightToCss,
  extractLineHeightTokens,
  extractAllLineHeightTokens,
} = require('./lineheight');

describe('parseLineHeightValue', () => {
  it('returns "normal" for AUTO unit', () => {
    expect(parseLineHeightValue('AUTO', 'AUTO')).toBe('normal');
    expect(parseLineHeightValue(0, 'AUTO')).toBe('normal');
  });

  it('converts PERCENT to unitless ratio', () => {
    expect(parseLineHeightValue(150, 'PERCENT')).toBe('1.5');
    expect(parseLineHeightValue(120, 'PERCENT')).toBe('1.2');
  });

  it('converts PIXELS to px string', () => {
    expect(parseLineHeightValue(24, 'PIXELS')).toBe('24px');
    expect(parseLineHeightValue(16.5, 'PIXELS')).toBe('16.5px');
  });

  it('returns unitless number as string when no unit provided', () => {
    expect(parseLineHeightValue(1.5)).toBe('1.5');
  });

  it('returns "normal" for non-numeric values', () => {
    expect(parseLineHeightValue('bad', 'PIXELS')).toBe('normal');
    expect(parseLineHeightValue(NaN, 'PERCENT')).toBe('normal');
  });
});

describe('lineHeightToCss', () => {
  it('passes through the value unchanged', () => {
    expect(lineHeightToCss('1.5')).toBe('1.5');
    expect(lineHeightToCss('24px')).toBe('24px');
    expect(lineHeightToCss('normal')).toBe('normal');
  });
});

describe('extractLineHeightTokens', () => {
  it('extracts flat tokens with default prefix', () => {
    const tokens = {
      body: { value: 150, unit: 'PERCENT' },
      heading: { value: 24, unit: 'PIXELS' },
    };
    const result = extractLineHeightTokens(tokens);
    expect(result['line-height-body']).toBe('1.5');
    expect(result['line-height-heading']).toBe('24px');
  });

  it('extracts nested tokens', () => {
    const tokens = {
      text: {
        sm: { value: 120, unit: 'PERCENT' },
        lg: { value: 32, unit: 'PIXELS' },
      },
    };
    const result = extractLineHeightTokens(tokens);
    expect(result['line-height-text-sm']).toBe('1.2');
    expect(result['line-height-text-lg']).toBe('32px');
  });

  it('handles AUTO values', () => {
    const tokens = { auto: { value: 'AUTO', unit: 'AUTO' } };
    const result = extractLineHeightTokens(tokens);
    expect(result['line-height-auto']).toBe('normal');
  });
});

describe('extractAllLineHeightTokens', () => {
  it('reads from lineHeight key', () => {
    const all = { lineHeight: { base: { value: 150, unit: 'PERCENT' } } };
    const result = extractAllLineHeightTokens(all);
    expect(result['line-height-base']).toBe('1.5');
  });

  it('reads from line-height key', () => {
    const all = { 'line-height': { base: { value: 24, unit: 'PIXELS' } } };
    const result = extractAllLineHeightTokens(all);
    expect(result['line-height-base']).toBe('24px');
  });

  it('returns empty object when no lineHeight tokens', () => {
    expect(extractAllLineHeightTokens({})).toEqual({});
  });
});
