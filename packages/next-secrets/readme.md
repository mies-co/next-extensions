# Next-Secrets

[![Package Quality](https://npm.packagequality.com/shield/@mies-co%2Fnext-secrets.svg)](https://packagequality.com/#?package=@mies-co/next-secrets)

Keep your secrets secret in Next.js.

## Example

[See an example app here](https://github.com/mies-co/next-extensions/tree/master/examples/next-secrets-example)

## Installation

```env
# regular NPM package install 
npm install --save @mies-co/next-secrets
 
# install directly from GitHub 
npm install --save github:@mies-co/next-secrets
 
# install NPM package via Yarn 
yarn add @mies-co/next-secrets
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
        "@mies-co/next-secrets": "latest"
    }
}
```
