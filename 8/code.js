const test_input = `
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
`.trim();
const input = require('fs').readFileSync('8/input', 'utf8').trim();

const instructions = input.split('\n')[0];
const network = input.split('\n').slice(1)
  .map(line => line.split(' = '))
  .filter(l => l.length === 2)
  .reduce((acc, [node, connected_nodes]) => ({
    ...acc,
    [node]: connected_nodes.split(', ').map(n => n.replace(/[\(\)]/g, '')),
  }), {});

// Part A
const getPathLength = (initial_node, condition) => {
  let path_length = 0;
  let node = initial_node;
  while (!condition(node)) {
    const move = instructions[path_length % instructions.length];
    node = network[node][move === 'L' ? 0 : 1];
    ++path_length;
  }
  return path_length;
};
const answer_a = getPathLength('AAA', node => node === 'ZZZ');
console.log('Part A', answer_a);

// Part before(async () => {
const b_nodes = Object.keys(network).filter(n => n[2] === 'A');
const path_lengths = b_nodes.map(n => getPathLength(n, node => node[2] === 'Z'));

const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
const lcm = (a, b) => a * b / gcd(a, b);
const answer_b = path_lengths.reduce(lcm, 1);
console.log('Part B', answer_b);
