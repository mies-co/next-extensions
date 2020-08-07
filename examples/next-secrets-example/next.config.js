const withSecretsConfig = require("@mies-co/next-secrets/config");

module.exports = withSecretsConfig({
	target: "serverless",
	publicRuntimeConfig: {
		secretsConfig: {
			enableCors: true,
			options: {
				apiUri: "/api/secrets",
				// shallow: true,
				cors: {
					enabledOrigins: ["http://localhost:3000"],
				},
			},
		},
	},
	// Your next config as you would usually define it
	// https://nextjs.org/docs/api-reference/next.config.js/introduction
});
