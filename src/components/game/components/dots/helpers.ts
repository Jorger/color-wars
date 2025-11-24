import { DOT_POSITION_IN_CELL } from "../../../../utils/dotPosition";
import type { ICoordiante } from "../../../../interfaces";

/**
 * Calcula los props de los dots dentro de la celda...
 * @param index
 * @param total
 * @returns
 */
export const getDotsProps = (index = 0, total = 0) => {
  /**
   * Se obtiene la posición del índice para DOT_POSITION_IN_CELL
   */
  const indexPosition = total - 1;

  /**
   * Se valida si el dot estará visible o no...
   */
  const isHide = index >= total;

  /**
   * Po defecto parte del centro...
   */
  let position: ICoordiante = DOT_POSITION_IN_CELL[0][0];

  /**
   * Si no está oculta se obtiene la posición en DOT_POSITION_IN_CELL en la que quedará...
   */
  if (!isHide) {
    position = DOT_POSITION_IN_CELL[indexPosition][index];
  } else if (index === 3) {
    /**
     * Si es el 3 y está oculta su posición inicial quedará en la tercera posición...
     */
    position = DOT_POSITION_IN_CELL[2][2];
  }

  return {
    position,
    isHide,
  };
};
