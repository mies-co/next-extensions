import fs from "fs";
import path from "path";
import url from "url";
import glob from "glob";

import deepmerge from "deepmerge";
import nookies from "nookies";

import getAbsoluteUrl from "@mies-co/next-utils/getAbsoluteUrl";

import getLngConfig, { demoTranslations } from "./lngConfig";

export const getTranslationsFromFiles = ({ lng, files = [], options, lngPath }) => {
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

		const language = translationPath
			.replace(lngPathAbsolute, "")
			.substr(1)
			.split("/")[0];
		if (!translations[language]) translations[language] = {};

		// As this is used in next.js bundled by webpack, require should be replaced by __non_webpack_require__
		// translations[language][filename] = require(translationPath);
		translations[language][filename] = JSON.parse(fs.readFileSync(translationPath, "utf8"));
	}

	return { translations, translationsIncluded, translationPaths };
};

const getServerSidePropsLng = async (context = {}, files, runtimeOptions = {}) => {
	const { languages = ["en"], path: lngPath = "public/static/translations", options: configOptions = {} } = getLngConfig();
	const options = deepmerge(runtimeOptions, configOptions, { arrayMerge: (a, b) => _.union(a, b) });

	let ctx = context;

	// In _app.js, it's appContext.ctx containing the ctx that we need here
	if (context.ctx) ctx = context.ctx;
	const { url: currentUrl } = ctx.req || {};

	const { cookie: cookieOptions } = options;

	const defaultLanguage = languages[0];
	let previousLng = defaultLanguage;

	const cookies = nookies.get(ctx);
	let { req = {}, query: { lng = cookies["next-lng"] || previousLng } = {} } = ctx;

	// DIRTY FIX - skip favicon.ico
	// ---
	// This is weird but how are we supposed to get around /favicon.ico?
	if (lng === "favicon.ico") lng = cookies["next-lng"] || previousLng;
	else {
		previousLng = lng;

		// COOKIES CREATION (INITIAL)
		// ---
		if (!cookies["next-lng"]) {
			nookies.set(ctx, "next-lng", lng, cookieOptions);
		}
	}

	const { translations, translationsIncluded, translationPaths } = getTranslationsFromFiles({ lng, files, options, lngPath });

	return {
		props: {
			lng,
			translations,
			translationsIncluded,
			translationPathsRelative: translationPaths.map(x => lngPath + x.split(lngPath)[1]), // this is just for debugging purposes
			options
		}
	};
};

export default getServerSidePropsLng;
