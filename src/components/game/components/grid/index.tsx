import "./styles.css";
import { BASE_CLASS_NAME_GAME } from "../../../../utils/constants";
import { ReactNode } from "react";

const BASE_CLASS_NAME = `${BASE_CLASS_NAME_GAME}-grid`;

interface GridProps {
  children: JSX.Element | JSX.Element[] | ReactNode;
}

const Grid = ({ children }: GridProps) => (
  <div className={BASE_CLASS_NAME}>{children}</div>
);

export default Grid;
