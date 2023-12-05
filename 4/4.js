const test_input = `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`.trim();
const input = require('fs').readFileSync('4/input', 'utf8').trim();

const parsed_input = input.split('\n')
  .map(line => ({
    winning_numbers: line.split(' | ')[0].split(' ').map(Number).filter(f => f),
    numbers: line.split(' | ')[1].split(' ').map(Number),
  }));

// Part A
const answer_1 = parsed_input
  .map(({ winning_numbers, numbers }) => numbers.reduce((score, n) => {
    if (!winning_numbers.includes(n)) return score;
    return score ? score*2 : 1;
  }, 0))
  .reduce((a, b) => a + b, 0);
console.log('Part A:', answer_1);

// Part B
const initial_cards = (new Array(parsed_input.length)).fill(1);

const answer_2 = parsed_input
  .reduce((cards, card, i) => {
    const amount_card = cards[i];
    if (!amount_card) return cards;
    const { winning_numbers, numbers } = card;
    const num_winning = numbers.filter(n => winning_numbers.includes(n)).length;
    return [
      ...cards.slice(0, i+1),
      ...cards.slice(i+1, i+1+num_winning).map(n => n + amount_card),
      ...cards.slice(i+1+num_winning),
    ];
  }, initial_cards)
  .reduce((acc, amount_card) => acc +  amount_card, 0);
console.log('Part B:', answer_2);
