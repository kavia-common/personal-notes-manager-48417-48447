function v4polyfill() {
  // Fallback UUID v4 generator using Math.random
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * PUBLIC_INTERFACE
 * Generates a UUID v4 using crypto.randomUUID if available, otherwise a Math.random based fallback.
 */
export function uuidv4() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try { return crypto.randomUUID(); } catch { /* ignore */ }
  }
  return v4polyfill();
}
