/**
 * Extracts and normalizes design tokens from Figma API response data.
 */

/**
 * Recursively extract color styles from Figma node tree.
 * @param {Object} node - Figma document node
 * @param {Object} styles - Collected styles map from Figma file
 * @returns {Object} flat map of token name -> token value
 */
function extractColorTokens(node, styles = {}) {
  const tokens = {};

  if (node.fills && node.fills.length > 0 && node.styles && node.styles.fill) {
    const styleId = node.styles.fill;
    const styleMeta = styles[styleId];
    if (styleMeta && node.fills[0].type === 'SOLID') {
      const { r, g, b, a = 1 } = node.fills[0].color;
      const name = styleMeta.name.replace(/\//g, '-').replace(/\s+/g, '-').toLowerCase();
      tokens[name] = {
        type: 'color',
        value: rgbaToHex(r, g, b, a),
        raw: { r, g, b, a },
      };
    }
  }

  if (node.children) {
    for (const child of node.children) {
      Object.assign(tokens, extractColorTokens(child, styles));
    }
  }

  return tokens;
}

/**
 * Converts normalized RGBA (0-1 range) to CSS hex string.
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {number} a
 * @returns {string}
 */
function rgbaToHex(r, g, b, a = 1) {
  const toHex = (val) => Math.round(val * 255).toString(16).padStart(2, '0');
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  if (a < 1) {
    return `${hex}${toHex(a)}`;
  }
  return hex;
}

/**
 * Extract all design tokens from a Figma file response.
 * @param {Object} figmaFile - Full Figma file API response
 * @returns {Object} normalized tokens grouped by type
 */
function extractTokens(figmaFile) {
  const styles = figmaFile.styles || {};
  const document = figmaFile.document;

  if (!document) {
    throw new Error('Invalid Figma file: missing document node');
  }

  const colors = extractColorTokens(document, styles);

  return { colors };
}

module.exports = { extractTokens, extractColorTokens, rgbaToHex };
