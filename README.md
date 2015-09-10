# APRun

This is my entry for the [js13kGames competition](http://2015.js13kgames.com/).

Currently under development.

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
