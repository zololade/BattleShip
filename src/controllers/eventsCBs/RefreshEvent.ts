import { eventBus } from "../../lib/EventBus";
import type { Coord } from "../../lib/GameBoard";
import { mainContainer } from "../../lib/renderUtilities";

function updatePlayerBoard(data: unknown) {
  let dataValue = data as Coord[][];
  if (!mainContainer) return;

  mainContainer.querySelectorAll("[data-occupied='true']").forEach((currEl) => {
    let element = currEl as HTMLElement;
    delete element.dataset["occupied"];
  });

  let playerShipCoord = new Set(
    dataValue.flat().map((val) => `${val[0]},${val[1]}`),
  );

  playerShipCoord.forEach((val) => {
    let cell = mainContainer?.querySelector(
      `[data-cord="${val}"]`,
    ) as HTMLElement;
    if (cell) cell.dataset["occupied"] = "true";
  });
}

const playerBoardListener = {
  handler: updatePlayerBoard,
  kill: eventBus.subscribe("Refresh player board", updatePlayerBoard),
};

export { playerBoardListener };
