import execa from "execa";
import fs from 'fs-extra';

const cwd = (version) => `${process.cwd()}/.boogi/${version}`

export const develop = (port, version) =>
  wrap(execa("gatsby", ["develop", "-p", port ? port : 8000], { cwd: cwd(version)}));

export const clean = (version) => 
  wrap(execa("gatsby", ["clean"], { cwd: cwd(version)}));

export const build = (version) => wrap(execa("gatsby", ["build", "--prefix-paths"], { cwd: cwd(version)}));

export const copyPublicDir = (version) => fs.copy(`${cwd(version)}/public`, './public')

const wrap = (exec) => {
  exec.catch((err) => {
      console.log(err);
      process.exit(1);
  });
  exec.stdout.pipe(process.stdout);
  exec.stderr.pipe(process.stderr);
  exec.stdin.pipe(process.stdin);
  return exec;
};
