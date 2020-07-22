import fs from "fs";
import path from "path";
import url from "url";
import glob from "glob";

import lngConfig, { demoTranslations } from "./config";

const { languages = ["en"], path: lngPath = "public/static/translations" } = lngConfig;
const defaultLanguage = languages[0];

const middleware = async (req, res) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");

	const { lng = defaultLanguage, files, options } = req.body;
	const { shallow } = options;

	const lngPathRelative = lngPath;
	const lngPathAbsolute = path.resolve(lngPathRelative);

	// Get all translation files -> [/Abs/path/to/fr/common.json] // -> [fr/common.json]
	const existingFiles = glob(path.resolve(`${lngPathRelative}/*/*.json`), { sync: true }); // .map((x) => x.replace(path.resolve(lngPathRelative), "").substr(1)); // mark: false, removes end / on directories

	let filePatterns = [];

	// Default behavior, get current language common.json
	if (!files) {
		let fp = path.resolve(lngPathRelative, lng, "common.json");

		// For shallow routing, as we don't refetch the server, we need to provide all languages
		if (shallow) fp = path.resolve(lngPathRelative, "*", "common.json");
		filePatterns = [fp];
	} else {
		for (let i = 0; i < files.length; i++) {
			let filePattern = files[i];

			if (!filePattern.includes("/")) filePattern = `${lng}/${filePattern}`;
			if (!filePattern.endsWith(".json")) filePattern = `${filePattern}.json`;

			const fp = path.resolve(lngPathRelative, filePattern);
			filePatterns.push(fp);
		}
	}

	const translationPaths = filePatterns.reduce((acc, filePattern) => {
		acc = acc.concat(glob(filePattern, { sync: true }));
		return acc;
	}, []);

	let translations = {};

	for (let i = 0; i < translationPaths.length; i++) {
		const translationPath = translationPaths[i];
		const language = translationPath.replace(lngPathAbsolute, "").substr(1).split("/")[0];
		translations[language] = require(translationPath);
	}

	res.end(JSON.stringify(translations));
};

// Support commonjs `require('@mies-co/next-lng/middleware')`
// For usage in custom server
module.exports = middleware;
exports = module.exports;

export default middleware;
