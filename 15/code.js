const test_input = `
rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7
`.trim();
const input = require('fs').readFileSync('15/input', 'utf8').trim();

const commands = input.split(',').map(c => c.trim());

const hash = str => str.split('').reduce((h, c) => ((h + c.charCodeAt(0))*17)%256, 0);

// Part A
const answer_a = commands.map(hash).reduce((a, b) => a + b, 0);
console.log("Answer A:", answer_a);

// Part B
const final_state = commands.reduce((state, command) => {
  const label = command.match(/([a-z]+)/)[1];
  const num = command.match(/([0-9]+)/)?.[1];
  const hashed = hash(label);
  if (num) {
    // Add lens
    const existing = state[hashed]?.find(lens => lens[0] === label);
    if (existing) {
      const index = state[hashed].indexOf(existing);
      state[hashed][index] = [label, parseInt(num)];
    } else {
      state[hashed] = [
        ...(state[hashed] || []),
        [label, parseInt(num)],
      ];
    }
  } else {
    state[hashed] = (state[hashed] || [])
      .filter(lens => lens[0] !== label);
  }
  return state;
}, {});

const answer_b = Object.entries(final_state)
  .map(([key, lenses]) => {
    const box_num = parseInt(key) + 1;
    const power = lenses.reduce((acc, [, num], pos) => acc + (num * (pos + 1)), 0);
    return box_num * power;
  })
  .reduce((a, b) => a + b, 0);
console.log("Answer B:", answer_b);
