// read from file
const fs = require("fs");
const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

// parse the page ordering rules
const rules = new Map<number, number[]>();
const lines = data.split("\n");
let lineIndex = 0;

while (lines[lineIndex] !== "") {
  const line = lines[lineIndex];
  const rule = line.split("|").map(Number);

  rules.set(rule[0], [...(rules.get(rule[0]) ?? []), rule[1]]);

  lineIndex++;
}

let totalOfMiddle = 0;

// process the updates
for (let i = lineIndex + 1; i < lines.length; i++) {
  const line = lines[i];
  const pages: number[] = line.split(",").map(Number);

  let isCorrectOrder = true;

  for (let i = 0; i < pages.length; i++) {
    // check pages left
    const pagesLeft = pages.slice(0, i);
    for (let j = 0; j < pagesLeft.length; j++) {
      if (pages[i] === pages[j]) {
        continue;
      }
      // check if there is a rule saying that i must be left of j
      const pagesofI = rules.get(pages[i]);
      if (pagesofI?.includes(pages[j])) {
        isCorrectOrder = false;
        break;
      }
    }
  }

  if (isCorrectOrder) continue;

  // only sort incorrectly ordered pages
  pages.sort((pageLeft, pageRight) => {
    const pageRightRules = rules.get(pageRight) ?? [];
    if (pageRightRules.includes(pageLeft)) {
      return -1;
    }

    return 1;
  });

  totalOfMiddle += pages.at(Math.floor(pages.length / 2)) ?? 0;
}

console.log(totalOfMiddle);
