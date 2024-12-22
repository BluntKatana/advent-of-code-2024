import { read } from "../utils";
import { mod, multiply } from "../utils/math";

const data = read(14, "input");
const lines = data.split("\n");

type Robot = { x: number; y: number; vx: number; vy: number };

const robots: Robot[] = lines.map((line) => {
  const [pos, vel] = line.split(" ");
  const position = pos.split("=")[1].split(",");
  const x = Number(position[0]);
  const y = Number(position[1]);

  const velocity = vel.split("=")[1].split(",");
  const vx = Number(velocity[0]);
  const vy = Number(velocity[1]);

  return { x, y, vx, vy };
});

// constants from puzzle
const X_TILES = 101; // 11 = example, 101 = input;
const Y_TILES = 103; // 7 = example, 103 = input;

// calculate seconds and after split into quadrants
const SECONDS = 15_000;
const quadrants = [0, 0, 0, 0];

for (let second = 0; second < SECONDS; second++) {
  // check if has potential for christamas tree:
  // - having more than 4 digits in a single row
  if (hasPotential()) {
    // manual check through terminal if we can see
    // a christmass tree
    console.log("\n");
    console.log(second);
    console.log(robotsToString());
  }

  for (const robot of robots) {
    robot.x = mod(robot.x + robot.vx, X_TILES);
    robot.y = mod(robot.y + robot.vy, Y_TILES);
  }
}

function hasPotential() {
  const str = robotsToString().split("\n");
  return str.some((row) => row.includes("1".repeat(5)));
}

function robotsToString() {
  const grid = Array.from(new Array(Y_TILES), () => new Array(X_TILES));

  for (let x = 0; x < X_TILES; x++) {
    for (let y = 0; y < Y_TILES; y++) {
      grid[y][x] = robots.reduce((acc, robot) => {
        return robot.x === x && robot.y === y ? acc + 1 : acc;
      }, 0);
    }
  }

  return grid
    .map((row) => row.map((c) => (c === 0 ? "." : c)).join(""))
    .join("\n");
}

const safetyFactor = multiply(quadrants);
console.log(safetyFactor);
