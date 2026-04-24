/**
 * Z-index token extraction and transformation utilities.
 */

/**
 * Extracts z-index value from a Figma node or raw value.
 * Accepts numeric or string values like "100", "auto".
 * @param {*} value
 * @returns {string|null}
 */
function extractZIndexValue(value) {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  if (str === 'auto') return 'auto';
  const num = Number(str);
  if (!isNaN(num) && isFinite(num)) return String(Math.round(num));
  return null;
}

/**
 * Converts a z-index token to a CSS custom property value string.
 * @param {string} value
 * @returns {string}
 */
function zIndexToCss(value) {
  return value;
}

/**
 * Walks a nested token tree and extracts z-index tokens.
 * @param {object} node - Figma node
 * @param {string} prefix - current key path
 * @param {object} result - accumulated tokens
 * @returns {object}
 */
function extractZIndexTokens(node, prefix = '', result = {}) {
  if (!node || typeof node !== 'object') return result;

  if ('$value' in node || 'value' in node) {
    const raw = node.$value ?? node.value;
    const type = node.$type ?? node.type ?? '';
    if (type === 'zIndex' || type === 'z-index' || /z.?index/i.test(prefix)) {
      const extracted = extractZIndexValue(raw);
      if (extracted !== null) {
        result[prefix] = zIndexToCss(extracted);
      }
    }
    return result;
  }

  for (const [key, child] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key;
    extractZIndexTokens(child, path, result);
  }

  return result;
}

/**
 * Entry point: extract all z-index tokens from a full token tree.
 * @param {object} tokenTree
 * @returns {object}
 */
function extractAllZIndexTokens(tokenTree) {
  if (!tokenTree || typeof tokenTree !== 'object') return {};
  return extractZIndexTokens(tokenTree);
}

module.exports = {
  extractZIndexValue,
  zIndexToCss,
  extractZIndexTokens,
  extractAllZIndexTokens,
};
