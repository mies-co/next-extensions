import getConfig from "next/config";

const { serverRuntimeConfig: { secrets = {} } = {} } = getConfig() || {};

const getSecrets = async ({ url: absUrl }) => {
	const bigError = new Error(
		`\nError identified by next-secrets.\nYour API route ${absUrl} to fetch secrets might be wrong, or it matched a page that uses dynamic routing.\nThis resulted probably in the page trying to fetch itself.`
	);

	let json = {};

	// Browser, let's fetch
	if (typeof window !== "undefined") {
		const data = await fetch(absUrl, {
			headers: { "Content-Type": "application/json" },
		});

		try {
			json = await data.json();
		} catch (err) {
			console.error(bigError);
		}
	}
	// Server, just get them from serverRuntimeConfig
	else {
		json = secrets;
	}

	return json;
};

export default getSecrets;
