import { resolve as resolveUrl } from "url";

import get from "lodash/get";
import { useRouter } from "next/router";
import nookies from "nookies";

import * as React from "react";

import lngConfig, { demoTranslations } from "./config";
import interpolate from "./utils/interpolate";
import getTranslations from "./getTranslations";

const { languages } = lngConfig;
const defaultLanguage = languages[0];

const LngContext = React.createContext({
	lng: defaultLanguage,
	setLng: () => null,
});

export const useLng = () => React.useContext(LngContext);

const withLng = (ComposedComponent, opts = {}) => {
	// TODO - with require.resolve, check if getServerSideProps is exported if missing ComposedComponent.getInitialProps
	const ComposedWithLng = (props) => {
		// _APP -> already wrapped in withLng?
		const { useLng = () => ({}) } = props;
		const { lng: _appLng, setLng: _setAppLng } = useLng();

		const router = useRouter();
		const { query = {} } = router;

		const { lng: lngQuery = query.lng, translations, translationsIncluded = [], options = {}, ...rest } = props;
		const { shallow = true, ...opts } = options;

		const [lngState, setLngState] = React.useState(lngQuery);
		const lng = lngState;

		const routePush = () => {
			if (lngState) {
				const regex = new RegExp(`^/(${languages.join("|")})`);
				const lngPath = router.asPath.replace(regex, `/${lngState}`);

				// TODO if shallow is true, get the files for all languages... On-demand is not possible yet with shallow: true.
				router.push(router.pathname, lngPath, { shallow, getServerSideProps: false });
			}
		};

		// LANGUAGE CHANGE
		// ---
		const setLng = (newLng) => {
			if (!newLng) return;

			const cookies = nookies.get();
			// COOKIES CREATION
			// ---
			if (!cookies["next-lng"] || cookies["next-lng"] !== newLng) {
				nookies.set(null, "next-lng", newLng, {
					maxAge: 30 * 24 * 60 * 60,
					path: "/",
				});
			}

			if (lngState !== newLng) {
				routePush();
				setLngState(newLng);
				// _APP -> set new language
				if (typeof _setAppLng === "function") _setAppLng(newLng);
			}
		};

		// _APP -> its lng changed, so we need ot update the lng of our page
		React.useEffect(() => {
			setLng(_appLng);
		}, [_appLng]);

		// TRANSLATE FUNCTION
		// ---
		const t = (key = "", interpolations) => {
			const keyParts = key.split(".");
			let filename = keyParts[0];
			let translationKey = key;

			// Not specifying the filename falls back to "common"
			if (!translationsIncluded.includes(filename)) filename = "common";
			else if (keyParts.length > 1) translationKey = keyParts.slice(1, keyParts.length).join(".");

			// _APP -> has a language already?
			const languageToUse = _appLng || lngState;
			const tp = `${languageToUse}.${filename}.${translationKey}`;
			let translation = get(translations, tp) || "";

			// TRANSLATION STRING INTERPOLATION
			// ---
			if (typeof interpolations === "object") {
				translation = interpolate(translation, interpolations);
			}

			return translation || "HOLAAA";
		};

		return (
			<LngContext.Provider value={{ lng, setLng, t }}>
				{/* Props are passed here because so they can be used in class Components (hooks won't work in a class) */}
				<ComposedComponent t={t} lng={lng} setLng={setLng} {...rest} />
			</LngContext.Provider>
		);
	};

	ComposedWithLng.defaultProps = {
		translations: demoTranslations,
	};

	if (ComposedComponent.getInitialProps) {
		ComposedWithLng.getInitialProps = async (ctx) => {
			let composedInitialProps = {};
			composedInitialProps = await ComposedComponent.getInitialProps(ctx);

			// Get these from the ComposedComponent's getInitialProps
			const { lng: { scope, options } = {} } = composedInitialProps;
			const { props: lngProps } = await getTranslations(scope, options)(ctx);

			return {
				...composedInitialProps,
				...lngProps,
			};
		};
	}

	return ComposedWithLng;
};

export default withLng;
