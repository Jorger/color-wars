import {
  counter,
  firstCell,
  gameOver,
  selectCell,
  splitCell,
  whistle,
} from "./getSounds";
import { Howl } from "howler";
import type { Sounds, TESounds } from "../interfaces";

const SOUNDS: Sounds = {
  COUNTER: new Howl({
    src: [counter],
  }),
  FIRST_CELL: new Howl({
    src: [firstCell],
  }),
  GAME_OVER: new Howl({
    src: [gameOver],
  }),
  SELECT_CELL: new Howl({
    src: [selectCell],
  }),
  SPLIT_CELL: new Howl({
    src: [splitCell],
  }),
  WHISTLE: new Howl({
    src: [whistle],
  }),
};

export const playSound = (type: TESounds) => {
  SOUNDS[type].play();
};
