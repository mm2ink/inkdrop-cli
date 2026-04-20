/**
 * Color token transforms: opacity variants, tints, shades, and HSL conversion.
 */

/**
 * Convert a hex color string to an HSL object.
 * @param {string} hex - e.g. "#ff6600" or "#fff"
 * @returns {{ h: number, s: number, l: number }}
 */
function hexToHsl(hex) {
  let r = 0, g = 0, b = 0;
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else {
    r = parseInt(clean.slice(0, 2), 16);
    g = parseInt(clean.slice(2, 4), 16);
    b = parseInt(clean.slice(4, 6), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/**
 * Format a hex color with an opacity value as a CSS rgba() string.
 * @param {string} hex
 * @param {number} opacity - 0 to 1
 * @returns {string}
 */
function hexWithOpacity(hex, opacity) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Generate opacity variant tokens for a set of base color tokens.
 * @param {Object} tokens - flat token map { name: value }
 * @param {number[]} steps - opacity levels, e.g. [10, 20, 50, 90]
 * @returns {Object} new tokens with opacity variants appended
 */
function applyOpacityVariants(tokens, steps = [10, 20, 30, 50, 70, 90]) {
  const result = {};
  for (const [name, value] of Object.entries(tokens)) {
    result[name] = value;
    if (typeof value === 'string' && value.startsWith('#')) {
      for (const step of steps) {
        result[`${name}-${step}`] = hexWithOpacity(value, step / 100);
      }
    }
  }
  return result;
}

/**
 * Convert all hex color tokens to HSL CSS strings.
 * @param {Object} tokens
 * @returns {Object}
 */
function applyHslConversion(tokens) {
  const result = {};
  for (const [name, value] of Object.entries(tokens)) {
    if (typeof value === 'string' && value.startsWith('#')) {
      const { h, s, l } = hexToHsl(value);
      result[name] = `hsl(${h}, ${s}%, ${l}%)`;
    } else {
      result[name] = value;
    }
  }
  return result;
}

module.exports = { hexToHsl, hexWithOpacity, applyOpacityVariants, applyHslConversion };
