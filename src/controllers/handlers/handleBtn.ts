import { setupBoard } from "../../lib/gameDriver";
import { mainContainer } from "../../lib/renderUtilities";

export function handleRandomize(_match: Element | null, _e: PointerEvent) {
  if (!mainContainer) return;

  mainContainer.querySelectorAll("[data-occupied='true']").forEach((currEl) => {
    let element = currEl as HTMLElement;
    delete element.dataset["occupied"];
  });

  setupBoard.playerBoard.placeShip();
  let playerShipCoord = new Set(
    setupBoard.playerBoard.occupied.flat().map((val) => `${val[0]},${val[1]}`),
  );

  playerShipCoord.forEach((val) => {
    let cell = mainContainer?.querySelector(
      `[data-cord="${val}"]`,
    ) as HTMLElement;
    if (cell) cell.dataset["occupied"] = "true";
  });
}
