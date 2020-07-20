import { recommended, choice } from "../../utils/inquirer-helper";
import { notBlank } from "../../utils/validators";

export default [
  {
    type: "confirm",
    name: "pwa.enabled",
    message: recommended("Do you want to enable PWA?"),
    validate: notBlank,
    default: true,
  },
  {
    type: "list",
    name: "pwa.manifest.display",
    message: "Customize what browser UI is shown when your app is launched",
    choices: [
      choice(
        "browser",
        "The application opens in a conventional browser tab or new window (default)"
      ),
      choice(
        "minimal-ui",
        "The application will look and feel like a standalone application, but will have a minimal set of UI elements for controlling navigation"
      ),
      choice(
        "standalone",
        "The application will look and feel like a standalone application"
      ),
      choice(
        "fullscreen",
        "All of the available display area is used and no user agent chrome is shown"
      ),
    ],
    default: 0,
    advanced: true,
    when: (answers) => answers.pwa.enabled === true,
  },
  {
    type: "list",
    name: "pwa.manifest.crossOrigin",
    message: "Enable sharing resources via cookies? (disabled is recommended)",
    filter: (value) => (value === "Yes" ? "use-credentials" : "anonymous"),
    choices: ["No", "Yes"],
    default: 0,
    advanced: true,
    when: (answers) => answers.pwa.enabled === true,
  },
];
