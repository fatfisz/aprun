/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var {
  platformCount,
  platformOffset,
  platformWidthMod,
  playerSize,
  offscreen,
  startingY,
  jumpWidth,
  fallWidth,
} = require('../constants');
var state = require('./index');
var overlap = require('./overlap');


var trackPoints;

function addPlatform(x, y, width, isMainTrack) {
  var { platforms } = state;
  var { length } = platforms;
  var paddedX = x - playerSize * 1.5;
  var paddedWidth = width + playerSize * 3;
  var x1 = x;
  var x2 = x + width;
  var i;
  var tx;

  // Find the first platform to overlap with the new one
  for (i = 0; i < length; i += 1) {
    tx = platforms[i][0];

    if (overlap(paddedX, y, paddedWidth, platforms[i])) {
      x1 = Math.min(x1, tx);
      x2 = Math.max(x2, tx + platforms[i][2]);

      platforms[i][0] = x1;
      platforms[i][2] = x2 - x1;

      if (isMainTrack) {
        platforms[i][3] = true;
      }
      break;
    }
  }

  if (i === length) {
    // No platform overlaps with the new one
    platforms.push([x, y, width, isMainTrack]);
    return;
  }

  // Merge overlapping platforms starting from the back
  for (var j = i + 1; j < length; j += 1) {
    tx = platforms[j][0];

    if (overlap(paddedX, y, paddedWidth, platforms[j])) {
      x1 = Math.min(x1, tx);
      x2 = Math.max(x2, tx + platforms[j][2]);

      platforms[i][0] = x1;
      platforms[i][2] = x2 - x1;

      if (platforms[j][3]) {
        platforms[i][3] = true;
      }

      platforms.removeBySwap(j);
      length -= 1;
      j -= 1;
    }
  }
}

function generatePlatformForTrack(trackPoint, index) {
  var { player } = state;
  var playerX = player.pos[0];
  var isMainTrack = index === 0;

  while (trackPoint[0] - playerX > -offscreen * 2.5) {
    var [prevX, prevY] = trackPoint;
    var nextX = prevX;
    var nextY;
    var flightWidth = 0;

    if (isMainTrack) {
      // The main track is ensured to be possible to always stay on
      nextY = prevY + (Math.random() < .5 ? -1 : 1) * platformOffset;

      if (nextY < 0) {
        nextY += 2 * platformOffset;
      }

      if (nextY === platformCount * platformOffset) {
        nextY -= 2 * platformOffset;
      }
    } else {
      nextY = Math.floor(Math.random() * platformCount) * platformOffset;
    }

    if (nextY !== prevY) {
      flightWidth = Math.round(nextY > prevY ? jumpWidth : fallWidth);
      nextX -= flightWidth;
    }

    var elevationBasedMod = 1 - nextY / platformOffset / (platformCount - 1) / 2;
    var platformWidth = Math.round(
      (2 + Math.pow(Math.random(), 5)) * platformWidthMod * elevationBasedMod
    );

    trackPoint[0] = nextX - platformWidth;
    trackPoint[1] = nextY;

    addPlatform(
      nextX - platformWidth,
      nextY,
      platformWidth + flightWidth / 4,
      isMainTrack
    );
  }
}

exports.init = () => {
  trackPoints = [0, 0, 0].map(() => [-offscreen, startingY]);
};

exports.adjust = (adjuster) => {
  adjuster(trackPoints);
};

exports.generate = () => {
  trackPoints.forEach(generatePlatformForTrack);
};
