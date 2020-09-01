import * as React from "react";
import { withSecrets } from "@mies-co/next-secrets";

const MyApp = ({ Component, pageProps }) => {
	return <Component {...pageProps} />;
};

export default withSecrets(MyApp);
