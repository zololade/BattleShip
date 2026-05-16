import { GameBoard } from "./GameBoard";
import { Computer, Player } from "./Player";

function driver() {
  const playerBoard = new GameBoard();
  const computerBoard = new GameBoard();
  const player = new Player(computerBoard, playerBoard);
  const computer = new Computer(playerBoard, computerBoard);

  playerBoard.placeShip();
  computerBoard.placeShip();

  return {
    playerBoard,
    computerBoard,
    player,
    computer,
  };
}

export let setupBoard = driver();
