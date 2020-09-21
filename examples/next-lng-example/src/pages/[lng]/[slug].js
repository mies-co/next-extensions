// Example of scoped translation

import { withLng, useLng, getTranslations, getServerSidePropsLng } from "@mies-co/next-lng";
import { useRouter } from "next/router";

const Slug = () => {
	const { query } = useRouter();
	// useLng can be used anywhere in your app, it's a React context.
	const { lng, setLng, t } = useLng();
	// NB! the ids on dom elements are used only for testing purposes and can be safely deleted
	return (
		<>
			<h1>Slug example</h1>
			<h2 id="x-header-title">{t("header.title")}</h2>
			<p id="x-slug">{t(query.slug)}</p>
			<p id="x-greet">{t("greet")}</p>
			<p id="x-whoami">{t("whoami", { firstname: "Bob" })}</p>
			<button onClick={() => setLng("en")}>EN</button>
			<button onClick={() => setLng("fr")}>FR</button>
			<p>Current language is {lng}</p>
		</>
	);
};

export { getServerSidePropsLng as getServerSideProps };
export default withLng(Slug);
