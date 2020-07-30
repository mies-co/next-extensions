import url from "url";
import deepmerge from "deepmerge";
import nookies from "nookies";

import lngConfig, { demoTranslations } from "./config";

const { languages, options: configOptions = {} } = lngConfig;
const defaultLanguage = languages[0];

let previousLng = defaultLanguage;

const bigError = new Error(
	"\nError identified by next-lng.\nYour API route to fetch translations might be wrong, or it matched a page that uses dynamic routing.\nThis resulted probably in the page trying to fetch itself."
);

const getServerSideProps = async (context, files, runtimeOptions = {}) => {
	const options = deepmerge(runtimeOptions, configOptions);
	let { apiUri } = options;

	let ctx = context;

	// In _app.js, it's appContext.ctx containing the ctx that we need here
	if (context.ctx) ctx = context.ctx;
	const { url: currentUrl } = ctx.req;

	// Prevent from calling itself, ending in an infinite loop
	// It can happen when using dynamic routing, and ending up with apiUri being catched all the time by this dynamic routing
	if (currentUrl === apiUri) {
		throw bigError;
	}

	const { cookie: cookieOptions } = options;

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

	// FETCH API ROUTE
	// ---
	const body = { lng };
	if (files) body.files = files;
	if (options) body.options = options;

	// Create an absolute url
	// Based on apiUrl which can be http://somewhere.com/api/something or just /api/lng
	let translationsUrl = apiUri;

	if (!translationsUrl.includes("://")) {
		if (typeof window !== "undefined") {
			translationsUrl = new URL(apiUri, document.baseURI).href;
		} else {
			const { protocol = "http", headers } = req;
			translationsUrl = url.resolve(`${req.protocol || "http"}://${req.headers.host}`, apiUri);
		}
	}

	const data = await fetch(translationsUrl, {
		method: "post",
		body: JSON.stringify(body),
		headers: { "Content-Type": "application/json" },
	});

	let json = {};
	try {
		json = await data.json();
	} catch (err) {
		console.error(bigError);
	}

	const { translations, translationsIncluded } = json;

	return {
		props: {
			lng,
			translations,
			translationsIncluded,
			options,
		},
	};
};

export default getServerSideProps;
