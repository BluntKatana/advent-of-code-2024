// read from file
const fs = require("fs");
const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

// parse data
const lList = [];
const rList = [];

for (let line of data.split("\n")) {
  const [l, r] = line.split("   ");
  lList.push(parseInt(l));
  rList.push(parseInt(r));
}

lList.sort();
rList.sort();

let dist = 0;

for (let i = 0; i < lList.length; i++) {
  dist += Math.abs(lList[i] - rList[i]);
}

console.log(dist);
