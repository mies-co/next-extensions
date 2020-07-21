import { resolve as resolveUrl } from "url";

import get from "lodash/get";
import { useRouter } from "next/router";
import nookies from "nookies";
import * as React from "react";

import lngConfig, { demoTranslations } from "./config";

const { languages } = lngConfig;
const defaultLanguage = languages[0];

const LngContext = React.createContext({
	lng: defaultLanguage,
	setLng: () => null,
});

export const useLng = () => React.useContext(LngContext);

const withLng = (ComposedComponent, options = {}) => {
	const ComposedWithLng = (props) => {
		const { lng, translations } = props;

		const router = useRouter();
		const { query } = router;

		// LANGUAGE CHANGE
		// ---
		const setLng = (lng) => {
			const regex = new RegExp(`^/(${languages.join("|")})`);
			const lngPath = router.asPath.replace(regex, `/${lng}`);
			router.push(router.pathname, lngPath);
		};

		// TRANSLATE FUNCTION
		// ---
		const t = (key, interpolations) => {
			let translation = get(translations, `${lng}.${key}`) || "";

			// TRANSLATION STRING INTERPOLATION
			// ---
			if (typeof interpolations === "object") {
				Object.entries(interpolations).forEach(([key, val]) => {
					const regex = new RegExp(`(\{\{${key}\}\})+`, "gm");
					translation = translation.replace(regex, val);
				});
			}

			return translation;
		};

		return (
			<LngContext.Provider value={{ lng, setLng, t }}>
				<ComposedComponent />
			</LngContext.Provider>
		);
	};

	ComposedWithLng.defaultProps = {
		translations: demoTranslations,
	};

	return ComposedWithLng;
};

let previousLng = defaultLanguage;

export async function getServerSideProps(ctx) {
	let {
		req,
		query: { lng = defaultLanguage },
	} = ctx;

	// COOKIES CREATION
	// ---
	const cookies = nookies.get(ctx);
	if (!cookies["next-lng"] || cookies["next-lng"] !== lng) {
		nookies.set(ctx, "next-lng", lng, {
			maxAge: 30 * 24 * 60 * 60,
			path: "/",
		});
	}

	// DIRTY FIX - skip favicon.ico
	// ---
	// This is weird but how are we supposed to get around /favicon.ico?
	if (lng === "favicon.ico") lng = cookies["next-lng"] || previousLng;
	else previousLng = lng;

	// FETCH API ROUTE
	// ---
	const params = new URLSearchParams(
		Object.entries({
			lng,
		})
	);
	const translationsUrl = `${req.protocol || "http"}://${req.headers.host}/api/lng?${params}`;

	const data = await fetch(translationsUrl);
	const translations = await data.json();

	return {
		props: {
			lng,
			translations,
		},
	};
}

export default withLng;
