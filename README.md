# inkdrop-cli

> Command-line tool to export and batch-convert design tokens from Figma to CSS/JSON formats

---

## Installation

```bash
npm install -g inkdrop-cli
```

## Usage

Authenticate with your Figma personal access token, then point the CLI at a file to export tokens.

```bash
# Set your Figma access token
inkdrop auth --token YOUR_FIGMA_TOKEN

# Export design tokens from a Figma file
inkdrop export --file-id abc123xyz --format css --output ./tokens

# Export as JSON
inkdrop export --file-id abc123xyz --format json --output ./tokens/tokens.json
```

### Options

| Flag | Description |
|------|-------------|
| `--file-id` | Figma file ID (found in the file URL) |
| `--format` | Output format: `css`, `json` (default: `json`) |
| `--output` | Output path for generated files |
| `--watch` | Watch for Figma file changes and re-export automatically |

### Example Output

```css
/* tokens/variables.css */
:root {
  --color-primary: #4f46e5;
  --color-background: #ffffff;
  --spacing-sm: 8px;
  --font-size-base: 16px;
}
```

## Requirements

- Node.js >= 16
- A [Figma personal access token](https://www.figma.com/developers/api#access-tokens)

## License

[MIT](./LICENSE)