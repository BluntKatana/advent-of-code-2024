// read from file
const fs = require("fs");
const data = fs.readFileSync(`${__dirname}/input.txt`, "utf-8") as string;

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
    if (xmas[y][x] !== "X") {
      continue;
    }

    // in every direction
    for (let dirX = -1; dirX <= 1; dirX++) {
      for (let dirY = -1; dirY <= 1; dirY++) {
        let fullMAS = true;

        // check whether the characters are correct
        for (let c = 0; c < MAS.length; c++) {
          const velY = y + dirY * (c + 1);
          const velX = x + dirX * (c + 1);

          if (isInBounds([velX, velY])) {
            const char = xmas[velY][velX];

            if (char !== MAS[c]) {
              fullMAS = false;
            }
          } else {
            fullMAS = false;
          }
        }

        if (fullMAS) xmasCounter++;
      }
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
