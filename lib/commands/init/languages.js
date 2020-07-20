import { toChoices } from "../../utils/inquirer-helper";

const languages = {
  en: "English",
  ar: "Arabic",
  bn: "Bengali",
  zh: "Chinese",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  de: "German",
  el: "Greek",
  fi: "Finnish",
  fr: "French",
  he: "Hebrew",
  hi: "Hindi",
  id: "Indonesian",
  it: "Italian",
  ja: "Japanese",
  ko: "Korean",
  no: "Norwegian",
  fa: "Persian",
  pl: "Polish",
  pt: "Portuguese",
  ru: "Russian",
  es: "Spanish",
  sw: "Swahili",
  th: "Thai",
  tr: "Turkish",
  uk: "Ukrainian",
};

export default toChoices(languages);
