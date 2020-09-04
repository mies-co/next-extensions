import Link from "next/link";

import { useSecrets } from "@mies-co/next-secrets";

const Two = props => {
	const secrets = useSecrets("MY_SECOND_SECRET");
	const { MY_SECOND_SECRET } = secrets;

	return (
		<div>
			<p>This is page two with secret: {MY_SECOND_SECRET}</p>
			<p>Only {Object.keys(secrets).length} secrets were retrieved thanks to the filter arguments</p>
			<Link href="/">
				<a>Page one</a>
			</Link>
		</div>
	);
};

export default Two;
