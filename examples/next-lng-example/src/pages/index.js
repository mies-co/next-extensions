import { useLng } from "@mies-co/next-lng";
import React from "react";
import Head from "next/head";

const Index = ({ defaultLanguage }) => {
	const { lngDefault } = useLng();

	React.useEffect(() => {
		window.location.replace(`/${lngDefault}`);
	});

	return (
		<Head>
			<meta name="robots" content="noindex, nofollow" />
		</Head>
	);
};

export default Index;
