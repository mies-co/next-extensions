[![Next-Lng](https://user-images.githubusercontent.com/33988299/88075764-88832980-cb79-11ea-865c-86ce7b07c91e.png)](https://github.com/mies-co/next-extensions/tree/master/packages/next-lng)

Light and easy solution to translate your Next.js apps. 

This is a simpler alternative to [next-i18next](https://github.com/isaachinman/next-i18next).

# Table of contents

- [Example](#Example)
- [Installation](#Installation)
- [Basic translation](#Basic\ translation)
- [Scoped translation](#Scoped\ translation)

## Example

[See an example app here](https://github.com/mies-co/next-extensions/tree/master/examples/next-lng-example)

## Installation

```env
# regular NPM package install 
npm install --save @mies-co/next-lng
 
# install directly from GitHub 
npm install --save github:@mies-co/next-lng
 
# install NPM package via Yarn 
yarn add @mies-co/next-lng
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
        "@mies-co/next-lng": "latest"
    }
}
```

## Basic translation

[embedmd]:# (../../examples/next-lng-example/src/pages/[lng]/index.js)
```js
import { withLng, useLng, getServerSideProps } from "@mies-co/next-lng";

const HomePage = () => {
    // useLng can be used anywhere in your app, it's a React context.
	const { lng, setLng, t } = useLng();
    
	// NB! the ids on dom elements are used only for testing purposes and can be safely deleted
	return (
		<>
			<p id="x-greet">{t("greet")}</p>
			<p id="x-whoami">{t("whoami", { firstname: "Bob" })}</p>
			<button onClick={() => setLng("en")}>EN</button>
			<button onClick={() => setLng("fr")}>FR</button>
			<p>Current language is {lng}</p>
		</>
	);
};

export { getServerSideProps };

export default withLng(HomePage);
```

- `withLng`: A HOC to wrap your page with.
- `useLng`: A react context exposing `lng`, `setLng` and `t`.
- `getServerSideProps`: An async function fetches your lng API route

## Scoped translation

[embedmd]:# (../../examples/next-lng-example/src/pages/[lng]/scoped.js)
```js
import { withLng, useLng, getTranslations } from "@mies-co/next-lng";

const HomePage = () => {
    // useLng can be used anywhere in your app, it's a React context.
	const { lng, setLng, t } = useLng();
	// NB! the ids on dom elements are used only for testing purposes and can be safely deleted
	return (
		<>
			<h1 id="x-header-title">{t("header.title")}</h1>
			<p id="x-greet">{t("greet")}</p>
			<p id="x-whoami">{t("whoami", { firstname: "Bob" })}</p>
			<button onClick={() => setLng("en")}>EN</button>
			<button onClick={() => setLng("fr")}>FR</button>
			<p>Current language is {lng}</p>
		</>
	);
};

// Arguments:
// [0] - a string or string[] of globs
// [1] - an object that overrides the default `options` defined in next.config.js
const getServerSideProps = getTranslations(["*/common", "header"], { shallow: true });
export { getServerSideProps };

export default withLng(HomePage);
```

- `withLng`: A HOC to wrap your page with.
- `useLng`: A react context exposing `lng`, `setLng` and `t`.
- `getTranslations`: A function that passes extra arguments to the default getServerSideProps (fetching your API routes)
    - [0] A glob string or an array of glob strings that match the translations files to be fetched
    - [1] The options object overrides the options defined in your `next.config.js` file. It enables to override "per-file".


