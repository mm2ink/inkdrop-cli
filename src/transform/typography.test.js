const { extractTypographyTokens, mapTextCase, extractAllTypographyTokens } = require('./typography');

describe('mapTextCase', () => {
  it('maps UPPER to uppercase', () => expect(mapTextCase('UPPER')).toBe('uppercase'));
  it('maps LOWER to lowercase', () => expect(mapTextCase('LOWER')).toBe('lowercase'));
  it('maps TITLE to capitalize', () => expect(mapTextCase('TITLE')).toBe('capitalize'));
  it('maps ORIGINAL to none', () => expect(mapTextCase('ORIGINAL')).toBe('none'));
  it('returns none for unknown', () => expect(mapTextCase('WEIRD')).toBe('none'));
});

describe('extractTypographyTokens', () => {
  const style = {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: 16,
    lineHeightPx: 24,
    letterSpacing: 0.5,
    textCase: 'UPPER',
    textDecoration: 'UNDERLINE',
  };

  it('extracts all fields from a style object', () => {
    const tokens = extractTypographyTokens('heading/h1', style);
    expect(tokens['heading/h1.font-family']).toBe('Inter');
    expect(tokens['heading/h1.font-weight']).toBe(600);
    expect(tokens['heading/h1.font-size']).toBe('16px');
    expect(tokens['heading/h1.line-height']).toBe('24px');
    expect(tokens['heading/h1.letter-spacing']).toBe('0.5px');
    expect(tokens['heading/h1.text-transform']).toBe('uppercase');
    expect(tokens['heading/h1.text-decoration']).toBe('underline');
  });

  it('skips missing fields', () => {
    const tokens = extractTypographyTokens('body', { fontFamily: 'Roboto' });
    expect(Object.keys(tokens)).toEqual(['body.font-family']);
  });

  it('normalizes spaces in name', () => {
    const tokens = extractTypographyTokens('Body Large', { fontSize: 14 });
    expect(tokens['body-large.font-size']).toBe('14px');
  });
});

describe('extractAllTypographyTokens', () => {
  const stylesMap = {
    '1:1': { styleType: 'TEXT', name: 'Heading/H1', style: { fontSize: 32, fontWeight: 700 } },
    '1:2': { styleType: 'TEXT', name: 'Body/Base', style: { fontSize: 16 } },
    '1:3': { styleType: 'FILL', name: 'Primary', style: { color: '#000' } },
  };

  it('extracts only TEXT style entries', () => {
    const tokens = extractAllTypographyTokens(stylesMap);
    expect(tokens['heading.h1.font-size']).toBe('32px');
    expect(tokens['body.base.font-size']).toBe('16px');
    expect(Object.keys(tokens).some(k => k.startsWith('primary'))).toBe(false);
  });

  it('returns empty object for empty map', () => {
    expect(extractAllTypographyTokens({})).toEqual({});
  });
});
