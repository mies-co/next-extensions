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
