/**
 * Crear una variable css
 * @param target
 * @param variable
 * @param value
 * @returns
 */
export const setCssVariable = (
  target: HTMLElement,
  variable = "",
  value = ""
) => target.style.setProperty(`--${variable}`, value);
