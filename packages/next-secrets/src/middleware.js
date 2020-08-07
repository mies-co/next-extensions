import getConfig from "next/config";
import cors from "cors";
import secretsConfig from "./config";

import initMiddleware from "@mies-co/next-utils/initMiddleware";

const {
	enableCors,
	options: {
		cors: { enabledOrigins, ...corsConfig },
	},
} = secretsConfig;

const initCors = (runtimeConf) => initMiddleware(cors(runtimeConf));

const { serverRuntimeConfig: { secrets = {} } = {} } = getConfig() || {};
const middleware = async (req, res) => {
	const runtimeConf = {
		...corsConfig,
		origin: function (origin, callback) {
			let fullOrigin = origin;
			if (!origin) {
				// Try with req.headers.referer (maybe serverless)
				if (!fullOrigin) {
					if (req.headers.referer) fullOrigin = req.headers.referer.slice(0, -1);
					else if (req.headers.host) fullOrigin = `http://${req.headers.host}`;
				}
			}

			if (enabledOrigins.indexOf(fullOrigin) !== -1) {
				callback(null, true);
			} else {
				callback(new Error(`Origin ${origin} is not allowed by CORS`));
			}
		},
	};
	if (enableCors) await initCors(runtimeConf)(req, res);

	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");

	res.end(JSON.stringify(secrets));
};

export default middleware;
