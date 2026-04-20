# Transform Module

This directory contains token transformation utilities for inkdrop-cli.

## Modules

### `index.js`
Core pipeline: `normalizeNames`, `filterByPrefix`, `stripPrefix`, `applyTransforms`.

### `alias.js`
Resolves Figma alias references (`{token.name}`) to their concrete values.
Exports: `isAlias`, `parseAlias`, `resolveAlias`, `resolveAliases`.

### `scale.js`
Handles unit conversion (px → rem) and value scaling.
Exports: `pxToRem`, `scaleValue`, `applyScaleTransforms`.

### `typography.js`
Extracts typography tokens (fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, textCase) from Figma TEXT nodes.
Exports: `extractTypographyTokens`, `mapTextCase`, `extractAllTypographyTokens`.

### `shadow.js`
Converts Figma `effects` (DROP_SHADOW, INNER_SHADOW) to CSS `box-shadow` strings.
Exports: `shadowToCss`, `extractShadowTokens`, `extractAllShadowTokens`.

### `border.js`
Extracts border/stroke values from Figma nodes and formats them as CSS border shorthand.
Exports: `extractBorderValue`, `extractAllBorderTokens`.

### `gradient.js`
Converts Figma gradient fills (linear, radial, angular) to CSS gradient strings.
Exports: `gradientStopToCss`, `gradientToCss`, `extractGradientTokens`, `extractAllGradientTokens`.

### `spacing.js`
Extracts padding and gap (itemSpacing) values from Figma FRAME nodes and formats them as CSS shorthand.
Exports: `extractSpacingValue`, `spacingToCss`, `extractAllSpacingTokens`.

## Usage

```js
const { applyTransforms } = require('./index');
const tokens = applyTransforms(rawTokens, config);
```

## Token Naming Convention

All extracted tokens use dot-notation keys, e.g.:
- `color.primary.500`
- `typography.heading.fontSize`
- `spacing.button.padding`
- `shadow.card.default`
