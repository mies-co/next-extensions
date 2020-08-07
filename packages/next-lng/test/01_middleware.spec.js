import http from "http";
import path from "path";

import { apiResolver } from "next/dist/next-server/server/api-utils";

import middleware from "../src/middleware";
import createServer from "./_fixtures/server";

// Some nextjs api routes testing examples - https://dev.to/metamas/testing-next-js-api-routes-55g3
describe(`MIDDLEWARE`, () => {
	describe("/api/lng", () => {
		const lng = "fr";
		let server, res;

		before(async () => {
			server = http.createServer((req, res) => apiResolver(req, res, undefined, middleware));

			res = await global.chai.request(server).post("/api/lng").send({ lng, options: global.lngConfig.options });
		});

		it(`Should get translations from api routes`, async () => {
			// Manually get translations and compare with the response from our middleware
			const good = {
				translations: {
					en: {
						common: require(path.resolve(global.lngPath, "en/common.json")),
						header: require(path.resolve(global.lngPath, "en/header.json")),
					},
					fr: {
						common: require(path.resolve(global.lngPath, "fr/common.json")),
						header: require(path.resolve(global.lngPath, "fr/header.json")),
					},
				},
				translationsIncluded: ["common", "header"],
			};

			res.body.should.deep.equal(good);
		});

		after(async () => {
			await server.close();
		});
	});
});
