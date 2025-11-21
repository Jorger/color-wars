import type { ICell, IMatrix, Player } from "../../../../interfaces";

/**
 * Devuelve las posicones en la matriz que tengan el mismo color...
 * @param cells
 * @param cellColor
 * @returns
 */
// export const getCellsByColor = (cells: ICell[][], cellColor: TBoardColor) => {
//   const cellPositions: IMatrix[] = [];

//   for (let row = 0; row < TOTAL_CELLS; row++) {
//     for (let col = 0; col < TOTAL_CELLS; col++) {
//       if (cells[row][col].cellColor === cellColor) {
//         cellPositions.push({ row, col });
//       }
//     }
//   }

//   return cellPositions;
// };

/**
 * Devuelve la totalidad de celdas con el mismo color...
 * @param cells
 * @param cellColor
 * @returns
 */
// export const getTotalCellsByColor = (
//   cells: ICell[][],
//   cellColor: TBoardColor
// ) => getCellsByColor(cells, cellColor).length;

interface ValidateisDisabledCell {
  cellPosition: IMatrix;
  disableUI: boolean;
  player: Player;
  cells: ICell[][];
}

export const validateisDisabledCell = ({
  cellPosition,
  disableUI,
  player,
  cells,
}: ValidateisDisabledCell) => {
  /**
   * Si el UI está bloqueado, por defecto estarán deshabilitadas las celdas...
   */
  if (disableUI) return true;

  /**
   * Se extrae el color que tiene la celda...
   */
  const { cellColor } = cells[cellPosition.row][cellPosition.col];

  /**
   * Si el usuario no ha hecho lanzamiento, se establece que todas estén habilitadas
   * siempre y cuando no estén ya en uso...
   */
  if (!player.hasInitialLaunch) {
    return !!cellColor;
  }

  /**
   * Si es el mismo color, debe estar habilitada...
   */
  return !(cellColor === player.color);
};
