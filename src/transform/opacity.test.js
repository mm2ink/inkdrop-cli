const {
  clampOpacity,
  opacityToCss,
  extractOpacityTokens,
  extractAllOpacityTokens,
} = require('./opacity');

describe('clampOpacity', () => {
  it('returns value unchanged when within range', () => {
    expect(clampOpacity(0.5)).toBe(0.5);
  });

  it('clamps values above 1 to 1', () => {
    expect(clampOpacity(1.5)).toBe(1);
  });

  it('clamps negative values to 0', () => {
    expect(clampOpacity(-0.2)).toBe(0);
  });
});

describe('opacityToCss', () => {
  it('formats full opacity as "1"', () => {
    expect(opacityToCss(1)).toBe('1');
  });

  it('formats zero opacity as "0"', () => {
    expect(opacityToCss(0)).toBe('0');
  });

  it('formats mid opacity correctly', () => {
    expect(opacityToCss(0.5)).toBe('0.5');
  });

  it('trims unnecessary trailing zeros', () => {
    expect(opacityToCss(0.1000)).toBe('0.1');
  });

  it('clamps out-of-range values', () => {
    expect(opacityToCss(2)).toBe('1');
    expect(opacityToCss(-1)).toBe('0');
  });
});

describe('extractOpacityTokens', () => {
  const styles = {
    abc: { styleType: 'FILL', name: 'Overlay / Heavy', node_id: 'n1' },
    def: { styleType: 'TEXT', name: 'Ignored', node_id: 'n2' },
  };
  const nodes = {
    n1: { opacity: 0.8 },
    n2: { opacity: 0.5 },
  };

  it('extracts FILL styles with opacity', () => {
    const tokens = extractOpacityTokens(styles, nodes);
    expect(tokens['overlay/heavy']).toBe('0.8');
  });

  it('ignores non-FILL styles', () => {
    const tokens = extractOpacityTokens(styles, nodes);
    expect(tokens['ignored']).toBeUndefined();
  });

  it('skips nodes without opacity property', () => {
    const tokens = extractOpacityTokens(
      { x: { styleType: 'FILL', name: 'Ghost', node_id: 'nx' } },
      { nx: { fills: [] } }
    );
    expect(Object.keys(tokens)).toHaveLength(0);
  });
});

describe('extractAllOpacityTokens', () => {
  const doc = {
    type: 'DOCUMENT',
    children: [
      {
        type: 'FRAME',
        name: 'Overlay / Light',
        opacity: 0.3,
        children: [
          { type: 'RECTANGLE', name: 'Overlay / Dark', opacity: 0.9, children: [] },
        ],
      },
      { type: 'TEXT', name: 'Skip Me', opacity: 0.5, children: [] },
    ],
  };

  it('extracts opacity from FRAME and RECTANGLE nodes', () => {
    const tokens = extractAllOpacityTokens(doc);
    expect(tokens['overlay/light']).toBe('0.3');
    expect(tokens['overlay/dark']).toBe('0.9');
  });

  it('ignores TEXT nodes', () => {
    const tokens = extractAllOpacityTokens(doc);
    expect(tokens['skip-me']).toBeUndefined();
  });
});
