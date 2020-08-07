import deepmerge from "deepmerge";
import getConfig from "next/config";

const { publicRuntimeConfig: { secretsConfig: secretsConfigApp = {} } = {} } = getConfig() || {};

const secretsConfigDefault = {
	enableCors: false,
	options: {
		apiUri: "/api/secrets",
		shallow: true,
		cors: {
			methods: ["GET"],
			// enabledOrigins: ["http://localhost:3000"],
		},
	},
};

const secretsConfig = deepmerge(secretsConfigDefault, secretsConfigApp);

export default secretsConfig;
