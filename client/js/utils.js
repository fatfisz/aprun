/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var assign = require('object-assign');


exports.$ = document.querySelectorAll.bind(document);
exports.root = exports.$('html')[0];
exports.context = exports.$('canvas')[0].getContext('2d');

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
