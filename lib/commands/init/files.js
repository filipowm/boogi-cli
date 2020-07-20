import fs from "fs";
import fse from "fs-extra";
import handlebars from "handlebars";
import path from "path";
import { root, packageData } from "../../utils/package";

handlebars.registerHelper("notBlank", function (value) {
  return value !== null && value !== undefined && value.length > 0;
});

const DIRS = [
  "content",
  "assets",
  "snippets",
  "config",
  ".boogi",
  "config/theme",
];

const createDir = (task, path) => {
  task.output = `Creating directory: ${path}...`;
  fse.ensureDirSync(path);
};

export const initDirectories = (ctx, task) => {
  DIRS.forEach((dir) => createDir(task, `${ctx.path}/${dir}`));
};

class CompiledTemplated {
  constructor(name, content) {
    this.content = content;
    this.name = name;
  }

  save(path) {
    fs.writeFileSync(`${path}/${this.name}`, this.content, {
      encoding: "utf8",
      flag: "w",
    });
  }

  get() {
    return this.content;
  }
}

class FileTemplater {
  constructor(config, templatesRootDir) {
    this.config = config;
    this.templatesRootDir = templatesRootDir;
  }

  _readTemplate(file) {
    return fs.readFileSync(`${this.templatesRootDir}/${file}`, {
      encoding: "utf8",
      flag: "r",
    });
  }

  fromTemplate(file) {
    const template = this._readTemplate(file);
    const content = handlebars.compile(template)(this.config);
    return new CompiledTemplated(file, content);
  }
}

const traverse = (baseDir, dir, copy, create) => {
  fs.readdirSync(dir).forEach((file) => {
    let fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      traverse(baseDir, fullPath, copy, create);
    } else {
      const relPath = fullPath.replace(`${baseDir}/`, "");
      const parts = relPath.split(".");
      const extension = parts[parts.length - 1].toLowerCase();
      if (
        ["txt", "md", "mdx", "yml", "yaml", "json", "toml", "js"].includes(
          extension
        )
      ) {
        create(relPath);
      } else {
        copy(fullPath, relPath);
      }
    }
  });
};

export const initFiles = (config, ctx, task) => {
  const templatesRootDir = root() + "/assets/templates";
  const fullConfig = { package: packageData, context: ctx, config: config };
  const templater = new FileTemplater(fullConfig, templatesRootDir);
  const create = (name) => {
    task.output = `Initializing file: ${name}`;
    const template = templater.fromTemplate(name);
    template.save(ctx.path);
  };
  const copy = (src, dest) => {
    task.output = `Copying file : ${dest}`;
    fse.copyFileSync(src, `${ctx.path}/${dest}`);
  };
  traverse(templatesRootDir, templatesRootDir, copy, create);
};
