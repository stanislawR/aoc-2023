const fs = require('fs');

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
  const values = Array.from(occurrences.values());
  let highest = values.sort((a, b) => b - a)[0];

  if (highest > 3) {
    return highest + 2;
  }

  if (highest === 3) {
    if (values.includes(2)) {
      return 5;
    }
    return 4;
  }

  if (
    highest === 2 &&
    values.reduce((occur, value) => (occur += value === 2 ? 1 : 0), 0) > 1
  ) {
    return 3;
  }

  return highest;
}

function readHands(data) {
  return data.map((line) => {
    const hand = line.split(' ');
    return { cards: hand[0], bid: hand[1], type: getHandType(hand[0]) };
  });
}

function cardPower(card) {
  return cardsPower.findIndex((val) => val === card);
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

  console.log('--- Part Two ---');
}

fs.readFile('day07/input.txt', 'utf8', (_, data) => {
  process(data.split('\r\n'));
});
