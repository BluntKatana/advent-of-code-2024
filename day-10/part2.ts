import { read } from "../utils";

// read from file
const data = read(9, "input");

type File = [number, number]; // [amount, index]
type Space = [number]; // [amount]

function isSpace(block: File | Space): block is Space {
  return block.length === 1;
}

let index = 0;
let blocks: (File | Space)[] = [];

for (let i = 0; i < data.length; i++) {
  const num = Number(data[i]);
  if (i % 2 === 0) {
    // add file blocks
    blocks.push([num, index]);
    index++;
  } else {
    // add empty space blocks
    blocks.push([num]);
  }
}

let l = 0;
while (l < blocks.length - 1) {
  const lBlock = blocks[l];
  if (isSpace(lBlock)) {
    const space = lBlock[0];

    // find first file block which fits in space
    for (let r = blocks.length - 1; l < r; r--) {
      const rBlock = blocks[r];
      const rSpace = rBlock[0];
      // console.log(space, rBlock);
      if (!isSpace(rBlock) && rSpace <= space) {
        if (rSpace === space) {
          // remove space of blocks[l]
          // remove space of blocks[r]
          // and insert blocks[r] on the left of it
          [blocks[l], blocks[r]] = [blocks[r], blocks[l]];

          break;
        } else {
          // decrease space of blocks[l]
          // insert blocks[r] on the left of it
          // and remove space of blocks[r];

          blocks[l] = [space - rSpace];
          blocks[r] = [space - (space - rSpace)];
          blocks = [...blocks.slice(0, l), rBlock, ...blocks.slice(l)];
          break;
        }
      }
    }
  }

  l++;
}

// calculate checksum
let checksum = 0;
let blockIndex = 0;
for (let i = 0; i < blocks.length; i++) {
  const block = blocks[i];
  if (!isSpace(block)) {
    const [space, index] = block;

    for (let i = 0; i < space; i++) {
      checksum += (i + blockIndex) * index;
    }
  }

  blockIndex += block[0];
}

console.log(checksum);

function printBlocks() {
  console.log(
    blocks
      .map((block) => {
        if (isSpace(block)) {
          return ".".repeat(block[0]);
        }
        const [space, index] = block;
        return String(index).repeat(space);
      })
      .join("")
  );
}
