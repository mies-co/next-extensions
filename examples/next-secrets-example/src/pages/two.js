import Link from "next/link";

import { withSecrets, getServerSideProps, useSecrets } from "@mies-co/next-secrets";

const Two = () => {
	const { MY_SECOND_SECRET } = useSecrets();
	return (
		<div>
			<p>This is page two with secret: {MY_SECOND_SECRET}</p>
			<Link href="/">
				<a>Page one</a>
			</Link>
		</div>
	);
};

Two.getInitialProps = () => {
	return {
		// Some random props that you would pass from getInitialProps
		hello: "world",
	};
};
export default withSecrets(Two);
