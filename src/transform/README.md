# Token Transforms

This directory contains all token extraction and transformation modules used by inkdrop-cli.

## Modules

| Module | Description |
|---|---|
| `index.js` | Core pipeline: normalize, filter, strip prefix, apply transforms |
| `alias.js` | Resolve `{token.reference}` aliases within token sets |
| `scale.js` | Convert `px` values to `rem` using a configurable base |
| `color.js` | Hex-to-HSL conversion and opacity variant generation |
| `typography.js` | Extract font family, size, weight, line-height tokens |
| `shadow.js` | Convert Figma effect shadows to CSS `box-shadow` strings |
| `border.js` | Extract border width, style, and radius tokens |
| `gradient.js` | Convert Figma gradient paints to CSS gradient strings |
| `spacing.js` | Extract spacing/gap values from auto-layout frames |
| `animation.js` | Map Figma prototype easing and duration to CSS transitions |
| `opacity.js` | Extract numeric opacity values from Figma nodes and styles |
| `zindex.js` | Derive z-index ordering from Figma layer stacking |

## Usage

Each module exports one or more pure functions. The main pipeline in `index.js`
compose these transforms based on the active `inkdrop.config.js`.

```js
const { applyTransforms } = require('./index');

const outputTokens = applyTransforms(rawTokens, config.transforms);
```

## Adding a Transform

1. Create `src/transform/<name>.js` exporting an `extractAll*` function.
2. Write tests in `src/transform/<name>.test.js`.
3. Register the transform key in `src/transform/index.js` under `TRANSFORM_MAP`.
4. Document it in this README.

## Opacity Tokens

The `opacity` module reads either Figma `FILL` styles or traverses the document
tree looking for `FRAME`, `RECTANGLE`, and `COMPONENT` nodes that carry a
numeric `opacity` property. Values are clamped to `[0, 1]` and serialised as
bare numbers (e.g. `0.5`) suitable for CSS `opacity` or `rgba()` usage.
