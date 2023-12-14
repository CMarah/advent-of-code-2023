const test_input = `
Time:      7  15   30
Distance:  9  40  200
`.trim();
const input = require('fs').readFileSync('6/input', 'utf8').trim();

// Part A
const numPossibleConfigs = (time, distance) => 
  (new Array(time)).fill(0).map((_, i) => i)
    .filter(speed => speed * (time - speed) > distance)
    .length;

const times_a = input.split('\n')[0].split(' ').map(Number).filter(f => f);
const distances_a = input.split('\n')[1].split(' ').map(Number).filter(f => f);
const answer_a = times_a.reduce((acc, t, i) => {
  const d = distances_a[i];
  const possible_configs = numPossibleConfigs(t, d);
  return acc * possible_configs;
}, 1);
console.log('Part A', answer_a);

// Part beforeAll(async () => {
const time_b = Number(input.split('\n')[0].split(':')[1].replace(/\s/g, ''));
const distance_b = Number(input.split('\n')[1].split(':')[1].replace(/\s/g, ''));
const answer_b = (() => {
  // Find max and min speed settings which still win
  let max_speed = time_b;
  while (max_speed > 0) {
    if (max_speed * (time_b - max_speed) > distance_b) {
      break;
    }
    max_speed -= 1;
  }
  let min_speed = 0;
  while (min_speed < time_b) {
    if (min_speed * (time_b - min_speed) > distance_b) {
      break;
    }
    min_speed += 1;
  }
  return max_speed - min_speed + 1;
})();
console.log('Part B', answer_b);
