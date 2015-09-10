/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var assign = require('object-assign');

var { width, height } = require('./constants');
var { canvas } = require('./utils').context;


// Add 4 for the borders
width += 4;
height += 4;

var container = canvas.parentElement;
var aspectRatio = width / height;

module.exports = function resizeCanvas() {
  var { clientWidth, clientHeight } = container;

  clientWidth = Math.min(clientWidth, width);
  clientHeight = Math.min(clientHeight, height);

  assign(canvas.style, {
    width: Math.min(clientWidth, clientHeight * aspectRatio) + 'px',
    height: Math.min(clientWidth / aspectRatio, clientHeight) + 'px',
  });
};
