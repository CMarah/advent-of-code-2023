const test_input = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`.trim();
const input = require('fs').readFileSync('3/input', 'utf8');

const parsed_input = input.split('\n').reduce((acc, line, row) => {
  let numbers = [];
  let new_symbols = [];

  for (let i = 0; i < line.length; i++) {
    if (parseInt(line[i]) || line[i] === '0') {
      if (!numbers.length || numbers.at(-1)?.end_index) {
        // New number
        numbers.push({
          row,
          start_index: i,
          end_index: null,
          text: line[i],
        });
      } else {
        // Existing one
        numbers.at(-1).text += line[i];
      }
    } else {
      // Not a number
      if (numbers.length && !numbers.at(-1).end_index) {
        numbers.at(-1).end_index = i - 1;
      }
      if (line[i] !== '.') {
        new_symbols.push({
          index: i,
          text: line[i],
          row,
        });
      }
    }
  }
  if (numbers.length && !numbers.at(-1).end_index) {
    numbers.at(-1).end_index = line.length - 1;
  }
  const new_numbers = numbers.map(number => ({ ...number, value: parseInt(number.text) }));

  return ({
    symbols: [...acc.symbols, ...new_symbols],
    numbers: [...acc.numbers, ...new_numbers],
  });
}, { symbols: [], numbers: [] });

const areAdjacent = ({ row, start_index, end_index }, s) =>
  [row, row + 1, row - 1].includes(s.row) &&
  ((start_index - 1) <= s.index && (end_index + 1) >= s.index);


// Part A
const hasAdjacentSymbol = (number, symbols) => symbols.some(s => areAdjacent(number, s));

const answer_1 = parsed_input.numbers.reduce(
  (acc, number) => acc + (hasAdjacentSymbol(number, parsed_input.symbols) ? number.value : 0)
, 0);
console.log('Part A:', answer_1);

// Part B
const answer_2 = parsed_input.symbols.reduce((total_gear_ratio, s) => {
  const adjacent_numbers = parsed_input.numbers.filter(n => areAdjacent(n, s));
  if (adjacent_numbers.length === 2) {
    return total_gear_ratio + adjacent_numbers[0].value*adjacent_numbers[1].value;
  }
  return total_gear_ratio;
}, 0);
console.log('Part B:', answer_2);
