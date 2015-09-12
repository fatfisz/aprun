/*
 * APRun
 * https://github.com/fatfisz/aprun
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function overlap(x1, y1, width1, [x2, y2, width2]) {
  return y1 === y2 && x2 < (x1 + width1) && (x2 + width2) > x1;
};
