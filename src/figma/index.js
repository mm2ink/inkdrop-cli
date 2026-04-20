/**
 * figma/index.js
 * Public entry point for all Figma-related operations used by inkdrop-cli.
 * Wraps the low-level client with higher-level helpers.
 */

const { fetchFile, fetchLocalStyles } = require('./client');

/**
 * Retrieves raw design token candidates from a Figma file.
 * Combines file document data with local style metadata.
 *
 * @param {object} options
 * @param {string} options.fileKey  - Figma file key (from URL or config)
 * @param {string} options.token   - Figma personal access token
 * @returns {Promise<{ document: object, styles: object[] }>}
 */
async function getTokenSource({ fileKey, token }) {
  if (!fileKey) throw new Error('options.fileKey is required.');
  if (!token) throw new Error('options.token is required.');

  const [file, styles] = await Promise.all([
    fetchFile(fileKey, token),
    fetchLocalStyles(fileKey, token),
  ]);

  return {
    document: file.document ?? {},
    name: file.name ?? 'Untitled',
    styles,
  };
}

/**
 * Validates that the provided Figma credentials can reach the given file.
 * Useful as a pre-flight check before a full export run.
 *
 * @param {string} fileKey
 * @param {string} token
 * @returns {Promise<boolean>}
 */
async function validateCredentials(fileKey, token) {
  try {
    await fetchFile(fileKey, token);
    return true;
  } catch (err) {
    if (
      err.message.includes('Invalid Figma token') ||
      err.message.includes('not found')
    ) {
      return false;
    }
    throw err;
  }
}

module.exports = { getTokenSource, validateCredentials };
