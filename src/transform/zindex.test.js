const {
  extractZIndexValue,
  zIndexToCss,
  extractZIndexTokens,
  extractAllZIndexTokens,
} = require('./zindex');

describe('extractZIndexValue', () => {
  it('returns string for integer input', () => {
    expect(extractZIndexValue(10)).toBe('10');
  });

  it('rounds float values', () => {
    expect(extractZIndexValue('99.9')).toBe('100');
  });

  it('returns "auto" for auto', () => {
    expect(extractZIndexValue('auto')).toBe('auto');
  });

  it('returns null for invalid values', () => {
    expect(extractZIndexValue('banana')).toBeNull();
    expect(extractZIndexValue(null)).toBeNull();
    expect(extractZIndexValue(undefined)).toBeNull();
  });

  it('handles negative z-index', () => {
    expect(extractZIndexValue(-1)).toBe('-1');
  });
});

describe('zIndexToCss', () => {
  it('returns value unchanged', () => {
    expect(zIndexToCss('100')).toBe('100');
    expect(zIndexToCss('auto')).toBe('auto');
  });
});

describe('extractZIndexTokens', () => {
  it('extracts tokens with $type zIndex', () => {
    const tree = {
      modal: { $type: 'zIndex', $value: 300 },
      tooltip: { $type: 'z-index', $value: 400 },
    };
    const result = extractZIndexTokens(tree);
    expect(result['modal']).toBe('300');
    expect(result['tooltip']).toBe('400');
  });

  it('extracts tokens by key name pattern', () => {
    const tree = {
      'z-index': {
        overlay: { value: 200 },
      },
    };
    const result = extractZIndexTokens(tree);
    expect(result['z-index.overlay']).toBe('200');
  });

  it('skips tokens with invalid values', () => {
    const tree = {
      bad: { $type: 'zIndex', $value: 'invalid' },
    };
    const result = extractZIndexTokens(tree);
    expect(result['bad']).toBeUndefined();
  });
});

describe('extractAllZIndexTokens', () => {
  it('returns empty object for empty input', () => {
    expect(extractAllZIndexTokens({})).toEqual({});
    expect(extractAllZIndexTokens(null)).toEqual({});
  });

  it('processes nested token tree', () => {
    const tree = {
      layer: {
        base: { $type: 'zIndex', $value: 0 },
        top: { $type: 'zIndex', $value: 9999 },
      },
    };
    const result = extractAllZIndexTokens(tree);
    expect(result['layer.base']).toBe('0');
    expect(result['layer.top']).toBe('9999');
  });
});
