import "./styles.css";
import { playSound } from "../../../../sounds";
import { useInterval } from "../../../../hooks";
import {
  BASE_CLASS_NAME_GAME,
  ESounds,
  LABELS,
  TIME_COUNTDOWN,
} from "../../../../utils/constants";
import React, { useState } from "react";

const BASE_CLASS_NAME = `${BASE_CLASS_NAME_GAME}-counter`;

interface StartCounterProps {
  handleEndStartCounter: () => void;
}

const StartCounter = ({ handleEndStartCounter }: StartCounterProps) => {
  /**
   * Contador para iniciar el juego...
   */
  const [counterTimer, setCounterTimer] = useState(3);

  /**
   * Se inicia el intervalo...
   */
  useInterval(
    () => {
      const newValue = counterTimer - 1;
      setCounterTimer(newValue);

      /**
       * Reproduce el sonido iniciald el counter
       */
      playSound(newValue < 0 ? ESounds.WHISTLE : ESounds.COUNTER);

      if (newValue < 0) {
        handleEndStartCounter();
      }
    },
    counterTimer >= 0 ? TIME_COUNTDOWN : null
  );

  return (
    <div className={BASE_CLASS_NAME}>
      <span key={counterTimer}>
        {counterTimer > 0 ? counterTimer : LABELS.GO}
      </span>
    </div>
  );
};

export default React.memo(StartCounter);
