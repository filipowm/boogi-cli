import {
  togglePrompt,
  conditional,
  textPrompt,
  textToListPrompt,
} from "../../utils/inquirer-helper";
import { or, validEmail, blank } from "../../utils/validators";

export default [
  togglePrompt("features.rss.enabled", "Do you want to enable RSS feed?", {
    advanced: false,
  }),
  ...conditional(
    [
      togglePrompt(
        "features.rss.showIcon",
        "Should RSS feed icon be displayed in header?"
      ),
      textPrompt("features.rss.copyright", "Provide copyright notice:"),
      textPrompt(
        "features.rss.webMaster",
        "What is the email address for person responsible for technical issues relating to channel?",
        {
          validate: or(blank, validEmail),
        }
      ),
      textPrompt(
        "features.rss.managingEditor",
        "What is the email address for person responsible for editorial content?",
        {
          validate: or(blank, validEmail),
        }
      ),
      textToListPrompt(
        "features.rss.categories",
        "Provide comma-separated list of feed (app) categories:"
      ),
      textPrompt(
        "features.rss.outputPath",
        "Under what path RSS feed should be present?",
        { default: "/rss.xml" }
      ),
    ],
    (answers) => answers.features.rss.enabled === true
  ),
];

// rss: {
//     ttl: '60',
//     matchRegex: '^/',
//     generator: 'gidocs',
//   },
