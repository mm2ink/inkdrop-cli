/**
 * Handles writing output files to disk
 */

const fs = require('fs');
const path = require('path');
const { tokensToCss } = require('./css');
const { tokensToJson } = require('./json');

const SUPPORTED_FORMATS = ['css', 'json'];

/**
 * Ensures a directory exists, creating it recursively if needed
 * @param {string} dirPath
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Serializes tokens to the given format string
 * @param {Record<string, string>} tokens
 * @param {'css'|'json'} format
 * @param {object} options - Format-specific options
 * @returns {string}
 */
function serialize(tokens, format, options = {}) {
  if (!SUPPORTED_FORMATS.includes(format)) {
    throw new Error(`Unsupported format: "${format}". Must be one of: ${SUPPORTED_FORMATS.join(', ')}`);
  }
  if (format === 'css') return tokensToCss(tokens, options);
  if (format === 'json') return tokensToJson(tokens, options);
}

/**
 * Writes tokens to a file
 * @param {Record<string, string>} tokens
 * @param {string} outputPath - Full file path
 * @param {'css'|'json'} format
 * @param {object} options - Format-specific options
 */
function writeTokens(tokens, outputPath, format, options = {}) {
  const content = serialize(tokens, format, options);
  ensureDir(path.dirname(outputPath));
  fs.writeFileSync(outputPath, content, 'utf8');
  return outputPath;
}

module.exports = { writeTokens, serialize, ensureDir, SUPPORTED_FORMATS };
