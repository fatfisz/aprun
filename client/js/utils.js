/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var assign = require('object-assign');


var letters = {
  a: [[1, 1, 1], [1, 0, 1], [1, 1, 1], [1, 0, 1], [1, 0, 1]],
  b: [[1, 1, 0], [1, 0, 1], [1, 1, 0], [1, 0, 1], [1, 1, 0]],
  c: [[1, 1, 1], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 1, 1]],
  d: [[1, 1, 0], [1, 0, 1], [1, 0, 1], [1, 0, 1], [1, 1, 0]],
  e: [[1, 1, 1], [1, 0, 0], [1, 1, 0], [1, 0, 0], [1, 1, 1]],
  f: [[1, 1, 1], [1, 0, 0], [1, 1, 0], [1, 0, 0], [1, 0, 0]],
  g: [[1, 1, 1], [1, 0, 0], [1, 0, 1], [1, 0, 1], [1, 1, 1]],
  h: [[1, 0, 1], [1, 0, 1], [1, 1, 1], [1, 0, 1], [1, 0, 1]],
  i: [[1], [1], [1], [1], [1]],
  j: [[1, 1, 1], [0, 0, 1], [0, 0, 1], [1, 0, 1], [0, 1, 1]],
  k: [[1, 0, 1], [1, 0, 1], [1, 1, 0], [1, 0, 1], [1, 0, 1]],
  l: [[1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 1, 1]],
  m: [[1, 0, 0, 0, 1], [1, 1, 0, 1, 1], [1, 0, 1, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1]],
  n: [[1, 0, 0, 1], [1, 1, 0, 1], [1, 0, 1, 1], [1, 0, 0, 1], [1, 0, 0, 1]],
  o: [[1, 1, 1], [1, 0, 1], [1, 0, 1], [1, 0, 1], [1, 1, 1]],
  p: [[1, 1, 1], [1, 0, 1], [1, 1, 1], [1, 0, 0], [1, 0, 0]],
  q: [[1, 1, 1, 0], [1, 0, 1, 0], [1, 0, 1, 0], [1, 0, 1, 0], [1, 1, 1, 1]],
  r: [[1, 1, 1], [1, 0, 1], [1, 1, 1], [1, 1, 0], [1, 0, 1]],
  s: [[1, 1, 1], [1, 0, 0], [1, 1, 1], [0, 0, 1], [1, 1, 1]],
  t: [[1, 1, 1], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0]],
  u: [[1, 0, 1], [1, 0, 1], [1, 0, 1], [1, 0, 1], [1, 1, 1]],
  v: [[1, 0, 1], [1, 0, 1], [1, 0, 1], [1, 0, 1], [0, 1, 0]],
  w: [[1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 1, 0, 1], [1, 0, 1, 0, 1], [1, 1, 1, 1, 1]],
  x: [[1, 0, 1], [1, 0, 1], [0, 1, 0], [1, 0, 1], [1, 0, 1]],
  y: [[1, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 0], [0, 1, 0]],
  z: [[1, 1, 1], [0, 0, 1], [0, 1, 0], [1, 0, 0], [1, 1, 1]],
  1: [[0, 0, 1], [0, 1, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
  2: [[1, 1, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0], [1, 1, 1]],
  3: [[1, 1, 0], [0, 0, 1], [0, 1, 0], [0, 0, 1], [1, 1, 0]],
  4: [[1, 0, 0], [1, 0, 0], [1, 0, 1], [1, 1, 1], [0, 0, 1]],
  5: [[1, 1, 1], [1, 0, 0], [1, 1, 0], [0, 0, 1], [1, 1, 0]],
  6: [[0, 1, 0], [1, 0, 0], [1, 1, 0], [1, 0, 1], [0, 1, 0]],
  7: [[1, 1, 1], [0, 0, 1], [0, 0, 1], [0, 1, 0], [0, 1, 0]],
  8: [[0, 1, 0], [1, 0, 1], [0, 1, 0], [1, 0, 1], [0, 1, 0]],
  9: [[0, 1, 0], [1, 0, 1], [0, 1, 1], [0, 0, 1], [0, 1, 0]],
  0: [[0, 1, 0], [1, 0, 1], [1, 0, 1], [1, 0, 1], [0, 1, 0]],
  ' ': [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
  '.': [[0], [0], [0], [0], [1]],
  ':': [[0], [1], [0], [1], [0]],
  '-': [[0, 0], [0, 0], [1, 1], [0, 0], [0, 0]],
  '?': [[1, 1, 1], [0, 0, 1], [0, 1, 0], [0, 0, 0], [0, 1, 0]],
  '%': [[1, 0, 1], [0, 0, 1], [0, 1, 0], [1, 0, 0], [1, 0, 1]],
};

function drawLetter(context, _x, _y, char, scale) {
  var pixels = letters[char];

  pixels.forEach((row, y) => {
    row.forEach((pixel, x) => {
      if (pixel) {
        context.rect(_x + x * scale, _y + y * scale, scale, scale);
      }
    });
  });
}

function measure(s, scale) {
  return [].reduce.call(s, (acc, char, i) => {
    return acc + letters[char][0].length + Math.min(i, 1);
  }, 0) * scale;
}

exports.$ = document.querySelectorAll.bind(document);
exports.root = exports.$('html')[0];
exports.context = exports.$('#game')[0].getContext('2d');

assign(Object.getPrototypeOf(exports.context), {

  roundedRect(x1, y1, x2, y2, radius) {
    var halfX = (x1 + x2) / 2;
    var halfY = (y1 + y2) / 2;

    this.beginPath();
    this.moveTo(x1, halfY);
    this.arcTo(x1, y1, halfX, y1, radius);
    this.arcTo(x2, y1, x2, halfY, radius);
    this.arcTo(x2, y2, halfX, y2, radius);
    this.arcTo(x1, y2, x1, halfY, radius);
    this.closePath();
  },

  niceText(_x, _y, s, scale, color, align) {
    var x = _x;
    var y = Math.floor(_y);

    switch (align) {
      case 'center':
        x -= measure(s, scale) / 2;
        break;
      case 'right':
        x -= measure(s, scale);
        break;
    }

    x = Math.floor(x);

    var offset = 0;

    this.beginPath();
    for (var i = 0, ii = s.length; i < ii; i += 1) {
      drawLetter(this, x + offset * scale, y, s[i], scale);
      offset += 1 + letters[s[i]][0].length;
    }
    this.fillStyle = color;
    this.fill();
  },

});

assign(Array.prototype, {

  removeBySwap(i) {
    if (i === this.length - 1) {
      this.pop();
    } else {
      this[i] = this.pop();
    }

    return this;
  },

});
