import type { PageData } from "../../lib/Page";

// The welcome message shown in Section 1 before anything is selected
export const boardsView: PageData = {
  tag: "div",
  id: "boards",

  content: [
    {
      tag: "div",
      class: "board",
      id: "playerBoard",
      content: createCells(),
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
function createCells(): PageData[] {
  let cells = Array.from({ length: 100 }).map((_val, index) => {
    return {
      tag: "div",
      class: "cell",
      "data-cord": `${Math.floor(index / 10)},${index % 10}`,
    };
  });
  return cells;
}
