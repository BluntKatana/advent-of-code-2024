// read from file
const fs = require("fs");
const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

// parse data
let safeReports = 0;

for (let report of data.split("\n")) {
  const levels = report.split(" ").map(Number);
  const increasing = levels[0] - levels[1] < 0; // false => decreasing

  const isSafe = levels.reduce((allSafe, level, index) => {
    if (index === 0) {
      return true;
    }

    const diff = level - levels[index - 1];

    let singleSafe = true;

    // atleast 1, atmost 3
    if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
      singleSafe = false;
    }

    // increasing but diff is negative
    if (increasing && diff < 0) {
      singleSafe = false;
    }

    // decreasing but diff is positive
    if (!increasing && diff > 0) {
      singleSafe = false;
    }

    return allSafe && singleSafe;
  }, true);

  if (isSafe) {
    safeReports++;
  }
}

console.log(safeReports);
