import type { PageData } from "../lib/Page";

// The welcome message shown in Section 1 before anything is selected
export const welcomeDetail: PageData = {
  tag: "div",

  id: "projectInfo",
  content: [
    {
      tag: "h2",

      content: "Welcome",
    },
    {
      tag: "p",

      content: "start",
    },
  ],
};

export function getHomeData(): PageData {
  return [welcomeDetail];
}
