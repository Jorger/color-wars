import "./styles.css";
import {
  BASE_CLASS_NAME_GAME,
  EBoardColor,
  LABELS,
} from "../../../../utils/constants";
import React from "react";
import type { TBoardColor } from "../../../../interfaces";

const BASE_CLASS_NAME = `${BASE_CLASS_NAME_GAME}-turn`;

const CLASS_NAMES = {
  WRAPPER: BASE_CLASS_NAME,
  LABEL: `${BASE_CLASS_NAME}-label`,
};

interface ShowTurnProps {
  currentColor: TBoardColor;
}

const ShowTurn = ({ currentColor = EBoardColor.BLUE }: ShowTurnProps) => (
  <div className={CLASS_NAMES.WRAPPER}>
    <div className={`${CLASS_NAMES.LABEL} ${currentColor.toLowerCase()}`}>
      {LABELS.YOUR_TURN}
    </div>
  </div>
);

export default React.memo(ShowTurn);
