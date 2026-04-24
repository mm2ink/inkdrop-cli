/**
 * Border radius token extraction and transformation.
 */

const DEFAULT_UNIT = 'px';

/**
 * Extract a border radius value from a raw token value.
 * Accepts numbers (treated as px), strings with units, or 'full'/'pill' keywords.
 * @param {string|number} value
 * @returns {string}
 */
function extractRadiusValue(value) {
  if (value === 'full' || value === 'pill') {
    return '9999px';
  }
  if (typeof value === 'number') {
    return `${value}${DEFAULT_UNIT}`;
  }
  const str = String(value).trim();
  if (/^\d+(\.\d+)?$/.test(str)) {
    return `${str}${DEFAULT_UNIT}`;
  }
  return str;
}

/**
 * Format a radius token as a CSS custom property value.
 * @param {string|number} value
 * @returns {string}
 */
function radiusToCss(value) {
  return extractRadiusValue(value);
}

/**
 * Extract radius tokens from a flat Figma styles node map.
 * @param {object} nodes - map of nodeId -> node
 * @returns {object} flat token map { name: cssValue }
 */
function extractRadiusTokens(nodes) {
  const tokens = {};
  for (const [, node] of Object.entries(nodes)) {
    const doc = node.document;
    if (!doc) continue;
    const name = doc.name;
    const radius = doc.cornerRadius ?? doc.rectangleCornerRadii?.[0];
    if (radius !== undefined && name) {
      tokens[name] = radiusToCss(radius);
    }
  }
  return tokens;
}

/**
 * Walk a nested Figma file tree and collect radius tokens.
 * @param {object} tree - Figma file JSON
 * @param {string} [prefix]
 * @returns {object}
 */
function extractAllRadiusTokens(tree, prefix = '') {
  const tokens = {};

  function walk(node, path) {
    if (!node) return;
    const currentPath = path ? `${path}/${node.name}` : node.name;
    if (
      node.type === 'RECTANGLE' ||
      node.type === 'COMPONENT' ||
      node.type === 'FRAME'
    ) {
      const radius = node.cornerRadius ?? node.rectangleCornerRadii?.[0];
      if (radius !== undefined) {
        const key = prefix ? `${prefix}/${currentPath}` : currentPath;
        tokens[key] = radiusToCss(radius);
      }
    }
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        walk(child, currentPath);
      }
    }
  }

  walk(tree, '');
  return tokens;
}

module.exports = {
  extractRadiusValue,
  radiusToCss,
  extractRadiusTokens,
  extractAllRadiusTokens,
};
