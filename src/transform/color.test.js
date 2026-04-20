const {
  hexToHsl,
  hexWithOpacity,
  applyOpacityVariants,
  applyHslConversion,
} = require('./color');

describe('hexToHsl', () => {
  it('converts pure red', () => {
    expect(hexToHsl('#ff0000')).toEqual({ h: 0, s: 100, l: 50 });
  });

  it('converts pure blue', () => {
    expect(hexToHsl('#0000ff')).toEqual({ h: 240, s: 100, l: 50 });
  });

  it('converts white', () => {
    expect(hexToHsl('#ffffff')).toEqual({ h: 0, s: 0, l: 100 });
  });

  it('converts black', () => {
    expect(hexToHsl('#000000')).toEqual({ h: 0, s: 0, l: 0 });
  });

  it('handles 3-character hex', () => {
    const result = hexToHsl('#fff');
    expect(result).toEqual({ h: 0, s: 0, l: 100 });
  });
});

describe('hexWithOpacity', () => {
  it('produces rgba string for full opacity', () => {
    expect(hexWithOpacity('#ff6600', 1)).toBe('rgba(255, 102, 0, 1)');
  });

  it('produces rgba string for half opacity', () => {
    expect(hexWithOpacity('#000000', 0.5)).toBe('rgba(0, 0, 0, 0.5)');
  });
});

describe('applyOpacityVariants', () => {
  const tokens = { 'color-primary': '#0066cc', 'spacing-sm': '8px' };

  it('adds opacity variants for hex tokens', () => {
    const result = applyOpacityVariants(tokens, [10, 50]);
    expect(result['color-primary-10']).toBe('rgba(0, 102, 204, 0.1)');
    expect(result['color-primary-50']).toBe('rgba(0, 102, 204, 0.5)');
  });

  it('preserves original token', () => {
    const result = applyOpacityVariants(tokens, [10]);
    expect(result['color-primary']).toBe('#0066cc');
  });

  it('does not add variants for non-hex tokens', () => {
    const result = applyOpacityVariants(tokens, [10]);
    expect(result['spacing-sm']).toBe('8px');
    expect(result['spacing-sm-10']).toBeUndefined();
  });
});

describe('applyHslConversion', () => {
  it('converts hex tokens to hsl strings', () => {
    const tokens = { 'color-red': '#ff0000' };
    const result = applyHslConversion(tokens);
    expect(result['color-red']).toBe('hsl(0, 100%, 50%)');
  });

  it('leaves non-hex tokens unchanged', () => {
    const tokens = { 'spacing-md': '16px' };
    const result = applyHslConversion(tokens);
    expect(result['spacing-md']).toBe('16px');
  });
});
