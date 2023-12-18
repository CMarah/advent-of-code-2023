const test_input = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`.trim();
const input = require('fs').readFileSync('9/input', 'utf8').trim();

const readings = input.split('\n').map(line => line.split(' ').map(Number));

const getDifferences = line => {
  let differences = [line];
  while (differences.at(-1).at(-1) !== 0) {
    const new_difference = differences.at(-1).map((n, i) => {
      if (i === 0) return null;
      return n - differences.at(-1)[i - 1];
    })
      .filter(n => n !== null);
    differences.push(new_difference);
  }
  return differences;
};

// Part A
const answer_a = readings
  .map(line => getDifferences(line))
  .map(difs => difs.reduce((sum, d) => sum + d.at(-1), 0))
  .reduce((acc, cur) => acc + cur, 0);
console.log('Part A', answer_a);

// Part B
const answer_b = readings
  .map(line => getDifferences(line))
  .map(difs => difs.slice(0, -1).reverse()
    .reduce((left_value, d) => d.at(0) - left_value, 0)
  )
  .reduce((acc, cur) => acc + cur, 0);
console.log('Part B', answer_b);
