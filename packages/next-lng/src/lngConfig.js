import deepmerge from "deepmerge";
import _ from "lodash";
import getConfig from "next/config";

const getLngConfig = () => {
	const lngConfigApp = _.pickBy(
		{
			languages: (process.env.LNG_LANGUAGES || "").split(",").filter(Boolean),
			path: process.env.LNG_PATH,
			options: {
				shallow: Boolean(process.env.LNG_SHALLOW || "false"),
				cookie: _.pickBy(
					{
						name: process.env.LNG_COOKIE_NAME,
						path: process.env.LNG_COOKIE_PATH,
						maxAge: process.env.LNG_COOKIE_MAX_AGE
					},
					v => typeof v !== "undefined"
				)
			}
		},
		v => typeof v !== "undefined"
	);

	const lngConfigDefault = {
		languages: ["en"],
		path: "public/static/translations",
		options: {
			shallow: false,
			cookie: {
				name: "next-lng",
				path: "/",
				maxAge: 30 * 24 * 60 * 60
			}
		}
	};

	return deepmerge(lngConfigDefault, lngConfigApp, { arrayMerge: (a, b) => _.union(a, b) });
};

export const demoTranslations = {
	en: {
		greet: "Hello",
		whoami: "I am {{firstname}}"
	},
	fr: {
		greet: "Bonjour",
		whoami: "Je suis {{firstname}}"
	}
};

export default getLngConfig;
