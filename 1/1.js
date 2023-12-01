const test_input = `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`;

const input = require('fs').readFileSync('1/input', 'utf8');

// Part A
const answer_1 = input.split('\n')
  .filter(line => line.length > 0)
  .map(line => line.split('').filter(char => !isNaN(char)))
  .map(nums => nums[0] + nums[nums.length - 1])
  .map(num => parseInt(num))
  .reduce((acc, num) => acc + num, 0);
console.log('Part A:', answer_1);

// Part B
const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const replaceNumbers = str => {
  if (str.length === 0) return '';
  const num = numbers.findIndex(num => str.startsWith(num)) + 1;
  if (num > 0) {
    return `${num}` + replaceNumbers(str.slice(1));
  }
  if (isNaN(str[0])) return replaceNumbers(str.slice(1));
  return str[0] + replaceNumbers(str.slice(1));
};
const clean_input = input.split('\n')
  .filter(line => line.length > 0)
  .map(line => replaceNumbers(line));
const answer_2 = clean_input
  .map(line => line.split('').filter(char => !isNaN(char)))
  .map(nums => nums[0] + nums[nums.length - 1])
  .map(num => parseInt(num))
  .reduce((acc, num) => acc + num, 0);
console.log('Part B:', answer_2);
