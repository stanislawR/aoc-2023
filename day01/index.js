const fs = require('fs');
const readline = require('readline');

const digitsMap = new Map([
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9],
]);

const revertedDigitsMap = new Map([
  ['eno', 1],
  ['owt', 2],
  ['eerht', 3],
  ['ruof', 4],
  ['evif', 5],
  ['xis', 6],
  ['neves', 7],
  ['thgie', 8],
  ['enin', 9],
]);

async function getData() {
  const fileStream = fs.createReadStream('day01/input.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const values = [];
  for await (const line of rl) {
    values.push(line);
  }

  return values;
}

function getCalibrationValue(value) {
  return +(value[0] + value[value.length - 1]);
}

function spliceString(str, index, add) {
  var ar = str.split('');
  ar.splice(index, 0, add);
  return ar.join('');
}

function reverseString(str) {
  return str.split('').reverse().join('');
}

function fixValue(value) {
  let res = value;
  let retardedDigit = res.match(/one|two|three|four|five|six|seven|eight|nine/);
  if (retardedDigit) {
    res = spliceString(
      res,
      retardedDigit.index,
      digitsMap.get(retardedDigit['0'])
    );
  }

  res = reverseString(res);
  retardedDigit = res.match(/eno|owt|eerht|ruof|evif|xis|neves|thgie|enin/);
  if (retardedDigit) {
    res = spliceString(
      res,
      retardedDigit.index,
      revertedDigitsMap.get(retardedDigit['0'])
    );
  }

  return reverseString(res);
}

function part1(values) {
  return values.reduce(
    (sum, value) => (sum += getCalibrationValue(value.replace(/\D+/g, ''))),
    0
  );
}

function part2(values) {
  const fixedValues = values.map((value) => fixValue(value));
  return part1(fixedValues);
}

async function process() {
  const values = await getData();

  console.log('--- Day 1: Trebuchet?! ---');
  console.log(part1(values));

  console.log('--- Part Two ---');
  console.log(part2(values));
}

process();
