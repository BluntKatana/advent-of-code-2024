// read from file
const fs = require("fs");
const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

// parse data
const sum = data.match(/mul\((\d+),(\d+)\)/g).reduce((acc, mul) => {
  const [_, left, right] = mul.match(/mul\((\d+),(\d+)\)/);
  return acc + left * right;
}, 0);

console.log(sum);
