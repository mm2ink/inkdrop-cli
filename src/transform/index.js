'use strict';

const { applyScaleTransforms } = require('./scale');
const { resolveAliases } = require('./alias');
const { extractAllTypographyTokens } = require('./typography');
const { extractAllShadowTokens } = require('./shadow');
const { extractAllGradientTokens } = require('./gradient');
const { extractAllSpacingTokens } = require('./spacing');
const { extractAllAnimationTokens } = require('./animation');
const { applyOpacityVariants, applyHslConversion } = require('./color');
const { extractAllZIndexTokens } = require('./zindex');
const { extractAllOpacityTokens } = require('./opacity');
const { extractAllBreakpointTokens } = require('./breakpoint');
const { extractAllRadiusTokens } = require('./radius');
const { extractAllGridTokens } = require('./grid');
const { extractAllMotionTokens } = require('./motion');
const { extractAllElevationTokens } = require('./elevation');
const { extractAllSizeTokens } = require('./size');

/**
 * Normalize token names to kebab-case
 * @param {object} tokens
 * @returns {object}
 */
function normalizeNames(tokens) {
  return Object.fromEntries(
    Object.entries(tokens).map(([k, v]) => [
      k.replace(/[_\s]+/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
      v,
    ])
  );
}

/**
 * Filter tokens by prefix
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
 * Strip a prefix from token keys
 * @param {object} tokens
 * @param {string} prefix
 * @returns {object}
 */
function stripPrefix(tokens, prefix) {
  if (!prefix) return tokens;
  return Object.fromEntries(
    Object.entries(tokens).map(([k, v]) => [
      k.startsWith(prefix) ? k.slice(prefix.length) : k,
      v,
    ])
  );
}

/**
 * Apply all configured transforms to a token set
 * @param {object} tokens
 * @param {object} config
 * @returns {object}
 */
function applyTransforms(tokens, config = {}) {
  let result = { ...tokens };

  if (config.resolveAliases) {
    result = resolveAliases(result);
  }
  if (config.normalizeNames) {
    result = normalizeNames(result);
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
  extractAllTypographyTokens,
  extractAllShadowTokens,
  extractAllGradientTokens,
  extractAllSpacingTokens,
  extractAllAnimationTokens,
  extractAllZIndexTokens,
  extractAllOpacityTokens,
  extractAllBreakpointTokens,
  extractAllRadiusTokens,
  extractAllGridTokens,
  extractAllMotionTokens,
  extractAllElevationTokens,
  extractAllSizeTokens,
};
