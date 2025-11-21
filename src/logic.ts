import { EBoardColor, TOTAL_CELLS } from "./utils/constants";
import { randomNumber } from "./utils/randomNumber";
import type { GameState, ICellServer, Player, TBoardColor } from "./interfaces";
import { PlayerId } from "rune-sdk";

/**
 * Devuelve la información del jugador que ha hecho alguna acción...
 * @param game
 * @param playerId
 * @param allPlayerIds
 * @returns
 */
export const getCurretPlayer = (players: Player[], playerId: PlayerId) => {
  const currentIndex = players.findIndex((v) => v.playerID === playerId);

  if (currentIndex < 0) {
    throw Rune.invalidAction();
  }

  return currentIndex;
};

/**
 * Retorna la distribución de colores dependieno del color del jugador...
 * @param color
 * @returns
 */
const getColorDistribution = (color: TBoardColor): TBoardColor[] => {
  if (color === EBoardColor.RED) {
    return [EBoardColor.RED, EBoardColor.BLUE];
  }
  return [EBoardColor.BLUE, EBoardColor.RED];
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
      // TODO: revisar por que creo que no se está usando...
      colorDistribution: getColorDistribution(colorPlayer1),
      hasInitialLaunch: false,
    },
    {
      playerID: allPlayerIds[1],
      color: colorPlayer2,
      score: 0,
      colorDistribution: getColorDistribution(colorPlayer2),
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
    cellPosition: { row: -1, col: -1 },
  };
};

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup: (allPlayerIds) => getPlayerData(allPlayerIds),
  actions: {
    onSelectCell: (cellPosition, { game }) => {
      // game.hammerClick = hammerClick;
      // console.log({ cellPosition, game });
      game.cellPosition = cellPosition;

      /**
       * Hacerlo en otro evento...
       */
      // playerId
      // const currentIndex = getCurretPlayer(game.players, playerId);

      // /**
      //  * Se indica que se ha hecho un lanzamiento...
      //  */
      // if (currentIndex >= 0 && !game.players[currentIndex].hasInitialLaunch) {
      //   game.players[currentIndex].hasInitialLaunch = true;
      // }
    },
  },
});
