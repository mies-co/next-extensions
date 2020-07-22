import { withLng, useLng, getTranslations } from "@mies-co/next-lng";

const Greet = () => {
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

const HomePage = () => {
	return <Greet />;
};

// Arguments:
// [0] - a string or string[] of globs
// [1] - an object that overrides the default `options` defined in next.config.js
const getServerSideProps = getTranslations(["*/common", "header"], { shallow: true });
export { getServerSideProps };

export default withLng(HomePage);
