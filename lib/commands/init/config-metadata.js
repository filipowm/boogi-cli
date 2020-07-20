import { required, noneOption } from "../../utils/inquirer-helper";
import inquirer from "inquirer";
import languages from "./languages";
import {
  and,
  notBlank,
  validURL,
} from "../../utils/validators";

export default [
  {
    type: "input",
    name: "metadata.name",
    message: required("Name of your page:"),
    validate: notBlank,
  },
  {
    type: "input",
    name: "metadata.short_name",
    message: required("Short name (e.g. abbreviation) of your page:"),
    default: (answers) => answers.metadata.name,
    validate: notBlank,
  },
  {
    type: "input",
    name: "metadata.description",
    message: "Description of your website. Used to improve website SEO.",
  },
  {
    type: "list",
    name: "metadata.language",
    message: required(`Language of your website:`),
    default: "en",
    choices: [
      new inquirer.Separator(),
      noneOption,
      new inquirer.Separator(),
    ].concat(languages),
    validate: notBlank,
  },
  {
    type: "input",
    name: "metadata.url",
    message: required("Full URL to your website, e.g. https://mysite.com:"),
    validate: and(notBlank, validURL),
    default: 'http://localhost'
  },
  {
    type: "input",
    name: "metadata.pathPrefix",
    message:
      "Prefix defined within your reverse proxy or web server, on which this page is hosted. It can be also referred to as context",
    default: "/",
    advanced: true,
  },
  {
    type: "input",
    name: "metadata.gaTrackingId",
    message: "Provide Google Analytics Tracking ID. When set GA will be enabled:",
    advanced: true
  },
];
