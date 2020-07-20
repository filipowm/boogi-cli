import chalk from "chalk";
import {
  emojify,
  preInit,
} from "../../utils/cli-helper";
import { installBoogiDependencies, installGatsby } from "../../utils/installer";
import { startSynchronization } from "../../utils/synchronizer";
import { build, copyPublicDir } from "../../utils/gatsby";
import Listr from 'listr';

const { runTasks } = require("../../utils/cli-helper");

exports.command = "build";

exports.describe = "Build a BooGi project.";

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
        title: `:building_construction:  Building your BooGi project`,
        task: startSynchronization,
      },
    ],
    { ...argv }
  )
    .then((ctx) =>
        build(ctx.version).then(() => copyPublicDir(ctx.version))
    )
    .then(() => {
      console.log(emojify(`${chalk.green("Project built! :package:")}`));
      process.exit(0);
    });
};
