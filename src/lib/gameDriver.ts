import { GameBoard } from "./GameBoard";
import { Computer, Player } from "./Player";

type PlayerInd = "human" | "computer";
interface Driver {
  playerBoard: GameBoard;
  computerBoard: GameBoard;
  player: Player;
  computer: Computer;
  currentPlayer: PlayerInd;
}

function driver(): Driver {
  let currentPlayer: PlayerInd = "human";
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
    currentPlayer,
  };
}

export let setupBoard = driver();
