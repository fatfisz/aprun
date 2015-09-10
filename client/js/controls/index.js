/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var setupKeyboard = require('./keyboard');
var setupTouch = require('./touch');


var state = {
  direction: null,
};

function registerReset(resetCallback) {
  window.addEventListener('blur', resetCallback);
  document.addEventListener('visibilitychange', resetCallback);
}

Object.defineProperties(exports, {
  state: {
    get() {
      return state;
    },
  },
});

exports.reset = () => {
  state.direction = null;
};

setupKeyboard(state, registerReset);
setupTouch(state, registerReset);
registerReset(exports.reset);
