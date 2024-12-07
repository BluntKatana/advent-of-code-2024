// read from file
const fs = require("fs");
const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const events = [];
data.replace(/mul\((\d+),(\d+)\)/g, (_1, left, right, index) => {
  events.push({ type: "mul", index, mul: left * right });
});

data.replace(/do()/g, (_1, _2, index) => {
  events.push({ type: "do", index });
});

data.replace(/don't()/g, (_1, _2, index) => {
  events.push({ type: "dont", index });
});

// sort on index
events.sort((a, b) => a.index - b.index);

let allowMultiplication = true;
let total = 0;
for (let event of events) {
  if (allowMultiplication && event.type === "mul") {
    total += event.mul;
  }

  if (event.type === "do") {
    allowMultiplication = true;
  }

  if (event.type === "dont") {
    allowMultiplication = false;
  }
}

console.log(total);
