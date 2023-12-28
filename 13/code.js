const test_input = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`.trim();
const input = require('fs').readFileSync('13/input', 'utf8').trim();

const blocks = input.split('\n\n');

const rowsFromBlock = block => block.split('\n').map(row => row.split(''));
const colsFromBlock = block => block.split('\n')[0].split('')
  .map((_, i) => rowsFromBlock(block).map(row => row[i]));

// Part A
const findSimmetryIndex = rows => {
  for (let simm_idx = 1; simm_idx < rows.length; simm_idx++) {
    const valid = rows.every((row, i) => {
      if (i >= simm_idx) return true;
      const mirror_idx = simm_idx + (simm_idx - i) - 1;
      if (mirror_idx >= rows.length) return true;
      return row.every((cell, j) => cell === rows[mirror_idx][j]);
    });
    if (valid) return simm_idx;
  }
  return 0;
};

const answer_a = blocks
  .map(block => {
    const rows = rowsFromBlock(block);
    const horizontal_simmetry_index = findSimmetryIndex(rows);
    const cols = colsFromBlock(block);
    const vertical_simmetry_index = findSimmetryIndex(cols);
    return 100*horizontal_simmetry_index + vertical_simmetry_index;
  })
  .reduce((a, b) => a + b, 0);
console.log('Answer A:', answer_a);

// Part B
const findSimmetryIndexSmudged = rows => {
  for (let simm_idx = 1; simm_idx < rows.length; simm_idx++) {
    const { found_smudge, valid } = rows.reduce((acc, row, i) => {
      const { found_smudge, valid } = acc;
      if (!valid) return acc;
      if (i >= simm_idx) return acc;
      const mirror_idx = simm_idx + (simm_idx - i) - 1;
      if (mirror_idx >= rows.length) return acc;
      if (found_smudge) {
        return row.every((cell, j) => cell === rows[mirror_idx][j]) ? acc : { valid: false };
      }
      const num_diffs = row.filter((cell, j) => cell !== rows[mirror_idx][j]).length;
      if (num_diffs > 1) return { valid: false };
      if (num_diffs === 0) return acc;
      return { found_smudge: true, valid: true };
    }, { found_smudge: false, valid: true });
    if (valid && found_smudge) return simm_idx;
  }
  return null;
};

const answer_b = blocks
  .map(block => {
    const rows = rowsFromBlock(block);
    const horizontal_simmetry_index = findSimmetryIndexSmudged(rows);
    if (horizontal_simmetry_index) return 100*horizontal_simmetry_index;
    const cols = colsFromBlock(block);
    const vertical_simmetry_index = findSimmetryIndexSmudged(cols);
    return vertical_simmetry_index;
  })
  .reduce((a, b) => a + b, 0);
console.log('Answer B:', answer_b);
