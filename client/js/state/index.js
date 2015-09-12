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
  bulletWidth,
  bulletHeight,
  bulletFade,
  offscreen,
  startingY,
  jumpWidth,
  jumpHeight,
  fallWidth,
} = require('../constants');
var bulletGenerator = require('./bullet_generator');


var player;
var trackPoints;
var platforms;
var bullets;
var offset;

function overlap(x1, y1, width1, [x2, y2, width2]) {
  return y1 === y2 && x2 < (x1 + width1) && (x2 + width2) > x1;
}

function addPlatform(x, y, width, isMainTrack) {
  var paddedX = x - playerSize * 1.5;
  var paddedWidth = width + playerSize * 3;
  var { length } = platforms;
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

function clearOffscreenObjects() {
  var playerX = player.pos[0];
  var i;
  var length;
  var x;
  var enemyX;

  for (i = 0, { length } = platforms; i < length; i += 1) {
    [x] = platforms[i];

    if (x - playerX > offscreen) {
      platforms.removeBySwap(i);
      length -= 1;
      i -= 1;
    }
  }

  for (i = bullets.length - 1; i >= 0; i -= 1) {
    [x, , enemyX] = bullets[i];

    if (x - playerX < -bulletFade &&
        (enemyX === null || enemyX - playerX > offscreen)) {
      // Splice should be faster here than removing and sorting
      bullets.splice(i, 1);
    }
  }
}

function clearBullets() {
  var [playerX, playerY] = player.pos;

  for (var i = bullets.length - 1; i >= 0; i -= 1) {
    var [x, y] = bullets[i];

    x -= playerX - playerSize / 2;

    if (x >= 0 &&
        x <= playerSize - bulletWidth &&
        y >= playerY + bulletHeight / 2 &&
        y <= playerY + playerSize - bulletHeight / 2) {
      bullets[i][4] = true;
      break; // only one player bullet can hit at a time
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

  adjuster(trackPoints);
  adjuster(platforms);
  adjuster(bullets);
  bullets.forEach((bullet) => {
    if (bullet[2] !== null) {
      bullet[2] -= x;
      adjuster(bullet[3]);
    }
  });

  offset -= x;
}

function generateTrack(trackPoint, index) {
  var isMainTrack = index === 0;
  var playerX = player.pos[0];

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

Object.defineProperties(exports, {
  player: {
    get() {
      return player;
    },
  },
  platforms: {
    get() {
      return platforms;
    },
  },
  bullets: {
    get() {
      return bullets;
    },
  },
  offset: {
    get() {
      return offset;
    },
  },
});

exports.start = () => {
  player = {
    pos: [0, startingY],
    jumping: false,
    force: 0,
  };
  trackPoints = [0, 0, 0].map(() => [-offscreen, startingY]);
  platforms = [
    [-offscreen, startingY, offscreen],
  ];
  bullets = [];
  offset = 0;

  bulletGenerator.init();
};

exports.isCamShaky = () => {
  var [playerX, playerY] = player.pos;

  if (playerY < -jumpHeight) {
    return true;
  }

  for (var i = bullets.length - 1; i >= 0; i -= 1) {
    if (bullets[i][4]) {
      continue;
    }

    var x = bullets[i][0] - playerX + playerSize / 2;

    if (x < 0 && x > -playerSize * 3) {
      return true;
    }
  }

  return false;
};

exports.shouldPlayerFall = () => {
  var [x, y] = player.pos;

  for (var i = platforms.length - 1; i >= 0; i -= 1) {
    if (overlap(x - playerSize / 2, y, playerSize, platforms[i])) {
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
  clearBullets();
  adjustPositions();

  trackPoints.forEach(generateTrack);
  bulletGenerator.generate();
};
