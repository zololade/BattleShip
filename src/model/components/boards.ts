import { setupBoard } from "../../lib/gameDriver";
import type { PageData } from "../../lib/Page";

let playerShipCoord = new Set(
  setupBoard.playerBoard.occupied.flat().map((val) => `${val[0]},${val[1]}`),
);

// The welcome message shown in Section 1 before anything is selected
export const boardsView: PageData = {
  tag: "div",
  id: "boards",

  content: [
    {
      tag: "div",
      id: "overlay",
    },
    {
      tag: "div",
      class: "board",
      id: "playerBoard",
      content: createCells(playerShipCoord),
    },
    {
      tag: "div",
      class: "board",
      id: "computerBoard",
      content: createCells(),
    },
  ],
};

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
