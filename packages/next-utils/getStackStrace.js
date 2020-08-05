const getRegexMatchs = require("./getRegexMatches");

const getStackStrace = (line = 3) => {
	const { stack } = new Error();

	const str = stack.split("at ")[line].trim();
	return getRegexMatchs(str, /^(.*)(?:\s+)(?:\()(.*)(?:\))$/gm).slice(1);
};

module.exports = getStackStrace;
exports = module.exports;
