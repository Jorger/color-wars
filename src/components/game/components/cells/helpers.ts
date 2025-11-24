import type { ICell, IMatrix, Player } from "../../../../interfaces";

interface ValidateisDisabledCell {
  cellPosition: IMatrix;
  disableUI: boolean;
  player?: Player;
  cells: ICell[][];
}

/**
 * Función que valida si la celda estará habilitada o no,
 * lo cual depende del usuario...
 * @param param0
 * @returns
 */
export const validateisDisabledCell = ({
  cellPosition,
  disableUI,
  player,
  cells,
}: ValidateisDisabledCell) => {
  /**
   * Si el UI está bloqueado o no existe player,
   * por defecto estarán deshabilitadas las celda...
   */
  if (disableUI || !player) return true;

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
