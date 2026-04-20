/**
 * Converts design tokens to JSON format
 */

/**
 * Converts a flat token map to a nested JSON object based on dot-separated keys
 * @param {Record<string, string>} tokens - Flat token map
 * @returns {object}
 */
function flatToNested(tokens) {
  const result = {};

  for (const [key, value] of Object.entries(tokens)) {
    const parts = key.split('.');
    let current = result;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (typeof current[part] !== 'object' || current[part] === null) {
        current[part] = {};
      }
      current = current[part];
    }

    current[parts[parts.length - 1]] = value;
  }

  return result;
}

/**
 * Serializes tokens to a JSON string
 * @param {Record<string, string>} tokens - Flat token map
 * @param {object} options
 * @param {boolean} [options.nested=false] - Whether to nest tokens by dot-separated keys
 * @param {number} [options.indent=2] - JSON indentation
 * @returns {string}
 */
function tokensToJson(tokens, options = {}) {
  const { nested = false, indent = 2 } = options;

  if (!tokens || typeof tokens !== 'object') {
    throw new Error('tokens must be a non-null object');
  }

  const output = nested ? flatToNested(tokens) : tokens;
  return JSON.stringify(output, null, indent) + '\n';
}

module.exports = { tokensToJson, flatToNested };
