/**
 * Animation/transition token extractor
 * Handles easing curves, durations, and transition definitions from Figma
 */

/**
 * Map Figma easing type to CSS easing function
 * @param {string} easingType - Figma easing type identifier
 * @param {number[]} [handles] - Control point handles for cubic-bezier
 * @returns {string} CSS easing value
 */
function mapEasingToCss(easingType, handles = []) {
  const easingMap = {
    LINEAR: 'linear',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_AND_OUT: 'ease-in-out',
    EASE_IN_BACK: 'cubic-bezier(0.36, 0, 0.66, -0.56)',
    EASE_OUT_BACK: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    EASE_IN_AND_OUT_BACK: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  };

  if (easingType === 'CUSTOM_CUBIC_BEZIER' && handles.length === 4) {
    const [x1, y1, x2, y2] = handles.map((v) => Math.round(v * 1000) / 1000);
    return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
  }

  return easingMap[easingType] || 'ease';
}

/**
 * Format a duration value in milliseconds to a CSS time string
 * @param {number} ms - Duration in milliseconds
 * @returns {string} CSS time value (e.g. "200ms" or "0.2s")
 */
function formatDuration(ms) {
  if (ms >= 1000 && ms % 1000 === 0) {
    return `${ms / 1000}s`;
  }
  return `${ms}ms`;
}

/**
 * Extract animation tokens from a single Figma transition node
 * @param {object} node - Figma node with transition data
 * @param {string} prefix - Token name prefix
 * @returns {object} Flat token map
 */
function extractAnimationTokens(node, prefix = '') {
  const tokens = {};
  const transition = node.transitionNodeID ? node : null;

  if (!transition) return tokens;

  const baseName = prefix
    ? `${prefix}-${node.name}`
    : node.name;

  const normalized = baseName
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (node.transitionDuration !== undefined) {
    tokens[`${normalized}-duration`] = formatDuration(node.transitionDuration);
  }

  if (node.transitionEasing) {
    const { type, easingFunctionCubicBezier } = node.transitionEasing;
    const handles = easingFunctionCubicBezier
      ? [
          easingFunctionCubicBezier.x1,
          easingFunctionCubicBezier.y1,
          easingFunctionCubicBezier.x2,
          easingFunctionCubicBezier.y2,
        ]
      : [];
    tokens[`${normalized}-easing`] = mapEasingToCss(type, handles);
  }

  return tokens;
}

/**
 * Walk all nodes in a Figma document and extract animation tokens
 * @param {object} figmaDocument - Root Figma document node
 * @param {string} [prefix] - Optional prefix to filter nodes
 * @returns {object} Flat map of animation tokens
 */
function extractAllAnimationTokens(figmaDocument, prefix = '') {
  const tokens = {};

  function walk(node) {
    if (!node) return;

    const nodeTokens = extractAnimationTokens(node, prefix);
    Object.assign(tokens, nodeTokens);

    if (Array.isArray(node.children)) {
      node.children.forEach(walk);
    }
  }

  walk(figmaDocument);
  return tokens;
}

module.exports = {
  mapEasingToCss,
  formatDuration,
  extractAnimationTokens,
  extractAllAnimationTokens,
};
