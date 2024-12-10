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
let sumOfRatings = 0;
for (const source of sources) {
  let trailRating = 0;
  for (const destination of destinations) {
    // check if there exists a source -> destination path
    const paths = countPathsBetween(-1, source, destination, 0);
    trailRating += paths;
  }

  sumOfRatings += trailRating;
}

console.log(sumOfRatings);

function countPathsBetween(
  prevNum: number,
  pos: [number, number],
  dest: [number, number],
  paths: number
): number {
  const [x, y] = pos;

  // ensure bounds
  if (!isInBounds(pos)) return paths;

  // ensure the currNum of pos is +1 of prevNum
  const currNum = tmap[y][x];
  if (prevNum + 1 !== currNum) return paths;

  // if pos === dest we found a route!
  if (pos[0] === dest[0] && pos[1] === dest[1]) {
    return paths + 1;
  }

  // try different paths
  const up = countPathsBetween(currNum, [x, y - 1], dest, paths);
  const left = countPathsBetween(currNum, [x - 1, y], dest, paths);
  const down = countPathsBetween(currNum, [x, y + 1], dest, paths);
  const right = countPathsBetween(currNum, [x + 1, y], dest, paths);

  return up + left + down + right;
}

function isInBounds(position: number[]) {
  return (
    0 <= position[0] &&
    position[0] < maxX &&
    0 <= position[1] &&
    position[1] < maxY
  );
}
