import { Grid } from "../utils/Grid";
import { read } from "../utils";

// read from file
const data = read(10, "input");

const tmap = new Grid(data, (cell) => {
  const num = Number(cell);
  return Number.isNaN(num) ? "." : num;
});

// define trailheads (0) and all tops (9) where to go
const sources: [number, number][] = [];
const destinations: [number, number][] = [];

tmap.forEach((cell, x, y) => {
  if (cell === 0) sources.push([x, y]);
  if (cell === 9) destinations.push([x, y]);
});

// for each source, try to get ot the destination making sure we always
// go to a cell which is +1
let totalScore = 0;
for (const source of sources) {
  let trailScore = 0;
  for (const destination of destinations) {
    // check if there exists a source -> destination path
    if (hasPathBetween(-1, source, destination)) {
      trailScore++;
    }
  }

  totalScore += trailScore;
}

console.log(totalScore);

function hasPathBetween(
  prevNum: number,
  pos: [number, number],
  dest: [number, number]
) {
  const [x, y] = pos;

  // ensure bounds
  if (!tmap.withinBounds(x, y)) return false;

  // ensure the currNum of pos is +1 of prevNum
  const currNum = tmap.at(x, y);
  if (prevNum + 1 !== currNum) return false;

  // if pos === dest we found a route!
  if (pos[0] === dest[0] && pos[1] === dest[1]) {
    return true;
  }

  tmap.loop(
    "orthogonal",
    x,
    y,
    (newX, newY) => hasPathBetween(currNum, [newX, newY], dest),
    {}
  );

  // no path found
  return false;
}
