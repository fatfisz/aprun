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
var { $ } = require('./utils');


width += 4;
height += 4;
var aspectRatio = width / height;

module.exports = function resizeCanvas() {
  [].forEach.call($('.resize'), (element) => {
    var { clientWidth, clientHeight } = element.parentElement;

    clientWidth = Math.min(clientWidth, width);
    clientHeight = Math.min(clientHeight, height);

    assign(element.style, {
      width: Math.min(clientWidth, clientHeight * aspectRatio) + 'px',
      height: Math.min(clientWidth / aspectRatio, clientHeight) + 'px',
    });
  });
};
