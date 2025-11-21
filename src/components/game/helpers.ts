import { cellPositionInRage } from "../../utils/indexInRange";
import { PlayerId } from "rune-sdk";
import {
  CIRCLE_POSITION_INDEX,
  ECirclePosition,
  INCREASE_DOTS,
  INITIAL_TOTAL_DOTS,
  MAX_DOTS,
  NEXT_MATRIX_POSITION,
  OPOSITE_POSITION,
  TOTAL_CELLS,
  UI_INTERACTIONS_STARTED,
} from "../../utils/constants";
import cloneDeep from "lodash.clonedeep";
import type {
  IBackgroud,
  ICell,
  ICellServer,
  IMatrix,
  INeighboringPath,
  IUInteractions,
  Player,
} from "../../interfaces";

/**
 * Se obtiene las celdas vecinas de la celda que se divide...
 * @param clientCells
 */
// TODO: revisar si se utiliza...
// const getNeighboringCells = (baseCellPosition: IMatrix) => {
//   const cellPositions: IMatrix[] = [];

//   for (const circlePosition of CIRCLE_POSITION_INDEX) {
//     const increase = NEXT_MATRIX_POSITION[circlePosition];
//     const newPosition: IMatrix = {
//       row: baseCellPosition.row + increase.row,
//       col: baseCellPosition.col + increase.col,
//     };

//     if (cellPositionInRage(newPosition)) {
//       cellPositions.push(newPosition);
//     }
//   }

//   return cellPositions;
// };

const getNeighboringCellsPath = (cellPosition: IMatrix) => {
  const paths: INeighboringPath[] = [];

  // console.log("EL VALOR DE cellPosition: ", cellPosition);

  for (const circlePosition of CIRCLE_POSITION_INDEX) {
    const increase = NEXT_MATRIX_POSITION[circlePosition];
    const newPosition: IMatrix = {
      row: cellPosition.row + increase.row,
      col: cellPosition.col + increase.col,
    };

    // console.log("VALOR DE newPosition: ", newPosition);

    if (cellPositionInRage(newPosition)) {
      paths.push({
        path: [OPOSITE_POSITION[circlePosition], ECirclePosition.CENTER],
        cellPosition: newPosition,
      });
    }
  }

  // console.log("FINALIZA PARA cellPosition");

  return paths;
};

/**
 * Genera la información inicial para las celdas que se renderizan
 * en el cliente...
 * @param cells
 * @returns
 */
export const getBaseDataCells = (cells: ICellServer[][]) => {
  const clientCells: ICell[][] = [];

  for (let row = 0; row < TOTAL_CELLS; row++) {
    clientCells[row] = [];

    for (let col = 0; col < TOTAL_CELLS; col++) {
      // isDisabled: false,
      clientCells[row][col] = {
        ...cells[row][col],
        isAnimate: false,
        circleOutsite: [],
      };
    }
  }

  return clientCells;
};

/**
 * Obtener la información del jugador por id
 * @param id
 * @param players
 * @returns
 */
export const getPlayerByID = (id: PlayerId, players: Player[]) =>
  players.find((v) => v.playerID === id);

/**
 * Se obtiene el color del player qye tiene el turno...
 * @param id
 * @param players
 * @returns
 */
export const getCurrentColor = (turnID: PlayerId, players: Player[]) => {
  let currentColor: IBackgroud = "INITIAL";

  /**
   * Se obtiene el jugado atual..
   */
  const currentPlayer = getPlayerByID(turnID, players);

  if (currentPlayer) {
    currentColor = currentPlayer.color;
  }

  return currentColor;
};

// cellPosition

interface ValidateSelectCell {
  cellPosition: IMatrix;
  // cells: ICellServer[][];
  clientCells: ICell[][];
  turnID: PlayerId;
  players: Player[];
}

/**
 * Valida la selección de una celda...
 * @param param0
 * @returns
 */
export const validateSelectCell = ({
  cellPosition,
  clientCells,
  turnID,
  players,
}: ValidateSelectCell) => {
  const currentPlayer = getPlayerByID(turnID, players);

  if (!currentPlayer) return clientCells;

  const copyClientCells = cloneDeep(clientCells);

  const { color, hasInitialLaunch } = currentPlayer;
  const cell = copyClientCells[cellPosition.row][cellPosition.col];
  // const { totalDots } = cell;

  const newTotalDots = !hasInitialLaunch
    ? INITIAL_TOTAL_DOTS
    : cell.totalDots + INCREASE_DOTS;

  // const newTotalDots = !hasInitialLaunch ? 4 : cell.totalDots + INCREASE_DOTS;

  copyClientCells[cellPosition.row][cellPosition.col].totalDots = newTotalDots;
  copyClientCells[cellPosition.row][cellPosition.col].cellColor = color;
  copyClientCells[cellPosition.row][cellPosition.col].colorCircleBase = color;

  return copyClientCells;
};

interface ValidateEndDotAnimation {
  clientCells: ICell[][];
  setUiInteractions: React.Dispatch<React.SetStateAction<IUInteractions>>;
}

export const validateEndDotAnimation = ({
  clientCells,
  setUiInteractions,
}: ValidateEndDotAnimation) => {
  const copyClientCells = cloneDeep(clientCells);
  let completeCell = false;

  // console.log("LLEGA validateEndDotAnimation");

  /**
   * Buscar aquellas celdas cuyo número de dots sean 4
   */
  for (let row = 0; row < TOTAL_CELLS; row++) {
    for (let col = 0; col < TOTAL_CELLS; col++) {
      const cellColor = copyClientCells[row][col].cellColor;

      if (cellColor && copyClientCells[row][col].totalDots === MAX_DOTS) {
        // console.log("INGRESA PARA: ", { row, col });
        /**
         * Se indica que al círculos base se anima, en este caso
         * se debe dividir, lo hace dpenediendo de a donde se pueda mover
         * lo que ya está validado dentro de la celda...
         */
        copyClientCells[row][col].isAnimate = true;

        /**
         * Se quita el color de la celda, ya que ahora debe estar vacía...
         */
        copyClientCells[row][col].cellColor = undefined;

        /**
         * Se deben bucar las celdas vecinas a donde se debe establecer
         * la animación que se van a mover...
         */
        const neighboringCellsPath = getNeighboringCellsPath({ row, col });

        // console.log("neighboringCellsPath: ", neighboringCellsPath);

        /**
         * Ahora en las celdas vecinas establecer el path...
         */
        for (const neighborPath of neighboringCellsPath) {
          const { path, cellPosition } = neighborPath;
          /**
           * Se indica que se anima...
           */
          copyClientCells[cellPosition.row][cellPosition.col].isAnimate = true;
          /**
           * Se establece que ahora se debe animar los circulos que están por fuera...
           */
          copyClientCells[cellPosition.row][
            cellPosition.col
          ].circleOutsite.push({
            colorCircleOutside: cellColor,
            pathCircleOutside: path,
          });
        }

        /**
         * Indica que se ha completado al menos una celda...
         */
        completeCell = true;
      }
    }
  }

  /**
   * Se indica que la animación del dot ha terminado...
   */
  setUiInteractions({
    ...UI_INTERACTIONS_STARTED,
    runDotAnimation: false,
    runCircleAnimation: completeCell,
  });

  // TODO, si no se ha completado una celda, debería emitirse al server para el siguiente turno...
  // en ese caso se neecita pasar a esta función ese valor...

  if (!completeCell) {
    console.log(
      "DEBE EMITIR AL SERVER, NO COMPLETÓ CELDA, SE DEBE SABER SI TIENE EL TURNO"
    );
  }

  return copyClientCells;
};
