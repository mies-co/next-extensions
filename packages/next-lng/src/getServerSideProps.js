import lngConfig, { demoTranslations } from "./config";
import nookies from "nookies";

const { languages, options: defaultOptions = {} } = lngConfig;
const defaultLanguage = languages[0];

let previousLng = defaultLanguage;

const getServerSideProps = async (ctx, files, options = defaultOptions) => {
	const cookies = nookies.get(ctx);
	let {
		req,
		query: { lng = cookies["next-lng"] || previousLng },
	} = ctx;

	// DIRTY FIX - skip favicon.ico
	// ---
	// This is weird but how are we supposed to get around /favicon.ico?
	if (lng === "favicon.ico") lng = cookies["next-lng"] || previousLng;
	else {
		previousLng = lng;

		// COOKIES CREATION (INITIAL)
		// ---
		if (!cookies["next-lng"]) {
			nookies.set(ctx, "next-lng", lng, {
				maxAge: 30 * 24 * 60 * 60,
				path: "/",
			});
		}
	}

	// FETCH API ROUTE
	// ---
	const body = { lng };
	if (files) body.files = files;
	if (options) body.options = options;

	const translationsUrl = `${req.protocol || "http"}://${req.headers.host}/api/lng`;

	const data = await fetch(translationsUrl, {
		method: "post",
		body: JSON.stringify(body),
		headers: { "Content-Type": "application/json" },
	});
	const { translations, translationsIncluded } = await data.json();

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
