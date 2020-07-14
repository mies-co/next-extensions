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
  const { main = "dist/cjs/bundle.js", globals } = modulePkg;

  const input = path.resolve(modulePath, modulePkg.input || "src/index.js");
  console.log("input --", input);
  const inputExists = checkFileExists(input);
  if (!inputExists) return null;

  const plugins = [
    babel({
      exclude: "node_modules/**",
      configFile: path.resolve(__dirname, "../babel/config"),
      runtimeHelpers: true,
    }),
    commonjs({
      exclude: [path.resolve(`packages/${name}/src/**`)],
      //   namedExports: {
      //     "react-dom": ["findDOMNode"],
      //     "react-dom/server": ["renderToStaticMarkup"],
      //     "react-is": ["isElement", "isValidElementType", "ForwardRef"],
      //   },
    }),
    filesize(),
  ];

  const config = {
    input,
    name,
    output: {
      file: path.resolve(`packages/${name}/${main}`),
      format: "cjs",
      sourcemap: process.env.NODE_ENV !== "production",
      globals,
    },
    plugins,
  };

  return config;
};

export default generateModuleConfig;
