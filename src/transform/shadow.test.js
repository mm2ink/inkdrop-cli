const {
  shadowToCss,
  extractShadowTokens,
  extractAllShadowTokens,
} = require('./shadow');

describe('shadowToCss', () => {
  it('converts a Figma DROP_SHADOW to a CSS string', () => {
    const shadow = {
      type: 'DROP_SHADOW',
      offset: { x: 2, y: 4 },
      radius: 8,
      spread: 0,
      color: { r: 0, g: 0, b: 0, a: 0.25 },
    };
    expect(shadowToCss(shadow)).toBe('2px 4px 8px 0px rgba(0, 0, 0, 0.25)');
  });

  it('returns null for non-DROP_SHADOW effects', () => {
    expect(shadowToCss({ type: 'INNER_SHADOW' })).toBeNull();
  });

  it('returns null for null input', () => {
    expect(shadowToCss(null)).toBeNull();
  });

  it('handles missing offset and color gracefully', () => {
    const shadow = { type: 'DROP_SHADOW', radius: 4 };
    expect(shadowToCss(shadow)).toBe('0px 0px 4px 0px rgba(0, 0, 0, 1)');
  });
});

describe('extractShadowTokens', () => {
  it('extracts a shadow token from a node with effects', () => {
    const node = {
      effects: [
        {
          type: 'DROP_SHADOW',
          visible: true,
          offset: { x: 0, y: 2 },
          radius: 6,
          spread: 0,
          color: { r: 0, g: 0, b: 0, a: 0.15 },
        },
      ],
    };
    const tokens = extractShadowTokens(node, 'shadow/card');
    expect(tokens).toHaveLength(1);
    expect(tokens[0].name).toBe('shadow/card');
    expect(tokens[0].type).toBe('shadow');
    expect(tokens[0].value).toContain('rgba(0, 0, 0, 0.15)');
  });

  it('returns empty array for nodes without effects', () => {
    expect(extractShadowTokens({ effects: [] }, 'shadow/none')).toEqual([]);
    expect(extractShadowTokens({}, 'shadow/none')).toEqual([]);
  });

  it('skips invisible effects', () => {
    const node = {
      effects: [
        { type: 'DROP_SHADOW', visible: false, offset: { x: 0, y: 2 }, radius: 4, spread: 0, color: {} },
      ],
    };
    expect(extractShadowTokens(node, 'shadow/hidden')).toEqual([]);
  });
});

describe('extractAllShadowTokens', () => {
  it('extracts tokens from multiple nodes', () => {
    const nodes = [
      {
        name: 'shadow/sm',
        node: {
          effects: [
            { type: 'DROP_SHADOW', visible: true, offset: { x: 0, y: 1 }, radius: 2, spread: 0, color: { r: 0, g: 0, b: 0, a: 0.1 } },
          ],
        },
      },
      { name: 'shadow/none', node: { effects: [] } },
    ];
    const tokens = extractAllShadowTokens(nodes);
    expect(tokens).toHaveLength(1);
    expect(tokens[0].name).toBe('shadow/sm');
  });
});
