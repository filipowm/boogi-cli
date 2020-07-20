import chokidar from "chokidar";
import fs from "fs";

const targetPath = (path, version) => {
  const fullPath = path.startsWith("assets") ? `static/${path}` : path;
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
