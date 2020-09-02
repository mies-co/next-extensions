const deepmerge = require("deepmerge");

const extendNextConfig = ({ webpack: webpackArgumentsX = [{}, {}], ...restX }) => customAppConfig => {
	// The configs received from next.config.js
	const { webpack: webpackFunc, ...rest } = customAppConfig;

	return {
		...deepmerge(restX, rest), // Let's keep it like that for now. Then we'll enable to merge publicRuntimeConfig etc.
		webpack: (config, options) => {
			const { isServer } = options;

			// Fixes npm packages that depend on `fs` module
			if (!isServer) {
				config.node = {
					...(config.node || {}),
					...(webpackArgumentsX[0].node || {})
				};
			}

			// When next.config.js provides a webpack function in its config
			if (typeof webpackFunc === "function") {
				config = webpackFunc(config, { ...(options || {}), ...(webpackArgumentsX[1] || {}) }) || config;
			}

			return config;
		}
	};
};

module.exports = extendNextConfig;
exports = module.exports;
