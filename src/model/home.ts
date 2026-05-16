import type { PageData } from "../lib/Page";
import { boardsView } from "./components/boards";

// The welcome message shown in Section 1 before anything is selected
export const welcomeDetail: PageData = {
  tag: "main",

  id: "main",
  content: [
    {
      tag: "h2",

      content: [boardsView],
    },
  ],
};

export function getHomeData(): PageData {
  return [welcomeDetail];
}
