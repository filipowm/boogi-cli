import fetch from "node-fetch";
import execa from "execa";
import fs, { Stats } from "fs";

export const getAvailableVersions = async () => {
  const releases = await fetch(
    "https://api.github.com/repos/filipowm/boogi/releases"
  );

  return releases.json().then((data) =>
    data.map((release) => ({
      value: release.tag_name,
      name: release.name,
    }))
  );
};

const resolveClonePath = (path, version) => `${path}/.boogi/${version}`;

const clone = (version, path, task) => {
  task.output = "Cloning BooGi repo...";
  const branch = version === "latest" ? "master" : version;
  return execa("git", [
    "clone",
    "--depth=1",
    `--branch=${branch}`,
    "https://github.com/filipowm/BooGi.git",
    path,
  ]);
};

const removePath = (path) => {
  return fs.promises.stat(path).then((stats) => {
    if (stats.isDirectory()) {
      return fs.promises.rmdir(path, { recursive: true });
    } else if (stats.isFile()) {
      return fs.promises.unlink(path);
    }
    return Promise.resolve(path);
  }).catch(err => Promise.resolve(path)); // discard error (e.g. path not exists or not editable)
};

const cleanup = (path, task) => {
  task.output = "Cleaning up cloned BooGi repo";
  return [
    ".git",
    ".codacy.yml",
    ".dockerignore",
    ".editorconfig",
    ".gitignore",
    ".prettierrc",
    "netlify.toml",
    "renovate.json",
    ".github",
    "docker",
    "content",
    "config/config.yml",
    "config/jargon.yml",
    "scripts",
    "snippets",
  ]
    .map((file) => `${path}/${file}`)
    .reduce(async (previousPromise, path) => {
      await previousPromise;
      return removePath(path);
    }, Promise.resolve());
};

const THEME_PATHS = ['dark.js', 'light.js', 'defaultColors.js']

const copyFile = (src, dst) => {
  return fs.promises.copyFile()
}

const initTheme = (ctx, boogiPath) => {
  return THEME_PATHS.reduce(async (previousPromise, themeFile) => {
    await previousPromise;
    return fs.promises.copyFile(`${boogiPath}/src/theme/${themeFile}`, `${ctx.path}/config/theme/${themeFile}`);
  }, Promise.resolve())
};

const removeIfExists = (path, task) => {
  if (fs.existsSync(path)) {
    task.output = "Removing existing BooGi repo for selected version";
    return fs.promises.rmdir(path, { recursive: true });
  }
  return Promise.resolve(path);
};

export const download = async (ctx, task) => {
  const path = resolveClonePath(ctx.path, ctx.version);
  return await removeIfExists(path, task)
    .then(() => clone(ctx.version, path, task))
    .then(() => initTheme(ctx, path))
    .then(() => cleanup(path, task));
};
