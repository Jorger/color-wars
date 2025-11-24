import { cellPositionInRage } from "../../../../utils/indexInRange";
import { IMatrix, TPath } from "../../../../interfaces";
import {
  CIRCLE_POSITION_INDEX,
  ECirclePosition,
  NEXT_MATRIX_POSITION,
} from "../../../../utils/constants";

interface GetPropsBaseCircles {
  cellPosition: IMatrix;
  isAnimate: boolean;
}

/**
 * Calcula el número de circulos que tendá la celda, dependiendo si es animado
 * y de su posición, mínimo dos, máximo 4
 * @param param0
 * @returns
 */
export const getPropsBaseCircles = ({
  cellPosition,
  isAnimate,
}: GetPropsBaseCircles): TPath[] => {
  /**
   * Si no está animado, por defecto su posición es en el centro...
   */
  if (!isAnimate) {
    return [[ECirclePosition.CENTER, ECirclePosition.CENTER]];
  }

  /**
   * Guardará la información del path de animación...
   */
  const paths: TPath[] = [];

  /**
   * Se iteran los posibles path y se determina si está dentro
   * del rango de la grilla...
   */
  for (const circlePosition of CIRCLE_POSITION_INDEX) {
    const increase = NEXT_MATRIX_POSITION[circlePosition];
    const newPosition: IMatrix = {
      row: cellPosition.row + increase.row,
      col: cellPosition.col + increase.col,
    };

    if (cellPositionInRage(newPosition)) {
      paths.push([ECirclePosition.CENTER, circlePosition]);
    }
  }

  return paths;
};
