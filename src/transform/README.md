# Token Transforms

This directory contains per-category token extraction and transformation modules used by inkdrop-cli.

## Modules

| Module | Description |
|---|---|
| `alias.js` | Resolve `{token.reference}` aliases within token sets |
| `animation.js` | Extract easing and duration animation tokens |
| `border.js` | Extract border shorthand tokens |
| `breakpoint.js` | Extract responsive breakpoint tokens |
| `color.js` | HSL conversion and opacity variant helpers |
| `gradient.js` | Extract linear/radial gradient tokens |
| `opacity.js` | Extract opacity tokens |
| `radius.js` | Extract border-radius tokens |
| `scale.js` | px → rem conversion and value scaling |
| `shadow.js` | Extract box-shadow tokens |
| `spacing.js` | Extract spacing/gap tokens |
| `typography.js` | Extract font-family, size, weight, line-height tokens |
| `zindex.js` | Extract z-index tokens |
| `index.js` | Orchestrates all transforms via `applyTransforms` |

## Usage

```js
const { applyTransforms } = require('./index');

const transformed = applyTransforms(rawTokens, config);
```

## Radius tokens

The `radius.js` module handles border-radius values:

- Plain numbers are treated as `px` values.
- The special keywords `full` and `pill` map to `9999px`.
- Strings with existing units (e.g. `0.5rem`) are passed through unchanged.

```js
const { extractRadiusValue } = require('./radius');

extractRadiusValue(8);       // '8px'
extractRadiusValue('full');  // '9999px'
extractRadiusValue('0.5rem'); // '0.5rem'
```
