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

function part1(data) {
  const seeds = readSeeds(data[0]);
  data.splice(0, 2);
  resolveSeeds(seeds, data);

  return seeds.map(({ location }) => location).sort((a, b) => a - b)[0];
}

function readRanges(line) {
  return line
    .split(': ')[1]
    .split(' ')
    .reduce((ranges, value, index, array) => {
      if (index % 2 === 0) {
        ranges.push({
          from: +array[index],
          to: +array[index] + +array[index + 1] - 1,
        });
      }
      return ranges;
    }, []);
}

function resolveMapPart2(ranges, mapData) {
  mapData.shift();

  ranges.forEach((range) => {
    range.changed = false;
  });

  mapData
    .filter((line) => line != '')
    .forEach((md) => {
      const description = md.split(' '); // [0] destination range start, [1] source range start, [2] range length
      const ds = +description[0];
      const ss = +description[1];
      const sf = ss + +description[2] - 1;

      for (let i = 0; i < ranges.length; i++) {
        const { from, to, changed } = ranges[i];

        if (changed) {
          continue;
        }

        const union = { from: Math.max(from, ss), to: Math.min(to, sf) };

        if (union.from > union.to) {
          continue;
        }

        if (from !== union.from) {
          ranges.push({ from, to: union.from - 1 });
        }

        if (to !== union.to) {
          ranges.push({ from: union.to + 1, to });
        }

        ranges[i] = {
          from: union.from - ss + ds,
          to: union.to - ss + ds,
          changed: true,
        };
      }
      return;
    });
}

function part2(data) {
  const ranges = readRanges(data[0]);
  data.splice(0, 2);

  while (data.length) {
    const mapSize = data.findIndex((line) => line === '');
    resolveMapPart2(
      ranges,
      data.splice(0, mapSize !== -1 ? mapSize + 1 : data.length)
    );
  }

  return ranges.map(({ from }) => from).sort((a, b) => a - b)[0];
}

function process(data) {
  console.log('--- Day 5: If You Give A Seed A Fertilizer ---');
  console.log(part1([...data]));

  console.log('--- Part Two ---');
  console.log(part2([...data]));
}

fs.readFile('day05/input.txt', 'utf8', (_, data) => {
  process(data.split('\r\n'));
});
