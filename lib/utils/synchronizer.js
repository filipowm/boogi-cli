import chokidar from "chokidar";
import fse from "fs-extra";

const stripPath = (path, stripBy) => path.replace(stripBy, "");

const PATH_REWRITE = {
  assets: (path) => `static/${path}`, // assets => static/assets
  "config/theme": (path) => `src/${stripPath(path, "config/")}`, // config/theme => src/theme
};

const rewritePath = (path) => {
  for (let currentDir in PATH_REWRITE) {
    if (path.startsWith(currentDir)) {
      return PATH_REWRITE[currentDir](path);
    }
  }
  return path;
};

const targetPath = (path, version) => {
  const fullPath = rewritePath(path);
  return `.boogi/${version}/${fullPath}`;
};

export const startSynchronization = (ctx) => {
  const watcher = chokidar.watch("**/*", {
    persistent: true,

    ignored: [
      ".boogi/**",
      "package.json",
      "node_modules/**",
      "yarn.lock",
      "package-lock.json",
      "public/**",
      "public.zip"
    ],
    ignoreInitial: false,
    followSymlinks: true,
  });

  const copy = (path) => fse.copy(path, targetPath(path, ctx.version));

  const createDir = (path) => fse.ensureDir(targetPath(path, ctx.version));

  const remove = (path) => fse.remove(targetPath(path, ctx.version));

  watcher
    .on("add", copy)
    .on("change", copy)
    .on("unlink", remove)
    .on("addDir", createDir)
    .on("unlinkDir", remove);
};
