import { eventBus } from "./EventBus";
import { GameBoard } from "./GameBoard";
import { Computer, Player } from "./Player";

type PlayerInd = "human" | "computer";
export interface Driver {
  playerBoard: GameBoard;
  computerBoard: GameBoard;
  player: Player;
  computer: Computer;
  currentPlayer: PlayerInd;
}

export function driver(): Driver {
  let currentPlayer: PlayerInd = "human";
  const playerBoard = new GameBoard(eventBus);
  const computerBoard = new GameBoard(eventBus);
  const player = new Player(computerBoard, playerBoard);
  const computer = new Computer(playerBoard, computerBoard);

  playerBoard.placeShip();
  computerBoard.placeShip();

  return {
    playerBoard,
    computerBoard,
    player,
    computer,
    currentPlayer,
  };
}

export const game = { setupBoard: driver() };
