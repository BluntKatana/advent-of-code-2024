import { read } from "../utils";
import { Direction } from "../utils/Direction";
import type { Pos } from "../utils/Position";

const data = read(18, "input");

const BYTES = 1024;
// const BYTES = 12;

const max = { x: 71, y: 71 }; // < use for input
// const max = { x: 7, y: 7 }; // < use for example

const corrupted = new Map();
data.split("\n").forEach((line, i) => {
  if (i < BYTES) corrupted.set(line, true);
});

function heuristic(pos: Pos, dest: Pos) {
  // manhatten distance
  return Math.abs(pos.x - dest.x) + Math.abs(pos.y - dest.y);
}

function aStar(start: Pos, dest: Pos) {
  const openSet = new Map();
  const gScore = new Map();
  const visited = new Set();

  const enqueue = (pos: Pos, f: number) =>
    openSet.set(`${pos.x},${pos.y}`, { pos, f });

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
      const item = openSet.get(minKey);
      openSet.delete(minKey);
      return item.pos;
    }
    return null;
  };

  const hashPos = ({ x, y }: Pos) => `${x},${y}`;

  // Initialize
  gScore.set(hashPos(start), 0);
  enqueue(start, heuristic(start, dest));

  while (openSet.size > 0) {
    const current = dequeue();
    const { x, y } = current;
    const currentHash = hashPos(current);

    // Check if destination is reached
    if (current.x === dest.x && current.y === dest.y) {
      return gScore.get(currentHash);
    }

    // Mark as visited
    visited.add(currentHash);

    // Explore neighbors
    Direction.loop("orthogonal", (xDir, yDir) => {
      const neighbor = { x: x + xDir, y: y + yDir };
      const neighborHash = hashPos(neighbor);

      // Skip invalid positions
      if (
        visited.has(neighborHash) ||
        neighbor.x < 0 ||
        neighbor.y < 0 ||
        neighbor.x >= max.x ||
        neighbor.y >= max.y ||
        corrupted.has(neighborHash)
      ) {
        return;
      }

      // Calculate tentative gScore
      const tentativeG = gScore.get(currentHash) + 1;

      // If this path is better, update gScore and enqueue neighbor
      if (!gScore.has(neighborHash) || tentativeG < gScore.get(neighborHash)) {
        gScore.set(neighborHash, tentativeG);
        const fScore = tentativeG + heuristic(neighbor, dest);
        enqueue(neighbor, fScore);
      }
    });
  }

  return Infinity; // If destination is unreachable
}

const minimumSteps = aStar({ x: 0, y: 0 }, { x: max.x - 1, y: max.y - 1 });

console.log(minimumSteps);
