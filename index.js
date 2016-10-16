#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var cli = (0, _meow2.default)('\nUsage\n  $ psm [input] [target]\n\nOptions\n  -i, --input   Source JavaScript to pull psm({}) object of scripts from. (default: psm.js)\n  -t, --target  Target file to destructively overwrite with package scripts. (default: package.json)\n  -h, --help\n\nExamples\n  $ psm\n  $ psm --input package-script-manager.js  # Descriptive filename\n  $ psm --target package.dry.json  # Do a dry run\n  ', {
    alias: {
      i: 'input',
      t: 'target',
      h: 'help'
    }
  });

  // Set defaults that can be overridden by cli input position or flags
  var input = 'psm.js';
  var target = 'package.json';

  if (cli.input[0]) input = cli.input[0];
  if (cli.input[1]) target = cli.input[1];

  if (cli.flags.input) input = cli.flags.input;
  if (cli.flags.target) target = cli.flags.target;

  var cliInput = input;
  var cliTarget = target;

  input = _path2.default.resolve(input);
  target = _path2.default.resolve(target);

  var inputData = '';
  try {
    inputData = require(input);
  } catch (err) {
    console.error(err);
  }

  var targetData = JSON.parse(_fs2.default.readFileSync(target, 'utf8'));

  // if package.json is an empty object
  if (Object.keys(targetData).length === 0) {
    targetData['scripts'] = inputData;
  } else {
    // map over existing package.json for "scripts", if it exists, assign new scripts to it, else create it with new scripts
    Object.keys(targetData).map(function (key) {
      // if "scripts" exists in target package.json
      if (key === 'scripts') {
        // assign new scripts to it
        targetData[key] = inputData;
      } else {
        // create "scripts" in target package.json with new scripts
        targetData['scripts'] = inputData;
      }
    });
  }
  // add psm script to package.json
  targetData['scripts']['psm'] = 'psm ' + cliInput + ' ' + cliTarget;
  targetData['scripts']['psm:watch'] = 'chokidar ' + cliInput + ' -c \'npm run psm\'';

  // write new package.json to target
  _fs2.default.writeFileSync(target, JSON.stringify(targetData, null, 2));
}();

module.exports = exports['default'];
