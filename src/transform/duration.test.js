const {
  parseDurationValue,
  durationToCss,
  extractDurationTokens,
  extractAllDurationTokens,
} = require('./duration');

describe('parseDurationValue', () => {
  it('converts a plain number to ms string', () => {
    expect(parseDurationValue(200)).toBe('200ms');
  });

  it('passes through a valid ms string', () => {
    expect(parseDurationValue('300ms')).toBe('300ms');
  });

  it('converts seconds string to ms', () => {
    expect(parseDurationValue('0.3s')).toBe('300ms');
  });

  it('treats a numeric string without unit as ms', () => {
    expect(parseDurationValue('150')).toBe('150ms');
  });

  it('returns null for unsupported values', () => {
    expect(parseDurationValue(null)).toBeNull();
    expect(parseDurationValue(undefined)).toBeNull();
  });
});

describe('durationToCss', () => {
  it('formats a number value', () => {
    expect(durationToCss(100)).toBe('100ms');
  });

  it('formats a seconds value', () => {
    expect(durationToCss('1s')).toBe('1000ms');
  });

  it('falls back to string for unrecognized values', () => {
    expect(durationToCss('fast')).toBe('fast');
  });
});

describe('extractDurationTokens', () => {
  it('extracts tokens matching duration/delay/timing keys', () => {
    const tokens = {
      'animation-duration-fast': 100,
      'transition-delay-base': '200ms',
      'color-primary': '#fff',
      'timing-slow': '0.5s',
    };
    const result = extractDurationTokens(tokens);
    expect(result).toEqual({
      'animation-duration-fast': '100ms',
      'transition-delay-base': '200ms',
      'timing-slow': '500ms',
    });
    expect(result['color-primary']).toBeUndefined();
  });
});

describe('extractAllDurationTokens', () => {
  it('extracts nested duration tokens by $type', () => {
    const tree = {
      animation: {
        fast: { $type: 'duration', $value: 100 },
        slow: { $type: 'duration', $value: '0.4s' },
      },
      color: {
        primary: { $type: 'color', $value: '#000' },
      },
    };
    const result = extractAllDurationTokens(tree);
    expect(result['animation-fast']).toBe('100ms');
    expect(result['animation-slow']).toBe('400ms');
    expect(result['color-primary']).toBeUndefined();
  });
});
