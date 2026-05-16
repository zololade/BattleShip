import { GameBoard } from "./GameBoard";

export class Player {
  protected opBoard: GameBoard;
  public ownBoard: GameBoard;
  constructor(op: GameBoard, own: GameBoard = new GameBoard()) {
    this.opBoard = op;
    this.ownBoard = own;
  }

  attack(x: number, y: number) {
    this.opBoard.receiveAttack(x, y);
  }
}

export class Computer extends Player {
  constructor(op: GameBoard, own: GameBoard = new GameBoard()) {
    super(op, own);
  }

  override attack() {
    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);

    super.attack(x, y);
  }
}

// there will be a driver that calls Comp.attack
