const test_input = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`.trim();
const input = require('fs').readFileSync('12/input', 'utf8').trim();

const raw_records = input.split('\n').map(line => line.split(' '))
  .map(([pattern, counts]) => ({ pattern, counts: counts.split(',').map(Number) }));

const factorial = n => {
  if (n === 0) return 1;
  return n * factorial(n - 1);
};

let db = {};
const countValidChildrenBlock = ({ pattern, counts }) => {
  if (!pattern) return counts.length === 0 ? 1 : 0;
  const key = `${pattern}-${counts.join(',')}`;
  if (db[key]) return db[key];

  const end_early_result = (() => {
    const hashtag_count = pattern.split('#').length - 1;
    const q_count = pattern.length - hashtag_count;
    const count_sum = counts.reduce((a, c) => a + c, 0);

    if (hashtag_count > count_sum) return 0;
    if (pattern.length < (count_sum + counts.length - 1)) return 0;
    if ((q_count + 1) < counts.length) return 0;

    return null;
  })();
  if (end_early_result !== null) {
    db[key] = end_early_result;
    return end_early_result;
  }

  // Base cases
  if (!counts.length) {
    return pattern.includes('#') ? 0 : 1;
  }

  if (!pattern.includes('#')) {
    // All ?s
    const s = pattern.length - counts.reduce((a, c) => a + c, 0) - counts.length + 1;
    return factorial(s + counts.length) / (factorial(s) * factorial(counts.length));
  }

  // Consider case of ? being a dot
  const count_if_dot = pattern[0] === '#' ? 0 :
    countValidChildrenBlock({ pattern: pattern.slice(1), counts });
  // Treat hashtag
  const next_count = counts[0];
  const count_if_hashtag = (() => {
    const following_char = pattern[next_count];
    if (following_char === '#') return 0;
    return countValidChildrenBlock({
      pattern: pattern.slice(next_count + 1),
      counts: counts.slice(1),
    });
  })();

  const res = count_if_dot + count_if_hashtag;
  db[key] = res;
  return res;
};

let db2 = {};
const countValidChildrenNewMajor = ({ pattern, counts }) => {
  const key = `${pattern}-${counts.join(',')}`;
  if (db2[key]) return db2[key];

  if (!pattern) return counts.length === 0 ? 1 : 0;
  if (!counts.length) {
    return pattern.includes('#') ? 0 : 1;
  };

  const blocks = pattern.split('.').filter(x => x);
  const first_block = blocks[0] || '';
  if (blocks.length === 1) {
    const res = countValidChildrenBlock({ pattern: first_block, counts });
    db2[key] = res;
    return res;
  }

  // For the block, get num options for each subcount
  let opts_for_subcounts = [];
  let remaining_counts = [];
  const opts_if_all_dots = first_block.includes('#') ? 0 :
    countValidChildrenNewMajor({
      pattern: blocks.slice(1).join('.'),
      counts,
    });
  for (let k = 1; k <= counts.length; k++) {
    const subcounts = counts.slice(0, k);
    const sb_sum = subcounts.reduce((a, c) => a + c, 0);
    if ((sb_sum + k - 1) <= first_block.length) {
      const num_opts = countValidChildrenBlock({
        pattern: first_block,
        counts: subcounts,
      });
      opts_for_subcounts.push(num_opts);
      remaining_counts.push(counts.slice(k));
    }
  }

  const res = remaining_counts
    .map((cts, i) => {
      const opts = opts_for_subcounts[i];
      if (!opts) return 0;
      if (blocks.length === 1 && counts.length === (i+1)) return opts;
      return opts * countValidChildrenNewMajor({
        pattern: blocks.slice(1).join('.'),
        counts: cts,
      });
    })
    .reduce((a, o) => a + o, opts_if_all_dots);
  db2[key] = res;
  return res;
};

// Part A
const answer_a = raw_records
  .map(countValidChildrenNewMajor)
  .reduce((a, b) => a + b, 0);
console.log('Answer A:', answer_a);

// Part B
const b_records = raw_records.map(({ pattern, counts }) => ({
  pattern: `${pattern}?${pattern}?${pattern}?${pattern}?${pattern}`,
  counts: [...counts, ...counts, ...counts, ...counts, ...counts],
}));

const answer_b = b_records
  .map(c => countValidChildrenNewMajor(c))
  .reduce((a, b) => a + b, 0);
console.log('Answer B:', answer_b);
