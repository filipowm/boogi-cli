import chalk from "chalk";
import fs from "fs";
import emoji from "node-emoji";
import execa from "execa";
import Listr from "listr";
import _ from "lodash";
import yaml from 'js-yaml';
import path from 'path';

export const printStep = (str) => {
  const arrow = chalk.green("->");
  console.log(`${arrow} ${str}`);
};

export const readInitConfig = (path) => yaml.safeLoad(fs.readFileSync(`${path}/.boogi/init.yml`));

export const saveToInitConfig = (path, data) => {
  const initData = readInitConfig(path);
  const targetData = _.merge(initData, data);
  const initConfigYaml = yaml.safeDump(targetData);
  fs.writeFileSync(`${path}/.boogi/init.yml`, initConfigYaml)
}

export const isBoogiApp = (path) => {
  try {
    return fs.existsSync(`${path}/.boogi`) && readInitConfig(path).version;
  } catch (err) {
    return false;
  }
};

export const explain = (message) => chalk.gray.dim.italic(message);

Function.prototype.clone = function () {
  var that = this;
  var temp = function temporary() {
    return that.apply(this, arguments);
  };
  for (var key in this) {
    if (this.hasOwnProperty(key)) {
      temp[key] = this[key];
    }
  }
  return temp;
};

export const emojify = (message) => emoji.emojify(message);

export const command = (message) => chalk.gray.italic(message);

export const simulate = (ctx, task) => {
  task.output = "simulating...";
  return execa("sleep", [Math.floor(Math.random() * (5 - 1)) + 1]);
};

export const logError = (err) => {
  let message = err.message;
  if (debugMode) {
    message = err;
  }
  console.error(message);
};

export const runTasks = (tasks, ctx) => {
  const context = _.merge({}, ctx);
  tasks.forEach(task => {
    if (! task.task) {
      task.task = simulate;
    }
    if (task.title) {
      task.title = emoji.emojify(task.title);
    }
  })
  return new Listr(tasks).run(context).catch(logError);
};

/**
 * Look ma, it's cp -R.
 * @param {string} src The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
export const copyRecursiveSync = (src, dest) => {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
                        path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

export const preInit = (ctx) => {
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