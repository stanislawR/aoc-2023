const fs = require('fs');

const CARD_TEMPLATE = /Card (.+): (.*) \| (.*)/;

function getCommonPart(arrayA, arrayB) {
  return arrayA.filter((element) => arrayB.includes(element));
}

function calculateCardPoints(commonElements) {
  return commonElements ? Math.pow(2, commonElements - 1) : 0;
}

function readCard(card) {
  const matchResult = card.match(CARD_TEMPLATE);
  return {
    winnings: matchResult[2].split(' ').filter((num) => num !== ''),
    owned: matchResult[3].split(' ').filter((num) => num !== ''),
  };
}

function getPointsOfCard(card) {
  const cardNumbers = readCard(card);
  return calculateCardPoints(
    getCommonPart(cardNumbers.winnings, cardNumbers.owned).length
  );
}

function part1(data) {
  return data
    .map((card) => getPointsOfCard(card))
    .reduce((sum, points) => sum + points, 0);
}

function getCommonsOfCard(card) {
  const cardNumbers = readCard(card);
  return getCommonPart(cardNumbers.winnings, cardNumbers.owned).length;
}

function part2(data) {
  const cards = data.map((card) => ({
    points: getCommonsOfCard(card),
    amount: 1,
  }));

  for (const [i, card] of cards.entries()) {
    for (let j = 1; j <= card.points; j++) {
      cards[i + j].amount += card.amount;
    }
  }

  return cards
    .map(({ amount }) => amount)
    .reduce((sum, amount) => sum + amount, 0);
}

function process(data) {
  console.log('--- Day 4: Scratchcards ---');
  console.log(part1(data));

  console.log('--- Part Two ---');
  console.log(part2(data));
}

fs.readFile('day04/input.txt', 'utf8', (_, data) => {
  process(data.split('\r\n'));
});
