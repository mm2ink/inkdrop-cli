const {
  extractElevationValue,
  elevationToCss,
  extractElevationTokens,
  extractAllElevationTokens,
} = require('./elevation');

describe('extractElevationValue', () => {
  it('returns string number for numeric input', () => {
    expect(extractElevationValue(4)).toBe('4');
    expect(extractElevationValue('8')).toBe('8');
  });

  it('returns null for non-numeric values', () => {
    expect(extractElevationValue('auto')).toBeNull();
    expect(extractElevationValue(null)).toBeNull();
    expect(extractElevationValue(undefined)).toBeNull();
  });

  it('handles float input by preserving value', () => {
    expect(extractElevationValue(2.5)).toBe('2.5');
  });
});

describe('elevationToCss', () => {
  it('rounds float values to integer', () => {
    expect(elevationToCss('2.7')).toBe('3');
    expect(elevationToCss('1.2')).toBe('1');
  });

  it('passes through integer strings', () => {
    expect(elevationToCss('4')).toBe('4');
    expect(elevationToCss('100')).toBe('100');
  });

  it('returns value as-is for non-numeric strings', () => {
    expect(elevationToCss('auto')).toBe('auto');
  });
});

describe('extractElevationTokens', () => {
  it('extracts and converts elevation tokens from flat map', () => {
    const tokens = { low: 2, medium: 8, high: 24 };
    expect(extractElevationTokens(tokens)).toEqual({
      low: '2',
      medium: '8',
      high: '24',
    });
  });

  it('skips non-numeric values', () => {
    const tokens = { low: 2, none: 'auto' };
    expect(extractElevationTokens(tokens)).toEqual({ low: '2' });
  });
});

describe('extractAllElevationTokens', () => {
  it('extracts tokens from nested tree under default key', () => {
    const tree = {
      elevation: {
        low: { value: 2 },
        high: { value: 24 },
      },
    };
    expect(extractAllElevationTokens(tree)).toEqual({
      low: '2',
      high: '24',
    });
  });

  it('handles deeply nested tokens', () => {
    const tree = {
      elevation: {
        surface: {
          card: { $value: 4 },
          modal: { $value: 16 },
        },
      },
    };
    const result = extractAllElevationTokens(tree);
    expect(result['surface-card']).toBe('4');
    expect(result['surface-modal']).toBe('16');
  });

  it('uses custom root key when provided', () => {
    const tree = {
      depth: { base: { value: 1 } },
    };
    expect(extractAllElevationTokens(tree, 'depth')).toEqual({ base: '1' });
  });
});
