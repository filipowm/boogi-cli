const { runTasks, preInit } = require("../../utils/cli-helper");
const { clean } = require("../../utils/gatsby");

exports.command = "clean";

exports.describe =
  "Clean up local environment (assets and cache)";

exports.handler = function (argv) {
  runTasks(
    [
      {
        title: `:zap: Verifying app...`,
        task: preInit,
      },
      {
        title: ':wastebasket: Cleaning caches...',
        task: (ctx) => clean(ctx.version),
      },
    ],
    { ...argv }
  );
};
