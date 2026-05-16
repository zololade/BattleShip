import { mainContainer } from "../lib/renderUtilities";

const clickHandlers = [
  { selector: "#addProjectBtn", handler: handleAddProject },
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
