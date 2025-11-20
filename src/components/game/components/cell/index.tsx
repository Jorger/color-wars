import "./styles.css";
import { BASE_CLASS_NAME_GAME } from "../../../../utils/constants";
import { Circle, Dots } from "../";
import { getPropsBaseCircles } from "./helpers";
import type {
  ICircleOutsite,
  IMatrix,
  TBoardColor,
} from "../../../../interfaces";

const BASE_CLASS_NAME = `${BASE_CLASS_NAME_GAME}-cell`;

const CLASS_NAMES = {
  CELL: BASE_CLASS_NAME,
};

interface CellProps {
  cellPosition: IMatrix;
  isDisabled: boolean;
  cellColor?: TBoardColor;
  totalDots?: number;
  colorCircleBase?: TBoardColor;
  isAnimate?: boolean;
  circleOutsite?: ICircleOutsite;
  onClick: (cellPosition: IMatrix) => void;
}

const Cell = ({
  cellPosition = { row: 0, col: 0 },
  isDisabled = true,
  totalDots = 0,
  cellColor,
  colorCircleBase,
  isAnimate = false,
  circleOutsite,
  onClick,
}: CellProps) => {
  const className = `${CLASS_NAMES.CELL} ${cellColor ? cellColor.toLowerCase() : ""}`;
  const { pathCircleOutside, colorCircleOutside } = circleOutsite || {};
  const hasCircleOutsite = !!(pathCircleOutside && colorCircleOutside);
  const animateMultipleCircles = isAnimate && !hasCircleOutsite;

  return (
    <button
      className={className}
      disabled={isDisabled}
      onClick={() => onClick(cellPosition)}
    >
      {/* Renderizar el circulo semilla y la animación */}
      {totalDots > 0 &&
        colorCircleBase &&
        getPropsBaseCircles({
          cellPosition,
          isAnimate: animateMultipleCircles,
        }).map((path, index) => {
          return (
            <Circle
              key={index}
              path={path}
              isAnimate={animateMultipleCircles}
              color={colorCircleBase}
            />
          );
        })}

      {/* Renderiza el circulo que se anima desde afuera */}
      {isAnimate && hasCircleOutsite && (
        <Circle path={pathCircleOutside} isAnimate color={colorCircleOutside} />
      )}

      {!animateMultipleCircles && <Dots total={totalDots} />}
    </button>
  );
};

export default Cell;
