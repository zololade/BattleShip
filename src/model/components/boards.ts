// import { game } from "../../lib/gameDriver";
import type { Coord } from "../../lib/GameBoard";
import type { PageData } from "../../lib/Page";

let playerShipCoord = (arr: Coord[][]) =>
  new Set(arr.flat().map((val) => `${val[0]},${val[1]}`));

// The welcome message shown in Section 1 before anything is selected
export const boardsView: PageData = {
  tag: "div",
  id: "boards",

  content: cellsAndOverlay(),
};

export function cellsAndOverlay(pos?: Coord[][]) {
  return [
    {
      tag: "div",
      id: "overlay",
    },
    {
      tag: "div",
      class: "board",
      id: "playerBoard",
      content: pos ? createCells(playerShipCoord(pos)) : createCells(),
    },
    {
      tag: "div",
      class: "board",
      id: "computerBoard",
      content: createCells(),
    },
  ];
}

// helpers
function createCells(coordArr?: Set<string>): PageData[] {
  let cells = Array.from({ length: 100 }).map((_val, index) => {
    return {
      tag: "div",
      class: "cell",
      "data-cord": coordStr(index),
      ...(coordArr?.has(coordStr(index)) && { "data-occupied": true }),
    };
  });
  return cells;
}

function coordStr(index: number) {
  return `${Math.floor(index / 10)},${index % 10}`;
}
