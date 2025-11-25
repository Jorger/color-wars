import { cellPositionInRage } from "../../utils/indexInRange";
import { PlayerId } from "rune-sdk";
import { playSound } from "../../sounds";
import { randomNumber } from "../../utils/randomNumber";
import {
  CIRCLE_POSITION_INDEX,
  ECirclePosition,
  ESounds,
  INCREASE_DOTS,
  INITIAL_TOTAL_DOTS,
  MAX_DOTS,
  NEXT_MATRIX_POSITION,
  OPOSITE_BOARD_COLOR,
  OPOSITE_POSITION,
  TOTAL_CELLS,
  TOTAL_CELLS_GRID,
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
  TBoardColor,
} from "../../interfaces";

/**
 * Devuelve las posiciones en la matriz que tengan el mismo color...
 * @param cells
 * @param cellColor
 * @returns
 */
export const getCellsByColor = (cells: ICell[][], cellColor: TBoardColor) => {
  const cellPositions: IMatrix[] = [];

  for (let row = 0; row < TOTAL_CELLS; row++) {
    for (let col = 0; col < TOTAL_CELLS; col++) {
      if (cells[row][col].cellColor === cellColor) {
        cellPositions.push({ row, col });
      }
    }
  }

  return cellPositions;
};

/**
 * Devuelve la totalidad de celdas con el mismo color...
 * @param cells
 * @param cellColor
 * @returns
 */
export const getTotalCellsByColor = (
  cells: ICell[][],
  cellColor: TBoardColor
) => getCellsByColor(cells, cellColor).length;

/**
 * Obtiene los vecinos de una celda y cálcula cual es su path de animación...
 * @param cellPosition
 * @returns
 */
const getNeighboringCellsPath = (cellPosition: IMatrix) => {
  const paths: INeighboringPath[] = [];

  for (const circlePosition of CIRCLE_POSITION_INDEX) {
    const increase = NEXT_MATRIX_POSITION[circlePosition];
    const newPosition: IMatrix = {
      row: cellPosition.row + increase.row,
      col: cellPosition.col + increase.col,
    };

    if (cellPositionInRage(newPosition)) {
      paths.push({
        path: [OPOSITE_POSITION[circlePosition], ECirclePosition.CENTER],
        cellPosition: newPosition,
      });
    }
  }

  return paths;
};

/**
 * Genera la data para la información de la celdas en el server...
 * @param cells
 * @returns
 */
const getCellServer = (cells: ICell[][]) => {
  const cellServer: ICellServer[][] = [];

  for (let row = 0; row < TOTAL_CELLS; row++) {
    cellServer[row] = [];

    for (let col = 0; col < TOTAL_CELLS; col++) {
      const { cellPosition, cellColor, totalDots } = cells[row][col];

      cellServer[row][col] = {
        cellPosition,
        cellColor,
        totalDots,
      };
    }
  }

  return cellServer;
};

/**
 * Genera la información inicial para las celdas que se renderizan en el ciente...
 * @param cells
 * @returns
 */
