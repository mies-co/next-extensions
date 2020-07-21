import { withLng, useLng, getServerSideProps } from "../../../../dist/cjs/bundle";

const Greet = () => {
	const { lng, setLng, t } = useLng();
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

const HomePage = () => {
	return <Greet />;
};

export { getServerSideProps };

export default withLng(HomePage);
