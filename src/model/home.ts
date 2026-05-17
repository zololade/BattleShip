import type { PageData } from "../lib/Page";
import { boardsView } from "./components/boards";

// The welcome message shown in Section 1 before anything is selected
export const initialView: PageData = {
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
          id: "randomize",
          content: "Randomize",
        },
        {
          tag: "button",
          class: "btn",
          id: "play",
          content: "Engage",
        },
      ],
    },
  ],
};

export function getHomeData(): PageData {
  return [initialView];
}
