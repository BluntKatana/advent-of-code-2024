import { read } from "../utils";

const BLINKS = 75;

const data = read(11, "input");

let stonesMap = new Map<number, number>();
for (const stone of data.split(" ").map(Number)) {
  stonesMap.set(stone, (stonesMap.get(stone) || 0) + 1);
}

function blink() {
  const newStonesMap = new Map<number, number>();

  for (const [stone, count] of stonesMap.entries()) {
    if (stone === 0) {
      newStonesMap.set(1, (newStonesMap.get(1) || 0) + count);
    } else if (stone.toString().length % 2 === 0) {
      const strStone = stone.toString();
      const pivot = Math.floor(strStone.length / 2);
      const leftStone = Number(strStone.substring(0, pivot));
      const rightStone = Number(strStone.substring(pivot));

      newStonesMap.set(leftStone, (newStonesMap.get(leftStone) || 0) + count);
      newStonesMap.set(rightStone, (newStonesMap.get(rightStone) || 0) + count);
    } else {
      const largeStone = stone * 2024;
      newStonesMap.set(largeStone, (newStonesMap.get(largeStone) || 0) + count);
    }
  }
  stonesMap = newStonesMap;
}

for (let hoi = 0; hoi < BLINKS; hoi++) {
  blink();
}

const stoneCount = stonesMap.values().reduce((acc, val) => acc + val);
console.log(stoneCount);
