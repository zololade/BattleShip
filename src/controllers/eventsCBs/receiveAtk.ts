import { eventBus } from "../../lib/EventBus";
import type { PayLoad } from "../../lib/GameBoard";
import { game } from "../../lib/gameDriver";
import { mainContainer } from "../../lib/renderUtilities";
import { gameOver } from "../helpers/gameOver";

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

export { playerBoardListener, computerBoardListener };
