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
  platformCount,
  platformOffset,
  platformWidthMod,
  playerSize,
  playerSpeed,
  bulletOffset,
  bulletWidth,
  bulletHeight,
  bulletSpeed,
  startingY,
  jumpWidth,
  jumpHeight,
  fallWidth,
} = require('./constants');


var offscreen = width / 4 + 10;

var player = {
  pos: [0, startingY],
  jumping: false,
  force: 0,
};

var tracks = [0, 0, 0].map(() => [
  [0, startingY],
  [-offscreen, startingY],
]);

var platforms = [
  [-offscreen, startingY, offscreen],
];

var somethings = [];

var playerBullets = [];

var offset = 0;

function overlap([x1, y1, width1], [x2, y2, width2]) {
  return y1 === y2 && x2 < (x1 + width1) && (x2 + width2) > x1;
}

function addPlatform(x, y, width, isMainTrack) {
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
  for (var j = length - 1; j > i; j -= 1) {
    tx = platforms[j][0];

    if (overlap(paddedPlatform, platforms[j])) {
      x1 = Math.min(x1, tx);
      x2 = Math.max(x2, tx + platforms[j][2]);

      platforms[i][0] = x1;
      platforms[i][2] = x2 - x1;

      if (platforms[j][3]) {
        platforms[i][3] = true;
      }

      platforms.splice(j, 1);
    }
  }
}

function clearOffscreenObjects() {
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

  for (i = playerBullets.length - 1; i >= 0; i -= 1) {
    [x] = playerBullets[i];

    if (x - playerX < -offscreen) {
      playerBullets.splice(i, 1);
    }
  }
}

function clearPlayerBullets() {
  var [playerX, playerY] = player.pos;

  for (var i = playerBullets.length - 1; i >= 0; i -= 1) {
    var [x, y] = playerBullets[i];

    x -= playerX - playerSize / 2;

    if (x >= 0 &&
        x <= playerSize - bulletWidth &&
        y >= playerY + bulletHeight / 2 &&
        y <= playerY + playerSize - bulletHeight / 2) {
      playerBullets.splice(i, 1);
      return; // only one player bullet can hit at a time
    }
  }
}

function adjustArray(x, array) {
  array.forEach((element) => {
    element[0] -= x;
  });
}

function adjustPositions() {
  var x = Math.floor(player.pos[0]);

  if (x >= -offscreen) {
    return;
  }

  var adjuster = adjustArray.bind(null, x);

  player.pos[0] -= x;

  tracks.forEach(adjuster);
  adjuster(platforms);
  adjuster(somethings);
  adjuster(playerBullets);

  offset -= x;
}

function generateTrack(track, index) {
  var isMainTrack = index === 0;
  var playerX = player.pos[0];
  var { length } = track;
  var lastPoint = track[length - 1];

  while (lastPoint[0] - playerX > -offscreen * 4) {
    var [prevX, prevY] = lastPoint;
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
      track.push([nextX, nextY]);
    }

    var elevationBasedMod = 1 - nextY / platformOffset / (platformCount - 1) / 2;
    var platformWidth = Math.round(
      (2 + Math.pow(Math.random(), 5)) * platformWidthMod * elevationBasedMod
    );

    lastPoint = [nextX - platformWidth, nextY];
    length = track.push(lastPoint);

    addPlatform(
      nextX - platformWidth,
      nextY,
      platformWidth + flightWidth / 4,
      isMainTrack
    );
  }
}

var timeToHit = (offscreen + bulletOffset) / (bulletSpeed - playerSpeed);

function getMainTrackPlatformAt(x) {
  return platforms.filter((platform) => {
    var normalizedX = x - platform[0];

    return platform[3] && normalizedX >= 0 && normalizedX <= platform[2];
  }).map((platform) => platform[1]);
}

function generateBullets() {
  var playerX = player.pos[0];
  var { length } = playerBullets;

  if (length && playerBullets[length - 1][0] - playerX > offscreen) {
    return;
  }

  var possiblePlatforms = getMainTrackPlatformAt(playerX - timeToHit * playerSpeed);

  ({ length } = possiblePlatforms);

  if (!length) {
    return;
  }

  var x = offscreen + playerX + bulletOffset;
  var y = possiblePlatforms[Math.floor(Math.random() * length)] + playerSize / 2;

  playerBullets.push([x, y]);
}

Object.defineProperties(exports, {
  offset: {
    get() {
      return offset;
    },
  },
});

exports.player = player;
exports.tracks = tracks;
exports.platforms = platforms;
exports.somethings = somethings;
exports.playerBullets = playerBullets;

exports.isCamShaky = () => {
  var [playerX, playerY] = player.pos;

  if (playerY < -jumpHeight) {
    return true;
  }

  for (var i = playerBullets.length - 1; i >= 0; i -= 1) {
    var x = playerBullets[i][0] - playerX + playerSize / 2;

    if (x < 0 && x > -playerSize * 3) {
      return true;
    }
  }

  return false;
};

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
  return player.pos[1] < -jumpHeight * 10;
};

exports.updateState = () => {
  clearOffscreenObjects();
  clearPlayerBullets();
  adjustPositions();
  tracks.forEach(generateTrack);
  generateBullets();

  addPlatform(-width, -platformOffset, width);
};
