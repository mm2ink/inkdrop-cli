/**
 * Central transform pipeline: applies all token transformations.
 */

const { applyScaleTransforms } = require('./scale');
const { resolveAliases } = require('./alias');
const { extractAllTypographyTokens } = require('./typography');
const { extractAllShadowTokens } = require('./shadow');
const { extractAllBorderTokens } = require('./border');
const { extractAllGradientTokens } = require('./gradient');
const { extractAllSpacingTokens } = require('./spacing');
const { extractAllAnimationTokens } = require('./animation');
const { applyOpacityVariants, applyHslConversion } = require('./color');
const { extractAllZIndexTokens } = require('./zindex');

/**
 * Normalizes token key names (dots to dashes, lowercase).
 * @param {object} tokens
 * @returns {object}
 */
function normalizeNames(tokens) {
  return Object.fromEntries(
    Object.entries(tokens).map(([k, v]) => [k.replace(/\./g, '-').toLowerCase(), v])
  );
}

/**
 * Filters tokens by a given prefix.
 * @param {object} tokens
 * @param {string} prefix
 * @returns {object}
 */
function filterByPrefix(tokens, prefix) {
  if (!prefix) return tokens;
  return Object.fromEntries(
    Object.entries(tokens).filter(([k]) => k.startsWith(prefix))
  );
}

/**
 * Strips a prefix from all token keys.
 * @param {object} tokens
 * @param {string} prefix
 * @returns {object}
 */
function stripPrefix(tokens, prefix) {
  if (!prefix) return tokens;
  return Object.fromEntries(
    Object.entries(tokens).map(([k, v]) => [k.startsWith(prefix) ? k.slice(prefix.length) : k, v])
  );
}

/**
 * Applies all configured transforms to a flat token map.
 * @param {object} tokens - flat token map
 * @param {object} config - transform config
 * @returns {object}
 */
function applyTransforms(tokens, config = {}) {
  let result = { ...tokens };

  if (config.resolveAliases !== false) {
    result = resolveAliases(result);
  }
  if (config.scale) {
    result = applyScaleTransforms(result, config.scale);
  }
  if (config.opacityVariants) {
    result = applyOpacityVariants(result, config.opacityVariants);
  }
  if (config.hsl) {
    result = applyHslConversion(result);
  }

  return result;
}

module.exports = {
  normalizeNames,
  filterByPrefix,
  stripPrefix,
  applyTransforms,
  extractAllZIndexTokens,
};
