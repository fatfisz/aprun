/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

exports.width = 960;
exports.height = 324;

exports.platformCount = 5;
exports.platformOffset = 18;
exports.platformWidthMod = 20;

exports.playerSize = 14;
exports.playerSpeed = 100e-3;
exports.initialForce = 200e-3;
exports.acceleration = .8e-3;

exports.bulletOffset = 125;
exports.bulletWidth = 4;
exports.bulletHeight = 2;
exports.bulletFade = 80;
exports.bulletSpeed = 160e-3;

exports.enemyOffset = 150;
exports.startEnemyChance = .25;
exports.enemyBulletOffset = 120;
exports.enemyBulletShift = 90;

// Derivative constants
exports.offscreen = exports.width / 4 + exports.playerSize;

exports.startingY = exports.platformOffset * Math.floor((exports.platformCount - 1) / 2);

var jumpHeight = Math.pow(exports.initialForce, 2) / 2 / exports.acceleration;

if (process.env.NODE_ENV !== 'production' &&
    jumpHeight <= exports.platformOffset * 1.25) {
  throw new Error(`The jump is too weak: ${jumpHeight}`);
}

var jumpTime =
  exports.initialForce / exports.acceleration +
  Math.sqrt((jumpHeight - exports.platformOffset) * 2 / exports.acceleration);
var fallTime = Math.sqrt(exports.platformOffset * 2 / exports.acceleration);

exports.jumpWidth = exports.playerSpeed * jumpTime;
exports.jumpHeight = jumpHeight;
exports.fallWidth = exports.playerSpeed * fallTime;
