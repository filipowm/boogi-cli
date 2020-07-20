import fetch from "node-fetch";
import execa from "execa";

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

const cleanup = (path, task) => {
  task.output = "Cleaning up cloned BooGi repo";
  const toRemove = [
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
    ".git",
  ].map(file =>`${path}/${file}`);
  return execa("rm", ["-rf"].concat(toRemove));
};

const removeIfExists = (path, task) => {
  task.output = "Removing existing BooGi repo for selected version";
  return execa("rm", ["-rf", path]);
};

export const download = async (ctx, task) => {
  const path = resolveClonePath(ctx.path, ctx.version);
  return await removeIfExists(path, task)
    .then(() => clone(ctx.version, path, task))
    .then(() => cleanup(path, task));
};
