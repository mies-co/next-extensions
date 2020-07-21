const fs = require("fs");
const path = require("path");

const withCss = require("@zeit/next-css");
const withLess = require("@zeit/next-less");
const withSass = require("@zeit/next-sass");

const AntdScssThemePlugin = require("antd-scss-theme-plugin");
const sassExtract = require("sass-extract");

const defaultAntConfig = {
	theme: "./public/static/styles/theme.scss",
};

const checkFileExists = (p) => {
	try {
		if (fs.existsSync(p)) return true;
		return false;
	} catch (err) {
		return false;
	}
};

const getAppConfigWithAnt = (customAppConfig) => {
	let appConfig = customAppConfig;

	appConfig.ant = {
		...defaultAntConfig,
		...(appConfig.ant || {}),
	};

	const { webpack: customWebpackFunctionFromApp } = appConfig;

	const styleFileExists = checkFileExists(appConfig.ant.theme);

	let renderedStyles = {};
	if (!styleFileExists) {
		console.log("\x1b[31m%s\x1b[0m", `Ant theme style file not found.\nFor next-ant to work, please create the following file: ${path.resolve(appConfig.ant.theme)}`);
	}

	if (styleFileExists) {
		renderedStyles = sassExtract.renderSync(
			{
				file: appConfig.ant.theme,
			},
			{
				plugins: [{ plugin: "sass-extract-js", options: { camelCase: true } }],
			}
		);
	}

	return withCss(
		withSass(
			withLess({
				lessLoaderOptions: {
					javascriptEnabled: true,
					// modifyVars: themeVariables, // make your antd custom effective
				},
				webpack: (config, nextConfig) => {
					const { isServer, webpack } = nextConfig;

					if (!config.plugins) config.plugins = [];

					if (styleFileExists) {
						config.plugins.push(new AntdScssThemePlugin(appConfig.ant.theme));
					}

					// Make a theme object globally available
					config.plugins.push(
						new webpack.DefinePlugin({
							theme: JSON.stringify(renderedStyles.vars || {}),
						})
					);

					if (isServer) {
						const antStyles = /antd\/.*?\/style\/css.*?/;

						// originalExternals - externals from the initial config
						const originalExternals = [...config.externals];

						config.externals = [
							(context, request, callback) => {
								if (request.match(antStyles)) return callback();

								if (typeof originalExternals[0] === "function") {
									originalExternals[0](context, request, callback);
								} else {
									callback();
								}
							},
							...(typeof originalExternals[0] === "function" ? [] : originalExternals),
						];

						config.module.rules.unshift({
							test: antStyles,
							use: "null-loader",
						});
					}

					config.module.rules = config.module.rules.reduce((acc, rule, idx) => {
						const t = String(rule.test);

						if (t.includes("scss") || t.includes("sass") || t.includes("less")) {
							if (Array.isArray(rule.use))
								rule.use = rule.use.map((u) => {
									if (u === "sass-loader" || u === "less-loader") u = AntdScssThemePlugin.themify(u);
									else if (typeof u === "object" && (u.loader === "sass-loader" || u.loader === "less-loader")) u = AntdScssThemePlugin.themify(u);
									return u;
								});
						}

						acc[idx] = rule;

						return acc;
					}, config.module.rules);

					// When next.config.js provides a webpack function in its config
					if (typeof customWebpackFunctionFromApp === "function") {
						config = customWebpackFunctionFromApp(config, nextConfig) || config;
					}

					return config;
				},
			})
		)
	);
};

const withAnt = (customAppConfig = {}) => {
	let appConfig = customAppConfig;

	const appConfigWithAnt = getAppConfigWithAnt(appConfig);

	return {
		...appConfig,
		...appConfigWithAnt,
	};
};

module.exports = withAnt;
