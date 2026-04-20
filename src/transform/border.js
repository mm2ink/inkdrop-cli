/**
 * Border / stroke token transformation utilities
 */

const { rgbaToHex } = require('../figma/tokens');

const STROKE_ALIGN_MAP = {
  CENTER: 'center',
  INSIDE: 'inside',
  OUTSIDE: 'outside',
};

/**
 * Convert Figma stroke paint to a CSS border string
 * @param {Object} node - Figma node with stroke properties
 * @returns {Object|null} Border token value object
 */
function extractBorderValue(node) {
  if (!node.strokes || node.strokes.length === 0) return null;

  const stroke = node.strokes.find((s) => s.visible !== false && s.type === 'SOLID');
  if (!stroke) return null;

  const width = node.strokeWeight || 1;
  const color = stroke.color
    ? rgbaToHex(
        stroke.color.r,
        stroke.color.g,
        stroke.color.b,
        stroke.color.a
      )
    : '#000000';

  const align = STROKE_ALIGN_MAP[node.strokeAlign] || 'center';

  return {
    width: `${width}px`,
    style: 'solid',
    color,
    align,
    css: `${width}px solid ${color}`,
  };
}

/**
 * Extract border tokens from a list of Figma nodes
 * @param {Array} nodes - Array of { node, name } objects
 * @returns {Array} Flat array of border token objects
 */
function extractAllBorderTokens(nodes) {
  const tokens = [];
  for (const { node, name } of nodes) {
    const value = extractBorderValue(node);
    if (value) {
      tokens.push({ name, value, type: 'border' });
    }
  }
  return tokens;
}

module.exports = { extractBorderValue, extractAllBorderTokens };
