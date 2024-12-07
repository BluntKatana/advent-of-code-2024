// read from file
const fs = require("fs");
const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

// parse data
const lList = [];
const counterMap = new Map();

for (let line of data.split("\n")) {
  const [l, r] = line.split("   ");
  lList.push(parseInt(l));

  if (counterMap.has(r)) {
    counterMap.set(r, counterMap.get(r) + 1);
  } else {
    counterMap.set(r, 1);
  }
}

let similarityScore = 0;

for (let i = 0; i < lList.length; i++) {
  const counter = counterMap.get(String(lList[i]));
  if (counter === undefined) {
    continue;
  }

  similarityScore += counter * lList[i];
}

console.log(similarityScore);
