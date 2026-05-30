import { eventBus } from "../../lib/EventBus";
import { driver, game } from "../../lib/gameDriver";
import { mainContainer } from "../../lib/renderUtilities";
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
  gameOver("Computer");
}

export function handleNewMatch(_match: Element | null, _e: PointerEvent) {
  game.setupBoard = driver();
  eventBus.publish("new:game", game.setupBoard.playerBoard.occupied);
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
