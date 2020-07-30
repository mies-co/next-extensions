import deepmerge from "deepmerge";

import getConfig from "next/config";

const {
	publicRuntimeConfig: { lngConfig: lngConfigApp = {} },
} = getConfig() || {};

const lngConfigDefault = {
	languages: ["en", "fr"],
	path: "public/static/translations",
	options: {
		apiUri: "/api/lng",
		shallow: true,
		cookie: {
			name: "next-lng",
			path: "/",
			maxAge: 30 * 24 * 60 * 60,
		},
	},
};

const lngConfig = deepmerge(lngConfigDefault, lngConfigApp);

export const demoTranslations = {
	en: {
		greet: "Hello",
		whoami: "I am {{firstname}}",
	},
	fr: {
		greet: "Bonjour",
		whoami: "Je suis {{firstname}}",
	},
};

export default lngConfig;
