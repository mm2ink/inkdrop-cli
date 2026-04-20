const { extractBorderValue, extractAllBorderTokens } = require('./border');

describe('extractBorderValue', () => {
  const solidStroke = {
    strokes: [
      { type: 'SOLID', visible: true, color: { r: 0.2, g: 0.4, b: 0.6, a: 1 } },
    ],
    strokeWeight: 2,
    strokeAlign: 'CENTER',
  };

  it('extracts border value from a node with solid stroke', () => {
    const result = extractBorderValue(solidStroke);
    expect(result).not.toBeNull();
    expect(result.width).toBe('2px');
    expect(result.style).toBe('solid');
    expect(result.align).toBe('center');
    expect(result.css).toMatch(/^2px solid #/);
  });

  it('returns null when no strokes present', () => {
    expect(extractBorderValue({ strokes: [] })).toBeNull();
    expect(extractBorderValue({})).toBeNull();
  });

  it('returns null when stroke is not SOLID', () => {
    const node = {
      strokes: [{ type: 'GRADIENT_LINEAR', visible: true }],
      strokeWeight: 1,
    };
    expect(extractBorderValue(node)).toBeNull();
  });

  it('skips invisible strokes', () => {
    const node = {
      strokes: [{ type: 'SOLID', visible: false, color: { r: 0, g: 0, b: 0, a: 1 } }],
      strokeWeight: 1,
    };
    expect(extractBorderValue(node)).toBeNull();
  });

  it('defaults strokeWeight to 1 when not specified', () => {
    const node = {
      strokes: [{ type: 'SOLID', visible: true, color: { r: 0, g: 0, b: 0, a: 1 } }],
      strokeAlign: 'INSIDE',
    };
    const result = extractBorderValue(node);
    expect(result.width).toBe('1px');
    expect(result.align).toBe('inside');
  });
});

describe('extractAllBorderTokens', () => {
  it('returns tokens for nodes with valid strokes', () => {
    const nodes = [
      {
        name: 'border/default',
        node: {
          strokes: [{ type: 'SOLID', visible: true, color: { r: 0, g: 0, b: 0, a: 1 } }],
          strokeWeight: 1,
          strokeAlign: 'CENTER',
        },
      },
      { name: 'border/none', node: { strokes: [] } },
    ];
    const tokens = extractAllBorderTokens(nodes);
    expect(tokens).toHaveLength(1);
    expect(tokens[0].name).toBe('border/default');
    expect(tokens[0].type).toBe('border');
  });
});
