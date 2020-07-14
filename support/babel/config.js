const babelConfig = {
  babelrcRoots: [".", "packages/*"],
  presets: [
    [
      "next/babel",
      {
        "transform-runtime": {
          useESModules: false,
        },
        "preset-env": {
          exclude: ["transform-classes"],
        },
      },
    ],
  ],
  plugins: [["styled-components", { ssr: true }]],
};

module.exports = babelConfig;
