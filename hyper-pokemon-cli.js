const fs = require("fs");
const inquirer = require("inquirer");
const chalk = require("chalk");
const homeDir = require("home-dir");
const log = console.log;

const hyperConfig = require(homeDir("/.hyper.js"));
const backgroundsFolder = homeDir(
  "/.hyper_plugins/node_modules/hyper-pokemon/backgrounds/"
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
    // setPokemonToBe(getRandomPokemon());
  } else {
    askForPokemon();
  }
};

function askForPokemon() {
  getAvailablePokemon()
    .then(files => {
      const availablePokemon = files.map(file => file.replace(".png", ""));
      return inquirer.prompt(listOfQuestions(availablePokemon));
    })
    .then(answers => {
      const { pokemon, color, unibody } = answers;
      hyperConfig.config.pokemon = pokemon;
      hyperConfig.config.pokemonSyntax = color;
      hyperConfig.config.unibody = !(unibody === "n");

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
          )} Your hyper-pokemon theme was changed to ${chalk.cyan(
            color + " " + pokemon
          )}
          Reload your terminal to see the changes!`
        );
      });
    });
}

const getAvailablePokemon = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(backgroundsFolder, (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
};

module.exports = hyperPokemon;
