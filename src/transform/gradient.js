/**
 * Gradient token extraction and transformation utilities.
 */

/**
 * Convert a Figma gradient stop to a CSS color stop.
 * @param {Object} stop - Figma gradient stop { color, position }
 * @returns {string} CSS color stop string
 */
function gradientStopToCss(stop) {
  const { r, g, b, a = 1 } = stop.color;
  const toInt = (v) => Math.round(v * 255);
  const pct = Math.round(stop.position * 100);
  const alpha = parseFloat(a.toFixed(3));
  if (alpha < 1) {
    return `rgba(${toInt(r)}, ${toInt(g)}, ${toInt(b)}, ${alpha}) ${pct}%`;
  }
  return `rgb(${toInt(r)}, ${toInt(g)}, ${toInt(b)}) ${pct}%`;
}

/**
 * Convert a Figma gradient fill to a CSS gradient string.
 * @param {Object} fill - Figma fill object of type GRADIENT_LINEAR or GRADIENT_RADIAL
 * @returns {string|null} CSS gradient value or null if unsupported
 */
function gradientToCss(fill) {
  if (!fill || !fill.gradientStops || fill.gradientStops.length === 0) {
    return null;
  }

  const stops = fill.gradientStops.map(gradientStopToCss).join(', ');

  if (fill.type === 'GRADIENT_LINEAR') {
    return `linear-gradient(180deg, ${stops})`;
  }
  if (fill.type === 'GRADIENT_RADIAL') {
    return `radial-gradient(ellipse at center, ${stops})`;
  }
  if (fill.type === 'GRADIENT_ANGULAR') {
    return `conic-gradient(${stops})`;
  }

  return null;
}

/**
 * Extract gradient tokens from a Figma node.
 * @param {Object} node - Figma node
 * @param {string} prefix - Token name prefix
 * @returns {Object} Map of token name -> CSS gradient value
 */
function extractGradientTokens(node, prefix = '') {
  const tokens = {};
  const fills = node.fills || [];

  const gradientFills = fills.filter(
    (f) => f.visible !== false && f.type && f.type.startsWith('GRADIENT_')
  );

  if (gradientFills.length === 0) return tokens;

  const name = (prefix ? `${prefix}/` : '') + node.name;
  const key = name.replace(/\s+/g, '-').replace(/\//g, '/').toLowerCase();

  if (gradientFills.length === 1) {
    const css = gradientToCss(gradientFills[0]);
    if (css) tokens[key] = css;
  } else {
    gradientFills.forEach((fill, i) => {
      const css = gradientToCss(fill);
      if (css) tokens[`${key}-${i + 1}`] = css;
    });
  }

  return tokens;
}

/**
 * Recursively extract all gradient tokens from a Figma document tree.
 * @param {Object[]} nodes - Array of Figma nodes
 * @param {string} prefix - Token name prefix
 * @returns {Object} Flat map of token names to CSS gradient values
 */
function extractAllGradientTokens(nodes, prefix = '') {
  let tokens = {};
  for (const node of nodes) {
    Object.assign(tokens, extractGradientTokens(node, prefix));
    if (node.children && node.children.length > 0) {
      Object.assign(tokens, extractAllGradientTokens(node.children, prefix));
    }
  }
  return tokens;
}

module.exports = { gradientStopToCss, gradientToCss, extractGradientTokens, extractAllGradientTokens };
