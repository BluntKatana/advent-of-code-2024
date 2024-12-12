import { read } from "../utils";
import { Grid } from "../utils/Grid";

const data = read(12, "example");

const gardens = new Grid(data, (val) => val);
const visited = new Grid(data, () => false);

let totalCost = 0;

gardens.forEach((garden, x, y) => {
  if (visited.at(x, y)) {
    return;
  }

  const { perimeter, area } = floodfill(garden, x, y);
  totalCost += perimeter * area;
});

console.log(totalCost);

function floodfill(regionToCheck: string, initialX: number, initialY: number) {
  const queue = [{ x: initialX, y: initialY }];

  const fillVisisted = new Grid(data, () => false);

  let perimeter = 0;
  let area = 0;

  while (queue.length > 0) {
    const { x, y } = queue.pop()!;
    if (!gardens.withinBounds(x, y)) {
      perimeter++;
      continue;
    }

    if (fillVisisted.at(x, y)) {
      continue;
    }

    const region = gardens.at(x, y);

    // add x,y to perimeter of region if not in the same region,
    // and continue to next position
    if (region !== regionToCheck) {
      perimeter += 1;
      continue;
    } else {
      visited.set(x, y, true);
      fillVisisted.set(x, y, true);

      area += 1;

      // Add all directions to floodfill
      gardens.forEachDirectionFrom(
        x,
        y,
        { dirType: "orthogonal", checkForBounds: false },
        (newX, newY) => queue.push({ x: newX, y: newY })
      );
    }
  }

  return { perimeter, area };
}
