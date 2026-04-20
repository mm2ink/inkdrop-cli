# Transform Module

This directory contains token transformation utilities for inkdrop-cli.

## Modules

### `index.js`
Core transform pipeline: `normalizeNames`, `filterByPrefix`, `stripPrefix`, `applyTransforms`.

### `alias.js`
Resolves Figma token aliases (references) to their concrete values.
Exports: `isAlias`, `parseAlias`, `resolveAlias`, `resolveAliases`

### `scale.js`
Handles unit scaling (px → rem) for spacing, sizing, and typography tokens.
Exports: `pxToRem`, `scaleValue`, `applyScaleTransforms`

### `typography.js`
Extracts and normalises Figma text-style nodes into typography tokens.
Exports: `extractTypographyTokens`, `mapTextCase`, `extractAllTypographyTokens`

### `shadow.js`
Converts Figma DROP_SHADOW effects into CSS `box-shadow` token values.
Exports: `shadowToCss`, `extractShadowTokens`, `extractAllShadowTokens`

### `border.js`
Converts Figma stroke properties into CSS `border` token values.
Exports: `extractBorderValue`, `extractAllBorderTokens`

## Token Types

| Type | Source | Output |
|------|--------|--------|
| `color` | Fill paints | hex / rgba string |
| `typography` | Text styles | font-* properties |
| `shadow` | DROP_SHADOW effects | box-shadow string |
| `border` | Strokes | border shorthand |
| `spacing` | Numeric values | px / rem |
