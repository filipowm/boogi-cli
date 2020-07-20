import fs from "fs";
import handlebars from "handlebars";
import path from "path";
import _ from "lodash";

handlebars.registerHelper("notBlank", function (value) {
  return value !== null && value !== undefined && value.length > 0;
});

const DIRS = ["content", "assets", "snippets", "config", ".boogi"];

export const createGitignore = (basePath) => {};

const createDir = (task, path) => {
  if (!fs.existsSync(path)) {
    task.output = `Creating directory: ${path}...`;
    fs.mkdirSync(path, { recursive: true });
  }
};

export const initDirectories = (ctx, task) => {
  const basePath = ctx.path;
  DIRS.forEach((dir) => createDir(task, `${ctx.path}/${dir}`));
};

const root = () => {
  const fullPath = require.main.filename;
  const parts = fullPath.split("/");
  return parts.splice(0, parts.length - 2).join("/");
};

const fromTemplate = (file, config) => {
  const content = fs.readFileSync(`${root()}/assets/templates/${file}`, {
    encoding: "utf8",
    flag: "r",
  });
  const template = handlebars.compile(content);
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
  const templater = new FileTemplater(config, templatesRootDir);
  const create = (name) => {
    task.output = `Initializing file: ${name}`;
    const template = templater.fromTemplate(name);
    template.save(ctx.path);
  };
  const copy = (src, dest) => {
    task.output = `Copying file : ${dest}`;
    fs.copyFileSync(src, `${ctx.path}/${dest}`);
  };
  traverse(templatesRootDir, templatesRootDir, copy, create);

  // const defaults = require(`${process.cwd()}/test/.boogi/v0.2.1/config/default.js`)
  // const finalConfig = _.merge(defaults, config);
  // console.log(finalConfig)
  // var data = fs.readFileSync('./.js');
  // const script = new vm.Script(data);
  // script.runInThisContext();
};
