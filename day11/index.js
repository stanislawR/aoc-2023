const fs = require('fs');

function expandUniverse(data) {
  const universe = [...data].map((line) => line.split(''));

  for (let i = 0; i < universe.length; i++) {
    if (!universe[i].includes('#')) {
      universe.splice(i, 0, [...universe[i]]);
      i += 1;
    }
  }

  for (let i = 0; i < universe[0].length; i++) {
    let expand = true;
    for (let j = 0; j < universe.length; j++) {
      if (universe[j][i] === '#') {
        expand = false;
        break;
      }
    }
    if (!expand) {
      continue;
    }

    for (let j = 0; j < universe.length; j++) {
      universe[j].splice(i, 0, '.');
    }
    i += 1;
  }

  return universe;
}

function findGalaxies(universe) {
  const galaxies = [];

  for (let y = 0; y < universe.length; y++) {
    for (let x = 0; x < universe[0].length; x++) {
      if (universe[y][x] === '#') {
        galaxies.push([y, x]);
      }
    }
  }

  return galaxies;
}

function calculateSteps(galaxies) {
  const steps = [];

  for (let i = 0; i < galaxies.length; i++) {
    const y1 = galaxies[i][0];
    const x1 = galaxies[i][1];
    for (let j = i + 1; j < galaxies.length; j++) {
      const y2 = galaxies[j][0];
      const x2 = galaxies[j][1];

      steps.push(Math.abs(x1 - x2) + Math.abs(y1 - y2));
    }
  }

  return steps;
}

function part1(universe) {
  const galaxies = findGalaxies(universe);

  const steps = calculateSteps(galaxies);

  return steps.reduce((sum, value) => (sum += value), 0);
}

function process(data) {
  const universe = expandUniverse(data);

  console.log('--- Day 11: Cosmic Expansion ---');
  console.log(part1(universe));
}

fs.readFile('day11/input.txt', 'utf8', (_, data) => {
  process(data.split('\r\n'));
});
