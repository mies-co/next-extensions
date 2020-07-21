const path = require("path");
const http = require("http");
const next = require("next");

const createServer = async ({ port = parseInt(process.env.PORT) || 9000, dev = process.env.NODE_ENV !== "production" } = {}) => {
	const app = next({ dev: false, dir: path.resolve(__dirname) });
	await app.prepare();

	const handle = app.getRequestHandler();

	const srv = await http.createServer((req, res) => {
		const parsedUrl = new URL(req.url, "http://w.w");
		handle(req, res, parsedUrl);
	});

	return new Promise((resolve, reject) => {
		resolve(srv);
	});
};

module.exports = createServer;
