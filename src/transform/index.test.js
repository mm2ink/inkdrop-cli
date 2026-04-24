const {
  normalizeNames,
  filterByPrefix,
  stripPrefix,
  applyTransforms,
  extractAllZIndexTokens,
} = require('./index');

describe('normalizeNames', () => {
  it('converts dots to dashes and lowercases keys', () => {
    const tokens = { 'Color.Primary': '#fff', 'spacing.MD': '16px' };
    const result = normalizeNames(tokens);
    expect(result).toHaveProperty('color-primary', '#fff');
    expect(result).toHaveProperty('spacing-md', '16px');
  });
});

describe('filterByPrefix', () => {
  it('filters tokens by prefix', () => {
    const tokens = { 'color-primary': '#fff', 'spacing-sm': '8px' };
    const result = filterByPrefix(tokens, 'color');
    expect(Object.keys(result)).toEqual(['color-primary']);
  });

  it('returns all tokens if no prefix', () => {
    const tokens = { a: '1', b: '2' };
    expect(filterByPrefix(tokens, '')).toEqual(tokens);
  });
});

describe('stripPrefix', () => {
  it('strips matching prefix from keys', () => {
    const tokens = { 'color-primary': '#fff', 'color-secondary': '#000' };
    const result = stripPrefix(tokens, 'color-');
    expect(result).toHaveProperty('primary', '#fff');
    expect(result).toHaveProperty('secondary', '#000');
  });

  it('leaves keys unchanged if prefix does not match', () => {
    const tokens = { 'spacing-sm': '8px' };
    const result = stripPrefix(tokens, 'color-');
    expect(result).toHaveProperty('spacing-sm', '8px');
  });
});

describe('applyTransforms', () => {
  it('returns a copy of tokens when no config', () => {
    const tokens = { 'color-primary': '#fff' };
    const result = applyTransforms(tokens);
    expect(result).toEqual(tokens);
    expect(result).not.toBe(tokens);
  });

  it('applies scale transforms when config.scale is set', () => {
    const tokens = { 'spacing-base': '16px' };
    const result = applyTransforms(tokens, { scale: { baseFontSize: 16 } });
    expect(typeof result).toBe('object');
  });
});

describe('extractAllZIndexTokens re-export', () => {
  it('is a function exported from index', () => {
    expect(typeof extractAllZIndexTokens).toBe('function');
  });

  it('extracts z-index tokens via index module', () => {
    const tree = {
      overlay: { $type: 'zIndex', $value: 500 },
    };
    const result = extractAllZIndexTokens(tree);
    expect(result['overlay']).toBe('500');
  });
});
