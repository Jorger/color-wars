import { EBoardColor } from "../utils/constants";

export type TBoardColor = keyof typeof EBoardColor;
export type IBackgroud = TBoardColor | "INITIAL";
