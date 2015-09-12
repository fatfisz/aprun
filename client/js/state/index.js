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
  playerSize,
  bulletWidth,
  bulletHeight,
  bulletFade,
  bulletMissGaugeValue,
  bulletHitGaugeValue,
  teleportGaugeValue,
  offscreen,
  startingY,
} = require('../constants');
var bulletGenerator = require('./bullet_generator');
var gauge = require('./gauge');
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

function checkEnemyBullets(bullets) {
  var [playerX, playerY] = player.pos;

  for (var i = bullets.length - 1; i >= 0; i -= 1) {
    var [x, y, hit] = bullets[i];

    if (hit) {
      continue;
    }

    x -= playerX - playerSize / 2;

    if (x > -bulletWidth &&
        x < playerSize &&
        y > playerY - bulletHeight &&
        y < playerY + playerSize + bulletHeight) {
      bullets[i][2] = true;
      gauge.hit(bulletHitGaugeValue);
    }
  }
}

function checkBullets() {
  var [playerX, playerY] = player.pos;

  for (var i = bullets.length - 1; i >= 0; i -= 1) {
    var [x, y, , enemyBullets, absorbed, missedPlayer] = bullets[i];

    if (enemyBullets) {
      checkEnemyBullets(enemyBullets);
    }

    if (absorbed) {
      continue;
    }

    x -= playerX - playerSize / 2;

    if (x >= 0 &&
        x <= playerSize - bulletWidth &&
        y >= playerY + bulletHeight / 2 &&
        y <= playerY + playerSize - bulletHeight / 2) {
      bullets[i][4] = true; // absorbed
      continue;
    }

    if (x < 0 && !missedPlayer) {
      bullets[i][5] = true; // missedPlayer
      gauge.hit(bulletMissGaugeValue);
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

function checkTeleport() {
  if (player.pos[1] < -4 * platformOffset) {
    player.pos[1] = (platformCount + 4) * platformOffset;
    player.force = 0;
    player.targetY = NaN;
    gauge.hit(teleportGaugeValue);
  }
}

Object.defineProperties(exports, {
  player: {
    get: () => player,
  },
  platforms: {
    get: () => platforms,
  },
  bullets: {
    get: () => bullets,
  },
  offset: {
    get: () => offset,
  },
});

exports.gauge = gauge;

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
  gauge.init();
  platformGenerator.init();
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

exports.updateState = (delta) => {
  gauge.step(delta);
  clearOffscreenObjects();
  checkBullets();
  adjustPositions();

  platformGenerator.generate();
  bulletGenerator.generate();
  checkTeleport();
};
