const https = require('https');

const FIGMA_API_BASE = 'api.figma.com';
const FIGMA_API_VERSION = 'v1';

/**
 * Makes an authenticated request to the Figma REST API.
 * @param {string} path - API path (e.g. '/files/:key')
 * @param {string} token - Figma personal access token
 * @returns {Promise<object>} Parsed JSON response
 */
function figmaRequest(path, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: FIGMA_API_BASE,
      path: `/${FIGMA_API_VERSION}${path}`,
      method: 'GET',
      headers: {
        'X-Figma-Token': token,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(new Error(`Failed to parse Figma API response: ${err.message}`));
          }
        } else if (res.statusCode === 403) {
          reject( Figma token or insufficient permissions.'));
        } else if (res.statusCode === 404) {
          reject(new Error(` path: ${path}`));
        } else {
          reject(new Error(`Figma API error: HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Network error contacting Figma API: ${err.message}`));
    });

    req.end();
  });
}

/**
 * Fetches a Figma file by its key.
 * @param {string} fileKey - The Figma file key
 * @param {string} token - Figma personal access token
 * @returns {Promise<object>} Figma file data
 */
async function fetchFile(fileKey, token) {
  if (!fileKey) throw new Error('fileKey is required.');
  if (!token) throw new Error('Figma token is required.');
  return figmaRequest(`/files/${fileKey}`, token);
}

/**
 * Fetches local styles defined in a Figma file.
 * @param {string} fileKey - The Figma file key
 * @param {string} token - Figma personal access token
 * @returns {Promise<object[]>} Array of style metadata objects
 */
async function fetchLocalStyles(fileKey, token) {
  if (!fileKey) throw new Error('fileKey is required.');
  if (!token) throw new Error('Figma token is required.');
  const data = await figmaRequest(`/files/${fileKey}/styles`, token);
  return data.meta?.styles ?? [];
}

module.exports = { fetchFile, fetchLocalStyles, figmaRequest };
