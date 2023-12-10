const fs = require('fs');

function readSeeds(line) {
  return line
    .split(': ')[1]
    .split(' ')
    .map((seed) => ({ seed: +seed }));
}

function resolveMap(seeds, mapData) {
  const mapInfo = mapData.shift().split(' ')[0].split('-');
  const from = mapInfo[0];
  const to = mapInfo[2];

  mapData
    .filter((line) => line != '')
    .forEach((md) => {
      const description = md.split(' '); // [0] destination range start, [1] source range start, [2] range length
      const ds = +description[0];
      const ss = +description[1];
      const r = +description[2];

      seeds
        .filter((seed) => seed[from] >= ss && seed[from] < ss + r)
        .forEach((seed) => {
          seed[to] = ds + (seed[from] - ss);
        });
      return;
    });

  seeds
    .filter((seed) => !seed[to])
    .forEach((seed) => {
      seed[to] = seed[from];
    });

  return;
}

function resolveSeeds(seeds, data) {
  while (data.length) {
    const mapSize = data.findIndex((line) => line === '');
    resolveMap(
      seeds,
      data.splice(0, mapSize !== -1 ? mapSize + 1 : data.length)
    );
  }
}

function part1(seeds) {
  return seeds.map(({ location }) => location).sort((a, b) => a - b)[0];
}

function part2(data) {}

function process(data) {
  const seeds = readSeeds(data[0]);
  data.splice(0, 2);
  resolveSeeds(seeds, data);

  console.log('--- Day 5: If You Give A Seed A Fertilizer ---');
  console.log(part1(seeds));

  console.log('--- Part Two ---');
  console.log(part2(data));
}

fs.readFile('day05/input.txt', 'utf8', (_, data) => {
  process(data.split('\r\n'));
});
