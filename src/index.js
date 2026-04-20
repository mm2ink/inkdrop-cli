#!/usr/bin/env node

/**
 * inkdrop-cli — Main entry point
 *
 * Parses CLI arguments, loads config, fetches tokens from Figma,
 * and writes the output in the requested format(s).
 */

'use strict';

const path = require('path');
const { loadConfig } = require('./config');
const { fetchTokens } = require('./figma');
const { writeTokens } = require('./output/writer');

// ── Argument parsing ────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = {
    config: 'inkdrop.config.js',
    format: null,   // css | json | both (defaults to config value)
    output: null,   // output directory override
    help: false,
    version: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      opts.help = true;
    } else if (arg === '--version' || arg === '-v') {
      opts.version = true;
    } else if ((arg === '--config' || arg === '-c') && args[i + 1]) {
      opts.config = args[++i];
    } else if ((arg === '--format' || arg === '-f') && args[i + 1]) {
      opts.format = args[++i];
    } else if ((arg === '--output' || arg === '-o') && args[i + 1]) {
      opts.output = args[++i];
    }
  }

  return opts;
}

function printHelp() {
  console.log(`
inkdrop — Export design tokens from Figma

Usage:
  inkdrop [options]

Options:
  -c, --config <file>   Path to config file  (default: inkdrop.config.js)
  -f, --format <fmt>    Output format: css | json | both
  -o, --output <dir>    Output directory override
  -v, --version         Print version
  -h, --help            Show this help message
`.trim());
}

function printVersion() {
  const pkg = require('../package.json');
  console.log(`inkdrop v${pkg.version}`);
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const opts = parseArgs(process.argv);

  if (opts.help) {
    printHelp();
    process.exit(0);
  }

  if (opts.version) {
    printVersion();
    process.exit(0);
  }

  // Resolve config file relative to cwd
  const configPath = path.resolve(process.cwd(), opts.config);
  let config;
  try {
    config = loadConfig(configPath);
  } catch (err) {
    console.error(`[inkdrop] Failed to load config: ${err.message}`);
    process.exit(1);
  }

  // CLI flags override config values
  if (opts.format) config.format = opts.format;
  if (opts.output) config.outputDir = opts.output;

  const format = config.format || 'both';
  const validFormats = ['css', 'json', 'both'];
  if (!validFormats.includes(format)) {
    console.error(`[inkdrop] Invalid format "${format}". Choose from: ${validFormats.join(', ')}`);
    process.exit(1);
  }

  console.log(`[inkdrop] Fetching tokens from Figma file ${config.figmaFileId} …`);

  let tokens;
  try {
    tokens = await fetchTokens(config);
  } catch (err) {
    console.error(`[inkdrop] Figma fetch failed: ${err.message}`);
    process.exit(1);
  }

  console.log(`[inkdrop] Extracted ${Object.keys(tokens).length} token(s).`);

  try {
    await writeTokens(tokens, { ...config, format });
  } catch (err) {
    console.error(`[inkdrop] Failed to write output: ${err.message}`);
    process.exit(1);
  }

  console.log('[inkdrop] Done.');
}

main();
