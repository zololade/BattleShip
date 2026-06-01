import { GameBoard } from "./GameBoard";
import type { Ship } from "./Ship";

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
  private cellTracker: Map<string, number> = new Map();

  constructor(op: GameBoard, own: GameBoard = new GameBoard()) {
    super(op, own);
  }

  override attack(): string | boolean {
    let result = this.aiLogic();
    if (result) {
      let [x, y] = result[0].split(",").map(Number);
      if (x !== undefined && y !== undefined) {
        super.attack(x, y);
        return `${x},${y}`;
      }
    }
    return false;
  }

  private aiLogic() {
    let shipsLenRec: number[] = [];
    let sunkenShip: Ship[] = [];
    let neigbohrCells = new Set<string>();
    // create a map of every coordinate
    let cells = Array.from({ length: 100 }).map(
      (_val, index): [string, number] => [this.coordStr(index), 0],
    );
    this.cellTracker = new Map(cells);

    //register all opponets ships length
    for (let [_vehicle, ship] of Object.entries(this.opBoard.vehicles)) {
      if (!ship.isSunk) shipsLenRec.push(ship.length);
      if (ship.isSunk) sunkenShip.push(ship);
    }

    for (let ship of sunkenShip) {
      let currShipCoord = this.opBoard.getShipCoord(ship);
      if (currShipCoord) {
        let currShipArr = Array.from(currShipCoord).map((val) =>
          val.split(",").map(Number),
        );

        currShipArr.forEach(([x, y]) => {
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (dx === 0 && dy === 0) continue;
              if (x !== undefined && y !== undefined) {
                if (x + dx > 9 || y + dy > 9 || x + dx < 0 || y + dy < 0)
                  continue;
                neigbohrCells.add(`${x + dx},${y + dy}`);
              }
            }
          }
        });
      }
    }
    //fill horixontal
    for (let size of shipsLenRec) {
      this.probabilityLogic(true, size);
      this.probabilityLogic(false, size);
    }
    neigbohrCells.forEach((val) => {
      this.cellTracker.set(val, 0);
    });
    const unAttackedCells = [...this.cellTracker.entries()].filter(
      ([cell]) => !this.opBoard.receivedAttacks.has(cell),
    );
    const highestEntry = unAttackedCells.reduce((max, current) =>
      current[1] > max[1] ? current : max,
    );
    const maxCellsArr = unAttackedCells.filter(([_cell, value]) => {
      return value === highestEntry[1];
    });
    const randomNumber = Math.floor(Math.random() * maxCellsArr.length);
    return maxCellsArr[randomNumber];
  }

  private probabilityLogic(isHorizontal: boolean, size: number) {
    for (let outer = 0; outer <= 9; outer++) {
      for (let inner = 0; inner <= 10 - size; inner++) {
        //generat coordinates
        let cells = Array.from({ length: size }).map((_val, index) =>
          isHorizontal
            ? `${inner + index},${outer}`
            : `${outer},${inner + index}`,
        );

        let notValid = cells.some((cell) =>
          this.opBoard.missedAttack.has(cell),
        );
        if (notValid) continue;

        const boost = cells.filter((cell) =>
          this.opBoard.successfulAttack.has(cell),
        ).length;

        cells.forEach((cell) => {
          let cellVal = this.cellTracker.get(cell);
          if (cellVal !== undefined)
            this.cellTracker.set(cell, cellVal + 1 + boost * 3);
        });
      }
    }
  }

  coordStr(index: number) {
    return `${index % 10},${Math.floor(index / 10)}`;
  }
}
