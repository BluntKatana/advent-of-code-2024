// read from file
const fs = require("fs");
const data = fs.readFileSync(`${__dirname}/example.txt`, "utf-8") as string;
