## Battleship Game Board (TypeScript)

A Battleship-style game engine built in TypeScript. It handles ship placement, collision detection, attacks, and game state tracking on a 10x10 grid.

### Features

* Randomized ship placement on a 10x10 grid
* Direction-aware ship generation (horizontal / vertical)
* Collision detection between ships
* Attack system with hit and miss tracking
* Ship movement support with safe coordinate updates
* Win condition check (all ships sunk)
* Full test coverage using Vitest

### Core Concepts

#### GameBoard

Manages:

* Ship placement
* Coordinate tracking via a `Map`
* Attack resolution
* Game state (hits, misses, occupied cells)

#### Ship

Each ship:

* Has a fixed length
* Tracks damage from hits
* Determines whether it is sunk
* Stores coordinates for board synchronization

#### Coordinate System

All positions are `[x, y]` tuples on a 10x10 grid.
Internally indexed as `"x,y"` strings for fast lookup.

---

### Key Design Decisions

* `Map<string, Ship>` used for O(1) coordinate lookup
* Shared references between `occupied` arrays and ship coordinates for synchronization
* Controlled mutation used to maintain state consistency
* Collision validation excludes self-coordinates during movement

---

### Testing

Tests use [Vitest](https://vitest.dev/).

Run tests:

```bash
npm test
```

Coverage includes:

* Ship placement correctness
* Collision prevention
* Attack handling (hits & misses)
* Movement validation
* Win condition detection

---

### Project Structure

```
src/
  lib/
    GameBoard.ts
    Ship.ts

test/
  gameBoard.test.ts
  ship.test.ts
  player.test.ts
```

---

### Known Behavior

* Ship placement is randomized on each run
* Ships cannot overlap but can move within their own occupied space
* Repeated attacks on the same coordinate are not currently blocked

---

### Future Improvements

* Make AI opponent smarter
* Add Drag and drop
* Improve UI

---

## Built as part of The Odin Project curriculum to explore:

* TypeScript data modeling
* State synchronization
* Collision detection systems
* Test-driven development with Vitest
