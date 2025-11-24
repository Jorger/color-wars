import { Cell } from "..";
import { validateisDisabledCell } from "./helpers";
import React from "react";
import type { ICell, Player, TOnClickCell } from "../../../../interfaces";

interface CellsProps {
  cells: ICell[][];
  disableUI: boolean;
  player?: Player;
  onClick: TOnClickCell;
}

/**
 * Componente que renderiza las diferentes celdas que estarán dentro de la grilla...
 * @param param0
 * @returns
 */
const Cells = ({ cells, disableUI = false, player, onClick }: CellsProps) => (
  <React.Fragment>
    {cells.map((field) =>
      field.map((data) => {
        const { cellPosition } = data;
        /**
         * Se valida si la celda está habilitada o no...
         */
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
      })
    )}
  </React.Fragment>
);

export default Cells;
