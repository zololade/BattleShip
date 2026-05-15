import { Ship } from "./Ship";

export class GameBoard {
  public vehicles = {
    Carrier: new Ship(5),
    Battleship: new Ship(4),
    Destroyer: new Ship(3),
    Submarine: new Ship(3),
    PatrolBoat: new Ship(2),
  };
  public occupied: number[][][] = [];
  public missedAttack: number[][] = [];
  private coordMap = new Map<string, Ship>();

  placeShip() {
    for (const [_vehicle, data] of Object.entries(this.vehicles)) {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      let coordinate = this.coordGen(data.length, [x, y]);
      let filledCord = new Set(
        this.occupied.flat().map((val) => `${val[0]}, ${val[1]}`),
      );
      let valid: boolean = false;

      while (!valid) {
        let isInOccupied = coordinate.some((val) =>
          filledCord.has(`${val[0]}, ${val[1]}`),
        );
        if (!isInOccupied) {
          valid = true;
          break;
        }
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        coordinate = this.coordGen(data.length, [x, y]);
      }

      coordinate.forEach((value) => {
        this.coordMap.set(`${value[0]}, ${value[1]}`, data);
      });
      data.coordinate = coordinate;
      this.occupied.push(coordinate);
    }
  }

  private coordGen(len: number, [x, y]: number[]) {
    if (typeof x === "undefined" || typeof y === "undefined") return [];

    let direction = Math.round(Math.random());
    let signY = y + len > 9 ? -1 : 1;
    let signX = x + len > 9 ? -1 : 1;
    let coordinate = Array.from({ length: len }).map((_val, index) => [
      direction > 0 ? x + signX * index : x,
      direction < 1 ? y + signY * index : y,
    ]);

    return coordinate;
  }

  receiveAttack(x: number, y: number) {
    let currentShip = this.coordMap.has(`${x}, ${y}`)
      ? this.coordMap.get(`${x}, ${y}`)
      : undefined;

    if (typeof currentShip === "undefined") {
      this.missedAttack.push([x, y]);
      return;
    }

    currentShip.hit();
  }

  allSunk() {
    let someNotSunk = false;

    for (let [_vehicle, data] of Object.entries(this.vehicles)) {
      if (!data.isSunk()) {
        someNotSunk = true;
        break;
      }
    }
    return !someNotSunk;
  }
}
