import { conditionalWrapper, noneOption } from "../../utils/inquirer-helper";
import {
  or,
  validEmail,
  validURL,
  blank,
} from "../../utils/validators";
import inquirer from "inquirer";

const createPrompt = (name) =>
  "mail" === name || "gmail" === name ? emailPrompt(name) : socialPrompt(name);

const whenSelected = (name) => (answers) =>
  answers.__socialOptions ? answers.__socialOptions.includes(name) : false;

const socialPrompt = (name) => ({
  type: "input",
  name: `social.${name}`,
  message: `Provide link to ${name}:`,
  validate: or(blank, validURL),
  when: whenSelected(name),
  advanced: false
});

const emailPrompt = (name) => ({
  type: "input",
  name: "social.mail",
  message: `Provide email address for ${name}:`,
  validate: or(blank, validEmail),
  when: whenSelected(name),
  advanced: false
});

const socials = [
  "facebook",
  "github",
  "gitlab",
  "instagram",
  "linkedin",
  "mail",
  "gmail",
  "slack",
  "twitch",
  "twitter",
  "youtube",
];

const prompts = socials.map(createPrompt);

export default conditionalWrapper(
  "Do you want to configure social buttons?",
  [
    {
      type: "checkbox",
      name: "__socialOptions",
      message: "Which social buttons you want to configure?",
      choices: socials.concat([new inquirer.Separator(), noneOption]),
      advanced: false
    }
  ].concat(prompts)
);