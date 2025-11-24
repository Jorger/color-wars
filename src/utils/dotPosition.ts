import { SIZE_CELL, SIZE_CIRCLE, SIZE_DOT } from "./constants";
import type { ICoordiante } from "../interfaces";

const DOT_CENTER_CELL = Math.round((SIZE_CELL - SIZE_DOT) / 2);
const DOT_GAP = SIZE_CELL * 0.13;

/**
 * Posición del dot dentro del círculo...
 */
export const DOT_POSITION_IN_CIRCLE: ICoordiante = {
  x: Math.round((SIZE_CIRCLE - SIZE_DOT) / 2),
  y: Math.round((SIZE_CIRCLE - SIZE_DOT) / 2),
};

/**
 * Devuelve las posiciones de los puntos dentro de la celda...
 */
export const DOT_POSITION_IN_CELL: ICoordiante[][] = [
  [{ x: DOT_CENTER_CELL, y: DOT_CENTER_CELL }],
  [
    { x: DOT_CENTER_CELL - DOT_GAP, y: DOT_CENTER_CELL },
    { x: DOT_CENTER_CELL + DOT_GAP, y: DOT_CENTER_CELL },
  ],
  [
    { x: DOT_CENTER_CELL - DOT_GAP, y: DOT_CENTER_CELL + DOT_GAP },
    { x: DOT_CENTER_CELL + DOT_GAP, y: DOT_CENTER_CELL + DOT_GAP },
    { x: DOT_CENTER_CELL, y: DOT_CENTER_CELL - DOT_GAP },
  ],
  [
    { x: DOT_CENTER_CELL - DOT_GAP, y: DOT_CENTER_CELL + DOT_GAP },
    { x: DOT_CENTER_CELL + DOT_GAP, y: DOT_CENTER_CELL + DOT_GAP },
    { x: DOT_CENTER_CELL + DOT_GAP, y: DOT_CENTER_CELL - DOT_GAP },
    { x: DOT_CENTER_CELL - DOT_GAP, y: DOT_CENTER_CELL - DOT_GAP },
  ],
];
