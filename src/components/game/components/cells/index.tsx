import { Cell } from "..";
import React from "react";
import type { ICell, Player, TOnClickCell } from "../../../../interfaces";
import { validateisDisabledCell } from "./helpers";

interface CellsProps {
  cells: ICell[][];
  disableUI: boolean;
  player?: Player;
  onClick: TOnClickCell;
}

const Cells = ({ cells, disableUI = false, player, onClick }: CellsProps) => {
  return (
    player && (
      <React.Fragment>
        {cells.map((field) => {
          return field.map((data) => {
            const { cellPosition } = data;
            const isDisabled = validateisDisabledCell({
              cellPosition,
              disableUI,
              player,
              cells,
            });

            return (
              <Cell
                {...data}
                key={`${cellPosition.col}-${cellPosition.row}`}
                isDisabled={isDisabled}
                onClick={onClick}
              />
            );
          });
        })}
      </React.Fragment>
    )
  );
};

export default Cells;
