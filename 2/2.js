const test_input = `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`;


const input = require('fs').readFileSync('2/input', 'utf8');

const MAX_CUBES = [12, 13, 14];

const getCubes = round => ([
  parseInt(round.match(/(\d+)? red/)?.[1]) || 0,
  parseInt(round.match(/(\d+)? green/)?.[1]) || 0,
  parseInt(round.match(/(\d+)? blue/)?.[1]) || 0,
]);

const parsed_rounds = input.split('\n')
  .filter(line => line.length > 0)
  .map(line => line.split(';'))
  .map(rounds => rounds.map(getCubes));

// Part A
const answer_1 = parsed_rounds
  .reduce((score, rounds, i) =>
    rounds.every(round => round.every((cubes, i) => cubes <= MAX_CUBES[i])) ?
      (score + i+1) : score
  , 0);
console.log('Part A:', answer_1);

// Part B
const answer_2 = parsed_rounds
  .map(rounds => rounds.reduce(([r, g, b], round) => ([
    round[0] > r ? round[0] : r,
    round[1] > g ? round[1] : g,
    round[2] > b ? round[2] : b,
  ]), [0, 0, 0]))
  .map(([r, g, b]) => r * g * b)
  .reduce((a, b) => a + b, 0);
console.log('Part B:', answer_2);
