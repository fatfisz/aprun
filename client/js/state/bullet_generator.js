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
  playerSpeed,
  bulletOffset,
  bulletWidth,
  bulletSpeed,
  enemyOffset,
  startEnemyChance,
  enemyBulletOffset,
  enemyBulletShift,
  offscreen,
} = require('../constants');
var state = require('./index');


var timeToAbsorb = (bulletWidth + offscreen + enemyOffset) /
                   (bulletSpeed - playerSpeed);
var enemyChance;
var enemyTestArray = [];

function getMainTrackPlatformsAt(x) {
  var { platforms } = state;

  return platforms.filter((platform) => {
    var normalizedX = x - platform[0];

    return platform[3] && normalizedX >= 0 && normalizedX <= platform[2];
  }).map((platform) => platform[1]);
}

function isPlatformAt(_x, _y) {
  var { platforms } = state;

  for (var i = platforms.length - 1; i >= 0; i -= 1) {
    var [x, y, width] = platforms[i];
    var normalizedX = _x - x;

    if (y === _y && normalizedX >= 0 && normalizedX <= width) {
      return true;
    }
  }

  return false;
}

function getEnemyBulletAtIndex(destinationX, i) {
  return destinationX - enemyBulletOffset / 2 -
         timeToAbsorb * bulletSpeed -
         i * enemyBulletOffset + enemyBulletShift;
}

function getEnemyBullets(enemyX, y, destinationX) {
  var result = [];
  var diffX = destinationX - enemyX;
  var start = Math.ceil((2 * diffX + playerSize / 2 + enemyBulletShift) / enemyBulletOffset - .5);
  var end = (diffX - playerSize + enemyBulletShift + (diffX + offscreen) * bulletSpeed / playerSpeed) / enemyBulletOffset - .5;

  for (var i = start; i < end; i += 1) {
    result.push([
      getEnemyBulletAtIndex(destinationX, i),
      y + playerSize / 2,
      false, // hit
    ]);
  }

  return result;
}

exports.init = () => {
  enemyChance = startEnemyChance;
};

exports.generate = () => {
  var { player, bullets } = state;
  var playerX = player.pos[0];
  var { length } = bullets;
  var x = playerX + playerSize / 2 + offscreen + enemyOffset;

  if (length && bullets[length - 1][0] + bulletOffset > x) {
    return;
  }

  var destinationX = playerX - timeToAbsorb * playerSpeed;
  var possiblePlatforms = getMainTrackPlatformsAt(destinationX);

  ({ length } = possiblePlatforms);

  if (!length) {
    return;
  }

  var y = possiblePlatforms[Math.floor(Math.random() * length)];
  var enemyX = null;
  var enemyBullets = null;

  if (Math.random() < enemyChance) {
    var testEnemyX = destinationX + enemyOffset;

    for (var i = 0; playerX - testEnemyX > offscreen; i += 1) {
      enemyTestArray[i] = isPlatformAt(testEnemyX, y);

      if (i > 3 &&
          enemyTestArray[i] &&
          enemyTestArray[i - 2] &&
          enemyTestArray[i - 4]) {
        enemyX = testEnemyX - playerSize;
        enemyBullets = getEnemyBullets(enemyX, y, destinationX);
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

  // x, y, enemyX, enemyBullets, absorbed, missedPlayer
  bullets.push([x, y + playerSize / 2, enemyX, enemyBullets, false, false]);
};
