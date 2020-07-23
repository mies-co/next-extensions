# Next-Styled-Components

[![Package Quality](https://npm.packagequality.com/shield/@mies-co%2Fnext-styled-components.svg)](https://packagequality.com/#?package=@mies-co/next-styled-components)

Easily use [styled-components](https://styled-components.com) with [nextjs](https://nextjs.org).

## Example

[See an example app here](https://github.com/mies-co/next-extensions/tree/master/examples/next-styled-components-example)

## Installation

```env
# regular NPM package install 
npm install --save @mies-co/next-styled-components
 
# install directly from GitHub 
npm install --save github:@mies-co/next-styled-components
 
# install NPM package via Yarn 
yarn add @mies-co/next-styled-components
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
        "@mies-co/next-styled-components": "latest"
    }
}
```

## Usage in your Next.js app

### StyledDocument

Enables the default **next-styled-components** Document.

In **pages/_document.js**:

```js
// Export StyledDocument directly, or uncomment what's below
export { StyledDocument as default } from "@mies-co/next-styled-components";
```

### withStyledDocument

Enables to customize the **next-styled-components** Document.

```js
import Document, { Html, Head, Main, NextScript } from "next/document";
import { withStyledDocument } from "@mies-co/next-styled-components";

class MyDocument extends Document {
// Uncomment if you need to merge your own getInitialProps with the one from next-styled-components
//
//  static async getInitialProps(ctx) {
//      const initialProps = await Document.getInitialProps(ctx);
//      return { ...initialProps };
//  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default withStyledDocument(MyDocument);
```

