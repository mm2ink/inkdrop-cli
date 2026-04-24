const {
  extractGridValue,
  gridToCss,
  extractGridTokens,
  extractAllGridTokens,
} = require('./grid');

describe('extractGridValue', () => {
  it('appends px to plain numbers', () => {
    expect(extractGridValue(16)).toBe('16px');
  });

  it('appends px to numeric strings', () => {
    expect(extractGridValue('24')).toBe('24px');
  });

  it('returns string values unchanged', () => {
    expect(extractGridValue('1fr')).toBe('1fr');
    expect(extractGridValue('auto')).toBe('auto');
  });
});

describe('gridToCss', () => {
  it('formats column-based tokens as repeat()', () => {
    expect(gridToCss({ columns: 12 })).toBe('repeat(12, 1fr)');
  });

  it('formats value-based tokens', () => {
    expect(gridToCss({ value: 8 })).toBe('8px');
    expect(gridToCss({ value: '1fr' })).toBe('1fr');
  });

  it('falls back to string conversion', () => {
    expect(gridToCss('100%')).toBe('100%');
  });
});

describe('extractGridTokens', () => {
  const tokens = {
    grid: {
      base: { value: 8 },
      desktop: { columns: 12 },
      mobile: { columns: 4 },
    },
  };

  it('extracts tokens under the given prefix', () => {
    const result = extractGridTokens(tokens, 'grid');
    expect(result['grid.base']).toBe('8px');
    expect(result['grid.desktop']).toBe('repeat(12, 1fr)');
    expect(result['grid.mobile']).toBe('repeat(4, 1fr)');
  });

  it('returns empty object when prefix not found', () => {
    expect(extractGridTokens(tokens, 'layout')).toEqual({});
  });
});

describe('extractAllGridTokens', () => {
  const tokens = {
    grid: {
      base: { value: 8 },
    },
    gutter: {
      sm: { value: 16 },
      lg: { value: 32 },
    },
    layout: {
      maxWidth: { value: '1280px' },
    },
  };

  it('collects tokens from all known grid prefixes', () => {
    const result = extractAllGridTokens(tokens);
    expect(result['grid.base']).toBe('8px');
    expect(result['gutter.sm']).toBe('16px');
    expect(result['gutter.lg']).toBe('32px');
    expect(result['layout.maxWidth']).toBe('1280px');
  });

  it('returns empty object when no matching prefixes exist', () => {
    expect(extractAllGridTokens({ colors: { red: { value: '#f00' } } })).toEqual({});
  });
});
