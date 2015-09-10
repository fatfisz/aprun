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
  platformOffset,
  platformAddition,
  playerSize,
  jumpWidth,
  fallWidth,
} = require('./constants');


var offscreen = width / 4 + 10;

var player = {
  pos: [0, platformOffset],
  jumping: false,
  force: 0,
};

var tracks = [0, 0, 0].map(() => [
  [0, platformOffset],
  [-offscreen, platformOffset],
]);

var platforms = [
    [-offscreen, platformOffset, offscreen],
];

var somethings = [];

var offset = 0;

function overlap([x1, y1, width1], [x2, y2, width2]) {
  return y1 === y2 && x2 < (x1 + width1) && (x2 + width2) > x1;
}

function addPlatform(x, y, width) {
  var paddedPlatform = [x - playerSize * 1.5, y, width + playerSize * 3];
  var { length } = platforms;
  var x1 = x;
  var x2 = x + width;
  var i;
  var tx;

  // Find the first platform to overlap with the new one
  for (i = 0; i < length; i += 1) {
    tx = platforms[i][0];

    if (overlap(paddedPlatform, platforms[i])) {
      x1 = Math.min(x1, tx);
      x2 = Math.max(x2, tx + platforms[i][2]);

      platforms[i][0] = x1;
      platforms[i][2] = x2 - x1;
      break;
    }
  }

  if (i === length) {
    // No platform overlaps with the new one
    platforms.push([x, y, width]);
    return;
  }

  // Merge overlapping platforms starting from the back
  for (var j = length - 1; j > i; j -= 1) {
    tx = platforms[j][0];

    if (overlap(paddedPlatform, platforms[j])) {
      x1 = Math.min(x1, tx);
      x2 = Math.max(x2, tx + platforms[j][2]);

      platforms[i][0] = x1;
      platforms[i][2] = x2 - x1;
      platforms.splice(j, 1);
    }
  }
}

function generateTrack(track) {
  var playerX = player.pos[0];
  var { length } = track;
  var lastPoint = track[length - 1];

  while (lastPoint[0] - playerX > 2 * -offscreen) {
    var [prevX, prevY] = lastPoint;
    var nextX = prevX;
    var nextY = platformOffset * Math.floor(Math.random() * 3);
    var flightWidth = 0;

    if (nextY !== prevY) {
      flightWidth = Math.round(nextY > prevY ? jumpWidth : fallWidth);
      nextX -= flightWidth;
      track.push([nextX, nextY]);
    }

    var widthMod = 3 - nextY / platformOffset;
    var platformWidth = Math.round((1 + Math.random()) * platformAddition * widthMod);

    lastPoint = [nextX - platformWidth, nextY];
    length = track.push(lastPoint);

    addPlatform(
      nextX - platformWidth,
      nextY,
      platformWidth + flightWidth / 2
    );
  }
}

function adjustPositions() {
  var x = Math.floor(player.pos[0]);

  if (x >= -offscreen) {
    return;
  }

  player.pos[0] -= x;

  tracks.forEach((track) => {
    track.forEach((point) => {
      point[0] -= x;
    });
  });

  platforms.forEach((platform) => {
    platform[0] -= x;
  });

  somethings.forEach((something) => {
    something[0] -= x;
  });

  offset -= x;
}

function cleanOffscreenObjects() {
  var playerX = player.pos[0];
  var i;
  var x;

  tracks.forEach((track) => {
    for (i = track.length - 1; i >= 0; i -= 1) {
      [x] = track[i];

      if (x - playerX > 2 * offscreen) {
        track.splice(i, 1);
      }
    }
  });

  for (i = platforms.length - 1; i >= 0; i -= 1) {
    [x] = platforms[i];

    if (x - playerX > offscreen) {
      platforms.splice(i, 1);
    }
  }
}

Object.defineProperties(exports, {
  tracks: {
    get() {
      return tracks;
    },
  },
  platforms: {
    get() {
      return platforms;
    },
  },
  somethings: {
    get() {
      return somethings;
    },
  },
  offset: {
    get() {
      return offset;
    },
  },
});

exports.player = player;

exports.shouldPlayerFall = () => {
  var [x, y] = player.pos;
  var playerBottom = [x - playerSize / 2, y, playerSize];

  for (var i = platforms.length - 1; i >= 0; i -= 1) {
    if (overlap(playerBottom, platforms[i])) {
      return false;
    }
  }

  return true;
};

exports.shouldGameEnd = () => {
  return player.pos[1] < 2 * -platformOffset;
};

exports.updateState = () => {
  cleanOffscreenObjects();
  adjustPositions();
  tracks.forEach(generateTrack);
};
