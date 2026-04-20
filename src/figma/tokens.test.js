const { extractTokens, extractColorTokens, rgbaToHex } = require('./tokens');

describe('rgbaToHex', () => {
  it('converts full-opacity color to 6-digit hex', () => {
    expect(rgbaToHex(1, 0, 0)).toBe('#ff0000');
    expect(rgbaToHex(0, 1, 0)).toBe('#00ff00');
    expect(rgbaToHex(0, 0, 1)).toBe('#0000ff');
  });

  it('appends alpha channel when opacity < 1', () => {
    const result = rgbaToHex(1, 0, 0, 0.5);
    expect(result).toBe('#ff000080');
  });

  it('handles zero values', () => {
    expect(rgbaToHex(0, 0, 0, 1)).toBe('#000000');
  });
});

describe('extractColorTokens', () => {
  const styles = {
    'S:abc123': { name: 'Brand/Primary' },
    'S:def456': { name: 'Brand/Secondary' },
  };

  it('extracts color from a node with solid fill and style reference', () => {
    const node = {
      fills: [{ type: 'SOLID', color: { r: 0.2, g: 0.4, b: 0.8, a: 1 } }],
      styles: { fill: 'S:abc123' },
    };
    const result = extractColorTokens(node, styles);
    expect(result['brand-primary']).toBeDefined();
    expect(result['brand-primary'].type).toBe('color');
    expect(result['brand-primary'].value).toBe('#3366cc');
  });

  it('recurses into children nodes', () => {
    const node = {
      children: [
        {
          fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 1 } }],
          styles: { fill: 'S:def456' },
        },
      ],
    };
    const result = extractColorTokens(node, styles);
    expect(result['brand-secondary']).toBeDefined();
  });

  it('ignores nodes without fill styles', () => {
    const node = { fills: [], children: [] };
    const result = extractColorTokens(node, styles);
    expect(Object.keys(result).length).toBe(0);
  });
});

describe('extractTokens', () => {
  it('throws if document is missing', () => {
    expect(() => extractTokens({ styles: {} })).toThrow('Invalid Figma file');
  });

  it('returns colors grouped under tokens', () => {
    const figmaFile = {
      styles: { 'S:aaa': { name: 'Neutral/White' } },
      document: {
        fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 1 } }],
        styles: { fill: 'S:aaa' },
      },
    };
    const result = extractTokens(figmaFile);
    expect(result).toHaveProperty('colors');
    expect(result.colors['neutral-white'].value).toBe('#ffffff');
  });
});
