import chalk from "chalk";
import {
  readInitConfig,
  saveToInitConfig,
  emojify,
} from "../../utils/cli-helper";
import { installBoogiDependencies, installGatsby } from "../../utils/installer";
import { startSynchronization } from "../../utils/synchronizer";
import { clean, build, copyPublicDir } from "../../utils/gatsby";

const { runTasks, isBoogiApp } = require("../../utils/cli-helper");

exports.command = "build";

exports.describe = "Build a BooGi project.";

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
        title: "Resolving BooGi dependencies...",
        task: (ctx) => installBoogiDependencies(".", ctx.version),
      },
      {
        title: `:building_construction:  Building your BooGi project`,
        task: startSynchronization,
      },
    ],
    { ...argv }
  )
    .then((ctx) =>
      clean(ctx.version).then(() =>
        build(ctx.version).then(() => copyPublicDir(ctx.version))
      )
    )
    .then(() => {
      console.log(emojify(`${chalk.green("Project built! :package:")}`));
      process.exit(0);
    });
};
