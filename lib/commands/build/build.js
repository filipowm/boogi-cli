import chalk from "chalk";
import { emojify } from "../../utils/cli-helper";
import { startSynchronization } from "../../utils/synchronizer";
import { build, copyPublicDir } from "../../utils/gatsby";
import fs from "fs";
import archiver from "archiver";
import { verifyApp, downloadDependencies } from "../../utils/steps";

const { runTasks } = require("../../utils/cli-helper");

exports.command = "build";

exports.describe = "Build a BooGi project.";

exports.builder = (yargs) => {
  yargs.option("a", {
    describe: "Archive (zip) build directory",
    alias: "archive",
    default: false,
    type: "boolean",
  });
};

const archivePublicDir = () => {
  console.log("Archiving results...");
  var output = fs.createWriteStream(process.cwd() + "/public.zip");
  var archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });
  output.on("error", (err) => console.log(err.message));
  archive.on("error", (err) => console.log(err.message));

  archive.directory(process.cwd() + "/public/", false).pipe(output);
  return archive.finalize().catch((err) => console.log(err.message));
};

exports.handler = function (argv) {
  runTasks(
    [
      verifyApp(),
      downloadDependencies(),
      {
        title: `:building_construction:  Building your BooGi project`,
        task: startSynchronization,
      },
    ],
    { ...argv }
  )
    .then((ctx) =>
      build(ctx.version)
        .then(() => copyPublicDir(ctx.version))
        .then(() =>
          ctx.archive === true ? archivePublicDir() : Promise.resolve()
        )
    )
    .then(() => {
      console.log(emojify(`${chalk.green("\nProject built! :package:\n")}`));
      process.exit(0);
    });
};
