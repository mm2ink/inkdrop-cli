import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';
import { ensureDir, serialize, writeTokens } from './writer.js';

vi.mock('fs/promises', () => ({
  default: {
    mkdir: vi.fn().mockResolvedValue(undefined),
    writeFile: vi.fn().mockResolvedValue(undefined),
  },
}));

import fs from 'fs/promises';

describe('ensureDir', () => {
  it('creates directory recursively', async () => {
    await ensureDir('/some/deep/path');
    expect(fs.mkdir).toHaveBeenCalledWith('/some/deep/path', { recursive: true });
  });
});

describe('serialize', () => {
  it('serializes tokens to CSS string', () => {
    const tokens = [{ name: 'color-primary', value: '#ff0000' }];
    const result = serialize(tokens, 'css');
    expect(result).toContain('--color-primary');
    expect(result).toContain('#ff0000');
  });

  it('serializes tokens to JSON string', () => {
    const tokens = [{ name: 'color.primary', value: '#ff0000' }];
    const result = serialize(tokens, 'json');
    const parsed = JSON.parse(result);
    expect(parsed).toBeDefined();
  });

  it('throws on unsupported format', () => {
    expect(() => serialize([], 'xml')).toThrow('Unsupported format: xml');
  });
});

describe('writeTokens', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('writes CSS file to output directory', async () => {
    const tokens = [{ name: 'color-primary', value: '#ff0000' }];
    await writeTokens(tokens, { format: 'css', outputDir: './tokens' });
    expect(fs.mkdir).toHaveBeenCalledWith('./tokens', { recursive: true });
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join('./tokens', 'tokens.css'),
      expect.any(String),
      'utf8'
    );
  });

  it('writes JSON file to output directory', async () => {
    const tokens = [{ name: 'color.primary', value: '#ff0000' }];
    await writeTokens(tokens, { format: 'json', outputDir: './tokens' });
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join('./tokens', 'tokens.json'),
      expect.any(String),
      'utf8'
    );
  });
});
