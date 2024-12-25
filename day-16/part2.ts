import { read } from "../utils";
import { Grid, identity } from "../utils/Grid";
import type { Pos } from "../utils/Position";

// parse input
const data = read(16, "example");
const grid = new Grid(data, identity);
let start = { x: -1, y: -1 };
let dest = { x: -1, y: -1 };
grid.forEach((c, x, y) => {
  if (c === "S") start = { x, y };
  if (c === "E") dest = { x, y };
});

function heuristic(pos: Pos, dest: Pos) {
  // manhatten distance
  return Math.abs(pos.x - dest.x) + Math.abs(pos.y - dest.y);
}

function hashPos({ x, y }: Pos) {
  return `${x},${y}`;
}

function hashPosDir({ x, y }: Pos, dir: Pos) {
  return `${x},${y}/${dir.x},${dir.y}`;
}

function aStar(start: Pos, dest: Pos) {
  const openSet = new Map<string, { dir: Pos; pos: Pos; f: number }>();
  const gScore = new Map();
  const visited = new Set();

  const cameFrom = new Map<string, { dir: Pos; pos: Pos }[]>();

  const enqueue = (pos: Pos, dir: Pos, f: number) =>
    openSet.set(hashPosDir(pos, dir), { pos, dir, f });

  const dequeue = () => {
    let minKey = null;
    let minF = Infinity;

    for (const [key, { pos, f }] of openSet.entries()) {
      if (f < minF) {
        minF = f;
        minKey = key;
      }
    }

    if (minKey !== null) {
      const item = openSet.get(minKey)!;
      openSet.delete(minKey);
      return { pos: item.pos, dir: item.dir };
    }
    return null;
  };

  // inti looking east (right)
  gScore.set(hashPosDir(start, { x: 1, y: 0 }), 0);
  enqueue(start, { x: 1, y: 0 }, heuristic(start, dest));

  while (openSet.size > 0) {
    const item = dequeue()!;
    const { pos: current, dir } = item;
    const currentHash = hashPosDir(current, dir);

    // check if destination is reached
    if (current.x === dest.x && current.y === dest.y) {
      let paths: Pos[] = [];
      let currentPositions = [{ pos: current, dir }];

      while (currentPositions.length > 0) {
        let next: { pos: Pos; dir: Pos }[] = [];

        currentPositions.forEach((currPos) => {
          const from = cameFrom.get(hashPosDir(currPos.pos, currPos.dir));
          if (from !== undefined) {
            from.forEach(({ pos: fromPos, dir: fromDir }) => {
              if (
                currPos.pos.x === fromPos.x &&
                currPos.pos.y === fromPos.y &&
                currPos.dir.x === fromDir.x &&
                currPos.dir.y === fromDir.y
              ) {
              } else {
                next.push({ pos: fromPos, dir: fromDir });
              }
            });
          }
        });

        paths = paths.concat(currentPositions.map(({ pos }) => pos));
        currentPositions = next;
      }

      console.log(paths.length);

      return { paths, score: gScore.get(currentHash) };
    }

    // mark as visited
    // visited.add(currentHash);

    // explore possible options
    // - move forward, or
    // - rotate 90 left or right
    for (const option of ["forward", "left", "right"] as const) {
      let newPos: Pos;
      let newDir: Pos;
      let cost;

      if (option === "forward") {
        newPos = { x: current.x + dir.x, y: current.y + dir.y };
        newDir = dir;
        cost = 1;
      } else if (option === "left") {
        newPos = current;
        newDir = { x: -dir.y, y: dir.x };
        cost = 1000;
      } else {
        newPos = current;
        newDir = { x: dir.y, y: -dir.x };
        cost = 1000;
      }

      const newHash = hashPosDir(newPos, newDir);

      // valid new option
      if (visited.has(newHash)) continue;
      if (!grid.withinBounds(newPos.x, newPos.y)) continue;
      if (grid.at(newPos.x, newPos.y) === "#") continue;

      // add 1 for moving forward
      const tentativeG = gScore.get(currentHash) + cost;

      // if this path is better, update gScore and enqueue neighbor
      if (!gScore.has(newHash) || tentativeG < gScore.get(newHash)) {
        gScore.set(newHash, tentativeG);
        const fScore = tentativeG + heuristic(newPos, dest);
        enqueue(newPos, newDir, fScore);
      }

      if (!cameFrom.has(newHash)) {
        cameFrom.set(newHash, []);
      }
      cameFrom.get(newHash)!.push({ pos: current, dir });
    }
  }

  // not reachable
  return { paths: [], score: Infinity };
}

const minimumSteps = aStar(start, dest);

const uniquePositions = new Set(minimumSteps.paths.map(hashPos));

grid.print((c, x, y) => {
  if (uniquePositions.has(hashPos({ x, y }))) {
    return "O";
  }
  return c;
});

console.log(minimumSteps.score);
