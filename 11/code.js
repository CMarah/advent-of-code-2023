const test_input = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`.trim();
const input = require('fs').readFileSync('11/input', 'utf8').trim();

const raw_image = input.split('\n').map(line => line.split(''));

const empty_rows = raw_image
  .map((row, i) => row.every(col => col === '.') ? i : null)
  .filter(row => row !== null);
const empty_cols = raw_image[0]
  .map((_, i) => raw_image.every(row => row[i] === '.') ? i : null)
  .filter(col => col !== null);

const getDistance = (g1, g2, part_b) => {
  const [x1, y1] = g1;
  const [x2, y2] = g2;
  const max_x = Math.max(x1, x2);
  const min_x = Math.min(x1, x2);
  const max_y = Math.max(y1, y2);
  const min_y = Math.min(y1, y2);
  const empty_rows_between = empty_rows.filter(row => row > min_x && row < max_x).length;
  const empty_cols_between = empty_cols.filter(col => col > min_y && col < max_y).length;
  return Math.abs(x1 - x2) + Math.abs(y1 - y2) +
    (part_b ? 999999 : 1)*(empty_rows_between + empty_cols_between);
};

const galaxy_positions = raw_image.reduce(
  (gps, row, i) => row.reduce(
    (gps_row, elem, j) => {
      if (elem === '#') return [...gps_row, [i, j]];
      return gps_row;
    }
  , gps)
, []);

// Part A
const galaxy_distances = galaxy_positions.map(([x, y]) => galaxy_positions
  .reduce((distances_sum, [x2, y2]) => distances_sum + getDistance([x, y], [x2, y2]), 0)
)
  .reduce((total, partial) => total + partial, 0);
const answer_a = galaxy_distances/2;
console.log('Answer A:', answer_a);

// Part B
const galaxy_distances_b = galaxy_positions.map(([x, y]) => galaxy_positions
  .reduce((distances_sum, [x2, y2]) => distances_sum + getDistance([x, y], [x2, y2], true), 0)
)
  .reduce((total, partial) => total + partial, 0);
const answer_b = galaxy_distances_b/2;
console.log('Answer B:', answer_b);
