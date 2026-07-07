/**
 * Client-side AES-256-GCM decryption (mirrors backend crypto.ts).
 */

const IV_LENGTH = 12;

async function deriveKey(secret: string): Promise<CryptoKey> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
  return crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, ['decrypt', 'encrypt']);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export async function decryptPayload<T>(encryptedBase64: string, secret: string): Promise<T> {
  const buffer = base64ToBytes(encryptedBase64);
  const iv = buffer.slice(0, IV_LENGTH);
  const ciphertextWithTag = buffer.slice(IV_LENGTH);
  const key = await deriveKey(secret);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertextWithTag);
  const json = new TextDecoder().decode(decrypted);
  return JSON.parse(json) as T;
}

export async function encryptPayload(data: unknown, secret: string): Promise<string> {
  const key = await deriveKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const json = JSON.stringify(data);
  const ciphertextWithTag = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(json),
  );
  const combined = new Uint8Array(iv.length + ciphertextWithTag.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertextWithTag), iv.length);
  return bytesToBase64(combined);
}

export function getEncryptionSecret(): string {
  const secret = import.meta.env.VITE_ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error('VITE_ENCRYPTION_SECRET is not configured');
  }
  return secret;
}
