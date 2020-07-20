import execa from "execa";

export const installBoogiDependencies = (path, version) => {
  return execa("yarn", {
    cwd: `${path}/.boogi/${version}`,
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
