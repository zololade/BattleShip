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

  placeShip() {
    for (const [_vehicle, data] of Object.entries(this.vehicles)) {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      let direction = Math.round(Math.random());
      let signY = y + data.length > 9 ? -1 : 1;
      let signX = x + data.length > 9 ? -1 : 1;

      let coordinate = Array.from({ length: data.length }).map(
        (_val, index) => [
          direction > 0 ? x + signX * index : x,
          direction < 0 ? y + signY * index : y,
        ],
      );

      data.coordinate = coordinate;
      this.occupied.push(coordinate);

      console.log(coordinate);
    }
  }
}
