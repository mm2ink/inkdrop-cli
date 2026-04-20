/**
 * Converts design tokens to CSS custom properties format
 */

/**
 * Formats a single token as a CSS custom property
 * @param {string} name - Token name
 * @param {string} value - Token value
 * @returns {string}
 */
function formatCssVariable(name, value) {
  const cssName = `--${name.replace(/\./g, '-').replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()}`;
  return `  ${cssName}: ${value};`;
}

/**
 * Converts a flat token map to a CSS :root block
 * @param {Record<string, string>} tokens - Flat token map
 * @param {object} options
 * @param {string} [options.selector=':root'] - CSS selector to wrap variables
 * @returns {string}
 */
function tokensToCss(tokens, options = {}) {
  const { selector = ':root' } = options;

  if (!tokens || typeof tokens !== 'object') {
    throw new Error('tokens must be a non-null object');
  }

  const lines = Object.entries(tokens).map(([name, value]) =>
    formatCssVariable(name, value)
  );

  if (lines.length === 0) {
    return `${selector} {\n}\n`;
  }

  return `${selector} {\n${lines.join('\n')}\n}\n`;
}

module.exports = { tokensToCss, formatCssVariable };
