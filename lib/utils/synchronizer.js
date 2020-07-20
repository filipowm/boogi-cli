import chokidar from "chokidar";
import fs from "fs";

const stripPath = (path, stripBy) => path.replace(stripBy, '')

const PATH_REWRITE = {
  "assets": path => `static/${path}`, // assets => static/assets
  "config/theme": path => `src/${stripPath(path, 'config/')}` // config/theme => src/theme
}

const rewritePath = (path) => {
  for (let currentDir in PATH_REWRITE) {
    if (path.startsWith(currentDir)) {
      return PATH_REWRITE[currentDir](path);
    }
  }
  return path;
}

const targetPath = (path, version) => {
  const fullPath = rewritePath(path);
  return `.boogi/${version}/${fullPath}`;
};

export const startSynchronization = (ctx) => {
  const watcher = chokidar.watch("**/*", {
    persistent: true,

    ignored: ".boogi/**",
    ignoreInitial: false,
    followSymlinks: true,
  });

  const copyFile = (path) => {
    const finalPath = path.starts;
    fs.copyFile(path, targetPath(path, ctx.version), () => true);
  };

  const deleteFile = (path) => {
    fs.unlink(targetPath(path, ctx.version), () => true);
  };

  const createDir = (path) => {
    fs.mkdir(targetPath(path, ctx.version), { recursive: true }, () => true);
  };

  const deleteDir = (path) => {
    fs.rmdir(targetPath(path, ctx.version), { recursive: true }, () => true);
  };

  watcher
    .on("add", copyFile)
    .on("change", copyFile)
    .on("unlink", deleteFile)
    .on("addDir", createDir)
    .on("unlinkDir", deleteDir);
};
