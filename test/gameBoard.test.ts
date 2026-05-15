import { describe, test, expect, beforeEach } from "vitest";
import { GameBoard } from "../src/lib/GameBoard";
type Coord = [number, number];

describe("GameBoard", () => {
  let newGame: GameBoard;
  let testArr: Coord[] = [
    [7, 2],
    [7, 3],
    [7, 4],
    [7, 5],
    [7, 6],
  ];
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

    test("should check if none of the vehicles have an empty coordinate", () => {
      let checkVehicleLen = () => {
        for (const [_vehicle, data] of Object.entries(newGame.vehicles)) {
          if (data.coordinate.length <= 0) return false;
        }
        return true;
      };
      expect(checkVehicleLen()).toBe(true);
    });
  });

  describe("modifyCoord side-effects", () => {
    test("should check if entries were updated", () => {
      let coord = newGame.occupied.flat();
      let successState = newGame.modifyCoord(coord[0]!, testArr);
      if (successState) {
        expect(newGame.vehicles.Carrier.coordinate).toEqual(testArr);
      } else {
        expect(successState).toBe(false);
      }
    });

    test("should check if occupied was updated", () => {
      let coord = newGame.occupied.flat();
      let successState = newGame.modifyCoord(coord[0]!, testArr);
      if (successState) {
        expect(newGame.occupied).toContainEqual(testArr);
      } else {
        expect(successState).toBe(false);
      }
    });
  });

  describe("receiveAttack side-effects", () => {
    test("should check if missed attack is being recorded", () => {
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
