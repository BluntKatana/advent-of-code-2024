// read from file
const fs = require("fs");
const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

// parse data
let safeReports = 0;

for (let report of data.split("\n")) {
  const parsedLevels = report.split(" ").map(Number);
  const levelCombos = parsedLevels
    .map((level, index) => {
      if (index === 0) {
        return parsedLevels.slice(1);
      }
      if (index === parsedLevels.length - 1) {
        return parsedLevels.slice(0, parsedLevels.length - 1);
      }
      return parsedLevels.slice(0, index).concat(parsedLevels.slice(index + 1));
    })
    .concat([parsedLevels]);

  const isSomeComboSafe = levelCombos.some((levels) => {
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

    return isSafe;
  });

  if (isSomeComboSafe) {
    safeReports++;
  }
}

console.log(safeReports);
