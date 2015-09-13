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
var storage = require('../storage');
var { $ } = require('../utils');


var context = $('#restart-screen')[0].getContext('2d');

module.exports = function drawStatus() {
  var { score } = state;
  var scoreText = storage.wasNewBest ? 'new best score!' : 'score:';

  context.fillStyle = '#fff';
  context.fillRect(0, 0, width, height);

  context.niceText(width / 2, height / 2 - 80, scoreText, 4, '#000', 'center');
  context.niceText(width / 2, height / 2 - 40, score, 6, '#000', 'center');
  context.niceText(width / 2, height / 2 + 10, 'try again?', 4, '#000', 'center');
};
