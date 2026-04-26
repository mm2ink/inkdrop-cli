/**
 * Text decoration token transformer
 * Maps Figma text decoration styles to CSS text-decoration values
 */

const DECORATION_MAP = {
  NONE: 'none',
  UNDERLINE: 'underline',
  OVERLINE: 'overline',
  STRIKETHROUGH: 'line-through',
  LINE_THROUGH: 'line-through',
};

/**
 * Map a Figma text decoration value to a CSS text-decoration value
 * @param {string} value - Figma decoration constant
 * @returns {string} CSS text-decoration value
 */
function mapTextDecoration(value) {
  if (!value) return 'none';
  const upper = String(value).toUpperCase().replace(/-/g, '_');
  return DECORATION_MAP[upper] || 'none';
}

/**
 * Walk a nested object and call cb on each leaf
 */
function walk(obj, cb, path = []) {
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      walk(val, cb, [...path, key]);
    } else {
      cb([...path, key], val);
    }
  }
}

/**
 * Extract text decoration tokens from a flat token map
 * @param {Object} tokens
 * @returns {Object}
 */
function extractTextDecorationTokens(tokens) {
  const result = {};
  for (const [name, value] of Object.entries(tokens)) {
    if (
      name.toLowerCase().includes('decoration') ||
      name.toLowerCase().includes('underline') ||
      name.toLowerCase().includes('strikethrough')
    ) {
      result[name] = mapTextDecoration(value);
    }
  }
  return result;
}

/**
 * Extract all text decoration tokens from nested Figma styles
 * @param {Object} styles
 * @returns {Object}
 */
function extractAllTextDecorationTokens(styles) {
  const result = {};
  walk(styles, (path, value) => {
    const key = path.join('.');
    if (
      key.toLowerCase().includes('decoration') ||
      key.toLowerCase().includes('underline') ||
      key.toLowerCase().includes('strikethrough')
    ) {
      result[key] = mapTextDecoration(value);
    }
  });
  return result;
}

module.exports = {
  mapTextDecoration,
  extractTextDecorationTokens,
  extractAllTextDecorationTokens,
};
