const {
  normalizeNames,
  filterByPrefix,
  stripPrefix,
  applyTransforms,
} = require('./index');

describe('normalizeNames', () => {
  it('lowercases token keys', () => {
    expect(normalizeNames({ 'Color/Primary': '#fff' })).toEqual({
      'colorprimary': '#fff',
    });
  });

  it('replaces spaces and slashes with dashes', () => {
    expect(normalizeNames({ 'font size/base': '16px' })).toEqual({
      'font-size-base': '16px',
    });
  });

  it('removes non-alphanumeric characters except dashes and underscores', () => {
    expect(normalizeNames({ 'color.primary!': '#000' })).toEqual({
      'colorprimary': '#000',
    });
  });
});

describe('filterByPrefix', () => {
  const tokens = {
    'color-primary': '#fff',
    'color-secondary': '#000',
    'spacing-base': '8px',
  };

  it('filters tokens by prefix', () => {
    const result = filterByPrefix(tokens, 'color-');
    expect(Object.keys(result)).toEqual(['color-primary', 'color-secondary']);
  });

  it('returns all tokens when no prefix given', () => {
    expect(filterByPrefix(tokens, '')).toEqual(tokens);
  });
});

describe('stripPrefix', () => {
  const tokens = {
    'color-primary': '#fff',
    'color-secondary': '#000',
    'spacing-base': '8px',
  };

  it('strips the prefix from matching keys', () => {
    const result = stripPrefix(tokens, 'color-');
    expect(result['primary']).toBe('#fff');
    expect(result['secondary']).toBe('#000');
    expect(result['spacing-base']).toBe('8px');
  });

  it('returns tokens unchanged when no prefix given', () => {
    expect(stripPrefix(tokens, '')).toEqual(tokens);
  });
});

describe('applyTransforms', () => {
  it('applies normalizeNames by default', () => {
    const tokens = { 'Color Primary': '#fff' };
    const result = applyTransforms(tokens, {});
    expect(result['color-primary']).toBe('#fff');
  });

  it('skips normalizeNames when disabled', () => {
    const tokens = { 'Color Primary': '#fff' };
    const result = applyTransforms(tokens, { normalizeNames: false });
    expect(result['Color Primary']).toBe('#fff');
  });

  it('applies prefix filter', () => {
    const tokens = { 'color-a': '1', 'spacing-b': '2' };
    const result = applyTransforms(tokens, { prefix: 'color-' });
    expect(result['color-a']).toBe('1');
    expect(result['spacing-b']).toBeUndefined();
  });
});
