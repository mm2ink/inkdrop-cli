import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadConfig } from './config.js';

vi.mock('cosmiconfig', () => ({
  cosmiconfig: vi.fn(() => ({
    load: vi.fn(),
    search: vi.fn(),
  })),
}));

import { cosmiconfig } from 'cosmiconfig';

describe('loadConfig', () => {
  let mockExplorer;

  beforeEach(() => {
    mockExplorer = { load: vi.fn(), search: vi.fn() };
    cosmiconfig.mockReturnValue(mockExplorer);
  });

  it('loads and validates a valid config via search', async () => {
    mockExplorer.search.mockResolvedValue({
      config: { figmaToken: 'abc123', fileKey: 'xyz789' },
      isEmpty: false,
    });

    const config = await loadConfig();
    expect(config.figmaToken).toBe('abc123');
    expect(config.fileKey).toBe('xyz789');
    expect(config.output.formats).toEqual(['css', 'json']);
    expect(config.prefix).toBe('--token');
  });

  it('loads config from explicit path', async () => {
    mockExplorer.load.mockResolvedValue({
      config: { figmaToken: 'tok', fileKey: 'key', prefix: '--ds' },
      isEmpty: false,
    });

    const config = await loadConfig('./custom.config.js');
    expect(config.prefix).toBe('--ds');
  });

  it('throws when no config is found', async () => {
    mockExplorer.search.mockResolvedValue(null);
    await expect(loadConfig()).rejects.toThrow('No configuration found');
  });

  it('throws on invalid config (missing required fields)', async () => {
    mockExplorer.search.mockResolvedValue({
      config: { figmaToken: 'abc123' },
      isEmpty: false,
    });

    await expect(loadConfig()).rejects.toThrow('Invalid configuration');
  });

  it('throws on ENOENT error', async () => {
    const err = new Error('not found');
    err.code = 'ENOENT';
    mockExplorer.load.mockRejectedValue(err);

    await expect(loadConfig('./missing.js')).rejects.toThrow('Config file not found');
  });
});
