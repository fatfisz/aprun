/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

exports.width = 640;
exports.height = 270;

exports.platformCount = 5;
exports.platformOffset = 18;
exports.platformWidthMod = 20;

exports.playerSize = 14;
exports.playerSpeed = 100e-3;
exports.initialForce = 200e-3;
exports.acceleration = .8e-3;

exports.bulletOffset = 150;
exports.bulletWidth = 4;
exports.bulletHeight = 2;
exports.bulletFade = 80;
exports.bulletSpeed = 160e-3;


// Derivative constants
var { platformCount, platformOffset, playerSpeed, initialForce, acceleration } = exports;

exports.startingY = platformOffset * Math.floor((platformCount - 1) / 2);

var jumpHeight = Math.pow(initialForce, 2) / 2 / acceleration;

if (process.env.NODE_ENV !== 'production' &&
    jumpHeight <= platformOffset * 1.25) {
  throw new Error(`The jump is too weak: ${jumpHeight}`);
}

var jumpTime =
  initialForce / acceleration +
  Math.sqrt((jumpHeight - platformOffset) * 2 / acceleration);
var fallTime = Math.sqrt(platformOffset * 2 / acceleration);

exports.jumpWidth = playerSpeed * jumpTime;
exports.jumpHeight = jumpHeight;
exports.fallWidth = playerSpeed * fallTime;
