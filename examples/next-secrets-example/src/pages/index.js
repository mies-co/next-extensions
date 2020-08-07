import Link from "next/link";

import { withSecrets, getServerSideProps, useSecrets } from "@mies-co/next-secrets";

const One = (props) => {
	const { MY_SECRET } = useSecrets();
	return (
		<div>
			<p>This is page one with secret: {MY_SECRET}</p>
			<Link href="/two">
				<a>Page two</a>
			</Link>
		</div>
	);
};

export { getServerSideProps };
export default withSecrets(One);
