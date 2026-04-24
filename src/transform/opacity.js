/**
 * Opacity token extraction and transformation utilities.
 * Handles Figma opacity styles and converts them to CSS-compatible values.
 */

/**
 * Clamp a value between 0 and 1.
 * @param {number} value
 * @returns {number}
 */
function clampOpacity(value) {
  return Math.min(1, Math.max(0, value));
}

/**
 * Format an opacity value as a CSS-compatible string.
 * @param {number} value - Opacity between 0 and 1
 * @returns {string}
 */
function opacityToCss(value) {
  const clamped = clampOpacity(value);
  return String(parseFloat(clamped.toFixed(4)));
}

/**
 * Extract opacity tokens from a flat Figma styles map.
 * Looks for nodes with an `opacity` numeric property.
 * @param {Object} styles - Map of style key -> style object
 * @param {Object} nodes - Map of node id -> node object
 * @returns {Object} Flat token map
 */
function extractOpacityTokens(styles, nodes) {
  const tokens = {};

  for (const [, style] of Object.entries(styles)) {
    if (style.styleType !== 'FILL') continue;

    const node = nodes[style.node_id];
    if (!node || typeof node.opacity !== 'number') continue;

    const name = style.name
      .toLowerCase()
      .replace(/\s*\/\s*/g, '/')
      .replace(/\s+/g, '-');

    tokens[name] = opacityToCss(node.opacity);
  }

  return tokens;
}

/**
 * Extract opacity tokens from all document nodes that carry opacity.
 * @param {Object} documentNode - Root Figma document node
 * @returns {Object} Flat token map
 */
function extractAllOpacityTokens(documentNode) {
  const tokens = {};

  function walk(node) {
    if (node.type === 'RECTANGLE' || node.type === 'FRAME' || node.type === 'COMPONENT') {
      if (typeof node.opacity === 'number' && node.name) {
        const name = node.name
          .toLowerCase()
          .replace(/\s*\/\s*/g, '/')
          .replace(/\s+/g, '-');
        tokens[name] = opacityToCss(node.opacity);
      }
    }
    if (Array.isArray(node.children)) {
      node.children.forEach(walk);
    }
  }

  walk(documentNode);
  return tokens;
}

module.exports = {
  clampOpacity,
  opacityToCss,
  extractOpacityTokens,
  extractAllOpacityTokens,
};
