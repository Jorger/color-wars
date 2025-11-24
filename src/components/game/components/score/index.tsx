import "./styles.css";
import { getPlayersScore } from "./helpers";
import { PlayerId } from "rune-sdk";
import { useEffect, useState } from "react";
import { useInterval } from "../../../../hooks";
import {
  BASE_CLASS_NAME_GAME,
  TIME_INTERVAL_CHRONOMETER,
} from "../../../../utils/constants";
import type {
  IBackgroud,
  Player,
  PlayerScore,
  TBoardColor,
} from "../../../../interfaces";

const BASE_CLASS_NAME = `${BASE_CLASS_NAME_GAME}-score`;

const CLASS_NAMES = {
  WRAPPER: BASE_CLASS_NAME,
  CONTAINER: `${BASE_CLASS_NAME}-container`,
  DOT: `${BASE_CLASS_NAME}-dot`,
  PROFILE: `${BASE_CLASS_NAME}-profile`,
  VALUE: `${BASE_CLASS_NAME}-value`,
  PROGRESS: `${BASE_CLASS_NAME}-progress`,
  PROGRESS_ITEM: `${BASE_CLASS_NAME}-progress-item`,
};

interface RenderPlayerProps {
  player: PlayerScore;
  turnID: PlayerId;
}

const RenderPlayer = ({ player, turnID }: RenderPlayerProps) => (
  <div
    className={`${CLASS_NAMES.PROFILE} ${turnID === player.playerId ? player.color.toLowerCase() : ""}`}
  >
    <img
      src={player.avatarUrl}
      alt={player.displayName}
      title={player.displayName}
    />
  </div>
);

const RenderScore = ({
  score = 0,
  color,
}: {
  score: number;
  color: TBoardColor;
}) => (
  <div className={`${CLASS_NAMES.VALUE} ${color.toLowerCase()}`}>{score}</div>
);

interface ScoreProps {
  players: Player[];
  yourPlayerId: PlayerId;
  turnID: PlayerId;
  hasTurn: boolean;
  startTimer: boolean;
  currentColor: IBackgroud;
  handleInterval: () => void;
}

/**
 * Renderiza el score del juego...
 * @param param0
 * @returns
 */
const Score = ({
  players,
  yourPlayerId,
  turnID,
  hasTurn,
  startTimer = false,
  currentColor,
  handleInterval,
}: ScoreProps) => {
  const [countdown, setCountdown] = useState({
    progress: 1,
    isRunning: false,
  });

  useEffect(
    () => setCountdown({ isRunning: startTimer, progress: 100 }),
    [startTimer]
  );

  useInterval(
    () => {
      const newProgress = countdown.progress - 1;

      setCountdown({ ...countdown, progress: newProgress });

      if (newProgress === 0) {
        setCountdown({ progress: newProgress, isRunning: false });

        handleInterval();
      }
    },
    countdown.isRunning ? TIME_INTERVAL_CHRONOMETER : null
  );

  const timerStyle = {
    "--timer-progress": `${countdown.progress}% 100%`,
    "--timer-position": hasTurn ? "100% 0" : "0 0",
  } as React.CSSProperties;

  const playersScore = getPlayersScore({ players, yourPlayerId });

  return (
    <div className={CLASS_NAMES.WRAPPER}>
      <div className={CLASS_NAMES.CONTAINER}>
        <div
          className={`${CLASS_NAMES.PROGRESS} ${currentColor.toLowerCase()}`}
          style={timerStyle}
        >
          <div className={CLASS_NAMES.PROGRESS_ITEM}>
            <RenderPlayer player={playersScore[0]} turnID={turnID} />
            <RenderScore
              color={playersScore[0].color}
              score={playersScore[0].score}
            />
            <div className="game-score-dot" />
            <RenderScore
              color={playersScore[1].color}
              score={playersScore[1].score}
            />
            <RenderPlayer player={playersScore[1]} turnID={turnID} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Score;
