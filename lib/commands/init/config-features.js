import {
  listPrompt,
  textPrompt,
  numberPrompt,
  togglePrompt,
  toChoices,
  conditional,
  textToListPrompt,
} from "../../utils/inquirer-helper";
import { validURL, greaterThan } from "../../utils/validators";
import terminalLink from "terminal-link";
// hasRemote: true,
//             type: details.type,
//             domain: details.domain,
//             project: details.project,
//             user: details.user,
//             url: upstream
export default (ctx) => [
  listPrompt(
    "features.editOnRepo.type",
    "In which repository do you keep this app?",
    toChoices({
      github: "Github",
      gitlab: "GitLab",
      bitbucket: "Bitbucket",
      __none: "None of the above",
    }),
    { default: ctx.gitInfo.type ? ctx.gitInfo.type : 0, advanced: false }
  ),
  ...conditional(
    [
      togglePrompt(
        "features.editOnRepo.editable",
        "Do you want to globally show Edit on Repo button on every page? (it can be overriden per page)"
      ),
      textPrompt(
        "features.editOnRepo.location",
        "What is the address to your Git repository?",
        {
          default: ctx.gitInfo.url ? ctx.gitInfo.url : "http://localhost",
          validate: validURL,
          advanced: false,
        }
      ),
    ],
    (answers) =>
      answers.features.editOnRepo.type &&
      answers.features.editOnRepo.type !== "__none"
  ),

  togglePrompt(
    "features.darkMode.enabled",
    "Do you want to enable dark mode (light/dark theme mode)?",
    { advanced: false }
  ),
  togglePrompt(
    "features.darkMode.default",
    "Should dark theme be the default theme?",
    {
      default: false,
      when: (answers) => answers.features.darkMode.enabled === true,
      advanced: false,
    }
  ),

  togglePrompt(
    "features.scrollTop",
    "Do you want to enable scroll to top button?"
  ),
  togglePrompt(
    "features.showMetadata",
    "Do you want to display page metadata (latest editor, last edit date) on every page below the page title? It can be overriden per page."
  ),
  togglePrompt(
    "features.propagateNetlifyEnv",
    "Do you want to use Netlify environment configuration (page URL, app repo location)?"
  ),

  togglePrompt(
    "features.previousNext.enabled",
    "Do you want to show at the bottom of every page button to easily navigate between previous and next pages?"
  ),
  togglePrompt(
    "features.previousNext.arrowKeyNavigation",
    "Do you want to enable switching between previous/next pages using left/right arrow keys?",
    {
      when: (answers) => answers.features.previousNext.enabled === true,
    }
  ),

  togglePrompt(
    "features.toc.show",
    "Do you want to enable Table of Contents globally? (can be overriden per page)"
  ),
  numberPrompt(
    "features.toc.depth",
    "What should be the depth (number of levels) of Table of Contents?",
    {
      default: 3,
      when: (answers) => answers.features.toc.show === true,
    }
  ),

  listPrompt(
    "features.mermaid.theme",
    `Which Mermaid diagrams theme you want to use? You can check them ${terminalLink(
      "here",
      "https://mermaid-js.github.io/mermaid-live-editor"
    )}`,
    toChoices({
      default: "Light",
      dark: "Dark",
      forest: "Forest",
      neutral: "Neutral (gray)",
    }),
    { default: 1 }
  ),

  togglePrompt(
    "features.pageProgress.enabled",
    "Do you want to enable page progress bar that tracks a users progress through a page as they scroll?"
  ),
  ...conditional(
    [
      textToListPrompt(
        "features.pageProgress.includePaths",
        "On which pages progress bar should be visible? Define page path regex."
      ),
      textToListPrompt(
        "features.pageProgress.excludePaths",
        "On which pages progress bar should not be visible? Define page path regex."
      ),
      numberPrompt(
        "features.pageProgress.height",
        "What should be the height (in pixels) of the progress bar?",
        { validate: greaterThan(0) }
      ),
      textPrompt(
        "features.pageProgress.color",
        "What should be the color of the progress bar?"
      ),
    ],
    (answers) => answers.features.pageProgress.enabled === true
  ),

  // numberPrompt('mermaid.height', 'What should be the default Mermaid diagram height?', {
  //   default: 300,
  //   when: answers => answers.features.toc.show === true,
  //   validate: greaterThan(0)
  // }),
  // numberPrompt('mermaid.width', 'What should be the default Mermaid diagram height?', {
  //   default: 300,
  //   when: answers => answers.features.toc.show === true,
  //   validate: greaterThan(0)
  // }),
];
