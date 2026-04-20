/** @type {import('./src/config.js').ConfigSchema} */
export default {
  /**
   * Your Figma personal access token.
   * Generate one at: https://www.figma.com/developers/api#access-tokens
   * Tip: use an environment variable to avoid committing secrets.
   */
  figmaToken: process.env.FIGMA_TOKEN || 'your-figma-token-here',

  /**
   * The key of the Figma file containing your design tokens.
   * Found in the file URL: figma.com/file/<FILE_KEY>/...
   */
  fileKey: 'your-figma-file-key',

  output: {
    /**
     * Directory where exported token files will be written.
     * @default './tokens'
     */
    dir: './tokens',

    /**
     * Output formats to generate.
     * Supported: 'css' | 'json'
     * @default ['css', 'json']
     */
    formats: ['css', 'json'],
  },

  /**
   * Prefix applied to CSS custom property names.
   * e.g. '--token' produces --token-color-primary
   * @default '--token'
   */
  prefix: '--token',
};
