/**
 * Convierte un texto en formato SCREAMING_SNAKE_CASE a kebab-case.
 * Ejemplo: METER_TRACK_TOP → meter-track-top
 */
export function snakeToKebab(value = "") {
  return value.toLowerCase().replace(/_/g, "-");
}
