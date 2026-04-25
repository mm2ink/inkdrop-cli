/**
 * Line height token transformer
 * Handles extraction and normalization of line-height tokens from Figma
 */

/**
 * Parse a raw line height value into a CSS-compatible string.
 * Supports unitless, px, and percentage values.
 * @param {number|string} value
 * @param {string} [unit] - 'PIXELS' | 'PERCENT' | 'AUTO'
 * @returns {string}
 */
function parseLineHeightValue(value, unit = 'AUTO') {
  if (unit === 'AUTO' || value === 'AUTO') return 'normal';
  if (unit === 'PERCENT') {
    const num = parseFloat(value);
    return isNaN(num) ? 'normal' : `${(num / 100).toFixed(4).replace(/\.?0+$/, '')}`;
  }
  if (unit === 'PIXELS') {
    const num = parseFloat(value);
    return isNaN(num) ? 'normal' : `${num}px`;
  }
  // fallback: unitless
  const num = parseFloat(value);
  return isNaN(num) ? 'normal' : String(num);
}

/**
 * Format a line height token value as a CSS custom property value.
 * @param {string} value
 * @returns {string}
 */
function lineHeightToCss(value) {
  return value;
}

/**
 * Walk a nested object and collect leaf entries.
 * @param {object} obj
 * @param {string} prefix
 * @param {function} cb
 */
function walk(obj, prefix, cb) {
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}-${key}` : key;
    if (val !== null && typeof val === 'object' && !('value' in val)) {
      walk(val, path, cb);
    } else {
      cb(path, val);
    }
  }
}

/**
 * Extract line height tokens from a flat or nested token map.
 * @param {object} tokens
 * @param {string} [prefix]
 * @returns {object} flat map of token name -> css value
 */
function extractLineHeightTokens(tokens, prefix = 'line-height') {
  const result = {};
  walk(tokens, prefix, (path, entry) => {
    const raw = typeof entry === 'object' ? entry.value : entry;
    const unit = typeof entry === 'object' ? entry.unit : undefined;
    result[path] = lineHeightToCss(parseLineHeightValue(raw, unit));
  });
  return result;
}

/**
 * Extract all line height tokens from a full Figma-style token set.
 * @param {object} allTokens
 * @returns {object}
 */
function extractAllLineHeightTokens(allTokens) {
  const source = allTokens.lineHeight || allTokens['line-height'] || {};
  return extractLineHeightTokens(source);
}

module.exports = {
  parseLineHeightValue,
  lineHeightToCss,
  extractLineHeightTokens,
  extractAllLineHeightTokens,
};
