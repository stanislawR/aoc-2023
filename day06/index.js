const fs = require('fs');

function readRaces(data) {
  const races = [];
  const regex = / +/g;
  const times = data[0].replaceAll(regex, ' ').split(': ')[1].split(' ');
  const distances = data[1].replaceAll(regex, ' ').split(': ')[1].split(' ');

  for (let i = 0; i < times.length; i++) {
    races.push({ time: +times[i], distance: +distances[i] });
  }
  return races;
}

function fixRaces(data) {
  const races = [];
  const times = data[0].replaceAll(' ', '').split(':')[1];
  const distances = data[1].replaceAll(' ', '').split(':')[1];

  races.push({ time: +times, distance: +distances });

  return races;
}

function part1(races) {
  return races
    .map(({ time, distance }) => {
      const deltaSqrt = Math.sqrt(time * time - 4 * (distance + 1));

      const min = Math.ceil((time - deltaSqrt) / 2);
      const max = Math.floor((time + deltaSqrt) / 2);

      return max - min + 1;
    })
    .reduce((res, value) => (res *= value), 1);
}

function process(data) {
  const races = readRaces(data);

  console.log('--- Day 6: Wait For It ---');
  console.log(part1(races));

  const fixedRaces = fixRaces(data);
  console.log('--- Part Two ---');
  console.log(part1(fixedRaces));
}

fs.readFile('day06/input.txt', 'utf8', (_, data) => {
  process(data.split('\r\n'));
});
