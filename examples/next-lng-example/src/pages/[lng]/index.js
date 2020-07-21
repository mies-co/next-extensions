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
