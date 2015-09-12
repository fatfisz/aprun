/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var {
  width,
  statusHeight,
} = require('../constants');
var state = require('../state');
var { context } = require('../utils');


function drawGauge() {
  var { value } = state.gauge;

  context.strokeStyle = '#333';
  context.lineWidth = 2;
  context.strokeRect(width - 180, 25, 152, 29);
  context.lineWidth = 1;

  if (value > 0) {
    context.fillStyle = '#999';
    context.fillRect(width - 179, 26, value * 150, 27);
  }
}

module.exports = function drawStatus() {
  context.setTransform(1, 0, 0, 1, 0, 0);

  context.fillStyle = '#000';
  context.fillRect(0, 0, width, statusHeight);

  context.strokeStyle = '#333';
  context.strokeRect(0, statusHeight - 1.5, width, 1);

  drawGauge();
};
