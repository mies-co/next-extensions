// Example of legacy getInitialProps usage

import { withLng, useLng, getTranslations } from "@mies-co/next-lng";

const Legacy = (props) => {
	// useLng can be used anywhere in your app, it's a React context.
	const { lng, setLng, t } = useLng();
	// NB! the ids on dom elements are used only for testing purposes and can be safely deleted
	return (
		<>
			<h1>Legacy example</h1>
			<h2 id="x-header-title">{t("header:title")}</h2>
			<p id="x-greet">{t("greet")}</p>
			<p id="x-whoami">{t("whoami", { firstname: "Bob" })}</p>
			<button onClick={() => setLng("en")}>EN</button>
			<button onClick={() => setLng("fr")}>FR</button>
			<p>Current language is {lng}</p>
		</>
	);
};

Legacy.getInitialProps = async () => {
	return {
		// Pass a lng object that describes the scope and options to pass
		// This is only if you want to use scoped translations or customize the options. Otherwise don't even return anything.
		lng: {
			scope: ["*/common", "header"],
			options: { shallow: false },
		},
	};
};

export default withLng(Legacy);
