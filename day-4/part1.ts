// read from file
const fs = require("fs");
const data = fs.readFileSync(`${__dirname}/input.txt`, "utf-8") as string;

const xmas = data.split("\n").map((line) => line.split(""));
const maxX = xmas[0].length;
const maxY = xmas.length;

const MAS = ["M", "A", "S"] as const;

// at each position check whether xmas is spelled vertically, horizontally or diagonally
let xmasCounter = 0;

// printXMAS();

for (let x = 0; x < maxX; x++) {
  for (let y = 0; y < maxY; y++) {
    // always want to start checking at X
    if (xmas[y][x] !== "X") {
      continue;
    }

    const validLeft = x - MAS.length >= 0;
    const validRight = x + MAS.length < maxX;
    const validTop = y - MAS.length >= 0;
    const validBottom = y + MAS.length < maxY;

    // horizontally
    // - check for left
    if (validLeft) {
      if (MAS.every((char, index) => xmas[y][x - index - 1] === char)) {
        xmasCounter++;
      }
    }
    // - check for right
    if (validRight) {
      if (MAS.every((char, index) => xmas[y][x + index + 1] === char)) {
        xmasCounter++;
      }
    }

    // vertically
    // - check for top
    if (validTop) {
      if (MAS.every((char, index) => xmas[y - index - 1][x] === char)) {
        xmasCounter++;
      }
    }
    // - check for bottom
    if (validBottom) {
      if (MAS.every((char, index) => xmas[y + index + 1][x] === char)) {
        xmasCounter++;
      }
    }

    // diagonally
    // - check for top and left
    if (validTop && validLeft) {
      if (
        MAS.every((char, index) => xmas[y - index - 1][x - index - 1] === char)
      ) {
        xmasCounter++;
      }
    }
    // - check for top and right
    if (validTop && validRight) {
      if (
        MAS.every((char, index) => xmas[y - index - 1][x + index + 1] === char)
      ) {
        xmasCounter++;
      }
    }
    // - check for bottom and left
    if (validBottom && validLeft) {
      if (
        MAS.every((char, index) => xmas[y + index + 1][x - index - 1] === char)
      ) {
        xmasCounter++;
      }
    }
    // - check for bottom and left
    if (validBottom && validLeft) {
      if (
        MAS.every((char, index) => xmas[y + index + 1][x + index + 1] === char)
      ) {
        xmasCounter++;
      }
    }
  }
}

console.log(xmasCounter);
