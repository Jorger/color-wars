import "./styles.css";
import {
  BASE_CLASS_NAME_GAME,
  EBoardColor,
  LABELS,
} from "../../../../utils/constants";
import type { TBoardColor } from "../../../../interfaces";

const BASE_CLASS_NAME = `${BASE_CLASS_NAME_GAME}-turn-opponent`;

const CLASS_NAMES = {
  WRAPPER: BASE_CLASS_NAME,
  LABEL: `${BASE_CLASS_NAME}-label`,
};

interface OpponentThinksProps {
  currentColor: TBoardColor;
}

const OpponentThinks = ({
  currentColor = EBoardColor.BLUE,
}: OpponentThinksProps) => (
  <div className={CLASS_NAMES.WRAPPER}>
    <div className={`${CLASS_NAMES.LABEL} ${currentColor.toLowerCase()}`}>
      {LABELS.OPPONENT_THINKS}
    </div>
  </div>
);

export default OpponentThinks;
