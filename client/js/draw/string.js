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
  s: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
};

function drawLetter(_x, _y, char) {
  var pixels = letters[char];

  pixels.forEach((row, y) => {
    row.forEach((pixel, x) => {
      if (pixel) {
        context.rect(_x + x * 2 + .5, _y + y * 2 + .5, 1, 1);
      }
    });
  });
}

module.exports = function drawString(_x, _y, s) {
  context.beginPath();
  for (var i = 0, ii = s.length; i < ii; i += 1) {
    drawLetter(_x + i * (width + 1) * 2, _y, s[i]);
  }
  context.strokeStyle = '#fff';
  context.stroke();
};
