/**
 * Elevation token transformer
 * Converts Figma elevation/depth tokens to CSS custom properties
 */

/**
 * Extract a numeric elevation value from various input formats
 * @param {*} raw - Raw token value
 * @returns {string|null}
 */
function extractElevationValue(raw) {
  if (raw === null || raw === undefined) return null;
  const num = parseFloat(raw);
  if (isNaN(num)) return null;
  return String(num);
}

/**
 * Format elevation token as a CSS z-index or layer value
 * @param {string} value
 * @returns {string}
 */
function elevationToCss(value) {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return String(Math.round(num));
}

/**
 * Walk a nested object and collect elevation tokens
 * @param {object} node
 * @param {string} prefix
 * @param {object} result
 */
function walk(node, prefix, result) {
  if (!node || typeof node !== 'object') return;
  if ('value' in node || '$value' in node) {
    const raw = node.$value !== undefined ? node.$value : node.value;
    const val = extractElevationValue(raw);
    if (val !== null) {
      result[prefix] = elevationToCss(val);
    }
    return;
  }
  for (const [key, child] of Object.entries(node)) {
    walk(child, prefix ? `${prefix}-${key}` : key, result);
  }
}

/**
 * Extract elevation tokens from a flat token map
 * @param {object} tokens
 * @returns {object}
 */
function extractElevationTokens(tokens) {
  const result = {};
  for (const [key, val] of Object.entries(tokens)) {
    const extracted = extractElevationValue(val);
    if (extracted !== null) {
      result[key] = elevationToCss(extracted);
    }
  }
  return result;
}

/**
 * Extract all elevation tokens from a nested Figma-style token tree
 * @param {object} tree
 * @param {string} [rootKey='elevation']
 * @returns {object}
 */
function extractAllElevationTokens(tree, rootKey = 'elevation') {
  const result = {};
  const node = tree[rootKey] || tree;
  walk(node, '', result);
  // Remove leading dash from keys
  return Object.fromEntries(
    Object.entries(result).map(([k, v]) => [k.replace(/^-/, ''), v])
  );
}

module.exports = {
  extractElevationValue,
  elevationToCss,
  extractElevationTokens,
  extractAllElevationTokens,
  walk,
};
