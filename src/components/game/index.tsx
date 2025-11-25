import { cellPositionInRage } from "../../utils/indexInRange";
import {
  Cells,
  GameWrapper,
  Grid,
  OpponentThinks,
  Score,
  ShowTurn,
  StartCounter,
} from "./components";
import {
  CIRCLE_TIME_ANIMATION,
  DOT_TIME_ANIMATION,
  ESounds,
  GAME_ACTION_NAME,
  INITIAL_UI_INTERACTIONS,
  UI_INTERACTIONS_STARTED,
} from "../../utils/constants";
import {
  getBaseDataCells,
  getCurrentColor,
  getPlayerByID,
  getRandomCell,
  validateCircleEndAnimation,
  validateDotEndAnimation,
  validateSelectCell,
} from "./helpers";
import { PlayerId } from "rune-sdk";
import { playSound } from "../../sounds";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useWait } from "../../hooks";
import type {
  GameState,
  ICell,
  IMatrix,
  IUInteractions,
  TBoardColor,
} from "../../interfaces";

const Game = () => {
  // const hasTurnRef = useRef(false);

  /**
   * Guarda el estado del juego que proviene del server...
   */
  const [game, setGame] = useState<GameState>();

  /**
   * Guarda el ID del usuario en cada sesión...
   */
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>();

  /**
   * Guarda la información de las celdas que se renderizan en el cliente...
   */
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
   * Obtener el listado de jugadores...
   */
  const players = useMemo(() => game?.players || [], [game?.players]);

  /**
   * Obtiene la información del jugador actual en cada sesión...
   */
  const currentPlayer = getPlayerByID(yourPlayerId || "", players);

  // const opositePlayer: Player | undefined = players.find(
  //   (v) => v.playerID !== yourPlayerId || ""
  // );

  // const opositePlayerColor = opositePlayer?.color || EBoardColor.RED;
  // const opositeHasInitialLaunch = opositePlayer?.hasInitialLaunch ?? false;

  // const opositeHasInitialLaunch =
  //   yourPlayerIdOpostite?.hasInitialLaunch ?? false;
  // const opositePlayer = getPlayerByID();

  /**
   * Extraer la información que se require de la interacción del UI
   */
  const {
    disableUI,
    startTimer,
    showCounter,
    runDotAnimation,
    runCircleAnimation,
  } = uiInteractions;

  /**
   * Si se muestra el mensaje del turno...
   */
  const showMessage = !showCounter && hasTurn;

  /**
   * Bloquea el UI, para prevenir cualquier acción por parte del usuario...
   */
  const isDisableUI =
    disableUI ||
    !hasTurn ||
    isGameOver ||
    runDotAnimation ||
    runCircleAnimation;

  /**
   * Si se muestra el componente que indica que el oponenente está pensando...
   */
  const showOpponentThinks = !showCounter && !hasTurn && startTimer;

  // const [tmpLabel, setTmpLabel] = useState("");

  /**
   * Efecto donde se configura Rune...
   */
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

        /**
         * Indica que es el evento inicial cuando inicia el juego
         */
        if (!action) {
          /**
           * Se guarda el id del player de la sesión actual...
           */
          setYourPlayerId(yourPlayerId);
        }

        // const hasTurnEffect = yourPlayerId === game.turnID;

        // hasTurnRef.current = hasTurnEffect;

        /**
         * Si es un nuevo juego, se reinician los estados del juego y de las interacciones
         */
        if (isNewGame) {
          setClientCells(getBaseDataCells(game.cells));
          setUiInteractions(INITIAL_UI_INTERACTIONS);
        }

        /**
         * Actión que indica que se ha seleccionado una celda...
         */
        if (action?.name === GAME_ACTION_NAME.OnSelectCell) {
          setClientCells((current) =>
            validateSelectCell({
              cellPosition: game.cellPosition,
              clientCells: current,
              turnID: game.turnID,
              players: game.players,
              setUiInteractions,
            })
          );
        }

        if (action?.name === GAME_ACTION_NAME.OnNextTurn) {
          // if (game.isGameOver) {
          //   /**
          //    * Se establece que no debe exitir ninguna interacción...
          //    */
          //   setUiInteractions(UI_INTERACTIONS_STARTED);

          //   /**
          //    * Para el sonido del game over...
          //    */
          //   playSound(ESounds.GAME_OVER);
          // }
          if (!game.isGameOver) {
            /**
             * Se debe habilitar el UI para ese cliente, además de habilitar el tiempo
             * del cronometro para el lanzamiento...
             */
            setUiInteractions({
              ...UI_INTERACTIONS_STARTED,
              disableUI: false,
              startTimer: true,
              comes: "NEXT TURN",
            });

            // TODO: Tal vez sincronizar el valor de cells con el que llega del server...
            setClientCells(getBaseDataCells(game.cells));
          } else {
            /**
             * Se establece que no debe exitir ninguna interacción...
             */
            setUiInteractions(UI_INTERACTIONS_STARTED);

            /**
             * Para el sonido del game over...
             */
            playSound(ESounds.GAME_OVER);
          }
        }
      },
    });
  }, []);

  /**
   * Función que se ejecuta cuando se ha terminado la animación de
   * movimiento de los círculos...
   */
  const handleCircleEndAnimation = useCallback(() => {
    // console.log("EN handleCircleEndAnimation");

    setClientCells((current) =>
      validateCircleEndAnimation({
        clientCells: current,
        setUiInteractions,
      })
    );
  }, []);

  /**
   * Hook que espera el tiempo de animación de movimiento de los círcuilos...
   */
  useWait(runCircleAnimation, CIRCLE_TIME_ANIMATION, handleCircleEndAnimation);

  /**
   * Función que se ejcuta cuado termina la animación de los dots/puntos...
   */
  const handleDotEndAnimation = useCallback(() => {
    // console.log("EN handleDotEndAnimation");
    setClientCells((current) =>
      validateDotEndAnimation({
        clientCells: current,
        hasTurn,
        players,
        setUiInteractions,
      })
    );
  }, [hasTurn, players]);

  /**
   * Hook que espera el tiempo de animación de los dots
   */
  useWait(runDotAnimation, DOT_TIME_ANIMATION, handleDotEndAnimation);

  // useEffect(() => {
  //   if (hasTurn && goNextTurn) {
  //     setUiInteractions(UI_INTERACTIONS_STARTED);

  //     console.log("EL EFECTO DEL TURNO", { hasTurn, goNextTurn });
  //     Rune.actions.onNextTurn(getCellServer(clientCells));
  //   }
  // }, [hasTurn, goNextTurn, clientCells]);

  /**
   * Función que se ejcuta cuando el counter inicial ha terminado...
   */
  const handleEndStartCounter = useCallback(() => {
    setUiInteractions((current) => {
      return {
        ...current,
        showCounter: false,
        disableUI: false,
        startTimer: true,
        comes: "handleEndStartCounter",
      };
    });
  }, []);

  /**
   * Función que se invoca cuando se ha seleccionado una celda...
   * @param cellPosition
   */
  const handleClickCell = (cellPosition: IMatrix) => {
    if (hasTurn && !isGameOver && cellPositionInRage(cellPosition)) {
      /**
       * Se debe bloquear al UI para el usuario que ha hecho click...
       */
      setUiInteractions((current) => {
        return {
          ...current,
          disableUI: true,
          startTimer: false,
          runDotAnimation: false,
          runCircleAnimation: false,
          comes: "handleClickCell",
        };
      });

      /**
       * Se emite la acción al server, en este caso la posición...
       */
      Rune.actions.onSelectCell(cellPosition);
    }
  };

  /**
   * Función que se ejecuta cuando se ha terminado el contador del
   * turno del usaurio...
   */
  const handleInterval = () => {
    if (hasTurn && currentPlayer && !isGameOver) {
      /**
       * Se obtiene la celda aleatoria...
       */
      const newCellPosition = getRandomCell({
        currentPlayer,
        clientCells,
      });

      // console.log({ newCellPosition });

      /**
       * Se valida que la celda esté dentro del rango...
       */
      if (cellPositionInRage(newCellPosition)) {
        handleClickCell(newCellPosition);
      }
    }
  };

  if (!game) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return;
  }

  /**
   * Se ontiene el color del board dependiendo del turno...
   */
  const currentColor = showCounter
    ? "INITIAL"
    : getCurrentColor(turnID, players);

  return (
    <GameWrapper disableUI={isDisableUI} currentColor={currentColor}>
      {showCounter && (
        <StartCounter handleEndStartCounter={handleEndStartCounter} />
      )}
      <Score
        players={players}
        yourPlayerId={yourPlayerId || ""}
        turnID={turnID}
        hasTurn={hasTurn}
        startTimer={startTimer && !isGameOver}
        currentColor={currentColor}
        handleInterval={handleInterval}
      />
      {showOpponentThinks && (
        <OpponentThinks currentColor={currentColor as TBoardColor} />
      )}
      <Grid>
        <Cells
          cells={clientCells}
          disableUI={isDisableUI}
          player={currentPlayer}
          onClick={handleClickCell}
        />
      </Grid>
      <div
        style={{
          padding: 15,
          position: "absolute",
          background: "#000000d1",
          width: "100%",
          color: "white",
          bottom: 0,
          left: 0,
          zIndex: 60,
          pointerEvents: "none",
          fontSize: 10,
        }}
      >
        <div>PlayerID: {yourPlayerId}</div>
        <div>{hasTurn ? "TIENE TURNO" : "NO TIENE TURNO"}</div>
        <pre>{JSON.stringify(uiInteractions, null, 2)}</pre>
      </div>
      {showMessage && <ShowTurn currentColor={currentColor as TBoardColor} />}
    </GameWrapper>
  );
};

export default Game;
