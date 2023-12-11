const fs = require('fs');

const START = 'S';

const ALLOWED_MOVES = new Map([
  ['|', ['UP', 'DOWN']],
  ['-', ['RIGHT', 'LEFT']],
  ['F', ['DOWN', 'RIGHT']],
  ['7', ['DOWN', 'LEFT']],
  ['J', ['UP', 'LEFT']],
  ['L', ['UP', 'RIGHT']],
]);

const OPPOSIT_MOVES = new Map([
  ['DOWN', 'UP'],
  ['UP', 'DOWN'],
  ['RIGHT', 'LEFT'],
  ['LEFT', 'RIGHT'],
]);

const SONAR = new Map([
  ['DOWN', (y, x) => [y, x + 1]],
  ['UP', (y, x) => [y, x - 1]],
  ['RIGHT', (y, x) => [y - 1, x]],
  ['LEFT', (y, x) => [y + 1, x]],
]);

function findStart(data) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].includes(START)) {
      return [i, data[i].split('').findIndex((pos) => pos === 'S')];
    }
  }
}

function getNextPosition(move, y, x) {
  if (move === 'RIGHT') {
    return [y, x + 1];
  }
  if (move === 'LEFT') {
    return [y, x - 1];
  }
  if (move === 'UP') {
    return [y - 1, x];
  }
  if (move === 'DOWN') {
    return [y + 1, x];
  }
}

function part1(data) {
  const positions = [];
  const startPosition = findStart(data);
  const map = data.map((line) => line.split(''));
  positions.push([...startPosition, 'RIGHT']);

  let currY = startPosition[0];
  let currX = startPosition[1] + 1;
  let lastMoveOpposite = 'LEFT';

  while (true) {
    const currentPipe = map[currY][currX];
    if (currentPipe === START) {
      break;
    }

    const nextMove = ALLOWED_MOVES.get(currentPipe).filter(
      (move) => move !== lastMoveOpposite
    )[0];

    positions.push([currY, currX, nextMove]);

    const nextPosition = getNextPosition(nextMove, currY, currX);
    currY = nextPosition[0];
    currX = nextPosition[1];
    lastMoveOpposite = OPPOSIT_MOVES.get(nextMove);
  }

  return positions;
}

function displayMap(map) {
  map.forEach((line) => console.log(line.join('')));
}

function createPipeMap(positions, data) {
  const sonarMap = [];
  for (let i = 0; i < data.length; i++) {
    sonarMap.push(new Array(data[0].length).fill('.'));
  }

  positions.forEach(([y, x]) => {
    sonarMap[y][x] = 'X';
  });

  return sonarMap;
}

function sonarDirection(initY, initX, dir, map) {
  let y = initY,
    x = initX;

  while (true) {
    const sonarPos = SONAR.get(dir)(y, x);
    y = sonarPos[0];
    x = sonarPos[1];

    if (
      x < 0 ||
      y < 0 ||
      x >= map[0].length ||
      y >= map.length ||
      map[y][x] === 'X'
    ) {
      break;
    }

    map[y][x] = '-';
  }
}

function sonar(positions, map) {
  positions
    .map(([y, x, move], index) => [
      y,
      x,
      move,
      positions[index - 1 > 0 ? index - 1 : positions.length - 1][2],
    ])
    .forEach(([posY, posX, dir1, dir2]) => {
      map[posY][posX] = 'O';
      sonarDirection(posY, posX, dir1, map);
      if (dir1 !== dir2) {
        sonarDirection(posY, posX, dir2, map);
      }
      map[posY][posX] = 'X';
    });
}

function part2(positions, data) {
  const sonarMap = createPipeMap(positions, data);
  sonar(positions, sonarMap);
  displayMap(sonarMap);

  return [].concat(...sonarMap).filter((value) => value === '-').length;
}

function process(data) {
  const positions = part1(data);
  console.log('--- Day 10: Pipe Maze ---');
  console.log(positions.length / 2);

  console.log('--- Part Two ---');
  console.log(part2(positions, data));
}

fs.readFile('day10/input.txt', 'utf8', (_, data) => {
  process(data.split('\r\n'));
});
