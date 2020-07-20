import _ from "lodash";
import { ConfigBuilder, listPrompt } from "../../utils/inquirer-helper";
import metadata from "./config-metadata";
import pwa from "./config-pwa";
import header from "./config-header";
import sidebar from "./config-sidebar";
import search from "./config-search";
import features from "./config-features";
import rss from "./config-rss";
import social from "./config-social";
import chalk from "chalk";
import terminalLink from "terminal-link";
import { getAvailableVersions } from "./downloadBoogi";
import fs from "fs";
import yaml from "js-yaml";
import { saveToInitConfig } from "../../utils/cli-helper";

const fullAddIntro = () =>
  "You will be guided to set up most of the available settings.";
const basicAddIntro = () => `You will be guided to set up most important settings, for the rest defaults are applied. 
If you want to use full mode, add ${chalk.gray(
  "--full"
)} option to init command.`;

const intro = (full) =>
  `
Now wizard will walk you through a series of questions helping you set up your BooGi app.
For details or ${chalk.green("help")} visit ${terminalLink(
    "our docs",
    "https://boogi.netlify.app/configuration/setting-up"
  )}.

You are using ${chalk.yellow.dim(full ? "full" : "basic")} wizard. ${
    full ? fullAddIntro() : basicAddIntro()
  }
${chalk.yellow.dim(
  "You will be able to change any configuration at any time after initialization!"
)}

If you are not able to provide some configuration right away -- you can just skip it by pressing enter.
Default values are visible in gray color in ${chalk.gray(
    "(brackets)"
  )}. You can accept them by pressing enter.`;

const MINIMAL_BOOGI_VERSION = "v0.2.2".split(".");
const EXCLUDED_BOOGI_VERSIONS = [];

const toSupportedVersions = (availableVersions) => {
  return availableVersions
    .filter((version) => !EXCLUDED_BOOGI_VERSIONS.includes(version.value))
    .map((v) => {
      v.value = v.value.split(".");
      return v;
    })
    .filter((version) => {
      const value = version.value;
      return (
        value[0] > MINIMAL_BOOGI_VERSION[0] ||
        (value[0] === MINIMAL_BOOGI_VERSION[0] &&
          value[1] > MINIMAL_BOOGI_VERSION[1]) ||
        (value[0] === MINIMAL_BOOGI_VERSION[0] &&
          value[1] === MINIMAL_BOOGI_VERSION[1] &&
          value[2] >= MINIMAL_BOOGI_VERSION[2])
      );
    })
    .map((version) => {
      version.value = version.value.join(".");
      return version;
    });
};

const askVersion = () => {
  return getAvailableVersions().then((versions) => {
    const supportedVersions = toSupportedVersions(versions);
    supportedVersions[0].name += chalk.green.italic(" recommended");
    return [
      listPrompt(
        "version",
        "Select BooGi version to use:",
        supportedVersions.splice(0, 5),
        { default: 0, advanced: false }
      ),
    ];
  });
};

export const defaultConfig = (ctx) => ({
  metadata: {
    name: "My BooGi App",
    short_name: "BooGi",
    description: "My Awesome BooGi Application",
    language: "en",
    url: "http://localhost",
    pathPrefix: "/",
    gaTrackingId: null,
    favicon: "/assets/favicon.png",
    themeColor: "#0066cc",
  },
  header: {
    enabled: true,
    logo: "/assets/logo.png",
    links: [],
  },
  sidebar: {
    ignoreIndex: false,
    forcedNavOrder: [],
    expanded: [],
    groups: [],
    links: [],
    poweredBy: {},
  },

  pwa: {
    enabled: true, // disabling this will also remove the existing service worker.
    manifest: {
      icon: "/assets/logo.png",
      display: "minimal-ui",
      crossOrigin: "anonymous",
    },
  },
  features: {
    editOnRepo: {
      editable: true,
      location: ctx.gitInfo.url ? ctx.gitInfo.url : "",
      type: ctx.gitInfo.type ? ctx.gitInfo.type : "",
    },
    search: {
      enabled: false,
      indexName: "docs",
      showStats: true,
      pagination: {
        enabled: true,
      },
    },
    rss: {
      enabled: true,
      showIcon: true,
      copyright: "",
      categories: [],
      matchRegex: "^/",
      outputPath: "/rss.xml",
    },
  },
});

export const getVersion = (ctx) => {
  return new ConfigBuilder(ctx).nextAsync(askVersion);
};

export default (ctx) => {
  console.log();
  return new ConfigBuilder(ctx)
    .info(intro(ctx.full), "Before start...")
    .info(
      `While creating your own BooGi-based page, you should first set up metadata.
It defines core information about your page required for it to work, its identification and SEO.`,
      "Page Info"
    )
    .next(metadata)
    .info(
      "PWA is a web app that uses modern web capabilities to deliver an app-like experience to users.\nWe recommend enabling it cause it greatly improves user experience!",
      "Progressive Web App"
    )
    .next(pwa)
    .info("Set up app header", "Header")
    .next(header)
    .info(
      "Set up app navigation sidebar. You will be able to manage groups and advanced configuration later on.",
      "Sidebar"
    )
    .next(sidebar)
    .info(
      "Set up social buttons displayed in header. They allow you to link easily other social pages to your BooGi app.",
      "Social"
    )
    .next(social)
    .info(
      "Set up app search capabilities. As of now only Algolia search is supported (local search is coming soon)",
      "Search"
    )
    .next(search)
    .info("Set up RSS feed.", "RSS feed")
    .next(rss)
    .info("Set up additional app features.", "App features")
    .next(features(ctx))
    .info("");
};

export const applyConfig = (config, ctx) => {
  const def = defaultConfig(ctx);
  const finalConfig = _.merge(def, config);
  const yamlConfig = yaml.safeDump(finalConfig, { skipInvalid: true });
  fs.writeFileSync(`${ctx.path}/config/config.yml`, yamlConfig);
  saveToInitConfig(ctx.path, {
    version: ctx.version,
    name: finalConfig.metadata.name,
  });
};
