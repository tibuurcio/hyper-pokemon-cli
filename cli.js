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
      $ hyper-pokemon
      Select from the list of available pokemon themes

      $ hyper-pokemon --random
      Set a random theme from the list of available themes
`, {
  alias: {
    r: 'random'
  }
});

hyperPokemon(cli.input, cli.flags);

