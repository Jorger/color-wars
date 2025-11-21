/**
 * Genera una interrupción...
 * @param ms
 * @returns
 */
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
