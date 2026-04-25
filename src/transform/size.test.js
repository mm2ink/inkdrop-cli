const { parseSizeValue, sizeToCss, extractAllSizeTokens } = require('./size');

describe('parseSizeValue', () => {
  it('parses plain numbers as pixels', () => {
    expect(parseSizeValue(16)).toBe(16);
    expect(parseSizeValue(0)).toBe(0);
  });

  it('parses px strings', () => {
    expect(parseSizeValue('24px')).toBe(24);
    expect(parseSizeValue('0px')).toBe(0);
  });

  it('parses rem strings converting to px', () => {
    expect(parseSizeValue('1rem')).toBe(16);
    expect(parseSizeValue('1.5rem')).toBe(24);
  });

  it('returns null for invalid values', () => {
    expect(parseSizeValue('auto')).toBeNull();
    expect(parseSizeValue(null)).toBeNull();
    expect(parseSizeValue(undefined)).toBeNull();
    expect(parseSizeValue('%50')).toBeNull();
  });
});

describe('sizeToCss', () => {
  it('returns 0 without unit for zero value', () => {
    expect(sizeToCss(0)).toBe('0');
    expect(sizeToCss(0, true)).toBe('0');
  });

  it('returns px string by default', () => {
    expect(sizeToCss(16)).toBe('16px');
    expect(sizeToCss(24)).toBe('24px');
  });

  it('returns rem string when useRem is true', () => {
    expect(sizeToCss(16, true)).toBe('1rem');
    expect(sizeToCss(24, true)).toBe('1.5rem');
  });

  it('respects custom base font size', () => {
    expect(sizeToCss(20, true, 10)).toBe('2rem');
  });
});

describe('extractAllSizeTokens', () => {
  it('extracts size tokens from nested tree', () => {
    const tree = {
      size: {
        sm: { value: 8 },
        md: { value: 16 },
        lg: { value: 24 },
      },
    };
    expect(extractAllSizeTokens(tree)).toEqual({
      sm: '8px',
      md: '16px',
      lg: '24px',
    });
  });

  it('converts to rem when useRem is true', () => {
    const tree = {
      size: {
        base: { value: 16 },
      },
    };
    expect(extractAllSizeTokens(tree, 'size', true)).toEqual({ base: '1rem' });
  });

  it('handles deeply nested tokens', () => {
    const tree = {
      size: {
        icon: {
          sm: { $value: 12 },
          lg: { $value: 32 },
        },
      },
    };
    const result = extractAllSizeTokens(tree);
    expect(result['icon-sm']).toBe('12px');
    expect(result['icon-lg']).toBe('32px');
  });

  it('uses custom root key', () => {
    const tree = { dimension: { xs: { value: 4 } } };
    expect(extractAllSizeTokens(tree, 'dimension')).toEqual({ xs: '4px' });
  });
});
