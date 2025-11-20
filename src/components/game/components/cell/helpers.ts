import { IMatrix, TPath } from "../../../../interfaces";
import {
  CIRCLE_POSITION_INDEX,
  ECirclePosition,
  NEXT_MATRIX_POSITION,
} from "../../../../utils/constants";
import { cellPositionInRage } from "../../../../utils/indexInRange";

interface GetPropsBaseCircles {
  cellPosition: IMatrix;
  isAnimate: boolean;
}

/**
 * Calcula el número de circulos que tendá la celda, dependiendo si es animado
 * y de su posición...
 * @param param0
 * @returns
 */
export const getPropsBaseCircles = ({
  cellPosition,
  isAnimate,
}: GetPropsBaseCircles): TPath[] => {
  if (!isAnimate) {
    return [[ECirclePosition.CENTER, ECirclePosition.CENTER]];
  }

  const paths: TPath[] = [];

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
