import { eventBus } from "../../lib/EventBus";
import type { PayLoad } from "../../lib/GameBoard";
import { game } from "../../lib/gameDriver";
import { mainContainer, renderElement } from "../../lib/renderUtilities";
import { overlayData } from "../../model/components/overlay";
import { interactionHandler } from "../handlers/handleBtn";

function humanInitAtk(data: unknown) {
  let dataValue = data as PayLoad;
  const [x, y] = dataValue.coordinate;
  let cell = mainContainer?.querySelector(
    `#computerBoard [data-cord="${x},${y}"]`,
  );

  if (!cell) return;
  console.log(data);

  if (dataValue.missed) {
    cell.classList.add("missed");
    game.setupBoard.currentPlayer = "computer";
    setTimeout(computerReaction, 500);
  } else if (dataValue.hit) {
    cell.classList.add("success");
  }
  if (dataValue.allSunk) {
    gameOver();
    return;
  }
}

const playerBoardListener = {
  handler: humanInitAtk,
  kill: eventBus.subscribe("Computer:attack", humanInitAtk),
};

//computer
function computerInitAtk(data: unknown) {
  let dataValue = data as PayLoad;
  const [x, y] = dataValue.coordinate;
  let cell = mainContainer?.querySelector(
    `#playerBoard [data-cord="${x},${y}"]`,
  );
  if (!cell) return;

  if (dataValue.missed) {
    cell.classList.add("missed");
    game.setupBoard.currentPlayer = "human";
  } else if (dataValue.hit) {
    cell.classList.add("success");
  }
  if (dataValue.allSunk) {
    gameOver();
    return;
  }
  if (game.setupBoard.currentPlayer === "computer") {
    setTimeout(computerReaction, 500);
  }
}

function computerReaction() {
  game.setupBoard.computer.attack();
}

const computerBoardListener = {
  handler: computerInitAtk,
  kill: eventBus.subscribe("Human:attack", computerInitAtk),
};

//helper
export function gameOver() {
  if (!mainContainer) return;
  let retreatBtn = mainContainer.querySelector("#retreat") as HTMLElement;
  retreatBtn.textContent = "New Match";
  retreatBtn.setAttribute("id", "newMatch");
  let computerBoard = mainContainer.querySelector(
    "#computerBoard",
  ) as HTMLElement;

  let overlayMsg = mainContainer.querySelector("#overlay") as HTMLElement;
  let winner = game.setupBoard.computerBoard.allSunk() ? "you" : "computer";
  if (overlayMsg) {
    renderElement(overlayMsg, overlayData(winner));
    overlayMsg.style.display = "block";
  }
  computerBoard.removeEventListener("click", interactionHandler);
}

export { playerBoardListener, computerBoardListener };
