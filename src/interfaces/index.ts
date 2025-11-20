import { EBoardColor, ECirclePosition } from "../utils/constants";

export type TBoardColor = keyof typeof EBoardColor;
export type IBackgroud = TBoardColor | "INITIAL";
export type TCirclePosition = keyof typeof ECirclePosition;
export type TCirclePositionWithoutCenter = Exclude<TCirclePosition, "CENTER">;

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

// export type OpositeCirclePosition = Record<TCirclePosition, TCirclePosition>;

export type CirclePosition = Record<TCirclePosition, ICoordiante>;

export interface ICircleOutsite {
  pathCircleOutside: TPath;
  colorCircleOutside: TBoardColor;
}

// export type CirclePositionIndex = Record<number, TCirclePosition>;

// export interface ICircleAnimation {
//   colorCircleBase?: TBoardColor;
//   animateBase?: boolean;
//   destinityPosition?: TCirclePosition;
//   colorCircleBaseOutside?: TBoardColor;
//   animateOusite?: boolean;
//   pathCircleOutside?: TPath;
// }
