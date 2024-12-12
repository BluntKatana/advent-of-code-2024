import { read } from "../utils";
import { Direction } from "../utils/Direction";
import { Grid } from "../utils/Grid";

const data = read(12, "input");

const gardens = new Grid(data, (val) => val);
const visited = new Grid(data, () => false);

let totalCost = 0;

gardens.forEach((garden, x, y) => {
  if (visited.at(x, y)) {
    return;
  }

  const { area, corners } = floodfill(garden, x, y);
  totalCost += area * corners;
});

console.log(totalCost);

function floodfill(regionToCheck: string, initialX: number, initialY: number) {
  const queue = [{ x: initialX, y: initialY }];
  const fillVisisted = new Grid(data, () => false);

  let area = 0;
  let corners = 0;

  while (queue.length > 0) {
    const { x, y } = queue.pop()!;
    if (!gardens.withinBounds(x, y) || fillVisisted.at(x, y)) {
      continue;
    }

    const region = gardens.at(x, y);

    // add x,y to perimeter of region if not in the same region,
    // and continue to next position
    if (region === regionToCheck) {
      visited.set(x, y, true);
      fillVisisted.set(x, y, true);

      // add area
      area += 1;

      // add corners
      // - outer corners:
      // XX => A is an outer corners as up and right
      // AX    it contains other regions
      // ^ do this for all diagonal 2x2 areas for this cell
      // - inner corners:
      // AX => A (bottom-left) is an inner corner as it
      // AA    has same region neighbours, and diagonally it a different region than region
      // ^ do this for all directions
      Direction.loop("diagonal", (xDir, yDir) => {
        const adjRegion1 = gardens.at(x + xDir, y, true);
        const adjRegion2 = gardens.at(x, y + yDir, true);

        // check if outer corner
        if (adjRegion1 !== region && adjRegion2 !== region) {
          corners += 1;
        }

        // check if inner corner
        const diagonalRegion = gardens.at(x + xDir, y + yDir, true);
        if (
          adjRegion1 === region &&
          adjRegion2 === region &&
          diagonalRegion !== region
        ) {
          corners += 1;
        }
      });

      // Add all directions to floodfill
      gardens.loop(
        "orthogonal",
        x,
        y,
        (newX, newY) => queue.push({ x: newX, y: newY }),
        { inBounds: false }
      );
    }
  }

  return { area, corners };
}
