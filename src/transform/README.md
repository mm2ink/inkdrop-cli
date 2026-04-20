# Token Transforms

This directory contains all token transformation modules used by inkdrop-cli.

## Modules

### `index.js`
Core pipeline: `normalizeNames`, `filterByPrefix`, `stripPrefix`, `applyTransforms`.

### `alias.js`
Resolves `{token.reference}` style aliases within a token set.
Exports: `isAlias`, `parseAlias`, `resolveAlias`, `resolveAliases`.

### `scale.js`
Converts `px` values to `rem` and applies numeric scaling.
Exports: `pxToRem`, `scaleValue`, `applyScaleTransforms`.

### `color.js`
Color utilities: opacity variants, HSL conversion.
Exports: `hexToHsl`, `hexWithOpacity`, `applyOpacityVariants`, `applyHslConversion`.

**Usage example:**
```js
const { applyOpacityVariants } = require('./color');
const tokens = { 'color-brand': '#0066cc' };
const expanded = applyOpacityVariants(tokens, [10, 50, 90]);
// { 'color-brand': '#0066cc', 'color-brand-10': 'rgba(0,102,204,0.1)', ... }
```

### `typography.js`
Extracts typography tokens from Figma text styles.
Exports: `extractTypographyTokens`, `mapTextCase`, `extractAllTypographyTokens`.

### `shadow.js`
Converts Figma effect objects to CSS `box-shadow` values.
Exports: `shadowToCss`, `extractShadowTokens`, `extractAllShadowTokens`.

### `border.js`
Extracts border/stroke tokens from Figma components.
Exports: `extractBorderValue`, `extractAllBorderTokens`.

### `gradient.js`
Converts Figma gradient fills to CSS gradient strings.
Exports: `gradientStopToCss`, `gradientToCss`, `extractGradientTokens`, `extractAllGradientTokens`.

### `spacing.js`
Extracts spacing/layout tokens from Figma auto-layout frames.
Exports: `extractSpacingValue`, `spacingToCss`, `extractAllSpacingTokens`.

### `animation.js`
Extracts transition/animation tokens from Figma prototype interactions.
Exports: `mapEasingToCss`, `formatDuration`, `extractAnimationTokens`, `extractAllAnimationTokens`, `walk`.

## Transform Pipeline

All transforms are composed in `index.js` via `applyTransforms(tokens, config)`.
The `config` object controls which transforms are active:

```js
{
  prefix: 'ds',          // filter and strip token prefix
  normalize: true,       // kebab-case names
  resolveAliases: true,  // resolve {alias} references
  scale: { base: 16 },   // px → rem conversion
  opacitySteps: [10, 50, 90] // generate opacity variants
}
```
