const {readFileSync} = require('fs');

// read file into array
function parseLines(filename) {
  const contents = readFileSync(filename, 'utf-8');
  const arr = contents.split(/\r?\n/);
  console.log(arr);
  return arr;
}

// parseLines("./example.txt"); // ran with $) node annotationsFunctions.js