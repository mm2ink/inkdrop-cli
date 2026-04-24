/**
 * Breakpoint token transformer
 * Extracts and formats breakpoint/viewport tokens from Figma variables
 */

/**
 * Extract a numeric pixel value from a breakpoint token value
 * @param {*} value - raw token value
 * @returns {string|null}
 */
function extractBreakpointValue(value) {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  if (typeof value === 'string') {
    const match = value.match(/^(\d+(?:\.\d+)?)(px|rem|em)?$/);
    if (match) {
      const num = parseFloat(match[1]);
      const unit = match[2] || 'px';
      return `${num}${unit}`;
    }
  }
  return null;
}

/**
 * Format a breakpoint token as a CSS custom property value
 * @param {string} value - resolved pixel string
 * @returns {string}
 */
function breakpointToCss(value) {
  return value;
}

/**
 * Walk a nested node tree and extract breakpoint tokens
 * @param {object} node - Figma node or variable group
 * @param {string} prefix - current token path prefix
 * @param {object} tokens - accumulator
 * @returns {object}
 */
function extractBreakpointTokens(node, prefix = '', tokens = {}) {
  if (!node || typeof node !== 'object') return tokens;

  for (const [key, value] of Object.entries(node)) {
    const tokenPath = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value) && !('value' in value)) {
      extractBreakpointTokens(value, tokenPath, tokens);
    } else {
      const raw = value && typeof value === 'object' ? value.value : value;
      const resolved = extractBreakpointValue(raw);
      if (resolved !== null) {
        tokens[tokenPath] = breakpointToCss(resolved);
      }
    }
  }

  return tokens;
}

/**
 * Extract all breakpoint tokens from a flat or nested token map
 * @param {object} allTokens - full token map
 * @param {string} [groupKey='breakpoints'] - key to look for
 * @returns {object}
 */
function extractAllBreakpointTokens(allTokens, groupKey = 'breakpoints') {
  if (!allTokens || typeof allTokens !== 'object') return {};

  const group = allTokens[groupKey];
  if (!group) return {};

  return extractBreakpointTokens(group);
}

module.exports = {
  extractBreakpointValue,
  breakpointToCss,
  extractBreakpointTokens,
  extractAllBreakpointTokens,
};
