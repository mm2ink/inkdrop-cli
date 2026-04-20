# `src/transform`

This directory contains token transformation utilities used in the inkdrop-cli pipeline.

## Modules

### `index.js`
Core transforms: name normalization, prefix filtering/stripping, and the `applyTransforms` pipeline function.

### `alias.js`
Alias resolution — detects `{token.path}` style references in token values and resolves them against the full token map.

### `scale.js`
Numeric scaling utilities:
- `pxToRem(value, base?)` — converts `px` string values to `rem`
- `scaleValue(value, factor)` — multiplies a numeric token value by a factor
- `applyScaleTransforms(tokens, options)` — applies remify and/or scaleFactor across a flat token map

**Options:**
| Option | Type | Description |
|---|---|---|
| `remify` | boolean | Convert `px` values to `rem` |
| `remBase` | number | Base font size for rem conversion (default: `16`) |
| `scaleFactor` | number | Multiply all numeric values by this factor |

### `typography.js`
Typography token extraction from Figma text style nodes:
- `extractTypographyTokens(name, style)` — maps a single Figma text style to flat token entries
- `mapTextCase(textCase)` — converts Figma `textCase` enum to CSS `text-transform` value
- `extractAllTypographyTokens(stylesMap)` — processes a full Figma styles map and returns all TEXT-type tokens

## Transform Pipeline

All transforms operate on a **flat token map**: `{ 'token.name': 'value' }`.

The recommended order when building a pipeline:
1. Extract raw tokens (via `src/figma/tokens.js` or `typography.js`)
2. Resolve aliases (`alias.js`)
3. Filter/strip prefixes (`index.js`)
4. Apply scale transforms (`scale.js`)
5. Output to CSS or JSON (`src/output/`)