export const getBaseDataCells = (cells: ICellServer[][]) => {
  const clientCells: ICell[][] = [];

  for (let row = 0; row < TOTAL_CELLS; row++) {
    clientCells[row] = [];

    for (let col = 0; col < TOTAL_CELLS; col++) {
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
 * Se obtiene el color del player que tiene el turno...
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

interface ValidateSelectCell {
  cellPosition: IMatrix;
  clientCells: ICell[][];
  turnID: PlayerId;
  players: Player[];
  setUiInteractions: React.Dispatch<React.SetStateAction<IUInteractions>>;
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
  setUiInteractions,
}: ValidateSelectCell) => {
  /**
   * Se obtiene el jugador que tiene el turno...
   */
  const currentPlayerTurn = getPlayerByID(turnID, players);

  /**
   * Se valida que exista el jugador...
   */
  if (!currentPlayerTurn) return clientCells;

  /**
   * Se hace una copia de la celdas...
   */
  const copyClientCells = cloneDeep(clientCells);

  /**
   * Se extrae el color del jugador y además la variable
   * que indica si ya había hecho lanzamientos...
   */
  const { color, hasInitialLaunch } = currentPlayerTurn;

  /**
   * Para el sonido de la selección de la celda...
   */
  playSound(hasInitialLaunch ? ESounds.SELECT_CELL : ESounds.FIRST_CELL);

  /**
   * Obtiene la celda que se ha seleccioando...
   */
  const cell = copyClientCells[cellPosition.row][cellPosition.col];

  /**
   * Se valida el número de dots que se establecen en la celda
   * lo cual depende si es la primera vez que hace un lanzamiento...
   */
  let newTotalDots = !hasInitialLaunch
    ? INITIAL_TOTAL_DOTS
    : cell.totalDots + INCREASE_DOTS;

  /**
   * Para evitar que se renderice más de los puntos permitidos...
   */
  if (newTotalDots > MAX_DOTS) {
    newTotalDots = MAX_DOTS;
  }

  /**
   * Se muta la data, en este caso como se cambian los dots, habrá animación
   * para ellos...
   */
  copyClientCells[cellPosition.row][cellPosition.col].totalDots = newTotalDots;
  copyClientCells[cellPosition.row][cellPosition.col].cellColor = color;

  /**
   * Se habilita la animación de los puntos, se garantiza
   * que el UI siga bloqueado y que el tiempo del siguiente
   * tueno no se ejecute...
   */
  setUiInteractions({
    ...UI_INTERACTIONS_STARTED,
    runDotAnimation: true,
  });

  return copyClientCells;
};

interface ValidateDotEndAnimation {
  clientCells: ICell[][];
  hasTurn: boolean;
  players: Player[];
  setUiInteractions: React.Dispatch<React.SetStateAction<IUInteractions>>;
}

/**
 * Valida cuando se ha terminado la validación de los puntos...
 * @param param0
 * @returns
 */
export const validateDotEndAnimation = ({
  clientCells,
  hasTurn = false,
  players,
  setUiInteractions,
}: ValidateDotEndAnimation) => {
  /**
   * Se hace una copia de las celdas, para así poderla mutar...
   */
  const copyClientCells = cloneDeep(clientCells);

  /**
   * Para indicar que se ha completado una celda...
   */
  let completeCell = false;

  /**
   * Se guarda el color de la celda que se está evaluando...
   */
  let cellColorComplete: TBoardColor | undefined = undefined;

  /**
   * Buscar aquellas celdas cuyo número de dots sean 4
   */
  for (let row = 0; row < TOTAL_CELLS; row++) {
    for (let col = 0; col < TOTAL_CELLS; col++) {
      /**
       * Se obtiene el color que tenga la celda, si es que tiene...
       */
      const cellColor = copyClientCells[row][col].cellColor;

      /**
       * Se valida que exista el color y además que el número de dots
       * sea igual a 4...
       */
      if (cellColor && copyClientCells[row][col].totalDots === MAX_DOTS) {
        /**
         * Se indica que al círculos base se anima, en este caso
         * se debe dividir, lo hace dpenediendo de a donde se pueda mover
         * lo que ya está validado dentro de la celda...
         */
        copyClientCells[row][col].isAnimate = true;

        /**
         * Se deben bucar las celdas vecinas a donde se debe establecer
         * la animación que se van a mover...
         */
        const neighboringCellsPath = getNeighboringCellsPath({ row, col });

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
        if (!completeCell) {
          completeCell = true;
          cellColorComplete = cellColor;
        }
      }
    }
  }

  /**
   * Existe un color de celda, se tiene que evaluar si el otro jugador
   * tiene celdas disponibles ó si al menos ya había hecho lanzamiento,
   * esto con el fin de detener la animación, ya que no es necesario
   * por que si no hay celdas del otro jugador se puede determinar
   * que se ha terminado el juego...
   */
  if (cellColorComplete && completeCell) {
    /**
     * Se obtiene el color opuesto al que se está evaluando...
     */
    const cellColorOposite = OPOSITE_BOARD_COLOR[cellColorComplete];

    /**
     * Se busca el jugador y se obtiene el valor si ya había hecho un
     * lazamiento...
     */
    const hasInitialLaunch =
      players.find((v) => v.color === cellColorOposite)?.hasInitialLaunch ??
      false;

    /**
     * Se obtiene el total de celdas del color opuesto, siempre y cuando
     * se haya valdiado que ya había hecho un lanzamiento...
     */
    const totalColorOposite = hasInitialLaunch
      ? getTotalCellsByColor(copyClientCells, cellColorOposite)
      : 0;

    /**
     * Se vlaida si el usuario ya había hecho su lanzamiento inicial, además
     * si el número de celdas que tiene ese usuario es cero, quiere decir
     * que no se debe hacer el siguiente paso de animación de celdas completas
     * y se debe invocar el next turn, en el seerver haría la validación
     * del game over...
     */
    completeCell = !(hasInitialLaunch && totalColorOposite === 0);
  }

  /**
   * Se indica que la animación del dot ha terminado...
   */
  setUiInteractions({
    ...UI_INTERACTIONS_STARTED,
    runDotAnimation: false,
    runCircleAnimation: completeCell,
  });

  /**
   * Si no se completa una celda, en este caso se tiene que emitir el siguiente turno...
   */
  if (!completeCell && hasTurn) {
    Rune.actions.onNextTurn(getCellServer(copyClientCells));
  }

  return copyClientCells;
};

interface ValidateCircleEndAnimation {
  clientCells: ICell[][];
  setUiInteractions: React.Dispatch<React.SetStateAction<IUInteractions>>;
}

/**
 * Valida cuando se ha terminado la validación de animación de los círculos...
 * @param param0
 * @returns
 */
export const validateCircleEndAnimation = ({
  clientCells,
  setUiInteractions,
}: ValidateCircleEndAnimation) => {
  /**
   * Para el sonido de la división de la celda...
   */
  playSound(ESounds.SPLIT_CELL);

  /**
   * Se hace una copia de las celdas, para así poderla mutar...
   */
  const copyClientCells = cloneDeep(clientCells);

  /**
   * Buscar las celdas a las cuales se indicó que se debe animar...
   */
  for (let row = 0; row < TOTAL_CELLS; row++) {
    for (let col = 0; col < TOTAL_CELLS; col++) {
      /**
       * Se obtiene los valors iniciales para la validación...
       */
      const { isAnimate, totalDots, circleOutsite } = copyClientCells[row][col];

      /**
       * Sólo se validan aquellas celdas que tenían animación...
       */
      if (isAnimate) {
        /**
         * Se obtiene el total de dots que se movieron por fuera en esa celda...
         */
        const totalDotsOutsite = circleOutsite.length;

        /**
         * Se obtiene el total de puntos, validando si es que se ha movido a una
         * nueva celda...
         */
        let newTotalDots =
          totalDotsOutsite !== 0 ? totalDots + totalDotsOutsite : 0;

        /**
         * Se evidenció que a veces pueden quedar más dots en una sola celda,
         * por ejemplo si la celda ya tenía 3 dots y las celdas vecinas tenían 4
         * se moverían por ejemplo dos nuevos círculos, quedando en este caso
         * 5 dots, lo cual sería más de los 4 dots peemitos por celda,
         * con está validación se establece que siempre serán 4, el número
         * de dots no se tiene en cuenta para el score...
         *
         */
        if (newTotalDots > MAX_DOTS) {
          newTotalDots = MAX_DOTS;
        }

        /**
         * Se obtiene el color de la celda que debe quedar, el cual
         * proviene de los círculos que se animaron por fuera, puede
         * ser que sea el mismo color que ya tenía o puede que no,
         * como son varios y son del mismo color se obtiene el primero,
         * si no hay círculos que vengan por fuera, quiere decir que la
         * celda ya no debe tener el color...
         */
        const newCellColor =
          totalDotsOutsite !== 0
            ? circleOutsite[0].colorCircleOutside
            : undefined;

        /**
         * Se actuliza el valor de los puntos...
         */
        copyClientCells[row][col].totalDots = newTotalDots;

        /**
         * Se actualiza el color de la celda...
         */
        copyClientCells[row][col].cellColor = newCellColor;

        /**
         * Se indica que ya no está animado...
         */
        copyClientCells[row][col].isAnimate = false;

        /**
         * Además se quitan los círculos de animación que estaban por fuera...
         */
        copyClientCells[row][col].circleOutsite = [];
      }
    }
  }

  /**
   * Se indica que se debe reiniciar la animación de los puntos...
   */
  setUiInteractions({
    ...UI_INTERACTIONS_STARTED,
    runDotAnimation: true,
  });

  return copyClientCells;
};

interface GetRandomCell {
  currentPlayer: Player;
  clientCells: ICell[][];
}

/**
 * Para obtener una celda aleatoria, cuando se termina el tiempo del lanzamiento...
 * @param param0
 * @returns
 */
export const getRandomCell = ({
  currentPlayer,
  clientCells,
}: GetRandomCell): IMatrix => {
  let row = 0;
  let col = 0;
  let attemps = 0;

  /**
   * Obtener la información del jugador actual en cada sesión...
   */
  const { hasInitialLaunch, color } = currentPlayer;

  /**
   * Se obtiene el listado de celdas con el color del jugador actual...
   */
  const currentColorCell = getCellsByColor(clientCells, color);

  /**
   * Se debe obtener un valor random para la fila y la columna, se
   * debe validar que no sean del color del jugador opuesto...
   */
  const cellColorOposite = OPOSITE_BOARD_COLOR[color];

  /**
   * Se debe traer las celdas que están ocupadas con ese color...
   */
  const opositeColorCell = getCellsByColor(clientCells, cellColorOposite);

  /**
   * Calcular la total de celdas completas...
   */
  const totalCompleteCells = currentColorCell.length + opositeColorCell.length;

  /**
   * Validar si todas las celdas ya están completas, por tanto no se puede obtener un
   * valor aleatorio...
   */
  if (totalCompleteCells === TOTAL_CELLS_GRID) {
    return { row: -1, col: -1 };
  }

  /**
   * Ya había lanzado, pero no tiene celdas para seleccionar...
   */
  if (hasInitialLaunch && currentColorCell.length === 0) {
    return { row: -1, col: -1 };
  }

  /**
   * Saber si ya había lanzado antes, si no ha lanzado se debe validar el valor de
   * la celda...
   */
  if (!hasInitialLaunch) {
    /**
     * Se debe obtener el valor aleatorio de la fila y columna...
     */
    do {
      row = randomNumber(0, TOTAL_CELLS - 1);
      col = randomNumber(0, TOTAL_CELLS - 1);

      /**
       * Saber si el valor obtenido ya está tomando por otra celda...
       */
      const cellInUse =
        opositeColorCell.filter((v) => v.row === row && v.col === col)
          .length !== 0;

      if (!cellInUse) {
        break;
      }

      /**
       * Para evitar que se quede infinito...
       */
      attemps++;

      if (attemps === 200) {
        return { row: -1, col: -1 };
      }
      // eslint-disable-next-line no-constant-condition
    } while (true);
  } else {
    /**
     * Ya había lanzado, entonces se debe buscar la posición aleatoria
     * de las celdas que ya tiene ocupadas...
     */
    const randomIndex = randomNumber(0, currentColorCell.length - 1);
    row = currentColorCell[randomIndex].row;
    col = currentColorCell[randomIndex].col;
  }

  return { row, col };
};
