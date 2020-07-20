const chalk = require("chalk");
const figlet = require("figlet");

const welcome = () => {
  return chalk.blueBright(
    figlet.textSync("BooGi", { horizontalLayout: "fitted", font: "Doom" })
  );
};

export const cli = () => {
  console.log(welcome());
  const argv = require("yargs")
    .strict()
    .commandDir("commands/init")
    .commandDir("commands/develop")
    .commandDir("commands/build")
    .commandDir("commands/clean")
    .demandCommand()
    .option("debug", {
      alias: "d",
      type: "boolean",
      description: "Enable debugging mode",
    })
    .version(false)
    .help().argv;

  global.debugMode = argv.debug;
};
