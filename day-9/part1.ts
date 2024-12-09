import { read } from "../utils";

// read from file
const data = read(9, "input");

let index = 0;
let blocks: number[] = [];

for (let i = 0; i < data.length; i++) {
  const leftIsFile = i % 2 === 0;
  const num = Number(data[i]);

  if (leftIsFile) {
    // add file blocks
    for (let i = 0; i < num; i++) {
      blocks.push(index);
    }
    index++;
  } else {
    // add empty space blocks
    for (let i = 0; i < num; i++) {
      blocks.push(-1);
    }
  }
}

let l = 0;
let r = blocks.length - 1;
while (l < r) {
  if (blocks[l] === -1) {
    // find first block which is not empty
    for (let rTemp = r; l < rTemp; rTemp--) {
      if (blocks[rTemp] !== -1) {
        r = rTemp;
        // swap
        [blocks[l], blocks[rTemp]] = [blocks[rTemp], blocks[l]];
        break;
      }
    }
  }

  l++;
}

// calculate checksum
let checksum = 0;
for (let i = 0; i < blocks.length; i++) {
  checksum += blocks[i] !== -1 ? blocks[i] * i : 0;
}

console.log(checksum);
