# Anti-Paradox Run

![Anti-Paradox Run](https://raw.githubusercontent.com/fatfisz/aprun/master/big.png)

This is my entry for the [js13kGames competition](http://2015.js13kgames.com/).

In this game the time is flowing backwards, you are constantly running, and have to avoid creating paradoxes (that cause CHAOS).

To do that, catch your bullets (which you've shot "before"), avoid enemies' bullets (which you've avoided "before"), and avoid falling into the abyss.

[You can play the game here thanks to the GitHub Pages](http://fatfisz.github.io/aprun/).

## Requirements

The project requires [Node.js](https://nodejs.org/) and npm (comes with Node.js) to be installed.

## Installing

Run `npm install` in the project directory to install all needed packages.

## Grunt commands

Each command generates some files in the `build` directory.
`index.html`, `bundle.css`, and `bundle.js` from that directory are needed for the game to run.

`grunt` or `grunt run-dev` will start watchers which will rebuild the development version of the project after changes.

`grunt build-dev` builds the development version of the project.

`grunt build-prod` builds the "production" version of the project - the resulting files were used for the entry.
