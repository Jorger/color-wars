import type { IMatrix } from "../interfaces";
import { TOTAL_CELLS } from "./constants";

export const indexInRange = (index = 0) => index >= 0 && index <= TOTAL_CELLS;

export const cellPositionInRage = (position: IMatrix) =>
  indexInRange(position.row) && indexInRange(position.col);
