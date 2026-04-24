# Token Transformers

This directory contains individual transformer modules for each design token category supported by inkdrop-cli.

## Available Transformers

| Module | Handles |
|---|---|
| `alias.js` | Token alias resolution (`{color.primary}` → value) |
| `animation.js` | Easing curves, durations, transitions |
| `border.js` | Border width, style, radius shorthand |
| `breakpoint.js` | Responsive breakpoint values |
| `color.js` | HSL conversion, opacity variants |
| `gradient.js` | Linear/radial gradient tokens |
| `grid.js` | Grid columns, gutters, layout widths |
| `opacity.js` | Opacity scale tokens |
| `radius.js` | Border-radius tokens |
| `scale.js` | px → rem conversion |
| `shadow.js` | Box-shadow tokens |
| `spacing.js` | Spacing scale tokens |
| `typography.js` | Font family, size, weight, line-height |
| `zindex.js` | Z-index scale tokens |

## Usage

Each transformer exports an `extractAll*Tokens(tokens)` function that accepts the full token map and returns a flat `{ 'category.name': 'cssValue' }` object.

```js
const { extractAllGridTokens } = require('./grid');
const gridTokens = extractAllGridTokens(allTokens);
// { 'grid.base': '8px', 'grid.desktop': 'repeat(12, 1fr)', ... }
```

Transformers are composed in `src/transform/index.js` via `applyTransforms`.

## Adding a New Transformer

1. Create `src/transform/<category>.js` exporting `extractAll<Category>Tokens`.
2. Add a corresponding `<category>.test.js`.
3. Import and call your extractor inside `applyTransforms` in `index.js`.
