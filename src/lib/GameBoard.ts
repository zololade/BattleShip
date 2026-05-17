import { Ship } from "./Ship";

type Coord = [number, number];

export class GameBoard {
  public vehicles = {
    Battleship: new Ship(4),
    Cruiser: new Ship(3),
    Submarine: new Ship(3),
    Destroyer1: new Ship(2),
    Destroyer2: new Ship(2),
    Destroyer3: new Ship(2),
    PatrolBoat1: new Ship(1),
    PatrolBoat2: new Ship(1),
    PatrolBoat3: new Ship(1),
    PatrolBoat4: new Ship(1),
  };
  public missedAttack = new Set<string>();
  public successfulAttack = new Set<string>();
  private coordMap = new Map<string, Ship>();
  public receivedAttacks = new Set<string>();

  private reset() {
    this.missedAttack = new Set<string>();
    this.successfulAttack = new Set<string>();
    this.coordMap = new Map<string, Ship>();
    this.receivedAttacks = new Set<string>();
    for (const [_vehicle, data] of Object.entries(this.vehicles)) {
      data.coordinate = [];
      data.damage = 0;
    }
  }

  placeShip() {
    this.reset();
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
        //closeness check
        let isClose = false;
        outerLoop: for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            if (
              coordinate.some((val) => {
                return filledCord.has(
                  this.coordKey([val[0] + dx, val[1] + dy]),
                );
              })
            ) {
              isClose = true;
              break outerLoop;
            }
          }
        }

        if (!isInOccupied && !isClose) {
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

  private coordGen(len: number, start: [number, number]): [number, number][] {
    const [sx, sy] = start;
    const isHorizontal = Math.random() > 0.5;

    let coordinates: [number, number][] = [];

    if (isHorizontal) {
      const startX = Math.max(0, Math.min(sx, 10 - len));
      for (let i = 0; i < len; i++) {
        coordinates.push([startX + i, sy]);
      }
    } else {
      const startY = Math.max(0, Math.min(sy, 10 - len));
      for (let i = 0; i < len; i++) {
        coordinates.push([sx, startY + i]);
      }
    }
    return coordinates;
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
    let currentShip = this.coordMap.get(coordStr);
    if (typeof currentShip === "undefined") {
      this.missedAttack.add(coordStr);
      return true;
    }
    currentShip.hit();
    this.successfulAttack.add(coordStr);
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
