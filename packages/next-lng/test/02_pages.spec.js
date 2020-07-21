import path from "path";
import createServer from "./_fixtures/server";

import { interpolate } from "../dist/cjs/bundle";

const {
	publicRuntimeConfig: {
		lngConfig: { path: lngPath },
	},
} = global.nextConfig;

// Good testing example - https://github.com/willianantunes/nextjs-playground/blob/master/__tests__/integration/pages/api/page-details.spec.test.js
// Browser checks using mocha - https://www.checklyhq.com/docs/browser-checks/using-mocha/
// UI testing - https://medium.com/@ankit_m/ui-testing-with-puppeteer-and-mocha-part-1-getting-started-b141b2f9e21
describe("PAGES", () => {
	let server, res;
	let browser, page;
	let evaluatedPage = {};

	before(async () => {
		server = await createServer();
		// res = await global.chai.request(server).get("/");
		await server.listen(9000);

		browser = await global.pup.launch();
		page = await browser.newPage();
	});

	describe("/", () => {
		before(async () => {
			await page.goto("http://localhost:9000", { waitUntil: "load" });

			evaluatedPage = await page.evaluate(() => {
				return {
					basic: (document.querySelector("#x-basic") || {}).innerHTML,
				};
			});
		});

		it("Should render a dom element", () => {
			global.chai.expect(evaluatedPage.basic).to.be.equal("Test Basic");
		});
	});

	describe("/[lng]", () => {
		const lng = "fr";

		// Manually get translations and compare with the response from our middleware
		const translationsPath = path.resolve(lngPath, `${lng}.json`);
		const translations = require(translationsPath);

		before(async () => {
			await page.goto(`http://localhost:9000/${lng}`, { waitUntil: "load" });

			evaluatedPage = await page.evaluate(() => {
				return {
					greet: (document.querySelector("#x-greet") || {}).innerHTML,
					whoami: (document.querySelector("#x-whoami") || {}).innerHTML,
				};
			});
		});

		it("Should translate", () => {
			const good = translations.greet;
			global.chai.expect(evaluatedPage.greet).to.be.equal(good);
		});

		it("Should translate with interpolation", () => {
			const good = interpolate(translations.whoami, { firstname: "Bob" });
			global.chai.expect(evaluatedPage.whoami).to.be.equal(good);
		});
	});

	after(async () => {
		if (browser.close) await browser.close();
		if (server.close) await server.close();
	});
});
