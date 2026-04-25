/**
 * Duration token transformer
 * Extracts and formats duration/time tokens from Figma to CSS custom properties
 */

/**
 * Parse a raw duration value into a normalized ms string
 * @param {*} value
 * @returns {string|null}
 */
function parseDurationValue(value) {
  if (typeof value === 'number') {
    return `${value}ms`;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (/^\d+(\.\d+)?ms$/.test(trimmed)) return trimmed;
    if (/^\d+(\.\d+)?s$/.test(trimmed)) {
      const seconds = parseFloat(trimmed);
      return `${Math.round(seconds * 1000)}ms`;
    }
    if (/^\d+(\.\d+)?$/.test(trimmed)) {
      return `${trimmed}ms`;
    }
  }
  return null;
}

/**
 * Format a duration token as a CSS custom property value
 * @param {string} value
 * @returns {string}
 */
function durationToCss(value) {
  const parsed = parseDurationValue(value);
  return parsed !== null ? parsed : String(value);
}

/**
 * Recursively walk a token tree and extract duration tokens
 * @param {object} node
 * @param {string} prefix
 * @param {object} result
 */
function walk(node, prefix, result) {
  if (node && typeof node === 'object') {
    if ('$value' in node || 'value' in node) {
      const raw = node.$value !== undefined ? node.$value : node.value;
      const type = node.$type || node.type || '';
      if (type === 'duration' || /duration|delay|timing/i.test(prefix)) {
        const css = durationToCss(raw);
        if (css) result[prefix] = css;
      }
    } else {
      for (const [key, child] of Object.entries(node)) {
        walk(child, prefix ? `${prefix}-${key}` : key, result);
      }
    }
  }
}

/**
 * Extract duration tokens from a flat token map
 * @param {object} tokens
 * @returns {object}
 */
function extractDurationTokens(tokens) {
  const result = {};
  for (const [key, value] of Object.entries(tokens)) {
    if (/duration|delay|timing/i.test(key)) {
      const css = durationToCss(value);
      if (css) result[key] = css;
    }
  }
  return result;
}

/**
 * Extract all duration tokens from a nested Figma token tree
 * @param {object} tree
 * @returns {object}
 */
function extractAllDurationTokens(tree) {
  const result = {};
  walk(tree, '', result);
  return result;
}

module.exports = {
  parseDurationValue,
  durationToCss,
  extractDurationTokens,
  extractAllDurationTokens,
};
