const _ = require("lodash");

const slugify = (str) => _.kebabCase(_.lowerCase(_.deburr(str)));

module.exports = slugify;
exports = module.exports;
