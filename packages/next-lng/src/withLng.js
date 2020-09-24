import { resolve as resolveUrl } from "url";

import get from "lodash/get";
import { useRouter } from "next/router";
import nookies from "nookies";

import * as React from "react";

import getLngConfig, { demoTranslations } from "./lngConfig";
import interpolate from "./utils/interpolate";
import getTranslations from "./getTranslations";

const LngContext = React.createContext({
	setLng: () => null
});
export const useLng = () => React.useContext(LngContext);

const withLng = (ComposedComponent, opts = {}) => {
	const { debug = false } = opts;

	const ComposedWithLng = props => {
		// `languages` first come from getInitialProps inside _app, then lower down, they are provided by useLng
		// _APP -> already wrapped in withLng?
		const { useLng = () => ({}), languages: allLanguages } = props;
		const { lng: _appLng, setLng: _setAppLng, languages = allLanguages } = useLng();

		const router = useRouter();
		const { query = {} } = router;

		const { lng: lngQuery = query.lng, translations, translationsIncluded = [], options = {}, ...rest } = props;
		const { shallow = false, ...opts } = options;

		const [lng, _setLng] = React.useState(lngQuery);

		const routePush = newLng => {
			const regex = new RegExp(`^/(${languages.join("|")})`);
			const lngPath = router.asPath.replace(regex, `/${newLng}`);

			router.replace(router.pathname, lngPath, { shallow });
		};

		// LANGUAGE CHANGE
		// ---
		const setLng = newLng => {
			if (!newLng) return;

			const cookies = nookies.get();
			// COOKIES CREATION
			// ---
			if (!cookies["next-lng"] || cookies["next-lng"] !== newLng) {
				nookies.set(null, "next-lng", newLng, {
					maxAge: 30 * 24 * 60 * 60,
					path: "/"
				});
			}

			if (lng !== newLng) {
				_setLng(newLng);
				routePush(newLng);

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
			const splittedPrefix = key.split(":");
			const hasPrefix = splittedPrefix.length > 1;

			let filename = hasPrefix ? splittedPrefix[0] : "common";

			const keyParts = hasPrefix ? splittedPrefix[1].split(".") : key.split(".");
			let translationKey = keyParts.join(".");

			// Not specifying the filename falls back to "common"
			if (!translationsIncluded.includes(filename)) filename = "common";

			// _APP -> has a language already?
			const languageToUse = _appLng || lng;
			const tp = `${languageToUse}.${filename}.${translationKey}`;

			let translation = get(translations, tp) || "";

			// TRANSLATION STRING INTERPOLATION
			// ---
			if (typeof interpolations === "object") {
				translation = interpolate(translation, interpolations);
			}

			if (debug) {
				console.log("next-lng t debug:", {
					filename,
					translationsIncluded,
					languageToUse,
					tp,
					translation,
					interpolations
				});
			}

			return translation;
		};

		if (debug) {
			console.log("next-lng render debug:", {
				lngQuery,
				lng,
				languages,
				props
			});
		}

		return (
			<LngContext.Provider value={{ lng, setLng, t, lngDefault: languages?.[0], languages }}>
				{/* Props are passed here because so they can be used in class Components (hooks won't work in a class) */}
				<ComposedComponent t={t} lng={lng} setLng={setLng} {...rest} />
			</LngContext.Provider>
		);
	};

	ComposedWithLng.defaultProps = {
		translations: demoTranslations
	};

	if (ComposedComponent.getInitialProps) {
		ComposedWithLng.getInitialProps = async ctx => {
			let composedInitialProps = {};
			composedInitialProps = await ComposedComponent.getInitialProps(ctx);

			// Get these from the ComposedComponent's getInitialProps
			const { lng: { scope, options } = {} } = composedInitialProps;

			let lngProps = {};
			if (typeof window === "undefined") {
				({ props: lngProps } = await getTranslations(scope, options)(ctx));
			}

			const { languages } = getLngConfig();

			return {
				...composedInitialProps,
				...lngProps,
				languages
			};
		};
	}

	return ComposedWithLng;
};

export default withLng;
