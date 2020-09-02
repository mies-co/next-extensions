import Link from "next/link";

import { useLng } from "./withLng";

const prefixPathWithLng = ({ lng, path = "" }) => {
	if (path.startsWith("/")) path = path.substr(1);
	if (!path.startsWith(lng)) path = `/${lng}/${path}`;
	return path;
};

const CustomLink = props => {
	const { lng } = useLng();
	let { href, as, children, ...rest } = props;

	// Then it means href is the as
	if (!as) {
		as = prefixPathWithLng({ lng, path: href });
	} else {
		as = prefixPathWithLng({ lng, path: as });
	}
	href = prefixPathWithLng({ lng: "[lng]", path: href });

	return (
		<Link href={href} as={as} passHref={true} shallow={false} {...rest}>
			{children}
		</Link>
	);
};

export default CustomLink;
