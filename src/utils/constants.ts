import { TCirclePositionWithoutCenter, TNextMatrix } from "../interfaces";

export const BASE_WIDTH = 412;
export const BASE_HEIGHT = 732;
export const BASE_CLASS_NAME_GAME = "game";
export const SIZE_GRID = Math.round(BASE_WIDTH * 0.85);
export const GAP_GRID = 5;
export const TOTAL_CELLS = 5;
export const SIZE_CELL = Math.round(SIZE_GRID / TOTAL_CELLS - GAP_GRID);
export const SIZE_CIRCLE = Math.round(SIZE_CELL * 0.7);
export const SIZE_DOT = Math.round(SIZE_CELL * 0.15);
export const MAX_DOTS = 4;

// Para los tiempos
export const CIRCLE_TIME = 2000; // 2000; org: 100
export const DOT_TIME = 1000; // 1000; org: 100

export enum EBoardColor {
  BLUE = "BLUE",
  RED = "RED",
}

export enum ECirclePosition {
  CENTER = "CENTER",
  TOP = "TOP",
  RIGHT = "RIGHT",
  LEFT = "LEFT",
  BOTTOM = "BOTTOM",
}

export const CIRCLE_POSITION_INDEX: TCirclePositionWithoutCenter[] = [
  ECirclePosition.TOP,
  ECirclePosition.RIGHT,
  ECirclePosition.LEFT,
  ECirclePosition.BOTTOM,
];

export const NEXT_MATRIX_POSITION: TNextMatrix = {
  [ECirclePosition.TOP]: { row: -1, col: 0 },
  [ECirclePosition.RIGHT]: { row: 0, col: 1 },
  [ECirclePosition.LEFT]: { row: 0, col: -1 },
  [ECirclePosition.BOTTOM]: { row: 1, col: 0 },
};

export const JS_CSS_VARIABLES: Record<string, number> = {
  BASE_WIDTH,
  BASE_HEIGHT,
  SIZE_GRID,
  TOTAL_CELLS,
  GAP_GRID,
  SIZE_CELL,
  SIZE_CIRCLE,
  SIZE_DOT,
  CIRCLE_TIME,
  DOT_TIME,
};
