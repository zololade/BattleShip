import { mainContainer } from "../lib/renderUtilities";
import {
  handleNewMatch,
  handlePlay,
  handleRandomize,
  handleRetreat,
} from "./handlers/handleBtn";

const clickHandlers = [
  { selector: "#randomize", handler: handleRandomize },
  {
    selector: "#play",
    handler: handlePlay,
  },
  {
    selector: "#retreat",
    handler: handleRetreat,
  },
  {
    selector: "#newMatch",
    handler: handleNewMatch,
  },
];

mainContainer?.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  for (const { selector, handler } of clickHandlers) {
    const match = target.closest(selector);
    if (match) {
      handler(match, e);
      break;
    }
  }
});
