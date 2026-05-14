import { describe, test, expect } from "vitest";
import { GameBoard } from "../src/lib/GameBoard";

describe("GameBoard class", () => {
  let newGame = new GameBoard();

  describe("placeShip side-effects", () => {
    newGame.placeShip();

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
});
