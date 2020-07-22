import { preInit } from "./cli-helper";
import { installGatsby, installBoogiDependencies, downloadBoogi as download } from "./installer";
import Listr from "listr";

export const verifyApp = () => ({
  title: `:zap: Verifying app...`,
  task: preInit,
});

export const downloadBoogi = () => ({
  title: `Downloading BooGi ...`,
  task: download,
});

export const downloadDependencies = () => ({
  title: ":floppy_disk: Downloading requirements...",
  task: () =>
    new Listr(
      [
        {
          title: `Installing BooGi dependencies`,
          task: installBoogiDependencies,
        },
        {
          title: `Installing Gatsby`,
          task: installGatsby,
        },
      ],
      { concurrent: true }
    ),
});
