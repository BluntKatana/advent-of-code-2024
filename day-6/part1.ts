// read from file
const fs = require("fs");
const data = fs.readFileSync(`${__dirname}/input.txt`, "utf-8") as string;

let agentPos: [number, number] | null = null;
const map: string[][] = data.split("\n").map((line: string, y) => {
  const chars = line.split("");
  if (chars.includes("^")) {
    const x = chars.findIndex((val) => val === "^");
    agentPos = [x, y];
  }
  return chars;
});

if (agentPos === null) {
  throw Error("position of agent not found");
}
const maxY = map.length;
const maxX = map[0].length;
let dir: [number, number] = [0, -1]; // x, y
const uniquePos = new Set<string>([`${agentPos[0]},${agentPos[1]}`]);

while (true) {
  const nextX = dir[0] + agentPos[0];
  const nextY = dir[1] + agentPos[1];

  if (maxX === nextX || nextX < 0 || maxY === nextY || nextY < 0) {
    console.log("out of bounds");
    // check if nextX or nextY is out-of-bounds
    // if so, go out of the loop
    break;
  } else if (map[nextY][nextX] === "#") {
    console.log("rotate");
    // rotate right by 90 degrees
    if (dir[0] === 0 && dir[1] === -1) dir = [1, 0]; // up > right
    else if (dir[0] === 1 && dir[1] === 0) dir = [0, 1]; // right > down
    else if (dir[0] === 0 && dir[1] === 1) dir = [-1, 0]; // down > left
    else if (dir[0] === -1 && dir[1] === 0) dir = [0, -1]; // left > up
  } else if (map[nextY][nextX] === "." || map[nextY][nextX] === "^") {
    console.log("forward");
    // move forward to the next position
    const newPos: [number, number] = [nextX, nextY];
    uniquePos.add(newPos.toString());
    agentPos = newPos;
  } else {
    console.log("nothing");
  }
}
console.log(uniquePos.size);

function printMap() {
  map.forEach((line, y) => {
    console.log(
      line
        .map((char, x) => {
          if (agentPos![0] === x && agentPos![1] === y) return "!";
          if (char === "^") return ".";
          return char;
        })
        .join("")
    );
  });
}
