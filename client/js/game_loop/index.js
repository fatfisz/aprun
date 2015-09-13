/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var draw = require('../draw');
var drawRestartScreen = require('../draw/restart_screen');
var state = require('../state');
var storage = require('../storage');
var { $ } = require('../utils');
var moveObjects = require('./move_objects');


var stopped = true;
var stopping = true;
var delta = 1000 / 60;

window.q = (value) => delta = value;

function step() {
  if (stopped) {
    return;
  }

  if (!stopping && state.ended) {
    stopping = true;

    setTimeout(() => {
      stopped = true;
    }, 1500);

    storage.save();
    drawRestartScreen();
    $('html')[0].classList.add('restart');
  }

  requestAnimationFrame(step);

  state.updateState(delta);
  moveObjects(delta);

  draw();
}

Object.defineProperties(exports, {
  stopped: {
    get: () => stopped,
  },
});

exports.start = () => {
  if (!stopped) {
    return;
  }

  requestAnimationFrame(step);

  state.start();
  stopped = false;
  stopping = false;
};
