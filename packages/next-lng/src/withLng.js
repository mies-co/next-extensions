import { resolve as resolveUrl } from "url";

import get from "lodash/get";
import { useRouter } from "next/router";
import nookies from "nookies";

import * as React from "react";

import lngConfig, { demoTranslations } from "./config";
import interpolate from "./utils/interpolate";

const { languages } = lngConfig;
const defaultLanguage = languages[0];

const LngContext = React.createContext({
	lng: defaultLanguage,
	setLng: () => null,
});

export const useLng = () => React.useContext(LngContext);

const withLng = (ComposedComponent, options = {}) => {
	const ComposedWithLng = (props) => {
		const { lng: lngQuery, translations, options } = props;
		const { shallow = true } = options;

		const [lngState, setLngState] = React.useState(lngQuery);
		const lng = lngState;

		const router = useRouter();
		const { query } = router;

		// LANGUAGE CHANGE
		// ---
		const setLng = (newLng) => {
			const cookies = nookies.get();
			// COOKIES CREATION
			// ---
			if (!cookies["next-lng"] || cookies["next-lng"] !== newLng) {
				nookies.set(null, "next-lng", newLng, {
					maxAge: 30 * 24 * 60 * 60,
					path: "/",
				});
			}

			if (newLng && lngState !== newLng) setLngState(newLng);
		};

		React.useEffect(() => {
			if (lngState) {
				const regex = new RegExp(`^/(${languages.join("|")})`);
				const lngPath = router.asPath.replace(regex, `/${lngState}`);

				// TODO if shallow is true, get the files for all languages... On-demand is not possible yet with shallow: true.
				router.push(router.pathname, lngPath, { shallow, getServerSideProps: false });
			}
		}, [lngState]);

		// TRANSLATE FUNCTION
		// ---
		const t = (key, interpolations) => {
			let translation = get(translations, `${lngState}.${key}`) || "";

			// TRANSLATION STRING INTERPOLATION
			// ---
			if (typeof interpolations === "object") {
				translation = interpolate(translation, interpolations);
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

export default withLng;
