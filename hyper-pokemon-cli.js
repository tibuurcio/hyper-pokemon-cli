const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const homeDir = require('home-dir');
const log = console.log;

const hyperConfig = require(homeDir('/.hyper.js'));

if(!hyperConfig.plugins.includes('hyper-pokemon')) {
  log(chalk.red());
  process.exit(1);
}

const hyperPokemon = (inputs, flags) => {
  if(flags.random) {
    // setPokemonToBe(getRandomPokemon());
  }
  else {
    askForPokemon();
  }
};

function askForPokemon() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'pokemon',
      message: 'Choose which pokemon',
      choices: [
        'pikachu',
        'charmander',
        'bulbasaur',
        'squirtle'
      ]
    },
    {
      type: 'list',
      name: 'color',
      message: 'Choose which color scheme',
      choices: [
        'light',
        'dark'
      ]
    },
    {
      type: 'input',
      name: 'unibody',
      message: 'Is unibody? (header color is the same as the theme background) Y/n'
    }
  ]).then(answers => {
    const { pokemon, color, unibody } = answers;
    hyperConfig.config.pokemon = pokemon;
    hyperConfig.config.pokemonSyntax = color;
    hyperConfig.config.unibody = !(unibody === 'n');

    const json = JSON.stringify(hyperConfig, null, '  ').replace(/\"([^(\")"]+)\":/g,"$1:");
    const fileContent = `module.exports = ${json};`;

    fs.writeFile(homeDir('/.hyper.js'), fileContent, 'utf8', err => {
      if (err) throw err;
      log(
        `${chalk.green('Success!')} Your hyper-pokemon theme was changed to ${chalk.cyan(color + ' ' + pokemon)}
        Reload your terminal to see the changes!`
      );
    });
  });
}

module.exports = hyperPokemon;