import { eventBus } from "../../lib/EventBus";
import type { Coord } from "../../lib/GameBoard";
import { mainContainer, renderElement } from "../../lib/renderUtilities";
import { cellsAndOverlay } from "../../model/components/boards";

function startNewGame(data: unknown) {
  let arr = data as Coord[][];
  let match = mainContainer?.querySelector("#newMatch");
  if (!mainContainer || !match) return;

  let boardsHost = mainContainer.querySelector("#boards") as HTMLElement;
  if (!boardsHost) return;

  mainContainer.querySelector("#randomize")?.removeAttribute("disabled");
  match.textContent = "Engage";
  match.setAttribute("id", "play");

  renderElement(boardsHost, cellsAndOverlay(arr));
}

const startNewGameListener = {
  handler: startNewGame,
  kill: eventBus.subscribe("new:game", startNewGame),
};

export { startNewGameListener };
