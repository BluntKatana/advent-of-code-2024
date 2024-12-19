import { read } from "../utils";

const data = read(19, "input");
const lines = data.split("\n");

const towelsArray = lines[0].split(", ");
const towels = new Set(towelsArray);

let cache = new Map();
function countDesigns(d: string) {
  if (cache.has(d)) return cache.get(d);
  if (d.length === 0) return 1;

  let result = 0;

  for (const towel of towels) {
    if (d.startsWith(towel)) {
      result += countDesigns(d.substring(towel.length));
    }
  }

  cache.set(d, result);

  return result;
}

const count = lines.splice(2).reduce((acc, design) => {
  cache = new Map();
  return acc + countDesigns(design);
}, 0);

console.log(count);
