/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var {
  stunTime,
  gaugeRefillSpeed,
} = require('../constants');

var value;
var stunLeft;

Object.defineProperties(exports, {
  value: {
    get: () => value,
  },
});

exports.init = () => {
  value = 1;
  stunLeft = 0;
};

exports.hit = (_value) => {
  value = Math.max(value - _value, 0);
  stunLeft = stunTime;
};

exports.step = (delta) => {
  if (stunLeft > 0) {
    stunLeft -= delta;
    return;
  }

  value = Math.min(value + delta * gaugeRefillSpeed, 1);
};
