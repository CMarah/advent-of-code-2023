const test_input = `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`.trim();
const input = require('fs').readFileSync('14/input', 'utf8').trim();

const platform = input.split('\n').map(row => row.split(''));

const getRockPositions = platform => platform.reduce((acc, row, row_num) =>
  row.reduce((acc, cell, col_num) => {
    if (cell === 'O') {
      return acc.concat([[row_num, col_num]]);
    }
    return acc;
  }, acc)
, []);

const moveRockUp = (rock, platform) => {
  platform[rock[0]][rock[1]] = '.';
  let new_row = rock[0];
  while (new_row > 0 && platform[new_row - 1][rock[1]] === '.') {
    --new_row;
  }
  platform[new_row][rock[1]] = 'O';
  return platform;
};

const calcLoad = platform => platform.reduce(
  (acc, row, row_num) =>
    acc + row.reduce((acc, cell) => acc + (cell === 'O' ? (platform.length - row_num) : 0), 0)
  , 0);

const processRocks = (platform, rock_positions) => {
  return rock_positions.reduce(
    (acc, rock) => moveRockUp(rock, acc)
  , platform);
};

// Part A
const rock_positions = getRockPositions(platform);
const final_platform = processRocks(platform, rock_positions);
const answer_a = calcLoad(final_platform);
console.log("Answer A:", answer_a);

// Part B
const rotatePlatform = platform => platform[0].map(
  (_, col_num) => platform.map(row => row[col_num]).reverse()
);

const cycle = platform => {
  // Move up
  const rock_positions_up = getRockPositions(platform);
  const pl2 = rotatePlatform(processRocks(platform, rock_positions_up));
  // Move west
  const rock_positions_west = getRockPositions(pl2);
  const pl3 = rotatePlatform(processRocks(pl2, rock_positions_west));
  // Move down
  const rock_positions_down = getRockPositions(pl3);
  const pl4 = rotatePlatform(processRocks(pl3, rock_positions_down));
  // Move east
  const rock_positions_east = getRockPositions(pl4);
  return rotatePlatform(processRocks(pl4, rock_positions_east));
};

const cycleN = (platform, n) => {
  let pl = platform;
  for (let i = 0; i < n; ++i) {
    pl = cycle(pl);
  }
  return pl;
}

const getFinalPosB = platform => {
  const initial_rps = getRockPositions(platform).toString();
  let rock_history = [initial_rps];
  let repeated = -1;
  let cycle_num = 0;
  while (repeated === -1) {
    platform = cycle(platform);
    ++cycle_num;
    const rock_positions = getRockPositions(platform).toString();
    repeated = rock_history.findIndex(history => history === rock_positions);
    rock_history.push(rock_positions);
  }
  console.log('Repeated', repeated, 'at cycle', cycle_num);
  const period = cycle_num - repeated;
  const remaining_cycles = (1000000000 - cycle_num) % period;
  return cycleN(platform, remaining_cycles);
};
const final_pos_b = getFinalPosB(platform);
const answer_b = calcLoad(final_pos_b);
console.log("Answer B:", answer_b);
