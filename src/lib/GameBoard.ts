import { EventBus } from "./EventBus";
import { Ship } from "./Ship";

export type Coord = [number, number];

export type PayLoad = {
  coordinate: number[];
  missed: boolean;
  hit: boolean;
  allSunk: null | boolean;
};

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
  private eventBus: EventBus | undefined;
  private boardId: string = "";

  constructor(boardId?: string, eventBus?: EventBus) {
    if (eventBus) this.eventBus = eventBus;
    if (boardId) this.boardId = boardId;
  }

  private reset() {
    this.missedAttack = new Set<string>();
    this.successfulAttack = new Set<string>();
    this.coordMap = new Map<string, Ship>();
    this.receivedAttacks = new Set<string>();
    for (const [_vehicle, data] of Object.entries(this.vehicles)) {
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
    }

    if (this.eventBus) {
      this.eventBus.publish("Refresh player board", this.occupied);
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
    let oldCoords = this.getShipCoord(currentShip);
    if (!oldCoords) return false;

    let coordValidity = coordArr.some((val) => {
      let key = this.coordKey(val);
      return this.coordMap.has(key) && !oldCoords.has(key);
    });
    if (coordValidity) return false;

    // remove old coords first
    oldCoords.forEach((val) => {
      this.coordMap.delete(val);
    });

    // add new coords
    coordArr.forEach((val) => {
      this.coordMap.set(this.coordKey(val), currentShip);
    });
    return true;
  }

  receiveAttack(x: number, y: number) {
    const payLoad: PayLoad = {
      coordinate: [x, y],
      missed: false,
      hit: false,
      allSunk: null,
    };

    let coordStr = this.coordKey([x, y]);
    if (this.receivedAttacks.has(coordStr)) return false;

    this.receivedAttacks.add(coordStr);
    let currentShip = this.coordMap.get(coordStr);
    if (typeof currentShip === "undefined") {
      this.missedAttack.add(coordStr);
      payLoad.missed = true;
    } else {
      currentShip.hit();
      this.successfulAttack.add(coordStr);
      payLoad.allSunk = this.allSunk();
      payLoad.hit = true;
    }

    if (this.eventBus) {
      this.eventBus.publish(`${this.boardId}:attack`, payLoad);
    }
    return true;
  }

  allSunk() {
    return Object.values(this.vehicles).every((ship) => ship.isSunk);
  }

  private coordKey([x, y]: Coord) {
    return `${x},${y}`;
  }

  get occupied(): Coord[][] {
    return [...this.shipLocal().values()];
  }

  private shipLocal() {
    const groups = new Map<Ship, Coord[]>();

    for (const [key, ship] of this.coordMap) {
      const [x, y] = key.split(",").map(Number);

      if (!groups.has(ship)) groups.set(ship, []);
      let shipRef = groups.get(ship);
      if (shipRef && x !== undefined && y !== undefined) shipRef.push([x, y]);
    }

    return groups;
  }

  getShipCoord(ship: Ship): Set<string> | undefined {
    const shipLocation = this.shipLocal().get(ship);
    if (!shipLocation) return undefined;
    let coords = new Set(shipLocation.map((val) => this.coordKey(val)));
    return coords;
  }
}
