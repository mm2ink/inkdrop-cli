/**
 * Shadow token transformation utilities
 */

/**
 * Convert a Figma drop shadow effect to a CSS box-shadow string
 * @param {Object} shadow - Figma shadow effect object
 * @returns {string} CSS box-shadow value
 */
function shadowToCss(shadow) {
  if (!shadow || shadow.type !== 'DROP_SHADOW') return null;

  const { offset = {}, radius = 0, spread = 0, color = {} } = shadow;
  const x = Math.round(offset.x || 0);
  const y = Math.round(offset.y || 0);
  const blur = Math.round(radius);
  const spreadVal = Math.round(spread);

  const r = Math.round((color.r || 0) * 255);
  const g = Math.round((color.g || 0) * 255);
  const b = Math.round((color.b || 0) * 255);
  const a = typeof color.a === 'number' ? color.a : 1;

  return `${x}px ${y}px ${blur}px ${spreadVal}px rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Extract shadow tokens from a Figma node
 * @param {Object} node - Figma node with effects
 * @param {string} name - Token name
 * @returns {Array} Array of token objects
 */
function extractShadowTokens(node, name) {
  if (!node.effects || node.effects.length === 0) return [];

  const shadows = node.effects.filter(
    (e) => e.type === 'DROP_SHADOW' && e.visible !== false
  );

  if (shadows.length === 0) return [];

  const cssValue = shadows.map(shadowToCss).filter(Boolean).join(', ');

  return [
    {
      name,
      value: cssValue,
      type: 'shadow',
      rawEffects: shadows,
    },
  ];
}

/**
 * Extract all shadow tokens from a list of Figma nodes
 * @param {Array} nodes - Array of { node, name } objects
 * @returns {Array} Flat array of shadow token objects
 */
function extractAllShadowTokens(nodes) {
  return nodes.flatMap(({ node, name }) => extractShadowTokens(node, name));
}

module.exports = { shadowToCss, extractShadowTokens, extractAllShadowTokens };
