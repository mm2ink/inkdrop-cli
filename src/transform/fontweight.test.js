const {
  parseFontWeightValue,
  extractFontWeightTokens,
  extractAllFontWeightTokens,
} = require('./fontweight');

describe('parseFontWeightValue', () => {
  it('returns numeric values as strings', () => {
    expect(parseFontWeightValue(400)).toBe('400');
    expect(parseFontWeightValue(700)).toBe('700');
    expect(parseFontWeightValue(300.9)).toBe('301');
  });

  it('resolves named weights', () => {
    expect(parseFontWeightValue('regular')).toBe('400');
    expect(parseFontWeightValue('bold')).toBe('700');
    expect(parseFontWeightValue('light')).toBe('300');
    expect(parseFontWeightValue('semibold')).toBe('600');
    expect(parseFontWeightValue('black')).toBe('900');
    expect(parseFontWeightValue('thin')).toBe('100');
  });

  it('is case-insensitive for named weights', () => {
    expect(parseFontWeightValue('Bold')).toBe('700');
    expect(parseFontWeightValue('REGULAR')).toBe('400');
    expect(parseFontWeightValue('SemiBold')).toBe('600');
  });

  it('resolves numeric string values', () => {
    expect(parseFontWeightValue('500')).toBe('500');
    expect(parseFontWeightValue('800')).toBe('800');
  });

  it('falls back to 400 for unknown values', () => {
    expect(parseFontWeightValue('unknown')).toBe('400');
    expect(parseFontWeightValue('')).toBe('400');
    expect(parseFontWeightValue('50')).toBe('400');
  });
});

describe('extractFontWeightTokens', () => {
  it('extracts flat tokens', () => {
    const tokens = {
      body: { value: 'regular' },
      heading: { value: 'bold' },
    };
    const result = extractFontWeightTokens(tokens);
    expect(result['font-weight-body']).toBe('400');
    expect(result['font-weight-heading']).toBe('700');
  });

  it('extracts nested tokens', () => {
    const tokens = {
      display: {
        sm: { value: 600 },
        lg: { value: 'black' },
      },
    };
    const result = extractFontWeightTokens(tokens);
    expect(result['font-weight-display-sm']).toBe('600');
    expect(result['font-weight-display-lg']).toBe('900');
  });

  it('handles raw (non-object) values', () => {
    const tokens = { base: 'medium' };
    const result = extractFontWeightTokens(tokens);
    expect(result['font-weight-base']).toBe('500');
  });
});

describe('extractAllFontWeightTokens', () => {
  it('reads from fontWeight key', () => {
    const all = { fontWeight: { base: { value: 'regular' } } };
    expect(extractAllFontWeightTokens(all)['font-weight-base']).toBe('400');
  });

  it('reads from font-weight key', () => {
    const all = { 'font-weight': { base: { value: 700 } } };
    expect(extractAllFontWeightTokens(all)['font-weight-base']).toBe('700');
  });

  it('returns empty object when no tokens', () => {
    expect(extractAllFontWeightTokens({})).toEqual({});
  });
});
