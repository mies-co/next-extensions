// ! If you don't need a custom _app.js page, you can safely delete this page.

import { withLng, useLng, getServerSideProps } from "@mies-co/next-lng";
import App from "next/app";

import Topbar from "../comps/Topbar";

function MyApp({ Component, pageProps, lng, t, setLng }) {
	return (
		<>
			{/* An example of a component that needs to use translations as well */}
			<Topbar />
			<Component {...pageProps} useLng={useLng} />
		</>
	);
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// More info: https://nextjs.org/docs/advanced-features/custom-app
//
MyApp.getInitialProps = async (appContext) => {
	const appProps = await App.getInitialProps(appContext);
	return {
		...appProps,
		lng: {
			// options: { shallow: false },
		},
	};
};

// You may only use withLng here in _app.js if one of its components needs translations at a higher level than pages
export default withLng(MyApp);
