/**
 * Spacing token extraction and transformation utilities.
 * Converts Figma spacing/padding values to design tokens.
 */

const { pxToRem } = require('./scale');

/**
 * Extract spacing value from a Figma node's padding or spacing properties.
 * @param {object} node - Figma node
 * @returns {object|null} spacing token or null
 */
function extractSpacingValue(node) {
  if (!node || node.type !== 'FRAME') return null;

  const {
    paddingTop = 0,
    paddingRight = 0,
    paddingBottom = 0,
    paddingLeft = 0,
    itemSpacing = 0,
  } = node;

  return {
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    itemSpacing,
  };
}

/**
 * Format a spacing token value as a CSS shorthand string.
 * @param {object} spacing - spacing values object
 * @param {boolean} useRem - whether to convert px to rem
 * @returns {string} CSS shorthand value
 */
function spacingToCss(spacing, useRem = false) {
  const convert = useRem ? pxToRem : (v) => `${v}px`;
  const { paddingTop, paddingRight, paddingBottom, paddingLeft } = spacing;

  if (
    paddingTop === paddingRight &&
    paddingRight === paddingBottom &&
    paddingBottom === paddingLeft
  ) {
    return convert(paddingTop);
  }

  if (paddingTop === paddingBottom && paddingLeft === paddingRight) {
    return `${convert(paddingTop)} ${convert(paddingRight)}`;
  }

  return `${convert(paddingTop)} ${convert(paddingRight)} ${convert(paddingBottom)} ${convert(paddingLeft)}`;
}

/**
 * Extract all spacing tokens from a list of Figma nodes.
 * @param {Array} nodes - Figma nodes array
 * @param {boolean} useRem - convert to rem
 * @returns {object} flat token map
 */
function extractAllSpacingTokens(nodes, useRem = false) {
  const tokens = {};

  for (const node of nodes) {
    const spacing = extractSpacingValue(node);
    if (!spacing) continue;

    const name = node.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    tokens[`spacing.${name}.padding`] = spacingToCss(spacing, useRem);

    if (spacing.itemSpacing > 0) {
      const gap = useRem ? pxToRem(spacing.itemSpacing) : `${spacing.itemSpacing}px`;
      tokens[`spacing.${name}.gap`] = gap;
    }
  }

  return tokens;
}

module.exports = { extractSpacingValue, spacingToCss, extractAllSpacingTokens };
