/**
 * Typography token extraction and normalization helpers.
 * Handles Figma text style nodes and maps them to flat token entries.
 */

/**
 * Map a Figma text style node to a flat token map.
 * @param {string} name - token name (already normalized)
 * @param {Object} style - Figma style object
 * @returns {Object} flat token entries
 */
function extractTypographyTokens(name, style) {
  const tokens = {};
  const key = name.toLowerCase().replace(/\s+/g, '-');

  if (style.fontFamily) tokens[`${key}.font-family`] = style.fontFamily;
  if (style.fontWeight !== undefined) tokens[`${key}.font-weight`] = style.fontWeight;
  if (style.fontSize !== undefined) tokens[`${key}.font-size`] = `${style.fontSize}px`;
  if (style.lineHeightPx !== undefined) tokens[`${key}.line-height`] = `${style.lineHeightPx}px`;
  if (style.letterSpacing !== undefined) tokens[`${key}.letter-spacing`] = `${style.letterSpacing}px`;
  if (style.textCase) tokens[`${key}.text-transform`] = mapTextCase(style.textCase);
  if (style.textDecoration) tokens[`${key}.text-decoration`] = style.textDecoration.toLowerCase();

  return tokens;
}

/**
 * Map Figma textCase enum to CSS text-transform value.
 * @param {string} textCase
 * @returns {string}
 */
function mapTextCase(textCase) {
  const map = {
    UPPER: 'uppercase',
    LOWER: 'lowercase',
    TITLE: 'capitalize',
    ORIGINAL: 'none',
  };
  return map[textCase] || 'none';
}

/**
 * Extract all typography tokens from a Figma styles map.
 * @param {Object} stylesMap - { nodeId: { name, style } }
 * @returns {Object} flat token map
 */
function extractAllTypographyTokens(stylesMap) {
  const tokens = {};
  for (const [, entry] of Object.entries(stylesMap)) {
    if (entry.styleType !== 'TEXT') continue;
    const normalized = entry.name.replace(/\//g, '.').toLowerCase().replace(/\s+/g, '-');
    Object.assign(tokens, extractTypographyTokens(normalized, entry.style || {}));
  }
  return tokens;
}

module.exports = { extractTypographyTokens, mapTextCase, extractAllTypographyTokens };
