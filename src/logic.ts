import { EBoardColor, TOTAL_CELLS } from "./utils/constants";
import { PlayerId } from "rune-sdk";
import { randomNumber } from "./utils/randomNumber";
import type {
  GameState,
  ICellServer,
  IMatrix,
  Player,
  TTotalDotsByColor,
} from "./interfaces";

const INITIAL_CELL_POSITION: IMatrix = { row: -1, col: -1 };

/**
 * Devuelve la información del jugador que ha hecho alguna acción...
 * @param game
 * @param playerId
 * @param allPlayerIds
 * @returns
 */
const getCurretPlayer = (players: Player[], playerId: PlayerId) => {
  const currentIndex = players.findIndex((v) => v.playerID === playerId);

  if (currentIndex < 0) {
    throw Rune.invalidAction();
  }

  return currentIndex;
};

/**
 * Calcular la totalidad de celdas por color...
 * @param cells
 * @returns
 */
const getTotalCellsColor = (cells: ICellServer[][]) => {
  const totalColors: TTotalDotsByColor = {
    [EBoardColor.BLUE]: 0,
    [EBoardColor.RED]: 0,
  };

  for (let row = 0; row < TOTAL_CELLS; row++) {
    for (let col = 0; col < TOTAL_CELLS; col++) {
      const { cellColor } = cells[row][col];

      if (cellColor) {
        totalColors[cellColor] = totalColors[cellColor] + 1;
      }
    }
  }

  return totalColors;
};

/**
 * Generar la data inicial de las celdas...
 * @returns
 */
const generateInitialCellData = () => {
  const cells: ICellServer[][] = [];

  for (let row = 0; row < TOTAL_CELLS; row++) {
    const currentRow: ICellServer[] = [];

    for (let col = 0; col < TOTAL_CELLS; col++) {
      currentRow.push({
        cellPosition: { row, col },
        totalDots: 0,
      });
    }

    cells.push(currentRow);
  }

  return cells;
};

/**
 * Genera la data inicial de cada jugador...
 * @param allPlayerIds
 * @returns
 */
const getPlayerData = (allPlayerIds: string[]): GameState => {
  const players: Player[] = [];
  /**
   * Determina el color inicial de forma aleatoria...
   */
  const initialColor = randomNumber(0, 1);
  /**
   * Se establecen los colores para cada jugador...
   */
  const colorPlayer1 = initialColor === 0 ? EBoardColor.BLUE : EBoardColor.RED;
  const colorPlayer2 = initialColor === 0 ? EBoardColor.RED : EBoardColor.BLUE;

  /**
   * Se crea la data para los jugadores...
   */
  players.push(
    {
      playerID: allPlayerIds[0],
      color: colorPlayer1,
      score: 0,
      selectCell: false,
      hasInitialLaunch: false,
    },
    {
      playerID: allPlayerIds[1],
      color: colorPlayer2,
      score: 0,
      selectCell: false,
      hasInitialLaunch: false,
    }
  );

  /**
   * Se obtiene aleatoriamente el jugador que inicia la partida...
   */
  const turnNumber = randomNumber(0, 1);

  /**
   * Y se guarda el id del usuario que inicia la partida, ya que con este
   * es el que se identifica el jugador no el número obtenido...
   */
  const turnID = allPlayerIds[turnNumber];

  return {
    playerIds: allPlayerIds,
    players,
    turnID,
    isGameOver: false,
    cells: generateInitialCellData(),
    cellPosition: INITIAL_CELL_POSITION,
  };
};

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup: (allPlayerIds) => getPlayerData(allPlayerIds),
  actions: {
    onSelectCell: (cellPosition, { game, playerId }) => {
      game.cellPosition = cellPosition;

      const currentIndex = getCurretPlayer(game.players, playerId);

      game.players[currentIndex].selectCell = true;
    },
    onNextTurn: (cells, { game, playerId }) => {
      /**
       * Se obtiene el índice del jugador que hizo la acción...
       */
      const currentIndex = getCurretPlayer(game.players, playerId);

      if (!game.players[currentIndex].selectCell) return;

      game.players[currentIndex].selectCell = false;

      /**
       * El indice del player contrario...
       */
      const oposieIndexPlayer = currentIndex === 0 ? 1 : 0;

      /**
       * Saber si el usuario ya había realizado un lanzamiento inicial...
       */
      const { hasInitialLaunch, color } = game.players[currentIndex];

      /**
       * Para saber el color del player contrario...
       */
      const {
        color: colorOpositePlayer,
        hasInitialLaunch: hasInitialLaunchOpositePlayer,
      } = game.players[oposieIndexPlayer];

      /**
       * Se valida si el usuario ya había realizado un lanzamiento...
       */
      if (!hasInitialLaunch) {
        game.players[currentIndex].hasInitialLaunch = true;
      }

      /**
       * Se actualzia la información de las celdas...
       */
      game.cells = cells;

      /**
       * Se reinicia la posición de la celda seleccioanda...
       */
      game.cellPosition = INITIAL_CELL_POSITION;

      /**
       * Traer el total de colores por celda que existe...
       */
      const totalCellsColor = getTotalCellsColor(game.cells);

      /**
       * Total de celda del player actual...
       */
      const totalCellsPlayer = totalCellsColor[color];

      /**
       * Ahora el color del jugador opuesto...
       */
      const totalCellsOpositePlayer = totalCellsColor[colorOpositePlayer];

      /**
       * Guardar el score para cada player
       */
      game.players[currentIndex].score = totalCellsPlayer;
      game.players[oposieIndexPlayer].score = totalCellsOpositePlayer;

      /**
       * Validar si uno de los dos no tiene celdas vacías...
       */
      const isEmptyCell =
        game.players[0].score === 0 || game.players[1].score === 0;

      /**
       * Si el jugador opuesto ya había lanzado, se debe validar el game over...
       */
      if (hasInitialLaunchOpositePlayer && isEmptyCell) {
        /**
         * Se indica que el juego ha terminado...
         */
        game.isGameOver = true;

        /**
         * Mostrar el ganador...
         */
        const indexWinner = game.players.findIndex((v) => v.score > 0);
        const winner = game.playerIds[indexWinner];
        const loser = game.playerIds[indexWinner === 0 ? 1 : 0];

        Rune.gameOver({
          players: {
            [winner]: "WON",
            [loser]: "LOST",
          },
        });
      } else {
        /**
         * Se establece el siguiente turno, siempre y cuando no existe game over...
         */
        game.turnID = game.players[oposieIndexPlayer].playerID;
      }
    },
  },
});
