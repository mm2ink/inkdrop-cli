/**
 * Resolves token aliases (references) in a flat token map.
 * Aliases are values like "{color.primary}" that reference other tokens.
 */

/**
 * Check if a value is an alias reference.
 * @param {string} value
 * @returns {boolean}
 */
function isAlias(value) {
  return typeof value === 'string' && /^\{[^}]+\}$/.test(value);
}

/**
 * Extract the token key from an alias string like "{color.primary}".
 * @param {string} alias
 * @returns {string}
 */
function parseAlias(alias) {
  return alias.slice(1, -1);
}

/**
 * Resolve a single alias value, following chains up to a max depth.
 * @param {string} key
 * @param {Object} tokens
 * @param {number} depth
 * @returns {string}
 */
function resolveAlias(key, tokens, depth = 0) {
  if (depth > 10) {
    throw new Error(`Circular or deeply nested alias detected for token: "${key}"`);
  }
  const value = tokens[key];
  if (value === undefined) {
    throw new Error(`Alias target not found: "${key}"`);
  }
  if (isAlias(value)) {
    return resolveAlias(parseAlias(value), tokens, depth + 1);
  }
  return value;
}

/**
 * Resolve all alias references in a flat token map.
 * @param {Object} tokens - Flat map of token name -> value
 * @returns {Object} - New token map with aliases resolved
 */
function resolveAliases(tokens) {
  const resolved = {};
  for (const [key, value] of Object.entries(tokens)) {
    if (isAlias(value)) {
      try {
        resolved[key] = resolveAlias(parseAlias(value), tokens);
      } catch (err) {
        console.warn(`[inkdrop] Warning: ${err.message}`);
        resolved[key] = value;
      }
    } else {
      resolved[key] = value;
    }
  }
  return resolved;
}

module.exports = { isAlias, parseAlias, resolveAlias, resolveAliases };
