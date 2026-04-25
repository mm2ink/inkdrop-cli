const { normalizeNames, filterByPrefix, stripPrefix } = require('./index.internals');
const { applyScaleTransforms } = require('./scale');
const { applyOpacityVariants } = require('./color');
const { resolveAliases } = require('./alias');
const { extractAllDurationTokens } = require('./duration');
const { extractAllSizeTokens } = require('./size');
const { extractAllSpacingTokens } = require('./spacing');
const { extractAllShadowTokens } = require('./shadow');
const { extractAllBorderTokens } = require('./border');
const { extractAllGradientTokens } = require('./gradient');
const { extractAllTypographyTokens } = require('./typography');
const { extractAllAnimationTokens } = require('./animation');
const { extractAllMotionTokens } = require('./motion');
const { extractZIndexTokens } = require('./zindex');
const { extractOpacityTokens } = require('./opacity');
const { extractBreakpointTokens } = require('./breakpoint');
const { extractAllRadiusTokens } = require('./radius');
const { extractAllGridTokens } = require('./grid');
const { extractAllElevationTokens } = require('./elevation');

/**
 * Normalize token names: lowercase, replace spaces/slashes with dashes
 * @param {object} tokens
 * @returns {object}
 */
function normalizeNames(tokens) {
  const result = {};
  for (const [key, value] of Object.entries(tokens)) {
    const normalized = key
      .toLowerCase()
      .replace(/[\s/]+/g, '-')
      .replace(/[^a-z0-9-_]/g, '');
    result[normalized] = value;
  }
  return result;
}

/**
 * Filter tokens by a given prefix
 * @param {object} tokens
 * @param {string} prefix
 * @returns {object}
 */
function filterByPrefix(tokens, prefix) {
  if (!prefix) return tokens;
  const result = {};
  for (const [key, value] of Object.entries(tokens)) {
    if (key.startsWith(prefix)) result[key] = value;
  }
  return result;
}

/**
 * Strip a prefix from all token keys
 * @param {object} tokens
 * @param {string} prefix
 * @returns {object}
 */
function stripPrefix(tokens, prefix) {
  if (!prefix) return tokens;
  const result = {};
  for (const [key, value] of Object.entries(tokens)) {
    const stripped = key.startsWith(prefix) ? key.slice(prefix.length) : key;
    result[stripped] = value;
  }
  return result;
}

/**
 * Apply all configured transforms to a flat token map
 * @param {object} tokens
 * @param {object} config
 * @returns {object}
 */
function applyTransforms(tokens, config = {}) {
  let result = { ...tokens };

  result = resolveAliases(result);

  if (config.normalizeNames !== false) {
    result = normalizeNames(result);
  }

  if (config.prefix) {
    result = filterByPrefix(result, config.prefix);
  }

  if (config.stripPrefix) {
    result = stripPrefix(result, config.stripPrefix);
  }

  if (config.scale) {
    result = applyScaleTransforms(result, config.scale);
  }

  if (config.opacityVariants) {
    result = applyOpacityVariants(result, config.opacityVariants);
  }

  return result;
}

module.exports = {
  normalizeNames,
  filterByPrefix,
  stripPrefix,
  applyTransforms,
  extractAllDurationTokens,
};
