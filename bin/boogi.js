#!/usr/bin/env node

// eslint-disable-next-line no-global-assign
require = require('esm')(module /*, options*/);
require('../lib/cli').cli(process.argv);