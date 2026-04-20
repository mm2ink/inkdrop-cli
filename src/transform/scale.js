/**
 * Token scaling and numeric transformation utilities.
 * Supports remapping numeric values (e.g. px -> rem) and applying multipliers.
 */

/**
 * Convert a pixel value string to rem.
 * @param {string|number} value
 * @param {number} base - base font size, default 16
 * @returns {string}
 */
function pxToRem(value, base = 16) {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return `${num / base}rem`;
}

/**
 * Apply a numeric multiplier to a value.
 * @param {string|number} value
 * @param {number} factor
 * @returns {string|number}
 */
function scaleValue(value, factor) {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  const scaled = num * factor;
  return Number.isInteger(scaled) ? scaled : parseFloat(scaled.toFixed(4));
}

/**
 * Apply scale transforms to a flat token map.
 * @param {Object} tokens - flat { name: value } map
 * @param {Object} options
 * @param {boolean} [options.remify] - convert px values to rem
 * @param {number} [options.remBase] - base for rem conversion
 * @param {number} [options.scaleFactor] - multiply all numeric values
 * @returns {Object}
 */
function applyScaleTransforms(tokens, options = {}) {
  const { remify = false, remBase = 16, scaleFactor } = options;
  const result = {};
  for (const [name, value] of Object.entries(tokens)) {
    let transformed = value;
    if (scaleFactor !== undefined) {
      transformed = scaleValue(transformed, scaleFactor);
    }
    if (remify && typeof transformed === 'string' && transformed.endsWith('px')) {
      transformed = pxToRem(transformed, remBase);
    }
    result[name] = transformed;
  }
  return result;
}

module.exports = { pxToRem, scaleValue, applyScaleTransforms };
