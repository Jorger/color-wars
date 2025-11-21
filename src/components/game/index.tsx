import { Cells, GameWrapper, Grid } from "./components";
import {
  getBaseDataCells,
  getCurrentColor,
  getPlayerByID,
  validateEndDotAnimation,
  validateSelectCell,
} from "./helpers";
import { PlayerId } from "rune-sdk";
import { useCallback, useEffect, useState } from "react";
import {
  CIRCLE_TIME_ANIMATION,
  DOT_TIME_ANIMATION,
  GAME_ACTION_NAME,
  INITIAL_UI_INTERACTIONS,
  UI_INTERACTIONS_STARTED,
} from "../../utils/constants";
import type {
  GameState,
  ICell,
  IMatrix,
  IUInteractions,
} from "../../interfaces";
import { useWait } from "../../hooks";

// const testAnimate = false;

const Game = () => {
  const [game, setGame] = useState<GameState>();
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>();
  const [clientCells, setClientCells] = useState<ICell[][]>([]);

  /**
   * Guarda los estados de las interacciones de la UI...
   */
  const [uiInteractions, setUiInteractions] = useState<IUInteractions>(
    INITIAL_UI_INTERACTIONS
  );

  /**
   * Se cálcula el ID del usuario que tien el turno
   */
  const turnID = game?.turnID || "";

  /**
   * Se indica si el usuario tiene el turno...
   */
  const hasTurn = yourPlayerId === turnID;

  /**
   * Determinar si el juego ha terminado...
   */
  const isGameOver = game?.isGameOver || false;

  /**
   * Extraer la información que se require de la interacción del UI
   */
  // showCounter, startTimer
  const { disableUI, runDotAnimation, runCircleAnimation } = uiInteractions;

  /**
   * Bloquea el UI, para prevenir cualquier acción por parte del usuario...
   */
  const isDisableUI = disableUI || !hasTurn || isGameOver;

  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, action, yourPlayerId, event }) => {
        /**
         * Determina si se ha reiniciado el juego
         */
        const isNewGame = (event?.name || "") === GAME_ACTION_NAME.StateSync;

        /**
         * Se guarda el estado del juego que proviene del servicio...
         */
        setGame(game);

        // console.log("ESTADO DEL GAME");
        // console.log(game);

        /**
         * Indica que es el evento inicial cuando inicia el juego
         */
        if (!action) {
          /**
           * Se guarda el id del player de la sesión actual...
           */
          setYourPlayerId(yourPlayerId);
        }

        /**
         * Si es un nuevo juego, se reinician los estados del juego y de las interacciones
         */
        if (isNewGame) {
          setClientCells(getBaseDataCells(game.cells));
          setUiInteractions(INITIAL_UI_INTERACTIONS);
          // console.log("ES UN NUEVO JUEGO, REINICIAR ESTADO...");
        }

        /**
         * Actión que se ejecutó cuando se hizo click al martillo...
         */
        if (action?.name === GAME_ACTION_NAME.OnSelectCell) {
          // console.log("SELECCIONÓ UNA CELDA...");
          // console.log({ yourPlayerId, cell: game.cellPosition });
          setClientCells((current) => {
            return validateSelectCell({
              cellPosition: game.cellPosition,
              clientCells: current,
              turnID: game.turnID,
              players: game.players,
            });
          });

          /**
           * Se habilita la animación de los puntos, se garantiza
           * que el UI siga bloqueado y que el tiempo del siguiente
           * tueno no se ejecute...
           */
          setUiInteractions({
            ...UI_INTERACTIONS_STARTED,
            runDotAnimation: true,
          });
        }
      },
    });
  }, []);

  const handleCircleAnimation = useCallback(() => {
    console.log("TERMINA LA ANIMACIÓN DEL CÍRCULO...");

    setUiInteractions({
      ...UI_INTERACTIONS_STARTED,
      runDotAnimation: false,
      runCircleAnimation: false,
    });
  }, []);

  useWait(runCircleAnimation, CIRCLE_TIME_ANIMATION, handleCircleAnimation);

  const handleDotAnimation = useCallback(() => {
    console.log("TERMINA LA ANIMACIÓN DEL DOT!!");

    setClientCells((current) => {
      return validateEndDotAnimation({
        clientCells: current,
        setUiInteractions,
      });
    });
  }, []);

  useWait(runDotAnimation, DOT_TIME_ANIMATION, handleDotAnimation);

  if (!game || !yourPlayerId) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return;
  }

  const handleClickCell = (cellPosition: IMatrix) => {
    if (hasTurn && !isGameOver) {
      /**
       * Se debe bloquear al UI para el usuario que ha hecho click...
       */
      setUiInteractions(UI_INTERACTIONS_STARTED);
      // setUiInteractions({
      //   ...uiInteractions,
      //   disableUI: true,
      //   startTimer: false,
      //   runDotAnimation: false,
      //   runCircleAnimation: false,
      // });

      /**
       * Se emite la acción al server, en este caso la posición...
       */
      Rune.actions.onSelectCell(cellPosition);
    }
  };

  const { players } = game;

  /**
   * Establece el color que se muestra, dependiendo del turno...
   */
  // const currentColor = showCounter
  //   ? "INITIAL"
  //   : getCurrentColor(turnID, players);

  // TODO: Se debe validar el showCounter
  const currentColor = getCurrentColor(turnID, players);

  // console.log(yourPlayerId);
  // console.log("LA DATA A RENDERIZAR");
  // console.log(clientCells);

  return (
    <GameWrapper disableUI={isDisableUI} currentColor={currentColor}>
      <Grid>
        <Cells
          cells={clientCells}
          disableUI={isDisableUI}
          player={getPlayerByID(yourPlayerId, players)}
          onClick={handleClickCell}
        />
      </Grid>
    </GameWrapper>
  );
};

export default Game;
