const {
  extractBreakpointValue,
  breakpointToCss,
  extractBreakpointTokens,
  extractAllBreakpointTokens,
} = require('./breakpoint');

describe('extractBreakpointValue', () => {
  it('converts a number to px string', () => {
    expect(extractBreakpointValue(768)).toBe('768px');
  });

  it('converts a float number to px string', () => {
    expect(extractBreakpointValue(1440.5)).toBe('1440.5px');
  });

  it('accepts a string with px unit', () => {
    expect(extractBreakpointValue('1024px')).toBe('1024px');
  });

  it('accepts a string with rem unit', () => {
    expect(extractBreakpointValue('48rem')).toBe('48rem');
  });

  it('defaults to px when no unit provided in string', () => {
    expect(extractBreakpointValue('320')).toBe('320px');
  });

  it('returns null for invalid string', () => {
    expect(extractBreakpointValue('large')).toBeNull();
  });

  it('returns null for null input', () => {
    expect(extractBreakpointValue(null)).toBeNull();
  });

  it('returns null for object input', () => {
    expect(extractBreakpointValue({})).toBeNull();
  });
});

describe('breakpointToCss', () => {
  it('returns the value unchanged', () => {
    expect(breakpointToCss('768px')).toBe('768px');
  });
});

describe('extractBreakpointTokens', () => {
  it('extracts flat breakpoint tokens', () => {
    const node = { sm: 640, md: 768, lg: 1024 };
    expect(extractBreakpointTokens(node)).toEqual({
      sm: '640px',
      md: '768px',
      lg: '1024px',
    });
  });

  it('extracts nested breakpoint tokens', () => {
    const node = { screen: { mobile: 375, tablet: 768 } };
    expect(extractBreakpointTokens(node)).toEqual({
      'screen.mobile': '375px',
      'screen.tablet': '768px',
    });
  });

  it('extracts tokens with value wrapper', () => {
    const node = { xl: { value: 1280 } };
    expect(extractBreakpointTokens(node)).toEqual({ xl: '1280px' });
  });

  it('skips invalid values', () => {
    const node = { sm: 'small', md: 768 };
    expect(extractBreakpointTokens(node)).toEqual({ md: '768px' });
  });

  it('returns empty object for empty node', () => {
    expect(extractBreakpointTokens({})).toEqual({});
  });
});

describe('extractAllBreakpointTokens', () => {
  it('extracts tokens from the default breakpoints key', () => {
    const tokens = { breakpoints: { sm: 640, lg: 1024 } };
    expect(extractAllBreakpointTokens(tokens)).toEqual({
      sm: '640px',
      lg: '1024px',
    });
  });

  it('extracts tokens from a custom group key', () => {
    const tokens = { viewport: { xs: 480 } };
    expect(extractAllBreakpointTokens(tokens, 'viewport')).toEqual({
      xs: '480px',
    });
  });

  it('returns empty object when group key is missing', () => {
    expect(extractAllBreakpointTokens({ colors: {} })).toEqual({});
  });

  it('returns empty object for null input', () => {
    expect(extractAllBreakpointTokens(null)).toEqual({});
  });
});
