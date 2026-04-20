/**
 * Token transformation pipeline.
 * Applies a series of named transforms to raw token arrays.
 */

/**
 * Normalize token names: lowercase, replace spaces with hyphens.
 * @param {Array<{name: string, value: string}>} tokens
 * @returns {Array<{name: string, value: string}>}
 */
export function normalizeNames(tokens) {
  return tokens.map((token) => ({
    ...token,
    name: token.name.toLowerCase().replace(/\s+/g, '-'),
  }));
}

/**
 * Filter tokens by a prefix string.
 * @param {Array<{name: string, value: string}>} tokens
 * @param {string} prefix
 * @returns {Array<{name: string, value: string}>}
 */
export function filterByPrefix(tokens, prefix) {
  if (!prefix) return tokens;
  return tokens.filter((token) => token.name.startsWith(prefix));
}

/**
 * Strip a prefix from all token names.
 * @param {Array<{name: string, value: string}>} tokens
 * @param {string} prefix
 * @returns {Array<{name: string, value: string}>}
 */
export function stripPrefix(tokens, prefix) {
  if (!prefix) return tokens;
  return tokens.map((token) => ({
    ...token,
    name: token.name.startsWith(prefix)
      ? token.name.slice(prefix.length).replace(/^[-/]/, '')
      : token.name,
  }));
}

/**
 * Run the full transform pipeline based on config options.
 * @param {Array<{name: string, value: string}>} tokens
 * @param {{ prefix?: string, stripPrefix?: boolean }} options
 * @returns {Array<{name: string, value: string}>}
 */
export function applyTransforms(tokens, options = {}) {
  let result = normalizeNames(tokens);

  if (options.prefix) {
    result = filterByPrefix(result, options.prefix);
  }

  if (options.stripPrefix && options.prefix) {
    result = stripPrefix(result, options.prefix);
  }

  return result;
}
