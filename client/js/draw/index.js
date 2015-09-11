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
  platformOffset,
  playerSize,
  bulletWidth,
  bulletHeight,
  bulletFade,
  offscreen,
} = require('../constants');
var state = require('../state');
var { context } = require('../utils');
var clear = require('./clear');


var playerColor = '#1ef755';
var platformColor = '#aaa';

function drawPlayer([x, y]) {
  context.fillStyle = playerColor;
  context.fillRect(x - playerSize / 2, y, playerSize, playerSize);
}

var xCrackOffset = 13;
var yCrackOffset = 7;

function drawPlatform([_x, y, _width]) {
  var playerX = state.player.pos[0];
  var x = _x;
  var width = _width;

  if (x - playerX < -offscreen) {
    width -= -offscreen - x + playerX;
    x = -offscreen + playerX;
  }

  if (x + width - playerX > offscreen) {
    width = offscreen - x + playerX;
  }

  if (width <= 0) {
    return;
  }

  var offset = (state.offset - x + y * yCrackOffset) % xCrackOffset;

  context.clearRect(x + 2, y - 2, width - 4, 1);
  context.clearRect(x + 1, y - height, width - 2, height - 1);

  context.fillStyle = platformColor;

  for (var crackX = x + 2 + offset;
       crackX <= x + width - 4;
       crackX += xCrackOffset) {
    if (crackX < x + width) {
      context.fillRect(crackX, y - 2, 1, 1);
    }
    context.fillRect(crackX - 1, y - 3, 1, 1);
  }

  context.roundedRect(x + .5, y - height, x + width - .5, y - .5, 2.75);
  context.strokeStyle = platformColor;
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

function drawPlayerBullet([x, y]) {
  var playerX = state.player.pos[0];

  if (x < playerX) {
    context.globalAlpha = Math.max(1 - (playerX - x) / bulletFade, 0);
  }

  context.fillStyle = playerColor;
  context.fillRect(x, y - bulletHeight / 2, bulletWidth, bulletHeight);

  if (x < playerX) {
    context.globalAlpha = 1;
  }
}

var shakeSize = 5;

module.exports = function draw() {
  var {
    player,
    tracks,
    platforms,
    somethings,
    playerBullets,
  } = state;
  var { pos } = player;
  var offsetX = width / 2 - pos[0] * 2;
  var offsetY = height / 2 + platformOffset * 6;

  if (state.isCamShaky()) {
    offsetX += shakeSize * (Math.random() * 2 - 1);
    offsetY += shakeSize * (Math.random() * 2 - 1);
  }

  clear();

  context.setTransform(2, 0, 0, -2, offsetX, offsetY);

  platforms.sort((a, b) => b[1] - a[1]).forEach(drawPlatform);
  somethings.forEach(drawSomething);
  tracks.forEach(drawTrack);

  playerBullets.forEach(drawPlayerBullet);

  drawPlayer(pos);
};
