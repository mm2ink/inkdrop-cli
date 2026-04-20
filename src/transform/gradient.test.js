const {
  gradientStopToCss,
  gradientToCss,
  extractGradientTokens,
  extractAllGradientTokens,
} = require('./gradient');

const redStop = { color: { r: 1, g: 0, b: 0, a: 1 }, position: 0 };
const blueStop = { color: { r: 0, g: 0, b: 1, a: 1 }, position: 1 };
const semiStop = { color: { r: 0, g: 1, b: 0, a: 0.5 }, position: 0.5 };

describe('gradientStopToCss', () => {
  test('renders opaque stop as rgb', () => {
    expect(gradientStopToCss(redStop)).toBe('rgb(255, 0, 0) 0%');
  });

  test('renders semi-transparent stop as rgba', () => {
    expect(gradientStopToCss(semiStop)).toBe('rgba(0, 255, 0, 0.5) 50%');
  });

  test('renders stop at 100%', () => {
    expect(gradientStopToCss(blueStop)).toBe('rgb(0, 0, 255) 100%');
  });
});

describe('gradientToCss', () => {
  const linearFill = { type: 'GRADIENT_LINEAR', gradientStops: [redStop, blueStop] };
  const radialFill = { type: 'GRADIENT_RADIAL', gradientStops: [redStop, blueStop] };
  const angularFill = { type: 'GRADIENT_ANGULAR', gradientStops: [redStop, blueStop] };

  test('converts linear gradient', () => {
    expect(gradientToCss(linearFill)).toBe(
      'linear-gradient(180deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)'
    );
  });

  test('converts radial gradient', () => {
    expect(gradientToCss(radialFill)).toBe(
      'radial-gradient(ellipse at center, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)'
    );
  });

  test('converts angular gradient', () => {
    expect(gradientToCss(angularFill)).toBe(
      'conic-gradient(rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)'
    );
  });

  test('returns null for unsupported type', () => {
    expect(gradientToCss({ type: 'SOLID', gradientStops: [redStop] })).toBeNull();
  });

  test('returns null for empty stops', () => {
    expect(gradientToCss({ type: 'GRADIENT_LINEAR', gradientStops: [] })).toBeNull();
  });

  test('returns null for null fill', () => {
    expect(gradientToCss(null)).toBeNull();
  });
});

describe('extractGradientTokens', () => {
  const node = {
    name: 'Hero Background',
    fills: [{ type: 'GRADIENT_LINEAR', gradientStops: [redStop, blueStop], visible: true }],
  };

  test('extracts gradient token from node', () => {
    const tokens = extractGradientTokens(node, 'gradients');
    expect(tokens['gradients/hero-background']).toContain('linear-gradient');
  });

  test('returns empty object when no gradient fills', () => {
    const plain = { name: 'Box', fills: [{ type: 'SOLID' }] };
    expect(extractGradientTokens(plain)).toEqual({});
  });

  test('indexes multiple gradient fills', () => {
    const multi = {
      name: 'Multi',
      fills: [
        { type: 'GRADIENT_LINEAR', gradientStops: [redStop, blueStop] },
        { type: 'GRADIENT_RADIAL', gradientStops: [semiStop, blueStop] },
      ],
    };
    const tokens = extractGradientTokens(multi);
    expect(tokens['multi-1']).toBeDefined();
    expect(tokens['multi-2']).toBeDefined();
  });
});

describe('extractAllGradientTokens', () => {
  test('recursively extracts from nested nodes', () => {
    const tree = [
      {
        name: 'Frame',
        fills: [],
        children: [
          {
            name: 'Banner',
            fills: [{ type: 'GRADIENT_LINEAR', gradientStops: [redStop, blueStop] }],
          },
        ],
      },
    ];
    const tokens = extractAllGradientTokens(tree, 'bg');
    expect(tokens['bg/banner']).toContain('linear-gradient');
  });
});
