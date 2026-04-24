/**
 * Grid token transformer
 * Extracts grid/layout tokens from Figma styles and converts them to CSS custom properties.
 */

/**
 * Extract a CSS grid value from a token value string or number.
 * @param {string|number} value
 * @returns {string}
 */
function extractGridValue(value) {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  const str = String(value).trim();
  if (/^\d+(\.\d+)?$/.test(str)) {
    return `${str}px`;
  }
  return str;
}

/**
 * Format a grid token as a CSS custom property value.
 * @param {object} token
 * @returns {string}
 */
function gridToCss(token) {
  if (token.columns !== undefined) {
    return `repeat(${token.columns}, 1fr)`;
  }
  if (token.value !== undefined) {
    return extractGridValue(token.value);
  }
  return String(token);
}

/**
 * Walk a nested object and collect grid tokens.
 * @param {object} obj
 * @param {string[]} path
 * @param {object} result
 * @returns {object}
 */
function walk(obj, path = [], result = {}) {
  for (const [key, val] of Object.entries(obj)) {
    const currentPath = [...path, key];
    if (val && typeof val === 'object' && !Array.isArray(val) && val.value === undefined && val.columns === undefined) {
      walk(val, currentPath, result);
    } else {
      const tokenKey = currentPath.join('.');
      result[tokenKey] = gridToCss(val);
    }
  }
  return result;
}

/**
 * Extract grid tokens from a flat or nested token map.
 * @param {object} tokens
 * @param {string} prefix - e.g. 'grid'
 * @returns {object}
 */
function extractGridTokens(tokens, prefix = 'grid') {
  const section = tokens[prefix];
  if (!section) return {};
  return walk(section, [prefix]);
}

/**
 * Extract all grid-related tokens from a full token set.
 * @param {object} tokens
 * @returns {object}
 */
function extractAllGridTokens(tokens) {
  const prefixes = ['grid', 'layout', 'columns', 'gutter'];
  return prefixes.reduce((acc, prefix) => {
    return Object.assign(acc, extractGridTokens(tokens, prefix));
  }, {});
}

module.exports = {
  extractGridValue,
  gridToCss,
  extractGridTokens,
  extractAllGridTokens,
};
