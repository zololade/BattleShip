import { mainContainer } from "../lib/renderUtilities";
import { handleRandomize } from "./handlers/handleBtn";

const clickHandlers = [{ selector: "#randomize", handler: handleRandomize }];
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
