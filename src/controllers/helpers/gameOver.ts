import { game } from "../../lib/gameDriver";
import { mainContainer, renderElement } from "../../lib/renderUtilities";
import { overlayData } from "../../model/components/overlay";
import { interactionHandler } from "../handlers/handleBtn";

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
