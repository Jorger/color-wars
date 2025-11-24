import type { IMatrix } from "../interfaces";
import { TOTAL_CELLS } from "./constants";

/**
 * Valida si un valor está en rango...
 * @param index
 * @returns
 */
export const indexInRange = (index = 0) => index >= 0 && index < TOTAL_CELLS;

/**
 * Valida si uan posición de una celda en la matriz está en rango...
 * @param position
 * @returns
 */
export const cellPositionInRage = (position: IMatrix) =>
  indexInRange(position.row) && indexInRange(position.col);
