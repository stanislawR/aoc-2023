const fs = require('fs');

const MAX_R = 12;
const MAX_G = 13;
const MAX_B = 14;

const GAME_TEMPLATE = /Game (\d+): (.*)/;
const R_TEMPLATE = /(\d+) red/;
const G_TEMPLATE = /(\d+) green/;
const B_TEMPLATE = /(\d+) blue/;

function isGamePossible(gameSet) {
  return !gameSet.some((set) => {
    const r = +(set.match(R_TEMPLATE)?.at(1) || 0);
    const g = +(set.match(G_TEMPLATE)?.at(1) || 0);
    const b = +(set.match(B_TEMPLATE)?.at(1) || 0);

    if (r > MAX_R || g > MAX_G || b > MAX_B) {
      return true;
    }
    return false;
  });
}

function part1(data) {
  return data.reduce((sum, game) => {
    const gameId = +game.match(GAME_TEMPLATE)[1];
    const gameSet = game.match(GAME_TEMPLATE)[2].split(';');

    return (sum += isGamePossible(gameSet) ? gameId : 0);
  }, 0);
}

function gamePower(gameSet) {
  const maxR = Math.max(
    ...gameSet.map((set) => +(set.match(R_TEMPLATE)?.at(1) || 0))
  );
  const maxG = Math.max(
    ...gameSet.map((set) => +(set.match(G_TEMPLATE)?.at(1) || 0))
  );
  const maxB = Math.max(
    ...gameSet.map((set) => +(set.match(B_TEMPLATE)?.at(1) || 0))
  );

  return maxR * maxG * maxB;
}

function part2(data) {
  return data.reduce((sum, game) => {
    const gameSet = game.match(GAME_TEMPLATE)[2].split(';');

    return (sum += gamePower(gameSet));
  }, 0);
}

function process(data) {
  console.log('--- Day 2: Cube Conundrum ---');
  console.log(part1(data));

  console.log('--- Part Two ---');
  console.log(part2(data));
}

fs.readFile('day02/input.txt', 'utf8', (_, data) => {
  process(data.split('\r\n'));
});
