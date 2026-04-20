const { pxToRem, scaleValue, applyScaleTransforms } = require('./scale');

describe('pxToRem', () => {
  it('converts px string to rem using default base 16', () => {
    expect(pxToRem('16px')).toBe('1rem');
    expect(pxToRem('8px')).toBe('0.5rem');
    expect(pxToRem('24px')).toBe('1.5rem');
  });

  it('uses a custom base', () => {
    expect(pxToRem('10px', 10)).toBe('1rem');
  });

  it('returns non-numeric value unchanged', () => {
    expect(pxToRem('#ffffff')).toBe('#ffffff');
  });

  it('handles numeric input', () => {
    expect(pxToRem(32)).toBe('2rem');
  });
});

describe('scaleValue', () => {
  it('multiplies a numeric value', () => {
    expect(scaleValue(10, 2)).toBe(20);
  });

  it('parses string numbers', () => {
    expect(scaleValue('4', 1.5)).toBe(6);
  });

  it('returns non-numeric value unchanged', () => {
    expect(scaleValue('auto', 2)).toBe('auto');
  });

  it('rounds to 4 decimal places for floats', () => {
    expect(scaleValue(1, 1.33333)).toBe(1.3333);
  });
});

describe('applyScaleTransforms', () => {
  const tokens = {
    'spacing.sm': '8px',
    'spacing.md': '16px',
    'opacity.half': '0.5',
    'color.primary': '#ff0000',
  };

  it('remifies px values when remify is true', () => {
    const result = applyScaleTransforms(tokens, { remify: true });
    expect(result['spacing.sm']).toBe('0.5rem');
    expect(result['spacing.md']).toBe('1rem');
    expect(result['color.primary']).toBe('#ff0000');
  });

  it('applies scaleFactor to numeric values', () => {
    const result = applyScaleTransforms({ 'size.base': '10', 'label': 'auto' }, { scaleFactor: 2 });
    expect(result['size.base']).toBe(20);
    expect(result['label']).toBe('auto');
  });

  it('applies both scaleFactor and remify in order', () => {
    const result = applyScaleTransforms({ 'space': '8px' }, { scaleFactor: 2, remify: true });
    // scaleValue('8px', 2) -> NaN -> '8px', then pxToRem('8px') -> '0.5rem'
    expect(result['space']).toBe('0.5rem');
  });

  it('returns unchanged tokens when no options given', () => {
    const result = applyScaleTransforms(tokens);
    expect(result).toEqual(tokens);
  });
});
