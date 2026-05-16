import type { PageData } from "../lib/Page";
import { boardsView } from "./components/boards";

// The welcome message shown in Section 1 before anything is selected
export const welcomeDetail: PageData = {
  tag: "main",

  id: "main",
  content: [
    {
      tag: "div",
      content: [boardsView],
    },
    {
      tag: "div",
      class: "btnContainer",
      content: [
        {
          tag: "button",
          class: "btn",
          content: "Randomize",
        },
        {
          tag: "button",
          class: "btn",
          content: "Play",
        },
      ],
    },
  ],
};

export function getHomeData(): PageData {
  return [welcomeDetail];
}
