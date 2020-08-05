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

	const { lng = defaultLanguage, files = [], options } = req.body;
	let translationsFiles = files;
	const { shallow } = options;

	const lngPathRelative = lngPath;
	const lngPathAbsolute = path.resolve(lngPathRelative);

	// Get all translation files -> [/Abs/path/to/fr/common.json] // -> [fr/common.json]
	const existingFiles = glob(path.resolve(`${lngPathRelative}/*/*.json`), { sync: true }); // .map((x) => x.replace(path.resolve(lngPathRelative), "").substr(1)); // mark: false, removes end / on directories

	let filePatterns = [];

	// Default behavior, get current language common.json
	if (!translationsFiles.length) {
		// TODO implement a way to not provide all languages at once?
		const fp = "*/*.json";
		translationsFiles = [fp];
	}

	for (let i = 0; i < translationsFiles.length; i++) {
		let filePattern = translationsFiles[i];

		if (!filePattern.includes("/")) {
			// For shallow routing, as we don't refetch the server, we need to provide all languages
			if (shallow) filePattern = `*/${filePattern}`;
			else filePattern = `${lng}/${filePattern}`;
		}
		if (!filePattern.endsWith(".json")) filePattern = `${filePattern}.json`;

		const fp = path.resolve(lngPathRelative, filePattern);
		filePatterns.push(fp);
	}

	const translationPaths = filePatterns.reduce((acc, filePattern) => {
		acc = acc.concat(glob(filePattern, { sync: true }));
		return acc;
	}, []);

	let translations = {};
	const translationsIncluded = [];

	for (let i = 0; i < translationPaths.length; i++) {
		const translationPath = translationPaths[i];
		const { name: filename } = path.parse(translationPath);
		if (!translationsIncluded.includes(filename)) translationsIncluded.push(filename);

		const language = translationPath.replace(lngPathAbsolute, "").substr(1).split("/")[0];
		if (!translations[language]) translations[language] = {};

		// As this is used in next.js bundled by webpack, require should be replaced by __non_webpack_require__
		// translations[language][filename] = require(translationPath);
		translations[language][filename] = JSON.parse(fs.readFileSync(translationPath, "utf8"));
	}

	res.end(JSON.stringify({ translations, translationsIncluded }));
};

export default middleware;
