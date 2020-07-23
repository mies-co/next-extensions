const path = require("path");

global.examplePath = path.resolve(process.env.npm_package_testConfig_examplePath);
global.lngPath = path.resolve(global.examplePath, "public/static/translations");

const config = {
	target: "serverless",
	publicRuntimeConfig: {
		lngConfig: {
			languages: ["en", "fr"],
			cookie: {
				name: "next-lng",
				maxAge: 30 * 24 * 60 * 60,
			},
			path: global.lngPath,
			options: {
				shallow: true,
			},
		},
	},
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		config.module = {
			...config.module,
			// Critical dependency: the request of a dependency is an expression
			// Avoid warning from webpack when require has an expression.
			// Which is the case for requiring plugins dynamically.
			exprContextCritical: false,
		};

		// config.plugins.push(
		// 	// Disables warnings - "Critical dependency: the request of a dependency is an expression"
		// 	new webpack.ContextReplacementPlugin(/.*/, (data) => {
		// 		data.dependencies.forEach((element) => {
		// 			delete element.critical;
		// 		});
		// 		return data;
		// 	})
		// );

		return config;
	},
};

const { webpack, ...nextConfig } = config;
global.nexConfig = nextConfig;
global.lngConfig = nextConfig.publicRuntimeConfig.lngConfig;

module.exports = config;
