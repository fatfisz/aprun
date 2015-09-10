/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var { width, height, platformOffset, playerSize } = require('../constants');
var state = require('../state');
var { context } = require('../utils');
var clear = require('./clear');


function drawPlayer([x, y]) {
  context.fillStyle = 'blue';
  context.fillRect(x - 5, y, playerSize, playerSize);
}

var xCrackOffset = 14;
var yCrackOffset = 3;

function drawPlatform([x, y, width]) {
  context.clearRect(x, y - 2, width, 1);
  context.clearRect(x - 1, y - height, width + 2, height - 1);

  context.fillStyle = 'white';

  for (var crackX = x + (state.offset - x + y * y * yCrackOffset) % xCrackOffset;
       crackX <= x + width;
       crackX += xCrackOffset) {
    if (crackX < x + width) {
      context.fillRect(crackX, y - 2, 1, 1);
    }
    context.fillRect(crackX - 1, y - 3, 1, 1);
  }

  context.roundedRect(x - 1.5, y - height, x + width + 1.5, y - .5, 2.75);
  context.strokeStyle = 'white';
  context.stroke();
}

function drawSomething([x, y]) {
  context.fillStyle = 'yellow';
  context.fillRect(x, y, 5, 5);
}

var colors = [
  'lime',
  'red',
  'cyan',
  'navy',
  'yellow',
];

function drawTrack(track, i) {
  context.save();

  context.beginPath();
  context.moveTo(track[0][0], track[0][1] + playerSize / 2);
  track.forEach((point) => {
    context.lineTo(point[0], point[1] + playerSize / 2);
  });
  context.strokeStyle = colors[i];
  context.strokeWidth = 2;
  context.stroke();

  context.restore();
}

module.exports = function draw() {
  var { player, tracks, platforms, somethings } = state;
  var { pos } = player;

  clear();

  context.setTransform(2, 0, 0, -2, width / 2 - pos[0] * 2, height / 2 + platformOffset * 3);

  platforms
    .filter((platform) => platform[1] === platformOffset * 2)
    .forEach(drawPlatform);
  platforms
    .filter((platform) => platform[1] === platformOffset)
    .forEach(drawPlatform);
  platforms
    .filter((platform) => platform[1] === 0)
    .forEach(drawPlatform);
  somethings.forEach(drawSomething);
  tracks.forEach(drawTrack);

  drawPlayer(pos);
};
