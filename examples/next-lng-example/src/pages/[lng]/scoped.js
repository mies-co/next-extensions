// Example of scoped translation

import { withLng, useLng, getTranslations } from "@mies-co/next-lng";

const Scoped = () => {
	// useLng can be used anywhere in your app, it's a React context.
	const { lng, setLng, t } = useLng();
	// NB! the ids on dom elements are used only for testing purposes and can be safely deleted
	return (
		<>
			<h1>Scoped example</h1>
			<h2 id="x-header-title">{t("header:title")}</h2>
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
const getServerSideProps = getTranslations(["*/common", "header"], { shallow: false });
export { getServerSideProps };

export default withLng(Scoped);
