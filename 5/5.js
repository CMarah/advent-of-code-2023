const test_input = `
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`.trim();
const input = require('fs').readFileSync('5/input', 'utf8').trim();

const seeds = input.split('\n')[0].split(' ').map(Number).filter(f => f);
const almanac = input.split('\n')
  .slice(1)
  .filter(line => line)
  .reduce((acc, line) => {
    const has_numbers = line.match(/\d+/g);
    if (!has_numbers) {
      return {
        ...acc,
        categories: [...acc.categories, []],
      };
    }
    const new_numbers = line.split(' ').map(Number);
    return {
      ...acc,
      categories: [
        ...acc.categories.slice(0, -1),
        [...acc.categories.at(-1), new_numbers],
      ],
    };
  }, { seeds, categories: [] });

// Part A
const answer_1 = almanac.seeds
  .map(seed => almanac.categories.reduce((number, category) => {
    for (const range of category) {
      const [a, b, c] = range;
      if (b <= number && (b + c) >= number) {
        // Is in range
        return a + (number - b);
      }
    }
    return number;
  }, seed))
  .reduce((min_soil, soil) => (!min_soil || soil < min_soil) ? soil : min_soil, 0); 
console.log('Part A:', answer_1);

// Part B
const initial_seed_ranges = almanac.seeds.reduce((ranges, seed, i) => {
  if (i%2 === 0) {
    return [...ranges, [seed]];
  }
  const last_range = ranges.at(-1);
  return [
    ...ranges.slice(0, -1),
    [last_range[0], last_range[0] + seed - 1],
  ];
}, []);

const runSeedRangeThroughCatRange = (seed_range, cat_range) => {
  const sr_left = seed_range[0];
  const sr_right = seed_range[1];
  const cr_left = cat_range[1];
  const cr_right = cat_range[1] + cat_range[2];
  // Disjoint
  if (sr_left > cr_right) return { remaining_ranges: [seed_range] };
  if (sr_right < cr_left) return { remaining_ranges: [seed_range] };
  // Seed range inside
  if (cr_left <= sr_left && sr_right <= cr_right) {
    return {
      remaining_ranges: [],
      new_seed_ranges: [[
        cat_range[0] + (sr_left - cr_left),
        cat_range[0] + (sr_right - cr_left),
      ]],
    };
  }
  // Cat range inside
  if (sr_left <= cr_left && cr_right <= sr_right) {
    return {
      remaining_ranges: [
        [ sr_left, cr_left - 1 ],
        [ cr_right + 1, sr_right ],
      ],
      new_seed_ranges: [[ cat_range[0], cat_range[0] + cat_range[2] - 1 ]],
    };
  }
  // Overlap, seed to the left
  if (sr_left <= cr_left) {
    return {
      remaining_ranges: [[ sr_left, cr_left - 1 ]],
      new_seed_ranges: [[ cat_range[0], cat_range[0] + (sr_right - cr_left) ]],
    };
  }
  // Overlap, seed to the right
  return {
    remaining_ranges: [[ cr_right + 1, sr_right ]],
    new_seed_ranges: [[ sr_left - (cr_left - cat_range[0]) , cat_range[0] + cat_range[2] ]],
  };
};

const runSeedRangesThroughCategory = (seed_ranges, category) =>
  category.reduce((acc, cat_range) => {
    const processed_ranges = acc.remaining_ranges
      .map(sr => runSeedRangeThroughCatRange(sr, cat_range));
    const remaining_ranges = processed_ranges
      .map(pr => pr.remaining_ranges || []).flat();
    const new_seed_ranges = processed_ranges
      .map(pr => pr.new_seed_ranges || []).flat();
    return {
      remaining_ranges,
      new_seed_ranges: [...acc.new_seed_ranges, ...new_seed_ranges],
    };
  }, {
    remaining_ranges: seed_ranges,
    new_seed_ranges: [],
  });

const final_ranges = almanac.categories.reduce((seed_ranges, category) => {
  const result = runSeedRangesThroughCategory(seed_ranges, category);
  return [...result.remaining_ranges, ...result.new_seed_ranges];
}, initial_seed_ranges);
const answer_2 = final_ranges.reduce(
  (acc, range) => !acc || range[0] < acc ? range[0] : acc, 0
);
console.log('Part B:', answer_2);
