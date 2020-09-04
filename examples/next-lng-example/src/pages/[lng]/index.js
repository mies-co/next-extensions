import { withLng, useLng, getServerSidePropsLng, Link } from "@mies-co/next-lng";

const HomePage = props => {
	// useLng can be used anywhere in your app, it's a React context.
	const { lng, setLng, t } = useLng();

	// NB! the ids on dom elements are used only for testing purposes and can be safely deleted
	return (
		<>
			<h1>Basic example</h1>
			<h2 id="x-greet">{t("greet")}</h2>
			<p id="x-whoami">{t("whoami", { firstname: "Bob" })}</p>
			<button onClick={() => setLng("en")}>EN</button>
			<button onClick={() => setLng("fr")}>FR</button>
			<p>Current language is {lng}</p>
			<br />
			<h2>Links:</h2>
			<Link href="/legacy">
				<a>Legacy example</a>
			</Link>
			<br />
			<Link href="/scoped">
				<a>Scoped example</a>
			</Link>
			<br />
			<Link href="/[slug]" as="/with-slug">
				<a>Slug example</a>
			</Link>
		</>
	);
};

export { getServerSidePropsLng as getServerSideProps };
export default withLng(HomePage);
