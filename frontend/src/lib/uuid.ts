/**
 * The canonical 8-4-4-4-12 hex form, any version, either case. Mirrors the
 * backend's `@IsUUID` / `ParseUUIDPipe` shape closely enough that a value this
 * rejects would be a 4xx there.
 */
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Whether `value` is a UUID, so it can be sent to the server as an id. */
export function isUuid(value: string | null | undefined): value is string {
  return typeof value === 'string' && UUID_PATTERN.test(value);
}

/**
 * A random v4 UUID for a client-side id. `crypto.randomUUID` exists only in a
 * secure context (HTTPS or localhost), so a self-hosted instance served over
 * plain HTTP on a LAN has none and calling it throws; `getRandomValues` is
 * available in every context and gives the same 122 random bits.
 */
export function randomUuid(): string {
  const webCrypto = globalThis.crypto;
  if (typeof webCrypto.randomUUID === 'function') {
    return webCrypto.randomUUID();
  }
  const bytes = webCrypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // RFC 4122 variant
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
