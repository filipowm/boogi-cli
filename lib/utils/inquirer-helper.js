import chalk from "chalk";
import inquirer from "inquirer";
import _ from "lodash";
import { explain } from "./cli-helper";

export const required = (message) =>
  `${chalk.red.italic("[required]")} ${message}`;
export const recommended = (message) =>
  `${message} ${chalk.blue.dim.italic("(recommended)")}`;

export const choice = (value, description) => ({
  name: `${value} ${description ? explain(" - " + description) : ""}`,
  value: value,
});

export const toChoices = (dictionary) =>
  Object.keys(dictionary).map((key) => ({
    name: dictionary[key],
    value: key,
  }));

export const noneOption = {
  name: "None of these",
  value: "__none",
};

export const skipRemainingOption = {
  name: "Skip remaining",
  value: "__skip",
};

export const loop = (questions, resultHandler, loopEndHandler) =>
  ask(
    questions.concat({
      name: "addMore",
      type: "confirm",
      message: "add more?",
    }),
    (answers) => {
      resultHandler(answers);
      if (answers.addMore) {
        loop(resultHandler);
      } else if (loopEndHandler) {
        loopEndHandler();
      }
    }
  );

export const ask = (questions, resultHandler) =>
  inquirer
    .prompt(questions)
    .then((answers) => {
      resultHandler(answers);
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.error(
          "Prompt couldn't be rendered because of environment issue"
        );
        process.exit(1);
      } else {
        console.error("Unexpected issue occurred");
        console.error(error);
        process.exit(2);
      }
    });

export const conditionalPrompt = (message) => ({
  type: "confirm",
  name: "__conditional",
  message: message,
  default: true,
});

export const conditionalWrapper = (message, questions) => {
  questions = conditional(
    questions,
    (answers) => answers.__conditional === true
  );
  questions.unshift(conditionalPrompt(message));
  return questions;
};

export const conditional = (questions, predicate) => {
  questions.forEach((q) => {
    if (q.when) {
      const currentWhen = q.when.clone();
      q.when = (answers) => currentWhen(answers) && predicate(answers) === true;
    } else {
      q.when = (answers) => predicate(answers) === true;
    }
  });
  return questions;
};

export class ConfigBuilder {
  constructor(ctx) {
    this.queue = [];
    this.result = {};
    this.advanced = ctx.advanced;
    this.resultHandler = (answers) =>
      _.merge(this.result, this.__cleanupAnswers(answers));
  }

  __filterOutAdvanced(questions) {
    if (!this.advanced) {
      return _.filter(questions, (q) => q.advanced !== true);
    }
    return questions;
  }

  __cleanupAnswers(answers) {
    return _.omitBy(answers, (v, k) => k.startsWith("__"));
  }

  __apply(action, append = true) {
    const funcToAdd = () =>
      action().then(() => (this.queue.length > 0 ? this.queue.shift()() : ""));
    append ? this.queue.push(funcToAdd) : this.queue.unshift(funcToAdd);
  }

  nextAsync(qFunc) {
    this.__apply(() =>
      qFunc().then((questions) => {
        const action = this.__createAction(questions);
        this.__apply(action, false);
      })
    );
    return this;
  }

  __createAction(questions) {
    const filtered = this.__filterOutAdvanced(questions);
    return () => ask(filtered, this.resultHandler);
  }

  next(questions) {
    const action = this.__createAction(questions);
    this.__apply(action);
    return this;
  }

  info(message, title) {
    const action = () =>
      new Promise((resolve) => {
        console.log("");
        if (title) {
          console.log(chalk.blue.bold(title));
        }
        if (message) {
          console.log(message);
        }
        resolve();
      });
    this.__apply(action);
    return this;
  }

  collect(handler) {
    if (handler) {
      const collectAction = () => handler(this.result);
      this.queue.push(collectAction);
    }
    this.queue.shift()();
  }
}

const ifOrElse = (options, optName, elseValue) =>
  options && options[optName] != null ? options[optName] : elseValue;

export const simplePrompt = (type, name, message, options, defaults) => ({
  type: type,
  name: name,
  message: message,
  default: ifOrElse(options, "default", defaults.default),
  advanced: ifOrElse(options, "advanced", defaults.advanced),
  when: ifOrElse(options, "when", () => true),
  choices: ifOrElse(options, "choices", []),
  validate: ifOrElse(options, "validate", () => true),
  filter: ifOrElse(options, "filter", (v) => v),
});

export const togglePrompt = (name, message, options) =>
  simplePrompt("confirm", name, message, options, {
    default: true,
    advanced: true,
  });

export const textPrompt = (name, message, options) =>
  simplePrompt("input", name, message, options, {
    default: null,
    advanced: true,
  });

export const numberPrompt = (name, message, options) =>
  simplePrompt("number", name, message, options, {
    default: null,
    advanced: true,
  });

export const listPrompt = (name, message, choices, options) =>
  simplePrompt(
    "list",
    name,
    message,
    {
      choices: choices,
      ...options,
    },
    {
      default: 0,
      advanced: true,
    }
  );

export const textToListPrompt = (name, message, options) =>
  textPrompt(name, message, {
    filter: (value) =>
      value.trim().length == 0 ? [] : value.split(",").map((v) => v.trim()),
    ...options,
  });
