[![Next-Lng](https://user-images.githubusercontent.com/33988299/88075764-88832980-cb79-11ea-865c-86ce7b07c91e.png)](https://github.com/mies-co/next-extensions/tree/master/packages/next-lng)

Light and easy solution to translate your Next.js apps. 

This is a simpler alternative to [next-i18next](https://github.com/isaachinman/next-i18next).

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

## Usage in your Next.js app

### Component Translations

```js
import { withLng, useLng, getServerSideProps } from "@mies-co/next-lng";

const Greet = () => {
	const { lng, setLng, t } = useLng();
	return (
		<>
			<p>{t("greet")}</p>
			<p>{t("whoami", { firstname: "Bob" })}</p>
			<button onClick={() => setLng("en")}>EN</button>
			<button onClick={() => setLng("fr")}>FR</button>
            <p>Current language is {lng}</p>
		</>
	);
};

const HomePage = () => {
    return <Greet />;
};

export { getServerSideProps };

export default withLng(HomePage);
```

- withLng: A HOC to wrap your page with.
- useLng: A react context exposing `lng`, `setLng` and `t`.
- getServerSideProps: An async function fetches your lng API route

### API Routes Translations

Provides the translations via [API Routes](https://nextjs.org/docs/api-routes/introduction).

In **pages/api/lng.js**:

```js
export { default } from "@mies-co/next-lng";
```

- middleware: Gets your json translation files and retrieves them to `withLng` HOC.

