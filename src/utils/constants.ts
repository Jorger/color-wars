import {
  IUInteractions,
  TCirclePositionWithoutCenter,
  TNextMatrix,
  TOpositeBoardColor,
  TOpositeCirclePosition,
} from "../interfaces";

export const BASE_WIDTH = 412;
export const BASE_HEIGHT = 732;
export const BASE_CLASS_NAME_GAME = "game";
export const SIZE_GRID = Math.round(BASE_WIDTH * 0.85);
export const GAP_GRID = 5;
export const TOTAL_CELLS = 5;
export const TOTAL_CELLS_GRID = 5 ** 2;
export const SIZE_CELL = Math.round(SIZE_GRID / TOTAL_CELLS - GAP_GRID);
export const SIZE_CIRCLE = Math.round(SIZE_CELL * 0.7);
export const SIZE_DOT = Math.round(SIZE_CELL * 0.15);
export const MAX_DOTS = 4;
export const INITIAL_TOTAL_DOTS = 3;
export const INCREASE_DOTS = 1;

// Para los tiempos
export const CIRCLE_TIME = 200; // 2000; org: 200
export const DOT_TIME = 150; // 1000; org: 250
export const DOT_TIME_ANIMATION = DOT_TIME + DOT_TIME * 0.5;
export const CIRCLE_TIME_ANIMATION = CIRCLE_TIME + DOT_TIME * 0.3;
export const TIME_INTERVAL_CHRONOMETER = 100;
export const TIME_COUNTDOWN = 500;

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

export const OPOSITE_POSITION: TOpositeCirclePosition = {
  [ECirclePosition.TOP]: ECirclePosition.BOTTOM,
  [ECirclePosition.RIGHT]: ECirclePosition.LEFT,
  [ECirclePosition.LEFT]: ECirclePosition.RIGHT,
  [ECirclePosition.BOTTOM]: ECirclePosition.TOP,
};

export const OPOSITE_BOARD_COLOR: TOpositeBoardColor = {
  [EBoardColor.BLUE]: EBoardColor.RED,
  [EBoardColor.RED]: EBoardColor.BLUE,
};

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

export enum GAME_ACTION_NAME {
  StateSync = "stateSync",
  OnSelectCell = "onSelectCell",
  OnNextTurn = "onNextTurn",
}

export const INITIAL_UI_INTERACTIONS: IUInteractions = {
  showCounter: true,
  disableUI: false,
  startTimer: false,
  runDotAnimation: false,
  runCircleAnimation: false,
  // hasTurn: false,
  comes: "INITIAL",
};

export const UI_INTERACTIONS_STARTED: IUInteractions = {
  showCounter: false,
  disableUI: true,
  startTimer: false,
  runDotAnimation: false,
  runCircleAnimation: false,
  // hasTurn: false,
  comes: "STARTED",
};

export const LABELS = {
  PERCENTAGE: "100",
  GO: "GO!",
  YOUR_TURN: "Your turn",
  OPPONENT_THINKS: "Opponent thinks",
};

export enum ESounds {
  COUNTER = "COUNTER",
  WHISTLE = "WHISTLE",
  GAME_OVER = "GAME_OVER",
  FIRST_CELL = "FIRST_CELL",
  SELECT_CELL = "SELECT_CELL",
  SPLIT_CELL = "SPLIT_CELL",
}
