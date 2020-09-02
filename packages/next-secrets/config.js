const extendNextConfig = require("@mies-co/next-utils/extendNextConfig");

module.exports = extendNextConfig({ webpack: [{ node: { fs: "empty" } }] });
exports = module.exports;
