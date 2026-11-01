import { describe, it, expect, vi, afterEach } from 'vitest';
import { isUuid, randomUuid } from './uuid';

describe('isUuid', () => {
  it('accepts a UUID in either case', () => {
    expect(isUuid('3f2504e0-4f89-11d3-9a0c-0305e82c3301')).toBe(true);
    expect(isUuid('3F2504E0-4F89-11D3-9A0C-0305E82C3301')).toBe(true);
  });

  it('rejects a synthetic key, a truncated id and a padded one', () => {
    expect(isUuid('temp-1')).toBe(false);
    expect(isUuid('override-0')).toBe(false);
    expect(isUuid('3f2504e0-4f89-11d3-9a0c-0305e82c330')).toBe(false);
    expect(isUuid(' 3f2504e0-4f89-11d3-9a0c-0305e82c3301')).toBe(false);
  });

  it('rejects an absent value', () => {
    expect(isUuid(null)).toBe(false);
    expect(isUuid(undefined)).toBe(false);
    expect(isUuid('')).toBe(false);
  });
});

describe('randomUuid', () => {
  const V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses crypto.randomUUID where the context has it', () => {
    const randomUUID = vi.fn(() => '3f2504e0-4f89-41d3-9a0c-0305e82c3301');
    vi.stubGlobal('crypto', { randomUUID, getRandomValues: crypto.getRandomValues.bind(crypto) });

    expect(randomUuid()).toBe('3f2504e0-4f89-41d3-9a0c-0305e82c3301');
    expect(randomUUID).toHaveBeenCalledTimes(1);
  });

  // A page served over plain HTTP (not localhost) is not a secure context, so
  // the browser leaves crypto.randomUUID undefined; calling it threw
  // "crypto.randomUUID is not a function" and took the rules page down.
  it('builds a v4 UUID from getRandomValues outside a secure context', () => {
    vi.stubGlobal('crypto', { getRandomValues: crypto.getRandomValues.bind(crypto) });

    const ids = Array.from({ length: 50 }, () => randomUuid());
    ids.forEach((id) => expect(id).toMatch(V4));
    expect(new Set(ids).size).toBe(ids.length);
  });
});
