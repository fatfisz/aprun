/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var events = require('../events');
var { $ } = require('../utils');


module.exports = function setup(state, registerReset) {
  var touchIdentifier = null;

  function registerButtonEvents(element, direction) {
    events
      .on(element, 'touchstart', (event) => {
        if (touchIdentifier) {
          return;
        }

        touchIdentifier = event.changedTouches[0].identifier;
        state.direction = direction;
      })
      .on(element, 'touchend', (event) => {
        if (touchIdentifier === event.changedTouches[0].identifier) {
          touchIdentifier = null;
          state.direction = null;
        }
      });
  }

  registerButtonEvents($('#up')[0], 'up');
  registerButtonEvents($('#down')[0], 'down');

  events.on(document, 'contextmenu', (event) => {
    event.preventDefault();
  });

  registerReset(() => {
    [].forEach.call($('#mobile-controls .active'), (element) => {
      element.classList.remove('active');
    });
  });
};
