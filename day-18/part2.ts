import { read } from "../utils";
import { Direction } from "../utils/Direction";
import type { Pos } from "../utils/Position";

const data = read(18, "input");

const BYTES = 1024;
// const BYTES = 12;

const max = { x: 71, y: 71 }; // < use for input
// const max = { x: 7, y: 7 }; // < use for example

const corruptedBytes = data.split("\n");

for (let bytes = BYTES; bytes < corruptedBytes.length; bytes++) {
  const corrupted = new Map();
  data.split("\n").forEach((line, i) => {
    if (i < bytes) corrupted.set(line, true);
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
        const neigh = { x: x + xDir, y: y + yDir };
        const neighHash = hashPos(neigh);

        // ensure not visited
        if (visited.has(neighHash)) return;

        // ensure not corrupted
        if (corrupted.has(neighHash)) return;

        // ensure within bounds
        if (
          neigh.x < 0 ||
          neigh.y < 0 ||
          neigh.x >= max.x ||
          neigh.y >= max.y
        ) {
          return;
        }

        // Calculate tentative gScore
        const tentativeG = gScore.get(currentHash) + 1;

        // If this path is better, update gScore and enqueue neighbor
        if (!gScore.has(neighHash) || tentativeG < gScore.get(neighHash)) {
          gScore.set(neighHash, tentativeG);
          const fScore = tentativeG + heuristic(neigh, dest);
          enqueue(neigh, fScore);
        }
      });
    }

    return Infinity; // If destination is unreachable
  }

  const minimumSteps = aStar({ x: 0, y: 0 }, { x: max.x - 1, y: max.y - 1 });

  if (minimumSteps === Infinity) {
    console.log("bytes", minimumSteps, bytes - 1, corruptedBytes[bytes - 1]);
    break;
  }
}
