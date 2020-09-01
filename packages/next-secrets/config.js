const withSecretsConfig = customAppConfig => {
	const { webpack: customWebpackFunctionFromApp } = customAppConfig;

	return {
		webpack: (config, options) => {
			const { isServer } = options;

			// Fixes npm packages that depend on `fs` module
			if (!isServer) {
				config.node = {
					fs: "empty"
				};
			}

			// When next.config.js provides a webpack function in its config
			if (typeof customWebpackFunctionFromApp === "function") {
				config = customWebpackFunctionFromApp(config, options) || config;
			}

			return config;
		}
	};
};

module.exports = withSecretsConfig;
exports = module.exports;
