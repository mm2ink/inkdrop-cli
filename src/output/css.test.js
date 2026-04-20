const { tokensToCss, formatCssVariable } = require('./css');

describe('formatCssVariable', () => {
  it('converts a dot-separated name to a CSS variable', () => {
    expect(formatCssVariable('color.primary', '#ff0000')).toBe('  --color-primary: #ff0000;');
  });

  it('lowercases the variable name', () => {
    expect(formatCssVariable('Color.Brand.Blue', '#0000ff')).toBe('  --color-brand-blue: #0000ff;');
  });

  it('replaces non-alphanumeric characters with hyphens', () => {
    expect(formatCssVariable('spacing/base', '8px')).toBe('  --spacing-base: 8px;');
  });
});

describe('tokensToCss', () => {
  it('wraps variables in :root by default', () => {
    const tokens = { 'color.primary': '#ff0000' };
    const result = tokensToCss(tokens);
    expect(result).toBe(':root {\n  --color-primary: #ff0000;\n}\n');
  });

  it('accepts a custom selector', () => {
    const tokens = { 'color.primary': '#ff0000' };
    const result = tokensToCss(tokens, { selector: '.theme' });
    expect(result).toContain('.theme {');
  });

  it('returns an empty block for no tokens', () => {
    expect(tokensToCss({})).toBe(':root {\n}\n');
  });

  it('throws for invalid input', () => {
    expect(() => tokensToCss(null)).toThrow('tokens must be a non-null object');
  });

  it('handles multiple tokens', () => {
    const tokens = { 'color.bg': '#fff', 'color.fg': '#000' };
    const result = tokensToCss(tokens);
    expect(result).toContain('--color-bg: #fff;');
    expect(result).toContain('--color-fg: #000;');
  });
});
