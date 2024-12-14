import { read } from "../utils";
import { mod, sum } from "../utils/math";

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
const SECONDS = 100;
const quadrants = [0, 0, 0, 0];

const middleX = Math.floor(X_TILES / 2);
const middleY = Math.floor(Y_TILES / 2);

for (const robot of robots) {
  robot.x = mod(robot.x + robot.vx * SECONDS, X_TILES);
  robot.y = mod(robot.y + robot.vy * SECONDS, Y_TILES);

  if (robot.x < middleX && robot.y < middleY) {
    quadrants[0] += 1;
  }
  if (robot.x > middleX && robot.y < middleY) {
    quadrants[1] += 1;
  }
  if (robot.x < middleX && robot.y > middleY) {
    quadrants[2] += 1;
  }
  if (robot.x > middleX && robot.y > middleY) {
    quadrants[3] += 1;
  }
}

const safetyFactor = sum(quadrants);
console.log(safetyFactor);
