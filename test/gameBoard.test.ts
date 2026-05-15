import { describe, test, expect, beforeEach } from "vitest";
import { GameBoard } from "../src/lib/GameBoard";
type Coord = [number, number];

describe("GameBoard class", () => {
  let newGame: GameBoard;
  beforeEach(() => {
    newGame = new GameBoard();
    newGame.placeShip();
  });

  describe("placeShip side-effects", () => {
    test("should check if occupied coordinate have 5 entries", () => {
      expect(newGame.occupied.length === 5).toBe(true);
    });

    test("should check if no coordinate exist more than once", () => {
      let flatOccupiedCoord = newGame.occupied
        .flat()
        .map((val) => `${val[0]}, ${val[1]}`);
      let setOfOccupiedCoord = new Set(flatOccupiedCoord);
      expect(flatOccupiedCoord.length === setOfOccupiedCoord.size).toBe(true);
    });

    test("should check if non of the vehicles have an empty coordinate", () => {
      let checkVehicleLen = () => {
        for (const [_vehicle, data] of Object.entries(newGame.vehicles)) {
          if (data.coordinate.length <= 0) return false;
        }
        return true;
      };
      expect(checkVehicleLen()).toBe(true);
    });
  });

  describe("receiveAttack side-effects", () => {
    test("should check if missed attack is being filled", () => {
      let quickRandomNum = () => Math.floor(Math.random() * 10);
      let attack: Coord[] = Array.from({ length: 17 }).map(() => [
        quickRandomNum(),
        quickRandomNum(),
      ]);
      attack.forEach(([x, y]) => newGame.receiveAttack(x, y));

      expect(newGame.missedAttack.length > 0).toBe(true);
    });

    test("should check if all ship have been sunk", () => {
      let coord = newGame.occupied.flat();
      coord.forEach(([x, y]) => newGame.receiveAttack(x, y));

      expect(newGame.allSunk()).toBe(true);
    });
  });
});
