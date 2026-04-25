/**
 * Size token transformer
 * Converts Figma size/dimension tokens to CSS values with optional rem conversion
 */

const DEFAULT_BASE_FONT_SIZE = 16;

/**
 * Parse a raw size value to a number in pixels
 * @param {*} raw
 * @returns {number|null}
 */
function parseSizeValue(raw) {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'number') return raw;
  if (typeof raw === 'string') {
    const match = raw.match(/^(\d+(?:\.\d+)?)(px|rem)?$/);
    if (!match) return null;
    const num = parseFloat(match[1]);
    if (match[2] === 'rem') return num * DEFAULT_BASE_FONT_SIZE;
    return num;
  }
  return null;
}

/**
 * Format a size value as a CSS string
 * @param {number} px - Value in pixels
 * @param {boolean} [useRem=false]
 * @param {number} [baseFontSize=16]
 * @returns {string}
 */
function sizeToCss(px, useRem = false, baseFontSize = DEFAULT_BASE_FONT_SIZE) {
  if (px === 0) return '0';
  if (useRem) {
    const rem = px / baseFontSize;
    return `${parseFloat(rem.toFixed(4))}rem`;
  }
  return `${px}px`;
}

/**
 * Walk a nested token tree and collect size tokens
 * @param {object} node
 * @param {string} prefix
 * @param {object} result
 * @param {boolean} useRem
 */
function walk(node, prefix, result, useRem) {
  if (!node || typeof node !== 'object') return;
  if ('value' in node || '$value' in node) {
    const raw = node.$value !== undefined ? node.$value : node.value;
    const px = parseSizeValue(raw);
    if (px !== null) {
      result[prefix] = sizeToCss(px, useRem);
    }
    return;
  }
  for (const [key, child] of Object.entries(node)) {
    walk(child, prefix ? `${prefix}-${key}` : key, result, useRem);
  }
}

/**
 * Extract all size tokens from a nested Figma-style token tree
 * @param {object} tree
 * @param {string} [rootKey='size']
 * @param {boolean} [useRem=false]
 * @returns {object}
 */
function extractAllSizeTokens(tree, rootKey = 'size', useRem = false) {
  const result = {};
  const node = tree[rootKey] || tree;
  walk(node, '', result, useRem);
  return Object.fromEntries(
    Object.entries(result).map(([k, v]) => [k.replace(/^-/, ''), v])
  );
}

module.exports = {
  parseSizeValue,
  sizeToCss,
  extractAllSizeTokens,
  walk,
};
