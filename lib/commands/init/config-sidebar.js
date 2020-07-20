import { required, conditional } from "../../utils/inquirer-helper";

export default [
  {
    type: "confirm",
    name: "sidebar.enabled",
    message: required("Do you want to enable navigation sidebar?"),
    default: true,
  },
  ...conditional([
    {
      type: "confirm",
      name: "sidebar.ignoreIndex",
      message: "Do you want to hide index page from showing up in sidebar?",
      default: false,
      advanced: true,
    },
  ], answers => answers.sidebar.enabled === true)
];

// sidebar:
//   enabled: true
//   # forcedNavOrder:
//   #   - "/introduction"
//   #   - "/configuration/basic"
//   #   - "/configuration/advanced"
//   # expanded:
//   groups:
//     - order: 1
//       path: "/gettingstarted"
//       title: ":rocket: Getting Started"
//     - order: 2
//       path: "/configuration"
//       title: ":wrench: Configuration"
//     - order: 3
//       path: "/editing"
//       title: ":writing_hand: Editing Content"
//     - order: 4
//       path: "/deployment"
//       title: ":rocket: Deployment"
//     - order: 5
//       path: "/developing"
//       title: ":computer: Developing"
//   links:
//     - text: BooGi
//       link: https://github.com/filipowm/boogi
//     - text: React
//       link: https://reactjs.org
//   ignoreIndex: false
//   poweredBy:
//     trademark: "/assets/gatsby.png"
//     name: GatsbyJS
//     link: https://www.gatsbyjs.org
