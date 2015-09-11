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
  bulletFade,
  bulletSpeed,
  enemyOffset,
  startEnemyChance,
  offscreen,
  startingY,
  jumpWidth,
  jumpHeight,
  fallWidth,
} = require('./constants');


var player;
var trackPoints;
var platforms;
var somethings;
var playerBullets;
var enemyChance;
var enemies;
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

  for (i = playerBullets.length - 1; i >= 0; i -= 1) {
    [x, , enemyX] = playerBullets[i];

    if (x - playerX < -bulletFade) {
      if (enemyX !== null) {
        enemies.push(playerBullets[i]);
      }
      // Splice should be faster here than removing and sorting
      playerBullets.splice(i, 1);
    }
  }

  for (i = 0, { length } = enemies; i < length; i += 1) {
    [, , x] = enemies[i];

    if (x - playerX > offscreen) {
      enemies.removeBySwap(i);
      length -= 1;
      i -= 1;
    }
  }
}

function clearPlayerBullets() {
  var [playerX, playerY] = player.pos;

  for (var i = playerBullets.length - 1; i >= 0; i -= 1) {
    var [x, y, enemyX] = playerBullets[i];

    x -= playerX - playerSize / 2;

    if (x >= 0 &&
        x <= playerSize - bulletWidth &&
        y >= playerY + bulletHeight / 2 &&
        y <= playerY + playerSize - bulletHeight / 2) {
      if (enemyX !== null) {
        enemies.push(playerBullets[i]);
      }
      // Splice should be faster here than removing and sorting
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

  adjuster(trackPoints);
  adjuster(platforms);
  adjuster(somethings);
  adjuster(playerBullets);
  playerBullets.forEach((bullet) => {
    if (bullet[2]) {
      bullet[2] -= x;
    }
  });
  enemies.forEach((bullet) => {
    if (bullet[2]) {
      bullet[2] -= x;
    }
  });

  offset -= x;
}

function generateTrack(trackPoint, index) {
  var isMainTrack = index === 0;
  var playerX = player.pos[0];

  while (trackPoint[0] - playerX > -offscreen * 4) {
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

var timeToHit = (offscreen + bulletOffset) / (bulletSpeed - playerSpeed);

function getMainTrackPlatformsAt(x) {
  return platforms.filter((platform) => {
    var normalizedX = x - platform[0];

    return platform[3] && normalizedX >= 0 && normalizedX <= platform[2];
  }).map((platform) => platform[1]);
}

function getPlatformsAt(x, y) {
  return platforms.filter((platform) => {
    var normalizedX = x - platform[0];

    return platform[1] === y && normalizedX >= 0 && normalizedX <= platform[2];
  }).map((platform) => platform[1]);
}

function generateBullets() {
  var playerX = player.pos[0];
  var { length } = playerBullets;

  if (length && playerBullets[length - 1][0] - playerX > offscreen) {
    return;
  }

  var destinationX = playerX - timeToHit * playerSpeed;
  var possiblePlatforms = getMainTrackPlatformsAt(destinationX);

  ({ length } = possiblePlatforms);

  if (!length) {
    return;
  }

  var x = offscreen + playerX + bulletOffset;
  var y = possiblePlatforms[Math.floor(Math.random() * length)];
  var enemyX = null;

  if (Math.random() < enemyChance) {
    var testEnemyX = destinationX + enemyOffset;

    for (var i = 0; i < 10; i += 1) {
      if (getPlatformsAt(testEnemyX, y).length &&
          getPlatformsAt(testEnemyX + playerSize * 2, y).length) {
        enemyX = testEnemyX + playerSize;
        break;
      }

      testEnemyX += playerSize / 2;
    }
  }

  if (enemyX === null) {
    enemyChance += .1;
  } else {
    enemyChance = startEnemyChance;
  }

  playerBullets.push([x, y + playerSize / 2, enemyX]);
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
  somethings: {
    get() {
      return somethings;
    },
  },
  playerBullets: {
    get() {
      return playerBullets;
    },
  },
  enemies: {
    get() {
      return enemies;
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
  somethings = [];
  playerBullets = [];
  enemyChance = startEnemyChance;
  enemies = [];
  offset = 0;
};

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
  clearPlayerBullets();
  adjustPositions();

  trackPoints.forEach(generateTrack);
  generateBullets();

  addPlatform(-width, -platformOffset, width);
};
