import chalk from "chalk";
import { readInitConfig, saveToInitConfig, preInit } from "../../utils/cli-helper";
import { installBoogiDependencies, installGatsby } from "../../utils/installer";
import { startSynchronization } from "../../utils/synchronizer";
import { develop, clean } from "../../utils/gatsby";
import Listr from 'listr';

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

exports.handler = function (argv) {
  runTasks(
    [
      {
        title: `:zap: Verifying app...`,
        task: preInit,
      },
      {
        title: ":floppy_disk: Downloading requirements...",
        task: (ctx) => new Listr([
          {
            title: `Downloading BooGi dependencies`,
            task: () => installBoogiDependencies(".", ctx.version),
          }, 
          {
            title: `Installing Gatsby`,
            task: installGatsby,
          },
        ], { concurrent: true }),
      },
      {
        title: `:computer: Starting development server on port ${argv.port}`,
        task: startSynchronization,
      },
    ],
    { ...argv }
  ).then((ctx) => develop(ctx.port, ctx.version));
};
