const path = require('path');

export const packageData = require('../../package.json');

export const root = () => {
  const fullPath = require.main.filename;
  return path.resolve(fullPath + '/../..');
};