import { required } from "../../utils/inquirer-helper";

export default [
  {
    type: "confirm",
    name: "header.enabled",
    message: required("Do you want to enable page header?"),
    default: true,
  },
  // {
  //   type: "loop",
  //   name: "header.links",
  //   prompts: [
  //     {
  //       type: "input",
  //       name: "text",

  //     }
  //   ]
  // }
];

// header:
//   enabled: true
//   logo: ""
//   logoLink: "/"
//   helpUrl: ""
//   links:
//     - text: BooGi
//       link: https://github.com/filipowm/boogi
//       external: true
