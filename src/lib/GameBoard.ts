import { Ship } from "./Ship";

type Coord = [number, number];

export class GameBoard {
  public vehicles = {
    Carrier: new Ship(5),
    Battleship: new Ship(4),
    Destroyer: new Ship(3),
    Submarine: new Ship(3),
    PatrolBoat: new Ship(2),
  };
  public missedAttack: Coord[] = [];
  private coordMap = new Map<string, Ship>();
  private receivedAttacks = new Set<string>();

  placeShip() {
    for (const [_vehicle, data] of Object.entries(this.vehicles)) {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      let coordinate = this.coordGen(data.length, [x, y]);
      let filledCord = new Set(this.coordMap.keys());
      let valid: boolean = false;
      let attempts = 0;

      while (!valid && attempts < 100) {
        attempts++;
        let isInOccupied = coordinate.some((val) =>
          filledCord.has(this.coordKey(val)),
        );
        if (!isInOccupied) {
          valid = true;
          break;
        }
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        coordinate = this.coordGen(data.length, [x, y]);
      }

      if (!valid) {
        throw new Error(
          `Failed to place ${_vehicle} after 100 attempts. Board layout is too crowded.`,
        );
      }
      coordinate.forEach((value) => {
        this.coordMap.set(this.coordKey(value), data);
      });
      data.coordinate = coordinate;
    }
  }

  private coordGen(len: number, [x, y]: [number, number]): [number, number][] {
    if (typeof x === "undefined" || typeof y === "undefined") return [];
    let direction = Math.round(Math.random());
    let signY = y + len > 9 ? -1 : 1;
    let signX = x + len > 9 ? -1 : 1;
    let coordinate: [number, number][] = Array.from({ length: len }).map(
      (_val, index) => [
        direction > 0 ? x + signX * index : x,
        direction < 1 ? y + signY * index : y,
      ],
    );
    return coordinate;
  }

  modifyCoord([x, y]: Coord, coordArr: Coord[]) {
    //get currentShip
    let currentShip = this.coordMap.get(this.coordKey([x, y]));
    if (!currentShip) return false;
    ///
    let oldCoords = new Set(
      currentShip.coordinate.map((val) => this.coordKey(val)),
    );
    let coordValidity = coordArr.some((val) => {
      let key = this.coordKey(val);
      return this.coordMap.has(key) && !oldCoords.has(key);
    });
    if (coordValidity) return false;
    ///
    let currShipCoord = currentShip.coordinate;
    // remove old coords first
    currShipCoord.forEach((val) => {
      this.coordMap.delete(this.coordKey(val));
    });
    // assign new coords
    currShipCoord.splice(0, currShipCoord.length, ...coordArr);
    // add new coords
    coordArr.forEach((val) => {
      this.coordMap.set(this.coordKey(val), currentShip);
    });
    return true;
  }

  receiveAttack(x: number, y: number) {
    let coordStr = this.coordKey([x, y]);
    if (this.receivedAttacks.has(coordStr)) return false;

    this.receivedAttacks.add(coordStr);
    let currentShip = this.coordMap.get(this.coordKey([x, y]));
    if (typeof currentShip === "undefined") {
      this.missedAttack.push([x, y]);
      return true;
    }
    currentShip.hit();
    return true;
  }

  allSunk() {
    return Object.values(this.vehicles).every((ship) => ship.isSunk);
  }

  private coordKey([x, y]: Coord) {
    return `${x},${y}`;
  }

  get occupied(): Coord[][] {
    const groups = new Map<Ship, Coord[]>();

    for (const [key, ship] of this.coordMap) {
      const [x, y] = key.split(",").map(Number);

      if (!groups.has(ship)) groups.set(ship, []);
      let shipRef = groups.get(ship);
      if (shipRef && x !== undefined && y !== undefined) shipRef.push([x, y]);
    }

    return [...groups.values()];
  }
}
