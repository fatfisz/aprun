/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var draw = require('../draw');
var state = require('../state');
var moveObjects = require('./move_objects');


var stopped = true;
var delta = 1000 / 60;

function step() {
  if (stopped) {
    return;
  }

  if (state.didGameEnd()) {
    exports.stop();
    return;
  }

  requestAnimationFrame(step);

  state.updateState(delta);
  moveObjects(delta);

  draw();
}

exports.start = () => {
  requestAnimationFrame(step);

  state.start();
  stopped = false;
};

exports.stop = () => {
  stopped = true;
};
