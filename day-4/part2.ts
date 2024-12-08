// read from file
const fs = require("fs");
const data = fs.readFileSync(`${__dirname}/example.txt`, "utf-8") as string;

const xmas = data.split("\n").map((line) => line.split(""));
const maxX = xmas[0].length;
const maxY = xmas.length;

const MAS = ["M", "A", "S"] as const;

// at each position check whether xmas is spelled vertically, horizontally or diagonally
let xmasCounter = 0;

// at each position
for (let x = 0; x < maxX; x++) {
  for (let y = 0; y < maxY; y++) {
    // always want to start checking at X
    if (xmas[y][x] !== "A") {
      continue;
    }

    // ensure all positions are in bounds
    if (
      !isInBounds([x - 1, y - 1]) ||
      !isInBounds([x + 1, y + 1]) ||
      !isInBounds([x + 1, y - 1]) ||
      !isInBounds([x - 1, y + 1])
    ) {
      continue;
    }

    // check top M and bottom S
    if (
      xmas[y + 1][x - 1] === "M" &&
      xmas[y + 1][x + 1] === "M" &&
      xmas[y - 1][x - 1] === "S" &&
      xmas[y - 1][x + 1] === "S"
    ) {
      xmasCounter++;
    }

    // check top S and bottom M
    if (
      xmas[y + 1][x - 1] === "S" &&
      xmas[y + 1][x + 1] === "S" &&
      xmas[y - 1][x - 1] === "M" &&
      xmas[y - 1][x + 1] === "M"
    ) {
      xmasCounter++;
    }

    // check left M and right S
    if (
      xmas[y + 1][x - 1] === "M" &&
      xmas[y + 1][x + 1] === "S" &&
      xmas[y - 1][x - 1] === "M" &&
      xmas[y - 1][x + 1] === "S"
    ) {
      xmasCounter++;
    }

    // check left S and right M
    if (
      xmas[y + 1][x - 1] === "S" &&
      xmas[y + 1][x + 1] === "M" &&
      xmas[y - 1][x - 1] === "S" &&
      xmas[y - 1][x + 1] === "M"
    ) {
      xmasCounter++;
    }
  }
}

console.log(xmasCounter);

function isInBounds(position: number[]) {
  return (
    0 <= position[0] &&
    position[0] < maxX &&
    0 <= position[1] &&
    position[1] < maxY
  );
}
