import deepmerge from "deepmerge";
import getConfig from "next/config";

const { publicRuntimeConfig: { secretsConfig: secretsConfigApp = {} } = {} } = getConfig() || {};

const secretsConfigDefault = {
	options: {
		apiUri: "/api/secrets",
		shallow: true,
	},
};

const secretsConfig = deepmerge(secretsConfigDefault, secretsConfigApp);

export default secretsConfig;
