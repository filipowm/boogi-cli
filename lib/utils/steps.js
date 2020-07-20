import { preInit } from "./cli-helper";
import { installGatsby, installBoogiDependencies } from "./installer";
import Listr from "listr";

export const verifyApp = () => ({
  title: `:zap: Verifying app...`,
  task: preInit,
});

export const downloadDependencies = () => ({
  title: ":floppy_disk: Downloading requirements...",
  task: (ctx) =>
    new Listr(
      [
        {
          title: `Downloading BooGi dependencies`,
          task: () => installBoogiDependencies(".", ctx.version),
        },
        {
          title: `Installing Gatsby`,
          task: installGatsby,
        },
      ],
      { concurrent: true }
    ),
});
