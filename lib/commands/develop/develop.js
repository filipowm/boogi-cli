import chalk from "chalk";
import { readInitConfig, saveToInitConfig } from "../../utils/cli-helper";
import { installBoogiDependencies, installGatsby } from "../../utils/installer";
import { startSynchronization } from "../../utils/synchronizer";
import { develop, clean } from "../../utils/gatsby";

const { runTasks, isBoogiApp } = require("../../utils/cli-helper");

exports.command = "develop";

exports.describe =
  "Start development server with live (hot) reload when something changes.";

exports.builder = (yargs) => {
  yargs.option("p", {
    describe: "Set port",
    alias: "port",
    default: "8000",
    type: "number",
  });
};

const preInit = (ctx) => {
  if (!isBoogiApp(process.cwd())) {
    throw new Error(
      chalk.red(
        `BooGi is not initialized in this directory. Run ${chalk.gray(
          "boogi init"
        )} first`
      )
    );
  }
  const initDetails = readInitConfig(".");
  ctx.version = initDetails.version;
  ctx.name = initDetails.name;
  return true;
};

exports.handler = function (argv) {
  runTasks(
    [
      {
        title: `:zap: Verifying app...`,
        task: preInit,
      },
      {
        title: `Installing Gatsby`,
        task: installGatsby,
      },
      {
        title: "Downloading dependencies...",
        task: (ctx) => installBoogiDependencies(".", ctx.version),
      },
      {
        title: `:computer: Starting development server on port ${argv.port}`,
        task: startSynchronization,
      },
    ],
    { ...argv }
  ).then((ctx) => {
    clean(ctx.version).then(() => develop(ctx.port, ctx.version));
  });
};
