# TOP Projects (TypeScript)

This repository contains multiple TypeScript projects built as part of The Odin Project curriculum. Each project focuses on a different core computer science concept and implementation style.

---

## 1. Knight Traversal Project

This project demonstrates graph traversal using a breadth-first search (BFS) approach to solve the shortest path problem for a knight on a chessboard.

### Key Concepts

- Breadth-first search (BFS)
- Graph traversal
- Queue-based pathfinding
- Move generation for chess knight rules

### Setup

#### Prerequisites

- Node.js v18+

#### Installation

```bash
npm install
````

### Scripts

| Script     | Command              | Description                           |
| ---------- | -------------------- | ------------------------------------- |
| Dev        | `npm run dev`        | Run and watch `src/index.ts` with tsx |
| Build      | `npm run build`      | Compile TypeScript to `dist/`         |
| Start      | `npm start`          | Run compiled output with Node         |
| Test       | `npm test`           | Run tests with Vitest                 |
| Test watch | `npm run test:watch` | Run tests in watch mode               |
| Lint       | `npm run lint`       | Lint `src/` with ESLint               |
| Lint fix   | `npm run lint:fix`   | Auto-fix lint issues                  |
| Format     | `npm run format`     | Format `src/` with Prettier           |

---

## 2. Battleship Game Board (TypeScript)

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

* Prevent repeated attacks on same coordinate
* Add CLI or UI interface
* Add AI opponent
* Improve separation between board and ship state
* Add undo/redo system

---

## Built as part of The Odin Project curriculum to explore:

* TypeScript data modeling
* State synchronization
* Collision detection systems
* Test-driven development with Vitest
