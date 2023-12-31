const test_input = `
.|...L....
|.-.L.....
.....|-...
........|.
..........
.........L
..../.LL..
.-.-/..|..
.|....-|.L
..//.|....
`.trim();
console.log(test_input);
const input = require('fs').readFileSync('16/input', 'utf8').trim();
console.log(input);

const tiles = input.split('\n').map(line => line.split(''));

// 0 up, 1 right, 2 down, 3 left

const getNextRayPosition = tiles => ray => {
  const [x, y, dir] = ray;
  const next_pos = dir === 0 ? [x-1, y] :
    dir === 1 ? [x, y+1] :
    dir === 2 ? [x+1, y] : [x, y-1];
  if (next_pos[0] < 0 || next_pos[0] >= tiles.length || next_pos[1] < 0 || next_pos[1] >= tiles[0].length) {
    return [];
  }
  const tile = tiles[next_pos[0]][next_pos[1]];
  if (tile === '.') {
    return [[next_pos[0], next_pos[1], dir]];
  }
  if (tile === '-') {
    if (dir === 0 || dir === 2) {
      return [
        [next_pos[0], next_pos[1], 1],
        [next_pos[0], next_pos[1], 3],
      ];
    }
    return [[next_pos[0], next_pos[1], dir]];
  }
  if (tile === '|') {
    if (dir === 1 || dir === 3) {
      return [
        [next_pos[0], next_pos[1], 0],
        [next_pos[0], next_pos[1], 2],
      ];
    }
    return [[next_pos[0], next_pos[1], dir]];
  }
  if (tile === '/') {
    if (dir === 0) {
      return [[next_pos[0], next_pos[1], 1]];
    }
    if (dir === 1) {
      return [[next_pos[0], next_pos[1], 0]];
    }
    if (dir === 2) {
      return [[next_pos[0], next_pos[1], 3]];
    }
    if (dir === 3) {
      return [[next_pos[0], next_pos[1], 2]];
    }
  }
  if (tile === '\\' || tile === 'L') {
    if (dir === 0) {
      return [[next_pos[0], next_pos[1], 3]];
    }
    if (dir === 1) {
      return [[next_pos[0], next_pos[1], 2]];
    }
    if (dir === 2) {
      return [[next_pos[0], next_pos[1], 1]];
    }
    if (dir === 3) {
      return [[next_pos[0], next_pos[1], 0]];
    }
  }
  return [[next_pos[0], next_pos[1], dir]];
};

const calcEnergyzed = (tiles, first_pos) => {
  let ray_positions = first_pos;
  let visited = first_pos;
  while (ray_positions.length > 0) {
    ray_positions = ray_positions
      .map(getNextRayPosition(tiles))
      .flat()
      .filter(
        ray => !visited.some(v => v[0] === ray[0] && v[1] === ray[1] && v[2] === ray[2])
      );
    visited = visited.concat(ray_positions);
  }
  return visited
    .reduce((acc, v) => {
      const key = `${v[0]}-${v[1]}`;
      if (!acc.includes(key)) acc.push(key);
      return acc;
    }, [])
    .length;
};

const start_a = getNextRayPosition(tiles)([0,-1,1]);
const answer_a = calcEnergyzed(tiles, start_a);
console.log('Part A:', answer_a);

// Part B
const possible_starts = (() => {
  let starts = [];
  for (let i = 0; i < tiles.length; i++) {
    starts.push(getNextRayPosition(tiles)([i, -1, 1]));
    starts.push(getNextRayPosition(tiles)([i, tiles[0].length, 3]));
  }
  for (let i = 0; i < tiles[0].length; i++) {
    starts.push(getNextRayPosition(tiles)([-1, i, 2]));
    starts.push(getNextRayPosition(tiles)([tiles.length, i, 0]));
  }
  return starts;
})();
const answer_b = possible_starts
  .map(start => calcEnergyzed(tiles, start))
  .reduce((acc, v) => Math.max(acc, v), 0);
console.log('Part B:', answer_b);
