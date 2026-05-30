import { driver, game } from "../../lib/gameDriver";
import { mainContainer, renderElement } from "../../lib/renderUtilities";
import { cellsAndOverlay } from "../../model/components/boards";
import { gameOver } from "../helpers/gameOver";

export function handleRandomize(_match: Element | null, _e: PointerEvent) {
  game.setupBoard.playerBoard.placeShip();
}

export function handlePlay(match: Element | null, _e: PointerEvent) {
  if (!mainContainer || !match) return;

  match.textContent = "Retreat";
  match.setAttribute("id", "retreat");

  mainContainer.querySelector("#randomize")?.setAttribute("disabled", "");
  let computerBoard = mainContainer.querySelector(
    "#computerBoard",
  ) as HTMLElement;
  if (!computerBoard) return;

  computerBoard.addEventListener("click", interactionHandler);
}

export function handleRetreat(match: Element | null, _e: PointerEvent) {
  if (!mainContainer || !match) return;
  gameOver();
}

export function handleNewMatch(match: Element | null, _e: PointerEvent) {
  if (!mainContainer || !match) return;

  let boardsHost = mainContainer.querySelector("#boards") as HTMLElement;
  if (!boardsHost) return;

  mainContainer.querySelector("#randomize")?.removeAttribute("disabled");
  match.textContent = "Engage";
  match.setAttribute("id", "play");
  game.setupBoard = driver();

  renderElement(boardsHost, cellsAndOverlay());
}

//helpers
export function interactionHandler(e: PointerEvent) {
  let target = e.target as HTMLElement;
  let cell = target.closest(`[data-cord]`) as HTMLElement;
  if (!cell) return;

  if (game.setupBoard.currentPlayer === "computer") return;
  let cordStr = cell.dataset["cord"];
  if (!cordStr) return;

  const [x, y] = cordStr.split(",").map(Number) as [number, number];

  let canAttack = game.setupBoard.player.attack(x, y);
  if (!canAttack) return;
}
