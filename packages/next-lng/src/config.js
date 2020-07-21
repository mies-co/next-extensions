import deepmerge from "deepmerge";

import getConfig from "next/config";

const {
	publicRuntimeConfig: { lngConfig: lngConfigApp = {} },
} = getConfig() || {};

const lngConfigDefault = {
	languages: ["en", "fr"],
	cookie: {
		name: "next-lng",
		maxAge: 30 * 24 * 60 * 60,
	},
	path: "/public/static/translations",
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
