
export const packageData = require('../../package.json');

export const root = () => {
    const fullPath = require.main.filename;
    const parts = fullPath.split("/");
    return parts.splice(0, parts.length - 2).join("/");
  };