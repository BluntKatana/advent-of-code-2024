import { read } from "../utils";
import { Grid, identity } from "../utils/Grid";

const data = read(15, "input");
const lines = data.split("\n");

type Box = { x: { left: number; right: number }; y: number };
type Boundary = { x: number; y: number };
type Robot = { x: number; y: number };

// Parse grid and moves
let gridLines = [];
let lineIndex = 0;
while (lines[lineIndex] !== "" && lineIndex < 100) {
  let line = lines[lineIndex];
  line = line.replaceAll("#", "##");
  line = line.replaceAll("O", "[]");
  line = line.replaceAll(".", "..");
  line = line.replaceAll("@", "@.");

  gridLines.push(line);

  lineIndex++;
}
const moves = lines.splice(lineIndex).join("").split("");

const boxes: Box[] = [];
const boundaries: Boundary[] = [];
let robot: Robot = { x: -1, y: -1 };

const grid = new Grid(gridLines.join("\n"), identity);
let maxX = grid.maxX;
let maxY = grid.maxY;
grid.forEach((c, x, y) => {
  if (c === "#") boundaries.push({ x, y });
  if (c === "@") robot = { x, y };
  if (c === "[") boxes.push({ x: { left: x, right: x + 1 }, y });
});

// console.log("Initial state:");
// console.log(warehouseToString());
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
  // console.log(warehouseToString());
}

let total = boxes.reduce((sum, box) => sum + box.y * 100 + box.x.left, 0);
console.log(total);

function moveGridInDirection(xDir: number, yDir: number) {
  // check whether there are boxes in the direction and start moving them
  const next = { x: robot.x + xDir, y: robot.y + yDir };

  // do nothing if there exists a wall at the next position
  if (isBoundary(next.x, next.y)) {
    return;
  }

  // if there exists no boundary and no box we just update the position of the robot
  const boxIndexAtNext = findBoxIndex(next.x, next.y);

  if (boxIndexAtNext === -1) {
    // move robot from current plcae to new place
    robot.x += xDir;
    robot.y += yDir;
    return;
  }

  // we want to move all boxes towards the set direction, starting from the last one
  // then move the robot in direction by 1
  if (boxIndexAtNext !== -1) {
    let boxesIndicesToMove = new Set([boxIndexAtNext]);

    let canMove = true;

    // Handle horizontal movement (easier)
    if (xDir !== 0) {
      // check all positions left, and add the boxes. If eventually
      // there is no box, check if there is a free space to move
      for (let x = next.x; x >= 0 && x < maxX; x += xDir) {
        // if we find a boundary we cannot move
        if (isBoundary(x, next.y)) {
          canMove = false;
          break;
        }

        const boxIndex = findBoxIndex(x, next.y);

        // we ended at a normal space
        if (boxIndex === -1) {
          break;
        }

        if (!boxesIndicesToMove.has(boxIndex)) {
          boxesIndicesToMove.add(boxIndex);
        }
      }
    } else {
      // Handle vertical movement (more difficult)
      const boxesToMove: Box[] = [boxes[boxIndexAtNext]];

      // keep looking in front of boxesToMove in the dirY whether
      // there exists a boundary, free position, or another box.
      // whilst there is another box found, we gotta keep looking for a boundary
      // or free position. If all boxes have a free position, we can move, if some
      // box has a boundary in front we cannot move.
      while (true) {
        // check whether there is a boundary in front of at least one box
        const someBoundaryInFrontOfABox = boxesToMove.some((box) => {
          const leftPos = { x: box.x.left, y: box.y + yDir };
          const rightPos = { x: box.x.right, y: box.y + yDir };

          const boundaryLeft = isBoundary(leftPos.x, leftPos.y);
          const boundaryRight = isBoundary(rightPos.x, rightPos.y);

          return boundaryLeft || boundaryRight;
        });

        if (someBoundaryInFrontOfABox) {
          canMove = false;
          break;
        }

        // check whether there is a box in front of at least one other box
        // (which is not already in the boxesIndicesToMove set)
        const newBoxInFrontOfABox = boxes.findIndex((box, index) => {
          if (boxesIndicesToMove.has(index)) return false;

          const leftPos = { x: box.x.left, y: box.y - yDir };
          const rightPos = { x: box.x.right, y: box.y - yDir };

          // check if this box is in front of a box which we are
          // already willing to move.
          const inFrontOfMovingBox = boxesToMove.some((boxMove) => {
            // check whether leftPosition is on box
            if (
              boxMove.y === leftPos.y &&
              (boxMove.x.left === leftPos.x || boxMove.x.right === leftPos.x)
            ) {
              return true;
            }

            // check whether rightPosition is on box
            if (
              boxMove.y === rightPos.y &&
              (boxMove.x.left === rightPos.x || boxMove.x.right === rightPos.x)
            ) {
              return true;
            }

            return false;
          });

          return inFrontOfMovingBox;
        });

        // if are only free position we are ready to move!
        if (newBoxInFrontOfABox === -1) {
          break;
        } else {
          boxesIndicesToMove.add(newBoxInFrontOfABox);
          boxesToMove.push(boxes[newBoxInFrontOfABox]);
        }
      }
    }

    if (canMove) {
      // move all boxes in direction by 1
      boxesIndicesToMove.forEach((boxIndex) => {
        boxes[boxIndex].x.left += xDir;
        boxes[boxIndex].x.right += xDir;
        boxes[boxIndex].y += yDir;
      });

      // move robot
      robot.x += xDir;
      robot.y += yDir;
    }
  }
}

function warehouseToString() {
  let showIndex = false;
  const grid = Array.from(new Array(maxY), () => new Array(maxX));
  for (let x = 0; x < maxX; x++) {
    for (let y = 0; y < maxY; y++) {
      const boxIndexAtPosition = boxes.findIndex(
        (b) => (b.x.left === x || b.x.right === x) && b.y === y
      );
      if (boundaries.some((b) => b.x === x && b.y === y)) {
        grid[y][x] = "#";
      } else if (
        boxIndexAtPosition !== -1 &&
        boxes[boxIndexAtPosition].x.left === x
      ) {
        grid[y][x] = showIndex ? boxIndexAtPosition : "[";
      } else if (
        boxIndexAtPosition !== -1 &&
        boxes[boxIndexAtPosition].x.right === x
      ) {
        grid[y][x] = showIndex ? boxIndexAtPosition : "]";
      } else if (robot.x === x && robot.y === y) {
        grid[y][x] = "@";
      } else {
        grid[y][x] = ".";
      }
    }
  }

  return grid.map((row) => row.join("")).join("\n");
}

function isBoundary(x: number, y: number) {
  return boundaries.some((b) => b.x === x && b.y === y);
}

function findBoxIndex(x: number, y: number) {
  return boxes.findIndex(
    (box) => (box.x.right === x || box.x.left === x) && box.y === y
  );
}
