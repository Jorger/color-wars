import { Dot } from "..";
import { getDotsProps } from "./helpers";
import { MAX_DOTS } from "../../../../utils/constants";
import React from "react";

interface DotsProps {
  total: number;
}

const Dots = ({ total = 1 }: DotsProps) => (
  <React.Fragment>
    {new Array(MAX_DOTS).fill(null).map((_, index) => (
      <Dot key={index} {...getDotsProps(index, total)} />
    ))}
  </React.Fragment>
);

export default Dots;
