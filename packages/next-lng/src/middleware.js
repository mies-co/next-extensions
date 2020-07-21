import fs from "fs";
import path from "path";
import url from "url";

import getConfig from "next/config";

const { publicRuntimeConfig: { lngConfig: { path: lngPath = "/public/static/translations" } = {} } = {} } = getConfig();

export default async (req, res) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");

	const { lng } = req.query;
	const lngPathRelative = lngPath.startsWith("/") ? lngPath.substr(1) : lngPath;
	const lngPathAbsolute = path.resolve(lngPathRelative, `${lng}.json`);

	const translations = await new Promise((resolve, reject) => {
		fs.readFile(lngPathAbsolute, "utf8", (err, data) => {
			if (err) return reject(err);
			// data is a stringified json
			return resolve({ [lng]: JSON.parse(data) });
		});
	});

	res.end(JSON.stringify(translations));
};
