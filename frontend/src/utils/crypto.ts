const IV_LENGTH = 12;

let cachedKey: Promise<CryptoKey> | null = null;

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function getKey(): Promise<CryptoKey> {
  if (!cachedKey) {
    const rawKey = base64ToBytes(import.meta.env.VITE_ENCRYPTION_KEY);
    cachedKey = crypto.subtle.importKey("raw", rawKey as BufferSource, "AES-GCM", false, [
      "encrypt",
      "decrypt",
    ]);
  }
  return cachedKey;
}

// Mirrors the backend's utils/commanHelper.ts: base64(iv[12] + ciphertext + authTag[16]),
// AES-256-GCM, JSON-serialized payload.
export async function encryptValue(data: unknown): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const plaintext = new TextEncoder().encode(JSON.stringify(data));

  const ciphertextWithTag = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    plaintext as BufferSource
  );

  const combined = new Uint8Array(iv.length + ciphertextWithTag.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertextWithTag), iv.length);

  return bytesToBase64(combined);
}

export async function decryptValue<T>(base64: string): Promise<T> {
  const key = await getKey();
  const combined = base64ToBytes(base64);

  const iv = combined.slice(0, IV_LENGTH);
  const ciphertextWithTag = combined.slice(IV_LENGTH);

  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    ciphertextWithTag as BufferSource
  );

  return JSON.parse(new TextDecoder().decode(plaintext)) as T;
}
