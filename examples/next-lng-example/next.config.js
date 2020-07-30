module.exports = {
	basePath: "/v0",
	publicRuntimeConfig: {
		lngConfig: {
			languages: ["en", "fr"],
			//
			// Uncomment to override
			//
			// path: "public/static/translations",
			// options: {
			// 	apiUri: "/api/lng",
			// 	shallow: true,
			// 	cookie: {
			// 		name: "next-lng",
			// 		path: "/",
			// 		maxAge: 30 * 24 * 60 * 60,
			// 	},
			// },
		},
	},
};
