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


function getGaugeColor(value) {
  var r = 51 + Math.round(Math.min(1 - value, .5) * 300);
  var g = 51 + Math.round(Math.min(value, .5) * 300);
  var b = 51;

  return `rgb(${r}, ${g}, ${b})`;
}

function drawGauge() {
  var { value } = state.gauge;
  var chaosValue = value === 0 ? 'over 9000' : `${Math.round((1 - value) * 100)}%`;

  context.strokeStyle = '#333';
  context.lineWidth = 2;
  context.strokeRect(width - 180, 25, 152, 29);
  context.lineWidth = 1;

  context.fillStyle = getGaugeColor(value);
  context.fillRect(width - 179, 26, 1 + value * 149, 27);

  context.niceText(width - 189, 32, 'chaos', 3, '#fff', 'right');
  context.niceText(width - 104, 32, chaosValue, 3, 'rgba(255, 255, 255, .9)', 'center');
}

function drawScore() {
  var { score } = state;

  context.niceText(width / 2, 32, `score: ${score}`, 3, '#fff', 'center');
}

module.exports = function drawStatus() {
  context.setTransform(1, 0, 0, 1, 0, 0);

  context.fillStyle = '#000';
  context.fillRect(0, 0, width, statusHeight);

  context.strokeStyle = '#333';
  context.strokeRect(0, statusHeight - 1.5, width, 1);

  drawGauge();
  drawScore();
};
