import { read } from "../utils";

// read from file
const data = read(11, "example");

const stonesToProcess: { stone: number; blinked: number }[] = data
  .split(" ")
  .map((stone) => ({ stone: Number(stone), blinked: 0 }));

let stone = null;
let stoneCount = 0;
const lastStones = [];
while ((stone = stonesToProcess.pop())) {
  const copyStone = stone;
  // process stones until they reach some number
  while (stone.blinked < 25) {
    const blinked: number = stone.blinked + 1;
    if (stone.stone === 0) {
      stone = { stone: 1, blinked };
    } else if (numDigits(stone.stone) % 2 === 0) {
      const strStone = stone.stone.toString();
      const leftStone = strStone.substring(0, Math.floor(strStone.length / 2));
      const rightStone = strStone.substring(Math.floor(strStone.length / 2));

      stone = { stone: Number(leftStone), blinked };
      stonesToProcess.push({ stone: Number(rightStone), blinked });
    } else {
      stone = { stone: stone.stone * 2024, blinked };
    }
  }
  lastStones.push(copyStone.stone);
  if (stone.blinked !== 25) console.log(stone.blinked);
  stoneCount++;
}

console.log(stoneCount); //, ":", lastStones.join(" "));

function numDigits(x: number) {
  return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
}
