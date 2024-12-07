// read from file
const fs = require("fs");
const data = fs.readFileSync(`${__dirname}/input.txt`, "utf-8") as string;

let originalAgentPos: [number, number] = [-1, -1];
let oldAgentPos = originalAgentPos;
const map: string[][] = data.split("\n").map((line: string, y) => {
  const chars = line.split("");
  if (chars.includes("^")) {
    const x = chars.findIndex((val) => val === "^");
    originalAgentPos = [x, y];
  }
  return chars;
});

const maxY = map.length;
const maxX = map[0].length;

let loopCount = 0;

for (let y = 0; y < maxY; y++) {
  for (let x = 0; x < maxX; x++) {
    const updatedMap = map.map((line, mapY) =>
      line.map((char, mapX) => {
        if (x === mapX && y === mapY) return "#";
        return char;
      })
    );
    checkMap(updatedMap, originalAgentPos);
  }
}

function checkMap(map: string[][], startAgentAt: [number, number]) {
  let agentPos = startAgentAt;
  let dir: [number, number] = [0, -1]; // x, y

  const uniquePosAndDir = new Set<string>([hashPosAndDir(agentPos, dir)]);

  let breakOutReason: "out-of-bounds" | "loop" | null = null;

  while (true) {
    const nextX = dir[0] + agentPos[0];
    const nextY = dir[1] + agentPos[1];

    if (maxX === nextX || nextX < 0 || maxY === nextY || nextY < 0) {
      // console.log("out of bounds");
      // check if nextX or nextY is out-of-bounds
      // if so, go out of the loop
      breakOutReason = "out-of-bounds";
      break;
    } else if (map[nextY][nextX] === "#") {
      // console.log("rotate");
      // rotate right by 90 degrees
      if (dir[0] === 0 && dir[1] === -1) dir = [1, 0]; // up > right
      else if (dir[0] === 1 && dir[1] === 0) dir = [0, 1]; // right > down
      else if (dir[0] === 0 && dir[1] === 1) dir = [-1, 0]; // down > left
      else if (dir[0] === -1 && dir[1] === 0) dir = [0, -1]; // left > up
    } else if (map[nextY][nextX] === "." || map[nextY][nextX] === "^") {
      // console.log("forward");
      // move forward to the next position
      const newPos: [number, number] = [nextX, nextY];

      if (uniquePosAndDir.has(hashPosAndDir(newPos, dir))) {
        // console.log("out of bounds");
        // if we have already encountered this position and direction, we
        // are stuck in a loop
        breakOutReason = "loop";

        break;
      }

      uniquePosAndDir.add(hashPosAndDir(newPos, dir));
      agentPos = newPos;
    } else {
      console.log("nothing");
    }
  }

  // console.log("breakout:", breakOutReason);
  if (breakOutReason === "loop") {
    loopCount += 1;
  }
}

console.log(loopCount);

function hashPosAndDir(pos: [number, number], dir: [number, number]) {
  return `${pos[0]},${pos[1]}|${dir[0]},${dir[1]}`;
}
