import { read } from "../utils";

const data = read(19, "example");
const lines = data.split("\n");

const towelsArray = lines[0].split(", ");
const towels = new Set(towelsArray);

let possible = 0;
lines.splice(2).forEach((design) => {
  console.log("---", design, "---");
  const ways = designCount(design, 0);
  console.log(ways);
  possible += ways;
});

console.log(possible);

function designCount(design: string, poss: number): number {
  if (towels.has(design)) return poss + 1;

  let possibilities = poss;

  // check all substrings in design
  for (let i = 1; i < design.length; i++) {
    // if part of design is a towel, move on to the rest
    const subdesign = design.substring(0, i);
    if (towels.has(subdesign)) {
      const restofdesign = design.substring(i);
      possibilities += designCount(restofdesign, poss);
    }
  }

  return possibilities;
}
