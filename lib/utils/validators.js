import chalk from "chalk";

class Validator {
  constructor(value, rule) {
    this.value = value;
    this.rule = rule;
  }

  validate() {
    return this.rule() === true;
  }
}

const fail = (message) => {
  console.log(chalk.red(` ${message}`));
  return false;
};

const wrap = (rules) => {
  return rules instanceof Array ? rules : [rules];
};

export default (value, rule) => {
  return rule(value) === true;
};

export const and = (...rules) => {
  const r = wrap(rules);
  return (value) => r.every((rule) => rule(value) === true);
};

export const or = (...rules) => {
  const r = wrap(rules);
  return (value) => r.some((rule) => rule(value) === true);
};

export const not = (rule) => (value) => {
  return rule(value) === false;
};

export const blank = (value) => {
  return value == null || value == undefined || value.length === 0
    ? true
    : false;
};

export const notBlank = (value) => {
  return value != null && value.length > 0
    ? true
    : fail("is required and must not be empty");
};

export const validURL = (str) => {
  try {
    new URL(str);
  } catch (_) {
    return fail("is not a valid URL");
  }
  return true;
};

export const greaterThan = (gt) => (num) => num > gt ? true : fail(`should be greater than ${gt}`)

export const greaterThanOrEqual = (gt) => (num) => num >= gt ? true : fail(`should be greater than or equal ${gt}`)

export const lessThan = (lt) => (num) => num < lt ? true : fail(`should be less than ${lt}`)

export const lessThanOrEqual = (lt) => (num) => num <= lt ? true : fail(`should be less than or equal ${lt}`)

export const validEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email) ? true : fail("is not valid email address");
};
