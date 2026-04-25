const {
  mapMotionEasing,
  formatMotionDuration,
  motionToCss,
  extractMotionTokens,
  extractAllMotionTokens,
} = require('./motion');

describe('mapMotionEasing', () => {
  it('maps known easing types', () => {
    expect(mapMotionEasing('LINEAR')).toBe('linear');
    expect(mapMotionEasing('EASE_IN')).toBe('ease-in');
    expect(mapMotionEasing('EASE_OUT')).toBe('ease-out');
    expect(mapMotionEasing('EASE_IN_OUT')).toBe('ease-in-out');
  });

  it('maps cubic-bezier back easings', () => {
    expect(mapMotionEasing('EASE_OUT_BACK')).toBe('cubic-bezier(0.34, 1.56, 0.64, 1)');
  });

  it('returns ease for unknown types', () => {
    expect(mapMotionEasing('UNKNOWN')).toBe('ease');
    expect(mapMotionEasing(undefined)).toBe('ease');
  });
});

describe('formatMotionDuration', () => {
  it('formats milliseconds correctly', () => {
    expect(formatMotionDuration(200)).toBe('200ms');
    expect(formatMotionDuration(333.7)).toBe('334ms');
    expect(formatMotionDuration(0)).toBe('0ms');
  });

  it('returns 0ms for invalid values', () => {
    expect(formatMotionDuration(NaN)).toBe('0ms');
    expect(formatMotionDuration(undefined)).toBe('0ms');
  });
});

describe('motionToCss', () => {
  it('builds a full transition string', () => {
    const token = { property: 'opacity', duration: 300, easing: 'EASE_IN_OUT', delay: 50 };
    expect(motionToCss(token)).toBe('opacity 300ms ease-in-out 50ms');
  });

  it('defaults property to all and delay to 0ms', () => {
    const token = { duration: 150, easing: 'LINEAR' };
    expect(motionToCss(token)).toBe('all 150ms linear 0ms');
  });
});

describe('extractMotionTokens', () => {
  it('extracts tokens with type motion or transition', () => {
    const tokens = {
      'anim-fade': { type: 'motion', value: { duration: 200, easing: 'EASE_OUT', property: 'opacity' } },
      'anim-slide': { type: 'transition', value: { duration: 400, easing: 'EASE_IN', property: 'transform' } },
      'color-primary': { type: 'color', value: '#fff' },
    };
    const result = extractMotionTokens(tokens);
    expect(result['anim-fade']).toBe('opacity 200ms ease-out 0ms');
    expect(result['anim-slide']).toBe('transform 400ms ease-in 0ms');
    expect(result['color-primary']).toBeUndefined();
  });
});

describe('extractAllMotionTokens', () => {
  it('recursively extracts motion tokens from nested objects', () => {
    const node = {
      fast: { duration: 100, easing: 'LINEAR', property: 'all' },
      slow: { duration: 600, easing: 'EASE_IN_OUT' },
      nested: {
        bounce: { duration: 400, easing: 'EASE_OUT_BACK', property: 'transform' },
      },
    };
    const result = extractAllMotionTokens(node);
    expect(result['fast']).toBe('all 100ms linear 0ms');
    expect(result['slow']).toBe('all 600ms ease-in-out 0ms');
    expect(result['nested-bounce']).toBe('transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1) 0ms');
  });

  it('returns empty object for empty input', () => {
    expect(extractAllMotionTokens({})).toEqual({});
  });
});
