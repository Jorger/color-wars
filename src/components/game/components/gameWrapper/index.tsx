import "./styles.css";
import { BASE_CLASS_NAME_GAME, EBoardColor } from "../../../../utils/constants";
import React, { ReactNode } from "react";
import type { IBackgroud } from "../../../../interfaces";

const BASE_CLASS_NAME = `${BASE_CLASS_NAME_GAME}-wrapper`;

const CLASS_NAMES = {
  WRAPPER: BASE_CLASS_NAME,
  DISABLE: `${BASE_CLASS_NAME}-disable`,
};

interface GameWrapperProps {
  currentColor?: IBackgroud;
  disableUI?: boolean;
  children: JSX.Element | JSX.Element[] | ReactNode;
}

const GameWrapper = ({
  disableUI = false,
  currentColor = EBoardColor.BLUE,
  children,
}: GameWrapperProps) => (
  <div className={`${CLASS_NAMES.WRAPPER} ${currentColor.toLowerCase()}`}>
    {disableUI && <div className={CLASS_NAMES.DISABLE} />}
    {children}
  </div>
);

export default React.memo(GameWrapper);
