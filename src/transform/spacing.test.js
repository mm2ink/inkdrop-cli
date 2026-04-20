const { extractSpacingValue, spacingToCss, extractAllSpacingTokens } = require('./spacing');

describe('extractSpacingValue', () => {
  it('returns null for non-FRAME nodes', () => {
    expect(extractSpacingValue({ type: 'TEXT', name: 'label' })).toBeNull();
    expect(extractSpacingValue(null)).toBeNull();
  });

  it('extracts padding and itemSpacing from a FRAME node', () => {
    const node = {
      type: 'FRAME',
      name: 'Card',
      paddingTop: 16,
      paddingRight: 24,
      paddingBottom: 16,
      paddingLeft: 24,
      itemSpacing: 8,
    };
    expect(extractSpacingValue(node)).toEqual({
      paddingTop: 16,
      paddingRight: 24,
      paddingBottom: 16,
      paddingLeft: 24,
      itemSpacing: 8,
    });
  });

  it('defaults missing padding values to 0', () => {
    const node = { type: 'FRAME', name: 'Box' };
    const result = extractSpacingValue(node);
    expect(result.paddingTop).toBe(0);
    expect(result.itemSpacing).toBe(0);
  });
});

describe('spacingToCss', () => {
  it('returns single value when all sides are equal', () => {
    const spacing = { paddingTop: 8, paddingRight: 8, paddingBottom: 8, paddingLeft: 8 };
    expect(spacingToCss(spacing)).toBe('8px');
  });

  it('returns two values when vertical and horizontal pairs match', () => {
    const spacing = { paddingTop: 8, paddingRight: 16, paddingBottom: 8, paddingLeft: 16 };
    expect(spacingToCss(spacing)).toBe('8px 16px');
  });

  it('returns four values when all sides differ', () => {
    const spacing = { paddingTop: 4, paddingRight: 8, paddingBottom: 12, paddingLeft: 16 };
    expect(spacingToCss(spacing)).toBe('4px 8px 12px 16px');
  });

  it('converts to rem when useRem is true', () => {
    const spacing = { paddingTop: 16, paddingRight: 16, paddingBottom: 16, paddingLeft: 16 };
    expect(spacingToCss(spacing, true)).toBe('1rem');
  });
});

describe('extractAllSpacingTokens', () => {
  const nodes = [
    {
      type: 'FRAME',
      name: 'Button',
      paddingTop: 8,
      paddingRight: 16,
      paddingBottom: 8,
      paddingLeft: 16,
      itemSpacing: 4,
    },
    {
      type: 'TEXT',
      name: 'Label',
    },
  ];

  it('extracts tokens only from FRAME nodes', () => {
    const tokens = extractAllSpacingTokens(nodes);
    expect(Object.keys(tokens)).toContain('spacing.button.padding');
    expect(Object.keys(tokens)).not.toContain('spacing.label.padding');
  });

  it('includes gap token when itemSpacing > 0', () => {
    const tokens = extractAllSpacingTokens(nodes);
    expect(tokens['spacing.button.gap']).toBe('4px');
  });

  it('normalizes node names to kebab-case', () => {
    const n = [{ type: 'FRAME', name: 'My Card Component', paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0, itemSpacing: 0 }];
    const tokens = extractAllSpacingTokens(n);
    expect(Object.keys(tokens)).toContain('spacing.my-card-component.padding');
  });
});
