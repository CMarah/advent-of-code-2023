const test_input = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`.trim();
const input = require('fs').readFileSync('7/input', 'utf8').trim();

const hands = input.split('\n').map(line => line.split(' '))
  .map(([hand, bid]) => ({ hand, bid: Number(bid) }));

const getHandType = card_counts => {
  if (Object.keys(card_counts).length === 1) {
    // All same
    return 7;
  }
  if (Object.keys(card_counts).length === 2) {
    // 4 of a kind or full house
    if (Object.values(card_counts).some(count => count === 4)) {
      return 6;
    }
    return 5;
  }
  if (Object.keys(card_counts).length === 3) {
    // 3 of a kind or 2 pair
    if (Object.values(card_counts).some(count => count === 3)) {
      return 4;
    }
    return 3;
  }
  if (Object.keys(card_counts).length === 4) {
    return 2;
  }
  return 1;
};

const card_types_a = '23456789TJQKA';
const card_types_b = 'J23456789TQKA';
const cardScore = (card, section) => section === 'b' ?
  card_types_b.indexOf(card) :
  card_types_a.indexOf(card);

const compareHands = (hand_a, hand_b, section) => {
  const score_hand_a = section === 'b' ? getHandTypeB(hand_a) : getHandTypeA(hand_a);
  const score_hand_b = section === 'b' ? getHandTypeB(hand_b) : getHandTypeA(hand_b);
  if (score_hand_a !== score_hand_b) {
    return score_hand_a - score_hand_b;
  }
  const cards_a = hand_a.split('');
  const cards_b = hand_b.split('');
  return cardScore(cards_a[0], section) - cardScore(cards_b[0], section) ||
    cardScore(cards_a[1], section) - cardScore(cards_b[1], section) ||
    cardScore(cards_a[2], section) - cardScore(cards_b[2], section) ||
    cardScore(cards_a[3], section) - cardScore(cards_b[3], section) ||
    cardScore(cards_a[4], section) - cardScore(cards_b[4], section);
};

// Part A
const getHandTypeA = hand => {
  const cards = hand.split('');
  const card_counts = cards.reduce((counts, card) => {
    counts[card] = (counts[card] || 0) + 1;
    return counts;
  }, {});
  return getHandType(card_counts);
};

const hands_sorted = hands.sort((hand_a, hand_b) => compareHands(hand_a.hand, hand_b.hand));

const answer_a = hands_sorted.reduce((sum, { bid }, i) => sum + (i+1)*bid, 0);
console.log('Part A', answer_a);

// Part B
const getHandTypeB = hand => {
  if (hand === 'JJJJJ') return 7;
  const cards = hand.split('');
  const card_counts = cards.reduce((counts, card) => {
    counts[card] = (counts[card] || 0) + 1;
    return counts;
  }, {});
  const num_jokers = card_counts['J'] || 0;
  const sorted_car_counts = Object.entries(card_counts)
    .sort((a, b) => b[1] - a[1])
    .filter(([card]) => card !== 'J');
  const new_card_counts = Object.fromEntries([
    [sorted_car_counts[0][0], sorted_car_counts[0][1] + num_jokers],
    ...sorted_car_counts.slice(1),
  ]);
  return getHandType(new_card_counts);
};

const hands_sorted_b = hands.sort((hand_a, hand_b) => compareHands(hand_a.hand, hand_b.hand, 'b'));

const answer_b = hands_sorted_b.reduce((sum, { bid }, i) => sum + (i+1)*bid, 0);
console.log('Part B', answer_b);
