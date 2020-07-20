import fetch from "node-fetch";
import execa from "execa";
import fse from 'fs-extra';

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

const removePath = (path) => fse.remove(path).catch(() => Promise.resolve())

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

const initTheme = (ctx, boogiPath) => {
  return THEME_PATHS.reduce(async (previousPromise, themeFile) => {
    await previousPromise;
    return fse.copy(`${boogiPath}/src/theme/${themeFile}`, `${ctx.path}/config/theme/${themeFile}`);
  }, Promise.resolve())
};

const removeIfExists = (path, task) => {
  task.output = "Removing existing BooGi repo for selected version";
  return fse.remove(path);
};

export const download = async (ctx, task) => {
  const path = resolveClonePath(ctx.path, ctx.version);
  return await removeIfExists(path, task)
    .then(() => clone(ctx.version, path, task))
    .then(() => initTheme(ctx, path))
    .then(() => cleanup(path, task));
};
