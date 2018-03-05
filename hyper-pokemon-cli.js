const fs = require("fs");
const inquirer = require("inquirer");
const chalk = require("chalk");
const homeDir = require("home-dir");
const randomItem = require("random-item");
const yaml = require("js-yaml");
const log = console.log;

const hyperConfig = require(homeDir("/.hyper.js"));
const pokemonDir = homeDir(
  "/.hyper_plugins/node_modules/hyper-pokemon/"
);

if (!hyperConfig.plugins.includes("hyper-pokemon")) {
  log(
    chalk.red(
      "You doesn't seem to have 'hyper-pokemon' installed in your system"
    )
  );
  process.exit(1);
}

const listOfQuestions = availablePokemon => {
  return [
    {
      type: "list",
      name: "pokemon",
      message: "Choose which pokemon theme",
      choices: availablePokemon
    },
    {
      type: "list",
      name: "color",
      message: "Choose which color scheme",
      choices: ["light", "dark"]
    },
    {
      type: "input",
      name: "unibody",
      message:
        "unibody color? (header color is the same as the theme background) Y/n"
    }
  ];
};

const hyperPokemon = (inputs, flags) => {
  if (flags.random) {
    const currentPokemon = hyperConfig.config.pokemon;
    getAvailablePokemon()
      .then(data => {
        const availablePokemon = Object.keys(yaml.safeLoad(data).pokemon);
        const index = availablePokemon.indexOf(currentPokemon);
        if (index !== -1) {
          availablePokemon.splice(index, 1);
        }
        setPokemonToBe(randomItem(availablePokemon));
      });
  } else {
    askForPokemon();
  }
};

function setPokemonToBe(pokemon, color, unibody) {
  hyperConfig.config.pokemon = pokemon;
  hyperConfig.config.color = color ? color : 'dark';
  hyperConfig.config.unibody = unibody ? !(unibody === "n") : false;

  const json = JSON.stringify(hyperConfig, null, "  ").replace(
    /\"([^(\")"]+)\":/g,
    "$1:"
  );

  const fileContent = `module.exports = ${json};`;
  fs.writeFile(homeDir("/.hyper.js"), fileContent, "utf8", err => {
    if (err) throw err;
    log(
      `${chalk.green(
        "Success!"
      )} Your hyper-pokemon theme was changed to ${chalk.bold(
        color ? color : 'dark' + " " + pokemon
      )}
      Reload your terminal to see the changes!`
    );
  });
}

function askForPokemon() {
  getAvailablePokemon()
    .then(data => {
      const availablePokemon = Object.keys(yaml.safeLoad(data).pokemon);
      return inquirer.prompt(listOfQuestions(availablePokemon));
    })
    .then(answers => {
      const { pokemon, color, unibody } = answers;
      setPokemonToBe(pokemon, color, unibody);
    });
}

const getAvailablePokemon = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(pokemonDir + "/pokemon.yml", "utf-8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

module.exports = hyperPokemon;
