import { Dot } from "..";
import { getDotsProps } from "./helpers";
import { MAX_DOTS } from "../../../../utils/constants";
import React from "react";

interface DotsProps {
  total: number;
}

/**
 * Renderiza el listao de dots que tiene cada celda...
 * @param param0
 * @returns
 */
const Dots = ({ total = 1 }: DotsProps) => (
  <React.Fragment>
    {new Array(MAX_DOTS).fill(null).map((_, index) => (
      <Dot key={index} {...getDotsProps(index, total)} />
    ))}
  </React.Fragment>
);

export default Dots;
