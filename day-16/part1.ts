import { read } from "../utils";
import { Grid, identity } from "../utils/Grid";
import type { Pos } from "../utils/Position";

// parse input
const data = read(16, "input");
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

function aStar(start: Pos, dest: Pos) {
  const openSet = new Map<string, { dir: Pos; pos: Pos; f: number }>();
  const gScore = new Map();
  const visited = new Set();

  const enqueue = (pos: Pos, dir: Pos, f: number) =>
    openSet.set(`${pos.x},${pos.y}/${dir.x},${dir.y}`, { pos, dir, f });

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

  const hashPos = ({ x, y }: Pos, dir: Pos) => `${x},${y}/${dir.x},${dir.y}`;

  // inti looking east (right)
  gScore.set(hashPos(start, { x: 1, y: 0 }), 0);
  enqueue(start, { x: 1, y: 0 }, heuristic(start, dest));

  while (openSet.size > 0) {
    const item = dequeue()!;
    const { pos: current, dir } = item;
    const currentHash = hashPos(current, dir);

    // check if destination is reached
    if (current.x === dest.x && current.y === dest.y) {
      return gScore.get(currentHash);
    }

    // mark as visited
    visited.add(currentHash);

    // explore possible options
    // - move forward, or
    // - rotate 90 left or right
    for (const option of ["forward", "left", "right"] as const) {
      if (option === "forward") {
        const newPos = { x: current.x + dir.x, y: current.y + dir.y };
        const newDir = dir;
        const newHash = hashPos(newPos, newDir);

        // valid new option
        if (visited.has(newHash)) continue;
        if (!grid.withinBounds(newPos.x, newPos.y)) continue;
        if (grid.at(newPos.x, newPos.y) === "#") continue;

        // add 1 for moving forward
        const tentativeG = gScore.get(currentHash) + 1;

        // if this path is better, update gScore and enqueue neighbor
        if (!gScore.has(newHash) || tentativeG < gScore.get(newHash)) {
          gScore.set(newHash, tentativeG);
          const fScore = tentativeG + heuristic(newPos, newDir);
          enqueue(newPos, newDir, fScore);
        }
      } else {
        const newPos = current;
        const newDir =
          option === "left" ? { x: -dir.y, y: dir.x } : { x: dir.y, y: -dir.x };

        const newHash = hashPos(newPos, newDir);

        // valid new otion
        if (visited.has(newHash)) continue;
        if (!grid.withinBounds(newPos.x, newPos.y)) continue;
        if (grid.at(newPos.x, newPos.y) === "#") continue;

        // add 1000 for rotating
        const tentativeG = gScore.get(currentHash) + 1000;

        // if this path is better, update gScore and enqueue neighbor
        if (!gScore.has(newHash) || tentativeG < gScore.get(newHash)) {
          gScore.set(newHash, tentativeG);
          const fScore = tentativeG + heuristic(newPos, newDir);
          enqueue(newPos, newDir, fScore);
        }
      }
    }
  }

  // not reachable
  return Infinity;
}

const minimumSteps = aStar(start, dest);

console.log(minimumSteps);
