import { read } from "../utils";

// read from file
const data = read(10, "input");
const tmap = data.split("\n").map((line) =>
  line.split("").map((val) => {
    const num = Number(val);
    return Number.isNaN(num) ? "." : num;
  })
);

const maxX = tmap[0].length;
const maxY = tmap.length;

// define trailheads (0) and all tops (9) where to go
const sources: [number, number][] = [];
const destinations: [number, number][] = [];

for (let x = 0; x < maxX; x++) {
  for (let y = 0; y < maxY; y++) {
    if (tmap[y][x] === 0) {
      sources.push([x, y]);
    } else if (tmap[y][x] === 9) {
      destinations.push([x, y]);
    }
  }
}

// for each source, try to get ot the destination making sure we always
// go to a cell which is +1
let totalScore = 0;
for (const source of sources) {
  let trailScore = 0;
  for (const destination of destinations) {
    const emptyVisited = tmap.map((row) => row.map(() => false));

    // check if there exists a source -> destination path
    if (hasPathBetween(-1, source, emptyVisited, destination)) {
      trailScore++;
    }
  }

  totalScore += trailScore;
}

console.log(totalScore);

function hasPathBetween(
  prevNum: number,
  pos: [number, number],
  visited: boolean[][],
  dest: [number, number]
) {
  const [x, y] = pos;

  // ensure bounds
  if (!isInBounds(pos)) return false;

  // ensure the currNum of pos is +1 of prevNum
  const currNum = tmap[y][x];
  if (prevNum + 1 !== currNum) return false;

  // ensure not visited yet
  if (visited[x][y]) return false;
  visited[x][y] = true;

  // if pos === dest we found a route!
  if (pos[0] === dest[0] && pos[1] === dest[1]) {
    return true;
  }

  // try different paths
  const up = hasPathBetween(currNum, [x, y - 1], visited, dest);
  if (up) return true;

  const left = hasPathBetween(currNum, [x - 1, y], visited, dest);
  if (left) return true;

  const down = hasPathBetween(currNum, [x, y + 1], visited, dest);
  if (down) return true;

  const right = hasPathBetween(currNum, [x + 1, y], visited, dest);
  if (right) return true;

  // no path found
  return false;
}

function isInBounds(position: number[]) {
  return (
    0 <= position[0] &&
    position[0] < maxX &&
    0 <= position[1] &&
    position[1] < maxY
  );
}

function printMap() {
  console.log(tmap.map((row) => row.join("")).join("\n"));
}
