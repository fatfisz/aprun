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
var firstFrame;
var lastTimestamp;
var delta;

function step(timestamp) {
  if (stopped) {
    return;
  }

  if (state.shouldGameEnd()) {
    exports.stop();
    exports.start();
    return;
  }

  requestAnimationFrame(step);

  if (firstFrame) {
    lastTimestamp = timestamp;
    firstFrame = false;
  }

  // Limit delta so that strange jumps won't occur
  delta = Math.min(timestamp - lastTimestamp, 1000 / 60);
  lastTimestamp = timestamp;

  state.updateState();
  moveObjects(delta);

  draw();
}

exports.start = () => {
  requestAnimationFrame(step);

  state.start();
  stopped = false;
  firstFrame = true;
};

exports.stop = () => {
  stopped = true;
};
