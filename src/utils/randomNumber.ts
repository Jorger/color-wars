/**
 * Genera un valor aleatorio dado un rango
 * @param min
 * @param max
 * @returns
 */
export const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
