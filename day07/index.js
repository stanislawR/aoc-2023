const fs = require('fs');

const jockerRule = true;

const cardsPower = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'J',
  'Q',
  'K',
  'A',
];

const cardsPowerJocker = [
  'J',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'Q',
  'K',
  'A',
];

function getHandType(hand) {
  const occurrences = new Map();

  for (let i = 0; i < hand.length; i++) {
    const char = hand[i];
    if (occurrences.has(char)) {
      occurrences.set(char, occurrences.get(char) + 1);
    } else {
      occurrences.set(char, 1);
    }
  }

  let jockers = 0;

  if (jockerRule) {
    jockers = occurrences.get('J') || 0;
    occurrences.delete('J');
  }

  const values = Array.from(occurrences.values()).sort((a, b) => b - a);
  values[0] = (values[0] || 0) + jockers;

  if (values[0] === 5) {
    return 7;
  }

  if (values[0] === 4) {
    return 6;
  }

  if (values[0] === 3) {
    if (values[1] === 2) {
      return 5;
    }
    return 4;
  }

  if (values[0] === 2) {
    if (values[1] === 2) {
      return 3;
    }
    return 2;
  }

  return 1;
}

function readHands(data) {
  return data.map((line) => {
    const hand = line.split(' ');
    return { cards: hand[0], bid: hand[1], type: getHandType(hand[0]) };
  });
}

function cardPower(card) {
  return (jockerRule ? cardsPowerJocker : cardsPower).findIndex(
    (val) => val === card
  );
}

function sortHands(hand1, hand2) {
  if (hand1.type > hand2.type) {
    return 1;
  }
  if (hand1.type < hand2.type) {
    return -1;
  }

  for (let i = 0; i < hand1.cards.length; i++) {
    if (hand1.cards[i] === hand2.cards[i]) {
      continue;
    }

    return cardPower(hand1.cards[i]) - cardPower(hand2.cards[i]);
  }

  return 0;
}

function part1(hands) {
  return hands
    .sort(sortHands)
    .reduce((winnings, { bid }, rank) => (winnings += bid * (rank + 1)), 0);
}

function process(data) {
  const hands = readHands(data);
  console.log('--- Day 7: Camel Cards ---');
  console.log(part1(hands));
}

fs.readFile('day07/input.txt', 'utf8', (_, data) => {
  process(data.split('\r\n'));
});
