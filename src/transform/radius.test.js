const {
  extractRadiusValue,
  radiusToCss,
  extractRadiusTokens,
  extractAllRadiusTokens,
} = require('./radius');

describe('extractRadiusValue', () => {
  it('converts a plain number to px string', () => {
    expect(extractRadiusValue(8)).toBe('8px');
  });

  it('converts a numeric string to px string', () => {
    expect(extractRadiusValue('4')).toBe('4px');
  });

  it('passes through strings with units', () => {
    expect(extractRadiusValue('0.5rem')).toBe('0.5rem');
  });

  it('maps "full" to 9999px', () => {
    expect(extractRadiusValue('full')).toBe('9999px');
  });

  it('maps "pill" to 9999px', () => {
    expect(extractRadiusValue('pill')).toBe('9999px');
  });

  it('handles zero', () => {
    expect(extractRadiusValue(0)).toBe('0px');
  });
});

describe('radiusToCss', () => {
  it('returns the css value for a numeric radius', () => {
    expect(radiusToCss(16)).toBe('16px');
  });
});

describe('extractRadiusTokens', () => {
  it('extracts cornerRadius from node documents', () => {
    const nodes = {
      '1:1': { document: { name: 'radius/sm', cornerRadius: 4 } },
      '1:2': { document: { name: 'radius/lg', cornerRadius: 16 } },
      '1:3': { document: { name: 'no-radius' } },
    };
    const result = extractRadiusTokens(nodes);
    expect(result).toEqual({
      'radius/sm': '4px',
      'radius/lg': '16px',
    });
  });

  it('falls back to rectangleCornerRadii[0]', () => {
    const nodes = {
      '2:1': { document: { name: 'radius/mixed', rectangleCornerRadii: [8, 0, 0, 0] } },
    };
    const result = extractRadiusTokens(nodes);
    expect(result['radius/mixed']).toBe('8px');
  });
});

describe('extractAllRadiusTokens', () => {
  const tree = {
    name: 'Root',
    type: 'FRAME',
    cornerRadius: 0,
    children: [
      {
        name: 'Button',
        type: 'COMPONENT',
        cornerRadius: 8,
        children: [],
      },
      {
        name: 'Card',
        type: 'RECTANGLE',
        cornerRadius: 12,
        children: [],
      },
      {
        name: 'Text',
        type: 'TEXT',
        children: [],
      },
    ],
  };

  it('collects tokens from matching node types', () => {
    const result = extractAllRadiusTokens(tree);
    expect(result['Root/Button']).toBe('8px');
    expect(result['Root/Card']).toBe('12px');
  });

  it('does not include TEXT nodes', () => {
    const result = extractAllRadiusTokens(tree);
    const keys = Object.keys(result);
    expect(keys.some((k) => k.includes('Text'))).toBe(false);
  });

  it('applies prefix when provided', () => {
    const result = extractAllRadiusTokens(tree, 'tokens');
    expect(result['tokens/Root/Button']).toBe('8px');
  });
});
