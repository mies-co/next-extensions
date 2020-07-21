const path = require("path");
const fs = require("fs");

const commonjs = require("@rollup/plugin-commonjs");

const filesize = require("rollup-plugin-filesize");
const babel = require("rollup-plugin-babel");

const checkFileExists = (p) => {
	try {
		if (fs.existsSync(p)) return true;
		return false;
	} catch (err) {
		return false;
	}
};

const generateModuleConfig = ({ modulePkg, modulePath }) => {
	const { base: name } = path.parse(modulePath);

	const buildDir = "dist/cjs";
	const { main = `${buildDir}/bundle.js`, globals } = modulePkg;

	let output = {
		file: path.resolve(`packages/${name}/${main}`),
		format: "cjs",
		sourcemap: process.env.NODE_ENV !== "production",
		globals,
	};

	// Defining a single input will result in a single bundle
	let input = path.resolve(modulePath, modulePkg.input || "src/index.js");
	const inputExists = checkFileExists(input);

	// Defining inputs will result in chunks
	if (modulePkg.inputs) {
		// Must set output.dir instead of output.file when using named inputs
		delete output.file;
		output.dir = path.resolve(`packages/${name}/${buildDir}`);

		input = modulePkg.inputs.reduce((acc, curr) => {
			let { name: inputName } = path.parse(curr);
			if (curr === "src/index.js") inputName = "bundle";

			acc[inputName] = path.resolve(modulePath, curr);
			return acc;
		}, {});
	}

	if (!inputExists) return null;

	const plugins = [
		babel({
			exclude: "node_modules/**",
			configFile: path.resolve(__dirname, "../babel/config"),
			runtimeHelpers: true,
		}),
		commonjs({
			exclude: [path.resolve(`packages/${name}/src/**`)],
		}),
		filesize(),
	];

	const config = {
		input,
		name,
		output,
		plugins,
		// external: ["fs"],
	};

	return config;
};

export default generateModuleConfig;
