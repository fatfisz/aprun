/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var directionKeys = {
  38: 'up',
  40: 'down',
};

module.exports = function setup(state, registerReset) {
  var pressedKeys = [];

  function keysChanged() {
    var length = pressedKeys.length;

    if (length === 0) {
      if (state.direction) {
        state.direction = null;
      }

      return;
    }

    var lastKey = pressedKeys[length - 1];
    var direction = directionKeys[lastKey] || null;

    if (direction && state.direction !== direction) {
      state.direction = direction;
    }
  }

  window.onkeydown = ({ which }) => {
    if (pressedKeys.indexOf(which) === -1) {
      pressedKeys.push(which);
      keysChanged();
    }
  };

  window.onkeyup = ({ which }) => {
    var pos = pressedKeys.indexOf(which);

    if (pos !== -1) {
      pressedKeys.splice(pos, 1);
      keysChanged();
    }
  };

  registerReset(() => {
    pressedKeys.length = 0;
  });
};
