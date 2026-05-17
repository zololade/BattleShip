import { describe, test, expect, beforeEach } from "vitest";
import { GameBoard } from "../src/lib/GameBoard";
import { Computer, Player } from "../src/lib/Player";

describe("Players", () => {
  let testBoard: GameBoard;
  beforeEach(() => {
    testBoard = new GameBoard();
  });

  describe("Computer player", () => {
    test("expect Computer to attack", () => {
      let comp = new Computer(testBoard);
      comp.attack();
      expect(testBoard.missedAttack.size > 0).toBe(true);
    });
  });

  describe("Human player", () => {
    test("expect Computer to attack", () => {
      let player = new Player(testBoard);
      player.attack(2, 8);
      expect(testBoard.missedAttack.has([2, 8].toString())).toBe(true);
    });
  });
});
