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
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		config.plugins.push(
			// Disables warnings - "Critical dependency: the request of a dependency is an expression"
			new webpack.ContextReplacementPlugin(/.*/, (data) => {
				data.dependencies.forEach((element) => {
					delete element.critical;
				});
				return data;
			})
		);

		return config;
	},
};
