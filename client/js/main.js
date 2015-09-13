/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var { width, height } = require('./constants');
var events = require('./events');
var gameLoop = require('./game_loop');
var resizeCanvas = require('./resize_canvas');
var { $, context } = require('./utils');


// Setup the canvas
var { canvas } = context;

canvas.width = width;
canvas.height = height;

window.onresize = resizeCanvas;
resizeCanvas();

// Prepare UI
var root = $('html')[0];

var intro = $('#intro')[0];
var introContext = intro.getContext('2d');

intro.width = width;
intro.height = height;

introContext.fillStyle = '#fff';
introContext.fillRect(0, 0, width, height);
introContext.niceText(width / 2, 40, 'anti-paradox run', 8, '#000', 'center');
introContext.niceText(width / 2, 120, 'time is reversed', 3, '#000', 'center');
introContext.niceText(width / 2, 150, 'catch your bullets', 3, '#000', 'center');
introContext.niceText(width / 2, 180, 'avoid bullets of enemies', 3, '#000', 'center');
introContext.niceText(width / 2, 210, 'double jump if it gets tough', 3, '#000', 'center');
introContext.niceText(width / 2, 250, 'creating paradoxes increases the chaos', 5, '#000', 'center');
introContext.niceText(width / 2, 370, 'moving: use up / down keys or tap upper / lower halves of the screen', 3, '#000', 'center');

var startButton = $('#start-button')[0];
var startButtonContext = startButton.getContext('2d');

startButton.width = 116;
startButton.height = 44;

startButtonContext.fillStyle = '#000';
startButtonContext.fillRect(0, 0, 116, 44);
startButtonContext.fillStyle = '#fff';
startButtonContext.fillRect(4, 4, 108, 36);
startButtonContext.niceText(58, 12, 'start', 4, '#000', 'center');

var introHidden = false;

events.on(startButton, 'click', () => {
  if (introHidden) {
    return;
  }

  introHidden = true;
  root.classList.add('intro-hidden');
  gameLoop.start();
});

var restartScreen = $('#restart-screen')[0];

restartScreen.width = width;
restartScreen.height = height;

var restartButton = $('#restart-button')[0];
var restartButtonContext = restartButton.getContext('2d');

restartButton.width = 148;
restartButton.height = 44;

restartButtonContext.fillStyle = '#000';
restartButtonContext.fillRect(0, 0, 148, 44);
restartButtonContext.fillStyle = '#fff';
restartButtonContext.fillRect(4, 4, 140, 36);
restartButtonContext.niceText(74, 12, 'restart', 4, '#000', 'center');

events.on(restartButton, 'click', () => {
  if (gameLoop.stopped) {
    root.classList.remove('restart');
    gameLoop.start();
  }
});
