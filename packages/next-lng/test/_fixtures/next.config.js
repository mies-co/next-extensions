module.exports = {
	target: "serverless",
	publicRuntimeConfig: {
		lngConfig: {
			languages: ["en", "fr"],
			cookie: {
				name: "next-lng",
				maxAge: 30 * 24 * 60 * 60,
			},
			path: "test/_fixtures/public/static/translations",
		},
	},
};