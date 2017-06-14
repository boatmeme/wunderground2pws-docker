'use strict';
const toNumber = require('lodash.tonumber');

const ABSOLUTE_ZERO = -459.67;
const PLANCK_TEMPERATURE = 2.55e+32;

const isNumber = num =>
  num !== undefined &&
  num !== null &&
  num !== '' &&
  !isNaN(num);

const filter = ( num, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER ) => {
  if (!isNumber(num)) return;
  const n = toNumber(num);
  return n >= min && n <= max ? num : undefined;
};
const clamp = ( num, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER ) => (isNumber(num) ? Math.min(Math.max(toNumber(num), min), max) : undefined);
const natural = num => filter( num, 0 );
const fahrenheit = num => filter( num, ABSOLUTE_ZERO, PLANCK_TEMPERATURE );
const angle = num => filter( num, 0, 360 );
const percent = num => filter( num, 0, 100 );

module.exports = {
  filter,
  clamp,
  natural,
  fahrenheit,
  angle,
  percent
}
