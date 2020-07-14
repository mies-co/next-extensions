# Next-Ant

This extensions enables you to use ant and override its theme with a custom theme that you define using scss.

Next-Ant will get all scss variables from your theme file. It will expose a theme object globally in your app, that contains your scss variables in camelCase.

[Here is the list of default ant theme variables](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less).

## Example

[See an example app here](https://github.com/mies-co/next-extensions/tree/master/examples/next-ant-example)

## Installation

```env
# regular NPM package install 
npm install --save @mies-co/next-ant
 
# install directly from GitHub 
npm install --save github:@mies-co/next-ant
 
# install NPM package via Yarn 
yarn add @mies-co/next-ant
```

**OR USING THE GITHUB REGISTRY**

You may also create a .npmrc file at the root of your Next.js app, with the following content:

```sh
# Specifies the registraty for @mies-co packages
@mies-co:registry=https://npm.pkg.github.com/
```

Then add this in package.json:

```json
{
    "dependencies": {
        "@mies-co/next-ant": "latest"
    }
}
```

## Usage in your Next.js app

In **next.config.js**:

```js
const { withAnt } = require("@mies-co/next-ant");

module.exports = withAnt({
  ant: {
    theme: "./public/static/styles/theme.scss",
  },
});
```

### API

#### ant

- theme: The path to your scss antd variables
