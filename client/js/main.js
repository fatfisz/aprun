/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var { width, height } = require('./constants');
var gameLoop = require('./game_loop');
var resizeCanvas = require('./resize_canvas');
var { context } = require('./utils');


// Setup the canvas
var { canvas } = context;

canvas.width = width;
canvas.height = height;

window.onresize = resizeCanvas;
resizeCanvas();

gameLoop.start();
