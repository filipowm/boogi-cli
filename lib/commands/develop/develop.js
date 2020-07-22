import { startSynchronization } from "../../utils/synchronizer";
import { develop } from "../../utils/gatsby";
import { verifyApp, downloadDependencies, downloadBoogi } from "../../utils/steps";

const { runTasks } = require("../../utils/cli-helper");

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
      verifyApp(),
      downloadBoogi(),
      downloadDependencies(),
      {
        title: `:computer: Starting development server on port ${argv.port}`,
        task: startSynchronization,
      },
    ],
    { ...argv }
  ).then((ctx) => develop(ctx.port, ctx.version));
};
