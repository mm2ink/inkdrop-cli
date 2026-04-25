# Token Transformers

This directory contains individual token transformer modules. Each module is responsible for extracting and normalizing a specific category of design tokens from Figma exports into CSS-compatible values.

## Available Transformers

| Module | Token Type | Output Format |
|---|---|---|
| `color.js` | Color tokens | hex / hsl |
| `typography.js` | Typography (font family, size, etc.) | CSS values |
| `lineheight.js` | Line height | unitless / px / `normal` |
| `fontweight.js` | Font weight | numeric (100–900) |
| `spacing.js` | Spacing scale | px / rem |
| `radius.js` | Border radius | px / rem |
| `shadow.js` | Box shadows | CSS box-shadow |
| `border.js` | Borders | CSS border shorthand |
| `gradient.js` | Gradients | CSS gradient functions |
| `animation.js` | Animation tokens | CSS animation values |
| `motion.js` | Motion / easing | CSS transition values |
| `duration.js` | Duration | ms / s |
| `breakpoint.js` | Breakpoints | px |
| `grid.js` | Grid layout | CSS grid values |
| `elevation.js` | Elevation | box-shadow |
| `opacity.js` | Opacity | 0–1 decimal |
| `zindex.js` | Z-index | integer |
| `size.js` | Size scale | px / rem |
| `scale.js` | Scaling utilities | rem conversion |
| `alias.js` | Token aliases | resolved references |

## Conventions

- Each module exports an `extractAll<Type>Tokens(allTokens)` function as its primary entry point.
- Internal helpers like `walk()` traverse nested token trees.
- Token values may be raw primitives or objects with a `value` key (and optional metadata like `unit`).
- All CSS output values are plain strings ready for use in CSS custom properties.

## Adding a New Transformer

1. Create `src/transform/<name>.js` following the pattern above.
2. Export `extractAll<Name>Tokens(allTokens)`.
3. Add tests in `src/transform/<name>.test.js`.
4. Register the transformer in `src/transform/index.js`.
