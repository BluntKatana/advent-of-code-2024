import { read } from "../utils";
const BLINKS = 25;
const data = read(11, "input");

let stones: number[] = data.split(" ").map(Number);

function blink() {
  const newstones = [];
  for (const stone of stones) {
    if (stone === 0) {
      newstones.push(1);
    } else if (stone.toString().length % 2 === 0) {
      const strStone = stone.toString();
      const pivot = Math.floor(strStone.length / 2);
      const leftStone = strStone.substring(0, pivot);
      const rightStone = strStone.substring(pivot);

      newstones.push(Number(leftStone), Number(rightStone));
    } else {
      newstones.push(Number(stone) * 2024);
    }
  }
  stones = newstones;
}

for (let hoi = 0; hoi < BLINKS; hoi++) {
  blink();
}

console.log(stones.length);
