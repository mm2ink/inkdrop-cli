const {
  mapTextDecoration,
  extractTextDecorationTokens,
  extractAllTextDecorationTokens,
} = require('./textDecoration');

describe('mapTextDecoration', () => {
  it('maps NONE to none', () => {
    expect(mapTextDecoration('NONE')).toBe('none');
  });

  it('maps UNDERLINE to underline', () => {
    expect(mapTextDecoration('UNDERLINE')).toBe('underline');
  });

  it('maps STRIKETHROUGH to line-through', () => {
    expect(mapTextDecoration('STRIKETHROUGH')).toBe('line-through');
  });

  it('maps LINE_THROUGH to line-through', () => {
    expect(mapTextDecoration('LINE_THROUGH')).toBe('line-through');
  });

  it('maps OVERLINE to overline', () => {
    expect(mapTextDecoration('OVERLINE')).toBe('overline');
  });

  it('handles lowercase input', () => {
    expect(mapTextDecoration('underline')).toBe('underline');
  });

  it('handles hyphenated input', () => {
    expect(mapTextDecoration('line-through')).toBe('line-through');
  });

  it('returns none for unknown value', () => {
    expect(mapTextDecoration('WAVY')).toBe('none');
  });

  it('returns none for null', () => {
    expect(mapTextDecoration(null)).toBe('none');
  });

  it('returns none for undefined', () => {
    expect(mapTextDecoration(undefined)).toBe('none');
  });
});

describe('extractTextDecorationTokens', () => {
  it('extracts tokens with decoration in name', () => {
    const tokens = {
      'typography.textDecoration.link': 'UNDERLINE',
      'typography.fontSize.base': '16px',
      'typography.strikethrough.price': 'STRIKETHROUGH',
    };
    const result = extractTextDecorationTokens(tokens);
    expect(result).toHaveProperty('typography.textDecoration.link', 'underline');
    expect(result).toHaveProperty('typography.strikethrough.price', 'line-through');
    expect(result).not.toHaveProperty('typography.fontSize.base');
  });
});

describe('extractAllTextDecorationTokens', () => {
  it('extracts from nested styles', () => {
    const styles = {
      typography: {
        textDecoration: {
          link: 'UNDERLINE',
          heading: 'NONE',
        },
      },
    };
    const result = extractAllTextDecorationTokens(styles);
    expect(result['typography.textDecoration.link']).toBe('underline');
    expect(result['typography.textDecoration.heading']).toBe('none');
  });

  it('ignores unrelated tokens', () => {
    const styles = {
      spacing: { sm: '4px' },
      color: { primary: '#000' },
    };
    const result = extractAllTextDecorationTokens(styles);
    expect(Object.keys(result)).toHaveLength(0);
  });
});
