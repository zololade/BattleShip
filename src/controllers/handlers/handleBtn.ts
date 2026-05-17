import { setupBoard } from "../../lib/gameDriver";
import { mainContainer, renderElement } from "../../lib/renderUtilities";
import { overlayData } from "../../model/components/overlay";

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

export function handlePlay(_match: Element | null, _e: PointerEvent) {
  if (!mainContainer) return;

  mainContainer.querySelector("#randomize")?.setAttribute("disabled", "");
  let computerBoard = mainContainer.querySelector(
    "#computerBoard",
  ) as HTMLElement;
  if (!computerBoard) return;

  computerBoard.addEventListener("click", interactionHandler);
}

function interactionHandler(e: PointerEvent) {
  let target = e.target as HTMLElement;
  let cell = target.closest(`[data-cord]`) as HTMLElement;
  if (!cell) return;
  humanInteraction(cell);
}

function humanInteraction(cell: HTMLElement) {
  let cordStr = cell.dataset["cord"];
  let cord = cordStr?.split(",") as [string, string];
  let [x, y] = cord;

  let canAttack = setupBoard.player.attack(+x, +y);
  if (!canAttack) return;

  if (cordStr && setupBoard.computerBoard.missedAttack.has(cordStr)) {
    cell.classList.add("missed");
    setupBoard.currentPlayer = "computer";
    while (setupBoard.currentPlayer === "computer") {
      computerReaction();
      if (
        setupBoard.playerBoard.allSunk() ||
        setupBoard.computerBoard.allSunk()
      ) {
        gameOver();
        break;
      }
    }
  } else if (
    cordStr &&
    setupBoard.computerBoard.successfulAttack.has(cordStr)
  ) {
    cell.classList.add("success");
  }
  if (setupBoard.playerBoard.allSunk() || setupBoard.computerBoard.allSunk()) {
    gameOver();
    return;
  }
}

function computerReaction() {
  let board = mainContainer?.querySelector(`#playerBoard`) as HTMLElement;

  let coord = setupBoard.computer.attack();
  let cell = board.querySelector(`[data-cord="${coord}"]`) as HTMLElement;
  if (!cell) return;

  if (setupBoard.playerBoard.missedAttack.has(coord)) {
    cell.classList.add("missed");
    setupBoard.currentPlayer = "human";
  } else if (setupBoard.playerBoard.successfulAttack.has(coord)) {
    cell.classList.add("success");
  }
}

function gameOver() {
  if (!mainContainer) return;

  let computerBoard = mainContainer.querySelector(
    "#computerBoard",
  ) as HTMLElement;
  // let host = mainContainer.querySelector("#boards") as HTMLElement;
  let overlayMsg = mainContainer.querySelector("#overlay") as HTMLElement;
  let winner = setupBoard.computerBoard.allSunk() ? "you" : "computer";
  if (overlayMsg) {
    renderElement(overlayMsg, overlayData(winner));
    overlayMsg.style.display = "block";
  }
  computerBoard.removeEventListener("click", interactionHandler);
}
