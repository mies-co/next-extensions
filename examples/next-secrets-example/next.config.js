const withSecretsConfig = require("@mies-co/next-secrets/config");

module.exports = withSecretsConfig({
	target: "serverless",
	secretsConfig: {
		options: {
			apiUri: "/api/secrets",
			// shallow: true,
		},
	},
	// Your next config as you would usually define it
	// https://nextjs.org/docs/api-reference/next.config.js/introduction
});
