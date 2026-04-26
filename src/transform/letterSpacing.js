/**
 * Letter spacing token transformer
 * Converts Figma letter spacing values to CSS letter-spacing tokens
 */

/**
 * Parse a letter spacing value from Figma (percent or px) to CSS
 * @param {number|string} value - Raw value from Figma
 * @param {string} unit - 'PERCENT' or 'PIXELS'
 * @param {number} [fontSize=16] - Font size in px for percent conversion
 * @returns {string} CSS letter-spacing value
 */
function parseLetterSpacingValue(value, unit, fontSize = 16) {
  if (value === undefined || value === null) return '0em';
  const num = parseFloat(value);
  if (isNaN(num)) return '0em';

  if (unit === 'PERCENT') {
    // Figma percent is relative to font size: value% of fontSize
    return `${(num / 100).toFixed(4)}em`;
  }

  if (unit === 'PIXELS') {
    return `${num}px`;
  }

  // Fallback: treat as px
  return `${num}px`;
}

/**
 * Format a letter spacing token value as a CSS custom property value
 * @param {string} cssValue
 * @returns {string}
 */
function letterSpacingToCss(cssValue) {
  return cssValue;
}

/**
 * Walk a nested object and call cb on each leaf node
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
 * Extract letter spacing tokens from a flat token map
 * @param {Object} tokens - Flat token map { name: value }
 * @returns {Object} Flat map of letter-spacing tokens
 */
function extractLetterSpacingTokens(tokens) {
  const result = {};
  for (const [name, value] of Object.entries(tokens)) {
    if (name.toLowerCase().includes('letter') || name.toLowerCase().includes('tracking')) {
      result[name] = letterSpacingToCss(value);
    }
  }
  return result;
}

/**
 * Extract all letter spacing tokens from a nested Figma styles object
 * @param {Object} styles - Nested Figma styles
 * @returns {Object} Flat map of letter-spacing CSS tokens
 */
function extractAllLetterSpacingTokens(styles) {
  const result = {};
  walk(styles, (path, value) => {
    const key = path.join('.');
    if (
      key.toLowerCase().includes('letter') ||
      key.toLowerCase().includes('tracking')
    ) {
      if (typeof value === 'object' && value !== null && 'value' in value) {
        const unit = value.unit || 'PIXELS';
        result[key] = parseLetterSpacingValue(value.value, unit);
      } else if (typeof value === 'string' || typeof value === 'number') {
        result[key] = parseLetterSpacingValue(value, 'PIXELS');
      }
    }
  });
  return result;
}

module.exports = {
  parseLetterSpacingValue,
  letterSpacingToCss,
  extractLetterSpacingTokens,
  extractAllLetterSpacingTokens,
};
