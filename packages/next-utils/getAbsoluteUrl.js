const url = require("url");

const getAbsoluteUrl = ({ uri: apiUri = "", req = {} }) => {
	// Create an absolute url
	// Based on apiUrl which can be http://somewhere.com/api/something or just /api/lng
	let absUrl = apiUri;

	if (!absUrl.includes("://")) {
		if (typeof window !== "undefined") {
			absUrl = new URL(apiUri, document.baseURI).href;
		} else {
			const { headers = {} } = req;
			let base = headers.referer;
			if (!base) base = `http://${headers.host}`;
			// In AWS Lambda, the referer would not be there. Fallback to apiUri which will throw an error about using a relative URL.
			absUrl = base ? url.resolve(base, apiUri) : apiUri;
		}
	}

	return absUrl;
};

module.exports = getAbsoluteUrl;
exports = module.exports;
