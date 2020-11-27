import {
  isBoogiApp,
  emojify,
  command,
  runTasks,
} from "../../utils/cli-helper";
import Listr from "listr";
import { initDirectories, initFiles } from "./files";
import config, { applyConfig, getVersion } from "./config";
import {
  describeRemote,
  initIfNotInitialized,
  commitAfterBooGiInit,
} from "../../utils/git";
import chalk from "chalk";
import pathFunc from "path";
import { installGatsby } from "../../utils/installer";
import { downloadBoogi } from "../../utils/steps";

exports.command = "init [path]";

exports.describe = "Initialize BooGi project with configuration wizard";

exports.builder = (yargs) => {
  yargs
    .option("full", {
      describe: "Use full configuration wizard",
      alias: "f",
      default: false,
      type: "boolean",
    })
    .option("skip-config", {
      describe: "Skip configuration wizard. Default config will be created",
      default: false,
      alias: "skip",
      type: "boolean",
    })
    .positional("path", {
      describe:
        "Path where BooGi project will be initialized. Defaults to current directory.",
      type: "string",
      default: ".",
    });
};

const verifyBoogiApp = (ctx) => {
  return new Promise((resolve, reject) => {
    if (isBoogiApp(ctx.path)) {
      reject(new Error("BooGi was already initialized!"));
    } else {
      resolve();
    }
  })
};

const logDone = () =>
  console.log(
    emojify(
      `\n:rocket: ${chalk.green(
        "Done!"
      )} You can now start your app with ${command(
        "boogi develop"
      )} or build it with ${command("boogi build")} :fire:`
    )
  );

const finalize = (config, parentCtx) => {
  runTasks(
    [
      {
        title: `:zap: Creating files`,
        task: (ctx, task) => initFiles(config, ctx, task),
      },
      {
        title: ":gear:  Applying configuration",
        task: (ctx) => applyConfig(config, ctx),
      },
      {
        title: `:floppy_disk: Downloading required dependencies`,
        task: (ctx) =>
          new Listr([
            downloadBoogi(ctx.version),
            {
              title: `Installing Gatsby`,
              task: installGatsby,
            },
          ], { concurrent: true }),
      },
      {
        title: "Making first commit",
        task: (ctx) => commitAfterBooGiInit(ctx.path),
      },
    ],
    parentCtx
  ).then(logDone);
};

exports.handler = async function (argv) {
  let gitInfo = {};
  const path = pathFunc.isAbsolute(argv.path)
    ? argv.path
    : `${process.cwd()}/${argv.path}`;

  runTasks(
    [
      {
        title: `:microscope: Checking if BooGi is already initialized in ${argv.path}`,
        task: verifyBoogiApp,
      },
      {
        title: ":open_file_folder: Creating required directories",
        task: initDirectories,
      },
      {
        title: ":evergreen_tree: Preparing Git repo",
        task: async (ctx, task) => {
          task.output = "Initializing Git repo (if not initialized yet)";
          await initIfNotInitialized(ctx.path);
          task.output = "Getting Git remote details";
          gitInfo = await describeRemote(ctx.path);
        },
      },
      {
        title: ":mage: Now configuration wizard will help you set up BooGi",
        task: () => Promise.resolve(),
        skip: (ctx) => ctx.skipConfig === true,
      },
    ],
    { ...argv, gitInfo: gitInfo, path: path }
  ).then((ctx) => {
    if (typeof ctx !== "object") {
        return false;
    }
    getVersion(ctx).collect((result) => {
      ctx.version = result.version;
      configure(ctx);
    });
  });
};

const configure = (ctx) => {
  if (ctx.skipConfig === true) {
    finalize({ version: "latest" }, ctx);
  } else {
    config(ctx).collect((config) => finalize(config, ctx));
  }
};
