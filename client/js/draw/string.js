/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var { context } = require('../utils');


var width = 3;

var letters = {
  a: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  c: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  e: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  h: [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  o: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  r: [
    [1, 1, 0],
    [1, 0, 1],
    [1, 1, 0],
    [1, 0, 1],
    [1, 0, 1],
  ],
  s: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  t: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  '?': [
    [1, 1, 1],
    [0, 0, 1],
    [0, 1, 0],
    [0, 0, 0],
    [0, 1, 0],
  ],
};

function drawLetter(_x, _y, char, scale) {
  var pixels = letters[char];

  pixels.forEach((row, y) => {
    row.forEach((pixel, x) => {
      if (pixel) {
        context.rect(_x + x * scale, _y + y * scale, scale, scale);
      }
    });
  });
}

module.exports = function drawString(_x, _y, s, scale, color) {
  context.beginPath();
  for (var i = 0, ii = s.length; i < ii; i += 1) {
    drawLetter(_x + i * (width + 1) * scale, _y, s[i], scale);
  }
  context.fillStyle = color;
  context.fill();
};
