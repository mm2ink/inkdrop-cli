import { describe, it, expect } from 'vitest';
import {
  normalizeNames,
  filterByPrefix,
  stripPrefix,
  applyTransforms,
} from './index.js';

const sampleTokens = [
  { name: 'Color Primary', value: '#ff0000' },
  { name: 'Color Secondary', value: '#00ff00' },
  { name: 'Spacing Large', value: '24px' },
];

describe('normalizeNames', () => {
  it('lowercases token names', () => {
    const result = normalizeNames(sampleTokens);
    result.forEach((t) => expect(t.name).toBe(t.name.toLowerCase()));
  });

  it('replaces spaces with hyphens', () => {
    const result = normalizeNames(sampleTokens);
    result.forEach((t) => expect(t.name).not.toContain(' '));
    expect(result[0].name).toBe('color-primary');
  });

  it('preserves token values', () => {
    const result = normalizeNames(sampleTokens);
    expect(result[0].value).toBe('#ff0000');
  });
});

describe('filterByPrefix', () => {
  it('returns only tokens matching prefix', () => {
    const normalized = normalizeNames(sampleTokens);
    const result = filterByPrefix(normalized, 'color');
    expect(result).toHaveLength(2);
    expect(result.every((t) => t.name.startsWith('color'))).toBe(true);
  });

  it('returns all tokens when prefix is empty', () => {
    const result = filterByPrefix(sampleTokens, '');
    expect(result).toHaveLength(sampleTokens.length);
  });
});

describe('stripPrefix', () => {
  it('removes prefix from token names', () => {
    const tokens = [{ name: 'color-primary', value: '#ff0000' }];
    const result = stripPrefix(tokens, 'color');
    expect(result[0].name).toBe('primary');
  });

  it('does not modify tokens without the prefix', () => {
    const tokens = [{ name: 'spacing-large', value: '24px' }];
    const result = stripPrefix(tokens, 'color');
    expect(result[0].name).toBe('spacing-large');
  });
});

describe('applyTransforms', () => {
  it('applies full pipeline with prefix and strip', () => {
    const result = applyTransforms(sampleTokens, {
      prefix: 'color',
      stripPrefix: true,
    });
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('primary');
    expect(result[1].name).toBe('secondary');
  });

  it('returns all normalized tokens with no options', () => {
    const result = applyTransforms(sampleTokens);
    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('color-primary');
  });
});
