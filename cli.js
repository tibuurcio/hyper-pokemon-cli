#!/usr/bin/env node
'use strict';

const meow = require('meow');
const hyperPokemon = require('./hyper-pokemon-cli');

const cli = meow(`
  Usage
    $ hyper-pokemon <input>

    Options
      --random, -r Set random pokemon

    Examples
      $ hyper-pokemon set
`, {
  alias: {
    r: 'random'
  }
});

hyperPokemon(cli.input, cli.flags);

