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
  height,
} = require('../constants');
var state = require('../state');
var { $ } = require('../utils');


var context = $('#restart-screen')[0].getContext('2d');

module.exports = function drawStatus() {
  var { score } = state;

  context.fillStyle = '#fff';
  context.fillRect(0, 0, width, height);

  context.niceText(width / 2, height / 2 - 30, `your score: ${score}`, 4, '#000', 'center');
  context.niceText(width / 2, height / 2 + 10, 'try again?', 4, '#000', 'center');
};
