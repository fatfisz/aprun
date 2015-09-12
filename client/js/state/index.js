/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var {
  playerSize,
  bulletWidth,
  bulletHeight,
  bulletFade,
  offscreen,
  startingY,
  jumpHeight,
} = require('../constants');
var bulletGenerator = require('./bullet_generator');
var overlap = require('./overlap');
var platformGenerator = require('./platform_generator');


var player;
var platforms;
var bullets;
var offset;

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

  platformGenerator.adjust(adjuster);
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
  platforms = [
    [-offscreen, startingY, offscreen],
  ];
  bullets = [];
  offset = 0;

  bulletGenerator.init();
  platformGenerator.init();
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

  platformGenerator.generate();
  bulletGenerator.generate();
};
