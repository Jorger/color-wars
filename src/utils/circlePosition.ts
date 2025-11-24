import { SIZE_CELL, SIZE_CIRCLE, GAP_GRID, ECirclePosition } from "./constants";
import type { CirclePosition, ICoordiante } from "../interfaces";

const BASE_CENTER = Math.round((SIZE_CELL - SIZE_CIRCLE) / 2);
const BASE_HORIZONTAL = Math.round((SIZE_CELL - SIZE_CIRCLE + 1) / 2);
const BASE_VERTICAL = Math.round(
  SIZE_CELL - SIZE_CIRCLE - (SIZE_CELL - GAP_GRID + 2) * -1
);
const BASE_X = (SIZE_CELL - GAP_GRID) * -1;

const CENTER: ICoordiante = {
  x: BASE_CENTER,
  y: BASE_CENTER,
};

const TOP: ICoordiante = {
  x: BASE_HORIZONTAL,
  y: BASE_X,
};

const LEFT: ICoordiante = {
  x: BASE_X - 1,
  y: BASE_CENTER,
};

const RIGHT: ICoordiante = {
  x: BASE_VERTICAL,
  y: BASE_CENTER,
};

const BOTTOM: ICoordiante = {
  x: BASE_HORIZONTAL,
  y: BASE_VERTICAL,
};

/**
 * Determina las posiciones del círculo dentro de la celda...
 */
const CIRCLE_POSITION: CirclePosition = {
  [ECirclePosition.CENTER]: CENTER,
  [ECirclePosition.TOP]: TOP,
  [ECirclePosition.LEFT]: LEFT,
  [ECirclePosition.RIGHT]: RIGHT,
  [ECirclePosition.BOTTOM]: BOTTOM,
};

export default CIRCLE_POSITION;
