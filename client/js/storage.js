/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var state = require('./state');


var best = (+localStorage.getItem('best') || 0).toFixed(1);
var wasNewBest = false;

Object.defineProperties(exports, {
  best: {
    get: () => best,
  },
  wasNewBest: {
    get: () => wasNewBest,
  },
});

exports.save = () => {
  var { score } = state;

  wasNewBest = +score > +best;

  if (wasNewBest) {
    best = score;
    localStorage.setItem('best', score);
  }
};
