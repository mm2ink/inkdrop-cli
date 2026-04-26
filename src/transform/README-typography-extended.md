# Extended Typography Transforms

This document covers the extended typography token transformers: **letter spacing** and **text decoration**.

## Letter Spacing (`letterSpacing.js`)

Converts Figma letter spacing values to CSS `letter-spacing` tokens.

### Units

| Figma Unit | CSS Output | Notes |
|------------|-----------|-------|
| `PERCENT`  | `em`      | `value / 100` |
| `PIXELS`   | `px`      | Direct mapping |

### Usage

```js
const { parseLetterSpacingValue, extractAllLetterSpacingTokens } = require('./letterSpacing');

// Single value
parseLetterSpacingValue(5, 'PERCENT'); // '0.0500em'
parseLetterSpacingValue(2, 'PIXELS'); // '2px'

// From nested Figma styles
const tokens = extractAllLetterSpacingTokens(figmaStyles);
// { 'typography.letterSpacing.sm': '0.0200em', ... }
```

### Token Naming

Tokens are extracted when the key path contains `letter` or `tracking`.

---

## Text Decoration (`textDecoration.js`)

Maps Figma text decoration constants to CSS `text-decoration` values.

### Mapping

| Figma Value    | CSS Value     |
|----------------|---------------|
| `NONE`         | `none`        |
| `UNDERLINE`    | `underline`   |
| `OVERLINE`     | `overline`    |
| `STRIKETHROUGH`| `line-through`|
| `LINE_THROUGH` | `line-through`|

### Usage

```js
const { mapTextDecoration, extractAllTextDecorationTokens } = require('./textDecoration');

mapTextDecoration('UNDERLINE'); // 'underline'
mapTextDecoration('STRIKETHROUGH'); // 'line-through'

const tokens = extractAllTextDecorationTokens(figmaStyles);
// { 'typography.textDecoration.link': 'underline', ... }
```

### Token Naming

Tokens are extracted when the key path contains `decoration`, `underline`, or `strikethrough`.
