const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
const SANCTUM_PATTERN = /^\d+\|[A-Za-z0-9]+$/;

function decodeCookieValue(token: string): string {
  try {
    return decodeURIComponent(token);
  } catch {
    return token;
  }
}

/**
 * Accept both JWT (`header.payload.signature`) and Laravel Sanctum
 * (`id|plaintext`) session tokens. Middleware used to require JWT only, so a
 * successful Sanctum login was treated as unauthenticated.
 */
export function isValidAuthToken(token: string | undefined): boolean {
  if (!token) {
    return false;
  }

  const value = decodeCookieValue(token);
  if (value.length < 20) {
    return false;
  }

  return JWT_PATTERN.test(value) || SANCTUM_PATTERN.test(value);
}
