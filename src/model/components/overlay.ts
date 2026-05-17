import type { PageData } from "../../lib/Page";

export function overlayData(winner: string): PageData {
  return {
    tag: "div",
    id: "overlayText",
    content: `${winner} win`,
  };
}
