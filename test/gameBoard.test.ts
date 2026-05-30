import { describe, test, expect, beforeEach } from "vitest";
import { GameBoard } from "../src/lib/GameBoard";
import { Ship } from "../src/lib/Ship";
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
    test("should check if occupied coordinate have 10 entries", () => {
      expect(newGame.occupied.length === 10).toBe(true);
    });

    test("should check if no coordinate exist more than once", () => {
      let flatOccupiedCoord = newGame.occupied
        .flat()
        .map((val) => `${val[0]},${val[1]}`);
      let setOfOccupiedCoord = new Set(flatOccupiedCoord);
      expect(flatOccupiedCoord.length === setOfOccupiedCoord.size).toBe(true);
    });
  });

  describe("modifyCoord side-effects", () => {
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

      expect(newGame.missedAttack.size > 0).toBe(true);
    });

    test("should check if all ship have been sunk", () => {
      let coord = newGame.occupied.flat();
      coord.forEach(([x, y]) => newGame.receiveAttack(x, y));

      expect(newGame.allSunk()).toBe(true);
    });

    test("should check if same coord is attack twice", () => {
      newGame.receiveAttack(1, 2);
      let canBeAttack = newGame.receiveAttack(1, 2);

      expect(canBeAttack).toBe(false);
    });
  });

  describe("one point shift", () => {
    test("should allow shifting a ship by 1 step", () => {
      const game = new GameBoard();

      // 1. CLEAR ALL RANDOM STATE
      game.vehicles = {
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

      game["coordMap"] = new Map();

      // 2. PLACE ONLY ONE SHIP MANUALLY (safe space)
      const ship = game.vehicles.Battleship;

      const original = [
        [2, 2],
        [3, 2],
        [4, 2],
        [5, 2],
        [6, 2],
      ] as [number, number][];

      original.forEach((value) => {
        game["coordMap"].set(game["coordKey"](value), ship);
      });

      // 3. SHIFT IT (deterministic)
      const shifted = original.map(([x, y]) => [x, y + 1] as [number, number]);
      const shiftedAsStr = shifted.map((val) => val.toString());

      const success = game.modifyCoord(original[0]!, shifted);

      // 4. ASSERT
      expect(success).toBe(true);
      expect(game.getShipCoord(ship)).toEqual(new Set(shiftedAsStr));

      // 5. VERIFY MAP IS CONSISTENT
      for (const [x, y] of shifted) {
        expect(game["coordMap"].get(`${x},${y}`)).toBe(ship);
      }
    });
  });
});
