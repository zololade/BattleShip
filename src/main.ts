import "./style.css";
import { mainContainer, renderView } from "./lib/renderUtilities";
import "./lib/gameDriver";
import "./controllers/eventDelegations";
import "./controllers/eventsCBs/refreshEvent";
import "./controllers/eventsCBs/receiveAtk";
import "./controllers/eventsCBs/newGame";

// initial app load render
window.addEventListener("load", () => {
  if (!mainContainer) return;
  renderView("home");
});

window.addEventListener("load", () => {
  document.body.style.opacity = "1";
});
