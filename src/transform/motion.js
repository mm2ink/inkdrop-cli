/**
 * Motion / transition token extractor.
 * Converts Figma-style motion tokens to CSS transition shorthand strings.
 */

/**
 * Map a Figma easing type to a CSS timing function.
 * @param {string} easing
 * @returns {string}
 */
function mapMotionEasing(easing) {
  const map = {
    LINEAR: 'linear',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
    EASE_IN_BACK: 'cubic-bezier(0.36, 0, 0.66, -0.56)',
    EASE_OUT_BACK: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    EASE_IN_OUT_BACK: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  };
  return map[easing] || 'ease';
}

/**
 * Format a duration in milliseconds to a CSS time string.
 * @param {number} ms
 * @returns {string}
 */
function formatMotionDuration(ms) {
  if (typeof ms !== 'number' || isNaN(ms)) return '0ms';
  return `${Math.round(ms)}ms`;
}

/**
 * Convert a single motion token value object to a CSS transition string.
 * @param {object} token - { duration, delay, easing, property }
 * @returns {string}
 */
function motionToCss(token) {
  const property = token.property || 'all';
  const duration = formatMotionDuration(token.duration);
  const easing = mapMotionEasing(token.easing);
  const delay = token.delay ? formatMotionDuration(token.delay) : '0ms';
  return `${property} ${duration} ${easing} ${delay}`;
}

/**
 * Extract motion tokens from a flat token map.
 * @param {object} tokens - flat token map { name: { type, value, ... } }
 * @returns {object} - flat map of motion CSS values
 */
function extractMotionTokens(tokens) {
  const result = {};
  for (const [name, token] of Object.entries(tokens)) {
    if (token.type === 'motion' || token.type === 'transition') {
      result[name] = motionToCss(token.value || token);
    }
  }
  return result;
}

/**
 * Walk a nested Figma styles object and collect motion tokens.
 * @param {object} node
 * @param {string} prefix
 * @param {object} acc
 * @returns {object}
 */
function extractAllMotionTokens(node, prefix = '', acc = {}) {
  for (const [key, value] of Object.entries(node)) {
    const path = prefix ? `${prefix}-${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if ('duration' in value || 'easing' in value) {
        acc[path] = motionToCss(value);
      } else {
        extractAllMotionTokens(value, path, acc);
      }
    }
  }
  return acc;
}

module.exports = {
  mapMotionEasing,
  formatMotionDuration,
  motionToCss,
  extractMotionTokens,
  extractAllMotionTokens,
};
