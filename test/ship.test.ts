import { describe, test, expect } from "vitest";
import { Ship } from "../src/lib/Ship";

describe("Ship class", () => {
  test("should return true", () => {
    let testShip = new Ship(3);
    for (let i = 0; i < 3; i++) {
      testShip.hit();
    }
    expect(testShip.isSunk()).toBe(true);
  });
});
