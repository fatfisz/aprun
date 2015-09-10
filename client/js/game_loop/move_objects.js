/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var {
  platformOffset,
  playerSpeed,
  initialForce,
  acceleration,
} = require('../constants');
var controls = require('../controls');
var state = require('../state');


function computeJump(delta) {
  var { player } = state;
  var { pos, force, targetY } = player;
  var newPos = pos[1] + force * delta;

  player.force -= acceleration * delta;

  if (force < 0 && isNaN(targetY)) {
    player.targetY = targetY = Math.floor(newPos / platformOffset) * platformOffset;
  }

  if (newPos < targetY) {
    pos[1] = targetY; // set up a temporary y for the fall check

    if (state.shouldPlayerFall()) {
      pos[1] = newPos; // falling through, restore y
      player.targetY = targetY = Math.floor(newPos / platformOffset) * platformOffset;
    } else {
      player.jumping = false;
    }
  } else {
    pos[1] = newPos;
  }
}

var canDoubleJump = false;

function movePlayer(delta) {
  var { player } = state;
  var { pos } = player;
  var { direction } = controls.state;

  pos[0] -= playerSpeed * delta;

  if (!player.jumping) {
    var falling = state.shouldPlayerFall();

    if (falling) {
      direction = 'down'; // overwrite the direction, we'll be falling
    }

    if (direction) {
      player.jumping = true;
      player.force = direction === 'up' ? initialForce : 0;
      player.targetY = NaN;
      canDoubleJump = true;

      if (!falling) {
        controls.reset();
      }
    }
  } else if (canDoubleJump && direction === 'up') {
    console.log('double');
    player.jumping = true;
    player.force = initialForce;
    player.targetY = NaN;
    canDoubleJump = false;
  }

  if (player.jumping) { // it could've changed above
    computeJump(delta);
  }
}

module.exports = function moveObjects(delta) {
  movePlayer(delta);
};
