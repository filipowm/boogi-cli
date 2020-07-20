import execa from "execa";


export const installBoogiDependencies = (path, version) => {
  console.log("INSTALLING DEPS IN", path, version)
    return execa("yarn", {
        cwd: `${path}/.boogi/${version}`,
      }).catch((err) => console.log(err));
}

export const installGatsby = () => execa("yarn", ["global", "add", "gatsby-cli"])