const path = require("path");
const withLngConfig = require("../../config");

module.exports = withLngConfig({
	target: "serverless",
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		config.module = {
			...config.module,
			// Critical dependency: the request of a dependency is an expression
			// Avoid warning from webpack when require has an expression.
			// Which is the case for requiring plugins dynamically.
			exprContextCritical: false
		};

		return config;
	}
});
