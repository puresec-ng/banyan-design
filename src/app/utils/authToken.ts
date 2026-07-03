export function isValidAuthToken(token: string | undefined): boolean {
  if (!token || token.length < 20) {
    return false;
  }

  const parts = token.split('.');
  return parts.length === 3 && parts.every((part) => part.length > 0);
}
