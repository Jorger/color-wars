import "./styles.css";
import { BASE_CLASS_NAME_GAME } from "../../../../utils/constants";
import { Circle, Dots } from "../";
import { getPropsBaseCircles } from "./helpers";
import type { ICell, TOnClickCell } from "../../../../interfaces";

const BASE_CLASS_NAME = `${BASE_CLASS_NAME_GAME}-cell`;

const CLASS_NAMES = {
  CELL: BASE_CLASS_NAME,
};

interface CellProps extends ICell {
  isDisabled: boolean;
  onClick: TOnClickCell;
}

const Cell = ({
  cellPosition = { row: 0, col: 0 },
  isDisabled = false,
  totalDots = 0,
  cellColor,
  isAnimate = false,
  circleOutsite = [],
  onClick,
}: CellProps) => {
  /**
   * Se valida si se tienen círculos que se animan desde afuera...
   */
  const hasCircleOutsite = circleOutsite.length !== 0;

  /**
   * Valida si se hace una animación de círculos múltiples que salgan
   * del centro de la celda...
   */
  const animateMultipleCircles = isAnimate && !hasCircleOutsite;

  /**
   * Sólo se activa el color de la celda si existe y además no está bloqueado el botón
   */
  const className = `${CLASS_NAMES.CELL} ${!isDisabled && cellColor ? cellColor.toLowerCase() : ""}`;

  return (
    <button
      className={className}
      disabled={isDisabled}
      onClick={() => onClick(cellPosition)}
    >
      {/* 
        Si no se anima los círculos múltiples, se mostrará sólo
        el círculo base, siempre y cuando se tenga dots y el color del
        círculo, pero si se hace la animacón de mover a otras celdas
        se renderizarán varios círculos, dependiendo a donde se puedan mover
      */}
      {totalDots > 0 &&
        cellColor &&
        getPropsBaseCircles({
          cellPosition,
          isAnimate: animateMultipleCircles,
        }).map((path, index) => {
          return (
            <Circle
              key={index}
              path={path}
              isAnimate={animateMultipleCircles}
              color={cellColor}
            />
          );
        })}

      {/* Renderiza el circulo o círculos que se anima desde afuera */}
      {isAnimate &&
        hasCircleOutsite &&
        circleOutsite.map(({ pathCircleOutside, colorCircleOutside }, key) => {
          return (
            <Circle
              key={key}
              path={pathCircleOutside}
              isAnimate
              color={colorCircleOutside}
            />
          );
        })}
      {/*
        Si no se está haciendo la animación de mover varios circulos a otras
        celdas, se renderiza los dots
      */}
      {!animateMultipleCircles && <Dots total={totalDots} />}
    </button>
  );
};

export default Cell;
