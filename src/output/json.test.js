const { tokensToJson, flatToNested } = require('./json');

describe('flatToNested', () => {
  it('converts dot-separated keys to nested objects', () => {
    const flat = { 'color.primary': '#ff0000', 'color.secondary': '#00ff00' };
    expect(flatToNested(flat)).toEqual({
      color: { primary: '#ff0000', secondary: '#00ff00' }
    });
  });

  it('handles deeply nested keys', () => {
    const flat = { 'color.brand.blue.500': '#0000ff' };
    expect(flatToNested(flat)).toEqual({
      color: { brand: { blue: { '500': '#0000ff' } } }
    });
  });

  it('returns flat structure for keys without dots', () => {
    const flat = { primary: '#ff0000' };
    expect(flatToNested(flat)).toEqual({ primary: '#ff0000' });
  });
});

describe('tokensToJson', () => {
  it('serializes flat tokens to JSON string', () => {
    const tokens = { 'color.primary': '#ff0000' };
    const result = tokensToJson(tokens);
    expect(JSON.parse(result)).toEqual({ 'color.primary': '#ff0000' });
  });

  it('serializes nested tokens when nested=true', () => {
    const tokens = { 'color.primary': '#ff0000' };
    const result = tokensToJson(tokens, { nested: true });
    expect(JSON.parse(result)).toEqual({ color: { primary: '#ff0000' } });
  });

  it('ends with a newline', () => {
    expect(tokensToJson({})).toMatch(/\n$/);
  });

  it('throws for invalid input', () => {
    expect(() => tokensToJson(null)).toThrow('tokens must be a non-null object');
  });

  it('respects custom indent', () => {
    const tokens = { a: '1' };
    const result = tokensToJson(tokens, { indent: 4 });
    expect(result).toContain('    "a"');
  });
});
