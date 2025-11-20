import "./styles.css";
import { BASE_CLASS_NAME_GAME } from "../../../../utils/constants";
import React from "react";
import type { ICoordiante } from "../../../../interfaces";

const BASE_CLASS_NAME = `${BASE_CLASS_NAME_GAME}-dot`;

const CLASS_NAMES = {
  DOT: BASE_CLASS_NAME,
  HIDE: `${BASE_CLASS_NAME}-hide`,
};

interface DotProps {
  position: ICoordiante;
  isHide?: boolean;
}

const Dot = ({ position, isHide = false }: DotProps) => {
  const style: React.CSSProperties = {
    left: position.x,
    top: position.y,
  };

  const className = `${CLASS_NAMES.DOT} ${isHide ? CLASS_NAMES.HIDE : ""}`;

  return <div className={className} style={style} />;
};

export default React.memo(Dot);
