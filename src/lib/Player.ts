import { GameBoard } from "./GameBoard";

export class Player {
  protected opBoard: GameBoard;
  public ownBoard: GameBoard;
  constructor(op: GameBoard, own: GameBoard = new GameBoard()) {
    this.opBoard = op;
    this.ownBoard = own;
  }

  attack(x: number, y: number): string | boolean {
    return this.opBoard.receiveAttack(x, y);
  }
}

export class Computer extends Player {
  constructor(op: GameBoard, own: GameBoard = new GameBoard()) {
    super(op, own);
  }

  override attack() {
    let x, y;
    let counter = 0;
    let validAttack = false;

    while (!validAttack && counter < 100) {
      counter++;
      x = this.coordGen();
      y = this.coordGen();

      validAttack = super.attack(x, y) as boolean;
    }
    if (counter >= 100) throw new Error("board might be full");

    return [x, y].toString();
  }

  private coordGen(): number {
    let num = Math.floor(Math.random() * 10);

    return num;
  }
}

// there will be a driver that calls Comp.attack
