import { required, toChoices, recommended } from "../../utils/inquirer-helper";
import {
  and,
  or,
  notBlank,
  blank,
  greaterThan,
  lessThanOrEqual,
} from "../../utils/validators";

const whenSearchEnabled = (answers) => answers.search.enabled === true;

export default [
  {
    type: "confirm",
    name: "search.enabled",
    message: required("Do you want to enable Algolia search?"),
    default: true,
  },
  {
    type: "list",
    name: "search.startComponent",
    message: "Which component should be used in header to initiate search?",
    choices: toChoices({
      icon: "Search icon",
      input: "Search input form",
    }),
    default: 0,
    when: whenSearchEnabled,
  },
  {
    type: "input",
    name: "search.placeholder",
    message: "What text should be displayed in search input placeholder?",
    default: "Search...",
    validate: notBlank,
    when: (answers) =>
      whenSearchEnabled(answers) && answers.search.startComponent === "input",
  },
  {
    type: "number",
    name: "search.debounceTime",
    message:
      "Time in milliseconds between last keystroke and invoking search operation:",
    advanced: true,
    suffix: "ms",
    default: 380,
    validate: or(blank, greaterThan(0)),
    when: whenSearchEnabled,
  },
  {
    type: "number",
    name: "search.snippetLength",
    message:
      "How many words of snippet should be displayed in a single search result?",
    advanced: true,
    default: 22,
    validate: or(blank, greaterThan(0)),
    when: whenSearchEnabled,
  },
  {
    type: "number",
    name: "search.hitsPerPage",
    message: "How many results should be displayed per one search page?",
    advanced: true,
    default: 10,
    validate: or(blank, greaterThan(0)),
    when: whenSearchEnabled,
  },
  {
    type: "confirm",
    name: "search.showStats",
    message:
      "Should search statistics (results count, search time) be displayed?",
    default: true,
    advanced: true,
    when: whenSearchEnabled,
  },
  {
    type: "confirm",
    name: "search.pagination.enabled",
    message: recommended("Should search pagination be enabled?"),
    default: true,
    when: whenSearchEnabled,
  },
  {
    type: "number",
    name: "search.pagination.totalPages",
    message: "Total number of search pages that can be displayed (max: 10)",
    advanced: true,
    validate: or(blank, and(greaterThan(0), lessThanOrEqual(10))),
    when: (answers) =>
      whenSearchEnabled(answers) && answers.search.pagination.enabled === true,
    default: 10,
  },
];
