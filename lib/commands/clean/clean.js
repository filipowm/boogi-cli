const { runTasks } = require("../../utils/cli-helper");
const { clean } = require("../../utils/gatsby");
const { verifyApp } = require("../../utils/steps");

exports.command = "clean";

exports.describe =
  "Clean up local environment (assets and cache)";

exports.handler = function (argv) {
  runTasks(
    [
      verifyApp(),
      {
        title: ':wastebasket: Cleaning caches...',
        task: (ctx) => clean(ctx.version),
      },
    ],
    { ...argv }
  );
};
