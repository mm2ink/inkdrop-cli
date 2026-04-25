/**
 * Font weight token transformer
 * Handles extraction and normalization of font-weight tokens from Figma
 */

const NAMED_WEIGHTS = {
  thin: 100,
  hairline: 100,
  extralight: 200,
  'extra-light': 200,
  ultralight: 200,
  light: 300,
  regular: 400,
  normal: 400,
  medium: 500,
  semibold: 600,
  'semi-bold': 600,
  demibold: 600,
  bold: 700,
  extrabold: 800,
  'extra-bold': 800,
  ultrabold: 800,
  black: 900,
  heavy: 900,
};

/**
 * Resolve a font weight value (named or numeric) to a CSS-compatible number.
 * @param {string|number} value
 * @returns {string}
 */
function parseFontWeightValue(value) {
  if (typeof value === 'number') return String(Math.round(value));
  const normalized = String(value).toLowerCase().trim();
  if (NAMED_WEIGHTS[normalized] !== undefined) {
    return String(NAMED_WEIGHTS[normalized]);
  }
  const num = parseInt(normalized, 10);
  if (!isNaN(num) && num >= 100 && num <= 900) return String(num);
  return '400';
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
 * Extract font weight tokens from a flat or nested token map.
 * @param {object} tokens
 * @param {string} [prefix]
 * @returns {object}
 */
function extractFontWeightTokens(tokens, prefix = 'font-weight') {
  const result = {};
  walk(tokens, prefix, (path, entry) => {
    const raw = typeof entry === 'object' ? entry.value : entry;
    result[path] = parseFontWeightValue(raw);
  });
  return result;
}

/**
 * Extract all font weight tokens from a full token set.
 * @param {object} allTokens
 * @returns {object}
 */
function extractAllFontWeightTokens(allTokens) {
  const source = allTokens.fontWeight || allTokens['font-weight'] || {};
  return extractFontWeightTokens(source);
}

module.exports = {
  parseFontWeightValue,
  extractFontWeightTokens,
  extractAllFontWeightTokens,
  NAMED_WEIGHTS,
};
