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

exports.platformOffset = 30;
exports.platformAddition = 10;

exports.playerSize = 10;

exports.playerSpeed = 100e-3;
exports.initialForce = 225e-3;
exports.acceleration = .8e-3;

var { platformOffset, playerSpeed, initialForce, acceleration } = exports;
var jumpHeight = Math.pow(initialForce, 2) / 2 / acceleration;

if (process.env.NODE_ENV !== 'production' &&
    jumpHeight <= platformOffset) {
  throw new Error(`The jump is too weak: ${jumpHeight}`);
}

var jumpTime =
  initialForce / acceleration +
  Math.sqrt((jumpHeight - platformOffset) * 2 / acceleration);
var fallTime = Math.sqrt(platformOffset * 2 / acceleration);

exports.jumpWidth = playerSpeed * jumpTime;
exports.fallWidth = playerSpeed * fallTime;
