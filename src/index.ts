function gridNeighbors(arr: [number, number]) {
  //I want to perform  ±1, ±2 and ±2, ±1. one every value in the  array
  let neighbors: [number, number][] = [
    [arr[0] - 1, arr[1] - 2],
    [arr[0] + 1, arr[1] + 2],
    [arr[0] - 2, arr[1] - 1],
    [arr[0] + 2, arr[1] + 1],
    [arr[0] - 1, arr[1] + 2],
    [arr[0] + 1, arr[1] - 2],
    [arr[0] - 2, arr[1] + 1],
    [arr[0] + 2, arr[1] - 1],
  ];

  return neighbors.filter((value) => {
    if (value[0] >= 0 && value[1] >= 0 && value[0] < 8 && value[1] < 8)
      return true;
    return false;
  });
}

export function knightMoves(
  start: [number, number],
  end: [number, number],
): [number, number][] {
  let queue: [number, number][][] = [];
  let tracker: [number, number][] = [];
  let result: [number, number][] = [];

  queue.push([start]);

  while (queue.length > 0) {
    let current = queue.shift();
    if (current === undefined) break;

    if (JSON.stringify(current[current.length - 1]) === JSON.stringify(end)) {
      result = [...current];
      break;
    }

    let currentLastEl = current[current.length - 1];
    if (currentLastEl === undefined) break;

    if (
      !tracker.some(
        (el) => JSON.stringify(el) === JSON.stringify(currentLastEl),
      )
    )
      gridNeighbors(currentLastEl).forEach((val) => {
        queue.push([...current, val]);
      });
    tracker.push(currentLastEl);
  }
  console.log(`> knightMoves([${start}],[${end}])\n`);
  console.log(
    `=> You made it in ${result.length - 1} moves!  Here's your path:\n`,
  );
  result.forEach((val) => console.log(val));
  return result;
}

knightMoves([0, 0], [0, 1]);
