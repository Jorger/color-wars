import { EBoardColor, ECirclePosition, ESounds } from "../utils/constants";
import { PlayerId, RuneClient, Player as PlayerRune } from "rune-sdk";

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

export type TBoardColor = keyof typeof EBoardColor;
export type IBackgroud = TBoardColor | "INITIAL";
export type TCirclePosition = keyof typeof ECirclePosition;
export type TCirclePositionWithoutCenter = Exclude<TCirclePosition, "CENTER">;
export type TESounds = keyof typeof ESounds;
export type Sounds = Record<TESounds, Howl>;

export interface ICoordiante {
  x: number;
  y: number;
}

export interface IMatrix {
  row: number;
  col: number;
}

export type TNextMatrix = Record<TCirclePositionWithoutCenter, IMatrix>;

export type TPath = [TCirclePosition, TCirclePosition];

export type TOpositeCirclePosition = Record<
  TCirclePositionWithoutCenter,
  TCirclePositionWithoutCenter
>;

export type TOpositeBoardColor = Record<TBoardColor, TBoardColor>;

export type CirclePosition = Record<TCirclePosition, ICoordiante>;

export interface ICircleOutsite {
  pathCircleOutside: TPath;
  colorCircleOutside: TBoardColor;
}

export interface INeighboringPath {
  path: TPath;
  cellPosition: IMatrix;
}

export interface ICell extends ICellServer {
  isAnimate: boolean;
  circleOutsite: ICircleOutsite[];
}

export type TOnClickCell = (cellPosition: IMatrix) => void;

export interface IUInteractions {
  /**
   * Muestra el contador inicial del juego...
   */
  showCounter: boolean;
  /**
   * Bloquea el UI hasta que exista una nueva acción...
   */
  disableUI: boolean;
  /**
   * Inicia el tiempo restante para que un jugador haga su movimiento...
   */
  startTimer: boolean;
  /**
   * Determina si se debe escuchar la animación de los puntos...
   */
  runDotAnimation: boolean;
  /**
   * Dtermina que se debe iniciar a esucuchar la animación de los círculos...
   */
  runCircleAnimation: boolean;
}

export interface ICellServer {
  cellPosition: IMatrix;
  cellColor?: TBoardColor;
  totalDots: number;
}

// Para el player del game state...
export interface Player {
  playerID: PlayerId;
  color: TBoardColor;
  score: number;
  hasInitialLaunch: boolean;
}

export interface GameState {
  playerIds: PlayerId[];
  players: Player[];
  turnID: PlayerId;
  isGameOver: boolean;
  cells: ICellServer[][];
  cellPosition: IMatrix;
}

export type GameActions = {
  onSelectCell: (cellPosition: IMatrix) => void;
  onNextTurn: (cells: ICellServer[][]) => void;
};

export type TTotalDotsByColor = Record<TBoardColor, number>;

export interface PlayerScore extends PlayerRune {
  score: number;
  color: TBoardColor;
}
