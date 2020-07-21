import path from "path";
import glob from "glob";

import generateModuleConfig from "./generateModuleConfig";

const pkg = require(path.resolve("./package.json"));
const { workspaces = [] } = pkg;
let modulePaths = [];

workspaces.forEach((workspace) => {
	const globArray = glob(path.resolve(workspace), { mark: false, sync: true });
	modulePaths = modulePaths.concat(globArray);
});

const configurations = modulePaths
	.map((modulePath) =>
		generateModuleConfig({
			modulePkg: require(`${modulePath}/package.json`),
			modulePath: modulePath,
		})
	)
	.filter(Boolean);

console.log("configurations --", configurations);

export default configurations;
