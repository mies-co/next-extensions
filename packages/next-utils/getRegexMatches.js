const getRegexMatches = (str, regex, { debug = false } = {}) => {
	let m;
	let matches = [];

	// The result can be accessed through the `m`-variable.
	if ((m = regex.exec(str)) !== null) {
		m.forEach((match, groupIndex) => {
			if (debug) console.log(`Found match, group ${groupIndex}: ${match}`);
			matches.push(match);
		});
	}

	return matches;
};

module.exports = getRegexMatches;
exports = module.exports;
