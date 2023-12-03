const fs = require('fs');

const symbols = ['@', '#', '$', '%', '&', '*', '+', '-', '=', '/'];

function getNumbers(data) {
  const numbers = [];
  for (let i = 0; i < data.length; i++) {
    const newNumbers = [...data[i].matchAll(/(\d+)/g)].map((n) => ({
      value: +n[0],
      x: n.index,
      y: i,
      length: n[0].length,
    }));
    numbers.push(...newNumbers);
  }
  return numbers;
}

function getPartNumbers(numbers, data) {
  const rows = data.length;
  const cols = data[0].length;

  return numbers.filter((number) => {
    for (let y = number.y - 1; y <= number.y + 1; y++) {
      if (y < 0 || y === rows) {
        continue;
      }

      for (let x = number.x - 1; x <= number.x + number.length; x++) {
        if (x < 0 || x === cols) {
          continue;
        }

        if (symbols.includes(data[y][x])) {
          return true;
        }
      }
    }
    return false;
  });
}

function part1(data) {
  const numbers = getNumbers(data);
  return getPartNumbers(numbers, data).reduce(
    (sum, number) => (sum += number.value),
    0
  );
}

function getGearRatio(gears, partNumbers) {
  return gears
    .map(({ x, y }) =>
      partNumbers
        .filter(
          (number) =>
            [y - 1, y, y + 1].includes(number.y) &&
            Array.from(
              { length: number.length + 2 },
              (value, index) => number.x + index - 1
            ).includes(x)
        )
        .map(({ value }) => value)
    )
    .filter(({ length }) => length === 2)
    .map(([a, b]) => a * b)
    .reduce((sum, value) => (sum += value));
}

function part2(data) {
  const gears = [];
  for (let y = 0; y < data.length; y++) {
    [...data[y].matchAll(/\*/g)]
      .map(({ index }) => index)
      .forEach((x) => gears.push({ y, x }));
  }

  const partNumbers = getPartNumbers(getNumbers(data), data);

  return getGearRatio(gears, partNumbers);
}

function process(data) {
  console.log('--- Day 3: Gear Ratios ---');
  console.log(part1(data));

  console.log('--- Part Two ---');
  console.log(part2(data));
}

fs.readFile('day03/input.txt', 'utf8', (_, data) => {
  process(data.split('\r\n'));
});
