import { read } from "../utils";
import { Grid, identity } from "../utils/Grid";

const data = read(15, "input");
const lines = data.split("\n");

// Parse grid and moves
let gridLines = [];
let lineIndex = 0;
while (lines[lineIndex] !== "" && lineIndex < 100) {
  const line = lines[lineIndex];
  gridLines.push(line);

  lineIndex++;
}
const grid = new Grid(gridLines.join("\n"), identity);
const moves = lines.splice(lineIndex).join("").split("");

// find robot position
let robot = { x: 0, y: 0 };
grid.forEach((c, x, y) => {
  if (c === "@") robot = { x, y };
});

while (moves.length > 0) {
  const move = moves.splice(0, 1)[0];

  switch (move) {
    case "^":
      moveGridInDirection(0, -1);
      break;
    case ">":
      moveGridInDirection(1, 0);
      break;
    case "<":
      moveGridInDirection(-1, 0);
      break;
    case "v":
      moveGridInDirection(0, 1);
      break;
    default:
      throw Error("incorrect move in sequence");
  }

  // console.log();
  // console.log("After move", move, ":");
  // grid.print();
}

let total = 0;
grid.forEach((c, x, y) => {
  if (c === "O") total += y * 100 + x;
});
console.log(total);

function moveGridInDirection(xDir: number, yDir: number) {
  // check whether there are boxes in the direction and start moving them
  const posNextToRobot = grid.at(robot.x + xDir, robot.y + yDir);

  if (posNextToRobot === "#") return; // < do nothing if there is a wall
  if (posNextToRobot === ".") {
    // move robot from current plcae to new place
    moveFromTo(robot.x, robot.y, xDir, yDir, "@");
    robot.x += xDir;
    robot.y += yDir;
  }
  if (posNextToRobot === "O") {
    // we want to move all boxes towards the set direction, starting from the last one
    // then move the robot in direction by 1
    const boxesToMove = [{ x: robot.x + xDir, y: robot.y + yDir }];
    let canMove = true;
    const dir = { x: robot.x + xDir * 2, y: robot.y + yDir * 2 };
    while (grid.withinBounds(dir.x, dir.y)) {
      const potential = grid.at(dir.x, dir.y);
      if (potential === "#") {
        canMove = false;
        break;
      } else if (potential === ".") {
        break;
      } else if (potential === "O") {
        boxesToMove.push({ x: dir.x, y: dir.y });
        dir.x += xDir;
        dir.y += yDir;
      }
    }

    if (canMove) {
      // move all boxes in direcition by 1 starting from the last one
      for (let i = boxesToMove.length - 1; i >= 0; i--) {
        const box = boxesToMove[i];
        moveFromTo(box.x, box.y, xDir, yDir, "O");
      }

      // move robot
      moveFromTo(robot.x, robot.y, xDir, yDir, "@");
      robot.x += xDir;
      robot.y += yDir;
    }
  }
}

function moveFromTo(
  x: number,
  y: number,
  xDir: number,
  yDir: number,
  char: string
) {
  grid.set(x + xDir, y + yDir, char);
  grid.set(x, y, "."); // < default to empty string
}
