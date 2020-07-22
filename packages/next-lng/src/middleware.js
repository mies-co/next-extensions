import fs from "fs";
import path from "path";
import url from "url";

import getConfig from "next/config";

const { publicRuntimeConfig: { lngConfig: { path: lngPath = "/public/static/translations" } = {} } = {} } = getConfig();

const middleware = async (req, res) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");

	const { lng } = req.query;

	const lngPathRelative = lngPath.startsWith("/") ? lngPath.substr(1) : lngPath;

	// TODO add feature to filter files (common.json / footer.json / header.json etc.)
	const lngPathAbsolute = path.resolve(lngPathRelative, lng, "common.json");

	const translations = await new Promise((resolve, reject) => {
		fs.readFile(lngPathAbsolute, "utf8", (err, data) => {
			if (err) return reject(err);
			// data is a stringified json
			return resolve({ [lng]: JSON.parse(data) });
		});
	});

	res.end(JSON.stringify(translations));
};

// Support commonjs `require('@mies-co/next-lng/middleware')`
// For usage in custom server
module.exports = middleware;
exports = module.exports;

export default middleware;
