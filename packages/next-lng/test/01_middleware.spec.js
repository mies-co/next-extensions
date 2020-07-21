import http from "http";
import path from "path";

import { apiResolver } from "next/dist/next-server/server/api-utils";

import middleware from "../src/middleware";

const {
	publicRuntimeConfig: {
		lngConfig: { path: lngPath },
	},
} = global.nextConfig;

describe(`MIDDLEWARE`, () => {
	describe("/api/lng", () => {
		const lng = "fr";

		let server, res;
		let browser, page;

		before(async () => {
			server = http.createServer((req, res) => apiResolver(req, res, undefined, middleware));

			const params = { lng };
			res = await global.chai.request(server).get("/api/lng").query(params);
		});

		it(`rst.get translations`, async () => {
			// Manually get translations and compare with the response from our middleware
			const translationsPath = path.resolve(lngPath, `${lng}.json`);
			const translations = require(translationsPath);
			res.body.should.deep.include({ [lng]: translations });
		});

		after(async () => {
			await server.close();

			if (browser && typeof browser.close === "function") {
				await browser.close();
			}
		});
	});
});

// TODO
// describe('PAGES', () => {
//     describe('/[lng]/index.js', () => {
//         before(async () => (
//             server = http.createServer((req, res) => apiResolver(req, res, undefined, middleware));

//             browser = await global.pup.launch();
// 			page = await browser.newPage();
//         ))
//     })
// })
