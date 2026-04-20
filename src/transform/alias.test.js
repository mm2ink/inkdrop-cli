const { isAlias, parseAlias, resolveAlias, resolveAliases } = require('./alias');

describe('isAlias', () => {
  it('returns true for valid alias syntax', () => {
    expect(isAlias('{color.primary}')).toBe(true);
    expect(isAlias('{spacing.md}')).toBe(true);
  });

  it('returns false for non-alias values', () => {
    expect(isAlias('#ff0000')).toBe(false);
    expect(isAlias('16px')).toBe(false);
    expect(isAlias('{unclosed')).toBe(false);
    expect(isAlias('')).toBe(false);
    expect(isAlias(42)).toBe(false);
  });
});

describe('parseAlias', () => {
  it('extracts the key from an alias string', () => {
    expect(parseAlias('{color.primary}')).toBe('color.primary');
    expect(parseAlias('{spacing.md}')).toBe('spacing.md');
  });
});

describe('resolveAlias', () => {
  const tokens = {
    'color.red': '#ff0000',
    'color.primary': '{color.red}',
  };

  it('resolves a direct alias', () => {
    expect(resolveAlias('color.primary', tokens)).toBe('#ff0000');
  });

  it('resolves a chained alias', () => {
    const chained = { ...tokens, 'color.brand': '{color.primary}' };
    expect(resolveAlias('color.brand', chained)).toBe('#ff0000');
  });

  it('throws if alias target does not exist', () => {
    expect(() => resolveAlias('color.missing', tokens)).toThrow('Alias target not found');
  });

  it('throws on circular aliases', () => {
    const circular = {
      'a': '{b}',
      'b': '{a}',
    };
    expect(() => resolveAlias('a', circular)).toThrow('Circular or deeply nested alias');
  });
});

describe('resolveAliases', () => {
  it('resolves all aliases in a token map', () => {
    const tokens = {
      'color.red': '#ff0000',
      'color.primary': '{color.red}',
      'font.size.base': '16px',
    };
    const result = resolveAliases(tokens);
    expect(result['color.primary']).toBe('#ff0000');
    expect(result['color.red']).toBe('#ff0000');
    expect(result['font.size.base']).toBe('16px');
  });

  it('preserves unresolvable aliases with a warning', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const tokens = { 'color.primary': '{color.missing}' };
    const result = resolveAliases(tokens);
    expect(result['color.primary']).toBe('{color.missing}');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
