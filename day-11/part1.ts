import { read } from "../utils";

// read from file
const data = read(11, "input");

let stones: string[] = data.split(" ");

function blink() {
  const newstones = [];
  for (const stone of stones) {
    if (stone === "0") {
      newstones.push("1");
    } else if (stone.length % 2 === 0) {
      const splitstones = stone.split("");
      const pivot = Math.floor(stone.length / 2);

      let leftstone = splitstones.splice(0, pivot).join("");
      while (leftstone[0] === "0" && leftstone.length > 1) {
        leftstone = leftstone.slice(1);
      }
      let rightstone = splitstones.join("");
      while (rightstone[0] === "0" && rightstone.length > 1) {
        rightstone = rightstone.slice(1);
      }
      newstones.push(leftstone);
      newstones.push(rightstone);
    } else {
      newstones.push((Number(stone) * 2024).toString());
    }
  }

  stones = newstones;
}

let blinked = 0;
while (blinked < 25) {
  // console.log("after:", blinked, "stones:", stones.join(" "));
  blink();
  blinked++;
}
console.log(stones.length);
