import execa from "execa";
import fetch from "node-fetch";
import fse from 'fs-extra';

export const installBoogiDependencies = (ctx, task) => {
  setTimeout(() => {
    task.title = `${task.title} (this may take few minutes...)`
  }, 5000)
  return execa("yarn", {
    cwd: `${ctx.path}/.boogi/${ctx.version}`,
  }).catch((err) => console.log(err));
};

// install gatsby if does not exist in system.
// TODO verify minimal required version of gatsby
export const installGatsby = () =>
  execa("gatsby").catch((err) =>
    err.exitCode !== 1
      ? execa("yarn", ["global", "add", "gatsby-cli"])
      : Promise.resolve()
  );
  
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
    return fse.existsSync(path) ? Promise.resolve() : execa("git", [
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
  
  const initTheme = (basePath, boogiPath) => {
    return THEME_PATHS.reduce(async (previousPromise, themeFile) => {
      await previousPromise;
      const targetPath = `${basePath}/config/theme/${themeFile}`;
      return fse.existsSync(targetPath) ? Promise.resolve() : fse.copy(`${boogiPath}/src/theme/${themeFile}`, targetPath);
    }, Promise.resolve())
  };
  
  export const downloadBoogi = async (ctx, task) => {
    const path = resolveClonePath(ctx.path, ctx.version);
    return await clone(ctx.version, path, task)
      .then(() => initTheme(ctx.path, path))
      .then(() => cleanup(path, task));
  };
  