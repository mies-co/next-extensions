import Link from "next/link";

import { useSecrets } from "@mies-co/next-secrets";

const Two = props => {
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

export default Two;
