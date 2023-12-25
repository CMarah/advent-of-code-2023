const test_input = `
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJIF7FJ-
L---JF-JLJIIIIFJLJJ7
|F|F-JF---7IIIL7L|7|
|FFJF7L7F-JF7IIL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L
`.trim();
const input = require('fs').readFileSync('10/input', 'utf8').trim();

const tile_data = input.split('\n').map(line => line.split(''));

// Part A
const getStartingPosition = (tile_data) => {
  const row = tile_data.findIndex(row => row.includes('S'));
  const col = tile_data[row].findIndex(col => col === 'S');
  return { row, col };
};
const starting_position = getStartingPosition(tile_data);

const getStaringPosPipeType = (tile_data, starting_position) => {
  const { row, col } = starting_position;
  const goes_up = row !== 0 && ['|', '7', 'F'].includes(tile_data[row - 1][col]);
  const goes_down = row !== (tile_data.length - 1) && ['|', 'J', 'L'].includes(tile_data[row + 1][col]);
  if (goes_up && goes_down) return '|';
  if (!goes_up && !goes_down) return '-';
  const goes_left = col !== 0 && ['-', 'F', 'L'].includes(tile_data[row][col - 1]);
  if (goes_up && goes_left) return '7';
  if (goes_up && !goes_left) return 'F';
  if (goes_down && goes_left) return 'J';
  if (goes_down && !goes_left) return 'L';
};
const starting_pos_pipe_type = getStaringPosPipeType(tile_data, starting_position);
tile_data[starting_position.row][starting_position.col] = starting_pos_pipe_type;
console.log(tile_data);

const move_meanings = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
};
// For each pipe, next pos given arriving move
const move_mappings = {
  '|': {
    up: 'up',
    down: 'down',
  },
  '-': {
    left: 'left',
    right: 'right',
  },
  '7': {
    up: 'left',
    right: 'down',
  },
  'J': {
    down: 'left',
    right: 'up',
  },
  'L': {
    down: 'right',
    left: 'up',
  },
  'F': {
    up: 'right',
    left: 'down',
  },
};
const getLoop = (tile_data, initial_pos) => {
  let running_loop = [];
  let row = initial_pos.row;
  let col = initial_pos.col;
  let prev_move = '';

  while (running_loop.length === 0 || (row !== initial_pos.row || col !== initial_pos.col)) {
    const pipe_type = tile_data[row][col] === 'S' ?
      starting_pos_pipe_type : tile_data[row][col];
    const move = move_mappings[pipe_type][prev_move] ||
      Object.keys(move_mappings[pipe_type])[0];
    row = row + move_meanings[move][0];
    col = col + move_meanings[move][1];
    prev_move = move;
    running_loop.push([row, col]);
  }
  return running_loop;
};

const loop = getLoop(tile_data, starting_position);

// Part A
const answer_a = loop.length/2;
console.log('A:', answer_a);

// Part B
const isInLoop = (row, col) => loop.some(
  ([loop_row, loop_col]) => loop_row === row && loop_col === col
);

const getLoopTilesAbove = (row, col) => (new Array(row)).fill(0)
  .map((_, i) => [row-i-1, col])
  .filter(([loop_row, loop_col]) => isInLoop(loop_row, loop_col));

const isContainedByLoop = (row, col) => {
  if (isInLoop(row, col)) return false;
  const loop_tiles_above = getLoopTilesAbove(row, col, loop);
  return loop_tiles_above.reduce((acc, [loop_row, loop_col]) => {
    const symbol = tile_data[loop_row][loop_col];
    if (symbol === '-') {
      return { had_wall: !acc.had_wall };
    }
    if (acc.going_up) {
      if (symbol === '7') {
        if (acc.going_left) return { had_wall: !acc.had_wall };
        return { had_wall: acc.had_wall };
      }
      if (symbol === 'F') {
        if (acc.going_left) return { had_wall: acc.had_wall };
        return { had_wall: !acc.had_wall };
      }
      return acc;
    }
    if (symbol === 'J') return {
      going_up: true,
      going_left: false,
      had_wall: acc.had_wall,
    };
    if (symbol === 'L') return {
      going_up: true,
      going_left: true,
      had_wall: acc.had_wall,
    };
    return acc;
  }, { had_wall: false }).had_wall;
};

const getTotalContainedArea = () => {
  let total_area = 0;
  const min_row_loop = Math.min(...loop.map(([row,]) => row));
  const max_row_loop = Math.max(...loop.map(([row,]) => row));
  const min_col_loop = Math.min(...loop.map(([,col]) => col));
  const max_col_loop = Math.max(...loop.map(([,col]) => col));
  for (let row = min_row_loop; row <= max_row_loop; row++) {
    for (let col = min_col_loop; col <= max_col_loop; col++) {
      if (isContainedByLoop(row, col)) {
        total_area++;
      }
    }
  }
  return total_area;
};

const answer_b = getTotalContainedArea();
console.log('B:', answer_b);
