import path from "path";
import createServer from "./_fixtures/server";

import { interpolate } from "../dist/cjs/bundle";

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

	// Before each `it` inside the next `describe`s
	beforeEach(async () => {
		// ! We close the page and create a new one each time.
		// ! To ensure that `page.goto` finished, and without using `waitUntil: "networkidle0"` because it's slower.
		if (page && page.close) await page.close();
		page = await browser.newPage(); // Ensure create new page or it will sometimes keep /en from before
	});

	after(async () => {
		if (page.close) await page.close();
		if (browser.close) await browser.close();
		if (server.close) await server.close();
	});

	describe("/", () => {
		before(async () => {
			await page.goto("http://localhost:9000/", { waitUntil: "load" });
			evaluatedPage = await page.evaluate(() => {
				return {
					basic: (document.querySelector("#x-basic") || {}).innerHTML,
				};
			});
			// const html = await page.content();
			// console.log("html", html);
		});

		it("Should redirect to /[lng]", () => {
			// TODO
		});
	});

	describe("/[lng]", () => {
		const lng = "fr";

		// Manually get translations and compare with the response from our middleware
		const common = path.resolve(global.lngPath, lng, "common.json");

		const translations = {
			common: require(common),
		};

		before(async () => {
			await page.goto(`http://localhost:9000/${lng}`, { waitUntil: "domcontentloaded" });

			evaluatedPage = await page.evaluate(() => {
				return {
					greet: (document.querySelector("#x-greet") || {}).innerHTML,
					whoami: (document.querySelector("#x-whoami") || {}).innerHTML,
				};
			});
		});

		it("Should translate", () => {
			const good = translations.common.greet;
			global.chai.expect(evaluatedPage.greet).to.be.equal(good);
		});

		it("Should translate interpolated", () => {
			const good = interpolate(translations.common.whoami, { firstname: "Bob" });
			global.chai.expect(evaluatedPage.whoami).to.be.equal(good);
		});
	});

	describe("/[lng]/example02", () => {
		const lng = "fr";

		// Manually get translations and compare with the response from our middleware
		const common = path.resolve(global.lngPath, lng, "common.json");
		const header = path.resolve(global.lngPath, lng, "header.json");

		const fr = {
			common: require(common),
			header: require(header),
		};

		before(async () => {
			await page.goto(`http://localhost:9000/${lng}/example02`, { waitUntil: "domcontentloaded" });

			evaluatedPage = await page.evaluate(() => {
				return {
					"header-title": (document.querySelector("#x-header-title") || {}).innerHTML,
					greet: (document.querySelector("#x-greet") || {}).innerHTML,
					whoami: (document.querySelector("#x-whoami") || {}).innerHTML,
				};
			});

			// const html = await page.content();
			// console.log("evaluatedPage --", html);
		});

		it("Should translate", () => {
			const good = fr.common.greet;

			global.chai.expect(evaluatedPage.greet).to.be.a("string");
			global.chai.expect(evaluatedPage.greet).to.be.equal(good);
		});

		it("Should translate interpolated", () => {
			const good = interpolate(fr.common.whoami, { firstname: "Bob" });

			global.chai.expect(evaluatedPage.whoami).to.be.a("string");
			global.chai.expect(evaluatedPage.whoami).to.be.equal(good);
		});

		it("Should translate scoped", () => {
			const good = fr.header.title;

			global.chai.expect(evaluatedPage["header-title"]).to.be.a("string");
			global.chai.expect(evaluatedPage["header-title"]).to.be.equal(good);
		});
	});
});
