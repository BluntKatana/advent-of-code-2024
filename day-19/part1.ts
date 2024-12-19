import { read } from "../utils";

const data = read(19, "input");
const lines = data.split("\n");

const towelsArray = lines[0].split(", ");
const towels = new Set(towelsArray);

let possible = 0;
lines.splice(2).forEach((design) => {
  if (isDesignPossible(design)) {
    possible += 1;
  }
});

console.log(possible);

function isDesignPossible(design: string): boolean {
  if (towels.has(design)) return true;

  let possible = false;
  // check all substrings in design
  for (let i = 1; i < design.length; i++) {
    // if part of design is a towel, move on to the rest
    const subdesign = design.substring(0, i);
    if (towels.has(subdesign)) {
      const restofdesign = design.substring(i);
      possible ||= isDesignPossible(restofdesign);
    }
  }

  return possible;
}
