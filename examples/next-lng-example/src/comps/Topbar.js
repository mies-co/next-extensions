import { useLng } from "@mies-co/next-lng";

const Topbar = props => {
	const { t, lng, setLng } = useLng();
	return (
		<>
			<div>This Topbar get its translation from _app.js: {lng}</div>
			<button onClick={() => setLng("en")}>EN</button>
			<button onClick={() => setLng("fr")}>FR</button>
		</>
	);
};

export default Topbar;
