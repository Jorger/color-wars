import { Cell, GameWrapper, Grid } from "./components";
// import { ECirclePosition } from "../../utils/constants";
import { GameState } from "../../logic";
import { PlayerId } from "rune-sdk";
import { useEffect, useState } from "react";
import { ECirclePosition } from "../../utils/constants";
// import { ECirclePosition } from "../../utils/constants";

const testAnimate = false;

const Game = () => {
  const [game, setGame] = useState<GameState>();
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>();

  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, yourPlayerId }) => {
        setGame(game);
        setYourPlayerId(yourPlayerId);

        // console.log("game");
        console.log(game);

        // if (action && action.name === "claimCell") selectSound.play()
      },
    });
  }, []);

  if (!game) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return;
  }

  console.log(yourPlayerId);

  return (
    <GameWrapper>
      <Grid>
        <Cell
          isDisabled={false}
          cellPosition={{ row: 0, col: 0 }}
          totalDots={4}
          isAnimate={testAnimate}
          colorCircleBase="RED"
          onClick={(cellPosition) => {
            console.log(cellPosition);
          }}
        />
        <Cell
          isDisabled={false}
          cellPosition={{ row: 0, col: 1 }}
          totalDots={2}
          isAnimate={testAnimate}
          colorCircleBase="BLUE"
          circleOutsite={{
            colorCircleOutside: "RED",
            pathCircleOutside: [ECirclePosition.LEFT, ECirclePosition.CENTER],
          }}
          onClick={(cellPosition) => {
            console.log(cellPosition);
          }}
        />
        {/* isAnimate={testAnimate} */}
        <Cell
          isDisabled={false}
          cellPosition={{ row: 0, col: 2 }}
          totalDots={2}
          colorCircleBase="RED"
          // circleOutsite={{
          //   colorCircleOutside: "BLUE",
          //   pathCircleOutside: [ECirclePosition.LEFT, ECirclePosition.CENTER],
          // }}
          onClick={(cellPosition) => {
            console.log(cellPosition);
          }}
        />
        {/* <Cell
          isDisabled={false}
          cellPosition={{ row: 0, col: 0 }}
          circleColor="RED"
          totalDots={4}
          isAnimate={testAnimate}
          path={[ECirclePosition.LEFT, ECirclePosition.CENTER]}
          onClick={(cellPosition) => {
            console.log(cellPosition);
          }}
        /> */}
      </Grid>
    </GameWrapper>
  );
};

export default Game;
