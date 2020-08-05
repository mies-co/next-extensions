const path = require("path");

const getStackStrace = require("./getStackStrace");
const log = console.log;

const chalk = require("chalk");

// Will add the path of our file in the console.
console.log = (...[init, ...rest]) => {
	let [name = "", filepath = ""] = getStackStrace();

	// Ignore hot reload
	if (name === "Object.wait" || name === "Object.event") return;

	if (typeof window === "undefined") {
		filepath = filepath.replace("webpack-internal:///", "");
		if (typeof filepath === "string") filepath = path.resolve(filepath);
		name = chalk.cyan(`---\n${name}`);
		filepath = chalk.gray(filepath);
	}

	const prefix = `${name}\n`;

	let parts = [prefix, init];
	if (rest.length) {
		parts = parts.concat(["\n", ...rest]);
	}

	// Object.error just provides the log.js path so it's not interesting
	if (!name.includes("Object.error") && !name.includes("Object.warn") && !name.includes("Object.info")) {
		parts = parts.concat([`\n\n`, filepath]);
	}

	return log(...parts);
};
