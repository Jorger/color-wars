import "./styles.css";
import { BASE_CLASS_NAME_GAME, EBoardColor } from "../../../../utils/constants";
import { Dot } from "..";
import { DOT_POSITION_IN_CIRCLE } from "../../../../utils/dotPosition";
import CIRCLE_POSITION from "../../../../utils/circlePosition";
import React from "react";
import type { TBoardColor, TPath } from "../../../../interfaces";

const BASE_CLASS_NAME = `${BASE_CLASS_NAME_GAME}-circle`;

const CLASS_NAMES = {
  CIRCLE: BASE_CLASS_NAME,
  ANIMATE: `${BASE_CLASS_NAME}-animate`,
};

interface CircleProps {
  color: TBoardColor;
  path: TPath;
  isAnimate?: boolean;
}

const Circle = ({
  path,
  isAnimate = false,
  color = EBoardColor.RED,
}: CircleProps) => {
  /**
   * Se obtiene el path de animación...
   */
  const [from, to] = [CIRCLE_POSITION[path[0]], CIRCLE_POSITION[path[1]]];

  /**
   * Se establecen las variables css para animar el círculo...
   */
  const style = {
    "--x1": `${from.x}px`,
    "--y1": `${from.y}px`,
    "--x2": `${to.x}px`,
    "--y2": `${to.y}px`,
  } as React.CSSProperties;

  const className = `${CLASS_NAMES.CIRCLE} ${color.toLowerCase()} ${isAnimate ? CLASS_NAMES.ANIMATE : ""}`;

  /**
   * Si no está animado, por defecto la posición del círculo es su posición inicial...
   */
  if (!isAnimate) {
    style.left = `${from.x}px`;
    style.top = `${from.y}px`;
  }

  return (
    <div className={className} style={style}>
      {isAnimate && <Dot position={DOT_POSITION_IN_CIRCLE} />}
    </div>
  );
};

export default React.memo(Circle);
