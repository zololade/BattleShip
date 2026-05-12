import { describe, test, expect } from "vitest";
import { GameBoard } from "../src/lib/GameBoard";

describe("GameBoard class", () => {
  test("should run", () => {
    let newGame = new GameBoard();
    newGame.placeShip();

    expect(true).toBe(true);
  });
});
