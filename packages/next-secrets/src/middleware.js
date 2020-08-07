import getConfig from "next/config";

const { serverRuntimeConfig: { secrets = {} } = {} } = getConfig() || {};

const middleware = async (req, res) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");

	res.end(JSON.stringify(secrets));
};

export default middleware;
