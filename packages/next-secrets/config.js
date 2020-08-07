const deepmerge = require("deepmerge");
const dotenv = require("dotenv");

const { parsed: secrets = {} } = dotenv.config();

// Adds secrets to serverRuntimeConfig
const withSecretsConfig = (customAppConfig = {}) => {
	const configWithSecrets = {
		serverRuntimeConfig: {
			secrets,
		},
	};

	return deepmerge(customAppConfig, configWithSecrets);
};

module.exports = withSecretsConfig;
exports = module.exports;
